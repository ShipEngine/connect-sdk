import type { DefinitionIdentifier, DefinitionIdentifierPOJO, InlineOrReference, Localizable, LocalizationDefinition, LocalizationPOJO, LocalizedInfoPOJO } from "../../common";


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
 * Identifies a pickup service that is offered by a carrier
 */
export type PickupServiceIdentifier = DefinitionIdentifier;


/**
 * A package pickup service that is offered by a carrier
 */
export interface PickupService extends DefinitionIdentifier, Localizable<PickupService, PickupServicePOJO> {
  /**
   * The user-friendly service name (e.g. "One-Time Pickup", "Recurring Pickup", "Drop-Off")
   */
  readonly name: string;

  /**
   * A short, user-friendly description of the service
   */
  readonly description: string;

  /**
   * Indicates whether the carrier provides a sandbox/development API for this pickup service.
   * A sandbox should mimic real functionality as much as possible but MUST NOT incur any actual
   * costs or affect production data.
   */
  readonly hasSandbox: boolean;
}
