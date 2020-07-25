import type { DefinitionIdentifier, DefinitionIdentifierPOJO, DeliveryConfirmationType, InlineOrReference } from "../common";


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

}


/**
 * A delivery confirmation option offered by a carrier
 */
export type DeliveryConfirmationPOJO = DeliveryConfirmationDefinition;


/**
 * Identifies a delivery confirmation option offered by a carrier
 */
export type DeliveryConfirmationIdentifierPOJO = DefinitionIdentifierPOJO;


/**
 * Identifies a delivery confirmation option offered by a carrier
 */
export type DeliveryConfirmationIdentifier = DefinitionIdentifier;


/**
 * Delivery confirmation options offered by a carrier
 */
export interface DeliveryConfirmation extends DefinitionIdentifier {
  /**
   * The user-friendly name for this delivery confirmation (e.g. "Adult Signature", "Authority to Leave")
   */
  readonly name: string;

  /**
   * A short, user-friendly description of the delivery confirmation type
   */
  readonly description: string;

  /**
   * The type of confirmation
   */
  type: DeliveryConfirmationType;
}
