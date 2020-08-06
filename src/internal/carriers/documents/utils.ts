import { Document as DocumentPOJO, DocumentType } from "../../../public";
import { Document } from "./document";
import { Label } from "./label";

/**
 * A factory function that instantiates the correct document class based implements Ibased on the document type.
 */
export function createDocument(pojo: DocumentPOJO): Document {
  if (pojo.type === DocumentType.Label) {
    return new Label(pojo);
  }
  else {
    return new Document(pojo);
  }
}


/**
 * Determines whether the given document is a label
 */
export function isLabel(document: Document): document is Label {
  return document.type === DocumentType.Label;
}
