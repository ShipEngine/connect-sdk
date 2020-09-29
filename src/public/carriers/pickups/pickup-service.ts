import type { Definition, DefinitionIdentifier } from "../../common";

/**
 * A package pickup service that is offered by a carrier
 */
export interface PickupServiceDefinition extends Definition {
  /**
   * The user-friendly service name (e.g. "One-Time Pickup", "Recurring Pickup", "Drop-Off")
   */
  name: string;

  /**
   * A short, user-friendly description of the service
   */
  description?: string;
}


/**
 * Identifies a pickup service that is offered by a carrier
 */
export type PickupServiceIdentifier = DefinitionIdentifier;


/**
 * A package pickup service that is offered by a carrier
 */
export interface PickupService extends PickupServiceIdentifier {
  /**
   * The user-friendly service name (e.g. "One-Time Pickup", "Recurring Pickup", "Drop-Off")
   */
  readonly name: string;

  /**
   * A short, user-friendly description of the service
   */
  readonly description: string;
}
