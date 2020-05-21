<template>
  <v-container grid-list-md text-xs-center>
    <div>
      <h2>입찰 물품 선택</h2>
      <div class="separator">
        <div class="violet-segment"></div>
      </div>
      <div class="flex">
        <span class="white--text">
          <v-select
            v-model="selectedAuction"
            :items="auctionIds"
            label="Asset"
            @change="getAuctionById"
          ></v-select>
        </span>
      </div>
    </div>
    <div class="label">
      <h2>물품</h2>
    </div>
    <div class="separator">
      <div class="violet-segment"></div>
    </div>
    <v-layout row wrap>
      <v-flex
        6
        mx-0
        v-for="(auction, index) in auctions"
        :key="index"
        xs12
        sm
        md4
        lg4
      >
        <v-card class="rounded-card">
          <v-dialog
            v-model="dialog1"
            persistent
            :overlay-opacity="0.8"
            width="1000"
          >
            <template v-slot:activator="{ on }">
              <v-img :src="auction.image" height="300px" v-on="on"></v-img>
            </template>
            <button @click="dialog1 = false" class="close-button" />
            <v-img :src="auction.image" height="800px"></v-img>
          </v-dialog>

          <div class="text">
            <div class="auction-title">{{ auction.title }}</div>
            <div class="price">{{ auction.price }} Ether</div>
            <!-- <div>TokenId: {{auction.tokenId}}</div> -->
            <div>소유자: {{ auction.owner }}</div>
            <div
              v-if="
                auction.bidder ===
                  '0x0000000000000000000000000000000000000000' &&
                  !auction.finalized
              "
            >
              입찰자: empty
            </div>
            <div v-else-if="auction.finalized">Bidder: 낙찰됨</div>
            <div v-else>Bidder:{{ auction.bidder }}</div>
            <div>
              활성화:
              <span
                :class="{
                  active: auction.active,
                  isNotActive: !auction.active
                }"
                >{{ auction.active }}</span
              >
            </div>
            <div>
              종료:
              <span :class="{ finalized: auction.finalized }">{{
                auction.finalized
              }}</span>
            </div>
            <!-- <div>
              <Countdown
                trans='{  
                  "day":"Day",
                  "hours":"Hours",
                  "minutes":"Minuts",
                  "seconds":"Seconds",
                  "expired":"Event has been expired.",
                  "running":"Till the end of event.",
                  "upcoming":"Till start of event.",
                  "status": {
                    "expired":"Expired",
                    "running":"Running",
                    "upcoming":"Future"
                  }
                }'
              />
            </div> -->
          </div>
          <v-card-actions>
            <v-btn
              v-if="!auction.finalized"
              text
              color="#816bff"
              @click.stop="dialog2 = true"
              >입찰</v-btn
            >
            <v-btn v-else text color="grey">만료</v-btn>
            <v-dialog v-model="dialog2" max-width="290">
              <v-card>
                <v-card-title class="headline">입찰</v-card-title>

                <v-card-text>
                  정말 입찰하시겠습니까?
                </v-card-text>

                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn
                    v-on:click="submitBid"
                    @click="dialog2 = false"
                    text
                    color="#816bff"
                    >입찰</v-btn
                  >
                  <v-btn color="green darken-1" text @click="dialog2 = false">
                    취소하기
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>
<script>
// import Countdown from "@/components/Countdown.vue";

export default {
  data() {
    return {
      ciMyNFT: null,
      ciAuctions: null,
      auctions: [],
      auctionIds: [],
      selectedAuction: null,
      account: "",
      auctionInfo: {
        title: "",
        price: 0,
        tokenId: "",
        owner: ""
      },
      dialog1: false,
      dialog2: false
    };
  },

  // components: {
  //   Countdown
  // },

  async mounted() {
    this.account = await this.$getDefaultAccount();
    this.contractInstance = this.$web3.eth
      .contract(this.$config.AUCTIONS_ABI)
      .at(this.$config.AUCTIONS_CA);
    this.ciAuctions = this.$web3.eth
      .contract(this.$config.AUCTIONS_ABI)
      .at(this.$config.AUCTIONS_CA);
    this.ciMyNFT = this.$web3.eth
      .contract(this.$config.MYNFT_ABI)
      .at(this.$config.MYNFT_CA);
    await this.getAuctions();
    this.getAllAuctions();
  },

  methods: {
    getAllAuctions() {
      this.ciAuctions.getAllAuctionsOf(
        { from: this.account, gas: this.$config.GAS_AMOUNT },
        (error, result) => {
          this.auctionIds = result;
          /* eslint-disable no-console */
          console.log(this.auctionIds);
        }
      );
    },
    getAuctionById() {
      this.ciAuctions.getAuctionById(
        this.selectedAuction,
        { from: this.account, gas: this.$config.GAS_AMOUNT },
        (error, result) => {
          /* eslint-disable no-console */
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
    getAuctions() {
      this.ciAuctions.getCount({}, (error, result) => {
        const count = result;

        for (let i = 0; i < count; i++) {
          this.ciAuctions.getAuctionById(i, {}, (err, result) => {
            this.ciMyNFT.ownerOf(result[3], {}, (error, owner) => {
              this.auctions.push({
                title: result[0],
                price: this.$web3.fromWei(result[1], "ether"),
                image: "https://gateway.ipfs.io/ipfs/" + result[2],
                tokenId: result[3],
                owner: owner,
                active: result[6],
                finalized: result[7],
                bidder: result[8]
              });
            });
          });
        }
      });
    },

    submitBid() {
      this.ciAuctions.submitBid(
        this.selectedAuction,
        { from: this.account, gas: this.$config.GAS_AMOUNT },
        (error, result) => {
          console.log(result);
        }
      );

      /* eslint-disable no-console */
      // this.auctions[0].price = parseInt(this.auctions[0].price) + 1;
      // this.contractInstance.submitBid(this.accounts[0].tokenId);
    }
  }
};
</script>
<style scoped>
.flex {
  display: flex;
}

.auction-title {
  color: #816bff;
  font-weight: 500;
}

.active {
  color: green;
  font-weight: 600;
}

.isNotActive {
  color: red;
  font-weight: 600;
}

.finalized {
  color: grey;
}

.separator {
  margin-bottom: 20px;
  background: #e0e0e0;
  height: 2px;
  width: 100%;
  position: relative;
}

.violet-segment {
  width: 7rem;
  height: 4px;
  position: absolute;
  background: #816bff;
  top: -1px;
}

.text {
  padding: 10px 0px 0px 6px;
}

.price {
  font-weight: 600;
}

.rounded-card {
  border-radius: 25px;
}

.close-button {
  position: absolute;
  top: 10px;
  right: 10px;
  background-image: url(//maps.gstatic.com/tactile/omnibox/clear-1x-20150504.png);
  background-size: 96px 24px;
  height: 24px;
  width: 24px;
  cursor: pointer;
  z-index: 16px;
  outline: none;
}
</style>
