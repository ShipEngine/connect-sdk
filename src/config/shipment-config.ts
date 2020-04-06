import { Country } from "../countries";
import { BilledParty, InsuranceProvider, NonDeliveryAction } from "../enums";
import { Identifier, UUID } from "../types";
import { MonetaryValueConfig } from "./measures-config";
import { NewPackageConfig, PackageConfig } from "./package-config";

/**
 * A shipment that has already been created and assigned identifiers
 */
export type ShipmentConfig = ShipmentIdentifierConfig & NewShipmentConfig & {
  /**
   * The list of packages in the shipment
   */
  packages: PackageConfig[];
};

/**
 * Identifies a shipment
 */
export interface ShipmentIdentifierConfig {
  /**
   * The carrier tracking number
   */
  trackingNumber: string;

  /**
   * Alternative identifiers associated with this shipment
   */
  identifiers?: Identifier[];
}

/**
 * A shipment that has not yet been created and has no identifiers yet
 */
export interface NewShipmentConfig {
  /**
   * The ID of the delivery service to use
   */
  deliveryServiceID: UUID;

  /**
   * The ID of the requested delivery confirmation
   */
  deliveryConfirmationID?: UUID;

  /**
   * The date/time that the package is expected to ship.
   * This is not guaranteed to be in the future.
   */
  shipmentDate: Date;

  /**
   * Indicates how a non-deliverable package should be handled
   */
  nonDeliveryAction: NonDeliveryAction;

  /**
   * TODO: What about Sunday delivery? Wouldn't Saturday/Sunday delivery be determined by the service used?
   */
  // allowSaturdayDelivery?: boolean;

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
   * Information about the insurance for the shipment.
   * If `undefined`, then the shipment is uninsured.
   */
  insurance?: {
    /**
     * Which party will be insuring the shipment
     */
    provider: InsuranceProvider;

    /**
     * The total insured value of the shipment.
     * This is the sum of the insured value of each package.
     */
    amount: MonetaryValueConfig;
  };

  /**
   * Information that is specific to return shipments.
   * If `undefined`, then the shipment is not a return.
   */
  return?: {
    /**
     * The original (outgoing) shipment that this return shipment is for.
     * This associates the two shipments, which is required by some carriers.
     * This field is `undefined` if the outbound shipment was not specified.
     */
    outboundShipment?: ShipmentIdentifierConfig;

    /**
     * The Return Merchandise Authorization number, if any.
     */
    rmaNumber?: string;
  };

  /**
   * The list of packages in the shipment
   */
  packages: NewPackageConfig[];
}
