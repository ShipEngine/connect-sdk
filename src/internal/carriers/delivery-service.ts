import { Country, DeliveryService as IDeliveryService, DeliveryServiceClass, DeliveryServiceDefinition, DeliveryServiceGrade, DocumentFormat, DocumentSize, FulfillmentService, ManifestType, ServiceArea } from "../../public";
import { App, DefinitionIdentifier, hideAndFreeze, Joi, _internal } from "../common";
import { DeliveryConfirmation, DeliveryConfirmationPOJO } from "./delivery-confirmation";
import { Packaging, PackagingPOJO } from "./packaging";

const _private = Symbol("private fields");


export interface DeliveryServicePOJO extends DeliveryServiceDefinition {
  originCountries: Country[];
  destinationCountries: Country[];
  packaging: ReadonlyArray<PackagingPOJO>;
  deliveryConfirmations?: ReadonlyArray<DeliveryConfirmationPOJO>;
}


export class DeliveryService extends DefinitionIdentifier implements IDeliveryService {
  public static readonly [_internal] = {
    label: "delivery service",
    schema: DefinitionIdentifier[_internal].schema.keys({
      name: Joi.string().trim().singleLine().min(1).max(100).required(),
      description: Joi.string().trim().singleLine().allow("").max(1000),
      class: Joi.string().enum(DeliveryServiceClass).required(),
      grade: Joi.string().enum(DeliveryServiceGrade).required(),
      fulfillmentService: Joi.string().enum(FulfillmentService),
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


  private readonly [_private]: {
    readonly app: App;
  };

  public readonly name: string;
  public readonly description: string;
  public readonly class: DeliveryServiceClass;
  public readonly grade: DeliveryServiceGrade;
  public readonly fulfillmentService?: FulfillmentService;
  public readonly serviceArea?: ServiceArea;
  public readonly isConsolidationService: boolean;
  public readonly allowsMultiplePackages: boolean;
  public readonly isInsurable: boolean;
  public readonly isTrackable: boolean;
  public readonly manifestType: ManifestType;
  public readonly supportsReturns: boolean;
  public readonly hasSandbox: boolean;
  public readonly labelFormats: ReadonlyArray<DocumentFormat>;
  public readonly labelSizes: ReadonlyArray<DocumentSize>;
  public readonly originCountries: ReadonlyArray<Country>;
  public readonly destinationCountries: ReadonlyArray<Country>;
  public readonly packaging: ReadonlyArray<Packaging>;
  public readonly deliveryConfirmations: ReadonlyArray<DeliveryConfirmation>;

  public get countries(): ReadonlyArray<Country> {
    let countries = new Set(this.originCountries.concat(this.destinationCountries));
    return Object.freeze([...countries]);
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
    this.fulfillmentService = pojo.fulfillmentService;
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
