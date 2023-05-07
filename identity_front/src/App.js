import React, { useState, useEffect, useRef } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Button } from "react-bootstrap";
import { Contract, providers, utils } from "ethers";
import Web3Modal from "web3modal";
import image from "./images/passport.png";
import GetPassport from "./GetPassport";
import Profile from "./Profile";


// MUMBAI
// Verification address: 0x8C9bC3979FC58acd47CF84d3e1b4dCae86E1a2Bd
// NFT_Passport address: 0x699A5213c6b6Cd42631204b107715B6d8607C464

// LOCAL
// Verification address: 0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512
// NFT_Passport address: 0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0
function App() {
  
  return (
    <Router>
      <Routes>
        <Route path="/" element={<GetPassport/>} />
        <Route path="/profile/:address" element={<Profile/>} />
      </Routes>
    </Router>
  );

}

export default App;
