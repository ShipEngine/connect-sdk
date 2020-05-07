// tslint:disable: no-empty-interface
import { JSONSchema6 } from "json-schema";
import { UiSchema } from "react-jsonschema-form";
import { Connect } from "../../classes/connection/methods";
import { ConnectionDefinition, FormDefinition } from "../../definitions";
import { LocalizationPOJO, LocalizedBrandingPOJO } from "../common";

/**
 * A connection to a third-party service, such as a carrier or marketplace
 */
export interface ConnectionPOJO extends ConnectionDefinition {
  connectForm: FormPOJO;
  settingsForm?: FormPOJO;
  localization?: LocalizationPOJO<LocalizedBrandingPOJO>;
  connect: Connect;
}

/**
 * Defines a user-interface form that collects data from the user.
 */
export interface FormPOJO extends FormDefinition {
  dataSchema: JSONSchema6;
  uiSchema: UiSchema;
  localization?: LocalizationPOJO<LocalizedFormPOJO>;
}

/**
 * Localized form fields
 */
export interface LocalizedFormPOJO {
  dataSchema?: JSONSchema6;
  uiSchema?: UiSchema;
}
