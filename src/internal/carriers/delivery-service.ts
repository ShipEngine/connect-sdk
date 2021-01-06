import { Country, DeliveryService as IDeliveryService, DeliveryServiceDefinition, DocumentFormat, DocumentSize, FulfillmentService, ManifestType, ServiceArea } from "../../public";
import { App, DefinitionIdentifier, hideAndFreeze, Joi, _internal } from "../common";
import { DeliveryConfirmation, DeliveryConfirmationPOJO } from "./delivery-confirmation";
import { Packaging, PackagingPOJO } from "./packaging";

const _private = Symbol("private fields");


export interface DeliveryServicePOJO extends DeliveryServiceDefinition {
  availableCountries: Country[];
  packaging: readonly PackagingPOJO[];
  deliveryConfirmations?: readonly DeliveryConfirmationPOJO[];
}


export class DeliveryService extends DefinitionIdentifier implements IDeliveryService {
  public static readonly [_internal] = {
    label: "delivery service",
    schema: DefinitionIdentifier[_internal].schema.keys({
      name: Joi.string().singleLine().min(1).required(),
      description: Joi.string().singleLine().allow(""),
      code: Joi.string().singleLine().allow("").required(),
      fulfillmentService: Joi.string().enum(FulfillmentService),
      serviceArea: Joi.string().enum(ServiceArea),
      isConsolidationService: Joi.boolean(),
      allowsMultiplePackages: Joi.boolean(),
      isInsurable: Joi.boolean(),
      isTrackable: Joi.boolean(),
      manifestType: Joi.string().enum(ManifestType),
      supportsReturns: Joi.boolean(),
      labelFormats: Joi.array().items(Joi.string().enum(DocumentFormat)),
      labelSizes: Joi.array().items(Joi.string().enum(DocumentSize)),
      availableCountries: Joi.array().min(1).items(Joi.string().enum(Country)).required(),
      packaging: Joi.array().items(Packaging[_internal].schema).required(),
      deliveryConfirmations: Joi.array().items(DeliveryConfirmation[_internal].schema),
    }),
  };


  private readonly [_private]: {
    readonly app: App;
  };

  public readonly name: string;
  public readonly description: string;
  public readonly code: string;
  public readonly fulfillmentService?: FulfillmentService;
  public readonly serviceArea?: ServiceArea;
  public readonly isConsolidationService: boolean;
  public readonly allowsMultiplePackages: boolean;
  public readonly isInsurable: boolean;
  public readonly isTrackable: boolean;
  public readonly manifestType?: ManifestType;
  public readonly supportsReturns: boolean;
  public readonly labelFormats: readonly DocumentFormat[];
  public readonly labelSizes: readonly DocumentSize[];
  public readonly availableCountries: readonly Country[];
  public readonly packaging: readonly Packaging[];
  public readonly deliveryConfirmations: readonly DeliveryConfirmation[];

  public get countries(): readonly Country[] {
    const countries = new Set(this.availableCountries);
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
    this.code = pojo.code;
    this.fulfillmentService = pojo.fulfillmentService;
    this.serviceArea = pojo.serviceArea;
    this.isConsolidationService = pojo.isConsolidationService || false;
    this.allowsMultiplePackages = pojo.allowsMultiplePackages || false;
    this.isInsurable = pojo.isInsurable || false;
    this.isTrackable = pojo.isTrackable || false;
    this.manifestType = pojo.manifestType;

    this.supportsReturns = pojo.supportsReturns || false;
    this.labelFormats = pojo.labelFormats || [];
    this.labelSizes = pojo.labelSizes || [];
    this.availableCountries = pojo.availableCountries;
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
