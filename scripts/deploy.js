const { ethers } = require("hardhat");
async function main() {
    const [deployer] = await ethers.getSigners();
  
    console.log("Deploying contracts with the account:", deployer.address);
  
    console.log("Account balance:", (await deployer.getBalance()).toString());
  
    const Verification = await ethers.getContractFactory("Verification");
    const verification_contract = await Verification.deploy();
    await verification_contract.deployed();
    const NFT_Passport = await ethers.getContractFactory("NFT_Passport");
    const nft_passport = await NFT_Passport.deploy(verification_contract.address);
    await nft_passport.deployed();
  
    console.log("Verification address:", verification_contract.address);
    console.log("NFT_Passport address:", nft_passport.address);

  }
  
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });