/**
 * Arbitrary data that will be persisted by the ShipEngine Integration Platform.
 */
export interface CustomDataPOJO {
  [key: string]: string;
}

/**
 * A value that identifies a resource
 */
export interface IdentifierPOJO {
  id: string;
  name: string;
}
