const {ethers, run, network} = require("hardhat");

async function main() {
  const TodoContract = await ethers.getContractFactory("Todo_Contract_Main");
  const todoContract = await TodoContract.deploy();

  console.log("Contract deployed successfully \u2705");
  console.log(`Contract address: ${todoContract.address}`);

  console.log(`Contract owner: ${await todoContract.contractOwner()}`);
  console.log(`Contract name: ${await todoContract.contractName()}`);

  if (network.config.chainId === 11155111) {
    console.log(
      "Waiting for block confirmations on Sepolia testnet ... \u23F3"
    );
    // wait6BlockConfirmations
    await eVaultMain.deployTransaction.wait(6);
    await verify(eVaultMain.address, []);
  } else if (network.config.chainId === 31337) {
    console.log("Contract deployed to: Hardhat local environment \u2705");
  }
}

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

// run >>> npx hardhat run scripts/deploy[Todo_Contract_Main].js --network localhost
// run >>> npx hardhat run scripts/deploy[Todo_Contract_Main].js --network sepolia
