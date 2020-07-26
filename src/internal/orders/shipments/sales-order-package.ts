import { InsuranceProvider, SalesOrderPackage as ISalesOrderPackage, SalesOrderPackagePOJO } from "../../../public";
import { Customs, PackageIdentifier, PackageIdentifierBase } from "../../carriers";
import { Dimensions, hideAndFreeze, Joi, MonetaryValue, Weight, _internal } from "../../common";
import { SalesOrderPackageItem } from "./sales-order-package-item";

export class SalesOrderPackage extends PackageIdentifierBase implements ISalesOrderPackage {
  public static readonly [_internal] = {
    label: "package",
    schema: PackageIdentifier[_internal].schema.keys({
      trackingURL: Joi.alternatives(Joi.object().website(), Joi.string().website()),
      dimensions: Dimensions[_internal].schema,
      weight: Weight[_internal].schema,
      insuredValue: MonetaryValue[_internal].schema,
      insuranceProvider: Joi.string().enum(InsuranceProvider),
      customs: Customs[_internal].schema,
      contents: Joi.array().min(1).items(SalesOrderPackageItem[_internal].schema).required(),
    }),
  };

  public readonly trackingURL?: URL;
  public readonly dimensions?: Dimensions;
  public readonly weight?: Weight;
  public readonly insuredValue: MonetaryValue;
  public readonly insuranceProvider: InsuranceProvider;
  public readonly customs: Customs;
  public readonly contents: ReadonlyArray<SalesOrderPackageItem>;

  public constructor(pojo: SalesOrderPackagePOJO) {
    super(pojo);

    this.trackingURL = pojo.trackingURL ? new URL(pojo.trackingURL as string) : undefined;
    this.dimensions = pojo.dimensions && new Dimensions(pojo.dimensions);
    this.weight = pojo.weight && new Weight(pojo.weight);
    this.insuredValue = new MonetaryValue(pojo.insuredValue || { value: "0", currency: "usd" });
    this.insuranceProvider = pojo.insuranceProvider || InsuranceProvider.Carrier;
    this.customs = new Customs(pojo.customs || {});
    this.contents = (pojo.contents || []).map((item) => new SalesOrderPackageItem(item));

    // Make this object immutable
    hideAndFreeze(this);
  }
}
