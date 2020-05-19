import { DeliveryConfirmationType, InlineOrReference, LocalizationDefinition, LocalizationPOJO, LocalizedInfoPOJO } from "../common";
import { DefinitionIdentifierPOJO } from "../common/internal";

/**
 * A delivery confirmation option offered by a carrier
 */
export interface DeliveryConfirmationPOJO extends DeliveryConfirmationDefinition {
  localization?: LocalizationPOJO<LocalizedInfoPOJO>;
}


/**
 * Identifies a delivery confirmation option offered by a carrier
 */
export type DeliveryConfirmationIdentifierPOJO = DefinitionIdentifierPOJO;


/**
 * A delivery confirmation option offered by a carrier
 */
export interface DeliveryConfirmationDefinition extends DefinitionIdentifierPOJO {
  /**
   * The user-friendly name for this delivery confirmation (e.g. "Adult Signature", "Authority to Leave")
   */
  name: string;

  /**
   * A short, user-friendly description of the delivery confirmation type
   */
  description?: string;

  /**
   * The type of confirmation
   */
  type: DeliveryConfirmationType;

  /**
   * Localizaed values for fields that allow localization
   */
  localization?: InlineOrReference<LocalizationDefinition<{
    name?: string;
    description?: string;
  }>>;
}
