import { Charge } from "../charge";
import { ErrorCode, ShipEngineError } from "../errors";
import { MonetaryValue } from "../measures/monetary-value";
import { Note, NotePOJO } from "../note";
import { error } from "./utils";


/**
 * Normalizes any form of notes as an array of Note objects
 */
export function createNotes(notes?: string | ReadonlyArray<string | NotePOJO>): Note[] {
  if (!notes) {
    return [];
  }
  else if (typeof notes === "string") {
    notes = [notes];
  }

  return notes.map((note) => new Note(note));
}


/**
 * Calculates the total of an array of charges
 * @internal
 */
export function calculateTotalCharges(charges: ReadonlyArray<Charge>): MonetaryValue {
  try {
    let insuredValues = charges.map((charge) => charge.amount);
    return MonetaryValue.sum(insuredValues);
  }
  catch (originalError) {
    // Check for a currency mismatch, and throw a more specific error message
    if ((originalError as ShipEngineError).code === ErrorCode.CurrencyMismatch) {
      throw error(
        ErrorCode.CurrencyMismatch,
        "All charges must be in the same currency.",
        { originalError }
      );
    }

    throw originalError;
  }
}
