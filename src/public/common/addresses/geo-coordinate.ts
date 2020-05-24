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
export interface GeoCoordinate {
  /**
   * The latitude of the point. Represented as signed degrees between -90.0 and +90.0.
   *
   * @see http://www.geomidpoint.com/latlon.html
   */
  readonly latitude: number;

  /**
   * The longitude of the point. Represented as signed degrees between -180.0 and +180.0.
   *
   * @see http://www.geomidpoint.com/latlon.html
   */
  readonly longitude: number;
}
