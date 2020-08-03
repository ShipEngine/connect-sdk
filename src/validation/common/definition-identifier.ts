import { DefinitionIdentifier as IDefinitionIdentifier, DefinitionIdentifier as DefinitionIdentifierPOJO, UUID } from "../../definitions";
import { Identifiers } from "./identifiers";
import { _internal } from "./utils";
import { Joi } from "./validation";

export abstract class DefinitionIdentifier implements IDefinitionIdentifier {
  public static [_internal] = {
    label: "object",
    schema: Joi.object({
      id: Joi.string().uuid().required(),
      identifiers: Identifiers[_internal].schema,
      code: Joi.string().trim().singleLine().allow("").max(100)
    }),
  };

  public id: UUID;
  public code: string;

  public identifiers: Identifiers;

  public constructor(pojo: DefinitionIdentifierPOJO) {
    this.id = pojo.id;
    this.code = pojo.code || "";
    this.identifiers = new Identifiers(pojo.identifiers);
  }
}
