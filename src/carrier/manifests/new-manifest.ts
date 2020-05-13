import { Address, DateTimeZone } from "../../common";
import { hideAndFreeze, Joi, _internal } from "../../internal";
import { ShipmentIdentifier } from "../shipments/shipment-identifier";
import { NewManifestPOJO } from "./new-manifest-pojo";


/**
 * The information needed to create an end-of-day manifest
 */
export class NewManifest {
  //#region Private/Internal Fields

  /** @internal */
  public static readonly [_internal] = {
    label: "manifest",
    schema: Joi.object({
      shipFrom: Address[_internal].schema.required(),
      openDateTime: DateTimeZone[_internal].schema.required(),
      closeDateTime: DateTimeZone[_internal].schema.required(),
      includedShipments: Joi.array().min(1).items(ShipmentIdentifier[_internal].schema).required(),
      excludedShipments: Joi.array().min(1).items(ShipmentIdentifier[_internal].schema),
    }),
  };

  //#endregion
  //#region Public Fields

  /**
   * The address where all the shipments are being shipped from
   */
  public readonly shipFrom: Address;

  /**
   * The start-of-day time, or the `shipmentDateTime` of the earliest shipment being manifested.
   */
  public readonly openDateTime: DateTimeZone;

  /**
   * The end-of-day time, or the `shipmentDateTime` of the latest shipment being manifested.
   */
  public readonly closeDateTime: DateTimeZone;

  /**
   * The shipments to be manifested
   */
  public readonly includedShipments: ReadonlyArray<ShipmentIdentifier>;

  /**
   * Shipments that should explicitly be excluded from the manifest.
   * This is necessary for carriers that auto-manifest all of the day's shipments.
   */
  public readonly excludedShipments?: ReadonlyArray<ShipmentIdentifier>;


  //#endregion

  public constructor(pojo: NewManifestPOJO) {
    this.shipFrom = new Address(pojo.shipFrom);
    this.openDateTime = new DateTimeZone(pojo.openDateTime);
    this.closeDateTime = new DateTimeZone(pojo.closeDateTime);
    this.includedShipments = pojo.includedShipments.map((shipment) => new ShipmentIdentifier(shipment));
    this.excludedShipments = pojo.excludedShipments
      && pojo.excludedShipments.map((shipment) => new ShipmentIdentifier(shipment));

    // Make this object immutable
    hideAndFreeze(this);
  }
}

// Prevent modifications to the class
hideAndFreeze(NewManifest);
