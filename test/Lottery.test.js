// test/Lottery.test.js
// Load dependencies
const { expect } = require("chai");

// Import utilities from Test Helpers
const {
  BN,
  expectRevert,
  ether,
  balance,
} = require("@openzeppelin/test-helpers");
const { ethers } = require("hardhat");

// Load compiled artifacts
const Lottery = artifacts.require("Lottery");

contract("Lottery", function ([owner, second, third, fourth]) {
  beforeEach(async () => {
    this.lottery = await Lottery.new({ from: owner });
  });

  it("allows single account to enter", async () => {
    await this.lottery.enter({ from: owner, value: ether("0.02") });
    const players = await this.lottery.getPlayers();
    expect(owner).to.equal(players[0]);
    expect(players.length).to.equal(1);
  });
  it("allows multiple accounts to enter", async () => {
    await this.lottery.enter({ from: owner, value: ether("0.02") });
    await this.lottery.enter({ from: second, value: ether("0.02") });
    await this.lottery.enter({ from: third, value: ether("0.02") });
    const players = await this.lottery.getPlayers();
    expect(owner).to.equal(players[0]);
    expect(second).to.equal(players[1]);
    expect(third).to.equal(players[2]);
    expect(players.length).to.equal(3);
  });

  it("requires minimum amount of ether to enter", async () => {
    await expectRevert(
      this.lottery.enter({ from: owner, value: ether("0.005") }),
      "Minimum bet is 0.1 ether"
    );
  });

  it("only manager can pick winner", async () => {
    await expectRevert(
      this.lottery.pickWinner({ from: second }),
      "Not authorized"
    );
  });

  it("sends money to the winner and resets the players array", async () => {
    const etherAmount = 0.1;
    await this.lottery.enter({ from: second, value: ether(etherAmount.toString()) });

    let players = await this.lottery.getPlayers();
    expect(players.length).to.equal(1);

    const player1 = await balance.tracker(second, "gwei");

    await this.lottery.pickWinner({
      from: owner,
    });

    const deltaPlayer1 = await player1.delta();

    expect(BN(deltaPlayer1).toString()).to.equal((etherAmount*1e9).toString());

    players = await this.lottery.getPlayers();
    expect(players.length).to.equal(0);
  });
});
