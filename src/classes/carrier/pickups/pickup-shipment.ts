import { hideAndFreeze, Joi, _internal } from "../../../internal";
import { PickupShipmentPOJO } from "../../../pojos/carrier";
import { App } from "../../common/app";
import { DeliveryService } from "../delivery-service";
import { ShipmentIdentifier, shipmentIdentifierMixin } from "../shipments/shipment-identifier";
import { PickupPackage } from "./pickup-package";


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
