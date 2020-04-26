import { LogoPOJO } from "../../pojos/common";
import { Joi } from "../../validation";

const svgPattern = /\<svg.*\<\/svg\>/;

/**
 * Logo images
 */
export class Logo {
  //#region Class Fields

  public static readonly label = "logo";

  /** @internal */
  public static readonly schema = Joi.object({
    colorSVG: Joi.string().pattern(svgPattern).required(),

    // TODO: Confirm that the image does not have any colors other than black and white
    blackAndWhiteSVG: Joi.string().pattern(svgPattern).required(),
  });

  //#endregion
  //#region Instance Fields

  /**
   * The SVG full-color logo image
   */
  public readonly colorSVG: string;

  /**
   * The SVG black-and-white logo image.
   */
  public readonly blackAndWhiteSVG: string;

  //#endregion

  public constructor(pojo: LogoPOJO) {
    this.colorSVG = pojo.colorSVG;
    this.blackAndWhiteSVG = pojo.blackAndWhiteSVG;

    // Prevent modifications after validation
    Object.freeze(this);
  }
}
