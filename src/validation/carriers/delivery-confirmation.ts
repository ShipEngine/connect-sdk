import { DeliveryConfirmation as IDeliveryConfirmation, DeliveryConfirmation as DeliveryConfirmationPOJO, DeliveryConfirmationType } from "../../definitions";
import { App, DefinitionIdentifier, hideAndFreeze, Joi, _internal } from "../common";

const _private = Symbol("private fields");

export class DeliveryConfirmation extends DefinitionIdentifier implements IDeliveryConfirmation {
  public static [_internal] = {
    label: "delivery confirmation",
    schema: DefinitionIdentifier[_internal].schema.keys({
      name: Joi.string().trim().singleLine().min(1).max(100).required(),
      description: Joi.string().trim().singleLine().allow("").max(1000),
      type: Joi.string().enum(DeliveryConfirmationType).required()
    }),
  };


  private [_private]: {
    app: App;
  };

  public name: string;
  public description: string;
  public type: DeliveryConfirmationType;

  public constructor(pojo: DeliveryConfirmationPOJO, app: App) {
    super(pojo);

    this.name = pojo.name;
    this.description = pojo.description || "";
    this.type = pojo.type;

    this[_private] = {
      app
    };

    // Make this object immutable
    hideAndFreeze(this);

    app[_internal].references.add(this);
  }
}
