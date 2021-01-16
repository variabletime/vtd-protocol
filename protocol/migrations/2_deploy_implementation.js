const Implementation = artifacts.require("Implementation");
const MockDSD = artifacts.require("MockDSD")

async function deployTestnetDSD(deployer) {
  await deployer.deploy(MockDSD);
}

async function deployTestnet(deployer) {
  const implementation = await deployer.deploy(Implementation);
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
        // await deployTestnetDSD(deployer);
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