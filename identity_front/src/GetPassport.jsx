import React, { useState, useEffect, useRef } from "react";
import { Button } from "react-bootstrap";
import { Contract, providers, utils, Signer } from "ethers";
import Web3Modal from "web3modal";
import image from "./images/passport.png";
const VerificationABI = require('./abis/VerificationABI.json').abi;
const NFT_PassportABI = require('./abis/NFT_PassportABI.json').abi;


function GetPassport() {
  
  const [connected, setConnected] = useState(false);
  const [address, setAddress] = useState("");
  const web3ModalRef = useRef();
  const [loading, setLoading] = useState(false);
  const [signature, setSignature] = useState("");

  const VerificationContractAddress = "0x8C9bC3979FC58acd47CF84d3e1b4dCae86E1a2Bd";
  const PassportContractAddress = "0x699A5213c6b6Cd42631204b107715B6d8607C464";
  let VerificationContract;
  let PassportContract;

  function generateRandomNumber() {
    const randomDecimal = Math.random();
    const randomNumber = Math.floor(randomDecimal * 999) + 1;
    return randomNumber;
  }
  
  const connectWallet = async () => {
    try {
      if (window.ethereum) {
        await window.ethereum.request({ method: "eth_requestAccounts" });
        const provider = new providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const connectedAddress = await signer.getAddress();
        VerificationContract = new Contract(VerificationContractAddress, VerificationABI, signer);
        PassportContract = new Contract(PassportContractAddress, NFT_PassportABI, signer);
        
        setAddress(connectedAddress);
        setConnected(true);
      } else {
        console.error("No web3 provider found");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const signMessage = async () => {
    try {
      await window.ethereum.send("eth_requestAccounts");
      const provider = new providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      let message = "Veifying this message you sign in our web3 identity platform and get allowance to have a NFT Passport" 
      const signature1 = await signer.signMessage(message);
      const signerAddress = utils.verifyMessage(message, signature1);
      let isValid;
      
      if (signerAddress === address) {
        alert("Message signature is valid");
        const tx = await VerificationContract.setVerifiedUsers(address, true, { gasLimit: 200000 });
        // Wait for the transaction to be confirmed

        await tx.wait()
        console.log(await VerificationContract.verifiedUsers(signerAddress))

        isValid = true;
      } else {
        alert("Message signature is not valid");
        const tx = await VerificationContract.setVerifiedUsers(signerAddress, false, { gasLimit: 200000 });
        // Wait for the transaction to be confirmed
        console.log(await VerificationContract.verifiedUsers(signerAddress))

        await tx.wait()
        isValid = false;
      }
    } catch (error) {
      console.error(error);
    }
  };
  const mintNFT = async () => {
    try {
      await window.ethereum.request({ method: "eth_requestAccounts" });
      const provider = new providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const connectedAddress = await signer.getAddress();
      const tx = await PassportContract.safeMint(connectedAddress, "ipfs://bafybeidrwddcmetsexbrxrxnyhzkarletrogbgedxzso4hpseoiy4u2omq");
      await tx.wait();
    } catch(error){
      console.error(error);
    }
  }
  // const verifySignature = async () => {
  //   try {
  //     const provider = new providers.Web3Provider(window.ethereum);
  //     const signer = provider.getSigner();
  //     const address = await signer.getAddress();
  //     let message = "Veifying this message you sign in our web3 identity platform and get allowance to have a NFT Passport" 
  //     const messageBytes = utils.toUtf8Bytes(message);
  //     const messageDigest = utils.keccak256(messageBytes);
  //     const signerAddress = utils.verifyMessage(messageBytes, signature);
  //     if (signerAddress === address) {
  //       alert("Message signature is valid");
  //     } else {
  //       alert("Message signature is not valid");
  //     }
  //     // function verify(
  //     //   address _signer,
  //     //   address _to,
  //     //   string memory _message,
  //     //   uint _nonce,
  //     //   bytes memory signature
  //     // call verify from smart contract
  //     const randomNum = generateRandomNumber();

  //     const tx = await VerificationContract.verify(signer.getAddress(), signer.getAddress(), message, randomNum, signature);
  //     // Wait for the transaction to be confirmed
  //     const receipt = await tx.wait();
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

  useEffect(()=>{
    connectWallet();
  })

  return (
    <div>
      <nav className="navbar bg-body-tertiary">
        <div className="container-fluid">
          <a className="navbar-brand">3 Passportify</a>
          <a href={connected ? `/profile/${address}` : `${"#"}`} type="button" variant="primary" onClick={connectWallet} className="btn btn-outline-secondary">{connected ? `${"Profile"}` : `${"Connect Wallet"}`}</a>
        </div>
      </nav>
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "70vh" }}>
        <img src={image} width="30%" alt="image"/>

      </div>
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center"}}>
        <div className="d-grid gap-2">
          <button onClick={signMessage} type="button" className="btn btn-outline-secondary btn-lg">Verify Yourself</button>
          <button type="button" onClick={mintNFT} className="btn btn-outline-secondary btn-lg">Get Your NFT Passport</button>
        </div>
      </div>
      
    </div>

  );

}

export default GetPassport;
