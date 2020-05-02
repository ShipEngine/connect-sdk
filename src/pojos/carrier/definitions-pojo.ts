// tslint:disable: no-empty-interface
import { CancelPickup, CreateLabel, CreateManifest, GetRates, GetTrackingURL, RequestPickup, Track, VoidLabel } from "../../classes/carrier/methods";
import { CarrierDefinition, DeliveryConfirmationDefinition, DeliveryServiceDefinition, PackagingDefinition, PickupServiceDefinition } from "../../definitions";
import { Country } from "../../enums";
import { LocalizationPOJO, LocalizedBrandingPOJO, LocalizedInfoPOJO } from "../common";

/**
 * A carrier that provides delivery services
 */
export interface CarrierPOJO extends CarrierDefinition {
  deliveryServices: DeliveryServicePOJO[];
  pickupServices?: PickupServicePOJO[];
  localization?: LocalizationPOJO<LocalizedBrandingPOJO>;
  requestPickup?: RequestPickup;
  cancelPickup?: CancelPickup;
  createLabel?: CreateLabel;
  voidLabel?: VoidLabel;
  getRates?: GetRates;
  getTrackingURL?: GetTrackingURL;
  track?: Track;
  createManifest?: CreateManifest;
}

/**
 * Delivery confirmation options offered by a carrier
 */
export interface DeliveryConfirmationPOJO extends DeliveryConfirmationDefinition {
  localization?: LocalizationPOJO<LocalizedInfoPOJO>;
}

/**
 * A delivery service that is offered by a carrier
 */
export interface DeliveryServicePOJO extends DeliveryServiceDefinition {
  originCountries: Country[];
  destinationCountries: Country[];
  packaging?: PackagingPOJO[];
  deliveryConfirmations?: DeliveryConfirmationPOJO[];
  localization?: LocalizationPOJO<LocalizedInfoPOJO>;
}

/**
 * Describes a type of packaging
 */
export interface PackagingPOJO extends PackagingDefinition {
  localization?: LocalizationPOJO<LocalizedInfoPOJO>;
}

/**
 * A package pickup service that is offered by a carrier
 */
export interface PickupServicePOJO extends PickupServiceDefinition {
  localization?: LocalizationPOJO<LocalizedInfoPOJO>;
}
