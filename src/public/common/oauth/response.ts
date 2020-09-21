import type { OAuthParameterDefinition } from './parameter';

export interface OAuthResponseDefinition {
  bodyParameters?: OAuthParameterDefinition[];
  headerParameters?: OAuthParameterDefinition[];
  queryParameters?: OAuthParameterDefinition[];
}
