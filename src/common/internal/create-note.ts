import { Note, NotePOJO } from "../note";


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
