/**
 * A person's complete name
 */
export interface PersonNamePOJO {
  title?: string;
  given: string;
  middle?: string;
  family?: string;
  suffix?: string;
}


/**
 * A person's complete name
 */
export interface PersonName {
  readonly title: string;
  readonly given: string;
  readonly middle: string;
  readonly family: string;
  readonly suffix: string;
}
