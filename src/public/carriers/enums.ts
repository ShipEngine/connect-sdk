/**
 * The service area that is covered by a delivery service
 */
export enum ServiceArea {
  Regional = "regional",
  Domestic = "domestic",
  International = "international",
  Global = "global",
}

/**
 * Indicates how a non-deliverable package should be handled
 */
export enum NonDeliveryOption {
  Return = "return",
  Abandon = "abandon",
}

/**
 * The customs type category of an item in a package
 */
export enum CustomsItemType {
  Gift = "gift",
  Documents = "documents",
  Merchandise = "merchandise",
  ReturnedGoods = "returned_goods",
  CommercialSample = "commercial_sample",
  HumanitarianDonation = "humanitarian_donation",
  Other = "other",
}
/**
 * The reason the customer is cancelling their pickup request
 */
export enum PickupCancellationReason {
  NotReady = "not_ready",
  Price = "price",
  Schedule = "schedule",
  CarrierFailedPickup = "carrier_failed_pickup",
  Other = "other",
}

/**
 * The types of manifests that the carrier supports
 */
export enum ManifestType {
  Physical = "physical",
  Digital = "digital"
}

/**
 * The status of a shipment
 */
export enum ShipmentStatus {
  Accepted = "accepted",
  InTransit = "in_transit",
  DeliveryAttempted = "delivery_attempted",
  Delivered = "delivered",
  Exception = "exception",
  Unknown = "unknown",
  NotYetInSystem = "not_yet_in_system"
}

/**
 * The digital file format of a document,
 * such as a shipping label, customs form, or SCAN form.
 */
export enum DocumentFormat {
  PDF = "pdf",
  ZPL = "zpl",
  PNG = "png"
}

/**
 * The dimensions of a document,
 * such as a shipping label, customs form, or SCAN form.
 */
export enum DocumentSize {
  A4 = "A4",
  A6 = "A6",
  Letter = "letter",
  Inches4x6 = "4x6",
  Inches4x8 = "4x8",
}

/**
 * The types of digital documents that can be returned
 */
export enum DocumentType {
  Label = "label",
  CustomsForm = "customs_form",
  ScanForm = "scan_form",
}
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
