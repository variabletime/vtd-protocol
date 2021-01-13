const Deployer1 = artifacts.require("Deployer1");
const Deployer2 = artifacts.require("Deployer2");
const Deployer3 = artifacts.require("Deployer3");
const MockDSD = artifacts.require("MockDSD");
const MockUSDT = artifacts.require("MockUSDT");
const MockUSDC = artifacts.require("MockUSDC");
const MockWETH = artifacts.require("MockWETH");
const MockWBTC = artifacts.require("MockWBTC");
const Oracle = artifacts.require("Oracle");
const Pool = artifacts.require("Pool");

const Implementation = artifacts.require("Implementation");
const Root = artifacts.require("Root");
const TestnetUSDC = artifacts.require("TestnetUSDC");

// IMPORTANT
const dollarAddr = '0xf0E3543744AFcEd8042131582f2A19b6AEb82794';

async function deployTestnetUSDC(deployer) {
  await deployer.deploy(TestnetUSDC);
  // const dsd = await deployer.deploy(MockDSD);
  // const usdt = await deployer.deploy(MockUSDT);
  // const usdc = await deployer.deploy(MockUSDC);
  // const weth= await deployer.deploy(MockWETH);
  // const wbtc = await deployer.deploy(MockWBTC);
}

async function deployTestnet(deployer) {


// migration here
  const usdcAddr = '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48' //IMPORTANT
  const usdtAddr = '0xdAC17F958D2ee523a2206206994597C13D831ec7' //IMPORTANT
  const wethAddr = '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2' //IMPORTANT
  const wbtcAddr = '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599' //IMPORTANT

  const usdcOracle = await deployer.deploy(Oracle, dollarAddr, usdcAddr, 1e12);
  usdcOracle.setup()
  console.log('usdcOracle: ' + usdcOracle.address);

  const usdtOracle = await deployer.deploy(Oracle, dollarAddr, usdtAddr, 1e12);
  usdtOracle.setup()
  console.log('usdtOracle: ' + usdtOracle.address);
  
  const wethOracle = await deployer.deploy(Oracle, dollarAddr, wethAddr, 1);
  wethOracle.setup()
  console.log('wethOracle: ' + wethOracle.address);

  const wbtcOracle = await deployer.deploy(Oracle, dollarAddr, wbtcAddr, 1);
  wbtcOracle.setup()
  console.log('wbtcOracle: ' + wbtcOracle.address);

  console.log('================')
  console.log('usdcOracle: ' + usdcOracle.address);
  console.log('usdtOracle: ' + usdtOracle.address);
  console.log('wethOracle: ' + wethOracle.address);
  console.log('wbtcOracle: ' + wbtcOracle.address);

  const usdcPair = await usdcOracle.pair();
  const usdcPool = await deployer.deploy(Pool, dollarAddr, usdcPair, usdcAddr)

  console.log('usdcPool: ' + usdcPool.address);

  const usdtPair = await usdtOracle.pair();
  const usdtPool = await deployer.deploy(Pool, dollarAddr, usdtPair, usdtAddr)

  console.log('usdtPool: ' + usdtPool.address);

  const wethPair = await wethOracle.pair();
  const wethPool = await deployer.deploy(Pool, dollarAddr, wethPair, wethAddr)
  console.log('wethPool: ' + wethPool.address);

  const wbtcPair = await wbtcOracle.pair();
  const wbtcPool = await deployer.deploy(Pool, dollarAddr, wbtcPair, wbtcAddr)
  console.log('wbtcPool: ' + wbtcPool.address);

  console.log('===============')
  console.log('usdcPool: ' + usdcPool.address);
  console.log('usdtPool: ' + usdtPool.address);
  console.log('wethPool: ' + wethPool.address);
  console.log('wbtcPool: ' + wbtcPool.address);
}

module.exports = function(deployer) {
  deployer.then(async() => {
    console.log(deployer.network);
    switch (deployer.network) {
      case 'mainnet':
        await deployTestnet(deployer);
        break;
      case 'development':
        await deployTestnet(deployer);
        break;
      case 'rinkeby':
        await deployTestnet(deployer);
        break;
      case 'ropsten':
        await deployTestnet(deployer);
        break;
      default:
        throw("Unsupported network");
    }
  })
};