import { Connect, ConnectionApp as IConnectionApp, ConnectionApp as ConnectionAppPOJO, ErrorCode, FilePath, Transaction as TransactionPOJO } from "../../definitions";
import { App } from "./app";
import { error } from "./errors";
import { Form } from "./form";
import { Transaction } from "./transaction";
import { _internal } from "./utils";
import { Joi, validate } from "./validation";

const _private = Symbol("private fields");

export abstract class ConnectionApp extends App implements IConnectionApp {
  public static [_internal] = {
    label: "ShipEngine Integration Platform app",
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

  private [_private]: {
    connect?: Connect;
  };

  public name: string;
  public description: string;
  public websiteURL: URL;
  public logo: FilePath;
  public icon: FilePath;
  public connectionForm: Form;
  public settingsForm?: Form;

  public constructor(pojo: ConnectionAppPOJO) {
    super(pojo);

    this.name = pojo.name;
    this.description = pojo.description || "";
    this.websiteURL = pojo.websiteURL;
    this.logo =  pojo.logo;
    this.icon =  pojo.icon;
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
      throw error(ErrorCode.AppError, `Error in the connect method.`, { originalError, transactionID });
    }
  }
}
