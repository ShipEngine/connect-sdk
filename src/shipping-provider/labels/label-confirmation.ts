import { assert } from "../../assert";
import { LabelConfirmationConfig } from "../../config/label-confirmation-config";
import { Label } from "./label";
import { ShippingCharge } from "./shipping-charge";

/**
 * Confirms the successful creation of a shipping label
 */
export class LabelConfirmation {
  /**
   * The carrier's confirmation ID for this transaction
   */
  public readonly confirmationID?: string;

  /**
   * The master tracking number for the entire shipment.
   * For single-piece shipments, this will be the same as the label tracking number.
   * For multi-piece shipments, this may be a separate tracking number, or the same
   * tracking number as one of the packages.
   */
  public readonly shipmentTrackingNumber?: string;

  /**
   * The estimated date and time for when the shipment will be delivered.
   */
  public readonly estimatedDeliveryDateTime?: Date;

  /**
   * The breakdown of charges in the total shipping cost for this label.
   * If the carrier does not provide a detailed breakdown, then just use a single
   * charge of type "shipping".
   */
  public readonly charges: ShippingCharge[];

  /**
   * The shipping labels that were created
   */
  public readonly labels: Label[];

  /**
   * Creates a LabelConfirmation from a config object
   */
  public constructor(config: LabelConfirmationConfig) {
    assert.type.object(config, "label confirmation");
    this.confirmationID = config.confirmationID
      && assert.string.nonWhitespace(config.confirmationID, "confirmation ID");
    this.shipmentTrackingNumber = config.shipmentTrackingNumber
      && assert.string.nonWhitespace(config.shipmentTrackingNumber, "shipment tracking number");
    this.estimatedDeliveryDateTime = config.estimatedDeliveryDateTime
      && assert.type.date(config.estimatedDeliveryDateTime, "estimated delivery date/time");
    this.charges = assert.array.nonEmpty(config.charges, "shipping charges")
      .map((charge) => new ShippingCharge(charge));
    this.labels = assert.array.nonEmpty(config.labels, "labels").map((label) => new Label(label));

    // Prevent modifications after validation
    Object.freeze(this);
  }
}
