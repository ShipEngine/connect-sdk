import { assert } from "./assert";
import { TransactionConfig } from "./config";
import { UUID } from "./types";

/**
 * ShpEngine IPaaS passes this object to every method call. It provides information about the
 * transaction being performed, including authentication, metadata, etc.
 */
export class Transaction {
  /**
   * Uniquely identifies the current transaction. If the transaction is retried, then this ID will
   * remain the same. You can use this to detect/prevent duplicate operations.
   */
  public readonly id: UUID;

  /**
   * Arbitrary session data that was established upon logging in.
   * This object initially matches the structure defined by the shipping provider's login form.
   *
   * The properties of the session object are mutable. Any method may update the session data,
   * such as renewing a session token or updating a timestamp.
   */
  public readonly session: object;

  /**
   * Creates a Transaction object from a config object
   */
  public constructor(config: TransactionConfig) {
    assert.type.object(config, "transaction");
    this.id = assert.string.uuid(config.id, "transaction ID");
    this.session = assert.type.object<object>(config.session, "session data", {});

    // NOTE: We don't use Object.freeze() here because we want the session property to be writable
    Object.defineProperty(this, "id", { value: config.id, writable: false });
  }
}
