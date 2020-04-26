// tslint:disable: no-empty-interface
import { LogoDefinition } from "../../definitions";


/**
 * Logo images
 */
export interface LogoPOJO extends LogoDefinition {
  colorSVG: string;   // SVG contents
  blackAndWhiteSVG: string;   // SVG contents
}
