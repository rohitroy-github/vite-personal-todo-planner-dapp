// deploy.js
const {ethers} = require("hardhat");

async function main() {
  const TodoContract = await ethers.getContractFactory("Todo_Contract");
  const todoContract = await TodoContract.deploy();
  console.log("Contract successfully deployed to:", todoContract.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
