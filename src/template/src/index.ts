import { Config, OrderPayload } from "@shipengine/ipaas-types";

/**
 * This is the base IPaaS config object that is required for your IPaaS integration.
 */
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
