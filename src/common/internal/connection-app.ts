import { ConnectionAppPOJO } from "../connection-app-pojo";
import { ErrorCode } from "../errors";
import { Form } from "../form";
import { LocalizedBrandingPOJO } from "../localization-pojo";
import { Connect } from "../methods";
import { Transaction } from "../transaction";
import { TransactionPOJO } from "../transaction-pojo";
import { FilePath } from "../types";
import { App } from "./app";
import { Localization } from "./localization";
import { error, _internal } from "./utils";
import { Joi, validate } from "./validation";

const _private = Symbol("private fields");

/**
 * A ShipEngine Integration Platform app that connects to a service, such as a carrier or marketplace
 */
export abstract class ConnectionApp extends App {
  //#region Private/Internal Fields

  /** @internal */
  public static readonly [_internal] = {
    label: "ShipEngine Integration Platform app",
    schema: App[_internal].schema.keys({
      name: Joi.string().trim().singleLine().min(1).max(100).required(),
      description: Joi.string().trim().singleLine().allow("").max(1000),
      websiteURL: Joi.string().website().required(),
      logo: Joi.string().filePath({ ext: ".svg" }).required(),
      connectionForm: Form[_internal].schema.required(),
      settingsForm: Form[_internal].schema,
      localization: Joi.object().localization({
        name: Joi.string().trim().singleLine().allow("").max(100),
        description: Joi.string().trim().singleLine().allow("").max(1000),
        websiteURL: Joi.string().website(),
      }),
      connect: Joi.function().required(),
    }),
  };

  /** @internal */
  private readonly [_private]: {
    readonly localization: Localization<LocalizedBrandingPOJO>;
    readonly connect: Connect;
  };

  //#endregion
  //#region Public Fields

  /**
   * The user-friendly app name (e.g. "FedEx", "Shopify")
   */
  public readonly name: string;

  /**
   * A short, user-friendly description of the app
   */
  public readonly description: string;

  /**
   * The URL of the third-party service's website
   */
  public readonly websiteURL: URL;

  /**
   * The third party service's logo image
   */
  public readonly logo: FilePath;

  /**
   * A form that allows the user to connect to the third-party service.
   * This form will usually prompt for an account number and login credentials.
   */
  public readonly connectionForm: Form;

  /**
   * A form that allows the user to configure connection settings
   */
  public readonly settingsForm?: Form;

  //#endregion

  public constructor(pojo: ConnectionAppPOJO) {
    super(pojo);

    this.name = pojo.name;
    this.description = pojo.description || "";
    this.websiteURL = new URL(pojo.websiteURL);
    this.logo =  pojo.logo;
    this.connectionForm = new Form(pojo.connectionForm);
    this.settingsForm = pojo.settingsForm && new Form(pojo.settingsForm);

    this[_private] = {
      localization: new Localization(pojo.localization || {}),
      connect: pojo.connect,
    };
  }

  /**
   * Returns the app as a POJO that can be safely serialized as JSON.
   * Optionally returns the POJO localized to the specifeid language and region.
   */
  public toJSON(locale?: string): ConnectionAppPOJO {
    let { localization, connect } = this[_private];
    let localizedValues = locale ? localization.lookup(locale) : {};

    return {
      ...super.toJSON(),
      name: this.name,
      description: this.description,
      logo: this.logo,
      websiteURL: this.websiteURL.href,
      connectionForm: this.connectionForm.toJSON(locale),
      settingsForm: this.settingsForm && this.settingsForm.toJSON(locale),
      connect,
      localization: localization.toJSON(),
      ...localizedValues,
    };
  }

  //#region Wrappers around user-defined methdos

  /**
   * Connects to an existing account using the data that was gathered in the `connectionForm`.
   * NOTE: This function does not return a value. It updates the `transaction.session` property.
   */
  public async connect(transaction: TransactionPOJO, connectionFormData: object): Promise<void> {
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
      await connect(_transaction, _connectionFormData);
    }
    catch (originalError) {
      let transactionID = _transaction.id;
      throw error(ErrorCode.AppError, `Error in the connect method.`, { originalError, transactionID });
    }
  }

  //#endregion
}
