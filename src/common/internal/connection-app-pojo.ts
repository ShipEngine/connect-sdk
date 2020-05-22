import { FormDefinition, FormPOJO } from "../form-pojo";
import { LocalizationDefinition, LocalizationPOJO, LocalizedBrandingPOJO } from "../localization-pojo";
import { Connect } from "../methods";
import { FilePath, InlineOrReference, URLString } from "../types";
import { AppDefinition, AppPOJO } from "./app";

/**
 * A ShipEngine Integration Platform app that connects to a service, such as a carrier or marketplace
 */
export interface ConnectionAppPOJO extends ConnectionAppDefinition, AppPOJO {
  connectionForm: FormPOJO;
  settingsForm?: FormPOJO;
  localization?: LocalizationPOJO<LocalizedBrandingPOJO>;
  connect: Connect;
}


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
  connect: InlineOrReference<Connect>;
}
