import { InlineOrReference } from "../types";

/**
 * Logo images
 */
export interface LogoConfig {
  /**
   * The SVG full-color logo image
   */
  colorSVG: InlineOrReference<string>;

  /**
   * The SVG black-and-white logo image.
   *
   * NOTE: Only true black and white are allowed, not grayscale.
   */
  blackAndWhiteSVG: InlineOrReference<string>;
}
