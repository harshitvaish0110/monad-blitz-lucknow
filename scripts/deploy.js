const { ethers } = require("hardhat");

async function main() {
  console.log("Deploying VortexSoundNFT contract...");

  // Get the contract factory
  const VortexSoundNFT = await ethers.getContractFactory("VortexSoundNFT");
  
  // Deploy the contract
  const vortexSoundNFT = await VortexSoundNFT.deploy();
  
  // Wait for deployment to finish
  await vortexSoundNFT.waitForDeployment();
  
  const address = await vortexSoundNFT.getAddress();
  console.log("VortexSoundNFT deployed to:", address);

  // Verify the deployment
  console.log("Waiting for deployment confirmation...");
  await vortexSoundNFT.deploymentTransaction().wait(5); // Wait for 5 confirmations
  
  console.log("Contract deployed successfully!");
  console.log("Contract address:", address);
  
  // Save deployment info
  const deploymentInfo = {
    contractName: "VortexSoundNFT",
    address: address,
    network: "monadTestnet",
    deployer: (await ethers.getSigners())[0].address,
    timestamp: new Date().toISOString(),
  };
  
  console.log("Deployment info:", JSON.stringify(deploymentInfo, null, 2));
  
  return address;
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 