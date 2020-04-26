import { InlineOrReference, InlineOrReferenceArray, UrlString, UUID } from "../../types";
import { LogoDefinition } from "../common/logo-definition";
import { DeliveryServiceDefinition } from "./delivery-service-definition";
import { PickupServiceDefinition } from "./pickup-service-definition";

/**
 * A carrier that provides delivery services
 */
export interface CarrierDefinition {
  /**
   * A UUID that uniquely identifies the carrier.
   * This ID should never change, even if the carrier name changes.
   */
  id: UUID;

  /**
   * The user-friendly carrier name (e.g. "FedEx", "Australia Post")
   */
  name: string;

  /**
   * A short, user-friendly description of the carrier
   */
  description?: string;

  /**
   * The URL of the carrier's website
   */
  websiteURL: UrlString;

  /**
   * The carrier's logo image
   */
  logo: InlineOrReference<LogoDefinition>;

  /**
   * The delivery services that are offered by the carrier
   */
  deliveryServices: InlineOrReferenceArray<DeliveryServiceDefinition>;

  /**
   * The package pickup services that are offered by the carrier
   */
  pickupServices?: InlineOrReferenceArray<PickupServiceDefinition>;
}
