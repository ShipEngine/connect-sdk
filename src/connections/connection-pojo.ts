import { LocalizationDefinition, LocalizationPOJO, LocalizedBrandingPOJO } from "../common";
import { FilePath, InlineOrReference, URLString, UUID } from "../types";
import { FormDefinition, FormPOJO } from "./form-pojo";
import { Connect } from "./methods";

/**
 * A connection to a third-party service, such as a carrier or marketplace
 */
export interface ConnectionPOJO extends ConnectionDefinition {
  connectionForm: FormPOJO;
  settingsForm?: FormPOJO;
  localization?: LocalizationPOJO<LocalizedBrandingPOJO>;
  connect: Connect;
}


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
  websiteURL: URLString;

  /**
   * The third party service's logo image
   */
  logo: FilePath;

  /**
   * A form that allows the user to connect to the third-party service.
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
