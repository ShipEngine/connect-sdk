import type { Country, DefinitionIdentifier, DefinitionIdentifierPOJO, InlineOrReference, InlineOrReferenceArray, Localizable, LocalizationDefinition, LocalizationPOJO, LocalizedInfoPOJO } from "../common";
import type { DeliveryConfirmation, DeliveryConfirmationDefinition, DeliveryConfirmationPOJO } from "./delivery-confirmation";
import type { DeliveryServiceClass, DeliveryServiceGrade, DocumentFormat, DocumentSize, ServiceArea } from "./enums";
import type { FulfillmentService } from "./fulfillment-service";
import type { Packaging, PackagingDefinition, PackagingPOJO } from "./packaging";

/**
 * A delivery service that is offered by a carrier
 */
export interface DeliveryServiceDefinition extends DefinitionIdentifierPOJO {
  /**
   * The user-friendly service name (e.g. "Priority Overnight", "2-Day Air")
   */
  name: string;

  /**
   * A short, user-friendly description of the service
   */
  description?: string;

  /**
   * The class of implements Iof service
   */
  class: DeliveryServiceClass;

  /**
   * The grade of service
   */
  grade: DeliveryServiceGrade;

  /**
   * If this service is fulfilled using a well-known third-party carrier, such as UPS, FedEx, DHL, etc.
   * then specify the carrier service here. This will allow more shippers to discover and use your service.
   */
  fulfillmentService?: FulfillmentService;

  /**
   * The service area this service covers
   */
  serviceArea?: ServiceArea;

  /**
   * Indicates whether this service is a consolidation of multiple carrier services
   */
  isConsolidationService?: boolean;

  /**
   * Indicates whether the service allows multiple packages in a single shipment
   */
  allowsMultiplePackages?: boolean;

  /**
   * Indicates whether shippers can purchase insurance from the carrier for this service
   */
  isInsurable?: boolean;

  /**
   * Indicates whether tracking numbers are provided
   */
  isTrackable?: boolean;

  /**
   * Indicates whether the carrier provides a sandbox/development API for this delivery service.
   * A sandbox should mimic real functionality as much as possible but MUST NOT incur any actual
   * costs or affect production data.
   */
  hasSandbox?: boolean;

  /**
   * The label formats that are offered for this service
   */
  labelFormats?: DocumentFormat[];

  /**
   * The label dimensions that are used for this service
   */
  labelSizes?: DocumentSize[];

  /**
   * The countries that can be shipped from using this service
   */
  originCountries: InlineOrReference<Country[]>;

  /**
   * The countries that can be shipped to using this service
   */
  destinationCountries: InlineOrReference<Country[]>;

  /**
   * The types of packaging that are provided/allowed for this service
   */
  packaging: InlineOrReferenceArray<PackagingDefinition>;

  /**
   * The types of package delivery confirmations offered for this service
   */
  deliveryConfirmations?: InlineOrReferenceArray<DeliveryConfirmationDefinition>;

  /**
   * Localizaed values for fields that allow localization
   */
  localization?: InlineOrReference<LocalizationDefinition<{
    name?: string;
    description?: string;
  }>>;
}


/**
 * A delivery service that is offered by a carrier
 */
export interface DeliveryServicePOJO extends DeliveryServiceDefinition {
  originCountries: Country[];
  destinationCountries: Country[];
  packaging: ReadonlyArray<PackagingPOJO>;
  deliveryConfirmations?: ReadonlyArray<DeliveryConfirmationPOJO>;
  localization?: LocalizationPOJO<LocalizedInfoPOJO>;
}


/**
 * Identifies a delivery service that is offered by a carrier
 */
export type DeliveryServiceIdentifierPOJO = DefinitionIdentifierPOJO;


/**
 * A delivery service that is offered by a carrier
 */
export interface DeliveryService extends DefinitionIdentifier, Localizable<DeliveryService, DeliveryServicePOJO> {
  /**
   * The user-friendly service name (e.g. "Priority Overnight", "2-Day Air")
   */
  readonly name: string;

  /**
   * A short, user-friendly description of the service
   */
  readonly description: string;

  /**
   * The class of implements Iof service
   */
  readonly class: DeliveryServiceClass;

  /**
   * The grade of service
   */
  readonly grade: DeliveryServiceGrade;

  /**
   * A well-known service that's used to fulfill this delivery service
   */
  readonly fulfillmentService?: FulfillmentService;

  /**
   * The service area this service covers
   */
  readonly serviceArea?: ServiceArea;

  /**
   * Indicates whether this service is a consolidation of multiple carrier services
   */
  readonly isConsolidationService: boolean;

  /**
   * Indicates whether the service allows multiple packages in a single shipment
   */
  readonly allowsMultiplePackages: boolean;

  /**
   * Indicates whether shippers can purchase insurance from the carrier for this service
   */
  readonly isInsurable: boolean;

  /**
   * Indicates whether tracking numbers are provided
   */
  readonly isTrackable: boolean;

  /**
   * Indicates whether the carrier provides a sandbox/development API for this delivery service.
   * A sandbox should mimic real functionality as much as possible but MUST NOT incur any actual
   * costs or affect production data.
   */
  readonly hasSandbox: boolean;

  /**
   * The label formats that are offered for this service
   */
  readonly labelFormats: ReadonlyArray<DocumentFormat>;

  /**
   * The label dimensions that are used for this service
   */
  readonly labelSizes: ReadonlyArray<DocumentSize>;

  /**
   * The countries that can be shipped from using this service
   */
  readonly originCountries: ReadonlyArray<Country>;

  /**
   * The countries that can be shipped to using this service
   */
  readonly destinationCountries: ReadonlyArray<Country>;

  /**
   * The types of packaging that are provided/allowed for this service
   */
  readonly packaging: ReadonlyArray<Packaging>;

  /**
   * The types of package delivery confirmations offered for this service
   */
  readonly deliveryConfirmations: ReadonlyArray<DeliveryConfirmation>;

  /**
   * All countries that this service ships to or from.
   * This list includes all unique origin and destination countries.
   */
  readonly countries: ReadonlyArray<Country>;

  /**
   * Indicates whether the weight may be required when using this service.
   * This property is `true` if any of the service's packaging requires weight.
   */
  readonly requiresWeight: boolean;

  /**
   * Indicates whether the dimensions may be required when using this service.
   * This property is `true` if any of the service's packaging requires dimensions.
   */
  readonly requiresDimensions: boolean;
}
