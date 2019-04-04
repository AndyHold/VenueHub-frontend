<template>
  <div>
    <v-toolbar fixed color="primary" class="page-header" z-index="9999">
      <v-toolbar-title class="page-title">Search Venues</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-items class="logout-button">
        <v-btn v-if="isLoggedOn()" color="blue-grey lighten-4" @click="logout" round fab><v-icon color="primary">logout</v-icon></v-btn>
      </v-toolbar-items>
    </v-toolbar>

    <v-layout fluid list-grid class="main-container">
      <v-flex x1>

        <!-- Search Criteria Cards -->
        <v-card
          elevation="10"
          class="search-criteria-card"
          >
          <v-layout row wrap>

            <!-- Title search text field -->
            <v-flex xs4 d-flex class="input-padding">
              <v-text-field
                label="Search"
                hint="Search for a venue by title"
                v-model="queries.q"
                :value="queries.q"
                ></v-text-field>
            </v-flex>
            <!-- End of title search text field -->

            <!-- City search text field -->
            <v-flex xs4 d-flex class="input-padding">
              <v-text-field
                label="City"
                hint="Search for a venue by city"
                v-model="queries.city"
                :value="queries.city"
              ></v-text-field>
            </v-flex>
            <!-- End of city search text field -->

            <!-- Star rating search slider -->
            <v-flex xs4 d-flex>
              <v-layout row wrap>
                <v-flex xs1 d-flex>
                  <v-checkbox
                    v-model="queries.ratings.notUseStarRating"
                    :value="queries.ratings.notUseStarRating"
                    :true-value="false"
                    :false-value="true"
                  ></v-checkbox>
                </v-flex>
                <v-flex xs11 d-flex>
                  <v-slider
                    label="Minimum Star Rating"
                    thumb-label="always"
                    :tick-labels="[1, 2, 3, 4, 5]"
                    min="1"
                    max="5"
                    :disabled="queries.ratings.notUseStarRating"
                    v-model="queries.ratings.minStarRating"
                    :value="queries.ratings.minStarRating"
                  ></v-slider>
                </v-flex>
              </v-layout>
            </v-flex>
            <!-- End of star rating search slider -->

          </v-layout>
          <v-layout row wrap>

            <v-layout xs7 row wrap>

              <!-- Category search selector -->
              <v-flex xs6 d-flex class="input-padding">
                <v-select
                  label="Categories"
                  hint="Search for a venue by category"
                  v-model="queries.categoryId"
                  :value="queries.categoryId"
                  :items="categories"
                  item-value="categoryId"
                  item-text="categoryName"
                  clearable
                ></v-select>
              </v-flex>
              <!-- End of category search selector -->

              <!-- Sort by search selector -->
              <v-flex xs6 d-flex class="input-padding">
                <v-select
                  label="Sort By"
                  hint="How to sort the venues"
                  v-model="queries.sortBy"
                  :value="queries.sortBy"
                  :items="sortableFields"
                  item-value="itemValue"
                  item-text="itemText"
                  clearable
                ></v-select>
              </v-flex>
              <!-- End of sort by search selector -->

            </v-layout>

            <!-- Reversed checkbox -->
            <v-flex xs1 d-flex class="input-padding">
              <v-checkbox
                label="Reverse"
                v-model="queries.reverseSort"
                :value="queries.reverseSort"
              ></v-checkbox>
            </v-flex>
            <!-- End of reversed checkbox -->

            <!-- Cost rating search slider -->
            <v-flex xs4 d-flex>
              <v-layout row wrap>
                <v-flex xs1 d-flex>
                  <v-checkbox
                    v-model="queries.ratings.notUseCostRating"
                    :value="queries.ratings.notUseCostRating"
                    :true-value="false"
                    :false-value="true"
                  ></v-checkbox>
                </v-flex>
                <v-flex xs11 d-flex>
                  <v-slider
                    label="Maximum Cost Rating"
                    thumb-label="always"
                    :tick-labels="[0, 1, 2, 3, 4]"
                    min="0"
                    max="4"
                    :disabled="queries.ratings.notUseCostRating"
                    v-model="queries.ratings.maxCostRating"
                    :value="queries.ratings.maxCostRating"
                  ></v-slider>
                </v-flex>
              </v-layout>
            </v-flex>
            <!-- End of cost rating search slider -->

          </v-layout>
        </v-card>

        <!-- Venue Cards -->
        <v-card
          v-for="venue in venues"
          elevation="10"
          class="venue-card"
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
                <v-card-media>
                  <v-img
                    v-if="venue.primaryPhoto"
                    :src="getVenuePhoto(venue)"
                    aspect-ratio="1"
                    class="primary-image"
                  ></v-img>
                  <v-img
                    v-else
                    src="src/Components/Search/placeholder-image.jpg"
                    aspect-ratio="1"
                    class="primary-image"
                  ></v-img>
                </v-card-media>
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
                    <v-card-media d-flex fill-height>
                      <div
                        :id="getMapPanelIdFromVenueId(venue.venueId)"
                        class="map-panel"
                      ></div>
                    </v-card-media>
                  </v-flex>
                </v-layout>
              </v-card>
            </v-flex>
            <!-- End of location and City card -->

          </v-layout>
        </v-card>
        <!-- End of Venue Cards -->

      </v-flex>
    </v-layout>

  </div>
</template>

<script>
  import {getCategories, getVenues} from "./SearchService";
  import 'ol/ol.css';
  import {Map, View} from 'ol';
  import OSM from "ol/source/OSM";
  import TileLayer from 'ol/layer/Tile';
  import {fromLonLat} from "ol/proj";
  import {endpoint} from "../../Utilities/endpoint";
  import UserStorage from "../../DataStorage/userStorage";
  import {sendLogoutRequest} from "../../Utilities/loginPortal";

  export default {

    name: "Search",

    data () {
      return {
        queries: {
          startIndex: null,
          count: null,
          city: null,
          q: null,
          categoryId: null,
          ratings: {
            minStarRating: 1,
            maxCostRating: 4,
            notUseStarRating: true,
            notUseCostRating: true
          },
          sortBy: null,
          reverseSort: false,
          myLatitude: null,
          myLongitude: null
        },
        sortableFields: [
          {
            itemValue: "STAR_RATING",
            itemText: "Star Rating",
          },
          {
            itemValue: "COST_RATING",
            itemText: "Cost Rating",
          }
        ],
        venues: [],
        categories: []
      }
    },

  computed: {
      myLatitude() {
        return this.queries.myLatitude;
      }
  },

    watch: {

      myLatitude() {
        this.onLatitudeChanged();
      },

      'queries' : {
        handler: 'onQueriesChanged',
        immediate: true,
        deep: true
      },

    },

    methods: {
      getVenuePhoto: function (venue) {
        return endpoint(`/venues/${venue.venueId}/photos/${venue.primaryPhoto}`);
      },
      getCategoryName: function (categoryId) {
        for (let index in this.categories) {
          if (categoryId === this.categories[index].categoryId) {
            return this.categories[index].categoryName;
          }
        }
      },
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
      onQueriesChanged: async function () {
        this.venues = await getVenues(this.queries);
      },
      getLocation: function () {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition((position) => {
            this.queries.myLatitude = position.coords.latitude;
            this.queries.myLongitude = position.coords.longitude;
          });
        } else {
          this.queries.myLatitude = null;
          this.queries.myLongitude = null;
        }
      },
      onLatitudeChanged: function () {
        if (this.queries.myLatitude && !this.sortContainsDistance()) {
          this.sortableFields.push(
            {
              itemValue: "DISTANCE",
              itemText: "Distance",
            }
          );
        } else if (!this.queries.myLatitude && this.sortContainsDistance()) {
          this.sortableFields.pop();
        }
      },
      sortContainsDistance: function () {
        for (let field in this.sortableFields) {
          if (this.sortableFields.hasOwnProperty(field) && field.hasOwnProperty("itemValue") && field.itemValue === "DISTANCE") {
            return true;
          }
        }
        return false;
      },
      isLoggedOn: function () {
        return UserStorage.methods.isLoggedIn();
      },
      logout: async function () {
        try {
          await sendLogoutRequest();
          UserStorage.methods.logout();
          localStorage.removeItem("userId");
          localStorage.removeItem("authToken");
        } catch (error) {
          UserStorage.methods.logout();
          localStorage.removeItem("userId");
          localStorage.removeItem("authToken");
        }
        this.$router.go(0);
      }
    },

    mounted: async function () {
      this.categories = await getCategories();
      this.venues = await getVenues(this.queries);
      this.getLocation();

      // Create each map
      for (let index in this.venues) {
        this.makeMap(this.venues[index]);
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../Styles/_variables.scss";

  .page-header {
    height: 130px;
  }

  .main-container {
    width: 100%;
    padding: 150px 20px 20px;
  }

  .title-text {
    color: $lighter-secondary;
    font-size: 23px;
    justify-content: center;
  }

  .page-title {
    padding: 65px 0 0 130px;
    -webkit-text-fill-color: $lighter-secondary;
    font-size: 50px;
  }

  .logout-button {
    margin: 65px 0 0;
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

  .venue-card {
    margin-bottom: 20px;
  }

  .search-criteria-card {
    margin-bottom: 20px;
    padding: 20px;
  }

  .input-padding {
    padding-right: 10px;
  }

</style>
