import { Country, DeliveryServiceClass, DeliveryServiceGrade, DocumentFormat, DocumentSize, FulfillmentService, ServiceArea } from "../../enums";
import { hideAndFreeze, Joi, _internal } from "../../internal";
import { DeliveryServicePOJO } from "../../pojos/carrier";
import { LocalizedInfoPOJO } from "../../pojos/common";
import { UUID } from "../../types";
import { App } from "../common/app";
import { Localization, localize } from "../common/localization";
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
      fulfillmentService: Joi.string().enum(FulfillmentService),
      serviceArea: Joi.string().enum(ServiceArea),
      isConsolidationService: Joi.boolean(),
      allowsMultiplePackages: Joi.boolean(),
      isInsurable: Joi.boolean(),
      isTrackable: Joi.boolean(),
      hasSandbox: Joi.boolean(),
      labelFormats: Joi.array().items(Joi.string().enum(DocumentFormat)),
      labelSizes: Joi.array().items(Joi.string().enum(DocumentSize)),
      originCountries: Joi.array().min(1).items(Joi.string().enum(Country)).required(),
      destinationCountries: Joi.array().min(1).items(Joi.string().enum(Country)).required(),
      packaging: Joi.array().items(Packaging[_internal].schema).required(),
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
   * A well-known service that's used to fulfill this delivery service
   */
  public readonly fulfillmentService?: FulfillmentService;

  /**
   * The service area this service covers
   */
  public readonly serviceArea?: ServiceArea;

  /**
   * Indicates whether this service is a consolidation of multiple carrier services
   */
  public readonly isConsolidationService: boolean;

  /**
   * Indicates whether the service allows multiple packages in a single shipment
   */
  public readonly allowsMultiplePackages: boolean;

  /**
   * Indicates whether shippers can purchase insurance from the carrier for this service
   */
  public readonly isInsurable: boolean;

  /**
   * Indicates whether tracking numbers are provided
   */
  public readonly isTrackable: boolean;

  /**
   * Indicates whether the carrier provides a sandbox/development API for this delivery service.
   * A sandbox should mimic real functionality as much as possible but MUST NOT incur any actual
   * costs or affect production data.
   */
  public readonly hasSandbox: boolean;

  /**
   * The label formats that are offered for this service
   */
  public readonly labelFormats: ReadonlyArray<DocumentFormat>;

  /**
   * The label dimensions that are used for this service
   */
  public readonly labelSizes: ReadonlyArray<DocumentSize>;

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
    this.fulfillmentService = pojo.fulfillmentService;
    this.serviceArea = pojo.serviceArea;
    this.isConsolidationService = pojo.isConsolidationService || false;
    this.allowsMultiplePackages = pojo.allowsMultiplePackages || false;
    this.isInsurable = pojo.isInsurable || false;
    this.isTrackable = pojo.isTrackable || false;
    this.hasSandbox = pojo.hasSandbox || false;
    this.labelFormats = pojo.labelFormats || [];
    this.labelSizes = pojo.labelSizes || [];
    this.originCountries = pojo.originCountries;
    this.destinationCountries = pojo.destinationCountries;
    this.packaging = pojo.packaging.map((svc) => new Packaging(svc, app));
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
      labelFormats: this.labelFormats as DocumentFormat[],
      labelSizes: this.labelSizes as DocumentSize[],
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
