import assert from "node:assert/strict";
import {
  canEditPickupSection,
  canEditDeliverySection,
  getMissingRequiredPhotoCategories,
  verifyCustomerPhoneLast4,
  computeNextOrderStatusAfterSign,
} from "../src/lib/domain/handoverRules";
import { formatDocumentNumber } from "../src/lib/domain/docNumber";

export function runHandoverDomainTests(): void {
  console.log("Running Handover Domain & State Machine Tests...");

  // 1. Document Number Formatting
  assert.equal(formatDocumentNumber(2026, 1), "PU-2026-0001");
  assert.equal(formatDocumentNumber(2026, 42), "PU-2026-0042");
  assert.equal(formatDocumentNumber(2026, 1234), "PU-2026-1234");

  // 2. State Locking Rules
  assert.equal(canEditPickupSection("DRAFT_PICKUP"), true);
  assert.equal(canEditPickupSection("PICKED_UP_LOCKED"), false);
  assert.equal(canEditPickupSection("COMPLETED"), false);

  assert.equal(canEditDeliverySection("DRAFT_PICKUP"), false);
  assert.equal(canEditDeliverySection("PICKED_UP_LOCKED"), true);
  assert.equal(canEditDeliverySection("COMPLETED"), false);

  // 3. Required Photo Categories (5 mandatory angles for PICKUP)
  const partialPhotos = [
    { phase: "PICKUP" as const, category: "FRONT" as const },
    { phase: "PICKUP" as const, category: "REAR" as const },
  ];
  const missing = getMissingRequiredPhotoCategories(partialPhotos, "PICKUP");
  assert.deepEqual(missing, ["LEFT", "RIGHT", "DASHBOARD"]);

  const completePhotos = [
    { phase: "PICKUP" as const, category: "FRONT" as const },
    { phase: "PICKUP" as const, category: "REAR" as const },
    { phase: "PICKUP" as const, category: "LEFT" as const },
    { phase: "PICKUP" as const, category: "RIGHT" as const },
    { phase: "PICKUP" as const, category: "DASHBOARD" as const },
  ];
  assert.deepEqual(getMissingRequiredPhotoCategories(completePhotos, "PICKUP"), []);

  // 4. Customer 4-Digit Phone Verification
  assert.equal(verifyCustomerPhoneLast4("081-234-5678", "5678"), true);
  assert.equal(verifyCustomerPhoneLast4("081 234 5678", "5678"), true);
  assert.equal(verifyCustomerPhoneLast4("0812345678", "9999"), false);
  assert.equal(verifyCustomerPhoneLast4("0812345678", "678"), false);

  // 5. State Transition after Signatures
  assert.equal(
    computeNextOrderStatusAfterSign({
      currentStatus: "DRAFT_PICKUP",
      hasPickupStaffSig: true,
      hasPickupCustomerSig: false,
      hasDeliveryStaffSig: false,
      hasDeliveryCustomerSig: false,
    }),
    "DRAFT_PICKUP"
  );

  // Once customer signs pickup, it locks pickup immediately
  assert.equal(
    computeNextOrderStatusAfterSign({
      currentStatus: "DRAFT_PICKUP",
      hasPickupStaffSig: true,
      hasPickupCustomerSig: true,
      hasDeliveryStaffSig: false,
      hasDeliveryCustomerSig: false,
    }),
    "PICKED_UP_LOCKED"
  );

  // Once customer signs delivery, it locks entire document as COMPLETED
  assert.equal(
    computeNextOrderStatusAfterSign({
      currentStatus: "PICKED_UP_LOCKED",
      hasPickupStaffSig: true,
      hasPickupCustomerSig: true,
      hasDeliveryStaffSig: true,
      hasDeliveryCustomerSig: true,
    }),
    "COMPLETED"
  );

  console.log("✅ All Handover Domain & State Machine Tests Passed!");
}
