import { JSONSchema6 } from "json-schema";
import { UiSchema } from "react-jsonschema-form";
import { InlineOrReference } from "../../types";
import { LocalizationDefinition } from "../common/localization-definition";

/**
 * Defines a user-interface form that collects data from the user.
 */
export interface FormDefinition {
  /**
   * A JSON Schema that defines the data collected by the form, including its constraints.
   */
  dataSchema: InlineOrReference<JSONSchema6>;

  /**
   * A UI Schema that defines the appearance of the form.
   */
  uiSchema: InlineOrReference<UiSchema>;

  /**
   * Localized values for form fields
   */
  localization?: InlineOrReference<LocalizationDefinition<{
    dataSchema?: InlineOrReference<JSONSchema6>;
    uiSchema?: InlineOrReference<UiSchema>;
  }>>;
}
