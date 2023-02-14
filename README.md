# 🌱 Soft MultiToken Smart Contract (Plantiverse)

- Contract address (Mumbai Testnet): 0xe5DcAc668d0a47Dbeb9127755e455AD893D3c257
- <a href="https://testnets.opensea.io/es/collection/plantiverse">OpenSea TestNet collection</a>

### Metadata endpoint

NFTs are pointing to a BASE URL -> cristianRicharte6.github.io/

Then we need to add the Token path -> metadata/<TOKEN ID>.json

**Example of BASE URL & Token Path concatenated:** <a href="cristianricharte6.github.io/metadata/0.json">cristianricharte6.github.io/metadata/0.json</a>

## More links:

- <a href="https://www.plantiver.se/">Plantiverse.se</a>

- <a href="https://docs.google.com/document/d/1d18uPIR33CRtEjJilKW2X8munxFJzUSGNtq1g_zMs38/edit">MWC Plantiverse Informe</a>

## Contract tested through:

- Remix. ✅
- Slither (Static Analyzer). ✅
- Solhint (Advance Linter). ✅
- Compatibility with Marketplaces. ✅
- Unit tests. ✅
- Solidity coverage. ✅ (100%)

## Missing:

- Unit tests for Events.

## Functions / Operations

**Getters and Read-only operations** 📖

- balanceOf: Getter for the entire number of copies of an NFT assigned to a given address.
- balanceOfBatch: Getter for the entire number of copies of different NFT assigned to a different given addresses.
- isApprovedForAll: Determines whether the Address X may control the NFTs of the Address Y.
- nFTcount: Getter for the total number of NFTs minted.
- uri: Gives the endpoint and token id concatenated back. Obtaining metadata.
- supportsInterface: Internal call to see if an interface is supported. (Not helpful, but necessary)
- owner: Returns the Smart contract owner.

**Setters and writing operations** ✍

- mint: Minting function for a new NFT passing the amount of copies.
- safeTransferFrom: Send NFT X & X Copies from Address Y to Address Z.
- safeBatchTransferFrom: Send different NFTs and different copies of each NFT from Address Y to Address Z.
- setApprovalForAll: Permit different addresses to control all NFTs.
- tranferOwnership: Setter for the Smart contract Owner.
- updateBaseURI: Setter to update the Base URI.
