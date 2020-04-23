import { assert } from "../../../assert";
import { LabelPOJO } from "../../../pojos";

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

  public constructor(pojo: LabelPOJO) {
    assert.type.object(pojo, "label confirmation");
    this.trackingNumber = assert.string.nonWhitespace(pojo.trackingNumber, "tracking number");
    this.image = validateBuffer(pojo.image, "label image");
    this.forms = assert.array(pojo.forms, "forms", [])
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
