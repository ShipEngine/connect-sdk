// tslint:disable: no-empty-interface
import { JSONSchema6 } from "json-schema";
import { UiSchema } from "react-jsonschema-form";
import { CancelPickup, CreateLabel, CreateManifest, GetRates, GetTrackingURL, Login, RequestPickup, Track, VoidLabel } from "../../classes/carrier/methods";
import { Country } from "../../countries";
import { CarrierDefinition, DeliveryConfirmationDefinition, DeliveryServiceDefinition, FormDefinition, LogoDefinition, PackagingDefinition, PickupServiceDefinition, ShippingProviderDefinition } from "../../definitions";

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
  packaging: PackagingPOJO[];
  deliveryConfirmations?: DeliveryConfirmationPOJO[];
}

/**
 * Defines a user-interface form that collects data from the user.
 */
export interface FormPOJO extends FormDefinition {
  dataSchema: JSONSchema6;
  uiSchema: UiSchema;
}

/**
 * Logo images
 */
export interface LogoPOJO extends LogoDefinition {
  colorSVG: string;   // SVG contents
  blackAndWhiteSVG: string;   // SVG contents
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
 * A ShipEngine IPaaS shipping provider app.
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
