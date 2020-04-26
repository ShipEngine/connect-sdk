// tslint:disable: no-empty-interface
import { JSONSchema6 } from "json-schema";
import { UiSchema } from "react-jsonschema-form";
import { FormDefinition } from "../../definitions";

/**
 * Defines a user-interface form that collects data from the user.
 */
export interface FormPOJO extends FormDefinition {
  dataSchema: JSONSchema6;
  uiSchema: UiSchema;
}
