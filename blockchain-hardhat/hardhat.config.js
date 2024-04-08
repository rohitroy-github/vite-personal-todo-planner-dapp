require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-etherscan");
require("dotenv").config();

// https://www.npmjs.com/package/solidity-coverage
// require("solidity-coverage");

// https://www.npmjs.com/package/hardhat-gas-reporter
require("hardhat-gas-reporter");

const SEPOLIA_ALCHEMY_RPC_URL = process.env.SEPOLIA_ALCHEMY_RPC_URL;
const METAMASK_PRIVATE_KEY = process.env.METAMASK_PRIVATE_KEY;
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY;
const COINMARKETCAP_API_KEY = process.env.COINMARKETCAP_API_KEY
  ? process.env.COINMARKETCAP_API_KEY
  : null;

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: {
        enabled: true,
        runs: 1000,
      },
    },
  },
  defaultNetwork: "hardhat",
  allowUnlimitedContractSize: true,
  networks: {
    // default
    hardhat: {},

    // forSepoliaNetwork
    sepolia: {
      url: SEPOLIA_ALCHEMY_RPC_URL,
      accounts: [METAMASK_PRIVATE_KEY],
      chainId: 11155111,
    },

    // forHardhatLocalRuntimeEnvironment(Node)
    localhost: {
      url: "http://127.0.0.1:8545/",
      chainId: 31337,
      gas: 2100000,
      gasPrice: 8000000000,
    },
  },

  etherscan: {
    apiKey: ETHERSCAN_API_KEY,
  },

  gasReporter: {
    // -> toggleAccordingToNeedToKnowGasConsumptionOfContract
    enabled: process.env.REPORT_GAS_USAGE == "false" ? false : true,

    noColors: true,

    // -> currencyYouWantTheEstimationsIn(COINMARKETCAP)
    currency: "INR",

    // -> TOKENYouWantTheEstimationsIn(ETH ByDefault)
    token: "ETH",

    // -> ifYouWantOutputInASeparateFile
    // outputFile: "gas-report.txt",

    // -> APICallForFetchingCurrentPrice
    coinmarketcap: COINMARKETCAP_API_KEY,
  },
};
