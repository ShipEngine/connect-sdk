import { assert } from "../../assert";
import { LabelConfirmationConfig } from "../../config/label-confirmation-config";

/**
 * Confirms the successful creation of a shipping label
 */
export class LabelConfirmation {

  // TODO: NOT IMPLEMENTED YET

  /**
   * Creates a LabelConfirmation from a config object
   */
  public constructor(config: LabelConfirmationConfig) {
    assert.type.object(config, "label confirmation");

    // Prevent modifications after validation
    Object.freeze(this);
  }
}
