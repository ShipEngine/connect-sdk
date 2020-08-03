import { PickupService as IPickupService, PickupServicePOJO } from "../../../definitions";
import { App, DefinitionIdentifier, hideAndFreeze, Joi, _internal } from "../../common";

const _private = Symbol("private fields");

export class PickupService extends DefinitionIdentifier implements IPickupService {
  public static readonly [_internal] = {
    label: "pickup service",
    schema: DefinitionIdentifier[_internal].schema.keys({
      name: Joi.string().trim().singleLine().min(1).max(100).required(),
      description: Joi.string().trim().singleLine().allow("").max(1000),
      hasSandbox: Joi.boolean()
    }),
  };

  private readonly [_private]: {
    readonly app: App;
  };

  public readonly name: string;
  public readonly description: string;
  public readonly hasSandbox: boolean;

  public constructor(pojo: PickupServicePOJO, app: App) {
    super(pojo);

    this.name = pojo.name;
    this.description = pojo.description || "";
    this.hasSandbox = pojo.hasSandbox || false;

    this[_private] = {
      app
    };

    // Make this object immutable
    hideAndFreeze(this);

    app[_internal].references.add(this);
  }
}
