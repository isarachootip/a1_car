import assert from "node:assert/strict";
import { listBranchesWithStaff } from "../src/lib/repositories/branchRepository";
import {
  createHandoverOrder,
  getHandoverOrderById,
  updatePickupOrderData,
  addOrderPhoto,
  recordOrderSignature,
} from "../src/lib/repositories/handoverRepository";

export async function runRepositoryIntegrationTests(): Promise<void> {
  console.log("Running Repository & State Lock Integration Tests...");

  const branches = await listBranchesWithStaff();
  assert.ok(branches.length > 0, "Expected seeded branches");
  const branch = branches[0];
  const staff = branch.staff[0];
  assert.ok(staff, "Expected seeded staff in branch");

  const created = await createHandoverOrder({
    branchId: branch.id,
    staffId: staff.id,
    customerName: "คุณทดสอบ ระบบดี",
    customerPhone: "089-111-2233",
    vehicleBrandModel: "Toyota Yaris Ativ",
    licensePlate: "1กข 9999 กรุงเทพมหานคร",
    vehicleColor: "ขาว",
    pickupMileage: 25400,
    pickupFuelLevel: "3/4",
  });

  assert.ok(created.docNumber.startsWith("PU-"), "Expected PU-XXXX docNumber");
  assert.equal(created.status, "DRAFT_PICKUP");

  // Update pickup details + damage marks
  const updated = await updatePickupOrderData(created.id, {
    serviceStandard: true,
    serviceOilFluid: true,
    serviceAdditionalNote: "เช็กลมยางและเสียงเบรกหน้า",
    invOtherValuables: "บัตร EasyPass 1 ใบ",
    damageMarks: [
      {
        phase: "PICKUP",
        zone: "FRONT",
        type: "R",
        posX: 45,
        posY: 30,
        note: "รอยขีดข่วนกันชนหน้า",
      },
    ],
  });
  assert.equal(updated.serviceStandard, true);
  assert.equal(updated.damageMarks.length, 1);

  // Add 5 required photos for PICKUP
  for (const category of [
    "FRONT",
    "REAR",
    "LEFT",
    "RIGHT",
    "DASHBOARD",
  ] as const) {
    await addOrderPhoto(created.id, {
      phase: "PICKUP",
      category,
      fileUrl: "data:image/jpeg;base64,/9j/4AAQSkZJRg==",
      caption: `มุม ${category}`,
    });
  }

  // Staff signs pickup
  await recordOrderSignature(created.id, {
    phase: "PICKUP",
    role: "STAFF",
    signerName: staff.name,
    signatureDataUrl: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUg==",
  });

  // Customer signs pickup -> Locks pickup!
  const afterPickupLocked = await recordOrderSignature(created.id, {
    phase: "PICKUP",
    role: "CUSTOMER",
    signerName: "คุณทดสอบ ระบบดี",
    signatureDataUrl: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUg==",
  });

  assert.equal(afterPickupLocked.status, "PICKED_UP_LOCKED");

  const fetched = await getHandoverOrderById(created.id);
  assert.ok(fetched);
  assert.equal(fetched.photos.length, 5);

  console.log("✅ All Repository & State Lock Integration Tests Passed!");
}
