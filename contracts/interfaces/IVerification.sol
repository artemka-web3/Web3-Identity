// SPDX-License-Identifier: MIT
pragma solidity 0.8.18;

interface IVerification {
    function verifiedUsers(address) external view returns (bool);
}