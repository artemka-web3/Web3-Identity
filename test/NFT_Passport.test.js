const { AddressZero } = require("@ethersproject/constants");
const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("NFT_Passport", function(){
    let passport;
    let verificationContract;
    let owner;
    let user;

    beforeEach(async function(){
        [owner, user] = await ethers.getSigners();

        const VerificationContract = await ethers.getContractFactory("Verification");
        verificationContract = await VerificationContract.deploy();
        await verificationContract.deployed()

        const NFT_Passport = await ethers.getContractFactory("NFT_Passport");
        passport = await NFT_Passport.deploy(verificationContract.address)
        await passport.deployed()
    });

    it("mint", async function(){
        const signer = owner;
        const to = user.address;
        const message = "Verify your identity to get NFT passport";
        const nonce = 123;

        const hash = await verificationContract.getMessageHash(to, message, nonce);
        const sig = await signer.signMessage(ethers.utils.arrayify(hash))
        const ethHash = await verificationContract.getEthSignedMessageHash(hash)
        console.log("signer          ", signer.address)
        console.log("recovered signer", await verificationContract.recoverSigner(ethHash, sig))
    
        // Correct signature and message returns true
        await verificationContract.verify(signer.address, to, message, nonce, sig);
        
       // expect(await verificationContract.verify(signer.address, to, message, nonce, sig)).to.be.equal(false)
        await expect(await passport.safeMint(user.address, "uri")).to.emit(passport, "Transfer");

    })
})