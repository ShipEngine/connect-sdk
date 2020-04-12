import { App } from "../app";
import { assert } from "../assert";
import { DeliveryConfirmationConfig, DeliveryServiceConfig, PackagingConfig } from "../config";
import { Country } from "../countries";
import { DeliveryServiceClass, DeliveryServiceGrade, LabelFormat, LabelSize, ManifestType, ServiceArea } from "../enums";
import { UUID } from "../types";
import { Carrier } from "./carrier";
import { DeliveryConfirmation } from "./delivery-confirmation";
import { Packaging } from "./packaging";

/**
 * A delivery service that is offered by a shipping provider
 */
export class DeliveryService {
  //#region Fields

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
  public readonly isConsolidator: boolean;

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
   * All countries that this service ships to or from
   */
  public get countries(): ReadonlyArray<Country> {
    let countries = new Set(this.originCountries.concat(this.destinationCountries));
    return Object.freeze([...countries]);
  }

  //#endregion

  /**
   * Creates a DeliveryService object from a fully-resolved config object
   */
  public constructor(app: App, parent: Carrier, config: DeliveryServiceConfig) {
    this.carrier = parent;
    this.id = app._references.add(this, config, "delivery service");
    this.name = assert.string.nonWhitespace(config.name, "delivery service name");
    this.description = assert.string(config.description, "delivery service description", "");
    this.class = assert.string.enum(config.class, DeliveryServiceClass, "delivery service class");
    this.grade = assert.string.enum(config.grade, DeliveryServiceGrade, "delivery service grade");
    this.serviceArea = config.serviceArea && assert.string.enum(config.serviceArea, ServiceArea, "service area");
    this.isConsolidator = assert.type.boolean(config.isConsolidator, "isConsolidator flag", false);
    this.isReturnService = assert.type.boolean(config.isReturnService, "isReturnService flag", false);
    this.allowsMultiplePackages =
      assert.type.boolean(config.allowsMultiplePackages, "allowsMultiplePackages flag", false);
    this.hasTracking = assert.type.boolean(config.hasTracking, "hasTracking flag", false);
    this.requiresManifest = config.requiresManifest
      ? assert.string.enum(config.requiresManifest, ManifestType, "requiresManifest value")
      : false;
    this.labelFormats = assert.array.ofEnum(config.labelFormats, LabelFormat, "labelFormats", []);
    this.labelSizes = assert.array.ofEnum(config.labelSizes, LabelSize, "labelSizes", []);
    this.originCountries = assert.array.ofEnum(config.originCountries, Country, "originCountries");
    this.destinationCountries = assert.array.ofEnum(config.destinationCountries, Country, "destinationCountries");
    this.packaging = assert.array.nonEmpty(config.packaging, "packaging")
      .map((svc: PackagingConfig) => app._references.get(config) || new Packaging(app, svc));
    this.deliveryConfirmations = assert.array(config.deliveryConfirmations, "deliveryConfirmations", [])
      .map((svc: DeliveryConfirmationConfig) => app._references.get(config) || new DeliveryConfirmation(app, svc));

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
