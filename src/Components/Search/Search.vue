<template>
  <div id="search">
    <v-toolbar fixed color="primary" class="page-header" z-index="9999">
      <navigation-menu title="true"></navigation-menu>
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
              <v-select
                label="City"
                hint="Search for a venue by city"
                :items="cities"
                v-model="queries.city"
                :value="queries.city"
                clearable
              ></v-select>
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

            <!-- Category search selector -->
            <v-flex xs4 d-flex class="input-padding">
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

            <v-layout xs4 row wrap>

              <!-- Sort by search selector -->
              <v-flex xs10 d-flex class="input-padding">
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

              <!-- Reversed checkbox -->
              <v-flex xs2 d-flex class="input-padding">
                <v-checkbox
                  label="Reverse"
                  v-model="queries.reverseSort"
                  :value="queries.reverseSort"
                ></v-checkbox>
              </v-flex>
              <!-- End of reversed checkbox -->

            </v-layout>

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
          <v-layout row wrap>
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
          :categories="categories">
        </venue-card>
        <!-- End of Venue Cards -->

      </v-flex>
    </v-layout>

  </div>
</template>

<script>

  import {getCategories, getVenues} from "./SearchService";
  import 'ol/ol.css';
  import UserStorage from "../../DataStorage/UserStorage";
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

        numberOfResults: 0
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
          console.log("here");
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
      }

    },

    mounted: async function () {
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

  @import "../../Resources/StyleSheets/variables";

  .v-card {
    background-color: $lighter-secondary;
  }

  #search {
    background-image: url("../../Resources/Images/background.jpg");
    background-size: cover;
    width: 100%;
    height: 100%;
  }

  .page-header {
    height: 130px;
  }

  .main-container {
    width: 100%;
    padding: 150px 20px 20px;
  }

  .page-title {
    padding: 65px 0 0 130px;
    -webkit-text-fill-color: $lighter-secondary;
    font-size: 50px;
  }

  .logout-button {
    margin: 65px 0 0;
  }

  .search-criteria-card {
    margin-bottom: 20px;
    padding: 20px;
  }

  .input-padding {
    padding-right: 10px;
  }

</style>
