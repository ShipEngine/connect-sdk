import { AppType, CancellationStatus, CancelPickups, CancelShipments, CarrierApp as ICarrierApp, CarrierAppPOJO, Country, CreateManifest, CreateShipment, DocumentFormat, DocumentSize, ErrorCode, ManifestLocation, ManifestShipment, ManifestType, NewManifestPOJO, NewShipmentPOJO, Packaging, PickupCancellationPOJO, PickupRequestPOJO, RateCriteriaPOJO, RateShipment, SchedulePickup, ServiceArea, ShipmentCancellationPOJO, TrackingCriteriaPOJO, TrackShipment, TransactionPOJO } from "../../definitions";
import { ConnectionApp, error, hideAndFreeze, Joi, Transaction, validate, validateArray, _internal } from "../common";
import { DeliveryConfirmation } from "./delivery-confirmation";
import { DeliveryService } from "./delivery-service";
import { ManifestConfirmation } from "./manifests/manifest-confirmation";
import { NewManifest } from "./manifests/new-manifest";
import { PickupCancellation } from "./pickups/pickup-cancellation";
import { PickupCancellationOutcome } from "./pickups/pickup-cancellation-outcome";
import { PickupConfirmation } from "./pickups/pickup-confirmation";
import { PickupRequest } from "./pickups/pickup-request";
import { PickupService } from "./pickups/pickup-service";
import { Rate } from "./rates/rate";
import { RateCriteria } from "./rates/rate-criteria";
import { NewShipment } from "./shipments/new-shipment";
import { ShipmentCancellation } from "./shipments/shipment-cancellation";
import { ShipmentCancellationOutcome } from "./shipments/shipment-cancellation-outcome";
import { ShipmentConfirmation } from "./shipments/shipment-confirmation";
import { TrackingCriteria } from "./tracking/tracking-criteria";
import { TrackingInfo } from "./tracking/tracking-info";
import { getMaxServiceArea } from "./utils";

const _private = Symbol("private fields");


export class CarrierApp extends ConnectionApp implements ICarrierApp {
  //#region Private/Internal Fields

  public static readonly [_internal] = {
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

  private readonly [_private]: {
    readonly createShipment?: CreateShipment;
    readonly cancelShipments?: CancelShipments;
    readonly rateShipment?: RateShipment;
    readonly trackShipment?: TrackShipment;
    readonly createManifest?: CreateManifest;
    readonly schedulePickup?: SchedulePickup;
    readonly cancelPickups?: CancelPickups;
  };

  //#endregion
  //#region Public Fields

  public readonly type: AppType;
  public readonly manifestLocations?: ManifestLocation;
  public readonly manifestShipments?: ManifestShipment;
  public readonly manifestType: ManifestType;
  public readonly deliveryServices: ReadonlyArray<DeliveryService>;
  public readonly pickupServices: ReadonlyArray<PickupService>;
  public readonly supportsReturns: boolean;

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

  public get labelFormats(): ReadonlyArray<DocumentFormat> {
    let labelFormats = new Set<DocumentFormat>();
    for (let service of this.deliveryServices) {
      for (let labelFormat of service.labelFormats) {
        labelFormats.add(labelFormat);
      }
    }
    return Object.freeze([...labelFormats]);
  }

  public get labelSizes(): ReadonlyArray<DocumentSize> {
    let labelSizes = new Set<DocumentSize>();
    for (let service of this.deliveryServices) {
      for (let labelSize of service.labelSizes) {
        labelSizes.add(labelSize);
      }
    }
    return Object.freeze([...labelSizes]);
  }

  public get countries(): ReadonlyArray<Country> {
    let countries = new Set(this.originCountries.concat(this.destinationCountries));
    return Object.freeze([...countries]);
  }

  public get originCountries(): ReadonlyArray<Country> {
    let countries = new Set<Country>();
    for (let service of this.deliveryServices) {
      for (let country of service.originCountries) {
        countries.add(country);
      }
    }
    return Object.freeze([...countries]);
  }

  public get destinationCountries(): ReadonlyArray<Country> {
    let countries = new Set<Country>();
    for (let service of this.deliveryServices) {
      for (let country of service.destinationCountries) {
        countries.add(country);
      }
    }
    return Object.freeze([...countries]);
  }

  public get packaging(): ReadonlyArray<Packaging> {
    let packaging = new Map<string, Packaging>();
    for (let service of this.deliveryServices) {
      for (let parcel of service.packaging) {
        packaging.set(parcel.id, parcel);
      }
    }
    return Object.freeze(Array.from(packaging.values()));
  }

  public get deliveryConfirmations(): ReadonlyArray<DeliveryConfirmation> {
    let deliveryConfirmations = new Map<string, DeliveryConfirmation>();
    for (let service of this.deliveryServices) {
      for (let deliveryConfirmation of service.deliveryConfirmations) {
        deliveryConfirmations.set(deliveryConfirmation.id, deliveryConfirmation);
      }
    }
    return Object.freeze(Array.from(deliveryConfirmations.values()));
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

    this[_private] = {
      // Store any user-defined methods as private fields.
      // For any methods that aren't implemented, set the corresponding class method implements Imethod to undefined.
      createShipment: pojo.createShipment ? pojo.createShipment : (this.createShipment = undefined),
      cancelShipments: pojo.cancelShipments ? pojo.cancelShipments : (this.cancelShipments = undefined),
      rateShipment: pojo.rateShipment ? pojo.rateShipment : (this.rateShipment = undefined),
      trackShipment: pojo.trackShipment ? pojo.trackShipment : (this.trackShipment = undefined),
      createManifest: pojo.createManifest ? pojo.createManifest : (this.createManifest = undefined),
      schedulePickup: pojo.schedulePickup ? pojo.schedulePickup : (this.schedulePickup = undefined),
      cancelPickups: pojo.cancelPickups ? pojo.cancelPickups : (this.cancelPickups = undefined),
    };

    // Make this object immutable
    hideAndFreeze(this);

    this[_internal].references.add(this);
    this[_internal].references.finishedLoading();
  }

  //#region  Methods

  public async createShipment?(
    transaction: TransactionPOJO, shipment: NewShipmentPOJO): Promise<ShipmentConfirmation> {

    let _transaction, _shipment;
    let { createShipment } = this[_private];

    try {
      _transaction = new Transaction(validate(transaction, Transaction));
      _shipment = new NewShipment(validate(shipment, NewShipment), this);
    }
    catch (originalError) {
      throw error(ErrorCode.InvalidInput, "Invalid input to the createShipment method.", { originalError });
    }

    try {
      let confirmation = await createShipment!(_transaction, _shipment);
      return new ShipmentConfirmation(validate(confirmation, ShipmentConfirmation));
    }
    catch (originalError) {
      let transactionID = _transaction.id;
      throw error(ErrorCode.AppError, `Error in the createShipment method.`, { originalError, transactionID });
    }
  }

  public async cancelShipments?(
    transaction: TransactionPOJO, shipments: ShipmentCancellationPOJO[]): Promise<ShipmentCancellationOutcome[]> {

    let _transaction, _shipments;
    let { cancelShipments } = this[_private];

    try {
      _transaction = new Transaction(validate(transaction, Transaction));
      _shipments = validateArray(shipments, ShipmentCancellation)
        .map((shipment) => new ShipmentCancellation(shipment));
    }
    catch (originalError) {
      throw error(ErrorCode.InvalidInput, "Invalid input to the cancelShipments method.", { originalError });
    }

    try {
      let confirmations = await cancelShipments!(_transaction, _shipments);

      if (!confirmations) {
        // Nothing was returned, so assume all shipments were cancelled successfully
        confirmations = _shipments.map((shipment) => ({
          cancellationID: shipment.cancellationID,
          status: CancellationStatus.Success,
        }));
      }

      return validateArray(confirmations, ShipmentCancellationOutcome)
        .map((confirmation) => new ShipmentCancellationOutcome(confirmation));
    }
    catch (originalError) {
      let transactionID = _transaction.id;
      throw error(ErrorCode.AppError, `Error in the cancelShipments method.`, { originalError, transactionID });
    }
  }

  public async rateShipment?(
    transaction: TransactionPOJO, shipment: RateCriteriaPOJO): Promise<Rate[]> {

    let _transaction, _shipment;
    let { rateShipment } = this[_private];

    try {
      _transaction = new Transaction(validate(transaction, Transaction));
      _shipment = new RateCriteria(validate(shipment, RateCriteria), this);
    }
    catch (originalError) {
      throw error(ErrorCode.InvalidInput, "Invalid input to the rateShipment method.", { originalError });
    }

    try {
      let rates = await rateShipment!(_transaction, _shipment);
      return validateArray(rates, Rate).map((rate) => new Rate(rate, this));
    }
    catch (originalError) {
      let transactionID = _transaction.id;
      throw error(ErrorCode.AppError, `Error in the rateShipment method.`, { originalError, transactionID });
    }
  }

  public async trackShipment?(
    transaction: TransactionPOJO, shipment: TrackingCriteriaPOJO): Promise<TrackingInfo> {

    let _transaction, _shipment;
    let { trackShipment } = this[_private];

    try {
      _transaction = new Transaction(validate(transaction, Transaction));
      _shipment = new TrackingCriteria(validate(shipment, TrackingCriteria));
    }
    catch (originalError) {
      throw error(ErrorCode.InvalidInput, "Invalid input to the trackShipment method.", { originalError });
    }

    try {
      let trackingInfo = await trackShipment!(_transaction, _shipment);
      return new TrackingInfo(validate(trackingInfo, TrackingInfo), this);
    }
    catch (originalError) {
      let transactionID = _transaction.id;
      throw error(ErrorCode.AppError, `Error in the trackShipment method.`, { originalError, transactionID });
    }
  }

  public async createManifest?(
    transaction: TransactionPOJO, manifest: NewManifestPOJO): Promise<ManifestConfirmation> {

    let _transaction, _manifest;
    let { createManifest } = this[_private];

    try {
      _transaction = new Transaction(validate(transaction, Transaction));
      _manifest = new NewManifest(validate(manifest, NewManifest), this);
    }
    catch (originalError) {
      throw error(ErrorCode.InvalidInput, "Invalid input to the createManifest method.", { originalError });
    }

    try {
      let confirmation = await createManifest!(_transaction, _manifest);
      return new ManifestConfirmation(validate(confirmation, ManifestConfirmation));
    }
    catch (originalError) {
      let transactionID = _transaction.id;
      throw error(ErrorCode.AppError, `Error in the createManifest method.`, { originalError, transactionID });
    }
  }

  public async schedulePickup?(
    transaction: TransactionPOJO, pickup: PickupRequestPOJO): Promise<PickupConfirmation> {

    let _transaction, _pickup;
    let { schedulePickup } = this[_private];

    try {
      _transaction = new Transaction(validate(transaction, Transaction));
      _pickup = new PickupRequest(validate(pickup, PickupRequest), this);
    }
    catch (originalError) {
      throw error(ErrorCode.InvalidInput, "Invalid input to the schedulePickup method.", { originalError });
    }

    try {
      let confirmation = await schedulePickup!(_transaction, _pickup);

      if (confirmation && confirmation.shipments === undefined) {
        // By default, all shipments will be picked up
        confirmation.shipments = _pickup.shipments;
      }

      return new PickupConfirmation(validate(confirmation, PickupConfirmation));
    }
    catch (originalError) {
      let transactionID = _transaction.id;
      throw error(ErrorCode.AppError, `Error in the schedulePickup method.`, { originalError, transactionID });
    }
  }

  public async cancelPickups?(
    transaction: TransactionPOJO, pickups: PickupCancellationPOJO[]): Promise<PickupCancellationOutcome[]> {

    let _transaction, _pickups;
    let { cancelPickups } = this[_private];

    try {
      _transaction = new Transaction(validate(transaction, Transaction));
      _pickups = validateArray(pickups, PickupCancellation).map((pickup) => new PickupCancellation(pickup, this));
    }
    catch (originalError) {
      throw error(ErrorCode.InvalidInput, "Invalid input to the cancelPickups method.", { originalError });
    }

    try {
      let confirmations = await cancelPickups!(_transaction, _pickups);

      if (!confirmations) {
        // Nothing was returned, so assume all pickups were cancelled successfully
        confirmations = _pickups.map((pickup) => ({
          cancellationID: pickup.cancellationID,
          status: CancellationStatus.Success,
        }));
      }

      return validateArray(confirmations, PickupCancellationOutcome)
        .map((confirmation) => new PickupCancellationOutcome(confirmation));
    }
    catch (originalError) {
      let transactionID = _transaction.id;
      throw error(ErrorCode.AppError, `Error in the cancelPickups method.`, { originalError, transactionID });
    }
  }

  //#endregion
}
