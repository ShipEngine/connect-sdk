import { assert } from "../assert";
import { CarrierConfig, DeliveryConfirmationConfig, DeliveryServiceConfig, PackagingConfig } from "../config";
import { Country } from "../countries";
import { DeliveryServiceClass, DeliveryServiceGrade, LabelFormat, LabelSize, ManifestType } from "../enums";
import { UUID } from "../types";
import { Carrier } from "./carrier";
import { DeliveryConfirmation } from "./delivery-confirmation";
import { Packaging } from "./packaging";

/**
 * A delivery service that is offered by a shipping provider
 */
export class DeliveryService {
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
   * The countries that can be shipped from using this service
   */
  public readonly originCountries: Country[];

  /**
   * The countries that can be shipped to using this service
   */
  public readonly destinationCountries: Country[];

  /**
   * The carrier that provides this service
   */
  public readonly carrier: Carrier;

  /**
   * The types of packaging that are provided/allowed for this service
   */
  public readonly packaging: Packaging[];

  /**
   * The types of package delivery confirmations offered for this service
   */
  public readonly deliveryConfirmations: DeliveryConfirmation[];

  /**
   * The label formats that are offered for this service
   */
  public readonly labelFormats: LabelFormat[];

  /**
   * The label dimensions that are used for this service
   */
  public readonly labelSizes: LabelSize[];

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
   * Creates a DeliveryService object from a fully-resolved config object
   */
  public constructor(config: DeliveryServiceConfig) {
    assert.type.object(config, "delivery service");
    this.id = assert.string.uuid(config.id, "delivery service ID");
    this.name = assert.string.nonWhitespace(config.name, "delivery service name");
    this.description = assert.string(config.description, "delivery service description", "");
    this.class = assert.string.enum(config.class, DeliveryServiceClass, "delivery service class");
    this.grade = assert.string.enum(config.grade, DeliveryServiceGrade, "delivery service grade");
    this.originCountries = assert.array.ofEnum(config.originCountries, Country, "originCountries");
    this.destinationCountries = assert.array.ofEnum(config.destinationCountries, Country, "destinationCountries");
    this.carrier = new Carrier(config.carrier as CarrierConfig);
    this.packaging = assert.array.nonEmpty(config.packaging, "packaging")
      .map((svc: PackagingConfig) => new Packaging(svc));
    this.deliveryConfirmations = assert.array(config.deliveryConfirmations, "deliveryConfirmations", [])
      .map((svc: DeliveryConfirmationConfig) => new DeliveryConfirmation(svc));
    this.labelFormats = assert.array.ofEnum(config.labelFormats, LabelFormat, "labelFormats", []);
    this.labelSizes = assert.array.ofEnum(config.labelSizes, LabelSize, "labelSizes", []);
    this.isReturnService = assert.type.boolean(config.isReturnService, "isReturnService flag", false);
    this.allowsMultiplePackages =
      assert.type.boolean(config.allowsMultiplePackages, "allowsMultiplePackages flag", false);
    this.hasTracking = assert.type.boolean(config.hasTracking, "hasTracking flag", false);
    this.requiresManifest = config.requiresManifest === false ? false
      : assert.string.enum(config.requiresManifest, ManifestType, "requiresManifest value");

    // Prevent modifications after validation
    Object.freeze(this);
    Object.freeze(this.originCountries);
    Object.freeze(this.destinationCountries);
    Object.freeze(this.packaging);
    Object.freeze(this.deliveryConfirmations);
    Object.freeze(this.labelFormats);
    Object.freeze(this.labelSizes);
  }
  
}
