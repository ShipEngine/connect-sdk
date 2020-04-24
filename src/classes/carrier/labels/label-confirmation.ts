import { assert } from "../../../assert";
import { LabelConfirmationPOJO } from "../../../pojos";
import { MonetaryValue } from "../../monetary-value";
import { calculateTotalCharges } from "../utils";
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
  public readonly charges: ReadonlyArray<ShippingCharge>;

  /**
   * The total cost of all charges for this label.
   */
  public readonly totalAmount: MonetaryValue;

  /**
   * The shipping labels that were created
   */
  public readonly labels: ReadonlyArray<Label>;

  public constructor(pojo: LabelConfirmationPOJO) {
    assert.type.object(pojo, "label confirmation");
    this.confirmationID = pojo.confirmationID
      && assert.string.nonWhitespace(pojo.confirmationID, "confirmation ID");
    this.shipmentTrackingNumber = pojo.shipmentTrackingNumber
      && assert.string.nonWhitespace(pojo.shipmentTrackingNumber, "shipment tracking number");
    this.estimatedDeliveryDateTime = pojo.estimatedDeliveryDateTime
      && assert.type.date(pojo.estimatedDeliveryDateTime, "estimated delivery date/time");
    this.charges = assert.array.nonEmpty(pojo.charges, "shipping charges")
      .map((charge) => new ShippingCharge(charge));
    this.totalAmount = calculateTotalCharges(this.charges);
    this.labels = assert.array.nonEmpty(pojo.labels, "labels").map((label) => new Label(label));

    // Prevent modifications after validation
    Object.freeze(this);
  }
}
