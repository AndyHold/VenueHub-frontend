<template>
  <div id="search" class="background-element">
    <v-toolbar fixed color="primary" class="page-header" z-index="9999">
      <navigation-menu title="true"></navigation-menu>
      <v-toolbar-title class="page-title">Search Venues</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-items class="logout-button">
        <v-btn v-if="isLoggedIn" color="blue-grey lighten-4" @click="logout" round fab><v-icon color="primary">logout</v-icon></v-btn>
      </v-toolbar-items>
    </v-toolbar>

    <v-layout fluid list-grid class="main-container">
      <v-flex sm12 md12 lg12>

        <!-- Search Criteria Card -->
        <v-card
          elevation="10"
          class="search-criteria-card"
          >

          <v-flex sm12 md12 lg12 row style="margin: 0 2em">
            <v-flex column wrap sm12 md6 lg4>

              <!-- Title search text field -->
              <v-flex d-flex class="input-padding">
                <v-text-field
                  label="Search"
                  hint="Search for a venue by title"
                  v-model="queries.q"
                  :value="queries.q"
                  ></v-text-field>
              </v-flex>

              <!-- Category search selector -->
              <v-flex d-flex class="input-padding">
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

            </v-flex>

            <v-flex column wrap sm12 md6 lg4>

              <!-- City search text field -->
              <v-flex d-flex class="input-padding">
                <v-select
                  label="City"
                  hint="Search for a venue by city"
                  :items="cities"
                  v-model="queries.city"
                  :value="queries.city"
                  clearable
                ></v-select>
              </v-flex>

              <!-- Sort By and Reversed -->
              <v-layout row wrap class="input-padding">

                <!-- Sort by search selector -->
                <v-flex sm12 md8 lg9 d-flex class="input-padding">
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

                <!-- Reversed checkbox -->
                <v-flex sm12 md4 lg3 d-flex class="input-padding">
                  <v-checkbox
                    class="v-checkbox"
                    label="Reverse"
                    v-model="queries.reverseSort"
                    :value="queries.reverseSort"
                  ></v-checkbox>
                </v-flex>

              </v-layout>

            </v-flex>

            <v-flex column wrap sm12 md6 lg4>

              <!-- Star rating search slider -->
              <v-flex d-flex>
                <v-layout row wrap>
                  <v-flex sm1 md1 lg1 d-flex>
                    <v-spacer align="right">
                      <v-checkbox
                        class="v-checkbox"
                        v-model="queries.ratings.notUseStarRating"
                        :value="queries.ratings.notUseStarRating"
                        :true-value="false"
                        :false-value="true"
                      ></v-checkbox>
                    </v-spacer>
                  </v-flex>
                  <v-flex sm11 md11 lg11 d-flex>
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

              <!-- Cost rating search slider -->
              <v-flex d-flex>
                <v-layout row wrap>
                  <v-flex xs1 d-flex>
                    <v-checkbox
                      class="v-checkbox"
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

            </v-flex>
          </v-flex>

          <v-layout x1 row wrap>
            <v-spacer></v-spacer>
            <v-btn flat :disabled="canMove(0)" v-on:click="startIndex -= 10">
              <v-icon>arrow_back</v-icon>
            </v-btn>
            <v-btn flat v-if="numberOfResults >= 0" v-on:click="movePage(0)" :disabled="isCurrentPage(0)">
              <b>
                {{ getPageRange(0) }}
              </b>
            </v-btn>
            <v-btn flat v-if="numberOfResults > 10" v-on:click="movePage(1)" :disabled="isCurrentPage(1)">
              <b>
                {{ getPageRange(1) }}
              </b>
            </v-btn>
            <v-btn flat v-if="numberOfResults > 20" v-on:click="movePage(2)" :disabled="isCurrentPage(2)">
              <b>
                {{ getPageRange(2) }}
              </b>
            </v-btn>
            <v-btn flat v-if="numberOfResults > 30" v-on:click="movePage(3)" :disabled="isCurrentPage(3)">
              <b>
                {{ getPageRange(3) }}
              </b>
            </v-btn>
            <v-btn flat v-if="numberOfResults > 40" v-on:click="movePage(4)" :disabled="isCurrentPage(4)">
              <b>
                {{ getPageRange(4) }}
              </b>
            </v-btn>
            <v-btn flat :disabled="canMove(1)" v-on:click="startIndex += 10">
              <v-icon>arrow_forward</v-icon>
            </v-btn>
            <v-spacer></v-spacer>
          </v-layout>
        </v-card>

        <!-- Venue Cards -->
        <venue-card
          v-for="venue in venues"
          v-bind:key="venue.venueId"
          :venue="venue"
          :categories="categories"
        >
        </venue-card>
        <!-- End of Venue Cards -->

      </v-flex>
    </v-layout>

    <v-snackbar
      v-model="snackBar.showSnackbar"
      :bottom="true"
      :right="true"
      :timeout="3000"
    >
      {{ snackBar.text }}
      <v-btn
        :color="snackBar.color"
        flat
        @click="snackBar.showSnackbar = false"
      >Dismiss</v-btn>
    </v-snackbar>

  </div>
</template>

<script>

  import {getCategories, getVenues} from "./SearchService";
  import 'ol/ol.css';
  import {sendLogoutRequest} from "../../Utilities/loginPortal";
  import NavigationMenu from "../App/NavigationMenu/NavigationMenu";
  import VenueCard from "./VenueCard/VenueCard";

  export default {

    name: "Search",

    components: {
      NavigationMenu,
      VenueCard
    },

    data () {
      return {
        queries: {
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
        startIndex: 0,
        count: 10,
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
        categories: [],
        cities: [],
        numberOfResults: 0,
        isLoggedIn: false,
        snackBar: {
          showSnackbar: false,
          text: "",
          color: ""
        }
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

      'queries': {
        handler: 'onQueriesChanged',
        immediate: true,
        deep: true
      },
      'startIndex': {
        handler: 'onStartIndexChanged',
        immediate: true
      }

    },

    methods: {

      displayMessage: function(snackBar) {
        this.snackBar = snackBar;
      },

      onQueriesChanged: async function () {
        this.startIndex = 0;
        this.getVenuesWithQueries();
      },

      onStartIndexChanged: async function () {
        this.getVenuesWithQueries();
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

      logout: async function () {
        try {
          await sendLogoutRequest();
          localStorage.removeItem("userId");
          localStorage.removeItem("authToken");
          this.isLoggedIn = false;
        } catch (error) {
          localStorage.removeItem("userId");
          localStorage.removeItem("authToken");
          this.isLoggedIn = false;
        }
      },

      getPageRange: function(btn) {
        let pageRange = "";
        if (this.numberOfResults === 0) {
          return "0 RESULTS FOUND";
        } else if (this.startIndex <= 20) {
          pageRange += (btn * 10 + 1) + " - ";
          if (this.numberOfResults > ((btn + 1) * 10)) {
            return pageRange + ((btn + 1) * 10);
          } else {
            return pageRange + this.numberOfResults;
          }
        } else if (this.numberOfResults - this.startIndex > 20) {
          pageRange += (this.startIndex + (btn - 2) * 10 + 1) + " - ";
          if (this.numberOfResults >= this.startIndex + (btn - 1) * 10 + 1) {
            return pageRange + (this.startIndex + (btn - 1) * 10);
          } else {
            return pageRange + this.numberOfResults;
          }
        } else if (this.numberOfResults - this.startIndex <= 10 && this.numberOfResults <= 40) {
          pageRange += (this.startIndex + (btn - 3) * 10 + 1) + " - ";
          if (this.numberOfResults >= this.startIndex + (btn - 3) * 10 + 1) {
            return pageRange + (this.startIndex + (btn - 2) * 10);
          } else {
            return pageRange + this.numberOfResults;
          }
        } else if (this.numberOfResults - this.startIndex <= 10 && this.numberOfResults <= 50) {
          pageRange += (this.startIndex + (btn - 4) * 10 + 1) + " - ";
          if (this.numberOfResults >= this.startIndex + (btn - 3) * 10 + 1) {
            return pageRange + (this.startIndex + (btn - 3) * 10);
          } else {
            return pageRange + this.numberOfResults;
          }
        } else if (this.numberOfResults - this.startIndex <= 20 && this.numberOfResults <= 50) {
          pageRange += (this.startIndex + (btn - 3) * 10 + 1) + " - ";
          if (this.numberOfResults >= this.startIndex + (btn - 2) * 10 + 1) {
            return pageRange + (this.startIndex + (btn - 2) * 10);
          } else {
            return pageRange + this.numberOfResults;
          }
        } else if (this.numberOfResults - this.startIndex > 10) {
          pageRange += (this.startIndex + (btn - 3) * 10 + 1) + " - ";
          if (this.numberOfResults >= this.startIndex + (btn - 2) * 10 + 1) {
            return pageRange + (this.startIndex + (btn - 2) * 10);
          } else {
            return pageRange + this.numberOfResults;
          }
        } else if (this.numberOfResults - this.startIndex > 0) {
          pageRange += (this.startIndex + (btn - 4) * 10 + 1) + " - ";
          if (this.numberOfResults >= this.startIndex + (btn - 3) * 10 + 1) {
            return pageRange + (this.startIndex + (btn - 3) * 10);
          } else {
            return pageRange + this.numberOfResults;
          }
        }
      },

      canMove: function(btn) {
        switch(btn) {
          case 0:
            return !(this.startIndex > 9);
          case 1:
            return !(this.numberOfResults - this.startIndex > 10);
        }
      },

      movePage: function(btn) {
        if (this.startIndex <= 20) {
          this.startIndex = btn * 10;
        } else if (this.startIndex > 20 && this.numberOfResults - this.startIndex > 20.0) {
          this.startIndex += (btn - 2.0) * 10;
        } else if (this.startIndex > 20 && this.numberOfResults - this.startIndex <= 10.0) {
          this.startIndex += (btn - 4.0) * 10;
        } else if (this.startIndex > 20 && this.numberOfResults - this.startIndex <= 20.0) {
          this.startIndex += (btn - 3.0) * 10;
        }
      },

      isCurrentPage: function(btn) {
        switch(btn) {
          case 0:
            return (this.startIndex === 0);
          case 1:
            return (this.startIndex === 10);
          case 2:
            return (this.startIndex > 10 && (this.numberOfResults - this.startIndex > 20 || (this.numberOfResults <= 50 && this.startIndex === 20)));
          case 3:
            return (this.startIndex > 20 && ((this.numberOfResults - this.startIndex > 10 && this.numberOfResults - this.startIndex < 20) || this.numberOfResults <= 40));
          case 4:
            return (this.startIndex > 20 && this.numberOfResults - this.startIndex > 0 && this.numberOfResults - this.startIndex <= 10);
        }
        if (this.startIndex <= 20) {

        } else if (this.startIndex > 20 && this.numberOfResults - this.startIndex > 20.0) {

        } else if (this.startIndex > 20 && this.numberOfResults - this.startIndex <= 10.0) {

        } else if (this.startIndex > 20 && this.numberOfResults - this.startIndex <= 20.0) {

        }
      },

      getVenuesWithQueries: async function () {
        try {
          let results = await getVenues(this.queries, null, null);
          this.numberOfResults = results.length;
          this.venues = await getVenues(this.queries, this.startIndex, this.count);
          for (let i = 0; i < this.venues.length; i++) {
            if (this.venues[i].meanStarRating === null) {
              this.venues[i].meanStarRating = 3;
            }
            if (this.venues[i].modeCostRating === null) {
              this.venues[i].modeCostRating = 0;
            }
          }
        } catch (error) {
          this.displayMessage({
            showSnackbar: true,
            text: "Error: " + error.message,
            color: "red"
          })
        }
      }

    },

    mounted: async function () {
      this.isLoggedIn = localStorage.getItem("userId") !== null;
      this.categories = await getCategories();
      await this.getVenuesWithQueries();
      this.getLocation();

      // Get all available cities (Note: I would change this if I had designed the back end)
      for (let i = 0; i < this.venues.length; i++) {
        if (this.cities.findIndex((value, index, object) => value === object) === -1) {
          this.cities.push(this.venues[i].city);
        }
      }
    }
  }
</script>

<style lang="scss" scoped>

  @import "../../Resources/StyleSheets/commonStyles";

  .background-element {
    background-image: url("../../Resources/Images/background.jpg");
  }

  .search-criteria-card {
    margin-bottom: 20px;
    padding: 20px;
  }

  .input-padding {
    padding: 0 1em;
  }

  .v-checkbox {
    padding: 0 1em;
  }

</style>
