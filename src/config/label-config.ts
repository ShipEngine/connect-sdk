
/**
 * A shipping label
 */
export interface LabelConfig {
  /**
   * The carrier tracking number for this label
   */
  trackingNumber: string;

  /**
   * The label image, in the requested file format (i.e. PDF, PNG, ZPL).
   */
  image: Buffer;

  /**
   * Any additional forms that relate to the label, such as customs forms.
   */
  forms?: LabelFormConfig[];
}

/**
 * A form that relates to a label, such as a customs form.
 */
export interface LabelFormConfig {
  data: Buffer;
  description: string;
}
