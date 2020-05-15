import { Address, DateTimeZone } from "../../common";
import { ManifestLocation } from "../../enums";
import { error, ErrorCode } from "../../errors";
import { hideAndFreeze, Joi, _internal } from "../../internal";
import { Carrier } from "../carrier";
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
      shipments: Joi.array().items(ShipmentIdentifier[_internal].schema).required(),
    }),
  };

  //#endregion
  //#region Public Fields

  /**
   * The address of the location that is performaing end-of-day manifesting.
   *
   * NOTE: This field is required if the carrier's `manifestLocations` setting is `single_location`.
   */
  public readonly shipFrom?: Address;

  /**
   * The start-of-day time, or the `shipmentDateTime` of the earliest shipment being manifested.
   */
  public readonly openDateTime: DateTimeZone;

  /**
   * The end-of-day time, or the `shipmentDateTime` of the latest shipment being manifested.
   */
  public readonly closeDateTime: DateTimeZone;

  /**
   * The meaning of this field varies depending on the carrier's `manifestShipments` setting.
   *
   * `all_shipments`: This field must include all shipments that have not yet been manifested.
   *
   * `explicit_shipments`: This field specifies which shipments should be manifested.
   *
   * `exclude_shipments`: This field specifies which shipments should _not_ be manifested.
   * All other shipments will be manifested.
   */
  public readonly shipments: ReadonlyArray<ShipmentIdentifier>;

  //#endregion

  public constructor(pojo: NewManifestPOJO, carrier: Carrier) {
    this.shipFrom = pojo.shipFrom && new Address(pojo.shipFrom);
    this.openDateTime = new DateTimeZone(pojo.openDateTime);
    this.closeDateTime = new DateTimeZone(pojo.closeDateTime);
    this.shipments = pojo.shipments.map((shipment) => new ShipmentIdentifier(shipment));

    switch (carrier.manifestLocations) {
      case ManifestLocation.AllLocations:
        if (pojo.shipFrom) {
          throw error(ErrorCode.InvalidInput,
            `manifest.shipFrom is not allowed because carrier.manifestLocations is ${ManifestLocation.AllLocations}`);
        }
        break;

      case ManifestLocation.SingleLocation:
      default:
        if (!pojo.shipFrom) {
          throw error(ErrorCode.InvalidInput,
            `manifest.shipFrom is required because carrier.manifestLocations is ${ManifestLocation.SingleLocation}`);
        }
    }

    // Make this object immutable
    hideAndFreeze(this);
  }
}

// Prevent modifications to the class
hideAndFreeze(NewManifest);
