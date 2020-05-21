<template>
  <div>
    <v-form class="form" ref="form">
      <v-text-field v-model="tokenid"></v-text-field>

      <v-text-field
        v-model="auction.auctionTitle"
        placeholder="e.g. My NFT"
        label="Auction title"
        persistent-hint
      ></v-text-field>

      <v-text-field
        v-model="auction.price"
        placeholder="e.g. 1"
        label="Initial Price"
        persistent-hint
      ></v-text-field>

      <v-btn @click="createAuction()" outlined color="dark">Create Auction</v-btn>
    </v-form>
  </div>
</template>
<script>
export default {
  props: ["tokenid", "metadata"],

  data() {
    return {
      account: null,
      contractInstance: null,

      auction: {
        auctionTitle: "",
        price: null
      }
    };
  },

  async mounted() {
    this.account = await this.$getDefaultAccount();
    this.contractInstance = this.$web3.eth
      .contract(this.$config.AUCTIONS_ABI)
      .at(this.$config.AUCTIONS_CA);
  },

  methods: {
    async createAuction() {
      if (!this.tokenid) {
        alert("Check for tokenId");
        return;
      }

      const price = this.$web3.toWei(this.auction.price, "ether");
      this.contractInstance.createAuction(
        this.$config.MYNFT_CA,
        this.tokenid,
        this.auction.auctionTitle,
        this.metadata,
        price,
        { from: this.account, gas: this.$config.GAS_AMOUNT },
        (error, transactionHash) => {
          /* eslint-disable no-console */
          console.log("txhash", transactionHash);
        }
      );
      // eslint-disable-next-line
      this.watchCreated((error, result) => {
        if (!error) {
          alert("Creation completed...!");
          location.href = "/";
        }
      });
    },

    async watchCreated(cb) {
      const currentBlock = await this.getCurrentBlock();
      const eventWatcher = this.contractInstance.AuctionCreated(
        {},
        { fromBlock: currentBlock - 1, toBlock: "latest" }
      );
      eventWatcher.watch(cb);
    },

    getCurrentBlock() {
      return new Promise((resolve, reject) => {
        this.$web3.eth.getBlockNumber((err, blocknumber) => {
          if (!err) resolve(blocknumber);
          reject(err);
        });
      });
    }
  }
};
</script>
