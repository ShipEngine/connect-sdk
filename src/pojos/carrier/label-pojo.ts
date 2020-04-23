/**
 * A shipping label
 */
export interface LabelPOJO {
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
  forms?: LabelFormPOJO[];
}

/**
 * A form that relates to a label, such as a customs form.
 */
export interface LabelFormPOJO {
  data: Buffer;
  description: string;
}
