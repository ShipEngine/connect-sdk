/**
 * The status of a Sales Order
 */
export enum SalesOrderStatus {
  AwaitingPayment = "awaiting_payment",
  AwaitingShipment = "awaiting_shipment",
  OnHold = "on_hold",
  Completed = "completed",
  Cancelled = "cancelled",
}

/**
 * The payment status of a sales order
 */
export enum PaymentStatus {
  AwaitingPayment = "awaiting_payment",
  InProcess = "in_process",
  Paid = "paid",
  Failed = "failed",
  Cancelled = "cancelled",
}

/**
 * The payment method used to pay for a sales order
 */
export enum PaymentMethod {
  Cash = "cash",
  CashEquivalent = "cash_equivalent",
  Check = "check",
  CreditCard = "credit_card",
  BankTransfer = "bank_transfer",
}

/**
 * Indicates which party is insuring a shipment
 */
export enum InsuranceProvider {
  ShipEngine = "shipengine",
  Carrier = "carrier",
  ThirdParty = "third_party",
}
