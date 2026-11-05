import assert from "node:assert/strict";
import {
  canEditPickupSection,
  canEditDeliverySection,
  getMissingRequiredPhotoCategories,
  verifyCustomerPhoneLast4,
  computeNextOrderStatusAfterSign,
  buildGoogleMapsSearchUrl,
  formatTelHref,
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

  // 6. On-Site Mobile Helpers (Google Maps URL & Tel Link)
  assert.equal(
    buildGoogleMapsSearchUrl("หมู่บ้านลัดดารมย์ พระราม 3", "https://maps.app.goo.gl/abc"),
    "https://maps.app.goo.gl/abc"
  );
  assert.equal(
    buildGoogleMapsSearchUrl("คอนโดศุภาลัย พระราม 3", ""),
    "https://www.google.com/maps/search/?api=1&query=%E0%B8%84%E0%B8%AD%E0%B8%99%E0%B9%82%E0%B8%94%E0%B8%A8%E0%B8%B8%E0%B8%A0%E0%B8%B2%E0%B8%A5%E0%B8%B1%E0%B8%A2%20%E0%B8%9E%E0%B8%A3%E0%B8%B0%E0%B8%A3%E0%B8%B2%E0%B8%A1%203"
  );
  assert.equal(formatTelHref("081-234-5678"), "tel:0812345678");

  console.log("✅ All Handover Domain & State Machine Tests Passed!");
}
