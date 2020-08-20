/**
 * The "Input" namespace contains all types that are passed as inputs to app methods.
 * Remove the "POJO" suffix from them, since ALL input types are POJOs, so it's redundant.
 */
export { CustomsPOJO as Customs } from "../public/carriers/customs/customs";
export { CustomsItemPOJO as CustomsItem } from "../public/carriers/customs/customs-item";
export { DeliveryConfirmationIdentifierPOJO as DeliveryConfirmationIdentifier } from "../public/carriers/delivery-confirmation";
export { DeliveryServiceIdentifierPOJO as DeliveryServiceIdentifier } from "../public/carriers/delivery-service";
export * from "../public/carriers/enums";
export { PackagingIdentifierPOJO as PackagingIdentifier } from "../public/carriers/packaging";
export { AddressPOJO as Address } from "../public/common/addresses/address";
export { AddressWithContactInfoPOJO as AddressWithContactInfo } from "../public/common/addresses/address-with-contact-info";
export { ContactInfoPOJO as ContactInfo } from "../public/common/addresses/contact-info";
export { Definition } from "../public/common/definition-identifier";
export * from "../public/common/enums";
export { IdentifiersPOJO as identifiers } from "../public/common/identifiers";
export { DateTimeZonePOJO as DateTimeZone } from "../public/common/measures/date-time-zone";
export { DimensionsPOJO as Dimensions } from "../public/common/measures/dimensions";
export { MonetaryValuePOJO as MonetaryValue } from "../public/common/measures/monetary-value";
export { QuantityPOJO as Quantity } from "../public/common/measures/quantity";
export { WeightPOJO as Weight } from "../public/common/measures/weight";
export { UUID } from "../public/common/types";
export * from "../public/orders/enums";
export { SalesOrderIdentifierPOJO as SalesOrderIdentifier } from "../public/orders/sales-order-identifier";
export { SalesOrderItemIdentifierPOJO as SalesOrderItemIdentifier } from "../public/orders/sales-order-item-identifier";
export { ProductIdentifierPOJO as ProductIdentifier } from "../public/products/product-identifier";
export { NewLabelPOJO as NewLabel } from "./carriers/documents/new-label";
export { NewManifestPOJO as NewManifest } from "./carriers/manifests/new-manifest";
export { NewPackagePOJO as NewPackage } from "./carriers/packages/new-package";
export { PackageItemPOJO as PackageItem } from "./carriers/packages/package-item";
export { PickupCancellationPOJO as PickupCancellation } from "./carriers/pickups/pickup-cancellation";
export { PickupRequestPOJO as PickupRequest } from "./carriers/pickups/pickup-request";
export { RateCriteriaPOJO as RateCriteria } from "./carriers/rates/rate-criteria";
export { NewShipmentPOJO as NewShipment } from "./carriers/shipments/new-shipment";
export { ShipmentCancellationPOJO as ShipmentCancellation } from "./carriers/shipments/shipment-cancellation";
export { TrackingCriteriaPOJO as TrackingCriteria } from "./carriers/tracking/tracking-criteria";
export { TransactionPOJO as Transaction } from "./common/transaction";
