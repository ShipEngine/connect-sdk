import { Connect, ConnectionAppDefinition, ErrorCode, FilePath } from "../../public";
import { App, AppPOJO } from "./app";
import { error } from "./errors";
import { Form, FormPOJO } from "./form";
import { Transaction, TransactionPOJO } from "./transaction";
import { _internal } from "./utils";
import { Joi, validate } from "./validation";

const _private = Symbol("private fields");


export interface ConnectionAppPOJO extends ConnectionAppDefinition, AppPOJO {
  connectionForm: FormPOJO;
  settingsForm?: FormPOJO;
  connect?: Connect;
}


export abstract class ConnectionApp extends App {
  public static readonly [_internal] = {
    label: "ShipEngine Connect app",
    schema: App[_internal].schema.keys({
      name: Joi.string().trim().singleLine().min(1).max(100).required(),
      description: Joi.string().trim().singleLine().allow("").max(1000),
      websiteURL: Joi.string().website().required(),
      logo: Joi.string().filePath({ ext: ".svg" }).required(),
      icon: Joi.string().filePath({ ext: ".svg" }).required(),
      connectionForm: Form[_internal].schema.required(),
      settingsForm: Form[_internal].schema,
      connect: Joi.function(),
    }),
  };

  private readonly [_private]: {
    readonly connect?: Connect;
  };

  public readonly name: string;
  public readonly description: string;
  public readonly websiteURL: URL;
  public readonly logo: FilePath;
  public readonly icon: FilePath;
  public readonly connectionForm: Form;
  public readonly settingsForm?: Form;

  public constructor(pojo: ConnectionAppPOJO) {
    super(pojo);

    this.name = pojo.name;
    this.description = pojo.description || "";
    this.websiteURL = new URL(pojo.websiteURL);
    this.logo = pojo.logo;
    this.icon = pojo.icon;
    this.connectionForm = new Form(pojo.connectionForm);
    this.settingsForm = pojo.settingsForm && new Form(pojo.settingsForm);

    this[_private] = {
      connect: pojo.connect ? pojo.connect : (this.connect = undefined),
    };
  }

  public async connect?(transaction: TransactionPOJO, connectionFormData: object): Promise<void> {
    let _transaction, _connectionFormData;
    let { connect } = this[_private];

    try {
      _transaction = new Transaction(validate(transaction, Transaction));
      _connectionFormData = Object.assign({}, connectionFormData);
    }
    catch (originalError) {
      throw error(ErrorCode.InvalidInput, "Invalid input to the connect method.", { originalError });
    }

    try {
      await connect!(_transaction, _connectionFormData);
    }
    catch (originalError) {
      let transactionID = _transaction.id;
      throw error((originalError.code || ErrorCode.AppError), "Error in the connect method.", { originalError, transactionID });
    }
  }
}
