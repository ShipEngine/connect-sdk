import { InlineOrReference, LocalizationDefinition, LocalizationPOJO, LocalizedInfoPOJO } from "../../common";
import { DefinitionIdentifierPOJO } from "../../common/internal";

/**
 * A package pickup service that is offered by a carrier
 */
export interface PickupServicePOJO extends PickupServiceDefinition {
  localization?: LocalizationPOJO<LocalizedInfoPOJO>;
}


/**
 * Identifies a pickup service that is offered by a carrier
 */
export type PickupServiceIdentifierPOJO = DefinitionIdentifierPOJO;


/**
 * A package pickup service that is offered by a carrier
 */
export interface PickupServiceDefinition extends DefinitionIdentifierPOJO {
  /**
   * The user-friendly service name (e.g. "One-Time Pickup", "Recurring Pickup", "Drop-Off")
   */
  name: string;

  /**
   * A short, user-friendly description of the service
   */
  description?: string;

  /**
   * Indicates whether the carrier provides a sandbox/development API for this pickup service.
   * A sandbox should mimic real functionality as much as possible but MUST NOT incur any actual
   * costs or affect production data.
   */
  hasSandbox?: boolean;

  /**
   * Localizaed values for fields that allow localization
   */
  localization?: InlineOrReference<LocalizationDefinition<{
    name?: string;
    description?: string;
  }>>;
}
