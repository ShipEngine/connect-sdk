import { hideAndFreeze, Joi, _internal } from "../../internal";
import { URLString } from "../../types";
import { Document, DocumentPOJO } from "../document";
import { PackageIdentifier, packageIdentifierMixin, PackageIdentifierPOJO } from "./package-identifier";

/**
 * Confirmation details about a package in a shipment
 */
export interface PackageConfirmationPOJO extends PackageIdentifierPOJO {
  /**
   * The URL of a webpage where the customer can track the package
   */
  trackingURL?: URLString | URL;

  /**
   * The shipping label for this package
   */
  label: DocumentPOJO;

  /**
   * The customs form for this package
   */
  customsForm?: DocumentPOJO;

  /**
   * Arbitrary data about this package that will be persisted by the ShipEngine Integration Platform.
   * Must be JSON serializable.
   */
  metadata?: object;
}


/**
 * Confirmation details about a package in a shipment
 */
export class PackageConfirmation extends packageIdentifierMixin() {
  //#region Private/Internal Fields

  /** @internal */
  public static readonly [_internal] = {
    label: "package",
    schema: PackageIdentifier[_internal].schema.keys({
      trackingURL: Joi.alternatives(Joi.object().website(), Joi.string().website()),
      label: Document[_internal].schema.required(),
      customsForm: Document[_internal].schema,
      metadata: Joi.object(),
    }),
  };

  //#endregion
  //#region Public Fields

  /**
   * The URL of a webpage where the customer can track the package
   */
  public readonly trackingURL?: URL;

  /**
   * The shipping label for this package
   */
  public readonly label: Document;

  /**
   * The customs form for this package
   */
  public readonly customsForm?: Document;

  /**
   * Arbitrary data about this package that will be persisted by the ShipEngine Integration Platform.
   * Must be JSON serializable.
   */
  public readonly metadata?: object;

  //#endregion

  public constructor(pojo: PackageConfirmationPOJO) {
    super(pojo);

    this.trackingURL = pojo.trackingURL ? new URL(pojo.trackingURL as string) : undefined;
    this.label = new Document({
      ...pojo.label,
      name: pojo.label.name || "Label"
    });
    this.customsForm = pojo.customsForm && new Document({
      ...pojo.customsForm,
      name: pojo.customsForm.name || "Customs Form",
    });
    this.metadata = pojo.metadata;

    // Make this object immutable
    hideAndFreeze(this);
  }
}

// Prevent modifications to the class
hideAndFreeze(PackageConfirmation);
