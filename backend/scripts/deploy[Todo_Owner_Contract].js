// deploy.js
const {ethers} = require("hardhat");

async function main() {
  const Todo_Owner_Contract = await ethers.getContractFactory(
    "Todo_Owner_Contract"
  );
  const deployment = await Todo_Owner_Contract.deploy();
  console.log("Contract successfully deployed to:", deployment.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
