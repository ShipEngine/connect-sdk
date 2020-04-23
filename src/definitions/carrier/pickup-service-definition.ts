import { UUID } from "../../types";

/**
 * A package pickup service that is offered by a shipping provider
 */
export interface PickupServiceDefinition {
  /**
   * A UUID that uniquely identifies the pickup service.
   * This ID should never change, even if the service name changes.
   */
  id: UUID;

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
