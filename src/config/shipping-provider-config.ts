import { CancelPickup, CreateLabel, CreateManifest, GetRates, GetTrackingURL, RequestPickup, Track, VoidLabel } from "../shipping-provider";
import { Login } from "../shipping-provider/methods";
import { InlineOrReference, InlineOrReferenceArray, UrlString, UUID } from "../types";
import { CarrierConfig } from "./carrier-config";
import { FormConfig } from "./form-config";
import { LogoConfig } from "./logo-config";

/**
 * A ShipEngine IPaaS shipping provider app config.
 */
export interface ShippingProviderConfig {
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
  logo: InlineOrReference<LogoConfig>;

  /**
   * A form that allows the user to enter their login credentials
   */
  loginForm: InlineOrReference<FormConfig>;

  /**
   * A form that allows the user to configure settings
   */
  settingsForm?: InlineOrReference<FormConfig>;

  /**
   * The carriers that this provider provides services for
   */
  carriers: InlineOrReferenceArray<CarrierConfig>;

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
