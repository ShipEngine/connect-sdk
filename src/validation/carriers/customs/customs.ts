import { Customs as ICustoms, Customs as CustomsPOJO, NonDeliveryOption } from "../../../definitions";
import { hideAndFreeze, Joi, _internal } from "../../common";
import { CustomsItem } from "./customs-item";

export class Customs implements ICustoms {
  public static [_internal] = {
    label: "customs",
    schema: Joi.object({
      nonDeliveryOption: Joi.string().enum(NonDeliveryOption),
      contents: Joi.array().items(CustomsItem[_internal].schema),
    }),
  };

  public nonDeliveryOption?: NonDeliveryOption;
  public contents: Array<CustomsItem>;

  public constructor(pojo: CustomsPOJO) {
    this.nonDeliveryOption = pojo.nonDeliveryOption;
    this.contents = pojo.contents ? pojo.contents.map((item) => new CustomsItem(item)) : [];

    // Make this object immutable
    hideAndFreeze(this);
  }
}
