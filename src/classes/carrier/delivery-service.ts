import { Country } from "../../countries";
import { DeliveryServiceClass, DeliveryServiceGrade, LabelFormat, LabelSize, ManifestType, ServiceArea } from "../../enums";
import { DeliveryServicePOJO } from "../../pojos/carrier";
import { UUID } from "../../types";
import { Joi } from "../../validation";
import { App } from "../common/app";
import { Carrier } from "./carrier";
import { DeliveryConfirmation } from "./delivery-confirmation";
import { Packaging } from "./packaging";

/**
 * A delivery service that is offered by a carrier
 */
export class DeliveryService {
  //#region Class Fields

  public static readonly label = "delivery service";

  /** @internal */
  public static readonly schema = Joi.object({
    id: Joi.string().uuid().required(),
    name: Joi.string().trim().singleLine().min(1).max(100).required(),
    description: Joi.string().trim().singleLine().allow("").max(1000),
    class: Joi.string().enum(DeliveryServiceClass).required(),
    grade: Joi.string().enum(DeliveryServiceGrade).required(),
    serviceArea: Joi.string().enum(ServiceArea),
    isConsolidationService: Joi.boolean(),
    isReturnService: Joi.boolean(),
    allowsMultiplePackages: Joi.boolean(),
    hasTracking: Joi.boolean(),
    hasSandbox: Joi.boolean(),
    requiresManifest: Joi.alternatives(Joi.allow(false), Joi.string().enum(ManifestType)),
    labelFormats: Joi.array().items(Joi.string().enum(LabelFormat)),
    labelSizes: Joi.array().items(Joi.string().enum(LabelSize)),
    originCountries: Joi.array().min(1).items(Joi.string().enum(Country)).required(),
    destinationCountries: Joi.array().min(1).items(Joi.string().enum(Country)).required(),
    packaging: Joi.array().items(Packaging.schema),
    deliveryConfirmations: Joi.array().items(DeliveryConfirmation.schema),
  });

  //#endregion
  //#region Instance Fields

  /**
   * A UUID that uniquely identifies the delivery service.
   * This ID should never change, even if the service name changes.
   */
  public readonly id: UUID;

  /**
   * The user-friendly service name (e.g. "Priority Overnight", "2-Day Air")
   */
  public readonly name: string;

  /**
   * A short, user-friendly description of the service
   */
  public readonly description: string;

  /**
   * The class of service
   */
  public readonly class: DeliveryServiceClass;

  /**
   * The grade of service
   */
  public readonly grade: DeliveryServiceGrade;

  /**
   * The service area this service covers
   */
  public readonly serviceArea?: ServiceArea;

  /**
   * Indicates whether this service is a consolidation of multiple carrier services
   */
  public readonly isConsolidationService: boolean;

  /**
   * TODO: Does this mean that the service is ONLY for return shipping? Or that it ALSO supports return shipping?
   */
  public readonly isReturnService: boolean;

  /**
   * Indicates whether the service allows multiple packages in a single shipment
   */
  public readonly allowsMultiplePackages: boolean;

  /**
   * Indicates whether a tracking number is provided
   */
  public readonly hasTracking: boolean;

  /**
   * Indicates whether the carrier provides a sandbox/development API for this delivery service.
   * A sandbox should mimic real functionality as much as possible but MUST NOT incur any actual
   * costs or affect production data.
   */
  public readonly hasSandbox: boolean;

  /**
   * Indicates whether this service requires a manifest, and if so, what type
   */
  public readonly requiresManifest: false | ManifestType;

  /**
   * The label formats that are offered for this service
   */
  public readonly labelFormats: ReadonlyArray<LabelFormat>;

  /**
   * The label dimensions that are used for this service
   */
  public readonly labelSizes: ReadonlyArray<LabelSize>;

  /**
   * The countries that can be shipped from using this service
   */
  public readonly originCountries: ReadonlyArray<Country>;

  /**
   * The countries that can be shipped to using this service
   */
  public readonly destinationCountries: ReadonlyArray<Country>;

  /**
   * The carrier that provides this service
   */
  public readonly  carrier: Carrier;

  /**
   * The types of packaging that are provided/allowed for this service
   */
  public readonly packaging: ReadonlyArray<Packaging>;

  /**
   * The types of package delivery confirmations offered for this service
   */
  public readonly deliveryConfirmations: ReadonlyArray<DeliveryConfirmation>;

  //#endregion
  //#region Helper properties

  /**
   * All countries that this service ships to or from.
   * This list includes all unique origin and destination countries.
   */
  public get countries(): ReadonlyArray<Country> {
    let countries = new Set(this.originCountries.concat(this.destinationCountries));
    return Object.freeze([...countries]);
  }

  /**
   * Indicates whether the weight may be required when using this service.
   * This property is `true` if any of the service's packaging requires weight.
   */
  public get requiresWeight(): boolean {
    return this.packaging.some((pkg) => pkg.requiresWeight);
  }

  /**
   * Indicates whether the dimensions may be required when using this service.
   * This property is `true` if any of the service's packaging requires dimensions.
   */
  public get requiresDimensions(): boolean {
    return this.packaging.some((pkg) => pkg.requiresDimensions);
  }

  //#endregion

  public constructor(pojo: DeliveryServicePOJO, app: App, parent: Carrier) {
    this.carrier = parent;
    this.id = app._references.add(this, pojo);
    this.name = pojo.name;
    this.description = pojo.description || "";
    this.class = pojo.class;
    this.grade = pojo.grade;
    this.serviceArea = pojo.serviceArea;
    this.isConsolidationService = pojo.isConsolidator || false;
    this.isReturnService = pojo.isReturnService || false;
    this.allowsMultiplePackages = pojo.allowsMultiplePackages || false;
    this.hasTracking = pojo.hasTracking || false;
    this.hasSandbox = pojo.hasSandbox || false;
    this.requiresManifest = pojo.requiresManifest || false;
    this.labelFormats = pojo.labelFormats || [];
    this.labelSizes = pojo.labelSizes || [];
    this.originCountries = pojo.originCountries;
    this.destinationCountries = pojo.destinationCountries;
    this.packaging = pojo.packaging
      ? pojo.packaging.map((svc) => app._references.get(svc, Packaging) || new Packaging(svc, app)) : [];
    this.deliveryConfirmations = pojo.deliveryConfirmations
      ? pojo.deliveryConfirmations.map(
        (svc) => app._references.get(svc, DeliveryConfirmation) || new DeliveryConfirmation(svc, app)) : [];

    // Prevent modifications after validation
    Object.freeze(this);
    Object.freeze(this.labelFormats);
    Object.freeze(this.labelSizes);
    Object.freeze(this.originCountries);
    Object.freeze(this.destinationCountries);
    Object.freeze(this.packaging);
    Object.freeze(this.deliveryConfirmations);
  }

}
