/**
 * Arbitrary data that will be persisted by ShipEngine IPaaS.
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
