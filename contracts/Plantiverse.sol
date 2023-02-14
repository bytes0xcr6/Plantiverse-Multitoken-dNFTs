// SPDX-License-Identifier: Unlicense

pragma solidity 0.8.18;
// @author Plantiverse (Cristian Richarte Gil)
// @title Plantiverse NFT collection

import "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155URIStorage.sol";

contract Plantiverse is IERC1155, ERC1155URIStorage{

    address public owner;
    uint256 public nFTcount; // First NFT collection minted will be 1.

    event NFTMinted(address indexed minter, uint256 nftId, uint256 amount, uint256 mintingTime);
    event BaseURIUpdated(string newBaseURI, uint256 updateTime);
    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);


    modifier onlyOwner{
        require(msg.sender == owner, "You are not the Owner");
        _;
    }

    /** 
     * @param baseURI_: Base URI where the NFTs Metadata is Stored. // Example: https://cristianricharte6.github.io/metadata/
     */
    constructor(string memory baseURI_) ERC1155(baseURI_){
        _setBaseURI(baseURI_);
        owner = msg.sender;
    }
    
    /**
     * @dev Individual minting function. It will mint only 1 NFT per call, but you can create as many copies as you want.
     * @param _copies: Total amount of NFTs copies we want to mint. (Same NFT Collection)
     */
    function mint(uint256 _copies) external onlyOwner{
        ++nFTcount;
        uint256 count = nFTcount;
        _setURI(count, Strings.toString(count));
        _mint(msg.sender, count, _copies, "");
        emit NFTMinted(msg.sender, count, _copies, block.timestamp);
    }

    /**
     * @dev Setter for Base URI.
     * @param newBaseURI: New Base URI to set.
     */
    function updateBaseURI(string memory newBaseURI) external onlyOwner{
        _setBaseURI(newBaseURI);

        emit BaseURIUpdated(newBaseURI, block.timestamp);
    }

    /**
     * @dev Transfers ownership of the contract to a new account (`newOwner`).
     * @param newOwner: New contract Owner to set.
     */
    function transferOwnership(address newOwner) external onlyOwner{
        require(newOwner != address(0), "Not a valid address");
        address oldOwner = owner;
        owner = newOwner;
        emit OwnershipTransferred(oldOwner, newOwner);
    }

    /**
     * @dev Getter for the BASE URI & TOKEN URI concatenated.
     * @param _nFTCollection: NFT Collection Identifier.
     *
     * This enables the following behaviors:
     *
     * - if `_tokenURIs[tokenId]` is set, then the result is the concatenation
     *   of `_baseURI` and `_tokenURIs[tokenId]` (keep in mind that `_baseURI`
     *   is empty per default);
     *
     * - if `_tokenURIs[tokenId]` is NOT set then we fallback to `super.uri()`
     *   which in most cases will contain `ERC1155._uri`;
     *
     * - if `_tokenURIs[tokenId]` is NOT set, and if the parents do not have a
     *   uri value set, then the result is empty.
     */   
    function uri(uint256 _nFTCollection) public view override(ERC1155URIStorage) returns (string memory) {
        require(_nFTCollection != 0 && nFTcount >= _nFTCollection, "Wrong NFT Collection");
        return string(abi.encodePacked(ERC1155URIStorage.uri(_nFTCollection),".json"));
    }
}