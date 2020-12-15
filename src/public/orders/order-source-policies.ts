export interface OrderSourcePolicies {
  /**
   * Indicates whether the shipment needs to be marked as a premium program (Prime, Walmart+, etc.)
   */
  isPremiumProgram?: boolean;

  /**
   * Name of premium program
   */
  premiumProgramName?: string;
}