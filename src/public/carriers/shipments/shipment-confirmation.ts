import type { Charge, ChargePOJO, DateTimeZone, DateTimeZonePOJO, MonetaryValue, TimeRange, TimeRangePOJO, URLString } from "../../common";
import type { FulfillmentService } from "../fulfillment-service";
import type { PackageConfirmation, PackageConfirmationPOJO } from "../packages/package-confirmation";
import type { ShipmentIdentifier, ShipmentIdentifierPOJO } from "./shipment-identifier";

/**
 * Confirmation that a shipment has been created
 */
export interface ShipmentConfirmationPOJO extends ShipmentIdentifierPOJO {

  /**
   * If the shipment is being fulfilled using a well-known third-party carrier, such as UPS, FedEx, DHL, etc.
   * then specify the carrier service here.
   */
  fulfillmentService?: FulfillmentService;

  /**
   * The estimated date and time the shipment will be delivered
   */
  deliveryDateTime?: DateTimeZonePOJO | Date | string;

  /**
   * The minimum number of days delivery will take
   */
  minimumDeliveryDays?: number;

  /**
   * The maximum number of days delivery will take
   */
  maximumDeliveryDays?: number;

  /**
   * The expected delivery window
   */
  deliveryWindow?: TimeRangePOJO;

  /**
   * Certain carriers base their rates off of zone numbers that vary based on the origin and destination
   *
   * @see https://stamps.custhelp.com/app/answers/detail/a_id/6118/~/all-about-usps-postal-zones
   */
  zone?: number;

  /**
   * Indicates whether this shipment used a pre-negotiated terms
   */
  isNegotiatedRate?: boolean;

  /**
   * Indicates whether the carrier guarantees delivery by the `deliveryDateTime`
   */
  isGuaranteed?: boolean;

  /**
   * The breakdown of charges for this shipment.
   * If the carrier does not provide a detailed breakdown, then just use a single
   * charge of type "shipping".
   */
  charges: ReadonlyArray<ChargePOJO>;

  /**
   * Confirmation details about each package in the shipment
   */
  packages: ReadonlyArray<PackageConfirmationPOJO>;

  /**
   * Arbitrary data about this shipment that will be persisted by the ShipEngine Integration Platform.
   * Must be JSON serializable.
   */
  metadata?: object;
}


/**
 * Confirmation that a shipment has been created
 */
export interface ShipmentConfirmation extends ShipmentIdentifier {
  /**
   * A well-known carrier service that's being used to fulfill this shipment
   */
  readonly fulfillmentService?: FulfillmentService;

  /**
   * The estimated date and time the shipment will be delivered
   */
  readonly deliveryDateTime?: DateTimeZone;

  /**
   * The minimum number of days delivery will take
   */
  readonly minimumDeliveryDays?: number;

  /**
   * The maximum number of days delivery will take
   */
  readonly maximumDeliveryDays?: number;

  /**
   * The expected delivery window
   */
  readonly deliveryWindow?: TimeRange;

  /**
   * Certain carriers base their rates off of zone numbers that vary based on the origin and destination
   *
   * @see https://stamps.custhelp.com/app/answers/detail/a_id/6118/~/all-about-usps-postal-zones
   */
  readonly zone?: number;

  /**
   * Indicates whether this shipment used a pre-negotiated terms
   */
  readonly isNegotiatedRate: boolean;

  /**
   * Indicates whether the carrier guarantees delivery by the `deliveryDateTime`
   */
  readonly isGuaranteed: boolean;

  /**
   * Indicates whether tracking numbers are provided
   */
  readonly isTrackable: boolean;

  /**
   * The breakdown of charges for this shipment.
   * If the carrier does not provide a detailed breakdown, then just use a single
   * charge of type "shipping".
   */
  readonly charges: ReadonlyArray<Charge>;

  /**
   * The total cost of all charges for this label
   */
  readonly totalAmount: MonetaryValue;

  /**
   * Confirmation details about each package in the shipment
   */
  readonly packages: ReadonlyArray<PackageConfirmation>;

  /**
   * Returns the first package in the `packages` array.
   * Useful for carriers that only support single-piece shipments.
   */
  readonly package: PackageConfirmation;

  /**
   * Arbitrary data about this shipment that will be persisted by the ShipEngine Integration Platform.
   * Must be JSON serializable.
   */
  readonly metadata: object;
}
