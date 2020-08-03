import { Packaging as IPackaging, Packaging as PackagingPOJO } from "../../definitions";
import { App, DefinitionIdentifier, hideAndFreeze, Joi, _internal } from "../common";

const _private = Symbol("private fields");

export class Packaging extends DefinitionIdentifier implements IPackaging {
  public static [_internal] = {
    label: "packaging",
    schema: DefinitionIdentifier[_internal].schema.keys({
      name: Joi.string().trim().singleLine().min(1).max(100).required(),
      description: Joi.string().trim().singleLine().allow("").max(1000),
      requiresWeight: Joi.boolean(),
      requiresDimensions: Joi.boolean()
    })
  };


  private [_private]: {
    app: App;
  };

  public name: string;
  public description: string;
  public requiresWeight: boolean;
  public requiresDimensions: boolean;

  public constructor(pojo: PackagingPOJO, app: App) {
    super(pojo);

    this.name = pojo.name;
    this.description = pojo.description || "";
    this.requiresWeight = pojo.requiresWeight || false;
    this.requiresDimensions = pojo.requiresDimensions || false;

    this[_private] = {
      app
    };

    // Make this object immutable
    hideAndFreeze(this);

    app[_internal].references.add(this);
  }
}
