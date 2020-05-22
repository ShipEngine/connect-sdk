/**
 * The types of ShipEngine Integration Platform apps
 */
export enum AppType {
  Carrier = "carrier",
  Order = "order",
}


/**
 * The status of a cancellation request
 */
export enum CancellationStatus {
  Success = "success",
  Error = "error",
  Timeout = "timeout",
  Skipped = "skipped",
  Throttled = "throttled",
}


/**
 * The types of notes that can be returned
 */
export enum NoteType {
  Error = "error",
  Warning = "warning",
  Information = "info",
  Condition = "condition",
  BackOrder = "back_order",
  OutOfStock = "out_of_stock",
  InStock = "in_stock",
  GiftMessage = "gift_message",
  MessageToBuyer = "message_to_buyer",
  MessageFromBuyer = "message_from_buyer",
  Internal = "internal",
  ManufacturerPartNNumber = "mpn",
  Reason = "reason",
  Instructions = "instructions",
  Feedback = "feedback",
  Uncategorized = "uncategorized",
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
 * The types of itemized charges or credits that can be specified
 * for a shipment or sales order
 */
export enum ChargeType {
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
  Adjustment = "adjustment",
  Coupon = "coupon",
  Credit = "credit",
  Debit = "debit",
  GiftCertificate = "gift_certificate",
  GiftWrapping = "gift_wrapping",
  Promotion = "promotion",
  Refund = "refund",
  Uncategorized = "uncategorized",
}
