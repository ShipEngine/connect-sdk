import { Country, DeliveryService as IDeliveryService, DeliveryServiceClass, DeliveryServiceGrade, DeliveryService as DeliveryServicePOJO, DocumentFormat, DocumentSize, ManifestType, ServiceArea } from "../../definitions";
import { App, DefinitionIdentifier, hideAndFreeze, Joi, _internal } from "../common";
import { DeliveryConfirmation } from "./delivery-confirmation";
import { Packaging } from "./packaging";

const _private = Symbol("private fields");

export class DeliveryService extends DefinitionIdentifier implements IDeliveryService {
  public static [_internal] = {
    label: "delivery service",
    schema: DefinitionIdentifier[_internal].schema.keys({
      name: Joi.string().trim().singleLine().min(1).max(100).required(),
      description: Joi.string().trim().singleLine().allow("").max(1000),
      class: Joi.string().enum(DeliveryServiceClass).required(),
      grade: Joi.string().enum(DeliveryServiceGrade).required(),
      serviceArea: Joi.string().enum(ServiceArea),
      isConsolidationService: Joi.boolean(),
      allowsMultiplePackages: Joi.boolean(),
      isInsurable: Joi.boolean(),
      isTrackable: Joi.boolean(),
      manifestType: Joi.string().enum(ManifestType).required(),
      supportsReturns: Joi.boolean(),
      hasSandbox: Joi.boolean(),
      labelFormats: Joi.array().items(Joi.string().enum(DocumentFormat)),
      labelSizes: Joi.array().items(Joi.string().enum(DocumentSize)),
      originCountries: Joi.array().min(1).items(Joi.string().enum(Country)).required(),
      destinationCountries: Joi.array().min(1).items(Joi.string().enum(Country)).required(),
      packaging: Joi.array().items(Packaging[_internal].schema).required(),
      deliveryConfirmations: Joi.array().items(DeliveryConfirmation[_internal].schema),
    }),
  };


  private [_private]: {
    app: App;
  };

  public name: string;
  public description: string;
  public class: DeliveryServiceClass;
  public grade: DeliveryServiceGrade;
  public serviceArea?: ServiceArea;
  public isConsolidationService: boolean;
  public allowsMultiplePackages: boolean;
  public isInsurable: boolean;
  public isTrackable: boolean;
  public manifestType: ManifestType;
  public supportsReturns: boolean;
  public hasSandbox: boolean;
  public labelFormats: Array<DocumentFormat>;
  public labelSizes: Array<DocumentSize>;
  public originCountries: Array<Country>;
  public destinationCountries: Array<Country>;
  public packaging: Array<Packaging>;
  public deliveryConfirmations: Array<DeliveryConfirmation>;

  public get countries(): Array<Country> {
    let countries = new Set(this.originCountries.concat(this.destinationCountries));
    return [...countries];
  }

  public get requiresWeight(): boolean {
    return this.packaging.some((pkg) => pkg.requiresWeight);
  }

  public get requiresDimensions(): boolean {
    return this.packaging.some((pkg) => pkg.requiresDimensions);
  }

  public constructor(pojo: DeliveryServicePOJO, app: App) {
    super(pojo);

    this.name = pojo.name;
    this.description = pojo.description || "";
    this.class = pojo.class;
    this.grade = pojo.grade;
    this.serviceArea = pojo.serviceArea;
    this.isConsolidationService = pojo.isConsolidationService || false;
    this.allowsMultiplePackages = pojo.allowsMultiplePackages || false;
    this.isInsurable = pojo.isInsurable || false;
    this.isTrackable = pojo.isTrackable || false;
    this.manifestType = pojo.manifestType;

    this.supportsReturns = pojo.supportsReturns || false;
    this.hasSandbox = pojo.hasSandbox || false;
    this.labelFormats = pojo.labelFormats || [];
    this.labelSizes = pojo.labelSizes || [];
    this.originCountries = pojo.originCountries;
    this.destinationCountries = pojo.destinationCountries;
    this.packaging = pojo.packaging.map((svc) => new Packaging(svc, app));
    this.deliveryConfirmations = pojo.deliveryConfirmations
      ? pojo.deliveryConfirmations.map((svc) => new DeliveryConfirmation(svc, app)) : [];

    this[_private] = {
      app
    };

    // Make this object immutable
    hideAndFreeze(this);

    app[_internal].references.add(this);
  }
}
