import { AppError, Definition, ServiceArea } from "../../public";
import { App, error, MonetaryValue, SystemErrorCode, _internal } from "../common";
import { Packaging } from "./packaging";
import { v4 } from "uuid";

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
  catch (originalError: unknown) {
    // Check for a currency mismatch, and throw a more specific error message
    if ((originalError as AppError).code === SystemErrorCode.CurrencyMismatch) {
      throw error(
        SystemErrorCode.CurrencyMismatch,
        "All packages in a shipment must be insured in the same currency.",
        { originalError }
      );
    }

    throw originalError;
  }
}

/**
 * A `Packaging` object can be either a definition in the App or a custom one that the 
 * user sends through the platform to the app, in that case we create a temporary `Packaging` 
 * object whose code is set to `custom`.
 */
export function setPackaging(app: App, packaging?: string | Definition): Packaging | undefined {
  let pkg;

  try {
    pkg = app[_internal].references.lookup(packaging, Packaging);
  } catch {
    if (typeof packaging === "string") {
      pkg = new Packaging(
        {
          id: v4(),
          name: packaging,
          description: packaging,
          code: "custom"
        }
      );
    }
  }

  return pkg;
}