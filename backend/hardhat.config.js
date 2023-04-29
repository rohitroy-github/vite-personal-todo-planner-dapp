require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  // defaultNetwork
  defaultNetwork: "hardhat",
  solidity: "0.8.10",
  // etherscanAPIForContractVerification
  // etherscan: {
  //   apiKey: "MBUX6SZXZUTK7FK1A6P9H7H9TWFGFJX3JJ",
  // },
  networks: {
    // seploiaTestNet
    // > backend > npx hardhat run scripts/deploy.js --network sepolia
    sepolia: {
      // url: `https://sepolia.infura.io/v3/${process.env.INFURA_API_KEY}`,
      url: `https://eth-sepolia.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`,

      // rhtry@dev
      accounts: [`0x${process.env.SEPOLIA_ACCOUNT_PRIVATE_KEY}`],
      chainId: 11155111,
    },

    // localhost : npx hardhat node
    // > backend > npx hardhat run scripts/deploy.js --network localhost
    localhost: {
      url: "http://127.0.0.1:8545/",
      accounts: [
        // account:0
        `0x${process.env.HARDHAT_ACCOUNT_PRIVATE_KEY}`,
      ],
      chainId: 31337,
    },
  },
};
