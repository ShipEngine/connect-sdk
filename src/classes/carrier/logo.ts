import { assert } from "../../assert";
import { LogoPOJO } from "../../pojos";

/**
 * Logo images
 */
export class Logo {
  /**
   * The SVG full-color logo image
   */
  public readonly colorSVG: string;

  /**
   * The SVG black-and-white logo image.
   */
  public readonly blackAndWhiteSVG: string;

  public constructor(pojo: LogoPOJO) {
    assert.type.object(pojo, "logo");
    this.colorSVG = validateSVG(pojo.colorSVG);
    this.blackAndWhiteSVG = validateSVG(pojo.blackAndWhiteSVG, true);

    // Prevent modifications after validation
    Object.freeze(this);
  }
}

/**
 * Validates and sanitizes an SVG image
 */
function validateSVG(svg: string, blackAndWhite = false): string {
  svg = assert.string.nonWhitespace(svg, "SVG image").trim();

  if (!svg.includes("<svg") && !svg.includes("</svg>")) {
    throw new Error(`Invalid SVG image. "${svg.slice(30)}...". Expected an <svg> element.`);
  }

  if (blackAndWhite) {
    // TODO: Confirm that the image does not have any colors other than black and white
  }

  return svg;
}
