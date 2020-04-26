import { ServiceArea } from "../../enums";
import { error, ErrorCode, ShipEngineError } from "../../errors";
import { MonetaryValue } from "../common";
import { ShippingCharge } from "./labels/shipping-charge";

/**
 * Returns the widest service area of the given values
 */
export function getMaxServiceArea(things: ReadonlyArray<{ serviceArea?: ServiceArea }>): ServiceArea {
  let maxArea = 0;
  let serviceAreas = [
    ServiceArea.Regional,
    ServiceArea.Domestic,
    ServiceArea.International,
    ServiceArea.Global,
  ];

  // Find the broadest service area supported by this provider
  for (let thing of things) {
    if (thing.serviceArea === ServiceArea.Global) {
      // This is the widest possible service area, so no need to continue crawling.
      return ServiceArea.Global;
    }
    else if (thing.serviceArea) {
      let area = serviceAreas.indexOf(thing.serviceArea);
      if (area > maxArea) {
        maxArea = area;
      }
    }
  }

  return serviceAreas[maxArea];
}

/**
 * Calculates the total insurance amount for the shipment,
 * which is the sum of the insured value of all packages.
 */
export function calculateTotalCharges(charges: ReadonlyArray<ShippingCharge>): MonetaryValue {
  try {
    let insuredValues = charges.map((charge) => charge.amount);
    return MonetaryValue.sum(insuredValues);
  }
  catch (originalError) {
    // Check for a currency mismatch, and throw a more specific error message
    if ((originalError as ShipEngineError).code === ErrorCode.CurrencyMismatch) {
      throw error(
        ErrorCode.CurrencyMismatch, "All charges must be in the same currency.", { originalError }
      );
    }

    throw originalError;
  }
}
