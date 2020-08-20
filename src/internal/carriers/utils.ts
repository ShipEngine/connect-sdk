import { ErrorCode, ServiceArea, AppError } from "../../public";
import { error, MonetaryValue } from "../common";


/**
 * Returns the widest service area of the given values
 *
 */
export function getMaxServiceArea(things: ReadonlyArray<{ serviceArea?: ServiceArea }>): ServiceArea {
  let maxArea = 0;
  const serviceAreas = [
    ServiceArea.Regional,
    ServiceArea.Domestic,
    ServiceArea.International,
    ServiceArea.Global,
  ];

  // Find the broadest service area supported by this carrier
  for (const thing of things) {
    if (thing.serviceArea === ServiceArea.Global) {
      // This is the widest possible service area, so no need to continue crawling.
      return ServiceArea.Global;
    }
    else if (thing.serviceArea) {
      const area = serviceAreas.indexOf(thing.serviceArea);
      if (area > maxArea) {
        maxArea = area;
      }
    }
  }

  return serviceAreas[maxArea];
}


export function calculateTotalInsuranceAmount(packages: ReadonlyArray<{ insuredValue: MonetaryValue }>): MonetaryValue;
export function calculateTotalInsuranceAmount(packages: ReadonlyArray<{ insuredValue?: MonetaryValue }>): MonetaryValue | undefined;

/**
 * Calculates the total insurance amount for the shipment,
 * which is the sum of the insured value of all packages.
 */
export function calculateTotalInsuranceAmount(packages: ReadonlyArray<{ insuredValue?: MonetaryValue }>): MonetaryValue | undefined {
  try {
    const insuredValues = packages.map((parcel) => parcel.insuredValue).filter(Boolean) as MonetaryValue[];
    if (insuredValues.length > 0) {
      return MonetaryValue.sum(insuredValues);
    }
  }
  catch (originalError) {
    // Check for a currency mismatch, and throw a more specific error message
    if ((originalError as AppError).code === ErrorCode.CurrencyMismatch) {
      throw error(
        ErrorCode.CurrencyMismatch,
        "All packages in a shipment must be insured in the same currency.",
        { originalError }
      );
    }

    throw originalError;
  }
}
