import { PickupService as IPickupService, PickupServiceDefinition } from "../../../public";
import { App, DefinitionIdentifier, DefinitionIdentifierPOJO, hideAndFreeze, Joi, _internal } from "../../common";

const _private = Symbol("private fields");

export type PickupServicePOJO = PickupServiceDefinition;
export type PickupServiceIdentifierPOJO = DefinitionIdentifierPOJO;

export class PickupService extends DefinitionIdentifier implements IPickupService {
  public static readonly [_internal] = {
    label: "pickup service",
    schema: DefinitionIdentifier[_internal].schema.keys({
      name: Joi.string().singleLine().min(1).required(),
      description: Joi.string().singleLine().allow(""),
    }),
  };

  private readonly [_private]: {
    readonly app: App;
  };

  public readonly name: string;
  public readonly description: string;

  public constructor(pojo: PickupServicePOJO, app: App) {
    super(pojo);

    this.name = pojo.name;
    this.description = pojo.description || "";

    this[_private] = {
      app
    };

    // Make this object immutable
    hideAndFreeze(this);

    app[_internal].references.add(this);
  }
}
