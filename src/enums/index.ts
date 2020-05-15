export * from "./country";
export * from "./fulfillment-service";

/**
 * A length measurement unit
 */
export enum LengthUnit {
  Inches = "in",
  Centimeters = "cm"
}

/**
 * A weight measurement unit
 */
export enum WeightUnit {
  Grams = "g",
  Ounces = "oz",
  Kilograms = "kg",
  Pounds = "lb"
}

/**
 * A quantity measurement unit
 */
export enum QuantityUnit {
  Each = "ea",
}

/**
 * An ISO 4217 currency code that is supported by ShipEngine
 *
 * @see https://en.wikipedia.org/wiki/ISO_4217
 */
export enum Currency {
  UnitedStatesDollar = "USD",
  CanadianDollar = "CAD",
  AustralianDollar = "AUD",
  GreatBritishPound = "GBP",
  Euro = "EUR",
  NewZealandDollar = "NZD",
}

/**
 * The digital file format of a document,
 * such as a shipping label, customs form, or SCAN form.
 */
export enum DocumentFormat {
  PDF = "pdf",
  HTML = "html",
  ZPL = "zpl",
  PNG = "png"
}

/**
 * The dimensions of a document,
 * such as a shipping label, customs form, or SCAN form.
 */
export enum DocumentSize {
  A4 = "A4",
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
 * Types of delivery confirmations
 */
export enum DeliveryConfirmationType {
  Delivery = "delivery",
  Signature = "signature",
  AdultSignature = "adult_signature",
  DirectSignature = "direct_signature",
}

/**
 * A class of delivery service
 */
export enum DeliveryServiceClass {
  Ground = "ground",
  OneDay = "one_day",
  OneDayEarly = "one_day_early",
  OneDayEarlyAm = "one_day_early_am",
  TwoDay = "two_day",
  TwoDayEarly = "two_day_early",
  ThreeDay = "three_day"
}

/**
 * A grade of delivery service
 */
export enum DeliveryServiceGrade {
  Economy = "economy",
  Expedited = "expedited",
  Overnight = "overnight",
  Standard = "standard"
}

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
 * Indicates who to bill for delivery charges, duties, or fees
 */
export enum BilledParty {
  Sender = "sender",
  Recipient = "recipient",
  ThirdParty = "third_party",
}

/**
 * The types of itemized charges that can be charged by a carrier
 */
export enum ShippingChargeType {
  Shipping = "shipping",
  Delivery = "delivery",
  Handling = "handling",
  Oversize = "oversize",
  SpecialGoods = "special_goods",
  DeliveryConfirmation = "delivery_confirmation",
  Insurance = "insurance",
  Discount = "discount",
  Fuel = "fuel",
  LocationFee = "location_fee",
  Fee = "fee",
  Pickup = "pickup",
  Return = "return",
  Notification = "notification",
  Duty = "duty",
  Tax = "tax",
  Uncategorized = "uncategorized",
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
}
