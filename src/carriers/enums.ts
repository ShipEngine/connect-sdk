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
 * The status of a shipment
 */
export enum ShipmentStatus {
  Accepted = "accepted",
  InTransit = "in_transit",
  DeliveryAttempted = "delivery_attempted",
  Delivered = "delivered",
  Exception = "exception",
}
