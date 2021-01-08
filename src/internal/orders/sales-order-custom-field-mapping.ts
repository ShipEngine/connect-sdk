import Joi = require("joi");
import { SalesOrderCustomFieldMappingPOJO } from "../../public";
import { hideAndFreeze, _internal } from "../common";

export class SalesOrderCustomFieldMapping {
  public static readonly [_internal] = {
    label: "sales order custom field mapping",
    schema: Joi.object({
      customField1: Joi.string().allow(""),
      customField2: Joi.string().allow(""),
      customField3: Joi.string().allow(""),
    })
  };
  
  public readonly customField1: string;
  public readonly customField2: string;
  public readonly customField3: string;

  public constructor(pojo: SalesOrderCustomFieldMappingPOJO) {
    this.customField1 = pojo.customField1 || "";
    this.customField2 = pojo.customField2 || "";
    this.customField3 = pojo.customField3 || "";

    // Make this object immutable
    hideAndFreeze(this);
  }
}
