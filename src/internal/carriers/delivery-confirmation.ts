import { DeliveryConfirmation as IDeliveryConfirmation, DeliveryConfirmationDefinition, DeliveryConfirmationType } from "../../public";
import { App, DefinitionIdentifier, hideAndFreeze, Joi, _internal } from "../common";

const _private = Symbol("private fields");

export type DeliveryConfirmationPOJO = DeliveryConfirmationDefinition;


export class DeliveryConfirmation extends DefinitionIdentifier implements IDeliveryConfirmation {
  public static readonly [_internal] = {
    label: "delivery confirmation",
    schema: DefinitionIdentifier[_internal].schema.keys({
      name: Joi.string().trim().singleLine().min(1).required(),
      description: Joi.string().trim().singleLine().allow(""),
      type: Joi.string().enum(DeliveryConfirmationType).required()
    }),
  };


  private readonly [_private]: {
    readonly app: App;
  };

  public readonly name: string;
  public readonly description: string;
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
