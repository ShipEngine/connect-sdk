import { Connect } from "../../classes/connection/methods";
import { InlineOrReference, UrlString, UUID } from "../../types";
import { LogoDefinition } from "../common/logo-definition";
import { FormDefinition } from "./form-definition";

/**
 * A connection to a third-party service, such as a carrier or marketplace
 */
export interface ConnectionDefinition {
  /**
   * A UUID that uniquely identifies the connection.
   * This ID should never change, even if the connection name changes.
   */
  id: UUID;

  /**
   * The user-friendly connection name (e.g. "FedEx", "Shopify")
   */
  name: string;

  /**
   * A short, user-friendly description of the connection
   */
  description?: string;

  /**
   * The URL of the third-party service's website
   */
  websiteURL: UrlString;

  /**
   * The third party service's logo image
   */
  logo: InlineOrReference<LogoDefinition>;

  /**
   * A form that allows the user to connect to the third-party service.
   * This form will usually prompt for an account number and login credentials.
   */
  connectForm: InlineOrReference<FormDefinition>;

  /**
   * A form that allows the user to configure connection settings
   */
  settingsForm?: InlineOrReference<FormDefinition>;

  /**
   * Connects to an existing account using the data that was gathered in the `connectForm`.
   * NOTE: This function does not return a value. It updates the `transaction.session` property.
   */
  connect: InlineOrReference<Connect>;
}
