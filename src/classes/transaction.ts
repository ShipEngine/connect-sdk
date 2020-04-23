import { assert } from "../assert";
import { TransactionPOJO } from "../pojos";
import { CustomData, UUID } from "../types";

/**
 * ShpEngine IPaaS passes this object to every method call. It provides information about the
 * transaction being performed, including authentication, metadata, etc.
 */
export class Transaction {
  /**
   * @internal
   */
  private readonly _session: CustomData = {};

  /**
   * Uniquely identifies the current transaction. If the transaction is retried, then this ID will
   * remain the same. You can use this to detect/prevent duplicate operations.
   */
  public readonly id: UUID;

  /**
   * Indicates whether this transaction is a retry, in which case the `id` will be the same as the
   * original attempt.
   *
   * If `isRetry` is `true`, then the operation should try to continue the original transaction
   * where it left-off. Efforts should be made to prevent duplicate data or double charges.
   */
  public readonly isRetry: boolean;

  /**
   * Indicates whether the operation should use the carrier's sandbox/development API rather than
   * the normal/production API.
   *
   * If `useSandbox` is `true`, then the operation MUST NOT incur any actual costs or affect
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
  public get session(): CustomData {
    return this._session;
  }

  /**
   * Updates the session data, creating new keys, updating existing keys, and/or deleting keys
   * that are no longer present.
   */
  public set session(value: CustomData) {
    assert.type.customData(value, "session data");
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

  public constructor(pojo: TransactionPOJO) {
    assert.type.object(pojo, "transaction");
    this.id = assert.string.uuid(pojo.id, "transaction ID");
    this.isRetry = assert.type.boolean(pojo.isRetry, "isRetry flag", false);
    this.useSandbox = assert.type.boolean(pojo.useSandbox, "useSandbox flag", false);
    this.session = assert.type.object<CustomData>(pojo.session, "session data", {});

    // Hide the internal _session field
    Object.defineProperty(this, "_session", {
      ...Object.getOwnPropertyDescriptor(this, "_session"),
      enumerable: false
    });

    // Make the session getter/setter look like a normal property
    Object.defineProperty(this, "session", {
      ...Object.getOwnPropertyDescriptor(Object.getPrototypeOf(this), "session"),
      enumerable: true,
    });

    // Prevent modifications after validation
    // NOTE: The session object is NOT frozen. It can be mutated by user code.
    Object.freeze(this);
  }
}
