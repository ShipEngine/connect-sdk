import type { Country, Definition, DefinitionIdentifier, InlineOrReference, InlineOrReferenceArray } from "../common";
import type { DeliveryConfirmation, DeliveryConfirmationDefinition } from "./delivery-confirmation";
import type { DocumentFormat, DocumentSize, ManifestType, ServiceArea } from "./enums";
import type { FulfillmentService } from "./fulfillment-service";
import type { Packaging, PackagingDefinition } from "./packaging";

/**
 * A delivery service that is offered by a carrier
 */
export interface DeliveryServiceDefinition extends Definition {
  /**
   * The user-friendly service name (e.g. "Priority Overnight", "2-Day Air")
   */
  name: string;

  /**
   * A short, user-friendly description of the service
   */
  description?: string;

  /**
   * Code used to map to what the carrier uses to identify the resource
   */
  code: string;

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
   * Indicates what type of manifests the carrier supports
   */
  manifestType?: ManifestType;

  /**
   * Indicates if return shipments are supported
   */
  supportsReturns?: boolean;

  /**
   * The label formats that are offered for this service
   */
  labelFormats?: DocumentFormat[];

  /**
   * The label dimensions that are used for this service
   */
  labelSizes?: DocumentSize[];

  /**
   * The sellers home countries that should have access to this service.
   */
  availableCountries: InlineOrReference<Country[]>;

  /**
   * The types of packaging that are provided/allowed for this service
   */
  packaging: InlineOrReferenceArray<PackagingDefinition>;

  /**
   * The types of package delivery confirmations offered for this service
   */
  deliveryConfirmations?: InlineOrReferenceArray<DeliveryConfirmationDefinition>;
}


/**
 * Identifies a delivery service that is offered by a carrier
 */
export type DeliveryServiceIdentifier = DefinitionIdentifier;

/**
 * Identifies a delivery service that is offered by a carrier
 */
export type DeliveryServiceIdentifierPOJO = Definition;


/**
 * A delivery service that is offered by a carrier
 */
export interface DeliveryService extends DeliveryServiceIdentifier {
  /**
   * The user-friendly service name (e.g. "Priority Overnight", "2-Day Air")
   */
  readonly name: string;

  /**
   * A short, user-friendly description of the service
   */
  readonly description: string;

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
   * Indicates is return shipments are supported
   */
  readonly supportsReturns: boolean;

  /**
   * Indicates what type of manifests the carrier supports
   */
  manifestType?: ManifestType;

  /**
   * The label formats that are offered for this service
   */
  readonly labelFormats: readonly DocumentFormat[];

  /**
   * The label dimensions that are used for this service
   */
  readonly labelSizes: readonly DocumentSize[];

  /**
   * The countries this service should be available for.
   */
  readonly availableCountries: readonly Country[];

  /**
   * The types of packaging that are provided/allowed for this service
   */
  readonly packaging: readonly Packaging[];

  /**
   * The types of package delivery confirmations offered for this service
   */
  readonly deliveryConfirmations: readonly DeliveryConfirmation[];

  /**
   * All countries that this service is available for.
   */
  readonly countries: readonly Country[];

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
