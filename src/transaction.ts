import { inspect } from "util";
import { assert } from "./assert";
import { SessionState, TransactionConfig } from "./config";
import { UUID } from "./types";

/**
 * ShpEngine IPaaS passes this object to every method call. It provides information about the
 * transaction being performed, including authentication, metadata, etc.
 */
export class Transaction {
  private readonly _session: SessionState;

  /**
   * Uniquely identifies the current transaction. If the transaction is retried, then this ID will
   * remain the same. You can use this to detect/prevent duplicate operations.
   */
  public readonly id: UUID;

  /**
   * Indicates whether the operation should use the carrier's sandbox/development API rather than
   * the normal/production API.
   *
   * If the `useSandbox` is `true`, then the operation MUST NOT incur any actual costs or affect
   * production data.
   */
  public readonly useSandbox: boolean;

  /**
   * Arbitrary session data that was established upon logging in.
   * This object initially matches the structure defined by the shipping provider's login form.
   *
   * The properties of the session object are mutable. Any method may update the session data,
   * such as renewing a session token or updating a timestamp.
   */
  public get session(): SessionState {
    return this._session;
  }

  /**
   * Updates the session data, creating new keys, updating existing keys, and/or deleting keys
   * that are no longer present.
   */
  public set session(value: SessionState) {
    assert.type.object(value, "session state");
    let keys = Object.keys(this._session).concat(Object.keys(value));
    for (let key of keys) {
      if (key in value) {
        this._session[key] = value[key];
      }
      else {
        // tslint:disable-next-line: no-dynamic-delete
        delete this._session[key];
      }
    }
  }

  /**
   * Creates a Transaction object from a config object
   */
  public constructor(config: TransactionConfig) {
    assert.type.object(config, "transaction");
    this.id = assert.string.uuid(config.id, "transaction ID");
    this.useSandbox = assert.type.boolean(config.useSandbox, "useSandbox flag", false);
    this._session = assert.type.object<SessionState>(config.session, "session data", {});

    // Prevent modifications after validation
    // NOTE: The session object is NOT frozen. It can be mutated by user code.
    Object.freeze(this);
  }

  /**
   * Returns the transaction data as a POJO
   */
  public toJSON() {
    return {
      id: this.id,
      session: this.session,
    };
  }

  /**
   * Returns the transaction data for the Node.js console
   */
  public [inspect.custom]() {
    return this.toJSON();
  }
}
