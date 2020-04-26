import { Country } from "../../countries";
import { BilledParty, InsuranceProvider, NonDeliveryAction } from "../../enums";
import { UUID } from "../../types";
import { AddressWithContactInfoPOJO, IdentifierPOJO } from "../common";
import { NewPackagePOJO, PackagePOJO } from "./package-pojo";

/**
 * A shipment that has already been created and assigned identifiers
 */
export type ShipmentPOJO = ShipmentIdentifierPOJO & NewShipmentPOJO & {
  /**
   * The list of packages in the shipment
   */
  packages: PackagePOJO[];
};

/**
 * Identifies a shipment
 */
export interface ShipmentIdentifierPOJO {
  /**
   * The carrier tracking number
   */
  trackingNumber: string;

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
   * The date/time that the package is expected to ship.
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
   * The original (outgoing) shipment that this return shipment is for.
   * This associates the two shipments, which is required by some carriers.
   */
  outboundShipment?: ShipmentIdentifierPOJO;

  /**
   * Indicates whether this is a return shipment
   */
  isReturn?: boolean;

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
