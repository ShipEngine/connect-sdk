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
  Other = "other",
}
