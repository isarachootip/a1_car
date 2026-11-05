import { runHandoverDomainTests } from "./handoverRules.test";
import { runGeoCalculatorTests } from "./geoCalculator.test";
import { runRepositoryIntegrationTests } from "./repository.test";

async function main(): Promise<void> {
  try {
    runHandoverDomainTests();
    runGeoCalculatorTests();
    await runRepositoryIntegrationTests();
    console.log("🎉 ALL TESTS PASSED!");
  } catch (error) {
    console.error("❌ TEST SUITE FAILED:", error);
    process.exit(1);
  }
}

main();
