<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <v-dialog
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
              <!-- TODO: Change this to using a growing panel thing from vuetify -->
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
</template>

<script>

  import {sendNewVenue} from "../ProfileService";

  export default {

    name: "add-venue-dialog",

    props: {
      categories: {
        type: Array,
        required: true
      }
    },

    data() {
      //TODO: change this to use rules.
      return {
        addVenueDialog: false,
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

      /**
       * Method called when the cancel button is selected.
       * Resets the values of new venue to null and closes the dialog.
       */
      cancelAdd: function () {
        this.setNewVenue();
        this.addVenueDialog = false;
      },

      /**
       * Method called when the address is changed.
       * Sets the address value in the newVenue object.
       */
      onAddressChanged: function () {
        let newAddress = "";
        for (let key in this.address) {
          if (this.address[key] !== "") {
            newAddress += this.address[key] + ','
          }
        }
        this.newVenue.address = newAddress.substring(0, newAddress.length - 1);
      },

      /**
       * Method called when the city is changed
       * Sets the city in the newVenue object.
       */
      onCityChanged: function () {
        this.address.city = this.newVenue.city;
      },

      /**
       * Sets the newVenue object to have blank values.
       */
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

      /**
       * Validation method for name.
       */
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

      /**
       * Validation method for category.
       */
      validateCategory: function () {
        if (this.newVenue.categoryId !== "") {
          this.venueCategoryErrors = [];
          this.validVenueCategory = true;
        } else {
          this.venueCategoryErrors.push("Category is required");
          this.validVenueCategory = false;
        }
      },

      /**
       * Validation method for city.
       */
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

      /**
       * Validation method for short description.
       */
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

      /**
       * Validation method for long description.
       */
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

      /**
       * Validation method for street address.
       */
      validateStreetAddress: function () {
        if (this.address.street.length === 0) {
          this.venueStreetErrors.push("Street name and number are required");
          this.validVenueStreet = false;
        } else {
          this.venueStreetErrors = [];
          this.validVenueStreet = true;
        }
      },

      /**
       * Validation method for country.
       */
      validateCountryAddress: function () {
        if (this.address.country.length === 0) {
          this.venueCountryErrors.push("Country is required");
          this.validVenueCountry = false;
        } else {
          this.venueCountryErrors = [];
          this.validVenueCountry = true;
        }
      },

      /**
       * Validation method for address.
       */
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

      /**
       * Validation method for position.
       */
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

      /**
       * Overall validation method for the new venue..
       */
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

      /**
       * Method to get the current position of the user from their browser.
       */
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

      /**
       * Method called when the submit button is pressed.
       * Send a request to the server to create the new venue and handles error appropriately.
       */
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
      }
    }

  }

</script>

<style lang="scss" scoped>

  @import "../../../Resources/StyleSheets/variables";

  .v-card {
    background-color: $lighter-secondary;
  }

  .title-text {
    color: $lighter-secondary;
    font-size: 23px;
    justify-content: center;
  }

  .warning-header {
    -webkit-text-fill-color: $error;
    text-align: right;
  }

</style>
