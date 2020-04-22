import { DeliveryConfirmationClass } from "../enums";
import { UUID } from "../types";

/**
 * Delivery confirmation options offered by a shipping provider
 */
export interface DeliveryConfirmationConfig {
  /**
   * A UUID that uniquely identifies the delivery confirmation type.
   * This ID should never change, even if the name changes.
   */
  id: UUID;

  /**
   * The user-friendly name for this delivery confirmation (e.g. "Adult Signature", "Authority to Leave")
   */
  name: string;

  /**
   * A short, user-friendly description of the delivery confirmation type
   */
  description?: string;

  /**
   * The class of confirmation
   */
  class: DeliveryConfirmationClass;
}
