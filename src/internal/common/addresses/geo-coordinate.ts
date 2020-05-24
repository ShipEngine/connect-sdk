import { GeoCoordinate as IGeoCoordinate, GeoCoordinatePOJO } from "../../../public";
import { hideAndFreeze, _internal } from "../utils";
import { Joi } from "../validation";

export class GeoCoordinate implements IGeoCoordinate {
  public static readonly [_internal] = {
    label: "geo coordinate",
    schema: Joi.object({
      latitude: Joi.number().min(-90).max(90).required(),
      longitude: Joi.number().min(-180).max(180).required(),
    }),
  };

  public readonly latitude: number;
  public readonly longitude: number;

  public constructor(pojo: GeoCoordinatePOJO) {
    this.latitude = pojo.latitude;
    this.longitude = pojo.longitude;

    // Make this object immutable
    hideAndFreeze(this);
  }
}
