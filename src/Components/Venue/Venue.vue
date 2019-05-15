<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <div v-if="venue"
    id="venue"
    class="background-element">

    <!-- Title Bar -->
    <v-toolbar fixed color="primary" class="page-header" z-index="9999">
      <navigation-menu title="true"></navigation-menu>
      <v-toolbar-title class="page-title">Welcome to {{ venue.venueName }}</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-items class="logout-button">
        <v-btn v-if="isLoggedIn" color="blue-grey lighten-4" @click="logout" round fab><v-icon color="primary">logout</v-icon></v-btn>
      </v-toolbar-items>
    </v-toolbar>

    <!-- Main photo and venue name -->
    <v-layout fluid justify-center list-grid class="main-container">
      <v-flex xs12 sm10 md8 lg6 xl4>
        <v-card elevation="10" class="venue-card">
          <v-layout column list-grid>

            <!-- Photo -->
            <v-flex>
              <v-card
                flat
              >
                <v-flex>
                  <v-img
                    v-if="mainPhoto"
                    :src="mainPhoto"
                    aspect-ratio="1"
                  >
                  </v-img>
                  <v-img
                    v-else
                    src="/src/Resources/Images/placeholder-image.jpg"
                    aspect-ratio="1"
                  ></v-img>
                </v-flex>
              </v-card>
            </v-flex>
            <!-- End of photo -->

            <!-- Venue name -->
            <v-layout xs4 row>
              <v-spacer align="center">
                <h4 class="display-1 font-weight-light">
                  {{ venue.venueName }}
                </h4>
              </v-spacer>
            </v-layout>
            <!-- End of venue name -->

          </v-layout>
        </v-card>
      </v-flex>
    </v-layout>

    <!-- Venue details -->
    <v-layout fluid justify-center list-grid class="info-card">
      <v-flex xs12 sm11 md10 lg9 xl8>
        <v-card elevation="10">
          <v-card-text>

            <v-layout row class="info-section">

              <!-- Left side -->
              <v-flex xs12 md6 lg6>

                <!-- City Row -->
                <v-layout row>
                  <v-flex xs4>
                    <h3 class="font-weight-regular left-column">
                      City
                    </h3>
                  </v-flex>
                  <v-flex xs8>
                    <h3 class="font-weight-regular right-column">
                      {{ venue.city }}
                    </h3>
                  </v-flex>
                </v-layout>

                <!-- Address Row -->
                <v-layout row>
                  <v-flex xs4>
                    <h3 class="font-weight-regular left-column">
                      Address
                    </h3>
                  </v-flex>
                  <v-flex xs8 class="right-column">
                    <v-spacer align="left">
                      <p v-for="line in getAddress()" class="address">{{ line }}</p>
                    </v-spacer>
                  </v-flex>
                </v-layout>

                <!-- Category Row -->
                <v-layout row>
                  <v-flex xs4>
                    <h3 class="font-weight-regular left-column">
                      Category
                    </h3>
                  </v-flex>
                  <v-flex xs8>
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on }">
                        <h3 v-on="on" class="font-weight-regular right-column">
                          {{ venue.category.categoryName }}
                        </h3>
                      </template>
                      <span>{{ venue.category.categoryDescription }}</span>
                    </v-tooltip>
                  </v-flex>
                </v-layout>

                <!-- Date Row -->
                <v-layout row>
                  <v-flex xs4>
                    <h3 class="font-weight-regular left-column">
                      Date Added
                    </h3>
                  </v-flex>
                  <v-flex xs8>
                    <h3 class="font-weight-regular right-column">
                      {{ getStartDate(venue.dateAdded) }}
                    </h3>
                  </v-flex>
                </v-layout>

                <!-- Star Rating Row -->
                <v-flex>
                  <v-layout row>
                    <v-flex xs4>
                      <h3 class="font-weight-regular left-column">
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
                              size="1.5vw"
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
                    <v-flex xs4>
                      <h3 class="font-weight-regular left-column">
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
                              size="1.5vw"
                            ></v-rating>
                          </div>
                        </template>

                        <span>{{ venue.modeCostRating }}</span>
                      </v-tooltip>
                    </v-flex>
                  </v-layout>
                </v-flex>

              </v-flex>

              <!-- Right side -->
              <v-flex xs12 md6 lg6>

                <!-- Title Row -->
                <v-flex xs12>
                  <h3 class="font-weight-regular" align="center">
                    Administrator
                  </h3>
                </v-flex>

                <!-- Image Row -->
                <v-layout row>
                  <v-flex xs12>
                    <v-spacer align="center">
                      <v-img
                        v-if="adminPhoto"
                        :src="adminPhoto"
                        aspect-ratio="1"
                        class="round"
                        height="225"
                        width="225"
                        v-on:click="goToUserPage(venue.admin.userId)"
                      >
                      </v-img>
                      <v-img
                        v-else
                        src="/src/Resources/Images/placeholder-image.jpg"
                        aspect-ratio="1"
                        class="round"
                        height="225"
                        width="225"
                        v-on:click="goToUserPage(venue.admin.userId)"
                      ></v-img>
                    </v-spacer>
                  </v-flex>
                </v-layout>

                <!-- Username Row -->
                <v-layout row>
                  <v-flex xs12>
                    <h4 class="font-weight-regular" align="center">
                      {{ venue.admin.username }}
                    </h4>
                  </v-flex>
                </v-layout>

              </v-flex>

            </v-layout>

            <v-divider></v-divider>

            <!-- description section -->
            <v-layout column class="info-section">

              <!-- Title Row -->
              <v-flex xs12>
                <h3 class="font-weight-regular">
                  Description
                </h3>
                <v-expansion-panel>
                  <v-expansion-panel-content style="background-color: #CFD8DC">
                    <template v-slot:header>
                      <p>
                        {{ venue.shortDescription }}
                      </p>
                    </template>

                    <v-card-text>
                      <pre v-if="venue.longDescription">{{ venue.longDescription }}</pre>
                      <p v-else>No further details available for this venue</p>
                    </v-card-text>

                  </v-expansion-panel-content>
                </v-expansion-panel>
              </v-flex>
            </v-layout>

            <v-dialog
              v-if="isAdmin"
              v-model="editVenueDialog"
              persistent
              width="800"
            >
              <template v-slot:activator="{ on }">
                <v-btn
                  class="edit-venue-btn"
                  fab
                  color="primary darken-1"
                  round
                  v-on="on"
                  absolute
                >
                  <v-icon>edit</v-icon>
                </v-btn>
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
                            :value="editedVenue.venueName"
                            v-model="editedVenue.venueName"
                            @focus="venueNameErrors = []"
                            @blur="validateVenueName"
                            :error-messages="venueNameErrors"
                            v-on:keyup="validateVenueName"
                            v-on:keyup.enter="editVenue"
                          ></v-text-field>
                        </v-flex>

                        <!-- Venue Category -->
                        <v-flex xs6>
                        <v-select
                          label="Category*"
                          hint="Choose a category"
                          :value="editedVenue.categoryId"
                          v-model="editedVenue.categoryId"
                          :items="categories"
                          item-value="categoryId"
                          item-text="categoryName"
                          @focus="venueCategoryErrors = []"
                          @blur="validateCategory"
                          :error-messages="venueCategoryErrors"
                          v-on:keyup="validateCategory"
                          v-on:keyup.enter="editVenue"
                        ></v-select>
                      </v-flex>
                      </v-layout>

                      <!-- Venue City -->
                      <v-flex xs12>
                        <v-text-field
                          label="Venue City*"
                          hint="Enter the city of your venue"
                          :value="editedVenue.city"
                          v-model="editedVenue.city"
                          @focus="venueCityErrors = []"
                          @blur="validateVenueCity"
                          :error-messages="venueCityErrors"
                          v-on:keyup="validateVenueCity"
                          v-on:keyup.enter="editVenue"
                        ></v-text-field>
                      </v-flex>

                      <!-- Venue Address -->
                      <v-flex xs12>
                        <v-text-field
                          label="Venue address*"
                          hint="Enter the venue address, please separate lines with a comma"
                          :value="editedVenue.address"
                          v-model="editedVenue.address"
                          @focus="venueAddressErrors = []"
                          @blur="validateAddress"
                          :error-messages="venueAddressErrors"
                          v-on:keyup="validateAddress"
                          v-on:keyup.enter="editVenue"
                        ></v-text-field>
                      </v-flex>

                      <!-- Short Description -->
                      <v-flex xs12>
                        <v-text-field
                          label="Short Description"
                          hint="Enter a short description to be displayed in the search"
                          :value="editedVenue.shortDescription"
                          v-model="editedVenue.shortDescription"
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
                          :value="editedVenue.longDescription"
                          v-model="editedVenue.longDescription"
                          @focus="venueLongDescriptionErrors = []"
                          @blur="validateLongDescription"
                          :error-messages="venueLongDescriptionErrors"
                          v-on:keydown.tab="tabPressed"
                          v-on:keyup="validateLongDescription"
                        ></v-textarea>
                      </v-flex>

                      <!-- Position -->
                      <v-layout row wrap>
                        <v-flex xs4>
                          <v-text-field
                            label="Latitude*"
                            hint="Enter the latitude of the venue"
                            :value="editedVenue.latitude"
                            v-model="editedVenue.latitude"
                            @focus="venuePositionErrors = []"
                            @blur="validatePosition"
                            :error-messages="venuePositionErrors"
                            v-on:keyup="validatePosition"
                            v-on:keyup.enter="editVenue"
                            ></v-text-field>
                        </v-flex>
                        <v-flex xs4>
                          <v-text-field
                            label="Longitude*"
                            hint="Enter the longitude of the venue"
                            :value="editedVenue.longitude"
                            v-model="editedVenue.longitude"
                            @focus="venuePositionErrors = []"
                            @blur="validatePosition"
                            :error-messages="venuePositionErrors"
                            v-on:keyup="validatePosition"
                            v-on:keyup.enter="editVenue"
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
                    <v-btn flat color="error lighten-1" v-on:click="cancelEdit">Cancel</v-btn>
                    <v-btn flat color="success lighten-1" v-on:click="editVenue">Submit</v-btn>
                  </v-spacer>
                </v-card-actions>
              </v-card>

            </v-dialog>

          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>

    <!-- Photos Card -->
    <v-layout class="info-card">
      <v-flex>
        <v-card>
          <v-card-title class="headline primary title-text">
            Photos
          </v-card-title>
          <v-responsive>
            <photos-card
              :photos="venue.photos"
              :venueId="venueId"
              :isAdmin="isAdmin"
              v-on:displayMessage="displayMessage"
              v-on:photoDeleted="photosChanged"
            ></photos-card>
          </v-responsive>

          <!-- Upload Button -->
          <v-dialog
            v-if="isAdmin"
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
                <v-icon>add</v-icon>
              </v-btn>
            </template>

            <v-card>
              <v-card-title
                class="headline primary title-text"
                color="primary darken-1"
              >
                Upload a Venue Picture
              </v-card-title>

              <v-responsive>
                <v-layout row class="info-section">
                  <v-flex xs8>
                    <v-spacer align="center">
                    <div v-if="imageUrl" class="image-preview">
                      <h2>Preview</h2>
                      <v-img
                        :src="imageUrl"
                        width="35%"
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
                  </v-flex>
                  <v-flex xs4 class="description-column">
                    <v-spacer align="center">
                      <h4>
                        Photo Description
                      </h4>
                    </v-spacer>
                    <v-textarea
                    auto-grow
                    clearable
                    hint="General description of the photo"
                    label="Photo Description"
                    placeholder="The view from outside the front door..."
                    :value="venuePhoto.description"
                    v-model="venuePhoto.description"
                    @focus="venuePhotoDescriptionErrors = []"
                    @blur="validateVenuePhotoDescription"
                    :error-messages="venuePhotoDescriptionErrors"
                    v-on:keyup="validateVenuePhotoDescription"
                    >

                    </v-textarea>
                    <v-flex v-if="venue.photos.length > 0">
                      <v-switch
                        v-model="venuePhoto.makePrimary"
                        :label="`Make primary venue photo: ${venuePhoto.makePrimary.toString()}`"
                      ></v-switch>

                    </v-flex>
                  </v-flex>
                </v-layout>
              </v-responsive>

              <v-card-actions>
                <v-spacer align="right">
                  <v-btn
                    :disabled="!imageName"
                    flat
                    color="success darken-1"
                    v-on:click="uploadPhoto"
                  >Upload</v-btn>
                  <v-btn
                    flat
                    color="error darken-1"
                    v-on:click="cancelUpload"
                  >Close</v-btn>
                </v-spacer>
              </v-card-actions>
            </v-card>

          </v-dialog>

        </v-card>
      </v-flex>
    </v-layout>

    <!-- Reviews Card -->
    <v-layout class="info-card">
      <v-flex>
        <v-card>

          <v-card-title class="headline primary title-text">
            Reviews
          </v-card-title>

          <v-card-actions>
            <v-spacer align="right">

              <!-- Add Review Dialog -->
              <v-dialog
                v-if="canReview"
                v-model="addReviewDialog"
                persistent
                width="80%"
              >

                <template v-slot:activator="{ on }">
                  <v-btn
                    flat
                    color="primary darken-1"
                    v-on="on"
                  >Review This Venue</v-btn>
                </template>

                <v-card>
                  <v-card-title
                    class="headline primary title-text"
                    color="primary darken-1"
                  >
                    Add a review
                  </v-card-title>

                  <v-responsive>
                    <v-layout row style="margin: 0 30px">
                      <v-flex xs6>

                        <!-- Title Row -->
                        <v-spacer align="center">
                          <h4 class="font-weight-regular">
                            Review Body
                          </h4>
                        </v-spacer>

                        <!-- Body -->
                        <v-textarea
                          auto-grow
                          clearable
                          hint="Enter any comments you have here."
                          label="Review Body"
                          placeholder="I liked this event because..."
                          :value="review.reviewBody"
                          v-model="review.reviewBody"
                          @focus="reviewErrors = []"
                          @blur="validateReviewBody"
                          :error-messages="reviewErrors"
                          v-on:keyup="validateReviewBody"
                        >

                        </v-textarea>

                      </v-flex>
                      <v-flex xs6>

                        <!-- Title Row-->
                        <v-spacer align="center">
                          <h4 class="font-weight-regular">
                            Ratings
                          </h4>
                        </v-spacer>

                        <!-- Star Rating Row -->
                        <v-flex>
                          <v-layout row>
                            <v-flex xs5 class="left-column">
                              <h3 class="font-weight-regular">
                                Star Rating
                              </h3>
                            </v-flex>
                            <v-flex xs7 class="right-column">
                              <v-tooltip bottom>

                                <template v-slot:activator="{ on }">
                                  <div v-on="on">
                                    <v-rating
                                      v-model="review.starRating"
                                      length="5"
                                    ></v-rating>
                                  </div>
                                </template>

                                <span>Please choose an overall rating for the venue between 1 - 5</span>
                              </v-tooltip>
                            </v-flex>
                          </v-layout>
                        </v-flex>

                        <!-- Cost Rating Row -->
                        <v-flex>
                          <v-layout row>
                            <v-flex xs5 class="left-column">
                              <h3 class="font-weight-regular">
                                Cost Rating
                              </h3>
                            </v-flex>
                            <v-flex xs7 class="right-column">
                              <v-tooltip bottom>

                                <template v-slot:activator="{ on }">
                                  <div v-on="on">
                                    <v-rating
                                      v-model="review.costRating"
                                      length="4"
                                      clearable
                                    ></v-rating>
                                  </div>
                                </template>

                                <span>Please enter a cost rating between 0 - 4 where 0 is free and 4 is very expensive</span>
                              </v-tooltip>
                            </v-flex>
                          </v-layout>
                        </v-flex>

                      </v-flex>
                    </v-layout>
                  </v-responsive>

                  <v-card-actions>
                    <v-spacer align="right">
                      <v-btn
                        flat
                        color="success darken-1"
                        v-on:click="addReview"
                      >Post</v-btn>
                      <v-btn
                        flat
                        color="error darken-1"
                        v-on:click="closeReviewDialog"
                      >Close</v-btn>
                    </v-spacer>
                  </v-card-actions>
                </v-card>

              </v-dialog>

            </v-spacer>
          </v-card-actions>

          <v-responsive>
            <v-container fluid>
              <v-layout row wrap>
                <review-card
                  v-for="review in reviews"
                  v-bind:key="review.reviewAuthor.userId"
                  :review="review"
                ></review-card>
              </v-layout>
            </v-container>
          </v-responsive>

        </v-card>
      </v-flex>
    </v-layout>

    <!-- Error messages -->
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

  import {getUserImage, requestVenueDetails} from "../Search/VenueCard/VenueCardService";
  import {endpoint} from "../../Utilities/endpoint";
  import NavigationMenu from "../App/NavigationMenu/NavigationMenu";
  import ReviewCard from "./ReviewCard/ReviewCard";
  import PhotosCard from "./PhotosCard/PhotosCard";
  import {sendLogoutRequest} from "../../Utilities/loginPortal";
  import {
    checkUserPhoto, postReview,
    putVenuePhoto,
    requestVenueRatings,
    requestVenueReviews,
    sendVenueUpdate
  } from "./VenueService";
  import {getCategories} from "../Search/SearchService";
  import PromptDialog from "../App/PromptDialog/PromptDialog";

  export default {

    name: "Venue",

    components: {
      PromptDialog,
      NavigationMenu,
      ReviewCard,
      PhotosCard
    },

    data: () => {
      return {
        venue: null,
        venueId: 0,
        categories: [],
        adminPhoto: false,
        longDescription: false,
        isAdmin: false,
        mainPhoto: false,
        isDragging: false,
        dragCount: 0,
        imageName: null,
        imageFile: '',
        imageUrl: '',
        uploadPhotoDialog: false,
        showFullDescription: false,
        editVenueDialog: false,
        editedVenue: {
          venueName: null,
          categoryId: null,
          city: null,
          shortDescription: null,
          longDescription: null,
          address: null,
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
        hasValidInput: false,
        reviews: [],
        canReview: true,
        addReviewDialog: false,
        review: {
          starRating: 0,
          costRating: -1,
          reviewBody: ""
        },
        reviewErrors: [],
        validReview: false,
        starRatingErrors: [],
        validStarRating: false,
        costRatingErrors: [],
        validCostRating: false,
        hasValidReviewInfo: false,
        venuePhoto: {
          makePrimary: false,
          description: "",
          photo: null
        },
        validVenuePhotoDescription: false,
        venuePhotoDescriptionErrors: [],
        validVenuePhoto: false,
        venuePhotoErrors: [],
        isLoggedIn: false,
        snackBar: {
          showSnackbar: false,
          text: "",
          color: ""
        }
      }
  },

    watch: {
      "imageName": {
        handler: "onImageNameChanged",
        immediate: true
      }
    },

    methods: {

      photosChanged: async function (isPrimary) {
        await this.getVenueDetails();
        if (isPrimary) {
          this.setMainPhoto();
        }
      },

      displayMessage: function(snackBar) {
        this.snackBar = snackBar;
      },

      getCategoryName: function (categoryId) {
        for (let index in this.categories) {
          if (categoryId === this.categories[index].categoryId) {
            return this.categories[index]["categoryName"];
          }
        }
      },

      toggleLongDescription: async function () {
        this.longDescription = !this.longDescription;
      },

      getAdminPhoto: async function () {
        try {
          await getUserImage(this.venue.admin.userId);
          this.adminPhoto = endpoint(`/users/${this.venue.admin.userId}/photo`);
        } catch (error) {
          this.adminPhoto = false;
        }
      },

      getAddress: function () {
        return this.venue.address.split(',');
      },

      getVenuePhotoEndpoint: function (photo) {
        return endpoint(`/venues/${this.venueId}/photos/${photo.photoFilename}`);
      },

      onInputChange: function (event) {
        const files = event.target.files;
        this.processFile(files);
      },

      onDragEnter: function (event) {
        event.preventDefault();
        this.dragCount++;
        this.isDragging = true;
      },

      onDragLeave: function (event) {
        event.preventDefault();
        this.dragCount--;
        if (this.dragCount <= 0) {
          this.isDragging = false;
        }
      },

      onDrop: function (event) {
        const files = event.dataTransfer.files;
        this.processFile(files);
        event.preventDefault();
        event.stopPropagation();

        this.isDragging = false;
      },

      processFile: function (files) {
        if (files.length > 0) {
          this.imageName = files[0].name;
          const fileReader = new FileReader();
          fileReader.readAsDataURL(files[0]);
          fileReader.addEventListener('load', () => {
            this.imageUrl = fileReader.result;
            this.imageFile = files[0];
          })
        } else {
          this.imageName = null;
          this.imageFile = '';
          this.imageUrl = '';
        }
      },

      logout: async function () {
        try {
          await sendLogoutRequest();
          localStorage.removeItem("userId");
          localStorage.removeItem("authToken");
          this.isAdmin = false;
          this.isLoggedIn = false;
        } catch (error) {
          localStorage.removeItem("userId");
          localStorage.removeItem("authToken");
          this.isAdmin = false;
          this.isLoggedIn = false;
        }
      },

      getMainPhoto: function () {
        for (let i = 0; i < this.venue["photos"].length; i++) {
          if (this.venue["photos"][i].isPrimary) {
            return this.venue["photos"][i]["photoFilename"];
          }
        }
        return false;
      },

      pickFile: function () {
        this.$refs.image.click();
      },

      onImageNameChanged: function () {
        if (this.imageName === null) {
          this.imageFile = '';
          this.imageUrl = '';
        }
      },

      uploadPhoto: async function () {
        const fileSize = this.imageFile.size;
        if (fileSize > 20971520) {
          this.displayMessage({
            text: "Error: File size too large, limit is 20mb.",
            color: "red",
            showSnackbar: true
          });
          // Image is too large, please resize or chose another image
        } else {
          let form = new FormData();
          await form.append("photo",this.imageFile , this.imageName);
          if (this.venuePhoto.description) {
            await form.append("description", this.venuePhoto.description);
          }
          await form.append("makePrimary", this.venuePhoto.makePrimary.toString());
          try {
            let response = await putVenuePhoto(form, this.venueId);
            if ([200, 201].includes(response.status)) {
              // Profile Picture Updated Successfully
              this.$router.go(0);
            }
          } catch (error) {
            if ([400, 401, 403].includes(error.status)) {
              this.displayMessage({
                text: "Error: " + error.message,
                color: "red",
                showSnackbar: true
              });
            } else if (error.status === 404) {
              this.displayMessage({
                text: "Error: User not found, please log in again.",
                color: "red",
                showSnackbar: true
              });
              localStorage.removeItem("authToken");
              localStorage.removeItem("userId");
              this.isLoggedIn = false;
              this.isAdmin = false;
              // User not found
            }
          }
        }
      },

      getStartDate: function (reviewDate) {
        let date = new Date(reviewDate);
        return date.toDateString();
      },

      setEditedVenue: function () {
        this.editedVenue.venueName = this.venue.venueName;
        this.editedVenue.categoryId = this.venue["category"].categoryId;
        this.editedVenue.city = this.venue.city;
        this.editedVenue.shortDescription = this.venue.shortDescription;
        this.editedVenue.longDescription = this.venue.longDescription;
        this.editedVenue.address = this.venue.address;
        this.editedVenue.latitude = this.venue.latitude;
        this.editedVenue.longitude = this.venue.longitude;
      },

      tabPressed: function(event) {
        console.log();
        let cursorIndex = event.target.selectionStart;
        this.editedVenue.longDescription = this.editedVenue.longDescription.slice(0, cursorIndex) + '\t' +
          this.editedVenue.longDescription.slice(cursorIndex);
        event.preventDefault();
      },

      validateVenueName: function () {
        if (this.editedVenue.venueName !== "") {
          this.venueNameErrors = [];
          this.validVenueName = true;
        } else if (this.editedVenue.city.length > 64) {
          this.venueNameErrors.push("City name is too long. Character limit is 64, you have " + this.editedVenue.city.length);
          this.validVenueName = false;
        } else {
          this.venueNameErrors.push("City is required");
          this.validVenueName = false;
        }
      },

      validateCategory: function () {
        if (this.editedVenue.categoryId !== "") {
          this.venueCategoryErrors = [];
          this.validVenueCategory = true;
        } else {
          this.venueCategoryErrors.push("Category is required");
          this.validVenueCategory = false;
        }
      },

      validateVenueCity: function () {
        if (this.editedVenue.city !== "") {
          this.venueCityErrors = [];
          this.validVenueCity = true;
        } else if (this.editedVenue.city.length > 128) {
          this.venueCityErrors.push("City name is too long. Character limit is 128, you have " + this.editedVenue.city.length);
          this.validVenueCity = false;
        } else {
          this.venueCityErrors.push("City is required");
          this.validVenueCity = false;
        }
      },

      validateShortDescription: function () {
        this.venueShortDescriptionErrors = [];
        if (this.editedVenue.shortDescription.length === 0) {
          this.venueShortDescriptionErrors.push("Short Description is required");
          this.validVenueShortDescription = false;
        } else if (!/^[a-z0-9 ,+=*/"':;.{}()%$&#@!?\n]+$/i.test(this.editedVenue.shortDescription)) {
          this.venueShortDescriptionErrors.push("Short Description uses invalid characters, please rephrase using only letter, numbers or the following: ,.+='\"(){}$%&#@!?");
          this.validVenueShortDescription = false;
        } else if (this.editedVenue.shortDescription.length > 128) {
          this.venueShortDescriptionErrors.push("Short Description is too long. Only 125 characters allowed, you have " + this.editedVenue.shortDescription.length);
          this.validVenueShortDescription = false;
        } else {
          this.validVenueShortDescription = true;
        }
      },

      validateLongDescription: function () {
        this.venueLongDescriptionErrors = [];
        if (this.editedVenue.longDescription.length === 0) {
          this.venueLongDescriptionErrors.push("Long Description is required");
          this.validVenueLongDescription = false;
        } else if (!/^[a-z0-9 ,+=*/"':;.{}()%$&#@!?\n\t]*$/i.test(this.editedVenue.longDescription)) {
          this.venueLongDescriptionErrors.push("Long Description uses invalid characters, please rephrase using only letter, numbers, tabs or the following: ,.+='\"(){}$%&#@!?");
          this.validVenueLongDescription = false;
        } else if (this.editedVenue.longDescription.length > 2048) {
          this.venueLongDescriptionErrors.push("Long Description is too long. Only 2048 characters allowed, you have " + this.editedVenue.longDescription.length);
          this.validVenueLongDescription = false;
        } else {
          this.validVenueLongDescription = true;
        }
      },

      validateAddress: function () {
        this.venueAddressErrors = [];
        if (this.editedVenue.address.length === 0) {
          this.venueAddressErrors.push("Address is required");
          this.validVenueAddress = false;
        } else if (!/^[a-z0-9, ]+$/i.test(this.editedVenue.address)) {
          this.venueAddressErrors.push("Address contains invalid characters, only letters, numbers and comma's are allowed.");
          this.validVenueAddress = false;
        } else if (this.editedVenue.address.length > 256) {
          this.venueAddressErrors.push("Address is too long. Only 256 characters allowed, you have " + this.editedVenue.address.length);
          this.validVenueAddress = false;
        } else {
          this.validVenueAddress = true;
        }
      },

      validatePosition: function () {
        this.venuePositionErrors = [];
        if (isNaN(this.editedVenue.latitude) || isNaN(this.editedVenue.longitude)) {
          this.venuePositionErrors.push("Latitude and Longitude must be numbers.");
          this.validVenuePosition = false;
        } else if (Math.abs(this.editedVenue.latitude) > 90.0) {
          this.venuePositionErrors.push("The latitude is invalid. It must be between -90 and 90.");
          this.validVenuePosition = false;
        } else if(Math.abs(this.editedVenue.longitude) > 180) {
          this.venuePositionErrors.push("The longitude is invalid. It must be between -180 and 180.");
          this.validVenuePosition = false;
        } else if (this.editedVenue.latitude === null || this.editedVenue.longitude === null) {
          this.venuePositionErrors.push("The latitude and longitude are required.");
          this.validVenuePosition = false;
        } else {
          this.validVenuePosition = true;
        }
      },

      validateAll: function () {
        this.validateVenueName();
        this.validateCategory();
        this.validateVenueCity();
        this.validateAddress();
        this.validateShortDescription();
        this.validateLongDescription();
        this.validatePosition();
        this.hasValidInput = (this.validVenueName && this.validVenueCategory && this.validVenueCity &&
          this.validVenueAddress && this.validVenueShortDescription && this.validVenueLongDescription &&
          this.validVenuePosition);
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
            this.displayMessage({
              text: "Error: " + error.message,
              color: "red",
              showSnackbar: true
            });
          });
        } else {
          this.displayMessage({
            text: "Error: Could not get your current position",
            color: "red",
            showSnackbar: true
          });
        }
      },

      editVenue: async function () {
        this.validateAll();
        if (this.hasValidInput) {
          try {
            let response = await sendVenueUpdate(this.editedVenue, this.venue, this.venueId);
            if (response.status === 200) {
              this.displayMessage({
                text: "Venue update successfully",
                color: "green",
                showSnackbar: true
              });
              this.getVenueDetails();
              this.editVenueDialog = false;
            }
          } catch (error) {
            if ([400, 401, 403].includes(error.status)) {
              this.displayMessage({
                text: "Error: " + error.message,
                color: "red",
                showSnackbar: true
              });
            } else {
              this.$router.push("/");
            }
          }
        }
      },

      cancelEdit: function () {
        this.setEditedVenue();
        this.editVenueDialog = false;
      },

      cancelUpload: function () {
        this.uploadPhotoDialog = false;
        this.imageFile = null;
        this.imageUrl = null;
        this.imageName = null;
      },

      checkAuthorPhoto: async function (userId) {
        try {
          await checkUserPhoto(userId);
          return endpoint(`/users/${userId}/photo`);
        } catch (error) {
          return false;
        }
      },

      getReviewAuthorPhotos: async function (reviews) {
        for (let i = 0; i < reviews.length; i++) {
          let userId = reviews[i].reviewAuthor.userId;
          reviews[i]["authorPhoto"] = await this.checkAuthorPhoto(userId);
        }
        return reviews;
      },

      checkCanReview: function () {
        for (let i = 0; i < this.reviews.length; i++) {
          if (localStorage.getItem("userId") === undefined ||
            parseInt(this.reviews[i].reviewAuthor.userId) === parseInt(localStorage.getItem("userId")) || this.isAdmin) {
            this.canReview = false;
          }
        }
      },

      addReview: async function () {
        this.validateAllReview();
        if (this.hasValidReviewInfo) {
          try {
            await postReview(this.review, this.venueId);
            this.$emit("displayMessage", {
              text: "review successfully added.",
              color: "green",
              showSnackbar: true
            });
            // Successfully added review
            this.getVenueReviews();
          } catch (error) {
            this.$emit("displayMessage", {
              text: "Error: " + error.message,
              color: "red",
              showSnackbar: true
            });
          }
        }
      },

      closeReviewDialog: function() {
        this.addReviewDialog = false;
        this.review = {
          starRating: -1,
          costRating: -1,
          reviewBody: ""
        }
      },

      validateReviewBody: function() {
        this.reviewErrors = [];
        if (!/^[a-z0-9 ,+=*/"':;.{}()%$&#@!?\\\n\t]+$/i.test(this.review.reviewBody)) {
          this.reviewErrors.push("Review contains invalid characters, only letters, numbers and the following are allowed:  ,+=*/\\\"':;.{}()%$&#@!?");
          this.validReview = false;
        } else if (this.review.reviewBody.length > 1024) {
          this.reviewErrors.push("Review is too long. Only 1024 characters allowed, you have " + this.review.reviewBody.length);
          this.validReview = false;
        } else {
          this.validReview = true;
        }
      },

      validateStarRating: function() {
        this.starRatingErrors = [];
        if (this.review.starRating < 1 || this.review.starRating > 5) {
          this.starRatingErrors.push("Please enter a star rating between 1 - 5");
          this.validStarRating = false;
        } else {
          this.validStarRating = true;
        }
      },

      validateCostRating: function() {
        this.costRatingErrors = [];
        if (this.review.costRating < 0 || this.review.costRating > 4) {
          this.costRatingErrors.push("Please enter a cost rating between 0 - 4");
          this.validCostRating = false;
        } else {
          this.validCostRating = true;
        }
      },

      validateAllReview: function() {
        this.validateStarRating();
        this.validateCostRating();
        this.validateReviewBody();
        this.hasValidReviewInfo = (this.validReview && this.validStarRating && this.validCostRating);
      },

      validateVenuePhotoDescription: function () {
        this.venuePhotoDescriptionErrors = [];
        if (!/^[a-z0-9 ,+=*/"':;.{}()%$&#@!?\\\n\t]*$/i.test(this.venuePhoto.description)) {
          this.venuePhotoDescriptionErrors.push("Description contains invalid characters, only letters, numbers and the following are allowed:  ,+=*/\\\"':;.{}()%$&#@!?");
          this.validVenuePhotoDescription = false;
        } else if (this.venuePhoto.description.length > 128) {
          this.venuePhotoDescriptionErrors.push("Description is too long. Only 128 characters allowed, you have " + this.venuePhoto.description.length);
          this.validVenuePhotoDescription = false;
        } else {
          this.validVenuePhotoDescription = true;
        }

        },

      goToUserPage: function (userId) {
        this.$router.push(`/profile/${userId}`)
      },

      getVenueDetails: async function () {
        try {
          let response = await requestVenueDetails(this.venueId);
          this.venue = response.body;
          this.isAdmin = parseInt(this.venue["admin"].userId) === parseInt(localStorage.getItem("userId"));
          this.setEditedVenue();
        } catch (error) {
          this.displayMessage({
            text: "Error: " + error.message,
            color: "red",
            showSnackbar: true
          });
        }
      },

      setMainPhoto: async function () {
        let photo = await this.getMainPhoto();
        if (photo) {
          this.mainPhoto = endpoint(`/venues/${this.venueId}/photos/${photo}`);
        } else {
          this.mainPhoto = false;
        }
      },

      getVenueReviews: async function () {
        try {
          let response = await requestVenueReviews(this.venueId);
          this.reviews = await this.getReviewAuthorPhotos(response.body);
          this.checkCanReview();
        } catch (error) {
          this.displayMessage({
            text: "Error: Could not load venue reviews",
            color: "red",
            showSnackbar: true
          });
        }
      },

      getVenueRatings: async function () {
        try {
          let response = await requestVenueRatings(this.venue);
          for (let i = 0; i < response.body.length; i++) {
            if (parseInt(this.venueId) === parseInt(response.body[i].venueId)) {
              if (response.body[i].meanStarRating != null) {
                this.venue.meanStarRating = response.body[i].meanStarRating;
              } else {
                this.venue.meanStarRating = 3;
              }
              if (response.body[i].modeCostRating != null) {
                this.venue.modeCostRating = response.body[i].modeCostRating;
              } else {
                this.venue.modeCostRating = 0;
              }
            }
          }
        } catch (error) {
          this.displayMessage({
            text: "Error: Could not load venue Ratings",
            color: "red",
            showSnackbar: true
          });
        }
      }

    },

    mounted: async function () {this.isLoggedIn = localStorage.getItem("userId") !== null;
      this.venueId = parseInt(this.$route.params.venueId);
      await this.getVenueDetails();
      await this.getVenueRatings();
      await this.getVenueReviews();
      this.getAdminPhoto();
      this.setMainPhoto();
      this.categories = await getCategories();
    }

  }
</script>

<style lang="scss" scoped>

  @import "../../Resources/StyleSheets/commonStyles";

  .background-element {
    background-image: url("../../Resources/Images/background.jpg");
  }

  .venue-card {
    padding: 20px;
  }

  .round {
    border-radius: 25em;
  }

  .round :hover {
    cursor: pointer;
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

  .info-card {
    margin: 0 20px 20px 20px;
  }

  .info-section {
    margin:0 20px;
  }

  .left-column {
    font-size: 1.5vw;
    text-align: right;
    padding: 0 10px 0 0;
  }

  .right-column {
    font-size: 1.5vw;
    text-align: left;
    padding: 0 0 0 10px;
  }

  .address {
    margin: 0;
    padding: 0;
    font-size: 1.3vw;
  }

  .edit-venue-btn {
    right: 30px;
    Bottom: 30px;
    z-index: 1;
  }

  .upload-photo-btn {
    right: 2.5em;
    bottom: 2.5em;
    z-index: 1;
  }

  .description-column {
    padding: 2em;
  }

  pre {
    padding: 0 0 0 2em;
  }

</style>
