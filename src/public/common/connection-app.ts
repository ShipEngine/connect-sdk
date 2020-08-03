import type { App, AppDefinition } from "./app";
import type { Form } from "./form";
import type { Connect } from "./methods";
import type { Transaction } from "./transaction";
import type { FilePath, InlineOrReference, URLString } from "./types";


/**
 * A ShipEngine Integration Platform app that connects to a service, such as a carrier or marketplace
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
  connectionForm: InlineOrReference<Form>;

  /**
   * A form that allows the user to configure connection settings
   */
  settingsForm?: InlineOrReference<Form>;

  /**
   * Connects to an existing account using the data that was gathered in the `connectionForm`.
   * NOTE: This function does not return a value. It updates the `transaction.session` property.
   */
  connect?: InlineOrReference<Connect>;
}

/**
 * A ShipEngine Integration Platform app that connects to a service, such as a carrier or marketplace
 */
export interface ConnectionApp extends App {
  /**
   * The user-friendly app name (e.g. "FedEx", "Shopify")
   */
  name: string;

  /**
   * A short, user-friendly description of the app
   */
  description: string;

  /**
   * The URL of the third-party service's website
   */
  websiteURL: URL;

  /**
   * The third party service's logo image
   */
  logo: FilePath;

  /**
   * The third party service's icon image
   */
  icon: FilePath;

  /**
   * A form that allows the user to connect to the third-party service.
   * This form will usually prompt for an account number and login credentials.
   */
  connectionForm: Form;

  /**
   * A form that allows the user to configure connection settings
   */
  settingsForm?: Form;

  /**
   * Connects to an existing account using the data that was gathered in the `connectionForm`.
   * NOTE: This function does not return a value. It updates the `transaction.session` property.
   */
  connect?(transaction: Transaction, connectionFormData: object): Promise<void>;
}
