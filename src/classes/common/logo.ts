import { LogoPOJO } from "../../pojos/common";
import { Joi } from "../../validation";
import { hideAndFreeze, _internal } from "../utils";

const svgPattern = /\<svg.*\<\/svg\>/;

/**
 * Logo images
 */
export class Logo {
  //#region Private/Internal Fields

  /** @internal */
  public static readonly [_internal] = {
    label: "logo",
    schema: Joi.object({
      colorSVG: Joi.string().pattern(svgPattern).required(),

      // TODO: Confirm that the image does not have any colors other than black and white
      blackAndWhiteSVG: Joi.string().pattern(svgPattern).required(),
    }),
  };

  //#endregion
  //#region Public Fields

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

    // Make this object immutable
    hideAndFreeze(this);
  }
}

// Prevent modifications to the class
hideAndFreeze(Logo);
