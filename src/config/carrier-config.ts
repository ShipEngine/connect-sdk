import { UrlString, UUID } from "../types";
import { LogoConfig } from "./logo-config";

/**
 * A carrier that provides delivery services
 */
export interface CarrierConfig {
  /**
   * A UUID that uniquely identifies the carrier.
   * This ID should never change, even if the carrier name changes.
   */
  id: UUID;

  /**
   * The user-friendly carrier name (e.g. "FedEx", "Australia Post")
   */
  name: string;

  /**
   * A short, user-friendly description of the carrier
   */
  description?: string;

  /**
   * The URL of the carrier's website
   */
  websiteURL: UrlString;

  /**
   * The carrier's logo image
   */
  logo: LogoConfig;
}
