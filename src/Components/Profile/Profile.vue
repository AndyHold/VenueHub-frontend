<template>
    <div id="profile">
      <!-- Title Bar -->
      <v-toolbar fixed color="primary" class="page-header" z-index="9999">
        <navigation-menu title="true"></navigation-menu>
        <v-toolbar-title
          v-if="owner"
          class="page-title"
        >
          Welcome {{ user.givenName }}
        </v-toolbar-title>
        <v-toolbar-title
          v-else
          class="page-title"
        >
          {{ user.givenName }} {{ user.familyName }}
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-toolbar-items class="logout-button">
          <v-btn v-if="isLoggedIn" color="blue-grey lighten-4" @click="logout" round fab><v-icon color="primary">logout</v-icon></v-btn>
        </v-toolbar-items>
      </v-toolbar>

      <!-- Photo and Name Card -->
      <v-layout fluid justify-center list-grid class="main-container">
        <v-flex xs4>
          <profile-info-card
            :user="user"
            :owner="owner"
          ></profile-info-card>
        </v-flex>
      </v-layout>

      <!-- Venues -->
      <v-layout
        fluid
        jusify-center
        list-grid
        class="venues-layout">

        <v-flex xs12>
          <v-card
            elevation="10"
          >

            <v-card-title
              primary-title
              color="primary darken-1"
              class="headline primary title-text"
            >
              Venues
            </v-card-title>

            <v-card-actions>
              <v-spacer align="right">

                <add-venue-dialog
                  v-if="owner"
                  :categories="categories"
                ></add-venue-dialog>
              </v-spacer>
            </v-card-actions>

            <v-card-text>

              <v-spacer
                v-if="!this.venues.length"
                align="center"
              >
                <h4 v-if="owner" class="font-weight-regular">
                  You have no venues
                </h4>
                <h4 v-else class="font-weight-regular">
                  This user has no venues
                </h4>
              </v-spacer>

              <!-- Venue Cards -->
              <venue-card
                v-for="venue in venues"
                v-bind:key="venue.venueId"
                :venue="venue"
                :categories="categories">
              </venue-card>

            </v-card-text>

          </v-card>
        </v-flex>

      </v-layout>

      <!-- Reviews -->
      <v-layout fluid jusify-center list-grid class="venues-layout">

        <v-flex xs12>
          <v-card
            elevation="10"
            class="card-background reviews-card"
          >

            <v-card-title
              primary-title
              color="primary darken-1"
              class="headline primary title-text"
            >
              Reviews
            </v-card-title>

            <v-card-text>

              <!-- No Reviews Label -->
              <v-spacer
                v-if="!this.reviews.length || !isLoggedIn"
                align="center"
              >
                <h4 v-if="owner" class="font-weight-regular">
                  You have no reviews
                </h4>
                <h4 v-else-if="isLoggedIn" class="font-weight-regular">
                  This user has no reviews
                </h4>
                <h4 v-else class="font-weight-regular">
                  Please log in or sign up to see user reviews
                </h4>
              </v-spacer>

              <!-- Reviews -->
              <review-card
                v-if="isLoggedIn"
                v-for="review in reviews"
                v-bind:key="review.venue.venueId"
                :review="review"
              ></review-card>

            </v-card-text>
          </v-card>
        </v-flex>

      </v-layout>

    </div>
</template>

<script>
  import UserStorage from "../../DataStorage/UserStorage";
  import {sendLogoutRequest} from "../../Utilities/loginPortal";
  import {endpoint} from "../../Utilities/endpoint";
  import {
    getUserDetails, getUserReviews,
    requestCategories, requestUserVenues
  } from "./ProfileService";
  import NavigationMenu from "../App/NavigationMenu/NavigationMenu";
  import VenueCard from "../Search/VenueCard/VenueCard";
  import ReviewCard from "./ReviewCard/ReviewCard";
  import ProfileInfoCard from "./ProfileInfoCard/ProfileInfoCard";
  import AddVenueDialog from "./AddVenueDialog/AddVenueDialog";

  export default {
    name: "Profile",

    components: {
      AddVenueDialog,
      ProfileInfoCard,
      NavigationMenu,
      VenueCard,
      ReviewCard,
    },

    data () {
      return {
        user: {
          userId: null,
          username: null,
          email: null,
          givenName: null,
          familyName: null
        },
        venues: [],
        categories: [],
        reviews: [],
        owner: false,
        isLoggedIn: false
      }
    },

    methods: {

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

      getUser: async function () {
        try {
          let response = await getUserDetails(this.user.userId);
          this.user.username = response.body.username;
          this.user.givenName = response.body.givenName;
          this.user.familyName = response.body.familyName;
          if (response.body.hasOwnProperty("email")) {
            this.owner = true;
            this.user.email = response.body.email;
          }
        } catch (error) {
          // TODO: implement custom pop up here
          // User not found
          if (this.user.userId === parseInt(UserStorage.data.userId) ||
            this.user.userId === parseInt(localStorage.getItem("userId"))) {
            localStorage.removeItem("authToken");
            localStorage.removeItem("userId");
            UserStorage.methods.logout();
          }
          this.$router.push('/');
        }
      },

      getUserReviews: async function () {
        try {
          let response = await getUserReviews(this.user.userId);
          this.reviews = this.getReviewVenuePhotos(response.body);
        } catch (error) {
          if (error.status === 401) {
            // TODO implement custom pop up here
            // Unauthorized, please log in
          } else if (error.status === 404) {
            // TODO implement custom pop up here
            // User Not Found
          }
        }
      },

      getReviewVenuePhotos: function (reviews) {
        for (let i = 0; i < reviews.length; i++) {
          let venueId = reviews[i].venue.venueId;
          let primaryPhoto = reviews[i].venue.primaryPhoto;
          if (primaryPhoto) {
            reviews[i].venue.primaryPhoto = endpoint(`/venues/${venueId}/photos/${primaryPhoto}`);
          }
        }
        return reviews;
      }
    },

    mounted: async function () {
      this.user.userId = parseInt(this.$route.params.userId);
      this.isLoggedIn = localStorage.getItem("userId") !== null;
      this.getUser();
      this.venues = await requestUserVenues(this.user.userId);
      this.categories = await requestCategories();
      if (this.isLoggedIn) {
        this.getUserReviews();
      }
    }
  }
</script>

<style lang="scss" scoped>

  @import "../../Resources/StyleSheets/variables";

  .v-card {
    background-color: $lighter-secondary;
  }

  #profile {
    background-image: url("../../Resources/Images/background.jpg");
    background-size: cover;
    background-attachment: fixed;
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

  .venues-card {
    margin: 20px;
  }

  .reviews-card {
    margin: 20px;
  }

</style>
