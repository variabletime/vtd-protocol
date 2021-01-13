const Oracle = artifacts.require("Oracle");

// IMPORTANT
const dollarAddr = '0xf0E3543744AFcEd8042131582f2A19b6AEb82794';

async function deployTestnet(deployer) {
  const dsdAddr = '0xBD2F0Cd039E0BFcf88901C98c0bFAc5ab27566e3' //IMPORTANT


  const dsdOraclev2 = await deployer.deploy(Oracle, dollarAddr, dsdAddr, 1);
  dsdOraclev2.setup()
  console.log('dsdOraclev2: ' + dsdOraclev2.address);
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