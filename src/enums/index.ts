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
 * A class of delivery confirmation
 */
export enum DeliveryConfirmationClass {
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
 * Indicates which party is insuring a shipment
 */
export enum InsuranceProvider {
  ShipEngine = "shipengine",
  Carrier = "carrier",
  ThirdParty = "third_party",
}

/**
 * Indicates how a non-deliverable package should be handled
 */
export enum NonDeliveryAction {
  ReturnToSender = "return_to_sender",
  TreatAsAbandoned = "treat_as_abandoned",
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
 * The types of itemized charges that can make up the total cost of a shipment
 */
export enum ShippingChargeType {
  /**
   * The charge to ship the package to its destination
   */
  Shipping = "shipping",

  /**
   * The charge for delivery confirmation, such as a signature or photo
   */
  DeliveryConfirmation = "delivery_confirmation",

  /**
   * The charge to insure the package
   */
  Insurance = "insurance",

  /**
   * An import/export duty or tariff imposed by a government
   */
  Duty = "duty",

  /**
   * A tax imposed by a government
   */
  Tax = "tax",

  /**
   * Other charges that don't fit into other categories
   */
  Other = "other",
}
