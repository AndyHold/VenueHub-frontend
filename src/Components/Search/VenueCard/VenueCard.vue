<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <div><!-- Venue Cards -->
      <v-card
        elevation="10"
        class="venue-card"
        v-bind:key="venue.venueId"
        v-on:click="displayVenue"
      >
        <v-layout row>


          <!-- Photo card -->
          <v-flex xs2 d-flex >
            <v-card>
              <v-responsive>
                <v-img
                  v-if="venue.primaryPhoto"
                  :src="getVenuePhoto(venue)"
                  aspect-ratio="1"
                  class="primary-image"
                ></v-img>
                <v-img
                  v-else
                  src="/src/Resources/Images/placeholder-image.jpg"
                  aspect-ratio="1"
                  class="primary-image"
                ></v-img>
              </v-responsive>
            </v-card>
          </v-flex>
          <!-- End of photo card -->

          <!-- Description and category card -->
          <v-flex xs8>
            <v-card>
              <v-card-title
                class="title-text primary"
                primary-title
              >
                {{ venue.venueName }}
              </v-card-title>
              <v-flex d-flex fill-height>
                <v-card-text>
                  <v-layout column justify-space-between fill-height>

                    <!-- City Row -->
                    <v-layout row>
                      <v-flex xs4>
                        <h3 class="font-weight-regular left-column">
                          City
                        </h3>
                      </v-flex>
                      <v-flex xs8>
                        <h3 class="font-weight-regular right-column">
                          {{ venue.city }}
                        </h3>
                      </v-flex>
                    </v-layout>

                    <!-- Category Row -->
                    <v-layout row>
                      <v-flex xs4>
                        <h3 class="font-weight-regular left-column">
                          Category
                        </h3>
                      </v-flex>
                      <v-flex xs8>
                        <h3 class="font-weight-regular right-column">
                          {{ getCategoryName(venue.categoryId) }}
                        </h3>
                      </v-flex>
                    </v-layout>

                    <!-- Description Row -->
                    <v-flex>
                      <v-layout row>
                        <v-flex xs4>
                          <h3 class="font-weight-regular left-column">
                            Description
                          </h3>
                        </v-flex>
                        <v-flex xs8>
                          <h3 class="font-weight-regular right-column">
                            {{ venue.shortDescription }}
                          </h3>
                        </v-flex>
                      </v-layout>
                    </v-flex>

                    <!-- Star Rating Row -->
                    <v-flex>
                      <v-layout row>
                        <v-flex xs4>
                          <h3 class="font-weight-regular left-column">
                            Star Rating
                          </h3>
                        </v-flex>
                        <v-flex xs8 class="right-column">
                          <v-tooltip bottom>

                            <template v-slot:activator="{ on }">
                              <div v-on="on">
                                <v-rating
                                  v-model="venue.meanStarRating"
                                  length="5"
                                  half-increments
                                  readonly
                                ></v-rating>
                              </div>
                            </template>

                            <span>{{ venue.meanStarRating }}</span>
                          </v-tooltip>
                        </v-flex>
                      </v-layout>
                    </v-flex>

                    <!-- Cost Rating Row -->
                    <v-flex>
                      <v-layout row>
                        <v-flex xs4>
                          <h3 class="font-weight-regular left-column">
                            Cost Rating
                          </h3>
                        </v-flex>
                        <v-flex xs8 class="right-column">
                          <v-tooltip bottom>

                            <template v-slot:activator="{ on }">
                              <div v-on="on">
                                <v-rating
                                  v-model="venue.modeCostRating"
                                  length="4"
                                  readonly
                                  full-icon="monetization_on"
                                  empty-icon="monetization_on"
                                ></v-rating>
                              </div>
                            </template>

                            <span>{{ venue.modeCostRating }}</span>
                          </v-tooltip>
                        </v-flex>
                      </v-layout>
                    </v-flex>

                    <!-- Distance Row -->
                    <v-layout v-if="venue.distance" row>
                      <v-flex xs4>
                        <h3 class="font-weight-regular left-column">
                          Distance
                        </h3>
                      </v-flex>
                      <v-flex xs8>
                        <h3 class="font-weight-regular right-column">
                          {{ venue.distance }}
                        </h3>
                      </v-flex>
                    </v-layout>

                  </v-layout>
                </v-card-text>
              </v-flex>
            </v-card>
          </v-flex>
          <!-- End of description and category card -->

          <!-- Location Card -->
          <v-flex xs2 d-flex>
            <v-card>
              <v-responsive>
                <v-flex d-flex>
                  <div
                    :id="getMapPanelIdFromVenueId(venue.venueId)"
                    class="map-panel"
                  ></div>
                </v-flex>
              </v-responsive>
            </v-card>
          </v-flex>
          <!-- End of location card -->

        </v-layout>
      </v-card>
  </div>
</template>

<script>

  import {endpoint} from "../../../Utilities/endpoint";
  import {getUserImage} from "./VenueCardService";
  import {Map, View} from 'ol';
  import OSM from "ol/source/OSM";
  import TileLayer from 'ol/layer/Tile';
  import {fromLonLat} from "ol/proj";

  export default {
    name: "venue-card",

    props: {
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
        categoryId: {
          type: Number,
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
        latitude: {
          type: Number,
          required: true
        },
        longitude: {
          type: Number,
          required: true
        },
        meanStarRating: {
          type: Number,
          required: true
        },
        modeCostRating: {
          type: Number,
          required: true
        },
        primaryPhoto: {
          type: String,
          required: false
        },
        distance: {
          type: Number,
          required: false
        }
      },

      categories: {
        type: Array,
        required: true
      }
    },

    data: () => {
      return {

        displayVenueDialog: false,

        adminPhoto: false
      }
    },

    methods: {

      makeMap: function (venue) {
        return new Map({
          target: this.getMapPanelIdFromVenueId(venue.venueId),
          layers: [
            new TileLayer({
              source: new OSM()
            })
          ],
          view: new View({
            center: fromLonLat([venue.longitude, venue.latitude]),
            zoom: 18
          })
        });
      },

      getMapPanelIdFromVenueId: function (venueId) {
        return `map-${venueId}`;
      },

      getCategoryName: function (categoryId) {
        for (let index = 0; index < this.categories.length; index++) {
          if (this.categories[index].hasOwnProperty("categoryId") && categoryId === this.categories[index].categoryId) {
            if (this.categories[index].hasOwnProperty("categoryName")) {
              return this.categories[index]["categoryName"];
            }
          }
        }
      },

      getVenuePhoto: function (venue) {
        return endpoint(`/venues/${venue.venueId}/photos/${venue.primaryPhoto}`);
      },

      displayVenue: async function () {
        this.$router.push(`/venues/${this.venue.venueId}`)
      },

      getVenuePhotoEndpoint: function(photo) {
        return endpoint(`/venues/${this.venue.venueId}/photos/${photo.photoFilename}`);
      }

    },

    mounted: async function () {
      this.makeMap(this.venue);
    }
  }
</script>

<style lang="scss" scoped>

  @import "../../../Resources/StyleSheets/commonStyles";

  .title-text {
    font-size: 20px !important;
  }

  .venue-card {
    margin: 20px 20px 0 20px;
  }

  .venue-card :hover {
    cursor: pointer;
  }

  .primary-image {
    margin: 10px;
  }

  .left-column {
    font-size: 1.5vw;
    text-align: right;
    padding: 0 10px 0 0;
  }

  .right-column {
    font-size: 1.5vw;
    text-align: left;
    padding: 0 0 0 10px;
  }

  .map-panel {
    height: 300px;
    padding: 20px;
  }

</style>
