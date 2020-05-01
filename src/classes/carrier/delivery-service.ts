import { CanonicalDeliveryService } from "../../canonical-delivery-service";
import { Country } from "../../countries";
import { DeliveryServiceClass, DeliveryServiceGrade, LabelFormat, LabelSize, ManifestType, ServiceArea } from "../../enums";
import { DeliveryServicePOJO } from "../../pojos/carrier";
import { LocalizedInfoPOJO } from "../../pojos/common";
import { UUID } from "../../types";
import { Joi } from "../../validation";
import { App } from "../common/app";
import { Localization, localize } from "../common/localization";
import { hideAndFreeze, _internal } from "../utils";
import { DeliveryConfirmation } from "./delivery-confirmation";
import { Packaging } from "./packaging";

const _private = Symbol("private fields");

/**
 * A delivery service that is offered by a carrier
 */
export class DeliveryService {
  //#region Private/Internal Fields

  /** @internal */
  public static readonly [_internal] = {
    label: "delivery service",
    schema: Joi.object({
      id: Joi.string().uuid().required(),
      name: Joi.string().trim().singleLine().min(1).max(100).required(),
      description: Joi.string().trim().singleLine().allow("").max(1000),
      class: Joi.string().enum(DeliveryServiceClass).required(),
      grade: Joi.string().enum(DeliveryServiceGrade).required(),
      fulfilledBy: Joi.string().enum(CanonicalDeliveryService),
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
      packaging: Joi.array().items(Packaging[_internal].schema),
      deliveryConfirmations: Joi.array().items(DeliveryConfirmation[_internal].schema),
      localization: Joi.object().localization({
        name: Joi.string().trim().singleLine().min(1).max(100),
        description: Joi.string().trim().singleLine().allow("").max(1000),
      }),
    }),
  };

  /** @internal */
  private readonly [_private]: {
    readonly app: App;
    readonly localization: Localization<LocalizedInfoPOJO>;
  };

  //#endregion
  //#region Public Fields

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
   * If this service is fulfilled by a well-known third-party carrier, such as UPS, FedEx, DHL, etc.
   * then specify that service here. This will allow more shippers to discover and use your service.
   */
  public readonly fulfilledBy?: CanonicalDeliveryService;

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

  public constructor(pojo: DeliveryServicePOJO, app: App) {
    this.id = pojo.id;
    this.name = pojo.name;
    this.description = pojo.description || "";
    this.class = pojo.class;
    this.grade = pojo.grade;
    this.fulfilledBy = pojo.fulfilledBy;
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
    this.packaging = pojo.packaging ? pojo.packaging.map((svc) => new Packaging(svc, app)) : [];
    this.deliveryConfirmations = pojo.deliveryConfirmations
      ? pojo.deliveryConfirmations.map((svc) => new DeliveryConfirmation(svc, app)) : [];

    this[_private] = {
      app,
      localization: new Localization(pojo.localization || {}),
    };

    // Make this object immutable
    hideAndFreeze(this);

    app[_internal].references.add(this);
  }

  /**
   * Creates a copy of the delivery service, localized for the specified locale if possible.
   */
  public localize(locale: string): DeliveryService {
    let pojo = localize(this, locale);
    return new DeliveryService(pojo, this[_private].app);
  }

  /**
   * Returns the delivery service as a POJO that can be safely serialized as JSON.
   * Optionally returns the POJO localized to the specifeid language and region.
   */
  public toJSON(locale?: string): DeliveryServicePOJO {
    let { localization } = this[_private];
    let localizedValues = locale ? localization.lookup(locale) : {};

    return {
      ...this,
      labelFormats: this.labelFormats as LabelFormat[],
      labelSizes: this.labelSizes as LabelSize[],
      originCountries: this.originCountries as Country[],
      destinationCountries: this.destinationCountries as Country[],
      packaging: this.packaging.map((o) => o.toJSON(locale)),
      deliveryConfirmations: this.deliveryConfirmations.map((o) => o.toJSON(locale)),
      localization: localization.toJSON(),
      ...localizedValues,
    };
  }
}

// Prevent modifications to the class
hideAndFreeze(DeliveryService);
