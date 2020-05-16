/**
 * Indicates which locations are included in end-of-day manifests
 */
export enum ManifestLocation {
  AllLocations = "all_locations",
  SingleLocation = "single_location",
}

/**
 * Indicates which shipments are included in end-of-day manifests
 */
export enum ManifestShipment {
  AllShipments = "all_shipments",
  ExplicitShipments = "explicit_shipments",
  ExcludeShipments = "exclude_shipments",
}
