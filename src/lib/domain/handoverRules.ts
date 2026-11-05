import {
  HandoverPhase,
  OrderStatus,
  PhotoCategory,
  REQUIRED_PHOTO_CATEGORIES,
} from "../types/handover";

export function canEditPickupSection(status: OrderStatus): boolean {
  return status === "DRAFT_PICKUP";
}

export function canEditDeliverySection(status: OrderStatus): boolean {
  return status === "PICKED_UP_LOCKED";
}

export function getMissingRequiredPhotoCategories(
  photos: ReadonlyArray<{ phase: HandoverPhase; category: PhotoCategory }>,
  phase: HandoverPhase
): PhotoCategory[] {
  const existing = new Set(
    photos.filter((p) => p.phase === phase).map((p) => p.category)
  );
  return REQUIRED_PHOTO_CATEGORIES.filter((cat) => !existing.has(cat));
}

export function verifyCustomerPhoneLast4(
  fullPhone: string,
  inputLast4: string
): boolean {
  const digitsOnly = fullPhone.replace(/\D/g, "");
  const cleanInput = inputLast4.trim();
  if (cleanInput.length !== 4 || digitsOnly.length < 4) {
    return false;
  }
  return digitsOnly.slice(-4) === cleanInput;
}

export interface SignatureStateInput {
  currentStatus: OrderStatus;
  hasPickupStaffSig: boolean;
  hasPickupCustomerSig: boolean;
  hasDeliveryStaffSig: boolean;
  hasDeliveryCustomerSig: boolean;
}

export function computeNextOrderStatusAfterSign(
  input: SignatureStateInput
): OrderStatus {
  if (input.hasDeliveryCustomerSig && input.hasPickupCustomerSig) {
    return "COMPLETED";
  }
  if (input.hasPickupCustomerSig) {
    return "PICKED_UP_LOCKED";
  }
  return input.currentStatus;
}
