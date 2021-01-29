import { AppType, CancellationStatus, CancelPickups, CancelShipments, CarrierAppDefinition, Connect, Country, CreateManifest, CreateShipment, DocumentFormat, DocumentSize, ErrorCode, ManifestLocation, ManifestShipment, ManifestType, Packaging, RateShipment, SchedulePickup, ServiceArea, TrackShipment } from "../../public";
import { AppPOJO, ConnectionApp, error, FormPOJO, hideAndFreeze, Joi, SystemErrorCode, Transaction, TransactionPOJO, validateArray, _internal, OAuthConfigPOJO } from "../common";
import { DeliveryConfirmation } from "./delivery-confirmation";
import { DeliveryService, DeliveryServicePOJO } from "./delivery-service";
import { ManifestConfirmation } from "./manifests/manifest-confirmation";
import { NewManifest, NewManifestPOJO } from "./manifests/new-manifest";
import { PickupCancellation, PickupCancellationPOJO } from "./pickups/pickup-cancellation";
import { PickupCancellationOutcome } from "./pickups/pickup-cancellation-outcome";
import { PickupConfirmation } from "./pickups/pickup-confirmation";
import { PickupRequest, PickupRequestPOJO } from "./pickups/pickup-request";
import { PickupService, PickupServicePOJO } from "./pickups/pickup-service";
import { Rate } from "./rates/rate";
import { RateCriteria, RateCriteriaPOJO } from "./rates/rate-criteria";
import { NewShipment, NewShipmentPOJO } from "./shipments/new-shipment";
import { ShipmentCancellation, ShipmentCancellationPOJO } from "./shipments/shipment-cancellation";
import { ShipmentCancellationOutcome } from "./shipments/shipment-cancellation-outcome";
import { ShipmentConfirmation } from "./shipments/shipment-confirmation";
import { TrackingCriteria, TrackingCriteriaPOJO } from "./tracking/tracking-criteria";
import { TrackingInfo } from "./tracking/tracking-info";
import { getMaxServiceArea } from "./utils";

const _private = Symbol("private fields");


export interface CarrierAppPOJO extends CarrierAppDefinition, AppPOJO {
  connectionForm: FormPOJO;
  settingsForm?: FormPOJO;
  deliveryServices: readonly DeliveryServicePOJO[];
  pickupServices?: readonly PickupServicePOJO[];
  oauthConfig?: OAuthConfigPOJO;
  connect?: Connect;
  createShipment?: CreateShipment;
  cancelShipments?: CancelShipments;
  rateShipment?: RateShipment;
  trackShipment?: TrackShipment;
  createManifest?: CreateManifest;
  schedulePickup?: SchedulePickup;
  cancelPickups?: CancelPickups;
}


export class CarrierApp extends ConnectionApp {
  // #region Private/Internal Fields

  public static readonly [_internal] = {
    label: "ShipEngine Connect carrier app",
    schema: ConnectionApp[_internal].schema.keys({
      manifestLocations: Joi.string().enum(ManifestLocation)
        .when("createManifest", { is: Joi.function().required(), then: Joi.required() }),
      manifestShipments: Joi.string().enum(ManifestShipment)
        .when("createManifest", { is: Joi.function().required(), then: Joi.required() }),
      manifestType: Joi.string().enum(ManifestType),
      deliveryServices: Joi.array().min(1).items(DeliveryService[_internal].schema).required(),
      pickupServices: Joi.array().items(PickupService[_internal].schema),
      trackingURLTemplate: Joi.string().pattern(new RegExp(/{}/)).website(),
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

  // #endregion
  // #region Public Fields

  public readonly type: AppType;
  public readonly manifestLocations?: ManifestLocation;
  public readonly manifestShipments?: ManifestShipment;
  public readonly manifestType?: ManifestType;
  public readonly deliveryServices: readonly DeliveryService[];
  public readonly pickupServices: readonly PickupService[];
  public readonly supportsReturns: boolean;
  public readonly trackingURLTemplate?: string;

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

  public get labelFormats(): readonly DocumentFormat[] {
    const labelFormats = new Set<DocumentFormat>();
    for (const service of this.deliveryServices) {
      for (const labelFormat of service.labelFormats) {
        labelFormats.add(labelFormat);
      }
    }
    return Object.freeze([...labelFormats]);
  }

  public get labelSizes(): readonly DocumentSize[] {
    const labelSizes = new Set<DocumentSize>();
    for (const service of this.deliveryServices) {
      for (const labelSize of service.labelSizes) {
        labelSizes.add(labelSize);
      }
    }
    return Object.freeze([...labelSizes]);
  }

  public get countries(): readonly Country[] {
    const countries = new Set(this.availableCountries);
    return Object.freeze([...countries]);
  }

  public get availableCountries(): readonly Country[] {
    const countries = new Set<Country>();
    for (const service of this.deliveryServices) {
      for (const country of service.availableCountries) {
        countries.add(country);
      }
    }
    return Object.freeze([...countries]);
  }

  public get packaging(): readonly Packaging[] {
    const packaging = new Map<string, Packaging>();
    for (const service of this.deliveryServices) {
      for (const parcel of service.packaging) {
        packaging.set(parcel.id, parcel);
      }
    }

    return Object.freeze(Array.from(packaging.values()));
  }

  public get deliveryConfirmations(): readonly DeliveryConfirmation[] {
    const deliveryConfirmations = new Map<string, DeliveryConfirmation>();
    for (const service of this.deliveryServices) {
      for (const deliveryConfirmation of service.deliveryConfirmations) {
        deliveryConfirmations.set(deliveryConfirmation.id, deliveryConfirmation);
      }
    }
    return Object.freeze(Array.from(deliveryConfirmations.values()));
  }

  // #endregion

  public constructor(pojo: CarrierAppPOJO) {
    super(pojo);

    this.type = AppType.Carrier;
    this.manifestLocations = pojo.manifestLocations;
    this.manifestShipments = pojo.manifestShipments;
    this.manifestType = pojo.manifestType;
    this.deliveryServices = pojo.deliveryServices.map((svc) => new DeliveryService(svc, this));
    this.pickupServices = pojo.pickupServices
      ? pojo.pickupServices.map((svc) => new PickupService(svc, this)) : [];

    this.supportsReturns = this.deliveryServices.some((ds) => ds.supportsReturns);

    this.trackingURLTemplate = pojo.trackingURLTemplate;

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

  // #region  Methods

  public async createShipment?(
    transaction: TransactionPOJO, shipment: NewShipmentPOJO): Promise<ShipmentConfirmation> {

    let _transaction, _shipment;
    const { createShipment } = this[_private];

    try {
      _transaction = new Transaction(transaction);
      _shipment = new NewShipment(shipment, this);
    }
    catch (originalError: unknown) {
      throw error(SystemErrorCode.InvalidInput, "Invalid input to the createShipment method.", { originalError });
    }

    try {
      const confirmation = await createShipment!(_transaction, _shipment);
      return new ShipmentConfirmation(confirmation);
    }
    catch (originalError: unknown) {
      const transactionID = _transaction.id;
      throw error(ErrorCode.AppError, "Error in the createShipment method.", { originalError, transactionID });
    }
  }

  public async cancelShipments?(
    transaction: TransactionPOJO, shipments: ShipmentCancellationPOJO[]): Promise<ShipmentCancellationOutcome[]> {

    let _transaction, _shipments;
    const { cancelShipments } = this[_private];

    try {
      _transaction = new Transaction(transaction);
      _shipments = shipments
        .map((shipment) => new ShipmentCancellation(shipment));
    }
    catch (originalError: unknown) {
      throw error(SystemErrorCode.InvalidInput, "Invalid input to the cancelShipments method.", { originalError });
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
    catch (originalError: unknown) {
      const transactionID = _transaction.id;
      throw error(ErrorCode.AppError, "Error in the cancelShipments method.", { originalError, transactionID });
    }
  }

  public async rateShipment?(
    transaction: TransactionPOJO, shipment: RateCriteriaPOJO): Promise<Rate[]> {

    let _transaction, _shipment;
    const { rateShipment } = this[_private];

    try {
      _transaction = new Transaction(transaction);
      _shipment = new RateCriteria(shipment, this);
    }
    catch (originalError: unknown) {
      throw error(SystemErrorCode.InvalidInput, "Invalid input to the rateShipment method.", { originalError });
    }

    try {
      const rates = await rateShipment!(_transaction, _shipment);
      return rates.map((rate) => new Rate(rate, this));
    }
    catch (originalError: unknown) {
      const transactionID = _transaction.id;
      throw error(ErrorCode.AppError, "Error in the rateShipment method.", { originalError, transactionID });
    }
  }

  public async trackShipment?(
    transaction: TransactionPOJO, shipment: TrackingCriteriaPOJO): Promise<TrackingInfo> {

    let _transaction, _shipment;
    const { trackShipment } = this[_private];

    try {
      _transaction = new Transaction(transaction);
      _shipment = new TrackingCriteria(shipment);
    }
    catch (originalError: unknown) {
      throw error(SystemErrorCode.InvalidInput, "Invalid input to the trackShipment method.", { originalError });
    }

    try {
      const trackingInfo = await trackShipment!(_transaction, _shipment);
      return new TrackingInfo(trackingInfo, this);
    }
    catch (originalError: unknown) {
      const transactionID = _transaction.id;
      throw error(ErrorCode.AppError, "Error in the trackShipment method.", { originalError, transactionID });
    }
  }

  public async createManifest?(
    transaction: TransactionPOJO, manifest: NewManifestPOJO): Promise<ManifestConfirmation> {

    let _transaction, _manifest;
    const { createManifest } = this[_private];

    try {
      _transaction = new Transaction(transaction);
      _manifest = new NewManifest(manifest, this);
    }
    catch (originalError: unknown) {
      throw error(SystemErrorCode.InvalidInput, "Invalid input to the createManifest method.", { originalError });
    }

    try {
      const confirmation = await createManifest!(_transaction, _manifest);
      return new ManifestConfirmation(confirmation);
    }
    catch (originalError: unknown) {
      const transactionID = _transaction.id;
      throw error(ErrorCode.AppError, "Error in the createManifest method.", { originalError, transactionID });
    }
  }

  public async schedulePickup?(
    transaction: TransactionPOJO, pickup: PickupRequestPOJO): Promise<PickupConfirmation> {

    let _transaction, _pickup;
    const { schedulePickup } = this[_private];

    try {
      _transaction = new Transaction(transaction);
      _pickup = new PickupRequest(pickup, this);
    }
    catch (originalError: unknown) {
      throw error(SystemErrorCode.InvalidInput, "Invalid input to the schedulePickup method.", { originalError });
    }

    try {
      const confirmation = await schedulePickup!(_transaction, _pickup);

      if (confirmation && confirmation.shipments === undefined) {
        // By default, all shipments will be picked up
        confirmation.shipments = _pickup.shipments;
      }

      return new PickupConfirmation(confirmation);
    }
    catch (originalError: unknown) {
      const transactionID = _transaction.id;
      throw error(ErrorCode.AppError, "Error in the schedulePickup method.", { originalError, transactionID });
    }
  }

  public async cancelPickups?(
    transaction: TransactionPOJO, pickups: PickupCancellationPOJO[]): Promise<PickupCancellationOutcome[]> {

    let _transaction, _pickups;
    const { cancelPickups } = this[_private];

    try {
      _transaction = new Transaction(transaction);
      _pickups = pickups.map((pickup) => new PickupCancellation(pickup, this));
    }
    catch (originalError: unknown) {
      throw error(SystemErrorCode.InvalidInput, "Invalid input to the cancelPickups method.", { originalError });
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
    catch (originalError: unknown) {
      const transactionID = _transaction.id;
      throw error(ErrorCode.AppError, "Error in the cancelPickups method.", { originalError, transactionID });
    }
  }

  // #endregion
}
