"use strict";

const { CarrierApp } = require("../../../lib/internal");
const host = require("@jsdevtools/host-environment");
const { expect } = require("chai");
const pojo = require("../../utils/pojo");

describe("DateTimeZone", () => {

  async function createDateTimeZone(value) {
    let app = new CarrierApp(pojo.carrierApp({
      rateShipment: () => [pojo.rate({ shipDateTime: value })]
    }));
    let rates = await app.rateShipment(pojo.transaction(), pojo.rateCriteria());
    return rates[0].shipDateTime;
  }

  it("should create a DateTimeZone from a Date object", async () => {
    let datetime = await createDateTimeZone(new Date("2005-05-05T05:05:05.005Z"));

    expect(datetime.value).to.equal("2005-05-05T05:05:05.005");
    expect(datetime.timeZone).to.equal("UTC");
    expect(datetime.offset).to.equal("+00:00");
    expect(datetime.isUTC).to.equal(true);
    expect(datetime.toDate()).to.deep.equal(new Date("2005-05-05T05:05:05.005Z"));
    expect(datetime.toString()).to.deep.equal("2005-05-05T05:05:05.005 UTC");
    expect(datetime.toISOString()).to.deep.equal("2005-05-05T05:05:05.005+00:00");
    expect(datetime.toJSON()).to.deep.equal({ value: "2005-05-05T05:05:05.005", timeZone: "UTC" });
    expect(datetime.getTime()).to.equal(1115269505005);
    expect(datetime + 1).to.equal(1115269505006);
  });

  it("should create a DateTimeZone from an ISO 8601 string with Zulu time zone", async () => {
    let datetime = await createDateTimeZone("2005-05-05T05:05:05.005Z");

    expect(datetime.value).to.equal("2005-05-05T05:05:05.005");
    expect(datetime.timeZone).to.equal("UTC");
    expect(datetime.offset).to.equal("+00:00");
    expect(datetime.isUTC).to.equal(true);
    expect(datetime.toDate()).to.deep.equal(new Date("2005-05-05T05:05:05.005Z"));
    expect(datetime.toString()).to.deep.equal("2005-05-05T05:05:05.005 UTC");
    expect(datetime.toISOString()).to.deep.equal("2005-05-05T05:05:05.005+00:00");
    expect(datetime.toJSON()).to.deep.equal({ value: "2005-05-05T05:05:05.005", timeZone: "UTC" });
    expect(datetime.getTime()).to.equal(1115269505005);
    expect(datetime + 1).to.equal(1115269505006);
  });

  it("should create a DateTimeZone from an ISO 8601 string with a +00:00 UTC offset", async () => {
    let datetime = await createDateTimeZone("2005-05-05T05:05:05.005+00:00");

    expect(datetime.value).to.equal("2005-05-05T05:05:05.005");
    expect(datetime.timeZone).to.equal("+00:00");
    expect(datetime.offset).to.equal("+00:00");
    expect(datetime.isUTC).to.equal(true);
    expect(datetime.toDate()).to.deep.equal(new Date("2005-05-05T05:05:05.005+00:00"));
    expect(datetime.toString()).to.deep.equal("2005-05-05T05:05:05.005+00:00");
    expect(datetime.toISOString()).to.deep.equal("2005-05-05T05:05:05.005+00:00");
    expect(datetime.toJSON()).to.deep.equal({ value: "2005-05-05T05:05:05.005", timeZone: "+00:00" });
    expect(datetime.getTime()).to.equal(1115269505005);
    expect(datetime + 1).to.equal(1115269505006);
  });

  it("should create a DateTimeZone from an ISO 8601 string with a -00:00 UTC offset", async () => {
    let datetime = await createDateTimeZone("2005-05-05T05:05:05.005-00:00");

    expect(datetime.value).to.equal("2005-05-05T05:05:05.005");
    expect(datetime.timeZone).to.equal("-00:00");
    expect(datetime.offset).to.equal("-00:00");
    expect(datetime.isUTC).to.equal(true);
    expect(datetime.toDate()).to.deep.equal(new Date("2005-05-05T05:05:05.005-00:00"));
    expect(datetime.toString()).to.deep.equal("2005-05-05T05:05:05.005-00:00");
    expect(datetime.toISOString()).to.deep.equal("2005-05-05T05:05:05.005-00:00");
    expect(datetime.toJSON()).to.deep.equal({ value: "2005-05-05T05:05:05.005", timeZone: "-00:00" });
    expect(datetime.getTime()).to.equal(1115269505005);
    expect(datetime + 1).to.equal(1115269505006);
  });

  it("should create a DateTimeZone from an ISO 8601 string with a positive UTC offset", async () => {
    let datetime = await createDateTimeZone("2005-05-05T05:05:05.005+05:30");

    expect(datetime.value).to.equal("2005-05-05T05:05:05.005");
    expect(datetime.timeZone).to.equal("+05:30");
    expect(datetime.offset).to.equal("+05:30");
    expect(datetime.isUTC).to.equal(false);
    expect(datetime.toDate()).to.deep.equal(new Date("2005-05-05T05:05:05.005+05:30"));
    expect(datetime.toString()).to.deep.equal("2005-05-05T05:05:05.005+05:30");
    expect(datetime.toISOString()).to.deep.equal("2005-05-05T05:05:05.005+05:30");
    expect(datetime.toJSON()).to.deep.equal({ value: "2005-05-05T05:05:05.005", timeZone: "+05:30" });
    expect(datetime.getTime()).to.equal(1115249705005);
    expect(datetime + 1).to.equal(1115249705006);
  });

  it("should create a DateTimeZone from an ISO 8601 string with a negative UTC offset", async () => {
    let datetime = await createDateTimeZone("2005-05-05T05:05:05.005-00:30");

    expect(datetime.value).to.equal("2005-05-05T05:05:05.005");
    expect(datetime.timeZone).to.equal("-00:30");
    expect(datetime.offset).to.equal("-00:30");
    expect(datetime.isUTC).to.equal(false);
    expect(datetime.toDate()).to.deep.equal(new Date("2005-05-05T05:05:05.005-00:30"));
    expect(datetime.toString()).to.deep.equal("2005-05-05T05:05:05.005-00:30");
    expect(datetime.toISOString()).to.deep.equal("2005-05-05T05:05:05.005-00:30");
    expect(datetime.toJSON()).to.deep.equal({ value: "2005-05-05T05:05:05.005", timeZone: "-00:30" });
    expect(datetime.getTime()).to.equal(1115271305005);
    expect(datetime + 1).to.equal(1115271305006);
  });

  it("should create a DateTimeZone from a DateTimeZonePOJO with UTC time zone", async () => {
    let datetime = await createDateTimeZone({ value: "2005-05-05T05:05:05.005", timeZone: "UTC" });

    expect(datetime.value).to.equal("2005-05-05T05:05:05.005");
    expect(datetime.timeZone).to.equal("UTC");
    expect(datetime.offset).to.equal("+00:00");
    expect(datetime.isUTC).to.equal(true);
    expect(datetime.toDate()).to.deep.equal(new Date("2005-05-05T05:05:05.005Z"));
    expect(datetime.toString()).to.deep.equal("2005-05-05T05:05:05.005 UTC");
    expect(datetime.toISOString()).to.deep.equal("2005-05-05T05:05:05.005+00:00");
    expect(datetime.toJSON()).to.deep.equal({ value: "2005-05-05T05:05:05.005", timeZone: "UTC" });
    expect(datetime.getTime()).to.equal(1115269505005);
    expect(datetime + 1).to.equal(1115269505006);
  });

  if (host.node.version >= 12) {
    it("should create a DateTimeZone from a DateTimeZonePOJO with Zulu time zone", async () => {
      let datetime = await createDateTimeZone({ value: "2005-05-05T05:05:05.005", timeZone: "Zulu" });

      expect(datetime.value).to.equal("2005-05-05T05:05:05.005");
      expect(datetime.timeZone).to.equal("Zulu");
      expect(datetime.offset).to.equal("+00:00");
      expect(datetime.isUTC).to.equal(true);
      expect(datetime.toDate()).to.deep.equal(new Date("2005-05-05T05:05:05.005Z"));
      expect(datetime.toString()).to.deep.equal("2005-05-05T05:05:05.005 Zulu");
      expect(datetime.toISOString()).to.deep.equal("2005-05-05T05:05:05.005+00:00");
      expect(datetime.toJSON()).to.deep.equal({ value: "2005-05-05T05:05:05.005", timeZone: "Zulu" });
      expect(datetime.getTime()).to.equal(1115269505005);
      expect(datetime + 1).to.equal(1115269505006);
    });
  }

  it("should create a DateTimeZone from a DateTimeZonePOJO with a +00:00 UTC offset", async () => {
    let datetime = await createDateTimeZone({ value: "2005-05-05T05:05:05.005", timeZone: "+00:00" });

    expect(datetime.value).to.equal("2005-05-05T05:05:05.005");
    expect(datetime.timeZone).to.equal("+00:00");
    expect(datetime.offset).to.equal("+00:00");
    expect(datetime.isUTC).to.equal(true);
    expect(datetime.toDate()).to.deep.equal(new Date("2005-05-05T05:05:05.005+00:00"));
    expect(datetime.toString()).to.deep.equal("2005-05-05T05:05:05.005+00:00");
    expect(datetime.toISOString()).to.deep.equal("2005-05-05T05:05:05.005+00:00");
    expect(datetime.toJSON()).to.deep.equal({ value: "2005-05-05T05:05:05.005", timeZone: "+00:00" });
    expect(datetime.getTime()).to.equal(1115269505005);
    expect(datetime + 1).to.equal(1115269505006);
  });

  it("should create a DateTimeZone from a DateTimeZonePOJO with a -00:00 UTC offset", async () => {
    let datetime = await createDateTimeZone({ value: "2005-05-05T05:05:05.005", timeZone: "-00:00" });

    expect(datetime.value).to.equal("2005-05-05T05:05:05.005");
    expect(datetime.timeZone).to.equal("-00:00");
    expect(datetime.offset).to.equal("-00:00");
    expect(datetime.isUTC).to.equal(true);
    expect(datetime.toDate()).to.deep.equal(new Date("2005-05-05T05:05:05.005-00:00"));
    expect(datetime.toString()).to.deep.equal("2005-05-05T05:05:05.005-00:00");
    expect(datetime.toISOString()).to.deep.equal("2005-05-05T05:05:05.005-00:00");
    expect(datetime.toJSON()).to.deep.equal({ value: "2005-05-05T05:05:05.005", timeZone: "-00:00" });
    expect(datetime.getTime()).to.equal(1115269505005);
    expect(datetime + 1).to.equal(1115269505006);
  });

  it("should create a DateTimeZone from a DateTimeZonePOJO with a positive UTC offset", async () => {
    let datetime = await createDateTimeZone({ value: "2005-05-05T05:05:05.005", timeZone: "+05:30" });

    expect(datetime.value).to.equal("2005-05-05T05:05:05.005");
    expect(datetime.timeZone).to.equal("+05:30");
    expect(datetime.offset).to.equal("+05:30");
    expect(datetime.isUTC).to.equal(false);
    expect(datetime.toDate()).to.deep.equal(new Date("2005-05-05T05:05:05.005+05:30"));
    expect(datetime.toString()).to.deep.equal("2005-05-05T05:05:05.005+05:30");
    expect(datetime.toISOString()).to.deep.equal("2005-05-05T05:05:05.005+05:30");
    expect(datetime.toJSON()).to.deep.equal({ value: "2005-05-05T05:05:05.005", timeZone: "+05:30" });
    expect(datetime.getTime()).to.equal(1115249705005);
    expect(datetime + 1).to.equal(1115249705006);
  });

  it("should create a DateTimeZone from a DateTimeZonePOJO with a negative UTC offset", async () => {
    let datetime = await createDateTimeZone({ value: "2005-05-05T05:05:05.005", timeZone: "-00:30" });

    expect(datetime.value).to.equal("2005-05-05T05:05:05.005");
    expect(datetime.timeZone).to.equal("-00:30");
    expect(datetime.offset).to.equal("-00:30");
    expect(datetime.isUTC).to.equal(false);
    expect(datetime.toDate()).to.deep.equal(new Date("2005-05-05T05:05:05.005-00:30"));
    expect(datetime.toString()).to.deep.equal("2005-05-05T05:05:05.005-00:30");
    expect(datetime.toISOString()).to.deep.equal("2005-05-05T05:05:05.005-00:30");
    expect(datetime.toJSON()).to.deep.equal({ value: "2005-05-05T05:05:05.005", timeZone: "-00:30" });
    expect(datetime.getTime()).to.equal(1115271305005);
    expect(datetime + 1).to.equal(1115271305006);
  });

  it("should create a DateTimeZone from a DateTimeZonePOJO with a negative IANA time zone", async () => {
    let datetime = await createDateTimeZone({ value: "2005-05-05T05:05:05.005", timeZone: "America/New_York" });

    expect(datetime.value).to.equal("2005-05-05T05:05:05.005");
    expect(datetime.timeZone).to.equal("America/New_York");
    expect(datetime.offset).to.equal("-04:00");
    expect(datetime.isUTC).to.equal(false);
    expect(datetime.toDate()).to.deep.equal(new Date("2005-05-05T05:05:05.005-04:00"));
    expect(datetime.toString()).to.deep.equal("2005-05-05T05:05:05.005 America/New_York");
    expect(datetime.toISOString()).to.deep.equal("2005-05-05T05:05:05.005-04:00");
    expect(datetime.toJSON()).to.deep.equal({ value: "2005-05-05T05:05:05.005", timeZone: "America/New_York" });
    expect(datetime.getTime()).to.equal(1115283905005);
    expect(datetime + 1).to.equal(1115283905006);
  });

  it("should create a DateTimeZone from a DateTimeZonePOJO with a negative IANA time zone during daylight savings", async () => {
    let datetime = await createDateTimeZone({ value: "2005-01-05T05:05:05.005", timeZone: "America/New_York" });

    expect(datetime.value).to.equal("2005-01-05T05:05:05.005");
    expect(datetime.timeZone).to.equal("America/New_York");
    expect(datetime.offset).to.equal("-05:00");
    expect(datetime.isUTC).to.equal(false);
    expect(datetime.toDate()).to.deep.equal(new Date("2005-01-05T05:05:05.005-05:00"));
    expect(datetime.toString()).to.deep.equal("2005-01-05T05:05:05.005 America/New_York");
    expect(datetime.toISOString()).to.deep.equal("2005-01-05T05:05:05.005-05:00");
    expect(datetime.toJSON()).to.deep.equal({ value: "2005-01-05T05:05:05.005", timeZone: "America/New_York" });
    expect(datetime.getTime()).to.equal(1104919505005);
    expect(datetime + 1).to.equal(1104919505006);
  });

  it("should create a DateTimeZone from a DateTimeZonePOJO with a positive IANA time zone", async () => {
    let datetime = await createDateTimeZone({ value: "2005-05-05T05:05:05.005", timeZone: "Europe/Paris" });

    expect(datetime.value).to.equal("2005-05-05T05:05:05.005");
    expect(datetime.timeZone).to.equal("Europe/Paris");
    expect(datetime.offset).to.equal("+02:00");
    expect(datetime.isUTC).to.equal(false);
    expect(datetime.toDate()).to.deep.equal(new Date("2005-05-05T05:05:05.005+02:00"));
    expect(datetime.toString()).to.deep.equal("2005-05-05T05:05:05.005 Europe/Paris");
    expect(datetime.toISOString()).to.deep.equal("2005-05-05T05:05:05.005+02:00");
    expect(datetime.toJSON()).to.deep.equal({ value: "2005-05-05T05:05:05.005", timeZone: "Europe/Paris" });
    expect(datetime.getTime()).to.equal(1115262305005);
    expect(datetime + 1).to.equal(1115262305006);
  });

  it("should create a DateTimeZone from a DateTimeZonePOJO with a positive IANA time zone during daylight savings", async () => {
    let datetime = await createDateTimeZone({ value: "2005-01-05T05:05:05.005", timeZone: "Europe/Paris" });

    expect(datetime.value).to.equal("2005-01-05T05:05:05.005");
    expect(datetime.timeZone).to.equal("Europe/Paris");
    expect(datetime.offset).to.equal("+01:00");
    expect(datetime.isUTC).to.equal(false);
    expect(datetime.toDate()).to.deep.equal(new Date("2005-01-05T05:05:05.005+01:00"));
    expect(datetime.toString()).to.deep.equal("2005-01-05T05:05:05.005 Europe/Paris");
    expect(datetime.toISOString()).to.deep.equal("2005-01-05T05:05:05.005+01:00");
    expect(datetime.toJSON()).to.deep.equal({ value: "2005-01-05T05:05:05.005", timeZone: "Europe/Paris" });
    expect(datetime.getTime()).to.equal(1104897905005);
    expect(datetime + 1).to.equal(1104897905006);
  });
});
