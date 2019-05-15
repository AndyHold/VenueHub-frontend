<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <div id="add-venue-dialog">
    <v-dialog
      v-model="dialog"
      persistent
      width="800"
    >

      <template v-slot:activator="{ on }">
        <v-btn
          flat
          color="primary darken-1"
          v-on="on"
        >Add Venue
        </v-btn>
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
          <v-form
            ref="form"
            v-model="validForm"
            >
            <v-container grid-list-md class="no-bottom-padding-or-margin">
            <v-layout wrap>

              <v-layout row>

                <!-- Venue Name -->
                <v-flex xs6>
                  <v-text-field
                    label="Venue Name*"
                    hint="Enter the name of your venue"
                    :value="newVenue.venueName"
                    v-model="newVenue.venueName"
                    :rules="nameRules"
                    counter="64"
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
                    :rules="arrayRequiredRule"
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
                  :rules="descriptionRules(128)"
                  :counter="128"
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
                  :rules="descriptionRules(2048)"
                  :counter="2048"
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
                    :rules="getPositionRules(90)"
                    v-on:keyup.enter="addVenue"
                  ></v-text-field>
                </v-flex>
                <v-flex xs4>
                  <v-text-field
                    label="Longitude*"
                    hint="Enter the longitude of the venue"
                    :value="newVenue.longitude"
                    v-model="newVenue.longitude"
                    :rules="getPositionRules(180)"
                    v-on:keyup.enter="addVenue"
                  ></v-text-field>
                </v-flex>
                <v-flex xs4>
                  <v-spacer align="center">
                    <v-btn
                      flat
                      color="grey"
                      v-on:click="getPosition"
                    >Use My Location
                    </v-btn>
                  </v-spacer>
                </v-flex>
              </v-layout>

              <v-flex xs12>
                <p class="warning-header no-bottom-padding-or-margin">required fields marked with *</p>
              </v-flex>

            </v-layout>
          </v-container>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer row align="right">
            <v-btn flat color="error lighten-1" v-on:click="cancelAdd">Cancel</v-btn>
            <v-btn flat color="success lighten-1" v-on:click="addVenue">Submit</v-btn>
          </v-spacer>
        </v-card-actions>
      </v-card>

    </v-dialog>
  </div>
</template>

<script>

  import {rules, sendNewVenue} from "../ProfileService";

  export default {

    name: "add-venue-dialog",

    props: {
      categories: {
        type: Array,
        required: true
      }
    },

    data() {
      return {
        dialog: false,
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
        },
        nameRules: [rules.requiredString, rules.stringLessThanLimit(64)],
        arrayRequiredRule: [rules.requiredArray],
        validForm: false
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
        this.$refs.form.resetValidation();
        this.dialog = false;
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
       * Returns the rules for a description field to follow depending on the character limit.
       */
      descriptionRules: function(limit) {
        return [rules.requiredString, rules.stringLessThanLimit(limit), rules.invalidCharacters];
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
       * Returns an array of rules for use in a position field.
       */
      getPositionRules: function(limit) {
        return [rules.requiredNumber, rules.mustBeNumber, rules.validRange(limit)]
      },

      /**
       * Overall validation method for the new venue..
       */
      validateAllVenue: function () {
        this.$refs.form.validate();
        this.validateVenueCity();
        this.validateAddress();
        this.hasValidVenueInput = (this.validForm && this.validVenueCity && this.validVenueAddress);
      },

      /**
       * Method to get the current position of the user from their browser.
       */
      getPosition: async function () {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition((position) => {
            this.newVenue.latitude = position.coords.latitude;
            this.newVenue.longitude = position.coords.longitude;
          }, (error) => {
            this.$emit("displayMessage", {
              text: "Error: " + error.message,
              color: "red",
              showSnackbar: true
            });
          });
        } else {
          this.$emit("displayMessage", {
            text: "Error: Could not get your current position",
            color: "red",
            showSnackbar: true
          });
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
            this.$router.push(`/venues/${response.body.venueId}`);
          } catch (error) {
            if (error.status === 400) {
              this.$emit("displayMessage", {
                text: "Error: " + error.message,
                color: "red",
                showSnackbar: true
              });
              // This should never be called as a user should not be able to enter bad data.
            } else if (error.status === 401) {
              this.$emit("displayMessage", {
                text: `Error: ${error.message}, you do not have permission to perform this action.`,
                color: "red",
                showSnackbar: true
              });
              // This should never be called as a user should not see this functionality if they do not have permission.
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

  .no-bottom-padding-or-margin {
    margin-bottom: 0;
    padding-bottom: 0;
  }

</style>
