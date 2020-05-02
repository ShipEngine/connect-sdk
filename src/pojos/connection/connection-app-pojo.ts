import { AppPOJO } from "../common";
import { ConnectionPOJO } from "./definitions-pojo";

/**
 * A ShipEngine Integration Platform connection app
 */
export interface ConnectionAppPOJO extends AppPOJO {
  connection: ConnectionPOJO;
}
