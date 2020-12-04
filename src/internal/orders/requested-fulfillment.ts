import Joi = require("joi");
import { SalesOrderItem, ShippingPreferences } from ".";
import { RequestedFulfillmentExtensions, RequestedFulfillmentPOJO } from "../../public/orders/requested-fulfillment";
import { _internal } from "../common";
import { AddressWithContactInfo } from "../common/addresses/address-with-contact-info";

export class RequestedFulfillment {
    public static readonly [_internal] = {
      label: "requested fulfillment",
      schema: Joi.object({
        items: Joi.array().min(1).items(SalesOrderItem[_internal].schema).required(),
        shippingPreferences: ShippingPreferences[_internal].schema,
        shipTo: AddressWithContactInfo[_internal].schema.required(),
      })
    }
    public readonly items: SalesOrderItem[];
    public readonly shippingPreferences: ShippingPreferences;
    public readonly shipTo: AddressWithContactInfo;
    public readonly extensions?: RequestedFulfillmentExtensions;

    public constructor(pojo: RequestedFulfillmentPOJO) {
      this.items = pojo.items;
      this.shippingPreferences = pojo.shippingPreferences;
      this.shipTo = pojo.shipTo;
      this.extensions = pojo.extensions;
    }
  }
