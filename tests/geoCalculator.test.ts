import assert from "node:assert/strict";
import {
  BRANCH_COORDINATES,
  buildGoogleMapsCoordUrl,
  calculateDistanceKm,
  evaluateBranchDistance,
  extractCoordinatesFromText,
} from "../src/lib/domain/geoCalculator";
import { AUTO1_BRANCH_CATALOG } from "../src/lib/data/auto1BranchCatalog";

export function runGeoCalculatorTests(): void {
  console.log("Running Geo Calculator & Branch Distance Tests...");

  // 1. Format Google Maps Coordinate URL
  assert.equal(
    buildGoogleMapsCoordUrl(13.689999, 100.534444),
    "https://www.google.com/maps?q=13.689999,100.534444"
  );

  // 2. Extract coordinates from various Google Maps URLs or text
  const fromQueryUrl = extractCoordinatesFromText(
    "https://www.google.com/maps?q=13.689999,100.534444"
  );
  assert.deepEqual(fromQueryUrl, { lat: 13.689999, lng: 100.534444 });

  const fromAtUrl = extractCoordinatesFromText(
    "https://www.google.com/maps/place/Central/@13.6682,100.6345,17z"
  );
  assert.deepEqual(fromAtUrl, { lat: 13.6682, lng: 100.6345 });

  assert.equal(extractCoordinatesFromText("ไม่มีพิกัด"), null);

  // 3. Distance & 20km Fee Rule Evaluation
  // Rama 3 branch is around (13.6969, 100.5389)
  const nearDistance = calculateDistanceKm(13.6969, 100.5389, 13.71, 100.55);
  assert.ok(nearDistance > 1 && nearDistance < 10);

  const nearEval = evaluateBranchDistance("BKK-RAMA3", 13.71, 100.55);
  assert.ok(nearEval);
  assert.equal(nearEval.isOver20Km, false);
  assert.equal(nearEval.extraKm, 0);

  // Far point (~35 km away)
  const farEval = evaluateBranchDistance("BKK-RAMA3", 13.99, 100.62);
  assert.ok(farEval);
  assert.equal(farEval.isOver20Km, true);
  assert.ok(farEval.extraKm > 0);

  // 4. Verify Nationwide AUTO1 Branch Catalog & Staff Demo Data
  assert.ok(
    AUTO1_BRANCH_CATALOG.length >= 75,
    `Expected at least 75 AUTO1 branches, got ${AUTO1_BRANCH_CATALOG.length}`
  );
  for (const b of AUTO1_BRANCH_CATALOG) {
    assert.ok(b.staff.length >= 3, `Branch ${b.code} must have at least 3 demo staff`);
    assert.ok(BRANCH_COORDINATES[b.code], `Branch ${b.code} must have coordinates`);
  }

  // Test regional branch distance calculation (e.g. Central Khon Kaen)
  const kknNear = evaluateBranchDistance("KKN-CEN-KHONKAEN", 16.44, 102.83);
  assert.ok(kknNear);
  assert.equal(kknNear.isOver20Km, false);

  console.log("✅ All Geo Calculator & Branch Distance Tests Passed!");
}
