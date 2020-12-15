import { OrderSourcePolicies as OrderSourcePoliciesPOJO } from "../../public";
import { hideAndFreeze, Joi, _internal } from "../common";

export class OrderSourcePolicies {
  public static readonly [_internal] = {
    label: "order source policies",
    schema: Joi.object({
      isPremiumProgram: Joi.boolean().optional(),
      premiumProgramName: Joi.string().optional(),
    }),
  };

  public readonly isPremiumProgram?: boolean;
  public readonly premiumProgramName?: string;

  public constructor(pojo: OrderSourcePoliciesPOJO) {
    this.isPremiumProgram = pojo.isPremiumProgram;
    this.premiumProgramName = pojo.premiumProgramName;

    // Make this object immutable
    hideAndFreeze(this);
  }

}