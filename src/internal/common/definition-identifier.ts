import { DefinitionIdentifier as IDefinitionIdentifier, DefinitionIdentifierPOJO, UUID } from "../../public";
import { Identifiers } from "./identifiers";
import { _internal } from "./utils";
import { Joi } from "./validation";

export abstract class DefinitionIdentifier implements IDefinitionIdentifier {
  public static readonly [_internal] = {
    label: "object",
    schema: Joi.object({
      id: Joi.string().uuid().required(),
      identifiers: Identifiers[_internal].schema,
    }),
  };

  public readonly id: UUID;
  public readonly identifiers: Identifiers;

  public constructor(pojo: DefinitionIdentifierPOJO) {
    this.id = pojo.id;
    this.identifiers = new Identifiers(pojo.identifiers);
  }
}
