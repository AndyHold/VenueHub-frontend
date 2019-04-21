<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <div><!-- Venue Cards -->

    <v-dialog
      v-model="displayFullVenue"
      width="80%"
    >

      <!-- Short Venue Card -->
      <template v-slot:activator="{ on }">
        <v-card
        elevation="10"
        class="venue-card"
        v-bind:key="venue.venueId"
        v-on="on"
        v-on:click="displayVenue"
      >
        <v-layout row>


          <!-- Name and photo card -->
          <v-flex xs3 d-flex>
            <v-card>
              <v-card-title
                class="title-text primary"
                primary-title
              >
                {{ venue.venueName }}
              </v-card-title>
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
          <!-- End of name and photo card -->

          <!-- Description and category card -->
          <v-flex xs6 d-flex>
            <v-card>
              <v-flex d-flex fill-height>
                <v-card-text>
                  <v-layout column justify-space-between fill-height>

                    <!-- Category Row -->
                    <v-layout row>
                      <v-flex xs4 class="left-column">
                        Category
                      </v-flex>
                      <v-flex xs8 class="right-column">
                        {{ getCategoryName(venue.categoryId) }}
                      </v-flex>
                    </v-layout>

                    <!-- Description Row -->
                    <v-flex>
                      <v-layout row>
                        <v-flex xs4 class="left-column">
                          Description
                        </v-flex>
                        <v-flex xs8 class="right-column">
                          {{ venue.shortDescription }}
                        </v-flex>
                      </v-layout>
                    </v-flex>

                    <!-- Star Rating Row -->
                    <v-flex>
                      <v-layout row>
                        <v-flex xs4 class="left-column">
                          Star Rating
                        </v-flex>
                        <v-flex xs8 class="right-column">
                          <!-- TODO: add the actual value somewhere here -->
                          <v-rating
                            v-model="venue.meanStarRating"
                            length="5"
                            half-increments
                            readonly
                          ></v-rating>
                        </v-flex>
                      </v-layout>
                    </v-flex>

                    <!-- Cost Rating Row -->
                    <v-flex>
                      <v-layout row>
                        <v-flex xs4 class="left-column">
                          Cost Rating
                        </v-flex>
                        <v-flex xs8 class="right-column">
                          <!-- TODO: add the actual value somewhere here -->
                          <v-rating
                            v-model="venue.modeCostRating"
                            length="4"
                            readonly
                          ></v-rating>
                        </v-flex>
                      </v-layout>
                    </v-flex>

                    <!-- Distance Row -->
                    <v-layout v-if="venue.distance" row>
                      <v-flex xs4 class="left-column">
                        Distance
                      </v-flex>
                      <v-flex xs8 class="right-column">
                        {{ venue.distance }} km
                      </v-flex>
                    </v-layout>

                  </v-layout>
                </v-card-text>
              </v-flex>
            </v-card>
          </v-flex>
          <!-- End of description and category card -->

          <!-- Location and City card -->
          <v-flex xs3 d-flex>
            <v-card>
              <v-layout column justify-space-between fill-height>
                <v-card-title
                  class="title-text primary"
                  primary-title
                >
                  {{ venue.city }}
                </v-card-title>
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
          <!-- End of location and City card -->

        </v-layout>
      </v-card>
      </template>

      <!-- Long Venue Card -->
      <v-card
        elevation="10"
        v-bind:key="venue.venueId"
      >
        <v-layout row>

          <!-- Name and photo card -->
          <v-flex xs3 d-flex>
            <v-card>
              <v-card-title
                class="title-text primary"
                primary-title
              >
                {{ venue.venueName }}
              </v-card-title>
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
          <!-- End of name and photo card -->

          <!-- Description and category card -->
          <v-flex xs6 d-flex>
            <v-card>
              <v-flex d-flex fill-height>
                <v-card-text>
                  <v-layout column justify-space-between fill-height>

                    <!-- Category Row -->
                    <v-layout row>
                      <v-flex xs4 class="left-column button-padding">
                        Category
                      </v-flex>
                      <v-flex xs6 class="right-column">
                        {{ getCategoryName(venue.categoryId) }}
                      </v-flex>
                      <v-flex xs2>
                      </v-flex>
                    </v-layout>
                    <v-layout v-if="showFullCategory" row>

                    </v-layout>

                    <!-- Description Row -->
                    <v-flex>
                      <v-layout row>
                        <v-flex xs4 class="left-column">
                          Description
                        </v-flex>
                        <v-flex xs8 class="right-column">
                          {{ venue.shortDescription }}
                        </v-flex>
                      </v-layout>
                    </v-flex>

                    <!-- Star Rating Row -->
                    <v-flex>
                      <v-layout row>
                        <v-flex xs4 class="left-column">
                          Star Rating
                        </v-flex>
                        <v-flex xs8 class="right-column">
                          <!-- TODO: add the actual value somewhere here -->
                          <v-rating
                            v-model="venue.meanStarRating"
                            length="5"
                            half-increments
                            readonly
                          ></v-rating>
                        </v-flex>
                      </v-layout>
                    </v-flex>

                    <!-- Cost Rating Row -->
                    <v-flex>
                      <v-layout row>
                        <v-flex xs4 class="left-column">
                          Cost Rating
                        </v-flex>
                        <v-flex xs8 class="right-column">
                          <!-- TODO: add the actual value somewhere here -->
                          <v-rating
                            v-model="venue.modeCostRating"
                            length="4"
                            readonly
                          ></v-rating>
                        </v-flex>
                      </v-layout>
                    </v-flex>

                    <!-- Distance Row -->
                    <v-layout v-if="venue.distance" row>
                      <v-flex xs4 class="left-column">
                        Distance
                      </v-flex>
                      <v-spacer align="left" class="right-column">
                        {{ venue.distance }} km
                      </v-spacer>
                      <v-spacer align="right">
                        <v-btn flat color="grey">
                          Show More Details
                        </v-btn>
                      </v-spacer>
                    </v-layout>

                  </v-layout>
                </v-card-text>
              </v-flex>
            </v-card>
          </v-flex>
          <!-- End of description and category card -->

          <!-- Location and City card -->
          <v-flex xs3 d-flex>
            <v-card>
              <v-layout column justify-space-between fill-height>
                <v-card-title
                  class="title-text primary"
                  primary-title
                >
                  {{ venue.city }}
                </v-card-title>
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
          <!-- End of location and City card -->

        </v-layout>
      </v-card>

    </v-dialog>
  </div>
</template>

<script>

  import {endpoint} from "../../../Utilities/endpoint";
  import {requestVenueDetails} from "./VenueCardService";
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

        fullVenue: {
          venueName: "",
          admin: {
            userId: 0,
            username: ""
          },
          category: {
            categoryId: 0,
            categoryName: "",
            categoryDescription: ""
          },
          city: "",
          shortDescription: "",
          longDescription: "",
          dateAdded: "",
          address: "",
          latitude: 0.0,
          longitude: 0.0,
          photos: [
            {
              photoFilename: "",
              photoDescription: "",
              isPrimary: true
            }
          ],
        },

        displayFullVenue: false,

        showFullCategory: false
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
        if (!this.displayFullVenue) {
          try {
            let response = await requestVenueDetails(this.venue.venueId);
            this.fullVenue = response.body;
            this.displayFullVenue = true
          } catch (error) {
            console.log(error);
            // TODO: add custom alert here
            // Venue not found
            // this.$router.go();
          }
        } else {
          this.displayFullVenue = !this.displayFullVenue;
        }

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
    font-size: 23px;
    justify-content: center;
  }

  .venue-card {
    margin-bottom: 20px;
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
