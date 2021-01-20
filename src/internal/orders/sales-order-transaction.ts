import { SalesOrderStatus, SalesOrderCustomFieldMappingPOJO, Transaction as ITransaction, UUID } from "../../public"
import { TransactionPOJO } from "../common/transaction"
import { hideAndFreeze, _internal } from "../common/utils";
import { Joi, validate } from "../common/validation";
import { SalesOrderCustomFieldMapping } from "./sales-order-custom-field-mapping";

export type SalesOrderSessionPOJO<T extends object = object> = T & {
  readonly auth?: {
    readonly username?: string;
    readonly password?: string;
    readonly accessToken?: string;
    readonly apiKey?: string;
  }
}

const _private = Symbol("private fields");

export interface SalesOrderTransactionPOJO<T extends object = object> extends TransactionPOJO {
  session?: SalesOrderSessionPOJO<T>;
  statusMappings?: {	
    [key: string]: SalesOrderStatus;	
  };	
  fieldMappings?: SalesOrderCustomFieldMappingPOJO;
}

export class SalesOrderTransaction<T extends object = object> implements ITransaction {
  public static readonly [_internal] = {
    label: "transaction",
    schema: Joi.object({
      id: Joi.string().uuid().required(),
      language: Joi.string().required(),
      session: Joi.object(),
      statusMappings: Joi.object().optional(),
      fieldMappings: Joi.object().optional(),
    }),
  };

  private readonly [_private]: {
    session: SalesOrderSessionPOJO<T>;
  };

  public readonly id: UUID;
  public readonly language: string;

  public get session(): SalesOrderSessionPOJO<T> {
    return this[_private].session;
  }

  public set session(value: SalesOrderSessionPOJO<T>) {
    if (value === undefined) {
      value = {} as unknown as T;
    }

    validate(value, "session data", Joi.object());

    const session = this[_private].session as Record<string, unknown>;
    const keys = Object.getOwnPropertyNames(session).concat(Object.getOwnPropertyNames(value));

    for (const key of keys) {
      if (key in value) {
        session[key] = (value as Record<string, unknown>)[key];
      }
      else {
        // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
        delete session[key];
      }
    }
  }

  public constructor(pojo: SalesOrderTransactionPOJO<T>) {
    this.id = pojo.id;
    this.language = pojo.language;
    this[_private] = {
      session: pojo.session || {} as unknown as T,
    };

    // Make the session getter/setter look like a normal property
    Object.defineProperty(this, "session", {
      ...Object.getOwnPropertyDescriptor(Object.getPrototypeOf(this), "session"),
      enumerable: true,
    });

    this.statusMappings = pojo.statusMappings;
    this.fieldMappings = pojo.fieldMappings && new SalesOrderCustomFieldMapping(pojo.fieldMappings);

    // Make this object immutable (except for the session property)
    hideAndFreeze(this, "session");
  }

  public readonly statusMappings?: Readonly<{
    [key: string]: SalesOrderStatus;
  }>;

  public readonly fieldMappings?: Readonly<SalesOrderCustomFieldMapping>;

}