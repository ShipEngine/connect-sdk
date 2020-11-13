"use strict";

const { PackageItem } = require("../../../lib/internal");
const { expect } = require("chai");

describe('when quantity and unitPrice is undefined', () => it('totalPrice() returns undefined', () => expect(new PackageItem({}).totalPrice).to.equal(undefined)));
describe('when quantity is undefined', () => it('totalPrice() returns undefined', () => expect(new PackageItem({ unitPrice: { currency: 'USD', value: 10.00 } }).totalPrice).to.equal(undefined)));
describe('when unitPrice is undefined', () => it('totalPrice() returns undefined', () => expect(new PackageItem({ quantity: { value: 1 } }).totalPrice).to.equal(undefined)));
describe('when unitPrice  and quantity is defined', () => it('totalPrice() returns the right value', () => expect(new PackageItem({ quantity: { value: 4 }, unitPrice: { currency: 'USD', value: 10.00 } }).totalPrice.value).to.equal(40)));
