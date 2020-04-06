import { InlineOrReference, UUID } from "../types";
import { CarrierConfig } from "./carrier-config";

/**
 * A package pickup service that is offered by a shipping provider
 */
export interface PickupServiceConfig {
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
   * The carrier that provides this service
   */
  carrier: InlineOrReference<CarrierConfig>;
}
