import { assert } from "../assert";
import { CarrierConfig } from "../config";
import { UUID } from "../types";
import { Logo } from "./logo";

/**
 * A carrier that provides delivery services
 */
export class Carrier {
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
   * Creates a ShipEngine IPaaS carrier from a fully-resolved config object
   */
  public constructor(config: CarrierConfig) {
    assert.type.object(config, "carrier");
    this.id = assert.string.uuid(config.id, "carrier ID");
    this.name = assert.string.nonWhitespace(config.name, "carrier name");
    this.description = assert.string(config.description, "carrier description", "");
    this.websiteURL = new URL(assert.string.nonWhitespace(config.websiteURL, "websiteURL"));
    this.logo =  new Logo(config.logo);

    // Prevent modifications after validation
    Object.freeze(this);
    Object.freeze(this.websiteURL);
  }
}
