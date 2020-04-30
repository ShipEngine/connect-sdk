import { DeliveryConfirmationClass } from "../../enums";
import { InlineOrReference, UUID } from "../../types";
import { LocalizationDefinition } from "../common/localization-definition";

/**
 * Delivery confirmation options offered by a carrier
 */
export interface DeliveryConfirmationDefinition {
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

  /**
   * Localizaed values for fields that allow localization
   */
  localization?: InlineOrReference<LocalizationDefinition<{
    name?: string;
    description?: string;
  }>>;
}
