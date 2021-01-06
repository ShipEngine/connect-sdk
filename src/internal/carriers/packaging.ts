import { Packaging as IPackaging, PackagingDefinition } from "../../public";
import { App, DefinitionIdentifier, hideAndFreeze, Joi, _internal } from "../common";

const _private = Symbol("private fields");

export type PackagingPOJO = PackagingDefinition;

export class Packaging extends DefinitionIdentifier implements IPackaging {
  public static readonly [_internal] = {
    label: "packaging",
    schema: DefinitionIdentifier[_internal].schema.keys({
      name: Joi.string().singleLine().min(1).required(),
      description: Joi.string().singleLine().allow(""),
      requiresWeight: Joi.boolean(),
      requiresDimensions: Joi.boolean()
    })
  };


  private readonly [_private]: {
    readonly app: App;
  };

  public readonly name: string;
  public readonly description: string;
  public readonly requiresWeight: boolean;
  public readonly requiresDimensions: boolean;

  public constructor(pojo: PackagingPOJO, app?: App) {
    super(pojo);

    this.name = pojo.name;
    this.description = pojo.description || "";
    this.requiresWeight = pojo.requiresWeight || false;
    this.requiresDimensions = pojo.requiresDimensions || false;

    if (app) {
      // Make this object immutable
      this[_private] = {
        app
      };
      app[_internal].references.add(this);
    }
    hideAndFreeze(this);
  }
}
