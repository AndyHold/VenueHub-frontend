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
          <v-card elevation="10" class="profile-card">
            <v-layout column list-grid>

              <!-- Photo and upload button -->
              <v-flex xs4>
                <v-card
                  class="card-background"
                  flat
                >
                  <v-flex>
                    <v-img
                      v-if="userPhoto"
                      :src="userPhoto"
                      aspect-ratio="1"
                      class="profile-photo"
                    >
                    </v-img>
                    <v-img
                      v-else
                      src="/src/Resources/Images/placeholder-image.jpg"
                      aspect-ratio="1"
                      class="profile-photo"
                    ></v-img>
                  </v-flex>
                  <v-dialog
                    v-if="owner"
                    v-model="uploadPhotoDialog"
                    persistent
                    width="80%"
                  >

                    <template v-slot:activator="{ on }">
                      <v-btn
                        class="upload-photo-btn"
                        fab
                        color="primary darken-1"
                        round
                        v-on="on"
                        absolute
                      >
                        <v-icon>cloud_upload</v-icon>
                      </v-btn>
                    </template>

                    <v-card class="card-background">
                      <v-card-title
                        class="headline primary title-text"
                        color="primary darken-1"
                        >
                        Upload a Profile Picture
                      </v-card-title>

                      <v-responsive>
                        <v-spacer align="center">
                          <div v-if="imageUrl" class="image-preview">
                            <h2>Preview</h2>
                            <v-img
                              :src="imageUrl"
                              width="30%"
                              class="profile-photo"
                              aspect-ratio="1"
                            ></v-img>
                          </div>
                          <div class="uploader"
                               @dragenter="onDragEnter"
                               @dragleave="onDragLeave"
                               @dragover.prevent
                               @drop="onDrop"
                               :class="{ dragging: isDragging }"
                               >
                            <v-icon v-if="isDragging" color="primary" x-large>cloud_upload</v-icon>
                            <v-icon v-else color="white" x-large>cloud_upload</v-icon>
                            <p>Drag your image here</p>
                            <div>OR</div>
                            <div class="file-input">
                              <v-text-field
                                prepend-icon="attach_file"
                                v-model="imageName"
                                :value="imageName"
                                label="Select Image"
                                v-on:click="pickFile"
                                clearable></v-text-field>
                              <input
                                type="file"
                                style="display: none"
                                ref=image
                                accept="image/png,image/jpeg"
                                @change="onInputChange"
                              >
                            </div>
                          </div>
                        </v-spacer>
                        <!-- code to upload image here -->
                      </v-responsive>

                      <v-card-actions>
                        <v-spacer align="left">
                          <v-btn
                            v-if="userPhoto"
                            flat
                            color="error darken-1"
                            v-on:click="deletePhoto"
                            >Delete</v-btn>
                        </v-spacer>
                        <v-spacer align="right">
                          <v-btn
                            flat
                            color="success darken-1"
                            v-on:click="uploadPhoto"
                          >Upload</v-btn>
                          <v-btn
                            flat
                            color="error darken-1"
                            v-on:click="uploadPhotoDialog = false"
                            >Close</v-btn>
                        </v-spacer>
                      </v-card-actions>
                    </v-card>

                  </v-dialog>
                </v-card>
              </v-flex>
              <!-- End of photo and upload button -->

              <!-- Profile Name and edit profile button -->
              <v-layout xs4 row>
                <v-spacer></v-spacer>
                <h4 class="display-1 first-name font-weight-light">
                  {{ user.givenName }}
                </h4>
                <h4 class="display-1 last-name font-weight-regular">
                  {{ user.familyName }}
                </h4>
                <v-spacer></v-spacer>

                <!-- Edit profile button and dialog -->
                <v-dialog
                  v-if="owner"
                  v-model="editProfileDialog"
                  persistent
                  width="40%"
                >

                  <template v-slot:activator="{ on }">
                    <v-btn
                      class="edit-profile-btn"
                      fab
                      color="primary darken-1"
                      round
                      v-on="on"
                      absolute
                    >
                      <v-icon>edit</v-icon>
                    </v-btn>
                  </template>

                  <v-card class="card-background">
                    <v-card-title
                      class="headline primary title-text"
                      color="primary darken-1"
                    >
                      Edit your profile
                    </v-card-title>

                    <v-card-text>
                      <v-container grid-list-md>
                        <v-layout wrap>

                          <!-- Given Name -->
                          <v-flex xs12 sm6 md6>
                            <v-text-field
                              label="First Name"
                              hint="Enter your given name here"
                              :value="givenName"
                              v-model="givenName"
                              @focus="givenNameErrors = []"
                              @blur="validateGivenName"
                              :error-messages="givenNameErrors"
                              v-on:keyup.enter="signUp"
                            ></v-text-field>
                          </v-flex>

                          <!-- Family Name -->
                          <v-flex xs12 sm6 md6>
                            <v-text-field
                              label="Last Name"
                              hint="Enter your family name here"
                              :value="familyName"
                              v-model="familyName"
                              @focus="familyNameErrors = []"
                              @blur="validateFamilyName"
                              :error-messages="familyNameErrors"
                              v-on:keyup.enter="signUp"
                            ></v-text-field>
                          </v-flex>

                          <!-- Password -->
                          <v-flex xs12>
                            <v-text-field
                              label="Current Password"
                              type="password"
                              hit="Enter your current password here"
                              :value="oldPassword"
                              v-model="oldPassword"
                              @focus="oldPasswordErrors = []"
                              @blur="validateOldPassword"
                              :error-messages="oldPasswordErrors"
                            ></v-text-field>
                          </v-flex>
                          <v-flex xs12>
                            <v-text-field
                              label="New Password"
                              type="password"
                              hit="Enter your new password here"
                              :value="newPassword"
                              v-model="newPassword"
                              @focus="newPasswordErrors = []"
                              @blur="validateNewPassword"
                              :error-messages="newPasswordErrors"
                            ></v-text-field>
                          </v-flex>
                          <v-flex xs12>
                            <v-text-field
                              label="Confirm New Password"
                              type="password"
                              hit="Enter your new password again here"
                              :value="confirmNewPassword"
                              v-model="confirmNewPassword"
                              @focus="newPasswordErrors = []"
                              @blur="validateNewPassword"
                              :error-messages="newPasswordErrors"
                              v-on:keyup.enter="editUser"
                            ></v-text-field>
                          </v-flex>

                          <v-flex xs12>
                            <h4 class="information">Please change the fields you wish to edit</h4>
                          </v-flex>

                        </v-layout>
                      </v-container>
                    </v-card-text>

                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn
                        flat
                        color="success darken-1"
                        v-on:click="editUser"
                      >Accept</v-btn>
                      <v-btn
                        flat
                        color="error darken-1"
                        @click="editProfileDialog = false"
                      >Close</v-btn>
                    </v-card-actions>
                  </v-card>

                </v-dialog>

              </v-layout>
              <!-- End of profile Name and edit profile button -->

              <!-- Username and email -->
              <v-layout xs4 column>
                <v-spacer align="center">
                  <p class="username">
                    ({{ user.username }})
                  </p>
                  <p v-if="user.email" class="email">
                    {{ user.email }}
                  </p>
                </v-spacer>
              </v-layout>
              <!-- End of username and email -->

            </v-layout>
          </v-card>
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
            class="card-background venues-card"
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

                  <!-- Edit Venue Card -->
                  <v-card>
                    <v-card-title
                      class="headline primary title-text"
                      primary-title
                    >
                      Edit Venue Details
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

                          <!-- Suburb & City -->
                          <v-layout row>
                            <!-- Venue Suburb -->
                            <v-flex xs6>
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
                            <v-flex xs6>
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
                          </v-layout>

                          <!-- Region & Post Code -->
                          <v-layout row>
                            <!-- Venue Region -->
                            <v-flex xs8>
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

                            <!-- Venue Post Code -->
                            <v-flex xs4>
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

                          <!-- Country -->
                          <v-flex xs12>
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
  import {sendLoginRequest, sendLogoutRequest} from "../../Utilities/loginPortal";
  import {endpoint} from "../../Utilities/endpoint";
  import {
    deleteProfilePhoto, getUserDetails,
    getUserImage, getUserReviews,
    putProfilePhoto, requestCategories,
    requestUserVenues,
    sendEditUserRequest, sendNewVenue
  } from "./ProfileService";
  import NavigationMenu from "../App/NavigationMenu/NavigationMenu";
  import VenueCard from "../Search/VenueCard/VenueCard";
  import ReviewCard from "./ReviewCard/ReviewCard";

  export default {
    name: "Profile",

    components: {
      NavigationMenu,
      VenueCard,
      ReviewCard
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
        userPhoto: null,
        uploadPhotoDialog: false,
        editProfileDialog: false,
        isDragging: false,
        dragCount: 0,
        imageName: '',
        imageFile: '',
        imageUrl: '',
        newPassword: '',
        oldPassword: '',
        confirmNewPassword: '',
        editPassword: false,
        editName: false,
        oldPasswordIsValid: false,
        oldPasswordErrors: [],
        newPasswordIsValid: false,
        newPasswordErrors: [],
        givenName: null,
        hasValidGivenName: false,
        givenNameErrors: [],
        familyName: null,
        hasValidFamilyName: false,
        familyNameErrors: [],
        hasValidEditData: false,
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
      "imageName": {
        handler: "onImageNameChanged",
        immediate: true
      },
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

      onInputChange: function(event) {
        const files = event.target.files;
        this.processFile(files);
      },

      onDragEnter: function(event) {
        event.preventDefault();
        this.dragCount++;
        this.isDragging = true;
      },

      onDragLeave: function(event) {
        event.preventDefault();
        this.dragCount--;
        if (this.dragCount <= 0) {
          this.isDragging = false;
        }
      },

      onDrop: function(event) {
        const files = event.dataTransfer.files;
        this.processFile(files);
        event.preventDefault();
        event.stopPropagation();

        this.isDragging = false;
      },

      processFile: function(files) {
        if (files.length > 0) {
          this.imageName = files[0].name;
          const fileReader = new FileReader();
          fileReader.readAsDataURL(files[0]);
          fileReader.addEventListener('load', () => {
            this.imageUrl = fileReader.result;
            this.imageFile = files[0];
          })
        } else {
          this.imageName = '';
          this.imageFile = '';
          this.imageUrl = '';
        }
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

      getUserPhoto: async function () {
        try {
          await getUserImage(this.user.userId);
          this.userPhoto = endpoint(`/users/${this.user.userId}/photo`);
        } catch (error) {
          this.userPhoto = false;
        }
      },

      pickFile: function() {
        this.$refs.image.click();
      },

      onImageNameChanged: function() {
        if (this.imageName === null) {
          this.imageFile = '';
          this.imageUrl = '';
        }
      },

      uploadPhoto: function() {
        const fileType = this.imageFile.type;
        const fileSize = this.imageFile.size;
        if (fileSize > 20971520) {
          // TODO: implement an alert message here.
          // Image is too large, please resize or chose another image
        } else {
          let fileReader = new FileReader();
          fileReader.readAsArrayBuffer(this.imageFile);
          fileReader.addEventListener("load", async () => {
            const fileContents = fileReader.result;
            try {
              let response = await putProfilePhoto(fileContents, fileType);
              if (response.status === 200) {
                // TODO: implement an alert message here.
                // Profile Picture Updated Successfully
                this.$router.go(0);
              } else if (response.status === 201) {
                // TODO: implement an alert message here.
                // Profile Picture Added Successfully
                this.$router.go(0);
              }
            } catch (error) {
              if (error.status === 400) {
                // TODO: implement an alert message here.
                // Bad image
              } else if (error.status === 401) {
                // TODO: implement an alert message here.
                // Forbidden, you do not have permission to perform this action.
              } else if (error.status === 403) {
                // TODO: implement an alert message here.
                // Unauthorized, please log in
                this.$router.push('/');
              } else if (error.status === 404) {
                // TODO: implement an alert message here.
                // User not found
                this.$router.push('/');
              }
            }
          });
        }
      },

      deletePhoto: async function () {
        let response = await deleteProfilePhoto();
        if (response.status === 200) {
          // TODO: implement an alert message here.
          // Photo Deleted Successfully
          this.$router.go();
        } else if (response.status === 401) {
          // TODO: implement an alert message here.
          // Forbidden, you do not have permission to perform this action.
        } else if (response.status === 403) {
          // TODO: implement an alert message here.
          // Unauthorized, please log in
          this.$router.push('/');
        } else if (response.status === 404) {
          // TODO: implement an alert message here.
          // User not found
          this.$router.push('/');
        }
      },

      validateOldPassword: async function () {
        let response = await sendLoginRequest({"username": UserStorage.data.username, "password": this.oldPassword});

        if (response.status === 200) {
          this.oldPasswordIsValid = true;
          this.oldPasswordErrors = [];
        } else {
          this.oldPasswordIsValid = false;
          this.oldPasswordErrors.push("Incorrect password, please try again")
        }
      },

      validateNewPassword: function () {
        // temporary just check length > 1
        if (!this.newPassword) {
          this.newPasswordIsValid = false;
          this.newPasswordErrors.push("Please enter a valid password");
        } else if (this.newPassword.length > 256) {
          this.newPasswordIsValid = false;
          this.newPasswordErrors.push(`Your password is too long, character limit is 256, you have ${this.newUser.password.length}`);
        } else if (!this.confirmNewPassword) {
          this.newPasswordIsValid = false;
          this.newPasswordErrors.push("Please confirm your password");
        } else {
          if (this.newPassword !== this.confirmNewPassword) {
            this.newPasswordIsValid = false;
            this.newPasswordErrors.push("Your passwords do not match, please try again");
          } else {
            this.newPasswordIsValid = true;
            this.newPasswordErrors = [];
          }
        }
      },

      validateGivenName: function () {
        if (!this.givenName) {
          this.hasValidGivenName = false;
          this.givenNameErrors.push("First name is required");
        } else if (this.givenName.length > 128) {
          this.hasValidGivenName = false;
          this.givenNameErrors.push(`Your first name is too long, character limit is 128, you have ${this.givenName.length}`);
        } else if (/\d/.test(this.givenName)) {
          this.hasValidGivenName = false;
          this.givenNameErrors.push("First name cannot contain numbers");
        } else {
          this.hasValidGivenName = true;
          this.givenNameErrors = [];
        }
      },

      validateFamilyName: function() {
        if (!this.familyName) {
          this.hasValidFamilyName = false;
          this.familyNameErrors.push("Last name is required");
        } else if (this.familyName.length > 128) {
          this.hasValidFamilyName = false;
          this.familyNameErrors.push(`Your last name is too long, character limit is 128, you have ${this.familyName.length}`);
        } else if (/\d/.test(this.familyName)) {
          this.hasValidFamilyName = false;
          this.familyNameErrors.push("Last name cannot contain numbers");
        } else {
          this.hasValidFamilyName = true;
          this.familyNameErrors = [];
        }
      },

      validateAll: function () {
        this.validateFamilyName();
        this.validateGivenName();

        if (this.newPassword) {
          this.validateNewPassword();
          this.validateOldPassword();
          this.hasValidEditData = (this.hasValidGivenName && this.hasValidFamilyName && this.newPasswordIsValid && this.oldPasswordIsValid);
        } else {
          this.hasValidEditData = (this.hasValidGivenName && this.hasValidFamilyName);
        }
      },

      editUser: async function () {
        this.validateAll();

        if (this.hasValidEditData) {
          let user = {};
          if (this.givenName !== this.user.givenName) {
            user.givenName = this.givenName;
          }
          if (this.familyName !== this.user.familyName) {
            user.familyName = this.familyName;
          }
          if (this.newPassword) {
            user.password = this.newPassword;
          }
          const response = await sendEditUserRequest(user);
          if (response.status === 200) {
            alert("Details updated successfully");
            this.$router.go();
          } else if (response.status === 400) {
            this.newPasswordErrors.push("One of your fields is causing a server error, please update and try again");
            this.givenNameErrors.push("One of your fields is causing a server error, please update and try again");
            this.familyNameErrors.push("One of your fields is causing a server error, please update and try again");
            this.newPasswordIsValid = false;
            this.hasValidGivenName = false;
            this.hasValidFamilyName = false;
          } else if (response.status === 401 || response.status === 403) {
            this.oldPasswordErrors.push("Authentication failed, please enter your current password again");
            this.oldPasswordIsValid = false;
          } else if (response.status === 404) {
            alert("User not found, please log in again");
            this.$router.push('/');
          } else {
            alert("Server error, please try again");
          }
        }
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
        } else if (this.newVenue.latitude === null || this.newVenue.longitude === null) {
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

      this.givenName = this.user.givenName;
      this.familyName = this.user.familyName;
      this.getUserPhoto();
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

  .profile-card {
    background-color: $lighter-secondary;
    padding: 20px;
  }

  .profile-photo {
    border-radius: 25em;
  }

  .first-name {
    padding: 20px 10px 0 0;
    -webkit-text-fill-color: $primary;
  }

  .last-name {
    padding: 20px 0 0 10px;
    -webkit-text-fill-color: $primary;
  }

  .upload-photo-btn {
    right: 30px;
    bottom: 30px;
    z-index: 1;
  }

  .edit-profile-btn {
    right:15px;
    bottom: 15px;
    z-index: 1;
  }

  .card-background {
    background-color: $lighter-secondary;
  }

  .venues-card {
    margin: 20px;
  }

  .reviews-card {
    margin: 20px;
  }

  .uploader {
    justify-content: center;
    align-content: center;
    vertical-align: center;
    width: 80%;
    background-color: $primary;
    height: 200px;
    margin: 20px;
    border: 3px dashed white;
    padding: 10px;

    &.dragging {
      background-color: white;
      border: 3px dashed $primary;
      p {
        color: $primary;
      }

      div {
        color: $primary;
      }

      .file-input {
        -webkit-text-fill-color: $primary;
        width:300px;
      }
    }

    p {
      color: white;
    }

    div {
      color: white;
    }

    .file-input {
      -webkit-text-fill-color: white;
      width:300px;
    }
  }

  .image-preview {
    margin: 10px;
  }

  .information {
    -webkit-text-fill-color: $error;
    text-align: right;
  }

  .username {
    -webkit-text-fill-color: $primary;
    margin: 0;
    padding: 0;
  }

  .email {
    -webkit-text-fill-color: $primary;
    font-size: 18px;
    font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
  }

  .warning-header {
    -webkit-text-fill-color: $error;
    text-align: right;
  }

</style>
