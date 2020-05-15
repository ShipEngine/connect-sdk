import { AddressWithContactInfoPOJO, DateTimeZonePOJO } from "../../common";
import { BilledParty, Country } from "../../enums";
import { UUID } from "../../types";
import { NewPackagePOJO } from "../packages/new-package-pojo";
import { ShipmentIdentifierPOJO } from "./shipment-identifier";

/**
 * The information needed to create a new shipment
 */
export interface NewShipmentPOJO {
  /**
   * The ID of the delivery service to use
   */
  deliveryServiceID: UUID;

  /**
   * The ID of the requested delivery confirmation
   */
  deliveryConfirmationID?: UUID;

  /**
   * The sender's contact info and address
   */
  shipFrom: AddressWithContactInfoPOJO;

  /**
   * The recipient's contact info and address
   */
  shipTo: AddressWithContactInfoPOJO;

  /**
   * The return address. Defaults to the `shipFrom` address
   */
  returnTo?: AddressWithContactInfoPOJO;

  /**
   * The date/time that the shipment is expected to ship.
   * This is not guaranteed to be in the future.
   */
  shipDateTime: DateTimeZonePOJO | Date | string;

  /**
   * Return shipment details. If `undefined`, then it is assumed that the shipment is not a return.
   */
  returns?: {
    /**
     * Indicates whether this is a return shipment
     */
    isReturn?: boolean;

    /**
     * A return merchandise authorization (RMA) is an associated number assigned to process the return,
     * this number is often printed on the label, and used when the original shipper processes the inbound return.
     */
    rmaNumber?: string;

    /**
     * The original (outgoing) shipment that this return shipment is for.
     * This associates the two shipments, which is required by some carriers.
     */
    outboundShipment?: ShipmentIdentifierPOJO;
  };

  /**
   * Billing details. If `undefined`, then the sender is billed for all shipping costs.
   */
  billing?: {
    /**
     * Indicates who customs duties are billed to. Defaults to the sender
     */
    dutiesPaidBy?: BilledParty;

    /**
     * Indicates who delivery charges are billed to. Defaults to the sender
     */
    deliveryPaidBy?: BilledParty;

    /**
     * The account number of the third-party that is responsible for shipping costs
     */
    account?: string;

    /**
     * The postal code of the third-party that is responsible for shipping costs
     */
    postalCode?: string;

    /**
     * The country of the third-party that is responsible for shipping costs
     */
    country?: Country;
  };

  /**
   * The list of packages in the shipment
   */
  packages: NewPackagePOJO[];
}
