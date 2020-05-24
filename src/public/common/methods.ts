import type { Transaction } from "./transaction";

/**
 * Connects to an existing account using the data that was gathered in the `connectionForm`.
 * NOTE: This function does not return a value. It updates the `transaction.session` property.
 */
export type Connect = (transaction: Transaction, connectionFormData: object) => void | Promise<void>;
