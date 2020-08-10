import { MonetaryValuePOJO } from "../common/measures/monetary-value";

export interface SalesOrderCharges {
  subTotal?: MonetaryValuePOJO;
  taxAmount?: MonetaryValuePOJO;
  shippingAmount?: MonetaryValuePOJO;
  shippingCost?: MonetaryValuePOJO;
  confirmationCost?: MonetaryValuePOJO;
  insuranceCost?: MonetaryValuePOJO;
  otherCost?: MonetaryValuePOJO;
}
