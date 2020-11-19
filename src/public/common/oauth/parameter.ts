/**
* Represents a body, header, or query parameter in an OAuth processes
*/
export interface OAuthParameterDefinition {
  name: string;
  value: string;
  encoding?: string;
}
