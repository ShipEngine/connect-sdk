import { FulfillmentService } from "../../../enums";
import { hideAndFreeze, Joi, _internal } from "../../../internal";
import { ShipmentConfirmationPOJO } from "../../../pojos/carrier";
import { CustomData } from "../../common";
import { PackageConfirmation } from "../packages/package-confirmation";
import { ShipmentIdentifier, shipmentIdentifierMixin } from "./shipment-identifier";

/**
 * Confirmation that a shipment has been created
 */
export class ShipmentConfirmation extends shipmentIdentifierMixin() {
  //#region Private/Internal Fields

  /** @internal */
  public static readonly [_internal] = {
    label: "shipment",
    schema: ShipmentIdentifier[_internal].schema.keys({
      trackingURL: Joi.alternatives(Joi.object().website(), Joi.string().website()),
      fulfillmentService: Joi.string().enum(FulfillmentService),
      deliveryDateTime: Joi.date(),
      packages: Joi.array().min(1).items(PackageConfirmation[_internal].schema).required(),
      customData: CustomData[_internal].schema,
    }),
  };

  //#endregion
  //#region Public Fields

  /**
   * The URL of a webpage where the customer can track the shipment
   */
  public readonly trackingURL?: URL;

  /**
   * A well-known carrier service that's being used to fulfill this shipment
   */
  public readonly fulfillmentService?: FulfillmentService;

  /**
   * The estimated date and time the shipment will be delivered
   */
  public readonly deliveryDateTime?: Date;

  /**
   * Confirmation details about each package in the shipment
   */
  public readonly packages: ReadonlyArray<PackageConfirmation>;

  /**
   * Arbitrary data that will be persisted by the ShipEngine Integration Platform.
   */
  public readonly customData?: CustomData;

  //#endregion

  public constructor(pojo: ShipmentConfirmationPOJO) {
    super(pojo);

    this.trackingURL = pojo.trackingURL ? new URL(pojo.trackingURL as string) : undefined;
    this.fulfillmentService = pojo.fulfillmentService;
    this.deliveryDateTime = pojo.deliveryDateTime;
    this.packages = pojo.packages.map((parcel) => new PackageConfirmation(parcel));
    this.customData = pojo.customData && new CustomData(pojo.customData);

    // Make this object immutable
    hideAndFreeze(this);
  }
}

// Prevent modifications to the class
hideAndFreeze(ShipmentConfirmation);
