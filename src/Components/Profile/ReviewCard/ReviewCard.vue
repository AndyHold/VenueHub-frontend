<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <v-flex
    :key="review.reviewAuthor.userId"
    xs12
  >
    <v-card elevation="10" class="review-panel">
      <v-card-text>
        <v-layout row>

          <!-- Venue Image Panel -->
          <v-flex xs4 class="details-section">

            <!-- Title Row -->
            <v-flex xs12>
              <h3 class="font-weight-regular" align="center">
                {{ review.venue.venueName }}
              </h3>
            </v-flex>

            <!-- Image Row -->
            <v-layout row>
              <v-flex xs12>
                <v-spacer align="center">
                  <v-img
                    class="venue-photo"
                    v-if="review.venue.primaryPhoto"
                    :src="review.venue.primaryPhoto"
                    aspect-ratio="1"
                    height="225"
                    width="225"
                  >
                  </v-img>
                  <v-img
                    v-else
                    src="/src/Resources/Images/placeholder-image.jpg"
                    aspect-ratio="1"
                    height="225"
                    width="225"
                  ></v-img>
                </v-spacer>
              </v-flex>
            </v-layout>

          </v-flex>

          <!-- Venue Details Panel -->
          <v-flex xs4 row class="details-section">
            <v-divider vertical></v-divider>
            <v-flex class="details-section">
              <h3>
                Venue Details
              </h3>

              <!-- City Row -->
              <v-layout row  class="details-section">
                <v-flex xs4>
                  <h4 class="font-weight-regular">
                    City
                  </h4>
                </v-flex>
                <v-flex xs8>
                  <h4 class="font-weight-regular">
                    {{ review.venue.city }}
                  </h4>
                </v-flex>
              </v-layout>

              <!-- Category Row -->
              <v-layout row class="details-section">
                <v-flex xs4>
                  <h4 class="font-weight-regular">
                    Category
                  </h4>
                </v-flex>
                <v-flex xs8>
                  <h4 class="font-weight-regular">
                    {{ review.venue.categoryName }}
                  </h4>
                </v-flex>
              </v-layout>

              <!-- Description Row -->
              <v-flex class="details-section">
                <v-layout row>
                  <v-flex xs4>
                    <h4 class="font-weight-regular">
                      Description
                    </h4>
                  </v-flex>
                  <v-flex xs8>
                    <p>
                      {{ review.venue.shortDescription }}
                    </p>
                  </v-flex>
                </v-layout>
              </v-flex>

              <!-- Visit Venue Button Row -->
              <v-flex class="details-section">
              <v-layout row>
                <v-spacer align="center">
                  <v-btn
                    flat
                    color="primary darken-1"
                    v-on:click="goToVenue"
                  >See More</v-btn>
                </v-spacer>
              </v-layout>
            </v-flex>
            </v-flex>
            <v-divider vertical></v-divider>
          </v-flex>

          <!-- Review Details Panel -->
          <v-flex xs4 class="details-section">
            <h3>
              Comments
            </h3>
            <pre class="description-text photo-description-column">{{ review.reviewBody }}</pre>

            <!-- Date Row -->
            <v-layout row class="details-section">
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
            <v-layout row class="details-section">
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
            <v-flex class="details-section">
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
            <v-flex class="details-section">
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
        },
        venue: {
          type: Object,
          required: true,
          venueId: {
            type: Number,
            required: true
          },
          venueName: {
            type: String,
            required: true
          },
          categoryName: {
            type: String,
            required: true
          },
          city: {
            type: String,
            required: true
          },
          shortDescription: {
            type: String,
            required: true
          },
          primaryPhoto: {
            type: String,
            required: false
          }
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

      goToVenue: function () {
        this.$router.push(`/venues/${this.review.venue.venueId}`);
      }
    }
  }
</script>

<style lang="scss" scoped>

  @import "../../../Resources/StyleSheets/variables";

  .v-card {
    background-color: $lighter-secondary;
  }

  .review-panel {
    margin: 10px 20px;
  }

  .venue-photo {
    border-radius: 1em;
  }

  .photo-description-column {
    padding: 20px;
  }

  .description-text {
    font-family: 'Roboto', sans-serif;
    font-size: 14px;
  }

  .details-section {
    padding: 0 20px;
  }

</style>
