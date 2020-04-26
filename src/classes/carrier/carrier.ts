import { Country } from "../../countries";
import { LabelFormat, LabelSize, ManifestType, ServiceArea } from "../../enums";
import { CarrierPOJO } from "../../pojos/carrier";
import { UUID } from "../../types";
import { Joi } from "../../validation";
import { App, Logo } from "../common";
import { DeliveryConfirmation } from "./delivery-confirmation";
import { DeliveryService } from "./delivery-service";
import { Packaging } from "./packaging";
import { PickupService } from "./pickup-service";
import { getMaxServiceArea } from "./utils";

/**
 * A carrier that provides delivery services
 */
export class Carrier {
  //#region Class Fields

  public static readonly label = "carrier";

  /** @internal */
  public static readonly schema = Joi.object({
    id: Joi.string().uuid().required(),
    name: Joi.string().trim().singleLine().min(1).max(100).required(),
    description: Joi.string().trim().singleLine().allow("").max(1000),
    websiteURL: Joi.string().website().required(),
    logo: Joi.object().required(),
    deliveryServices: Joi.array().min(1).items(DeliveryService.schema).required(),
    pickupServices: Joi.array().items(PickupService.schema),
  });

  //#endregion
  //#region Instance Fields

  /**
   * A UUID that uniquely identifies the carrier.
   * This ID should never change, even if the carrier name changes.
   */
  public readonly id: UUID;

  /**
   * The user-friendly carrier name (e.g. "FedEx", "Australia Post")
   */
  public readonly name: string;

  /**
   * A short, user-friendly description of the carrier
   */
  public readonly description: string;

  /**
   * The URL of the carrier's website
   */
  public readonly websiteURL: URL;

  /**
   * The carrier's logo image
   */
  public readonly logo: Logo;

  /**
   * The delivery services that are offered by this carrier
   */
  public readonly deliveryServices: ReadonlyArray<DeliveryService>;

  /**
   * The package pickup services that are offered by this carrier
   */
  public readonly pickupServices: ReadonlyArray<PickupService>;

  //#endregion
  //#region Helper Properties

  /**
   * The service area that this provider covers.
   * This is the maximum service area of all delivery services offered by the carrier.
   */
  public get serviceArea(): ServiceArea {
    return getMaxServiceArea(this.deliveryServices);
  }

  /**
   * Indicates whether this provider consolidates multiple carrier services.
   * This property is `true` if any of the carrier's delivery services are consolidation services.
   */
  public get isConsolidator(): boolean {
    return this.deliveryServices.some((svc) => svc.isConsolidationService);
  }

  /**
   * Indicates whether a tracking number is provided.
   * This property is `true` if any of the carrier's delivery services have tracking.
   */
  public get hasTracking(): boolean {
    return this.deliveryServices.some((svc) => svc.hasTracking);
  }

  /**
   * Indicates whether the carrier provides a sandbox/development API for any of its delivery
   * or pickup services.
   */
  public get hasSandbox(): boolean {
    let hasSandbox = (svc: { hasSandbox: boolean }) => svc.hasSandbox;
    let found = this.deliveryServices.some(hasSandbox);
    found || (found = this.pickupServices.some(hasSandbox));
    return found;
  }

  /**
   * Indicates whether this service requires a manifest, and if so, what type.
   * This property is `false` if none of the carrier's delivery services require a manifest.
   */
  public get requiresManifest(): false | ManifestType {
    for (let service of this.deliveryServices) {
      if (service.requiresManifest) {
        return service.requiresManifest;
      }
    }
    return false;
  }

  /**
   * The label formats that are offered for this service.
   * This list includes all unique label formats that are offered by all of the carrier's delivery services.
   */
  public get labelFormats(): ReadonlyArray<LabelFormat> {
    let labelFormats = new Set<LabelFormat>();
    for (let service of this.deliveryServices) {
      for (let labelFormat of service.labelFormats) {
        labelFormats.add(labelFormat);
      }
    }
    return Object.freeze([...labelFormats]);
  }

  /**
   * The label dimensions that are used for this service.
   * This list includes all unique label sizes that are offered by all of the carrier's delivery services.
   */
  public get labelSizes(): ReadonlyArray<LabelSize> {
    let labelSizes = new Set<LabelSize>();
    for (let service of this.deliveryServices) {
      for (let labelSize of service.labelSizes) {
        labelSizes.add(labelSize);
      }
    }
    return Object.freeze([...labelSizes]);
  }

  /**
   * All countries that this provider ships to or from.
   * This list includes all unique origin and delivery countries for all of the carrier's delivery services.
   */
  public get countries(): ReadonlyArray<Country> {
    let countries = new Set(this.originCountries.concat(this.destinationCountries));
    return Object.freeze([...countries]);
  }

  /**
   * All origin countries that this provider ships from.
   * This list includes all unique origin countries for all of the carrier's delivery services.
   */
  public get originCountries(): ReadonlyArray<Country> {
    let countries = new Set<Country>();
    for (let service of this.deliveryServices) {
      for (let country of service.originCountries) {
        countries.add(country);
      }
    }
    return Object.freeze([...countries]);
  }

  /**
   * All destination countries that this provider ships to.
   * This list includes all unique delivery countries for all of the carrier's delivery services.
   */
  public get destinationCountries(): ReadonlyArray<Country> {
    let countries = new Set<Country>();
    for (let service of this.deliveryServices) {
      for (let country of service.destinationCountries) {
        countries.add(country);
      }
    }
    return Object.freeze([...countries]);
  }

  /**
   * The types of packaging that are provided/allowed for this service.
   * This list includes all unique packaging types for all of the carrier's delivery services.
   */
  public get packaging(): ReadonlyArray<Packaging> {
    let packaging = new Set<Packaging>();
    for (let service of this.deliveryServices) {
      for (let parcel of service.packaging) {
        packaging.add(parcel);
      }
    }
    return Object.freeze([...packaging]);
  }

  /**
   * The types of package delivery confirmations offered for this service.
   * This list includes all unique delivery confirmations for all of the carrier's delivery services.
   */
  public get deliveryConfirmations(): ReadonlyArray<DeliveryConfirmation> {
    let deliveryConfirmations = new Set<DeliveryConfirmation>();
    for (let service of this.deliveryServices) {
      for (let deliveryConfirmation of service.deliveryConfirmations) {
        deliveryConfirmations.add(deliveryConfirmation);
      }
    }
    return Object.freeze([...deliveryConfirmations]);
  }

  //#endregion

  public constructor(pojo: CarrierPOJO, app: App) {
    this.id = app._references.add(this, pojo);
    this.name = pojo.name;
    this.description = pojo.description || "";
    this.websiteURL = new URL(pojo.websiteURL);
    this.logo =  new Logo(pojo.logo);
    this.deliveryServices = pojo.deliveryServices.map((svc) => new DeliveryService(svc, app, this));
    this.pickupServices = pojo.pickupServices
      ? pojo.pickupServices.map((svc) => new PickupService(svc, app, this)) : [];

    // Prevent modifications after validation
    Object.freeze(this);
    Object.freeze(this.websiteURL);
  }
}
