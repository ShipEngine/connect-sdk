import type { DefinitionIdentifier, DefinitionIdentifierPOJO, InlineOrReference, Localizable, LocalizationDefinition, LocalizationPOJO, LocalizedInfoPOJO } from "../common";


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
 * Identifies a type of packaging
 */
export type PackagingIdentifier = DefinitionIdentifier;


/**
 * Describes a type of packaging
 */
export interface Packaging extends DefinitionIdentifier, Localizable<Packaging, PackagingPOJO> {
  /**
   * The user-friendly name for this packaging (e.g. "Flat-Rate Box", "Large Padded Envelope")
   */
  readonly name: string;

  /**
   * A short, user-friendly description of the packaging
   */
  readonly description: string;

  /**
   * Indicates whether the weight must be specified when using this packaging
   */
  readonly requiresWeight: boolean;

  /**
   * Indicates whether the dimensions must be specified when using this packaging
   */
  readonly requiresDimensions: boolean;
}
