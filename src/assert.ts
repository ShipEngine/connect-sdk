import { assert } from "@jsdevtools/assert";
import humanize from "@jsdevtools/humanize-anything";
import { CustomData, Identifier } from "./types";

const uuidPattern = /[0-9a-f]{8}\-[0-9a-f]{4}\-[0-9a-f]{4}\-[0-9a-f]{4}\-[0-9a-f]{12}/i;

declare module "@jsdevtools/assert/lib/type" {
  interface AssertType {
    /**
     * Assets that the given value is valid Date object
     */
    date(value: unknown, fieldName: string): Date;

    /**
     * Assets that the given value is an object of key/value pairs
     */
    customData(value: unknown): CustomData | undefined;
  }
}

declare module "@jsdevtools/assert/lib/string" {
  interface AssertString {
    /**
     * Assets that the given value is a valid UUID string
     */
    uuid(value: string, fieldName: string): string;
  }
}

declare module "@jsdevtools/assert/lib/array" {
  interface AssertArray {
    /**
     * Assets that the given value is an array of enumeration values
     */
    ofEnum<T>(value: unknown, enumeration: Record<string, T>, fieldName: string, defaultValue?: T[]): T[];

    /**
     * Assets that the given value is an array of Identifier objects
     */
    ofIdentifiers<T>(value: unknown, fieldName: string, defaultValue?: T[]): Identifier[];
  }
}

assert.type.date = assertDate;
assert.type.customData = assertCustomData;
assert.string.uuid = assertUUID;
assert.array.ofEnum = assertArrayOfEnum;
assert.array.ofIdentifiers = assertArrayOfIdentifiers;
export { assert };


function assertDate(value: unknown, fieldName: string): Date {
  let date = assert.type(value, Date, fieldName) as Date;

  if (isNaN(date.getTime())) {
    throw new Error(`Invalid ${fieldName}: ${humanize(value)}`);
  }
  return date;
}


function assertCustomData(value: unknown): CustomData | undefined {
  if (value === undefined) {
    return undefined;
  }

  let data = assert.type.object(value, "custom data") as CustomData;

  for (let key of Object.keys(data)) {
    assert.string.nonWhitespace(key, "custom data key");
    data[key] = assert.string(data[key], "custom data value", "");
  }

  return data;
}


function assertUUID(value: string, fieldName: string): string {
  value = assert.string.nonEmpty(value, fieldName);

  if (!uuidPattern.test(value)) {
    throw new TypeError(`Invalid ${fieldName}: ${humanize(value)}. Expected a UUID string.`);
  }

  return value.toLowerCase();
}


function assertArrayOfEnum<T>(
value: unknown, enumeration: Record<string, T>, fieldName: string, defaultValue?: T[]): T[] {
  let array = assert.array(value, fieldName, defaultValue) as T[];
  let unique: T[] = [];

  if (!defaultValue) {
    assert.array.nonEmpty(value, fieldName);
  }

  for (let item of array) {
    assert.string.enum(item, enumeration, fieldName);

    if (unique.includes(item)) {
      throw new Error(`Duplicate ${fieldName}: ${humanize(item)}`);
    }

    unique.push(item);
  }

  return unique;
}


function assertArrayOfIdentifiers(value: unknown, fieldName: string, defaultValue?: unknown): Identifier[] {
  let array = assert.array(value, fieldName, defaultValue) as Identifier[];

  if (!defaultValue) {
    assert.array.nonEmpty(value, fieldName);
  }

  for (let identifier of array) {
    assert.type.object(identifier, fieldName);
    assert.string.nonWhitespace(identifier.id, fieldName);
    assert.string.nonWhitespace(identifier.description, fieldName);
  }

  return array;
}
