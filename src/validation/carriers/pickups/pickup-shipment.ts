import { PickupShipment as IPickupShipment, PickupShipment as PickupShipmentPOJO } from "../../../definitions";
import { App, DefinitionIdentifier, hideAndFreeze, Joi, _internal } from "../../common";
import { DeliveryService } from "../delivery-service";
import { ShipmentIdentifier, ShipmentIdentifierBase } from "../shipments/shipment-identifier";
import { PickupPackage } from "./pickup-package";

export class PickupShipment extends ShipmentIdentifierBase implements IPickupShipment {
  public static [_internal] = {
    label: "shipment",
    schema: ShipmentIdentifier[_internal].schema.keys({
      deliveryService: Joi.alternatives(
        DefinitionIdentifier[_internal].schema.unknown(true),
        Joi.string()
      ).required(),
      metadata: Joi.object(),
      packages: Joi.array().min(1).items(PickupPackage[_internal].schema).required(),
    }),
  };

  public deliveryService: DeliveryService;
  public metadata: object;
  public packages: Array<PickupPackage>;

  public get package(): PickupPackage {
    return this.packages[0];
  }

  public constructor(pojo: PickupShipmentPOJO, app: App) {
    super(pojo);

    this.deliveryService = app[_internal].references.lookup(pojo.deliveryService, DeliveryService);
    this.metadata = pojo.metadata || {};
    this.packages = pojo.packages.map((parcel) => new PickupPackage(parcel, app));

    // Make this object immutable
    hideAndFreeze(this);
  }
}
