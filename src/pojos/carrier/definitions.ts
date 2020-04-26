// tslint:disable: no-empty-interface
import { CancelPickup, CreateLabel, CreateManifest, GetRates, GetTrackingURL, Login, RequestPickup, Track, VoidLabel } from "../../classes/carrier/methods";
import { Country } from "../../countries";
import { CarrierDefinition, DeliveryConfirmationDefinition, DeliveryServiceDefinition, PackagingDefinition, PickupServiceDefinition, ShippingProviderDefinition } from "../../definitions";
import { LogoPOJO } from "../common";
import { FormPOJO } from "../connection";

/**
 * A carrier that provides delivery services
 */
export interface CarrierPOJO extends CarrierDefinition {
  logo: LogoPOJO;
  deliveryServices: DeliveryServicePOJO[];
  pickupServices?: PickupServicePOJO[];
}

/**
 * Delivery confirmation options offered by a shipping provider
 */
export interface DeliveryConfirmationPOJO extends DeliveryConfirmationDefinition {}

/**
 * A delivery service that is offered by a shipping provider
 */
export interface DeliveryServicePOJO extends DeliveryServiceDefinition {
  originCountries: Country[];
  destinationCountries: Country[];
  packaging?: PackagingPOJO[];
  deliveryConfirmations?: DeliveryConfirmationPOJO[];
}

/**
 * Describes a type of packaging
 */
export interface PackagingPOJO extends PackagingDefinition {}

/**
 * A package pickup service that is offered by a shipping provider
 */
export interface PickupServicePOJO extends PickupServiceDefinition {}

/**
 * A shipping provider provides delivery services for one or more carriers
 */
export interface ShippingProviderPOJO extends ShippingProviderDefinition {
  logo: LogoPOJO;
  loginForm: FormPOJO;
  settingsForm?: FormPOJO;
  carriers: CarrierPOJO[];
  login?: Login;
  requestPickup?: RequestPickup;
  cancelPickup?: CancelPickup;
  createLabel?: CreateLabel;
  voidLabel?: VoidLabel;
  getRates?: GetRates;
  getTrackingURL?: GetTrackingURL;
  track?: Track;
  createManifest?: CreateManifest;
}
