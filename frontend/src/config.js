const MyNFT = require("./contracts/MyNFT");
const Auctions = require("./contracts/Auctions");

export default {
  MYNFT_CA: "0x8144a134083D9f9c05de33d6FE9dd566CD41952e",
  AUCTIONS_CA: "0x651e0E5271c31a209a8c94ca7156198f34280E55",

  MYNFT_ABI: MyNFT.abi,
  AUCTIONS_ABI: Auctions.abi,

  GAS_AMOUNT: 500000
};
