import { DefinitionIdentifier as IDefinitionIdentifier, UUID } from "../../public";
import { Identifiers, IdentifiersPOJO } from "./identifiers";
import { _internal } from "./utils";
import { Joi } from "./validation";


export interface DefinitionIdentifierPOJO {
  id: UUID;
  identifiers?: IdentifiersPOJO;
  code?: string;
}


export abstract class DefinitionIdentifier implements IDefinitionIdentifier {
  public static readonly [_internal] = {
    label: "object",
    schema: Joi.object({
      id: Joi.string().uuid().required(),
      identifiers: Identifiers[_internal].schema,
      code: Joi.string().trim().singleLine().allow("")
    }),
  };

  public readonly id: UUID;
  public readonly code: string;

  public readonly identifiers: Identifiers;

  public constructor(pojo: DefinitionIdentifierPOJO) {
    this.id = pojo.id;
    this.code = pojo.code || "";
    this.identifiers = new Identifiers(pojo.identifiers);
  }
}
