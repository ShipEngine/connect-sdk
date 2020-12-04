import { AddressWithContactInfo, SalesOrderItem, ShippingPreferences } from "../../internal";

export interface RequestedFulfillmentExtensions {
    customField1?: string;
    customField2?: string;
    customField3?: string;
} 

export interface RequestedFulfillmentPOJO {
    items: SalesOrderItem[];
    shippingPreferences: ShippingPreferences;
    shipTo: AddressWithContactInfo;
    extensions?: RequestedFulfillmentExtensions;
}
