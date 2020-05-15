import * as currency from "currency.js";
import { Identifier, MonetaryValue, Quantity } from "../../common";
import { hideAndFreeze, Joi, _internal } from "../../internal";
import { SalesOrderIdentifier } from "../../order";
import { PackageItemPOJO } from "./package-item-pojo";

/**
 * An item inside a package
 */
export class PackageItem {
  //#region Private/Internal Fields

  /** @internal */
  public static readonly [_internal] = {
    label: "package item",
    schema: Joi.object({
      sku: Joi.string().trim().singleLine().allow("").max(100),
      identifiers: Joi.array().items(Identifier[_internal].schema),
      salesOrder: SalesOrderIdentifier[_internal].schema,
      quantity: Quantity[_internal].schema.required(),
      unitPrice: MonetaryValue[_internal].schema.required(),
    }),
  };

  //#endregion
  //#region Public Fields

  /**
   * The Stock Keeping Unit code
   */
  public readonly sku: string;

  /**
   * Alternative identifiers associated with this item
   */
  public readonly identifiers: ReadonlyArray<Identifier>;

  /**
   * The sales order associated with this item
   */
  public readonly salesOrder?: SalesOrderIdentifier;

  /**
   * The quantity of this item in the package. May be zero.
   */
  public readonly quantity: Quantity;

  /**
   * The sale price of each item
   */
  public readonly unitPrice: MonetaryValue;

  /**
   * The total price of this item. This is `unitPrice` multiplied by `quantity`.
   */
  public get totalPrice(): MonetaryValue {
    return new MonetaryValue({
      value: currency(this.unitPrice.value).multiply(this.quantity.value).toString(),
      currency: this.unitPrice.currency,
    });
  }

  //#endregion

  public constructor(pojo: PackageItemPOJO) {
    this.sku = pojo.sku || "";
    this.identifiers = pojo.identifiers ? pojo.identifiers.map((id) => new Identifier(id)) : [];
    this.salesOrder = pojo.salesOrder && new SalesOrderIdentifier(pojo.salesOrder);
    this.quantity = new Quantity(pojo.quantity);
    this.unitPrice = new MonetaryValue(pojo.unitPrice);

    // Make this object immutable
    hideAndFreeze(this);
  }
}

// Prevent modifications to the class
hideAndFreeze(PackageItem);
