import { error, ErrorCode } from "../../errors";
import { TransactionPOJO } from "../../pojos/common";
import { ConnectionPOJO } from "../../pojos/connection";
import { UUID } from "../../types";
import { Joi } from "../../validation";
import { Logo, Transaction } from "../common";
import { App } from "../common/app";
import { hidePrivateFields } from "../utils";
import { Form } from "./form";
import { Connect } from "./methods";

/**
 * A connection to a third-party service, such as a carrier or marketplace
 */
export class Connection {
  //#region Class Fields

  public static readonly label = "connection";

  /** @internal */
  public static readonly schema = Joi.object({
    id: Joi.string().uuid().required(),
    name: Joi.string().trim().singleLine().min(1).max(100).required(),
    description: Joi.string().trim().singleLine().allow("").max(1000),
    websiteURL: Joi.string().website().required(),
    logo: Joi.object().required(),
    connectForm: Form.schema.required(),
    settingsForm: Form.schema,
    connect: Joi.function().required(),
  });

  //#endregion
  //#region Instance Fields

  // Store the user-defined methods as private fields.
  // We wrap these methods with our own signatures below
  private readonly _connect: Connect;

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
   * The ShipEngine Integration Platform app that this connection is part of.
   */
  public readonly settingsForm?: Form;

  //#endregion

  public constructor(pojo: ConnectionPOJO, app: App) {
    this.id = app._references.add(this, pojo);
    this.name = pojo.name;
    this.description = pojo.description || "";
    this.websiteURL = new URL(pojo.websiteURL);
    this.logo =  new Logo(pojo.logo);
    this.connectForm = new Form(pojo.connectForm);

    // Store any user-defined methods as private fields.
    this._connect = pojo.connect;

    // Hide private fields
    hidePrivateFields(this);

    // Prevent modifications after validation
    Object.freeze(this);
    Object.freeze(this.websiteURL);
    Object.freeze(this.connect);
  }

  //#region Wrappers around user-defined methdos

  /**
   * Connects to an existing account using the data that was gathered in the `connectForm`.
   * NOTE: This function does not return a value. It updates the `transaction.session` property.
   */
  public async connect(transaction: TransactionPOJO, connectionData: object): Promise<void> {
    let _transaction, _connectionData;

    try {
      _transaction = new Transaction(transaction);
      _connectionData = Object.assign({}, connectionData);
    }
    catch (originalError) {
      throw error(ErrorCode.InvalidInput, "Invalid input to the connect method.", { originalError });
    }

    try {
      await this._connect(_transaction, _connectionData);
    }
    catch (originalError) {
      let transactionID = _transaction.id;
      throw error(ErrorCode.AppError, `Error in connect method.`, { originalError, transactionID });
    }
  }

  //#endregion
}
