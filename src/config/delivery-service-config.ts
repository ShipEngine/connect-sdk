import { Country } from "../countries";
import { DeliveryServiceClass, DeliveryServiceGrade, LabelFormat, LabelSize, ManifestType } from "../enums";
import { InlineOrReference, InlineOrReferenceArray, UUID } from "../types";
import { CarrierConfig } from "./carrier-config";
import { DeliveryConfirmationConfig } from "./delivery-confirmation-config";
import { PackagingConfig } from "./packaging-config";

/**
 * A delivery service that is offered by a shipping provider
 */
export interface DeliveryServiceConfig {
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
   * The countries that can be shipped from using this service
   */
  originCountries: InlineOrReferenceArray<Country>;

  /**
   * The countries that can be shipped to using this service
   */
  destinationCountries: InlineOrReferenceArray<Country>;

  /**
   * The carrier that provides this service
   */
  carrier: InlineOrReference<CarrierConfig>;

  /**
   * The types of packaging that are provided/allowed for this service
   */
  packaging: InlineOrReferenceArray<PackagingConfig>;

  /**
   * The types of package delivery confirmations offered for this service
   */
  deliveryConfirmations?: InlineOrReferenceArray<DeliveryConfirmationConfig>;

  /**
   * The label formats that are offered for this service
   */
  labelFormats?: LabelFormat[];

  /**
   * The label dimensions that are used for this service
   */
  labelSizes?: LabelSize[];

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
   * Indicates whether this service requires a manifest, and if so, what type
   */
  requiresManifest?: false | ManifestType;
}
