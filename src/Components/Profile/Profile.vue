<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
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

                <!-- Add Venue Dialog -->
                <v-dialog
                  v-if="owner"
                  v-model="addVenueDialog"
                  persistent
                  width="800"
                >

                  <template v-slot:activator="{ on }">
                    <v-btn
                      flat
                      color="primary darken-1"
                      v-on="on"
                    >Add Venue</v-btn>
                  </template>

                  <!-- Add Venue Card -->
                  <v-card>
                    <v-card-title
                      class="headline primary title-text"
                      primary-title
                    >
                      Venue Details
                    </v-card-title>

                    <v-card-text>
                      <v-container grid-list-md>
                        <v-layout wrap>

                          <v-layout row>
                            <!-- Venue Name -->
                            <v-flex xs6>
                              <v-text-field
                                label="Venue Name*"
                                hint="Enter the name of your venue"
                                :value="newVenue.venueName"
                                v-model="newVenue.venueName"
                                @focus="venueNameErrors = []"
                                @blur="validateVenueName"
                                :error-messages="venueNameErrors"
                                v-on:keyup="validateVenueName"
                                v-on:keyup.enter="addVenue"
                              ></v-text-field>
                            </v-flex>

                            <!-- Venue Category -->
                            <v-flex xs6>
                              <v-select
                                label="Category*"
                                hint="Choose a category"
                                :value="newVenue.categoryId"
                                v-model="newVenue.categoryId"
                                :items="categories"
                                item-value="categoryId"
                                item-text="categoryName"
                                @focus="venueCategoryErrors = []"
                                @blur="validateCategory"
                                :error-messages="venueCategoryErrors"
                                v-on:keyup="validateCategory"
                                v-on:keyup.enter="addVenue"
                              ></v-select>
                            </v-flex>
                          </v-layout>

                          <!-- Flat & Street -->
                          <v-layout row>
                            <!-- Address Flat -->
                            <v-flex xs6>
                              <v-text-field
                                label="Flat number"
                                hint="The flat number if applicable"
                                :value="address.flat"
                                v-model="address.flat"
                                @focus="venueAddressErrors = []"
                                @blur="validateAddress"
                                :error-messages="venueAddressErrors"
                                v-on:keyup="validateAddress"
                                v-on:keyup.enter="addVenue"
                              ></v-text-field>
                            </v-flex>

                            <!-- Address Street -->
                            <v-flex xs6>
                              <v-text-field
                                label="Street name and number"
                                hint="The street name and number of the venue"
                                :value="address.street"
                                v-model="address.street"
                                @focus="venueStreetErrors = []"
                                @blur="validateStreetAddress"
                                :error-messages="venueStreetErrors"
                                v-on:keyup="validateStreetAddress"
                                v-on:keyup.enter="addVenue"
                              ></v-text-field>
                            </v-flex>
                          </v-layout>

                          <!-- Suburb, City & Post Code -->
                          <v-layout row>
                            <!-- Venue Suburb -->
                            <v-flex xs5>
                              <v-text-field
                                label="Suburb"
                                hint="Enter the suburb your venue is located in"
                                :value="address.suburb"
                                v-model="address.suburb"
                                @focus="venueAddressErrors = []"
                                @blur="validateAddress"
                                :error-messages="venueAddressErrors"
                                v-on:keyup="validateAddress"
                                v-on:keyup.enter="addVenue"
                              ></v-text-field>
                            </v-flex>

                            <!-- Venue City -->
                            <v-flex xs5>
                              <v-text-field
                                label="Venue City*"
                                hint="Enter the city of your venue"
                                :value="newVenue.city"
                                v-model="newVenue.city"
                                @focus="venueCityErrors = []"
                                @blur="validateVenueCity"
                                :error-messages="venueCityErrors"
                                v-on:keyup="validateVenueCity"
                                v-on:keyup.enter="addVenue"
                              ></v-text-field>
                            </v-flex>

                            <!-- Venue Post Code -->
                            <v-flex xs2>
                              <v-text-field
                                label="Post Code"
                                hint="Enter the post code of your venue"
                                :value="address.postCode"
                                v-model="address.postCode"
                                @focus="venueAddressErrors = []"
                                @blur="validateAddress"
                                :error-messages="venueAddressErrors"
                                v-on:keyup="validateAddress"
                                v-on:keyup.enter="addVenue"
                              ></v-text-field>
                            </v-flex>
                          </v-layout>

                          <!-- Region & Country -->
                          <v-layout row>
                            <!-- Venue Region -->
                            <v-flex xs6>
                              <v-text-field
                                label="State/Province"
                                hint="Enter the State or Province your venue is located in"
                                :value="address.region"
                                v-model="address.region"
                                @focus="venueAddressErrors = []"
                                @blur="validateAddress"
                                :error-messages="venueAddressErrors"
                                v-on:keyup="validateAddress"
                                v-on:keyup.enter="addVenue"
                              ></v-text-field>
                            </v-flex>

                            <!-- Country -->
                            <v-flex xs6>
                              <v-text-field
                                label="Country"
                                hint="Enter the country your venue is located in"
                                :value="address.country"
                                v-model="address.country"
                                @focus="venueCountryErrors = []"
                                @blur="validateCountryAddress"
                                :error-messages="venueCountryErrors"
                                v-on:keyup="validateCountryAddress"
                                v-on:keyup.enter="addVenue"
                              ></v-text-field>
                            </v-flex>
                          </v-layout>

                          <!-- Short Description -->
                          <v-flex xs12>
                            <v-text-field
                              label="Short Description"
                              hint="Enter a short description to be displayed in the search"
                              :value="newVenue.shortDescription"
                              v-model="newVenue.shortDescription"
                              @focus="venueShortDescriptionErrors = []"
                              @blur="validateShortDescription"
                              :error-messages="venueShortDescriptionErrors"
                              v-on:keyup="validateShortDescription"
                            ></v-text-field>
                          </v-flex>

                          <!-- Long Description -->
                          <v-flex xs12>
                            <v-textarea
                              auto-grow
                              label="Long Description"
                              hint="Long description displayed after the short description when requested"
                              :value="newVenue.longDescription"
                              v-model="newVenue.longDescription"
                              @focus="venueLongDescriptionErrors = []"
                              @blur="validateLongDescription"
                              :error-messages="venueLongDescriptionErrors"
                              v-on:keyup="validateLongDescription"
                            ></v-textarea>
                          </v-flex>

                          <!-- Position -->
                          <v-layout row wrap>
                            <v-flex xs4>
                              <v-text-field
                                label="Latitude*"
                                hint="Enter the latitude of the venue"
                                :value="newVenue.latitude"
                                v-model="newVenue.latitude"
                                @focus="venuePositionErrors = []"
                                @blur="validatePosition"
                                :error-messages="venuePositionErrors"
                                v-on:keyup="validatePosition"
                                v-on:keyup.enter="addVenue"
                              ></v-text-field>
                            </v-flex>
                            <v-flex xs4>
                              <v-text-field
                                label="Longitude*"
                                hint="Enter the longitude of the venue"
                                :value="newVenue.longitude"
                                v-model="newVenue.longitude"
                                @focus="venuePositionErrors = []"
                                @blur="validatePosition"
                                :error-messages="venuePositionErrors"
                                v-on:keyup="validatePosition"
                                v-on:keyup.enter="addVenue"
                              ></v-text-field>
                            </v-flex>
                            <v-flex xs4>
                              <v-spacer align="center">
                                <v-btn
                                  flat
                                  color="grey"
                                  v-on:click="getPosition"
                                >Use My Location</v-btn>
                              </v-spacer>
                            </v-flex>
                          </v-layout>

                          <v-flex xs12>
                            <p class="warning-header">required fields marked with *</p>
                          </v-flex>

                        </v-layout>
                      </v-container>
                    </v-card-text>

                    <v-card-actions>
                      <v-spacer row align="right">
                        <v-btn flat color="error lighten-1" v-on:click="cancelAdd">Cancel</v-btn>
                        <v-btn flat color="success lighten-1" v-on:click="addVenue">Submit</v-btn>
                      </v-spacer>
                    </v-card-actions>
                  </v-card>

                </v-dialog>
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
    requestCategories, requestUserVenues,
    sendNewVenue
  } from "./ProfileService";
  import NavigationMenu from "../App/NavigationMenu/NavigationMenu";
  import VenueCard from "../Search/VenueCard/VenueCard";
  import ReviewCard from "./ReviewCard/ReviewCard";
  import ProfileInfoCard from "./ProfileInfoCard/ProfileInfoCard";

  export default {
    name: "Profile",

    components: {
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
        isLoggedIn: false,
        addVenueDialog: false,
        venueNameErrors: [],
        validVenueName: false,
        venueCategoryErrors: [],
        validVenueCategory: false,
        venueAddressErrors: [],
        validVenueAddress: false,
        venueCityErrors: [],
        validVenueCity: false,
        venueShortDescriptionErrors: [],
        validVenueShortDescription: false,
        venueLongDescriptionErrors: [],
        validVenueLongDescription: false,
        venuePositionErrors: [],
        validVenuePosition: false,
        venueCountryErrors: [],
        validVenueCountry: false,
        venueStreetErrors: [],
        validVenueStreet: false,
        hasValidVenueInput: false,
        newVenue: {
          venueName: "",
          categoryId: "",
          city: "",
          shortDescription: "",
          longDescription: "",
          address: "",
          latitude: 0,
          longitude: 0
        },
        address: {
          flat: "",
          street: "",
          suburb: "",
          city: "",
          region: "",
          postCode: "",
          country: ""
        }
      }
    },

    computed: {
      city: function () {
        return this.newVenue.city;
      }
    },

    watch: {
      "address": {
        handler: "onAddressChanged",
        deep: true,
        immediate: true
      },
      "city": {
        handler: "onCityChanged",
        immediate: true
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
      },

      setNewVenue: function () {
        this.newVenue = {
          venueName: "",
          categoryId: "",
          shortDescription: "",
          longDescription: "",
          address: "",
          latitude: 0,
          longitude: 0
        }
      },

      validateVenueName: function () {
        if (this.newVenue.venueName !== "") {
          this.venueNameErrors = [];
          this.validVenueName = true;
        } else if (this.newVenue.city.length > 64) {
          this.venueNameErrors.push("City name is too long. Character limit is 64, you have " + this.newVenue.city.length);
          this.validVenueName = false;
        } else {
          this.venueNameErrors.push("City is required");
          this.validVenueName = false;
        }
      },

      validateCategory: function () {
        if (this.newVenue.categoryId !== "") {
          this.venueCategoryErrors = [];
          this.validVenueCategory = true;
        } else {
          this.venueCategoryErrors.push("Category is required");
          this.validVenueCategory = false;
        }
      },

      validateVenueCity: function () {
        if (this.newVenue.city !== "") {
          this.venueCityErrors = [];
          this.validVenueCity = true;
        } else if (this.newVenue.city.length > 128) {
          this.venueCityErrors.push("City name is too long. Character limit is 128, you have " + this.newVenue.city.length);
          this.validVenueCity = false;
        } else {
          this.venueCityErrors.push("City is required");
          this.validVenueCity = false;
        }
      },

      validateShortDescription: function () {
        this.venueShortDescriptionErrors = [];
        if (this.newVenue.shortDescription.length === 0) {
          this.venueShortDescriptionErrors.push("Short Description is required");
          this.validVenueShortDescription = false;
        } else if (!/^[a-z0-9 ,+=*/"':;.{}()%$&#@!?\n]+$/i.test(this.newVenue.shortDescription)) {
          this.venueShortDescriptionErrors.push("Short Description uses invalid characters, please rephrase using only letter, numbers or the following: ,.+='\"(){}$%&#@!?");
          this.validVenueShortDescription = false;
        } else if (this.newVenue.shortDescription.length > 128) {
          this.venueShortDescriptionErrors.push("Short Description is too long. Only 125 characters allowed, you have " + this.newVenue.shortDescription.length);
          this.validVenueShortDescription = false;
        } else {
          this.validVenueShortDescription = true;
        }
      },

      validateLongDescription: function () {
        this.venueLongDescriptionErrors = [];
        if (this.newVenue.longDescription.length === 0) {
          this.venueLongDescriptionErrors.push("Long Description is required");
          this.validVenueLongDescription = false;
        } else if (!/^[a-z0-9 ,+=*/"':;.{}()%$&#@!?\n\t]*$/i.test(this.newVenue.longDescription)) {
          this.venueLongDescriptionErrors.push("Long Description uses invalid characters, please rephrase using only letter, numbers or the following: ,.+='\"(){}$%&#@!?");
          this.validVenueLongDescription = false;
        } else if (this.newVenue.longDescription.length > 2048) {
          this.venueLongDescriptionErrors.push("Long Description is too long. Only 2048 characters allowed, you have " + this.newVenue.longDescription.length);
          this.validVenueLongDescription = false;
        } else {
          this.validVenueLongDescription = true;
        }
      },

      validateStreetAddress: function () {
        if (this.address.street.length === 0) {
          this.venueStreetErrors.push("Street name and number are required");
          this.validVenueStreet = false;
        } else {
          this.venueStreetErrors = [];
          this.validVenueStreet = true;
        }
      },

      validateCountryAddress: function () {
        if (this.address.country.length === 0) {
          this.venueCountryErrors.push("Country is required");
          this.validVenueCountry = false;
        } else {
          this.venueCountryErrors = [];
          this.validVenueCountry = true;
        }
      },

      validateAddress: function () {
        this.venueAddressErrors = [];
        if (this.newVenue.address.length === 0) {
          this.venueAddressErrors.push("Address is required.");
          this.venueCountryErrors.push("Country is required.");
          this.venueCityErrors.push("City is required.");
          this.venueStreetErrors.push("Street name and number are required.");
          this.validVenueAddress = false;
        } else if (!/^[a-z0-9, ]+$/i.test(this.newVenue.address)) {
          this.venueAddressErrors.push("Address contains invalid characters, only letters, numbers and comma's are allowed.");
          this.venueCountryErrors.push("Address contains invalid characters, only letters, numbers and comma's are allowed.");
          this.venueStreetErrors.push("Address contains invalid characters, only letters, numbers and comma's are allowed.");
          this.validVenueAddress = false;
        } else if (this.newVenue.address.length > 256) {
          this.venueAddressErrors.push("Address is too long. Only 256 characters allowed, you have " + this.newVenue.address.length);
          this.venueCountryErrors.push("Address is too long. Only 256 characters allowed, you have " + this.newVenue.address.length);
          this.venueStreetErrors.push("Address is too long. Only 256 characters allowed, you have " + this.newVenue.address.length);
          this.validVenueAddress = false;
        } else {
          this.validVenueAddress = true;
        }
      },

      validatePosition: function () {
        this.venuePositionErrors = [];
        if (isNaN(this.newVenue.latitude) || isNaN(this.newVenue.longitude)) {
          this.venuePositionErrors.push("Latitude and Longitude must be numbers.");
          this.validVenuePosition = false;
        } else if (Math.abs(this.newVenue.latitude) > 90.0) {
          this.venuePositionErrors.push("The latitude is invalid. It must be between -90 and 90.");
          this.validVenuePosition = false;
        } else if(Math.abs(this.newVenue.longitude) > 180) {
          this.venuePositionErrors.push("The longitude is invalid. It must be between -180 and 180.");
          this.validVenuePosition = false;
        } else if (this.newVenue.latitude === "" || this.newVenue.longitude === "") {
          this.venuePositionErrors.push("The latitude and longitude are required.");
          this.validVenuePosition = false;
        } else {
          this.validVenuePosition = true;
        }
      },

      validateAllVenue: function () {
        this.validateVenueName();
        this.validateCategory();
        this.validateVenueCity();
        this.validateAddress();
        this.validateShortDescription();
        this.validateLongDescription();
        this.validatePosition();
        this.hasValidVenueInput = (this.validVenueName && this.validVenueCategory && this.validVenueCity &&
          this.validVenueAddress && this.validVenueShortDescription && this.validVenueLongDescription &&
          this.validVenuePosition);
      },

      getPosition: function () {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition((position) => {
            this.newVenue.latitude = position.coords.latitude;
            this.newVenue.longitude = position.coords.longitude;
          });
        } else {
          // TODO: implement an error pop up here
          // Could not retrieve your location.
        }
      },

      addVenue: async function () {
        this.validateAllVenue();
        if (this.hasValidVenueInput) {
          try {
            let response = await sendNewVenue(this.newVenue);
            // TODO: implement a custom pop up
            // Venue added successfully
            this.$router.push(`/venues/${response.body.venueId}`);
          } catch (error) {
            console.log(error);
            if (error.status === 400) {
              // TODO: implement a custom pop up
              // One or more of your fields have invalid values
            } else if (error.status === 401) {
              // TODO: implement a custom pop up
              // Forbidden, You do not have permission to perform this action.
            }
          }
        }
      },

      cancelAdd: function () {
        this.setNewVenue();
        this.addVenueDialog = false;
      },

      onAddressChanged: function () {
        let newAddress = "";
        for (let key in this.address) {
          if (this.address[key] !== "") {
            newAddress += this.address[key] + ','
          }
        }
        this.newVenue.address = newAddress.substring(0, newAddress.length - 1);
      },

      onCityChanged: function () {
        this.address.city = this.newVenue.city;
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

  .warning-header {
    -webkit-text-fill-color: $error;
    text-align: right;
  }

</style>
