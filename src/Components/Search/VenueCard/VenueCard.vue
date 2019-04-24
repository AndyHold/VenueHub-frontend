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
                  src="src/Resources/Images/placeholder-image.jpg"
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
                      <v-flex xs4 class="left-column">
                        <h3 class="font-weight-regular">
                          City
                        </h3>
                      </v-flex>
                      <v-flex xs8 class="right-column">
                        <h3 class="font-weight-regular">
                          {{ venue.city }}
                        </h3>
                      </v-flex>
                    </v-layout>

                    <!-- Category Row -->
                    <v-layout row>
                      <v-flex xs4 class="left-column">
                        <h3 class="font-weight-regular">
                          Category
                        </h3>
                      </v-flex>
                      <v-flex xs8 class="right-column">
                        <h3 class="font-weight-regular">
                          {{ getCategoryName(venue.categoryId) }}
                        </h3>
                      </v-flex>
                    </v-layout>

                    <!-- Description Row -->
                    <v-flex>
                      <v-layout row>
                        <v-flex xs4 class="left-column">
                          <h3 class="font-weight-regular">
                            Description
                          </h3>
                        </v-flex>
                        <v-flex xs8 class="right-column">
                          <h3 class="font-weight-regular">
                            {{ venue.shortDescription }}
                          </h3>
                        </v-flex>
                      </v-layout>
                    </v-flex>

                    <!-- Star Rating Row -->
                    <v-flex>
                      <v-layout row>
                        <v-flex xs4 class="left-column">
                          <h3 class="font-weight-regular">
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
                        <v-flex xs4 class="left-column">
                          <h3 class="font-weight-regular">
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
                      <v-flex xs4 class="left-column">
                        <h3 class="font-weight-regular">
                          Distance
                        </h3>
                      </v-flex>
                      <v-flex xs8 class="right-column">
                        <h3 class="font-weight-regular">
                          {{ venue.distance }} km
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
              <v-layout column justify-space-between fill-height>
                <v-flex d-flex fluid>
                  <v-responsive d-flex fill-height>
                    <div
                      :id="getMapPanelIdFromVenueId(venue.venueId)"
                      class="map-panel"
                    ></div>
                  </v-responsive>
                </v-flex>
              </v-layout>
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
        for (let index in this.categories) {
          if (categoryId === this.categories[index].categoryId) {
            return this.categories[index]["categoryName"];
          }
        }
      },

      getVenuePhoto: function (venue) {
        return endpoint(`/venues/${venue.venueId}/photos/${venue.primaryPhoto}`);
      },

      displayVenue: async function () {
        this.$router.push(`/venues/${this.venue.venueId}`)
      },

      getAdminPhoto: async function() {
        let response = await getUserImage(this.fullVenue.admin.userId);
        if (response.status === 200) {
          this.adminPhoto = endpoint(`/users/${this.fullVenue.admin.userId}/photo`);
        } else {
          this.adminPhoto = false;
        }
      },

      getAddress: function () {
        return this.fullVenue.address.split(',');
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

  @import "../../../Resources/StyleSheets/variables";

  .title-text {
    color: $lighter-secondary;
    font-size: 20px;
    justify-content: center;
  }

  .venue-card {
    margin: 20px 20px 0 20px;
  }

  .primary-image {
    margin: 10px;
  }

  .left-column {
    font-size: 18px;
    text-align: right;
    padding: 0 10px 0 0;
  }

  .right-column {
    font-size: 18px;
    text-align: left;
    padding: 0 0 0 10px;
  }

  .map-panel {
    height: 100%;
    padding: 20px;
  }

</style>