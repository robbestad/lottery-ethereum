require("@nomiclabs/hardhat-ethers");
require("@nomiclabs/hardhat-truffle5");
require("@nomiclabs/hardhat-etherscan");
const { alchemyApiKey,etherscanApiKey, mnemonic, GOERLI_PRIVATE_KEY } = require("./secrets.json");
/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: "0.8.4",
  defaultNetwork: "goerli",
  networks: {
    goerli: {
      url: `https://eth-goerli.alchemyapi.io/v2/${alchemyApiKey}`,
      accounts: [`0x${GOERLI_PRIVATE_KEY}`],
    },
  },
etherscan: {
      apiKey: etherscanApiKey
    }
};
