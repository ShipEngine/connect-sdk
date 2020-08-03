import { Note as INote, NotePOJO, NoteType } from "../../definitions";
import { hideAndFreeze, _internal } from "./utils";
import { Joi } from "./validation";


/**
 * Normalizes any form of notes as an array of Note objects
 */
export function createNotes(notes?: string | ReadonlyArray<string | NotePOJO>): Note[] {
  if (!notes) {
    return [];
  }
  else if (typeof notes === "string") {
    notes = [notes];
  }

  return notes.map((note) => new Note(note));
}


export class Note implements INote {
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

  public readonly type: NoteType;
  public readonly text: string;

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
