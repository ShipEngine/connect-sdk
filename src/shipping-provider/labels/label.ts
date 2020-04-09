import { assert } from "../../assert";
import { LabelConfig } from "../../config/label-config";

/**
 * A shipping label
 */
export class Label {
  /**
   * The carrier tracking number for this label
   */
  public readonly trackingNumber: string;

  /**
   * The label image, in the requested file format (i.e. PDF, PNG, ZPL).
   */
  public readonly image: Buffer;

  /**
   * Any additional forms that relate to the label, such as customs forms.
   */
  public readonly forms?: Array<{
    data: Buffer;
    description: string;
  }>;

  /**
   * Creates a Label from a config object
   */
  public constructor(config: LabelConfig) {
    assert.type.object(config, "label confirmation");
    this.trackingNumber = assert.string.nonWhitespace(config.trackingNumber, "tracking number");
    this.image = validateBuffer(config.image, "label image");
    this.forms = assert.array(config.forms, "forms", [])
      .map((form) => {
        assert.type.object(form, "form");
        return Object.freeze({
          data: validateBuffer(form.data, "form data"),
          description: assert.string.nonWhitespace(form.description, "form description"),
        });
      });

    // Prevent modifications after validation
    Object.freeze(this);
    Object.freeze(this.forms);
  }
}

function validateBuffer(buffer: Buffer, fieldName: string): Buffer {
  assert.type(buffer, Buffer, fieldName);

  if (buffer.length === 0) {
    throw new RangeError(`Invalid ${fieldName}. It cannot be zero-length.`);
  }

  return buffer;
}
