import { URLString } from "../../common";
import { hideAndFreeze, Joi, _internal } from "../../common/internal";
import { Document } from "../documents/document";
import { DocumentPOJO } from "../documents/document-pojo";
import { DocumentType } from "../documents/enums";
import { Label, LabelPOJO } from "../documents/label";
import { createDocument, isLabel } from "../utils";
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
   * The documents for this package, such as shipping labels, customs forms, etc.
   */
  documents: ReadonlyArray<DocumentPOJO | LabelPOJO>;

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
      documents: Joi.array().min(1).items(
        Joi.alternatives(
          Document[_internal].schema,
          Label[_internal].schema,
        )
      ).required(),
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
   * The documents for this package, such as shipping labels, customs forms, etc.
   */
  public readonly documents: ReadonlyArray<Document | Label>;

  /**
   * Arbitrary data about this package that will be persisted by the ShipEngine Integration Platform.
   * Must be JSON serializable.
   */
  public readonly metadata: object;

  //#endregion
  //#region Helper Properties

  /**
   * The first document of type "label" in the `documents` array
   */
  public get label(): Label | undefined {
    return this.documents.find(isLabel);
  }

  /**
   * The first document of type "customs_form" in the `documents` array
   */
  public get customsForm(): Document | undefined {
    return this.documents.find((doc) => doc.type === DocumentType.CustomsForm);
  }

  //#endregion

  public constructor(pojo: PackageConfirmationPOJO) {
    super(pojo);

    this.trackingURL = pojo.trackingURL ? new URL(pojo.trackingURL as string) : undefined;
    this.metadata = pojo.metadata || {};
    this.documents = pojo.documents.map(createDocument);

    // Make this object immutable
    hideAndFreeze(this);
  }
}

// Prevent modifications to the class
hideAndFreeze(PackageConfirmation);
