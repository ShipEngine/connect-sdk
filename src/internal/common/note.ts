import { Note as INote, NotePOJO, NoteType } from "../../public";
import { hideAndFreeze, _internal } from "./utils";
import { Joi } from "./validation";

export class Note implements INote {
  public static readonly [_internal] = {
    label: "note",
    schema: Joi.object({
      type: Joi.string().enum(NoteType).required(),
      text: Joi.string().allow("").required(),
    }),
    notesSchema: Joi.alternatives(
      Joi.array().items(
        Joi.object({
          type: Joi.string().enum(NoteType).required(),
          text: Joi.string().allow("").required(),
        })
      )
    ),
  };

  public readonly type: NoteType;
  public readonly text: string;

  public constructor(pojo: NotePOJO) {

    this.type = pojo.type;
    this.text = pojo.text;

    // Make this object immutable
    hideAndFreeze(this);
  }
}
