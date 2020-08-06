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

  /**
   * Indicates whether the carrier provides a sandbox/development API for this pickup service.
   * A sandbox should mimic real functionality as much as possible but MUST NOT incur any actual
   * costs or affect production data.
   */
  hasSandbox?: boolean;
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

  /**
   * Indicates whether the carrier provides a sandbox/development API for this pickup service.
   * A sandbox should mimic real functionality as much as possible but MUST NOT incur any actual
   * costs or affect production data.
   */
  readonly hasSandbox: boolean;
}
