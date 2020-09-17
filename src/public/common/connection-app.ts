import type { AppDefinition } from "./app";
import type { FormDefinition } from "./form";
import type { Connect } from "./methods";
import type { FilePath, InlineOrReference, URLString } from "./types";
import type { OAuthConfigDefinition } from './oauth-config'

/**
 * A ShipEngine Connect app that connects to a service, such as a carrier or marketplace
 */
export interface ConnectionAppDefinition extends AppDefinition {
  /**
   * The user-friendly connection name (e.g. "FedEx", "Shopify")
   */
  name: string;

  /**
   * A short, user-friendly description of the connection
   */
  description?: string;

  /**
   * The URL of the service's website
   */
  websiteURL: URLString;

  /**
   * The third party service's logo image
   */
  logo: FilePath;

  /**
   * The third party service's icon image
   */
  icon: FilePath;

  /**
   * A form that allows the user to connect to the service.
   * This form will usually prompt for an account number and login credentials.
   */
  connectionForm: InlineOrReference<FormDefinition>;

  /**
   * A form that allows the user to configure connection settings
   */
  settingsForm?: InlineOrReference<FormDefinition>;

  /**
   * Connects to an existing account using the data that was gathered in the `connectionForm`.
   * NOTE: This function does not return a value. It updates the `transaction.session` property.
   */
  connect?: InlineOrReference<Connect>;

  /**
   * Configuration that defines a data driven OAuth flow.
   */
  oauthConfig?: InlineOrReference<OAuthConfigDefinition>;
}
