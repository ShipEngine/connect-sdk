import type { App, AppDefinition, AppPOJO } from "./app";
import type { Form, FormDefinition, FormPOJO } from "./form";
import type { LocalizationDefinition, LocalizationPOJO, LocalizedBrandingPOJO } from "./localization";
import type { Connect } from "./methods";
import type { TransactionPOJO } from "./transaction";
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
   * A form that allows the user to connect to the service.
   * This form will usually prompt for an account number and login credentials.
   */
  connectionForm: InlineOrReference<FormDefinition>;

  /**
   * A form that allows the user to configure connection settings
   */
  settingsForm?: InlineOrReference<FormDefinition>;

  /**
   * Localizaed values for fields that allow localization
   */
  localization?: InlineOrReference<LocalizationDefinition<{
    name?: string;
    description?: string;
    websiteURL?: URLString;
  }>>;

  /**
   * Connects to an existing account using the data that was gathered in the `connectionForm`.
   * NOTE: This function does not return a value. It updates the `transaction.session` property.
   */
  connect?: InlineOrReference<Connect>;
}


/**
 * A ShipEngine Integration Platform app that connects to a service, such as a carrier or marketplace
 */
export interface ConnectionAppPOJO extends ConnectionAppDefinition, AppPOJO {
  connectionForm: FormPOJO;
  settingsForm?: FormPOJO;
  localization?: LocalizationPOJO<LocalizedBrandingPOJO>;
  connect?: Connect;
}


/**
 * A ShipEngine Integration Platform app that connects to a service, such as a carrier or marketplace
 */
export interface ConnectionApp extends App {
  /**
   * The user-friendly app name (e.g. "FedEx", "Shopify")
   */
  readonly name: string;

  /**
   * A short, user-friendly description of the app
   */
  readonly description: string;

  /**
   * The URL of the third-party service's website
   */
  readonly websiteURL: URL;

  /**
   * The third party service's logo image
   */
  readonly logo: FilePath;

  /**
   * A form that allows the user to connect to the third-party service.
   * This form will usually prompt for an account number and login credentials.
   */
  readonly connectionForm: Form;

  /**
   * A form that allows the user to configure connection settings
   */
  readonly settingsForm?: Form;

  /**
   * Returns the app as an object that can be safely serialized as JSON.
   * Optionally returns the object localized to the specifeid language and region.
   */
  toJSON(locale?: string): ConnectionAppPOJO;

  /**
   * Connects to an existing account using the data that was gathered in the `connectionForm`.
   * NOTE: This function does not return a value. It updates the `transaction.session` property.
   */
  connect?(transaction: TransactionPOJO, connectionFormData: object): Promise<void>;
}
