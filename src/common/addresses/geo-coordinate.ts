import { hideAndFreeze, _internal } from "../internal/utils";
import { Joi } from "../internal/validation";

/**
 * The geo coordinates of a location on Earth
 */
export interface GeoCoordinatePOJO {
  /**
   * The latitude of the point. Represented as signed degrees between -90.0 and +90.0.
   *
   * @see http://www.geomidpoint.com/latlon.html
   */
  latitude: number;

  /**
   * The longitude of the point. Represented as signed degrees between -180.0 and +180.0.
   *
   * @see http://www.geomidpoint.com/latlon.html
   */
  longitude: number;
}


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

  /**
   * The latitude of the point. Represented as signed degrees between -90.0 and +90.0.
   *
   * @see http://www.geomidpoint.com/latlon.html
   */
  public readonly latitude: number;

  /**
   * The longitude of the point. Represented as signed degrees between -180.0 and +180.0.
   *
   * @see http://www.geomidpoint.com/latlon.html
   */
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
