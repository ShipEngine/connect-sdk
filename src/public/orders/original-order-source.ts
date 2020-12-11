/**
 * Information regarding the original order source.
 */
export interface OriginalOrderSource {
    /**
     * A unique identifier for the source marketplace
     */
    sourceId: string;

    /**
     * The code for the type of marketplace
     */
    marketplaceCode: string;

    /**
     * The unique identifier for the order at the source marketplace
     */
    orderId: string;
}
