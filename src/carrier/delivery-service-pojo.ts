import { LocalizationDefinition, LocalizationPOJO, LocalizedInfoPOJO } from "../common";
import { Country, DeliveryServiceClass, DeliveryServiceGrade, DocumentFormat, DocumentSize, FulfillmentService, ServiceArea } from "../enums";
import { InlineOrReference, InlineOrReferenceArray, UUID } from "../types";
import { DeliveryConfirmationDefinition, DeliveryConfirmationPOJO } from "./delivery-confirmation-pojo";
import { PackagingDefinition, PackagingPOJO } from "./packaging-pojo";

/**
 * A delivery service that is offered by a carrier
 */
export interface DeliveryServicePOJO extends DeliveryServiceDefinition {
  originCountries: Country[];
  destinationCountries: Country[];
  packaging: PackagingPOJO[];
  deliveryConfirmations?: DeliveryConfirmationPOJO[];
  localization?: LocalizationPOJO<LocalizedInfoPOJO>;
}

/**
 * A delivery service that is offered by a carrier
 */
export interface DeliveryServiceDefinition {
  /**
   * A UUID that uniquely identifies the delivery service.
   * This ID should never change, even if the service name changes.
   */
  id: UUID;

  /**
   * The user-friendly service name (e.g. "Priority Overnight", "2-Day Air")
   */
  name: string;

  /**
   * A short, user-friendly description of the service
   */
  description?: string;

  /**
   * The class of service
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
