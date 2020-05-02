import { AppPOJO } from "../common";
import { CarrierPOJO } from "./definitions-pojo";

/**
 * A ShipEngine Integration Platform carrier app
 */
export interface CarrierAppPOJO extends AppPOJO {
  carrier: CarrierPOJO;
}
