// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

// Uncomment this line to use console.log
// import "hardhat/console.sol";

import "erc721a/contracts/ERC721A.sol";

contract OrchidzBuildNft is ERC721A {

    address public admin;
    constructor() ERC721A("OrchidzBuildNft", "OBN") {
        admin = msg.sender;
    }

    function mint(uint256 quantity) external payable {
        // `_mint`'s second argument now takes in a `quantity`, not a `tokenId`.
        _mint(msg.sender, quantity);
    }
}