/**
 * The digital file format of a document,
 * such as a shipping label, customs form, or SCAN form.
 */
export enum DocumentFormat {
  PDF = "pdf",
  HTML = "html",
  ZPL = "zpl",
  PNG = "png"
}

/**
 * The dimensions of a document,
 * such as a shipping label, customs form, or SCAN form.
 */
export enum DocumentSize {
  A4 = "A4",
  Letter = "letter",
  Inches4x6 = "4x6",
  Inches4x8 = "4x8",
}

/**
 * The types of digital documents that can be returned
 */
export enum DocumentType {
  Label = "label",
  CustomsForm = "customs_form",
  ScanForm = "scan_form",
}
