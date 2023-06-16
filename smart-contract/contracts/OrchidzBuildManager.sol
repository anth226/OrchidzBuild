// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

// import "@openzeppelin/contracts/access/Ownable.sol";
import "./OrchidzBuildCreatorERC1155.sol";

contract OrchidzBuildManager {

    struct NftDetailStruct {
        bool isCreated;
        string uri;
        uint256 mintPrice;
    }

    mapping(address => address) public collectionAddressOfCreator;

    event collectionCreatedForCreator(address indexed creator, address indexed collectionAddress);

    constructor()
    {
    }

    function createCollectionForCreator() public {
     OrchidzBuildCreatorERC1155 _coll = new OrchidzBuildCreatorERC1155();
     emit collectionCreatedForCreator(msg.sender, address(_coll));
    }
}
