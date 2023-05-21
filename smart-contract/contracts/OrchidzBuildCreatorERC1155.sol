// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract OrchidzBuildCreatorERC1155 is ERC1155, Ownable {
    string public name;
    string public symbol;

    struct NftDetailStruct {
        bool isCreated;
        string uri;
        uint256 mintPrice;
    }

    mapping(uint256 => NftDetailStruct) public nftDetailOf;

    constructor(string memory _name, string memory _symbol)
        ERC1155("")
    {
        name = _name;
        symbol = _symbol;
    }

    function setURI(string memory newuri) public onlyOwner {
        _setURI(newuri);
    }

    function mint(
        address account,
        uint256 id,
        uint256 amount
    ) public payable onlyOwner {
        NftDetailStruct memory _nftDetail = nftDetailOf[id];
        require(_nftDetail.isCreated, "this nft is not created yet");
        require(
            _nftDetail.mintPrice <= msg.value,
            "Send full amount to mint nft"
        );

        _mint(account, id, amount, "");
    }

    // function mintBatch(
    //     address to,
    //     uint256[] memory ids,
    //     uint256[] memory amounts,
    //     bytes memory data
    // ) public onlyOwner {
    //     _mintBatch(to, ids, amounts, data);
    // }

    function createNFTtoMint(
        uint256 _nftId,
        string memory __uriN,
        uint256 __mintP
    ) public onlyOwner {
        require(
            !nftDetailOf[_nftId].isCreated,
            "nft details are already set for this token id"
        );

        nftDetailOf[_nftId] = NftDetailStruct(true, __uriN, __mintP);
    }

    // uri function
    function uri(uint256 id)
        public
        view
        virtual
        override
        returns (string memory)
    {
        return nftDetailOf[id].uri;
    }

    function tokenURI(uint256 id) public view returns (string memory) {
        return nftDetailOf[id].uri;
    }
}
