import { AppType, CarrierApp as ICarrierApp, CarrierApp as CarrierAppPOJO, Country, DocumentFormat, DocumentSize, ManifestLocation, ManifestShipment, ManifestType, Packaging, ServiceArea } from "../../definitions";
import { ConnectionApp, hideAndFreeze, Joi, validate, _internal } from "../common";
import { DeliveryConfirmation } from "./delivery-confirmation";
import { DeliveryService } from "./delivery-service";
import { PickupService } from "./pickups/pickup-service";
import { getMaxServiceArea } from "./utils";



export class CarrierApp extends ConnectionApp implements ICarrierApp {
  //#region Private/Internal Fields

  public static [_internal] = {
    label: "ShipEngine Integration Platform carrier app",
    schema: ConnectionApp[_internal].schema.keys({
      manifestLocations: Joi.string().enum(ManifestLocation)
        .when("createManifest", { is: Joi.function().required(), then: Joi.required() }),
      manifestShipments: Joi.string().enum(ManifestShipment)
        .when("createManifest", { is: Joi.function().required(), then: Joi.required() }),

      manifestType: Joi.string().enum(ManifestType).required(),
      deliveryServices: Joi.array().min(1).items(DeliveryService[_internal].schema).required(),
      pickupServices: Joi.array().items(PickupService[_internal].schema),
      createShipment: Joi.function(),
      cancelShipments: Joi.function(),
      rateShipment: Joi.function(),
      trackShipment: Joi.function(),
      createManifest: Joi.function(),
      schedulePickup: Joi.function(),
      cancelPickups: Joi.function(),
    }),
  };


  //#endregion
  //#region Public Fields

  public type: AppType;
  public manifestLocations?: ManifestLocation;
  public manifestShipments?: ManifestShipment;
  public manifestType: ManifestType;
  public deliveryServices: Array<DeliveryService>;
  public pickupServices: Array<PickupService>;
  public supportsReturns: boolean;

  public get serviceArea(): ServiceArea {
    return getMaxServiceArea(this.deliveryServices);
  }

  public get isConsolidator(): boolean {
    return this.deliveryServices.some((svc) => svc.isConsolidationService);
  }

  public get hasInsurance(): boolean {
    return this.deliveryServices.some((svc) => svc.isInsurable);
  }

  public get hasTracking(): boolean {
    return this.deliveryServices.some((svc) => svc.isTrackable);
  }

  public get hasSandbox(): boolean {
    let hasSandbox = (svc: { hasSandbox: boolean }) => svc.hasSandbox;
    let found = this.deliveryServices.some(hasSandbox);
    found || (found = this.pickupServices.some(hasSandbox));
    return found;
  }

  public get labelFormats(): Array<DocumentFormat> {
    let labelFormats = new Set<DocumentFormat>();
    for (let service of this.deliveryServices) {
      for (let labelFormat of service.labelFormats) {
        labelFormats.add(labelFormat);
      }
    }
    return [...labelFormats];
  }

  public get labelSizes(): Array<DocumentSize> {
    let labelSizes = new Set<DocumentSize>();
    for (let service of this.deliveryServices) {
      for (let labelSize of service.labelSizes) {
        labelSizes.add(labelSize);
      }
    }
    return [...labelSizes];
  }

  public get countries(): Array<Country> {
    let countries = new Set(this.originCountries.concat(this.destinationCountries));
    return [...countries];
  }

  public get originCountries(): Array<Country> {
    let countries = new Set<Country>();
    for (let service of this.deliveryServices) {
      for (let country of service.originCountries) {
        countries.add(country);
      }
    }
    return [...countries];
  }

  public get destinationCountries(): Array<Country> {
    let countries = new Set<Country>();
    for (let service of this.deliveryServices) {
      for (let country of service.destinationCountries) {
        countries.add(country);
      }
    }
    return [...countries];
  }

  public get packaging(): Array<Packaging> {
    let packaging = new Map<string, Packaging>();
    for (let service of this.deliveryServices) {
      for (let parcel of service.packaging) {
        packaging.set(parcel.id, parcel);
      }
    }
    return Array.from(packaging.values());
  }

  public get deliveryConfirmations(): Array<DeliveryConfirmation> {
    let deliveryConfirmations = new Map<string, DeliveryConfirmation>();
    for (let service of this.deliveryServices) {
      for (let deliveryConfirmation of service.deliveryConfirmations) {
        deliveryConfirmations.set(deliveryConfirmation.id, deliveryConfirmation);
      }
    }
    return Array.from(deliveryConfirmations.values());
  }

  //#endregion

  public constructor(pojo: CarrierAppPOJO) {
    validate(pojo, CarrierApp);

    super(pojo);

    this.type = AppType.Carrier;
    this.manifestLocations = pojo.manifestLocations;
    this.manifestShipments = pojo.manifestShipments;
    this.manifestType = pojo.manifestType;
    this.deliveryServices = pojo.deliveryServices.map((svc) => new DeliveryService(svc, this));
    this.pickupServices = pojo.pickupServices
      ? pojo.pickupServices.map((svc) => new PickupService(svc, this)) : [];

    this.supportsReturns = this.deliveryServices.some((ds) => ds.supportsReturns);

    // Make this object immutable
    hideAndFreeze(this);

    this[_internal].references.add(this);
    this[_internal].references.finishedLoading();
  }
}
