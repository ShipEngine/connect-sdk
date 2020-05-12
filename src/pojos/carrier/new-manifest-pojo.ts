import { AddressPOJO, DateTimeZonePOJO } from "../common";
import { ShipmentIdentifierPOJO } from "./shipment-identifier-pojo";

/**
 * The information needed to create an end-of-day manifest
 */
export interface NewManifestPOJO {
  /**
   * The address where all the shipments are being shipped from
   */
  shipFrom: AddressPOJO;

  /**
   * The start-of-day time, or the `shipmentDateTime` of the earliest shipment being manifested.
   */
  openDateTime: DateTimeZonePOJO | Date | string;

  /**
   * The end-of-day time, or the `shipmentDateTime` of the latest shipment being manifested.
   */
  closeDateTime: DateTimeZonePOJO | Date | string;

  /**
   * The shipments to be manifested
   */
  includedShipments: ShipmentIdentifierPOJO[];

  /**
   * Shipments that should explicitly be excluded from the manifest.
   * This is necessary for carriers that auto-manifest all of the day's shipments.
   */
  excludedShipments?: ShipmentIdentifierPOJO[];
}
