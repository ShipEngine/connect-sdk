import { GeoCoordinatePOJO } from "../../../pojos/common";
import { Joi } from "../../../validation";
import { hideAndFreeze, _internal } from "../../utils";

/**
 * The geo coordinates of a location on Earth
 */
export class GeoCoordinate {
  //#region Private/Internal Fields

  /** @internal */
  public static readonly [_internal] = {
    label: "geo coordinate",
    schema: Joi.object({
      latitude: Joi.number().min(-90).max(90).required(),
      longitude: Joi.number().min(-180).max(180).required(),
    }),
  };

  //#endregion
  //#region Public Fields

  public readonly latitude: number;
  public readonly longitude: number;

  //#endregion

  public constructor(pojo: GeoCoordinatePOJO) {
    this.latitude = pojo.latitude;
    this.longitude = pojo.longitude;

    // Make this object immutable
    hideAndFreeze(this);
  }
}

// Prevent modifications to the class
hideAndFreeze(GeoCoordinate);
