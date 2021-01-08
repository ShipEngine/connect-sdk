import { AddressWithContactInfoPOJO } from "../common/addresses/address-with-contact-info"
import { SalesOrderItem } from "./sales-order-item"
import { ShippingPreferences } from "./shipping-preferences"

export interface RequestedFulfillmentExtensions {
    customField1?: string;
    customField2?: string;
    customField3?: string;
} 

export interface RequestedFulfillmentPOJO {
    items: SalesOrderItem[];
    shippingPreferences: ShippingPreferences;
    shipTo: AddressWithContactInfoPOJO;
    extensions?: RequestedFulfillmentExtensions;
}
