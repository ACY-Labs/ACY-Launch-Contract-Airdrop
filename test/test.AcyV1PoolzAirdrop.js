const { expect } = require("chai");
const { ethers } = require("hardhat");

const { ethers: eth } = require("ethers");

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
}

describe("AirTransferDiffValue", function () {
    it("Should be able to distribute different values to different addresses", async function () {
    });
});
