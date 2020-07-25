import { DocumentType, PackageConfirmation as IPackageConfirmation, PackageConfirmationPOJO } from "../../../public";
import { hideAndFreeze, Joi, _internal } from "../../common";
import { Document } from "../documents/document";
import { Label } from "../documents/label";
import { createDocument, isLabel } from "../documents/utils";
import { PackageIdentifier, PackageIdentifierBase } from "./package-identifier";

export class PackageConfirmation extends PackageIdentifierBase implements IPackageConfirmation {
  public static readonly [_internal] = {
    label: "package",
    schema: PackageIdentifier[_internal].schema.keys({
      documents: Joi.array().min(1).items(
        Joi.alternatives(
          Document[_internal].schema,
          Label[_internal].schema,
        )
      ).required(),
      metadata: Joi.object(),
    }),
  };

  public readonly documents: ReadonlyArray<Document | Label>;
  public readonly metadata: object;

  public get label(): Label | undefined {
    return this.documents.find(isLabel);
  }

  public get customsForm(): Document | undefined {
    return this.documents.find((doc) => doc.type === DocumentType.CustomsForm);
  }

  public constructor(pojo: PackageConfirmationPOJO) {
    super(pojo);

    this.metadata = pojo.metadata || {};
    this.documents = pojo.documents.map(createDocument);

    // Make this object immutable
    hideAndFreeze(this);
  }
}
