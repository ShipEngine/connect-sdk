import { App, AppPOJO } from "./app";
import { Connect, ConnectionAppDefinition, ErrorCode, FilePath } from "../../public";
import { Form, FormPOJO } from "./form";
import { Joi, validate } from "./validation";
import { OAuthConfig, OAuthConfigPOJO } from "./oauth-config";
import { Transaction, TransactionPOJO } from "./transaction";
import { _internal } from "./utils";
import { error, SystemErrorCode } from "./errors";

const _private = Symbol("private fields");

export interface ConnectionAppPOJO extends ConnectionAppDefinition, AppPOJO {
  connect?: Connect;
  connectionForm: FormPOJO;
  oauthConfig?: OAuthConfigPOJO;
  settingsForm?: FormPOJO;
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
      oauthConfig: OAuthConfig[_internal].schema.optional(),
    }),
  };

  private readonly [_private]: {
    readonly connect?: Connect;
  };

  public readonly connectionForm: Form;
  public readonly description: string;
  public readonly icon: FilePath;
  public readonly logo: FilePath;
  public readonly name: string;
  public readonly oauthConfig?: OAuthConfig;
  public readonly settingsForm?: Form;
  public readonly websiteURL: URL;

  public constructor(pojo: ConnectionAppPOJO) {
    super(pojo);

    this.connectionForm = new Form(pojo.connectionForm);
    this.description = pojo.description || "";
    this.icon = pojo.icon;
    this.logo = pojo.logo;
    this.name = pojo.name;
    this.oauthConfig = pojo.oauthConfig && new OAuthConfig(pojo.oauthConfig);
    this.settingsForm = pojo.settingsForm && new Form(pojo.settingsForm);
    this.websiteURL = new URL(pojo.websiteURL);

    this[_private] = {
      connect: pojo.connect ? pojo.connect : (this.connect = undefined),
    };
  }

  public async connect?(transaction: TransactionPOJO, connectionFormData: object): Promise<void> {
    let _transaction, _connectionFormData;
    const { connect } = this[_private];

    try {
      _transaction = new Transaction(validate(transaction, Transaction));
      _connectionFormData = Object.assign({}, connectionFormData);
    }
    catch (originalError: unknown) {
      throw error(SystemErrorCode.InvalidInput, "Invalid input to the connect method.", { originalError });
    }

    try {
      await connect!(_transaction, _connectionFormData);
    }
    catch (originalError: unknown) {
      const err = originalError as Error;

      const transactionID = _transaction.id;
      throw error(ErrorCode.AppError, err.message, { originalError, transactionID });
    }
  }
}
