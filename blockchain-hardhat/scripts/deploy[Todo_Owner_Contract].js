// deploy.js
const {ethers, run, network} = require("hardhat");

async function main() {
  const TodoContract = await ethers.getContractFactory("Todo_Owner_Contract");
  const todoContract = await TodoContract.deploy();

  console.log("Contract deployed successfully \u2705");
  console.log(`Contract address : ${todoContract.address}`);

  console.log(`Contract owner: ${await todoContract.contractOwner()}`);
  console.log(`Contract name: ${await todoContract.contractName()}`);

  if (network.config.chainId === 11155111) {
    console.log("Waiting for block confirmations \u23F3");
    // wait6BlockConfirmations
    await eVaultMain.deployTransaction.wait(6);
    await verify(eVaultMain.address, []);
  } else if (network.config.chainId === 31337) {
    console.log("Contract deployed to localhost \u2705");
  }
}

// async function verify(contractAddress, args) {
const verify = async (contractAddress, args) => {
  console.log("Verifying contract \u23F3");
  try {
    await run("verify:verify", {
      address: contractAddress,
      constructorArguments: args,
    });
  } catch (e) {
    if (e.message.toLowerCase().includes("already verified")) {
      console.log("Already Verified!");
    } else {
      console.log(e);
    }
  }
};

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

// npx hardhat run scripts/deploy[Todo_Owner_Contract].js --network localhost
