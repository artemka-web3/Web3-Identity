// SPDX-License-Identifier: MIT
pragma solidity 0.8.18;

import "./interfaces/IVerification.sol";
import "../node_modules/@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "../node_modules/@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "../node_modules/@openzeppelin/contracts/access/Ownable.sol";
import "../node_modules/@openzeppelin/contracts/utils/Counters.sol";

contract NFT_Passport is ERC721, ERC721URIStorage, Ownable {
    event Attest(address indexed to, uint256 indexed  tokenId);
    event Revoke(address indexed to, uint256 indexed  tokenId);

    using Counters for Counters.Counter;

    Counters.Counter private _tokenIdCounter;
    IVerification public verificationContract;

    // constructor(address _verificationContract) ERC721("YourSoulboundPassport", "PSPRT") {
    //     verificationContract = IVerification(_verificationContract);
    // }

    constructor(address _verificationContract) ERC721("YourSoulboundPassport", "PSPRT") {
        verificationContract = IVerification(_verificationContract);
    }
    function safeMint(address to, string memory uri) public {
        require(verificationContract.verifiedUsers(to), "Can't mint passport to NOT verified users!");
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);
    }
    function burn(uint256 tokenId) external {
        require(ownerOf(tokenId) == msg.sender, "Only owner of the token can burn it");
        _burn(tokenId);
    }
    function revoke(uint256 tokenId) onlyOwner external {
        _burn(tokenId);
    }

    // The following functions are overrides required by Solidity.
    function _beforeTokenTransfer(address from, address to, uint256 firstTokenId, uint256 batchSize) internal override virtual {
        require(from == address(0) || to == address(0), "only burning & minting");
    }
    function _afterTokenTransfer(address from, address to, uint256 firstTokenId, uint256 batchSize) internal override virtual {
        if(from == address(0)){
            emit Attest(to, firstTokenId);
        } else if (to == address(0)){
            emit Revoke(to, firstTokenId);
        }
    }

    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }
}

// TESTING 
// 1) mint
// 2) try to transfer (it must revert)
// 3) burn must be okay. it will burn tokens