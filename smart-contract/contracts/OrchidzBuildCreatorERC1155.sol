// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract OrchidzBuildCreatorERC1155 is ERC1155, Ownable {
    string public name = "OrchidzBuildCreatorERC1155";
    string public symbol = "OBC";

    struct NftDetailStruct {
        bool isCreated;
        string uri;
        uint256 mintPrice;
        address admin;
    }

    mapping(uint256 => NftDetailStruct) public nftDetailOf;
    mapping(address => uint256) public nftIdOf;
    mapping (uint256 => uint256) public totalSupplyOf;

    uint256 public currectNftId;

    event NftCreated(
        uint256 indexed id,
        address indexed admin,
        uint256 mintPrice
    );

    constructor() ERC1155("") {
        currectNftId = 1;
    }

    function createNFTtoMint(
        string memory _uri,
        uint256 _price,
        address _admin
    ) public {
        uint256 _id = currectNftId;
        nftDetailOf[_id] = NftDetailStruct(true, _uri, _price, _admin);
        nftIdOf[_admin] = _id;
        emit NftCreated(_id, _admin, _price);
        currectNftId++;
    }

    function mint(address account, uint256 nftId, uint256 amount) public payable {
        NftDetailStruct memory _nftDetail = nftDetailOf[nftId];
        require(_nftDetail.isCreated, "this nft is not created yet");
        require(
            _nftDetail.mintPrice * amount <= msg.value,
            "Send full amount to mint nft"
        );

        totalSupplyOf[nftId] += amount;
        _mint(account, nftId, amount, "");
    }

    function uri(
        uint256 id
    ) public view virtual override returns (string memory) {
        return nftDetailOf[id].uri;
    }

    function tokenURI(uint256 id) public view returns (string memory) {
        return nftDetailOf[id].uri;
    }

    function setURI(string memory newuri) public onlyOwner {
        _setURI(newuri);
    }

    function updateNftDetails(
        uint256 nftId,
        NftDetailStruct memory _nftDetails
    ) public {
        require(
            msg.sender == nftDetailOf[nftId].admin,
            "Only Creator of this nft can update these details"
        );
        nftDetailOf[nftId] = _nftDetails;
    }
}
