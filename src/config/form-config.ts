import { JSONSchema6 } from "json-schema";
import { UiSchema } from "react-jsonschema-form";
import { InlineOrReference } from "../types";

/**
 * Defines a user-interface form that collects data from the user.
 */
export interface FormConfig {
  /**
   * A JSON Schema that defines the data collected by the form, including its constratints.
   */
  dataSchema: InlineOrReference<JSONSchema6>;

  /**
   * A UI Schema that defines the appearance of the form.
   */
  uiSchema: InlineOrReference<UiSchema>;
}
