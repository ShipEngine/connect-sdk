import { humanize } from "@jsdevtools/humanize-anything";
import { ono } from "@jsdevtools/ono";
import * as fs from "fs";
import * as path from "path";
import { assert } from "../assert";
import { LogoConfig } from "../config";
import { readConfig } from "../read-config";
import { InlineOrReference } from "../types";

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

  /**
   * Creates a Logo object from a fully-resolved config object
   */
  public constructor(config: LogoConfig) {
    assert.type.object(config, "logo");
    this.colorSVG = validateSVG(config.colorSVG);
    this.blackAndWhiteSVG = validateSVG(config.blackAndWhiteSVG, true);

    // Prevent modifications after validation
    Object.freeze(this);
  }

  /**
   * Reads the config for a ShipEngine IPaaS logo
   */
  public static async readConfig(config: InlineOrReference<LogoConfig>, cwd = "."): Promise<LogoConfig> {
    try {
      config = await readConfig(config, undefined, cwd);

      const colorSVGBuffer = await fs.promises.readFile(path.join(cwd, config.colorSVG as string));
      const blackAndWhiteSVGBuffer = await fs.promises.readFile(path.join(cwd, config.blackAndWhiteSVG as string));

      return {
        ...config,
        colorSVG: colorSVGBuffer.toString(),
        blackAndWhiteSVG: blackAndWhiteSVGBuffer.toString(),
      };
    }
    catch (error) {
      throw ono(error, `Error reading the delivery service config: ${humanize(config)}`);
    }
  }
}

/**
 * Validates and sanitizes an SVG image
 */
function validateSVG(svg: InlineOrReference<string>, blackAndWhite = false): string {
  svg = assert.string.nonWhitespace(svg, "SVG image").trim();

  if (!svg.includes("<svg") && !svg.includes("</svg>")) {
    throw new Error(`Invalid SVG image. "${svg.slice(30)}...". Expected an <svg> element.`);
  }

  if (blackAndWhite) {
    // TODO: Confirm that the image does not have any colors other than black and white
  }

  return svg;
}
