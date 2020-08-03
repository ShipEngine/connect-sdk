import type { NoteType } from "./enums";

/**
 * A note associated with a resource or result
 */
export interface Note {
  /**
   * The type of note
   */
  type: NoteType;

  /**
   * The note text
   */
  text: string;
}
