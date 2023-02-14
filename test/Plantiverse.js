const {
  time,
  loadFixture,
} = require("@nomicfoundation/hardhat-network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");

describe("*Plantiverse", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deployment() {
    const BASEURI = "https://cristianricharte6.github.io/metadata/";
    const signers = await ethers.getSigners();

    const Plantiverse = await ethers.getContractFactory("Plantiverse");
    const plantiverse = await Plantiverse.deploy(BASEURI);

    plantiverse.deployed();

    return { plantiverse, signers, BASEURI };
  }

  describe("*DEPLOYMENT", function () {
    it("Should set the right owner", async function () {
      const { plantiverse, signers } = await loadFixture(deployment);

      expect(signers[0].address).to.equal(await plantiverse.owner());
      console.log("- Deployer account is:", signers[0].address);
      console.log("- Plantiverse contract address is:", plantiverse.address);
    });

    it("Should transfer ownership - transferOwnership()", async function () {
      const { plantiverse, signers } = await loadFixture(deployment);

      await plantiverse.transferOwnership(signers[1].address);

      expect(signers[1].address).to.equal(await plantiverse.owner());
      console.log("✅ Contract Ownership transferred to:", signers[1].address);
    });

    it("Should set the right BASE URI - uri()", async function () {
      const { plantiverse, BASEURI } = await loadFixture(deployment);
      const NFTid = 1;
      const copies = 10;

      await plantiverse.mint(copies);

      const baseURI = await plantiverse.uri(1);

      expect(baseURI).to.equal(BASEURI + NFTid + ".json");
      console.log("✅ Base URI is set correctly from constructor");
    });
  });

  describe("*MINT NEW NFTs AND UPDATE BASE URI", function () {
    it("Modify the BASE URI - updateBaseURI()", async function () {
      const { plantiverse, signers } = await loadFixture(deployment);
      const NFTid = 1;
      const copies = 10;
      const newBASEURI = "https://NEWBASEURI/";

      await plantiverse.mint(copies);

      await plantiverse.updateBaseURI(newBASEURI);

      const tokenURI = await plantiverse.uri(1);

      expect(tokenURI).to.equal(newBASEURI + NFTid + ".json");
      console.log(`✅ BASE URI updated to: ${newBASEURI}`);
      console.log(`- Token Uri for NFT collection ${NFTid} is: ${tokenURI}`);

      await expect(plantiverse.uri(2)).to.be.reverted;
      await expect(plantiverse.uri(0)).to.be.reverted;
      console.log(
        "🛑 Reverted if checked Not created NFT collection ID or ID 0"
      );
    });

    it("Mint 20 different collections - mint()", async function () {
      const { plantiverse, BASEURI, signers } = await loadFixture(deployment);
      const collectionsToMint = 20;
      const copies = 10;

      await expect(plantiverse.connect(signers[1]).mint(10)).to.be.reverted;
      console.log(`🛑 Reverted if minting from not the owner`);

      for (let i = 0; i < collectionsToMint; i++) {
        await plantiverse.mint(copies);
      }

      expect(await plantiverse.nFTcount()).to.equal(collectionsToMint);
      expect(await plantiverse.uri(20)).to.equal(BASEURI + 20 + ".json");
      console.log(
        `✅ Owner has minted ${collectionsToMint} NFT collections of ${copies} copies`
      );

      expect(await plantiverse.balanceOf(signers[0].address, 1)).to.equal(
        copies
      );
      expect(await plantiverse.balanceOf(signers[0].address, 20)).to.equal(
        copies
      );
      copies;

      console.log(`✅ Minter owns ${copies} copies of each NFT minted`);
    });
  });

  describe("*TRANSFER NFTs COPIES", function () {
    it("Should transfer copies from 1 NFT collection - safeTransferFrom()", async function () {
      const { plantiverse, signers } = await loadFixture(deployment);
      const copies = 10;
      const NFTid = 1;

      await plantiverse.mint(100);

      await expect(
        plantiverse
          .connect(signers[1])
          .safeTransferFrom(
            signers[0].address,
            signers[2].address,
            NFTid,
            copies,
            "0x"
          )
      ).to.be.reverted;
      console.log("🛑 Reverted if transferring NFTs from not NFT's owner");

      await plantiverse.safeTransferFrom(
        signers[0].address,
        signers[1].address,
        NFTid,
        copies / 2,
        "0x"
      );

      const NFTsTransfered = await plantiverse.balanceOf(
        signers[1].address,
        NFTid
      );

      expect(await plantiverse.balanceOf(signers[1].address, NFTid)).to.equal(
        copies / 2
      );
      console.log(
        `✅ NFT's owner has transferred ${NFTsTransfered} copies of collection 1 (Total copies minted are ${copies}) to ${signers[1].address}`
      );
    });

    it("Should transfer copies from different NFT collection - safeBatchTransferFrom()", async function () {
      const { plantiverse, signers } = await loadFixture(deployment);
      const copies = [5, 5, 5];
      const NFTids = [1, 2, 3];

      for (let i = 0; i < 3; i++) {
        await plantiverse.mint(10);
      }

      await expect(
        plantiverse
          .connect(signers[1])
          .safeBatchTransferFrom(
            signers[0].address,
            signers[2].address,
            NFTids,
            copies,
            "0x"
          )
      ).to.be.reverted;
      console.log("🛑 Reverted if transferring NFTs from not NFT's owner");

      await plantiverse.safeBatchTransferFrom(
        signers[0].address,
        signers[1].address,
        NFTids,
        copies,
        "0x"
      );

      const balanceNFT1 = await plantiverse.balanceOfBatch(
        [signers[1].address, signers[1].address, signers[1].address],
        NFTids
      );

      expect(await plantiverse.balanceOf(signers[1].address, 1)).to.equal(5);
      expect(await plantiverse.balanceOf(signers[1].address, 2)).to.equal(5);
      expect(await plantiverse.balanceOf(signers[1].address, 3)).to.equal(5);

      console.log(
        `✅ Minter has transferred ${balanceNFT1} copies from collections ${NFTids} to ${signers[1].address}`
      );
    });
  });

  describe("*ALLOW THIRD PARTIES TO MANAGE NFTs", function () {
    it("Should allow third account to manage all collections - setApprovalForAll()", async function () {
      const { signers, plantiverse } = await loadFixture(deployment);
      const NFTids = [1, 2];
      const copies = [10, 10];

      await plantiverse.mint(100);
      await plantiverse.mint(100);

      await plantiverse.setApprovalForAll(signers[1].address, true);
      console.log(
        "✅ Signer 0 has allow to Signer 1 to manage his NFTs collections"
      );

      await expect(
        plantiverse
          .connect(signers[2])
          .safeBatchTransferFrom(
            signers[0].address,
            signers[1].address,
            NFTids,
            copies,
            "0x"
          )
      ).to.be.reverted;

      console.log(
        "🛑 Reverted if transferring NFTs from not NFT's owner but with signers 1 having allowance to transfer. (Caller is signers 2)"
      );

      await plantiverse
        .connect(signers[1])
        .safeBatchTransferFrom(
          signers[0].address,
          signers[1].address,
          NFTids,
          copies,
          "0x"
        );

      expect(await plantiverse.balanceOf(signers[1].address, 1)).to.equal(10);
      expect(await plantiverse.balanceOf(signers[1].address, 2)).to.equal(10);
      expect(await plantiverse.balanceOf(signers[0].address, 1)).to.equal(90);
      expect(await plantiverse.balanceOf(signers[0].address, 1)).to.equal(90);

      console.log(
        `✅ Signer 1 has transferred NFT copies from Address 0 (After he is allowed to manage NFTs)`
      );
    });
  });

  describe("*CHECK THAT THE EVENTS ARE EMITTED", function () {
    it("Should emit events", async function () {
      const { plantiverse, signers } = await loadFixture(deployment);
      const nftId = 1;
      const amount = 10;
      await expect(plantiverse.mint(amount))
        .to.emit(plantiverse, "NFTMinted")
        .withArgs(signers[0].address, nftId, amount, anyValue);

      console.log("📤 Event NFTMinted emitted when called mint function.");

      const newBaseURI = "new";
      await expect(plantiverse.updateBaseURI(newBaseURI))
        .to.emit(plantiverse, "BaseURIUpdated")
        .withArgs(newBaseURI, anyValue);

      console.log(
        "📤 Event BaseURIUpdated emitted when called updateBaseURI function."
      );

      await expect(plantiverse.transferOwnership(signers[1].address))
        .to.emit(plantiverse, "OwnershipTransferred")
        .withArgs(signers[0].address, signers[1].address);

      console.log(
        "📤 Event OwnershipTransferred emitted when called transferOwnership function."
      );
    });
  });
});
