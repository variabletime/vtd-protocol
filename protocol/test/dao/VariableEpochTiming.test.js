const { accounts, contract } = require('@openzeppelin/test-environment');

const { BN, expectEvent } = require('@openzeppelin/test-helpers');
const { expect } = require('chai');

const MockRegulator = contract.fromArtifact('MockRegulator');
const MockSettableOracle = contract.fromArtifact('MockSettableOracle');
const Dollar = contract.fromArtifact('Dollar');

const POOL_REWARD_PERCENT = 40;

function lessPoolIncentive(baseAmount, newAmount) {
  return new BN(baseAmount + newAmount - poolIncentive(newAmount));
}

function poolIncentive(newAmount) {
  return new BN(newAmount * POOL_REWARD_PERCENT / 100);
}

describe('VariableEpochTIming', function () {
  const [ ownerAddress, userAddress, poolAddress ] = accounts;

  beforeEach(async function () {
    this.oracle = await MockSettableOracle.new({from: ownerAddress, gas: 8000000});
    this.regulator = await MockRegulator.new(this.oracle.address, poolAddress, {from: ownerAddress, gas: 8000000});
    this.dollar = await Dollar.at(await this.regulator.dollar());
  });

  describe('after bootstrapped', function () {
    beforeEach(async function () {
      await this.regulator.incrementEpochE(); // 1
      await this.regulator.incrementEpochE(); // 2
      await this.regulator.incrementEpochE(); // 3
      await this.regulator.incrementEpochE(); // 4
      await this.regulator.incrementEpochE(); // 5
      await this.regulator.incrementEpochE(); // 6

      await this.regulator.setEpochTimestampE(100);
    });

    describe('on start', function () {
      it('sets blocktimestamp', async function () 
      {
        expect(await this.regulator.previousEpochTimestamp()).to.be.bignumber.greaterThan(new BN(0));
      });
      it('epoch adjustment starts at 0 ', async function () 
      {
        expect(await this.regulator.epochAdjustmentAmount()).to.be.bignumber.equal(new BN(0));
      });
      it('current epoch length is 7200', async function () 
      {
        expect(await this.regulator.currentEpochLength()).to.be.bignumber.equal(new BN(7200));
      });
      it('current epoch time is 6+1', async function () 
      {
        expect(await this.regulator.epochTime()).to.be.bignumber.equal(new BN(7));
      });
    });

    describe('up regulation', function () {
      describe('10% expansion', function () {
        beforeEach(async function () {
          await this.oracle.set(220, 100, true);
          await this.regulator.stepE();
          await this.regulator.setEpochAdjustmentAmountE(442)
        });
        it('epoch adjustment grows ', async function () 
        {
          expect(await this.regulator.epochAdjustmentAmount()).to.be.bignumber.equal(new BN(720));
        });
        it('current epoch length is 7642', async function () 
        {
          expect(await this.regulator.currentEpochLength()).to.be.bignumber.equal(new BN(7642));
        });
        it('next epoch timestamp is 7742', async function () 
        {
          expect(await this.regulator.nextEpochTimestamp()).to.be.bignumber.equal(new BN(7742));
        });

        describe('builds momentum', function () {
          beforeEach(async function () {

            await this.regulator.stepE();
            await this.regulator.incrementEpochE(); // 6
            await this.regulator.setEpochTimestampE(100);

          });
          it('current epoch length is 7920', async function () 
          {
            expect(await this.regulator.currentEpochLength()).to.be.bignumber.equal(new BN(8568));
          });
          it('next epoch timestamp is 8020', async function () 
          {
            expect(await this.regulator.nextEpochTimestamp()).to.be.bignumber.equal(new BN(8668));
          });
        });

        describe('maxes out', function () {
          beforeEach(async function () {
            await this.regulator.setEpochAdjustmentAmountE(7184)
            await this.regulator.stepE();
            await this.regulator.incrementEpochE(); // 6
            await this.regulator.setEpochTimestampE(100);

          });
          it('current epoch length is 14385', async function () 
          {
            expect(await this.regulator.currentEpochLength()).to.be.bignumber.equal(new BN(14385));
          });
          it('next epoch timestamp is 14485', async function () 
          {
            expect(await this.regulator.nextEpochTimestamp()).to.be.bignumber.equal(new BN(14485));
          });

        });
        describe('maxes out', function () {
          beforeEach(async function () {
            await this.regulator.setEpochAdjustmentAmountE(6000)
            await this.oracle.set(120, 100, true);
            await this.regulator.stepE();
            await this.regulator.incrementEpochE(); // 6
            await this.regulator.setEpochTimestampE(100);

          });
          it('current epoch length is 14385', async function () 
          {
            expect(await this.regulator.currentEpochLength()).to.be.bignumber.equal(new BN(12960));
          });
          it('next epoch timestamp is 14485', async function () 
          {
            expect(await this.regulator.nextEpochTimestamp()).to.be.bignumber.equal(new BN(13060));
          });

        });

      });
    });

    describe('down regulation', function () {
      describe('35% shrink', function () {
        beforeEach(async function () {
          await this.oracle.set(60, 100, true);
          await this.regulator.setEpochAdjustmentAmountE(10000)
          await this.regulator.stepE();
        });
        it('epoch adjustment shrinks ', async function () 
        {
          expect(await this.regulator.epochAdjustmentAmount()).to.be.bignumber.equal(new BN(6500));
        });
        it('current epoch length is 7920', async function () 
        {
          expect(await this.regulator.currentEpochLength()).to.be.bignumber.equal(new BN(13700));
        });

        describe('handles 0 and near 0', function () {
          beforeEach(async function () {
            await this.oracle.set(60, 100, true);
            await this.regulator.setEpochAdjustmentAmountE(0)
            await this.regulator.stepE();
          });
          it('epoch adjustment shrinks ', async function () 
          {
            expect(await this.regulator.epochAdjustmentAmount()).to.be.bignumber.equal(new BN(0));
          });
          it('current epoch length is 7200', async function () 
          {
            expect(await this.regulator.currentEpochLength()).to.be.bignumber.equal(new BN(7200));
          });
        });
      });
      
    });
  });
});