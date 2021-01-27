import Joi = require("joi");
import { RequestedFulfillmentExtensions as RequestedFulfillmentExtensionsPOJO } 
  from "../../public/orders/requested-fulfillment";
import { _internal } from "../common";

export class RequestedFulfillmentExtensions {
  public static readonly [_internal] = {
    label: "requested fulfillment extensions",
    schema: Joi.object({
      customField1: Joi.string().allow(""),
      customField2: Joi.string().allow(""),
      customField3: Joi.string().allow("")
    })
  };

  public readonly customField1: string;
  public readonly customField2: string;
  public readonly customField3: string;

  public constructor(pojo: RequestedFulfillmentExtensionsPOJO) {
    this.customField1 = pojo.customField1 || '';
    this.customField2 = pojo.customField2 || '';
    this.customField3 = pojo.customField3 || '';
  }
}