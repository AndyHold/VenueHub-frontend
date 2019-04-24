<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <v-flex
    :key="review.reviewAuthor.userId"
    xs12
  >
    <v-card elevation="10" class="review-panel">
      <v-card-text>
        <v-layout row>

          <!-- Author Panel -->
          <v-flex xs4>

            <!-- Title Row -->
            <v-flex xs12>
              <h3 class="font-weight-regular" align="center">
                Author
              </h3>
            </v-flex>

            <!-- Image Row -->
            <v-layout row>
              <v-flex xs12>
                <v-spacer align="center">
                  <v-img
                    v-if="review.authorPhoto"
                    :src="review.authorPhoto"
                    aspect-ratio="1"
                    class="profile-photo"
                    height="225"
                    width="225"
                  >
                  </v-img>
                  <v-img
                    v-else
                    src="/src/Resources/Images/placeholder-image.jpg"
                    aspect-ratio="1"
                    class="profile-photo"
                    height="225"
                    width="225"
                  ></v-img>
                </v-spacer>
              </v-flex>
            </v-layout>

            <!-- Username Row -->
            <v-layout row>
              <v-flex xs12>
                <h4 class="font-weight-regular" align="center">
                  {{ review.reviewAuthor.username }}
                </h4>
              </v-flex>
            </v-layout>

          </v-flex>

          <!-- ReviewCard Body Panel -->
          <v-flex xs8>
            <h3>
              Review Body
            </h3>
            <pre class="description-text photo-description-column">{{ review.reviewBody }}</pre>

            <!-- Date Row -->
            <v-layout row>
              <v-flex xs4>
                <h4 class="font-weight-regular">
                  Date Reviewed
                </h4>
              </v-flex>
              <v-flex xs8>
                <h4 class="font-weight-regular">
                  {{ getStartDate(review.timePosted) }}
                </h4>
              </v-flex>
            </v-layout>

            <!-- Time Row -->
            <v-layout row>
              <v-flex xs4>
                <h4 class="font-weight-regular">
                  Time Reviewed
                </h4>
              </v-flex>
              <v-flex xs8>
                <h4 class="font-weight-regular">
                  {{ getStartTime(review.timePosted) }}
                </h4>
              </v-flex>
            </v-layout>

            <!-- Star Rating Row -->
            <v-flex>
              <v-layout row>
                <v-flex xs4>
                  <h4 class="font-weight-regular">
                    Star Rating
                  </h4>
                </v-flex>
                <v-flex xs8>
                  <v-tooltip bottom>

                    <template v-slot:activator="{ on }">
                      <div v-on="on">
                        <v-rating
                          v-model="review.starRating"
                          length="5"
                          readonly
                        ></v-rating>
                      </div>
                    </template>

                    <span>{{ review.starRating }}</span>
                  </v-tooltip>
                </v-flex>
              </v-layout>
            </v-flex>

            <!-- Cost Rating Row -->
            <v-flex>
              <v-layout row>
                <v-flex xs4>
                  <h4 class="font-weight-regular">
                    Cost Rating
                  </h4>
                </v-flex>
                <v-flex xs8>
                  <v-tooltip bottom>

                    <template v-slot:activator="{ on }">
                      <div v-on="on">
                        <v-rating
                          v-model="review.costRating"
                          length="4"
                          readonly
                        ></v-rating>
                      </div>
                    </template>

                    <span>{{ review.costRating }}</span>
                  </v-tooltip>
                </v-flex>
              </v-layout>
            </v-flex>
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
    }
  }
</script>

<style lang="scss" scoped>

  @import "../../../Resources/StyleSheets/variables";

  .review-panel {
    margin: 10px 20px;
  }

  .profile-photo {
    border-radius: 25em;
  }

  .photo-description-column {
    padding: 20px;
  }

  .description-text {
    font-family: 'Roboto', sans-serif;
    font-size: 14px;
  }

</style>
