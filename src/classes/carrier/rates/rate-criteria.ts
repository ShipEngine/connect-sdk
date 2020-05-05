import { FulfillmentService } from "../../../enums";
import { hideAndFreeze, Joi, validate, _internal } from "../../../internal";
import { RateCriteriaPOJO } from "../../../pojos/carrier";
import { AddressWithContactInfo, MonetaryValue } from "../../common";
import { App } from "../../common/app";
import { DeliveryConfirmation } from "../delivery-confirmation";
import { DeliveryService } from "../delivery-service";
import { Packaging } from "../packaging";
import { ShipmentIdentifier } from "../shipments/shipment-identifier";
import { calculateTotalInsuranceAmount } from "../utils";
import { RateCriteriaPackage } from "./rate-criteria-package";

/**
 * Specifies the criteria for rate quotes
 */
export class RateCriteria {
  //#region Private/Internal Fields

  /** @internal */
  public static readonly [_internal] = {
    label: "rate criteria",
    schema: Joi.object({
      deliveryServices: Joi.array().items(Joi.string().uuid()),
      packaging: Joi.array().items(Joi.string().uuid()),
      deliveryConfirmations: Joi.array().items(Joi.string().uuid()),
      fulfillmentServices: Joi.array().items(Joi.string().enum(FulfillmentService)),
      shipDateTime: Joi.date().required(),
      deliveryDateTime: Joi.date(),
      shipFrom: AddressWithContactInfo[_internal].schema.required(),
      shipTo: AddressWithContactInfo[_internal].schema.required(),
      isReturn: Joi.boolean(),
      outboundShipment: ShipmentIdentifier[_internal].schema,
      packages: Joi.array().min(1).items(RateCriteriaPackage[_internal].schema).required(),
    }),
  };

  //#endregion
  //#region Public Fields

  /**
   * The delivery services that may be used. If neither `deliveryServices` nor
   * `fulfillmentServices` are specified, then rate quotes should be returned for all
   * applicable services.
   */
  public readonly deliveryServices: ReadonlyArray<DeliveryService>;

  /**
   * The packaging that may be used. If not specified, then rate quotes should be
   * returned for all applicable packaging.
   */
  public readonly packaging: ReadonlyArray<Packaging>;

  /**
   * The delivery confirmations that may be used. If not specified, then rate quotes
   * should be returned for all applicable delivery confirmations.
   */
  public readonly deliveryConfirmations: ReadonlyArray<DeliveryConfirmation>;

  /**
   * Well-known carrier services that may be used to fulfill the shipment.
   * If neither `deliveryServices` nor `fulfillmentServices` are specified, then rate quotes
   * should be returned for all applicable services.
   */
  public readonly fulfillmentServices: ReadonlyArray<FulfillmentService>;

  /**
   * The date/time that the shipment is expected to ship.
   * This is not guaranteed to be in the future.
   */
  public readonly shipDateTime: Date;

  /**
   * The latest date and time that the shipment can be delivered
   */
  public readonly deliveryDateTime?: Date;

  /**
   * The sender's contact info and address
   */
  public readonly shipFrom: AddressWithContactInfo;

  /**
   * The recipient's contact info and address
   */
  public readonly shipTo: AddressWithContactInfo;

  /**
   * Indicates whether this is a return shipment
   */
  public readonly isReturn: boolean;

  /**
   * The original (outgoing) shipment that this return shipment is for.
   * This associates the two shipments, which is required by some carriers.
   */
  public readonly outboundShipment?: ShipmentIdentifier;

  /**
   * The total insured value of all packages in the shipment.
   * If specified, then rate quotes should include carrier-provided insurance.
   */
  public readonly totalInsuredValue?: MonetaryValue;

  /**
   * The list of packages in the shipment
   */
  public readonly packages: ReadonlyArray<RateCriteriaPackage>;

  //#endregion

  public constructor(pojo: RateCriteriaPOJO, app: App) {
    validate(pojo, RateCriteria);

    this.deliveryServices = (pojo.deliveryServices || [])
      .map((id) => app[_internal].references.lookup(id, DeliveryService));
    this.packaging = (pojo.packaging || [])
      .map((id) => app[_internal].references.lookup(id, Packaging));
    this.deliveryConfirmations = (pojo.deliveryConfirmations || [])
      .map((id) => app[_internal].references.lookup(id, DeliveryConfirmation));
    this.fulfillmentServices = pojo.fulfillmentServices || [];
    this.shipDateTime = pojo.shipDateTime;
    this.deliveryDateTime = pojo.deliveryDateTime;
    this.shipFrom = new AddressWithContactInfo(pojo.shipFrom);
    this.shipTo = new AddressWithContactInfo(pojo.shipTo);
    this.isReturn = pojo.isReturn || false;
    this.outboundShipment = pojo.outboundShipment && new ShipmentIdentifier(pojo.outboundShipment);
    this.packages = pojo.packages.map((parcel) => new RateCriteriaPackage(parcel));
    this.totalInsuredValue = calculateTotalInsuranceAmount(this.packages);

    // Make this object immutable
    hideAndFreeze(this);
  }
}

// Prevent modifications to the class
hideAndFreeze(RateCriteria);
