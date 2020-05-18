import { InlineOrReference, LocalizationDefinition, LocalizationPOJO, LocalizedInfoPOJO } from "../common";
import { DefinitionIdentifierPOJO } from "../common/internal";

/**
 * Describes a type of packaging
 */
export interface PackagingPOJO extends PackagingDefinition {
  localization?: LocalizationPOJO<LocalizedInfoPOJO>;
}


/**
 * Identifies a type of packaging
 */
export type PackagingIdentifierPOJO = DefinitionIdentifierPOJO;


/**
 * Describes a type of packaging
 */
export interface PackagingDefinition extends DefinitionIdentifierPOJO {
  /**
   * The user-friendly name for this packaging (e.g. "Flat-Rate Box", "Large Padded Envelope")
   */
  name: string;

  /**
   * A short, user-friendly description of the packaging
   */
  description?: string;

  /**
   * Indicates whether the weight must be specified when using this packaging
   */
  requiresWeight?: boolean;

  /**
   * Indicates whether the dimensions must be specified when using this packaging
   */
  requiresDimensions?: boolean;

  /**
   * Localizaed values for fields that allow localization
   */
  localization?: InlineOrReference<LocalizationDefinition<{
    name?: string;
    description?: string;
  }>>;
}
