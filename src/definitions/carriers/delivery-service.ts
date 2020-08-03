import type { Country, DefinitionIdentifier } from "../common";
import type { DeliveryConfirmation } from "./delivery-confirmation";
import type { DeliveryServiceClass, DeliveryServiceGrade, DocumentFormat, DocumentSize, ManifestType, ServiceArea } from "./enums";
import type { Packaging } from "./packaging";

/**
 * A delivery service that is offered by a carrier
 */
export interface DeliveryService extends DefinitionIdentifier {
  /**
   * The user-friendly service name (e.g. "Priority Overnight", "2-Day Air")
   */
  name: string;

  /**
   * A short, user-friendly description of the service
   */
  description: string;

  /**
   * The class of implements Iof service
   */
  class: DeliveryServiceClass;

  /**
   * The grade of service
   */
  grade: DeliveryServiceGrade;

  /**
   * The service area this service covers
   */
  serviceArea?: ServiceArea;

  /**
   * Indicates whether this service is a consolidation of multiple carrier services
   */
  isConsolidationService: boolean;

  /**
   * Indicates whether the service allows multiple packages in a single shipment
   */
  allowsMultiplePackages: boolean;

  /**
   * Indicates whether shippers can purchase insurance from the carrier for this service
   */
  isInsurable: boolean;

  /**
   * Indicates whether tracking numbers are provided
   */
  isTrackable: boolean;

  /**
   * Indicates is return shipments are supported
   */
  supportsReturns: boolean;

  /**
   * Indicates what type of manifests the carrier supports
   */
  manifestType: ManifestType;

  /**
   * Indicates whether the carrier provides a sandbox/development API for this delivery service.
   * A sandbox should mimic real functionality as much as possible but MUST NOT incur any actual
   * costs or affect production data.
   */
  hasSandbox: boolean;

  /**
   * The label formats that are offered for this service
   */
  labelFormats: Array<DocumentFormat>;

  /**
   * The label dimensions that are used for this service
   */
  labelSizes: Array<DocumentSize>;

  /**
   * The countries that can be shipped from using this service
   */
  originCountries: Array<Country>;

  /**
   * The countries that can be shipped to using this service
   */
  destinationCountries: Array<Country>;

  /**
   * The types of packaging that are provided/allowed for this service
   */
  packaging: Array<Packaging>;

  /**
   * The types of package delivery confirmations offered for this service
   */
  deliveryConfirmations: Array<DeliveryConfirmation>;

  /**
   * All countries that this service ships to or from.
   * This list includes all unique origin and destination countries.
   */
  countries: Array<Country>;

  /**
   * Indicates whether the weight may be required when using this service.
   * This property is `true` if any of the service's packaging requires weight.
   */
  requiresWeight: boolean;

  /**
   * Indicates whether the dimensions may be required when using this service.
   * This property is `true` if any of the service's packaging requires dimensions.
   */
  requiresDimensions: boolean;
}
