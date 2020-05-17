import { DateTimeZonePOJO, TimeRangePOJO } from "../../common";
import { URLString } from "../../types";
import { FulfillmentService } from "../fulfillment-service";
import { PackageConfirmationPOJO } from "../packages/package-confirmation";
import { ShippingChargePOJO } from "../shipping-charge-pojo";
import { ShipmentIdentifierPOJO } from "./shipment-identifier";

/**
 * Confirmation that a shipment has been created
 */
export interface ShipmentConfirmationPOJO extends ShipmentIdentifierPOJO {
  /**
   * The URL of a webpage where the customer can track the shipment
   */
  trackingURL?: URLString | URL;

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
  charges: ShippingChargePOJO[];

  /**
   * Confirmation details about each package in the shipment
   */
  packages: PackageConfirmationPOJO[];

  /**
   * Arbitrary data about this shipment that will be persisted by the ShipEngine Integration Platform.
   * Must be JSON serializable.
   */
  metadata?: object;
}
