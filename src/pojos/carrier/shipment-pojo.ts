import { BilledParty, Country, FulfillmentService, InsuranceProvider, NonDeliveryAction } from "../../enums";
import { URLString, UUID } from "../../types";
import { AddressWithContactInfoPOJO, CustomDataPOJO, IdentifierPOJO } from "../common";
import { NewPackagePOJO, PackagePOJO } from "./package-pojo";

/**
 * A complete shipment that already exists and has identifiers
 */
export interface ShipmentPOJO extends ShipmentIdentifierPOJO, NewShipmentPOJO {
  /**
   * The URL of a webpage where the customer can track the shipment
   */
  trackingURL?: URLString | URL;

  /**
   * A well-known carrier service that's being used to fulfill this shipment
   */
  fulfillmentService?: FulfillmentService;

  /**
   * The estimated date and time the shipment will be delivered
   */
  deliveryDateTime?: Date;

  /**
   * The list of packages in the shipment
   */
  packages: PackagePOJO[];

  /**
   * Arbitrary data that was returned for the shipment when the label was created.
   */
  customData?: CustomDataPOJO;
}

/**
 * Identifies a shipment
 */
export interface ShipmentIdentifierPOJO {
  /**
   * The master tracking number for the entire shipment.
   * For single-piece shipments, this will be the same as the package tracking number.
   * For multi-piece shipments, this may be a separate tracking number, or the same
   * tracking number as one of the packages.
   */
  trackingNumber?: string;

  /**
   * Alternative identifiers associated with this shipment
   */
  identifiers?: IdentifierPOJO[];
}

/**
 * A shipment that has not yet been created and has no identifiers yet
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
  shipDateTime: Date;

  /**
   * Indicates how a non-deliverable package should be handled
   */
  nonDeliveryAction: NonDeliveryAction;

  /**
   * Which party will be insuring the shipment. Defaults to carrier-provided insurance.
   */
  insuranceProvider?: InsuranceProvider;

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
