import { NoteType } from "./enums";
import { hideAndFreeze, _internal } from "./internal/utils";
import { Joi } from "./internal/validation";

/**
 * A note associated with a resource or result
 */
export interface NotePOJO {
  /**
   * The type of note
   */
  type: NoteType;

  /**
   * The note text
   */
  text: string;
}


/**
 * A note associated with a resource or result
 */
export class Note {
  //#region Private/Internal Fields

  /** @internal */
  public static readonly [_internal] = {
    label: "note",
    schema: Joi.object({
      type: Joi.string().enum(NoteType).required(),
      text: Joi.string().allow("").max(5000).required(),
    }),
    notesSchema: Joi.alternatives(
      Joi.string().allow("").max(5000),
      Joi.array().items(
        Joi.string().allow("").max(5000),
        Joi.object({
          type: Joi.string().enum(NoteType).required(),
          text: Joi.string().allow("").max(5000).required(),
        })
      )
    ),
  };

  //#endregion
  //#region Public Fields

  /**
   * The type of note
   */
  public readonly type: NoteType;

  /**
   * The note text
   */
  public readonly text: string;

  //#endregion

  public constructor(pojo: string | NotePOJO) {
    if (typeof pojo === "string") {
      pojo = { type: NoteType.Uncategorized, text: pojo };
    }

    this.type = pojo.type;
    this.text = pojo.text;

    // Make this object immutable
    hideAndFreeze(this);
  }
}

// Prevent modifications to the class
hideAndFreeze(Note);
