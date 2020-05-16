import { App } from "../../common";
import { hideAndFreeze, Joi, _internal } from "../../internal";
import { DeliveryService } from "../delivery-service";
import { ShipmentIdentifier, shipmentIdentifierMixin } from "../shipments/shipment-identifier";
import { PickupPackage } from "./pickup-package";
import { PickupShipmentPOJO } from "./pickup-shipment-pojo";


/**
 * The shipment information needed to schedule a pickup
 */
export class PickupShipment extends shipmentIdentifierMixin() {
  //#region Private/Internal Fields

  /** @internal */
  public static readonly [_internal] = {
    label: "shipment",
    schema: ShipmentIdentifier[_internal].schema.keys({
      deliveryServiceID: Joi.string().uuid().required(),
      metadata: Joi.object(),
      packages: Joi.array().min(1).items(PickupPackage[_internal].schema).required(),
    }),
  };

  //#endregion
  //#region Public Fields

  /**
   * The delivery service to use
   */
  public readonly deliveryService: DeliveryService;

  /**
   * Arbitrary data about this shipment that was previously persisted by the ShipEngine Platform.
   */
  public readonly metadata: object;

  /**
   * The list of packages in the shipment
   */
  public readonly packages: ReadonlyArray<PickupPackage>;

  /**
   * Returns the first package in the `packages` array.
   * Useful for carriers that only support single-piece shipments.
   */
  public get package(): PickupPackage {
    return this.packages[0];
  }

  //#endregion

  public constructor(pojo: PickupShipmentPOJO, app: App) {
    super(pojo);

    this.deliveryService = app[_internal].references.lookup(pojo.deliveryServiceID, DeliveryService);
    this.metadata = pojo.metadata || {};
    this.packages = pojo.packages.map((parcel) => new PickupPackage(parcel, app));

    // Make this object immutable
    hideAndFreeze(this);
  }
}

// Prevent modifications to the class
hideAndFreeze(PickupShipment);
