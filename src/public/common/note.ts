import type { NoteType } from "./enums";

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
export interface Note {
  /**
   * The type of note
   */
  readonly type: NoteType;

  /**
   * The note text
   */
  readonly text: string;
}
