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
    const [owner, addr1, addr2, addr3, addr4, addr5, addr6, addr7, addr8, addr9, addr10] = await ethers.getSigners();

    // console.log("Deploying TestToken Contract...");
    const TestToken = await ethers.getContractFactory("TestToken");
    const TT = await TestToken.deploy();
    await TT.deployed();

    // console.log("Deploying Airdrop Contract...");
    const Airdrop = await ethers.getContractFactory("Airdrop");
    const airdrop = await Airdrop.deploy();
    await airdrop.deployed();

    // console.log("TT Transfer to airdrop contract");
    let sum = 10000
    let totalSupply = eth.utils.parseUnits(sum.toString(), 18);
    await TT.transfer(airdrop.address, totalSupply);
    expect(await TT.balanceOf(airdrop.address)).to.equal(totalSupply);

    // console.log("TT distribute tokens in different values to different addresses");
    let addrs = [addr1.address, addr2.address, addr3.address, addr4.address, addr5.address, addr6.address, addr7.address, addr8.address, addr9.address, addr10.address];
    let values = [];
    for_distribution = sum/10;
    for(let i = 0; i < addrs.length; i ++) {
      let tempRandom = getRandomInt(1, for_distribution);
      values.push(eth.utils.parseUnits(tempRandom.toString(), 18));
      for_distribution = for_distribution - tempRandom;
    }
    airdrop.AirTransferDiffValue(addrs, values, TT.address);

    // console.log("withdraw the remainings by others");
    expect(await TT.balanceOf(airdrop.address)).to.equal(eth.utils.parseUnits((sum*0.9 + for_distribution).toString(), 18));

    // console.log("withdraw the remainings by unauthorized");
    await expect(airdrop.connect(addr1).withdrawalToken(TT.address)).to.be.revertedWith("Only Owner allowed");

    // console.log("withdraw the remainings by serder");
    expect(await TT.balanceOf(owner.address)).to.equal(0);
    await airdrop.connect(owner).withdrawalToken(TT.address);
    expect(await TT.balanceOf(owner.address)).to.equal(eth.utils.parseUnits((sum * 0.9 + for_distribution).toString(), 18));
  });
});

describe("AirTransfer", function () {
  it("Should be able to distribute different values to different addresses", async function () {
    const [owner, addr1, addr2, addr3, addr4, addr5, addr6, addr7, addr8, addr9, addr10] = await ethers.getSigners();

    // console.log("Deploying TestToken Contract...");
    const TestToken = await ethers.getContractFactory("TestToken");
    const TT = await TestToken.deploy();
    await TT.deployed();

    // console.log("Deploying Airdrop Contract...");
    const Airdrop = await ethers.getContractFactory("Airdrop");
    const airdrop = await Airdrop.deploy();
    await airdrop.deployed();

    // console.log("TT Transfer to airdrop contract");
    let sum = 10000
    let totalSupply = eth.utils.parseUnits(sum.toString(), 18);
    await TT.transfer(airdrop.address, totalSupply);
    expect(await TT.balanceOf(airdrop.address)).to.equal(totalSupply);

    // console.log("TT distribute tokens in different values to different addresses");
    let addrs = [addr1.address, addr2.address, addr3.address, addr4.address, addr5.address, addr6.address, addr7.address, addr8.address, addr9.address, addr10.address];
    airdrop.AirTransfer(addrs, eth.utils.parseUnits("10", 18), TT.address);

    // console.log("withdraw the remainings by others");
    expect(await TT.balanceOf(airdrop.address)).to.equal(eth.utils.parseUnits((sum - 10*addrs.length).toString(), 18));

    // console.log("withdraw the remainings by unauthorized");
    await expect(airdrop.connect(addr1).withdrawalToken(TT.address)).to.be.revertedWith("Only Owner allowed");

    // console.log("withdraw the remainings by serder");
    expect(await TT.balanceOf(owner.address)).to.equal(0);
    await airdrop.connect(owner).withdrawalToken(TT.address);
    expect(await TT.balanceOf(owner.address)).to.equal(eth.utils.parseUnits((sum - 10 * addrs.length).toString(), 18));
  });
});
