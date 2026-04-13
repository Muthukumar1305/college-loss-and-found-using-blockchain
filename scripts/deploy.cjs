const { ethers } = require("hardhat");

async function main() {
  const factory = await ethers.getContractFactory("LostAndFound");
  console.log("Deploying LostAndFound...");
  const contract = await factory.deploy();
  await contract.waitForDeployment();
  
  const address = await contract.getAddress();
  console.log(`LostAndFound deployed to: ${address}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
