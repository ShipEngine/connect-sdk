import { Transaction } from "../common";

/**
 * Connects to an existing account using the data that was gathered in the `Connection.connectForm`.
 * NOTE: This function does not return a value. It updates the `transaction.session` property.
 */
export type Connect = (transaction: Transaction, connectionData: object) => void | Promise<void>;
