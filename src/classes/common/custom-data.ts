import { CustomDataPOJO } from "../../pojos/common";
import { Joi } from "../../validation";
import { hideAndFreeze, _internal } from "../utils";

/**
 * Arbitrary data that will be persisted by the ShipEngine Integration Platform.
 */
export class CustomData {
  //#region Private/Internal Fields

  /** @internal */
  public static readonly [_internal] = {
    label: "custom data",
    schema: Joi.object().pattern(Joi.string(), Joi.string().allow("")),
  };

  //#endregion
  //#region Public Fields

  readonly [key: string]: string;

  //#endregion

  public constructor(pojo: CustomDataPOJO = {}) {
    // Copy all keys & values to this object
    // NOTE: DO NOT use Object.assign() here because it copies Symbol keys. We only want string keys.
    for (let key of Object.keys(pojo)) {
      let value = pojo[key];
      if (value !== undefined) {
        // @ts-ignore
        this[key] = pojo[key];
      }
    }

    // Make this object immutable
    hideAndFreeze(this);
  }
}

// Prevent modifications to the class
hideAndFreeze(CustomData);
