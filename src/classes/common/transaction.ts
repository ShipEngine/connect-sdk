import { hideAndFreeze, Joi, validate, _internal } from "../../internal";
import { TransactionPOJO } from "../../pojos/common";
import { UUID } from "../../types";

const _private = Symbol("private fields");

/**
 * The ShpEngine Integration Platform passes this object to every method call. It provides information about the
 * transaction being performed, including authentication, metadata, etc.
 */
export class Transaction {
  //#region Private/Internal Fields

  /** @internal */
  public static readonly [_internal] = {
    label: "transaction",
    schema: Joi.object({
      id: Joi.string().uuid().required(),
      isRetry: Joi.boolean(),
      useSandbox: Joi.boolean(),
      session: Joi.object(),
    }),
  };

  /** @internal */
  private readonly [_private]: {
    session: object;
  };

  //#endregion
  //#region Public Fields

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
   * Arbitrary session data. Must be JSON serializable. Any method may update the session data,
   * such as renewing a session token or updating a timestamp.
   */
  public get session(): object {
    return this[_private].session;
  }

  /**
   * Updates the session data.
   */
  public set session(value: object) {
    if (value === undefined) {
      value = {};
    }

    validate(value, "session data", Joi.object());

    let session = this[_private].session as Record<string, unknown>;
    let keys = Object.getOwnPropertyNames(session).concat(Object.getOwnPropertyNames(value));

    for (let key of keys) {
      if (key in value) {
        session[key] = (value as Record<string, unknown>)[key];
      }
      else {
        // tslint:disable-next-line: no-dynamic-delete
        delete session[key];
      }
    }
  }

  //#endregion

  public constructor(pojo: TransactionPOJO) {
    this.id = pojo.id;
    this.isRetry = pojo.isRetry || false;
    this.useSandbox = pojo.useSandbox || false;

    this[_private] = {
      session: pojo.session || {},
    };

    // Make the session getter/setter look like a normal property
    Object.defineProperty(this, "session", {
      ...Object.getOwnPropertyDescriptor(Object.getPrototypeOf(this), "session"),
      enumerable: true,
    });

    // Make this object immutable (except for the session property)
    hideAndFreeze(this, "session");
  }
}

// Prevent modifications to the class
hideAndFreeze(Transaction);
