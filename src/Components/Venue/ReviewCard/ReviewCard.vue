<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <v-flex
    :key="review.reviewAuthor.userId"
    xs12
  >
    <v-card elevation="10" class="review-panel">
      <v-card-text>
        <v-layout row>

          <!-- Author Panel -->
          <v-flex xs12 md4>

            <!-- Title Row -->
            <v-flex x1>
              <h3 class="font-weight-regular" align="center">
                Author
              </h3>
            </v-flex>

            <!-- Image -->
            <v-layout>
              <v-flex x1>
                <v-spacer align="center">
                  <v-img
                    v-if="review.authorPhoto"
                    :src="review.authorPhoto"
                    aspect-ratio="1"
                    class="round"
                    height="225"
                    width="225"
                    v-on:click="goToUserPage(review.reviewAuthor.userId)"
                  >
                  </v-img>
                  <v-img
                    v-else
                    src="/src/Resources/Images/placeholder-image.jpg"
                    aspect-ratio="1"
                    class="round"
                    height="225"
                    width="225"
                    v-on:click="goToUserPage(review.reviewAuthor.userId)"
                  ></v-img>
                </v-spacer>
              </v-flex>
            </v-layout>

            <!-- Username Row -->
            <v-layout>
              <v-flex x1>
                <h4 class="font-weight-regular" align="center">
                  {{ review.reviewAuthor.username }}
                </h4>
              </v-flex>
            </v-layout>

          </v-flex>

          <!-- ReviewCard Body Panel -->
          <v-flex xs12 md8 class="review-body">
            <h3>
              Comments
            </h3>
            <pre class="photo-description-column">{{ review.reviewBody }}</pre>

            <!-- Date Row -->
            <v-layout row class="review-body">
              <v-flex xs3 md4 offset-xs3 offset-md0>
                <h4 class="font-weight-regular info-font">
                  Date Reviewed
                </h4>
              </v-flex>
              <v-flex xs6 md8>
                <h4 class="font-weight-regular info-font">
                  {{ getStartDate(review.timePosted) }}
                </h4>
              </v-flex>
            </v-layout>

            <!-- Time Row -->
            <v-layout row class="review-body">
              <v-flex xs3 md4 offset-xs3 offset-md0>
                <h4 class="font-weight-regular info-font">
                  Time Reviewed
                </h4>
              </v-flex>
              <v-flex xs6 md8>
                <h4 class="font-weight-regular info-font">
                  {{ getStartTime(review.timePosted) }}
                </h4>
              </v-flex>
            </v-layout>

            <!-- Star Rating Row -->
            <v-layout row class="review-body">
                <v-flex xs3 md4 offset-xs3 offset-md0>
                  <h4 class="font-weight-regular info-font">
                    Star Rating
                  </h4>
                </v-flex>
                <v-flex xs6 md8>
                  <v-tooltip bottom>

                    <template v-slot:activator="{ on }">
                      <div v-on="on">
                        <v-rating
                          v-model="review.starRating"
                          length="5"
                          readonly
                          size="1.5vw"
                        ></v-rating>
                      </div>
                    </template>

                    <span>{{ review.starRating }}</span>
                  </v-tooltip>
                </v-flex>
              </v-layout>

            <!-- Cost Rating Row -->
            <v-layout row class="review-body">
                <v-flex xs3 md4 offset-xs3 offset-md0>
                  <h4 class="font-weight-regular info-font">
                    Cost Rating
                  </h4>
                </v-flex>
                <v-flex xs6 md8>
                  <v-tooltip bottom>

                    <template v-slot:activator="{ on }">
                      <div v-on="on">
                        <v-rating
                          v-model="review.costRating"
                          length="4"
                          readonly
                          size="1.5vw"
                        ></v-rating>
                      </div>
                    </template>

                    <span>{{ review.costRating }}</span>
                  </v-tooltip>
                </v-flex>
              </v-layout>

          </v-flex>

        </v-layout>
      </v-card-text>
    </v-card>
  </v-flex>
</template>

<script>
  export default {
    name: "ReviewCard",

    props: {
      review: {
        type: Object,
        required: true,
        reviewAuthor: {
          type: Object,
          required: true,
          userId: {
            type: Number,
            required: true
          },
          username: {
            type: String,
            required: true
          }
        },
        reviewBody: {
          type: String,
          required: true
        },
        starRating: {
          type: Number,
          required: true
        },
        costRating: {
          type: Number,
          required: true
        },
        timePosted: {
          type: String,
          required: true
        },
        authorPhoto: {
          type: String,
          required: true
        }
      }
    },

    methods: {

      getStartDate: function (reviewDate) {
        let date = new Date(reviewDate);
        return date.toDateString();
      },

      getStartTime: function (reviewDate) {
        let date = new Date(reviewDate);
        return date.toLocaleTimeString();
      },

      goToUserPage: function (userId) {
        this.$router.push(`/profile/${userId}`)
      }
    }
  }
</script>

<style lang="scss" scoped>

  @import "../../../Resources/StyleSheets/commonStyles";

  .review-panel {
    margin: 10px 20px;
  }

  .round {
    border-radius: 25em;
  }

  .round :hover {
    cursor: pointer;
  }

  .photo-description-column {
    padding: 20px;
  }

  .review-body {
    padding: 0 2em;
  }

  .info-font {
    font-size: 1.5vw;
  }

</style>
