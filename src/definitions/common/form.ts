import type { JSONSchema6 } from "json-schema";
import type { UiSchema } from "react-jsonschema-form";

/**
 * Defines a user-interface form that collects data from the user.
 */
export interface Form {
  dataSchema: JSONSchema6;
  uiSchema: UiSchema;
}
