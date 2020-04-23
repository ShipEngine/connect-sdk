import { Country } from "../../countries";
import { DeliveryServiceClass, DeliveryServiceGrade, LabelFormat, LabelSize, ManifestType, ServiceArea } from "../../enums";
import { InlineOrReference, InlineOrReferenceArray, UUID } from "../../types";
import { DeliveryConfirmationDefinition } from "./delivery-confirmation-definition";
import { PackagingDefinition } from "./packaging-definition";

/**
 * A delivery service that is offered by a shipping provider
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
   * The service area this service covers
   */
  serviceArea?: ServiceArea;

  /**
   * Indicates whether this service is a consolidation of multiple carrier services
   */
  isConsolidator?: boolean;

  /**
   * TODO: Does this mean that the service is ONLY for return shipping? Or that it ALSO supports return shipping?
   */
  isReturnService?: boolean;

  /**
   * Indicates whether the service allows multiple packages in a single shipment
   */
  allowsMultiplePackages?: boolean;

  /**
   * Indicates whether a tracking number is provided
   */
  hasTracking?: boolean;

  /**
   * Indicates whether the carrier provides a sandbox/development API for this delivery service.
   * A sandbox should mimic real functionality as much as possible but MUST NOT incur any actual
   * costs or affect production data.
   */
  hasSandbox?: boolean;

  /**
   * Indicates whether this service requires a manifest, and if so, what type
   */
  requiresManifest?: false | ManifestType;

  /**
   * The label formats that are offered for this service
   */
  labelFormats?: LabelFormat[];

  /**
   * The label dimensions that are used for this service
   */
  labelSizes?: LabelSize[];

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
}
