import { CancelPickup, CreateLabel, CreateManifest, GetRates, RequestPickup, Track, VoidLabel } from "../../classes/carrier/methods";
import { FilePath, InlineOrReference, InlineOrReferenceArray, URLString, UUID } from "../../types";
import { LocalizationDefinition } from "../common/localization-definition";
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
  websiteURL: URLString;

  /**
   * The carrier's logo image
   */
  logo: FilePath;

  /**
   * The delivery services that are offered by the carrier
   */
  deliveryServices: InlineOrReferenceArray<DeliveryServiceDefinition>;

  /**
   * The package pickup services that are offered by the carrier
   */
  pickupServices?: InlineOrReferenceArray<PickupServiceDefinition>;

  /**
   * Localizaed values for fields that allow localization
   */
  localization?: InlineOrReference<LocalizationDefinition<{
    name?: string;
    description?: string;
    websiteURL?: URLString;
  }>>;

  /**
   * Creates a shipping label
   */
  createLabel?: InlineOrReference<CreateLabel>;

  /**
   * Voids a previously-created shipping label
   */
  voidLabel?: InlineOrReference<VoidLabel>;

  /**
   * Gets shipping rates for a shipment
   */
  getRates?: InlineOrReference<GetRates>;

  /**
   * Returns tracking details for a shipment
   */
  track?: InlineOrReference<Track>;

  /**
   * Creates a manifest for multiple shipments
   */
  createManifest?: InlineOrReference<CreateManifest>;

  /**
   * Requests a package pickup at a time and place
   */
  requestPickup?: InlineOrReference<RequestPickup>;

  /**
   * Cancels a previously-requested package pickup
   */
  cancelPickup?: InlineOrReference<CancelPickup>;
}
