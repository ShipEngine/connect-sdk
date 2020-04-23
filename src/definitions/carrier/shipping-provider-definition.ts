import { CancelPickup, CreateLabel, CreateManifest, GetRates, GetTrackingURL, Login, RequestPickup, Track, VoidLabel } from "../../classes/carrier/methods";
import { InlineOrReference, InlineOrReferenceArray, UrlString, UUID } from "../../types";
import { CarrierDefinition } from "./carrier-definition";
import { FormDefinition } from "./form-definition";
import { LogoDefinition } from "./logo-definition";

/**
 * A ShipEngine IPaaS shipping provider app.
 */
export interface ShippingProviderDefinition {
  /**
   * Indicates that this is a ShipEngine IPaaS shipping provider app.
   */
  type: "shipping_provider";

  /**
   * A UUID that uniquely identifies the shipping provider.
   * This ID should never change, even if the provider name changes.
   */
  id: UUID;

  /**
   * The user-friendly provider name (e.g. "Stamps.com", "FirstMile")
   */
  name: string;

  /**
   * A short, user-friendly description of the shipping provider
   */
  description?: string;

  /**
   * The URL of the provider's website
   */
  websiteURL: UrlString;

  /**
   * The shipping provider's logo image
   */
  logo: InlineOrReference<LogoDefinition>;

  /**
   * A form that allows the user to enter their login credentials
   */
  loginForm: InlineOrReference<FormDefinition>;

  /**
   * A form that allows the user to configure settings
   */
  settingsForm?: InlineOrReference<FormDefinition>;

  /**
   * The carriers that this provider provides services for
   */
  carriers: InlineOrReferenceArray<CarrierDefinition>;

  /**
   * Verifies a user's credentials and establishes or renews a session
   */
  login?: InlineOrReference<Login>;

  /**
   * Requests a package pickup at a time and place
   */
  requestPickup?: InlineOrReference<RequestPickup>;

  /**
   * Cancels a previously-requested package pickup
   */
  cancelPickup?: InlineOrReference<CancelPickup>;

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
   * Returns the tracking URL for a shipment
   */
  getTrackingURL?: InlineOrReference<GetTrackingURL>;

  /**
   * Returns tracking details for a shipment
   */
  track?: InlineOrReference<Track>;

  /**
   * Creates a manifest for multiple shipments
   */
  createManifest?: InlineOrReference<CreateManifest>;
}
