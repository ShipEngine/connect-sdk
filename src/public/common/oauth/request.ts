import type { OAuthParameterDefinition } from './parameter';

export type OAuthRequestMethods = "GET" | "POST" | "PUT";

export interface OAuthRequestDefinition {
  method: OAuthRequestMethods;
  url: string;
  contentType?: string;
  bodyParameters?: OAuthParameterDefinition[];
  headerParameters?: OAuthParameterDefinition[];
  queryParameters?: OAuthParameterDefinition[];
}
