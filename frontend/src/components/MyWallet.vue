<template>
  <div class="containWrap">
    <v-card class="cardG">
      <div>
        <p class="text-center address">
          {{ account }}
          <span class="reftxt">(Address)</span>
        </p>
        <p class="text-center balance">
          {{ balance }} Ether
          <span class="reftxt">(Balance)</span>
        </p>
      </div>
    </v-card>

    <h2>Transfer</h2>
    <v-select
      v-model="selectedAuction"
      :items="auctionIds"
      label="Asset"
      @change="getAuctionById"
    ></v-select>
    <div v-show="selectedAuction">
      <h3>Auction Info</h3>
      <div>Title: {{ auctionInfo.title }}</div>
      <div>Price: {{ auctionInfo.price }} Ether</div>
      <div>TokenId: {{ auctionInfo.tokenId }}</div>
      <div>Owner: {{ auctionInfo.owner }}</div>
    </div>

    <v-text-field
      v-model="toAddress"
      label="To Address"
      required
    ></v-text-field>

    <v-btn @click="finalizeAuction" outlined color="dark">Finalize</v-btn>
  </div>
</template>
<script>
export default {
  data() {
    return {
      account: "",
      balance: null,

      ciMyNFT: null,
      ciAuctions: null,

      auctionIds: [],
      toAddress: null,
      selectedAuction: null,

      auctionInfo: {
        title: "",
        price: 0,
        tokenId: "",
        owner: ""
      }
    };
  },

  async mounted() {
    this.account = await this.$getDefaultAccount();
    this.$web3.eth.getBalance(this.account, (error, result) => {
      this.balance = this.$web3.fromWei(result, "ether");
    });

    this.ciMyNFT = this.$web3.eth
      .contract(this.$config.MYNFT_ABI)
      .at(this.$config.MYNFT_CA);
    this.ciAuctions = this.$web3.eth
      .contract(this.$config.AUCTIONS_ABI)
      .at(this.$config.AUCTIONS_CA);

    this.getMyAuctions();
  },

  methods: {
    getMyAuctions() {
      this.ciAuctions.getAuctionsOf(
        this.account,
        { from: this.account, gas: this.$config.GAS_AMOUNT },
        (error, result) => {
          this.auctionIds = result;
        }
      );
    },

    getAuctionById() {
      this.ciAuctions.getAuctionById(
        this.selectedAuction,
        { from: this.account, gas: this.$config.GAS_AMOUNT },
        (error, result) => {
          /* eslint-disable no-console */
          console.log(result);
          console.log(this.selectedAuction);
          this.auctionInfo.title = result[0];
          this.auctionInfo.price = this.$web3.fromWei(result[1], "ether");
          this.auctionInfo.tokenId = result[3];

          this.ciMyNFT.ownerOf(result[3], {}, (error, owner) => {
            this.auctionInfo.owner = owner;
          });
        }
      );
    },

    finalizeAuction() {
      if (!this.toAddress) {
        alert("please fill in to Address");
        return;
      }

      this.ciAuctions.finalizeAuction(
        this.selectedAuction,
        this.toAddress,
        { from: this.account, gas: this.$config.GAS_AMOUNT },
        (error, result) => {
          console.log(result);
        }
      );
      // eslint-disable-next-line
      this.watchFinalized((error, result) => {
        if (!error) {
          alert("Auction finalized!");
          location.href = "/";
        }
      });
    },

    async watchFinalized(cb) {
      const currentBlock = await this.getCurrentBlock();
      const eventWatcher = this.ciAuctions.AuctionFinalized(
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
<style scoped>
.containWrap {
  max-width: 600px;
  padding: 20px;
  border: 1px solid #e6e6e6;
  margin: 0 auto;
  background: #fafafa;
  text-align: center;
}

.cardG {
  margin: 10px;
  padding: 10px;
}

.cardG .reftxt {
  color: #b7afaf;
}
</style>
