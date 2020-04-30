import { error, ErrorCode } from "../../errors";
import { LocalizedBrandingPOJO, TransactionPOJO } from "../../pojos/common";
import { ConnectionPOJO } from "../../pojos/connection";
import { UUID } from "../../types";
import { Joi } from "../../validation";
import { Logo, Transaction } from "../common";
import { App } from "../common/app";
import { Localization, localize } from "../common/localization";
import { hideAndFreeze, _internal } from "../utils";
import { Form } from "./form";
import { Connect } from "./methods";

const _private = Symbol("private fields");

/**
 * A connection to a third-party service, such as a carrier or marketplace
 */
export class Connection {
  //#region Private/Internal Fields

  /** @internal */
  public static readonly [_internal] = {
    label: "connection",
    schema: Joi.object({
      id: Joi.string().uuid().required(),
      name: Joi.string().trim().singleLine().min(1).max(100).required(),
      description: Joi.string().trim().singleLine().allow("").max(1000),
      websiteURL: Joi.string().website().required(),
      logo: Joi.object().required(),
      connectForm: Form[_internal].schema.required(),
      settingsForm: Form[_internal].schema,
      localization: Joi.object().localization({
        name: Joi.string().trim().singleLine().min(1).max(100),
        description: Joi.string().trim().singleLine().allow("").max(1000),
        websiteURL: Joi.string().website(),
      }),
      connect: Joi.function().required(),
    }),
  };

  /** @internal */
  private readonly [_private]: {
    readonly app: App;
    readonly localization: Localization<LocalizedBrandingPOJO>;
    readonly connect: Connect;
  };

  //#endregion
  //#region Public Fields

  /**
   * A UUID that uniquely identifies the connection.
   * This ID should never change, even if the connection name changes.
   */
  public readonly id: UUID;

  /**
   * The user-friendly connection name (e.g. "FedEx", "Shopify")
   */
  public readonly name: string;

  /**
   * A short, user-friendly description of the connection
   */
  public readonly description: string;

  /**
   * The URL of the third-party service's website
   */
  public readonly websiteURL: URL;

  /**
   * The third party service's logo image
   */
  public readonly logo: Logo;

  /**
   * A form that allows the user to connect to the third-party service.
   * This form will usually prompt for an account number and login credentials.
   */
  public readonly connectForm: Form;

  /**
   * A form that allows the user to configure connection settings
   */
  public readonly settingsForm?: Form;

  //#endregion

  public constructor(pojo: ConnectionPOJO, app: App) {
    this.id = pojo.id;
    this.name = pojo.name;
    this.description = pojo.description || "";
    this.websiteURL = new URL(pojo.websiteURL);
    this.logo =  new Logo(pojo.logo);
    this.connectForm = new Form(pojo.connectForm);
    this.settingsForm = pojo.settingsForm && new Form(pojo.settingsForm);

    this[_private] = {
      app,
      localization: new Localization(pojo.localization || {}),
      connect: pojo.connect,
    };

    // Make this object immutable
    hideAndFreeze(this);

    app[_internal].references.add(this);
  }

  /**
   * Creates a copy of the connection, localized for the specified locale if possible.
   */
  public localize(locale: string): Connection {
    let pojo = localize(this, locale);
    return new Connection(pojo, this[_private].app);
  }

  /**
   * Returns the connection as a POJO that can be safely serialized as JSON.
   * Optionally returns the POJO localized to the specifeid language and region.
   */
  public toJSON(locale?: string): ConnectionPOJO {
    let { localization, connect } = this[_private];
    let localizedValues = locale ? localization.lookup(locale) : {};

    return {
      ...this,
      websiteURL: this.websiteURL.href,
      connect,
      localization: localization.toJSON(),
      ...localizedValues,
    };
  }

  //#region Wrappers around user-defined methdos

  /**
   * Connects to an existing account using the data that was gathered in the `connectForm`.
   * NOTE: This function does not return a value. It updates the `transaction.session` property.
   */
  public async connect(transaction: TransactionPOJO, connectionData: object): Promise<void> {
    let _transaction, _connectionData;
    let { connect } = this[_private];

    try {
      _transaction = new Transaction(transaction);
      _connectionData = Object.assign({}, connectionData);
    }
    catch (originalError) {
      throw error(ErrorCode.InvalidInput, "Invalid input to the connect method.", { originalError });
    }

    try {
      await connect(_transaction, _connectionData);
    }
    catch (originalError) {
      let transactionID = _transaction.id;
      throw error(ErrorCode.AppError, `Error in connect method.`, { originalError, transactionID });
    }
  }

  //#endregion
}

// Prevent modifications to the class
hideAndFreeze(Connection);
