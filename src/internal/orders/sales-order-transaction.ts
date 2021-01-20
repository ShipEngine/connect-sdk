import { SalesOrderStatus, SalesOrderCustomFieldMappingPOJO } from "../../public"
import { Transaction, TransactionPOJO } from "../common/transaction"
import { _internal } from "../common/utils";
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

export class SalesOrderTransaction<T extends object = object> extends Transaction<T> {
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

  public readonly statusMappings?: Readonly<{
    [key: string]: SalesOrderStatus;
  }>;

  public readonly fieldMappings?: Readonly<SalesOrderCustomFieldMapping>;

  public constructor(pojo: SalesOrderTransactionPOJO<T>) {
    super(pojo);

    this.statusMappings = pojo.statusMappings;
    this.fieldMappings = pojo.fieldMappings && new SalesOrderCustomFieldMapping(pojo.fieldMappings)
  }
}