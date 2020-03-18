import { Config } from "@shipengine/ipaas-types";
import { OrderPayload } from "@shipengine/ipaas-types/src/get-orders";


export const config: Config = {
 
  type: "order-source",

  getOrders(params) {

    const orderPayload: OrderPayload = {
      page: 1,
      pages: 1,
      orders: []
    }

    return orderPayload;
  },

  updateOrder() {

  },

  services: [],
  packageType: [],
  logo: ""
}
