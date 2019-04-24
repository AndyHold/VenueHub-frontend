<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <div id="venue">

    <!-- Title Bar -->
    <v-toolbar fixed color="primary" class="page-header" z-index="9999">
      <navigation-menu title="true"></navigation-menu>
      <v-toolbar-title class="page-title">Welcome to {{ venue.venueName }}</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-items class="logout-button">
        <v-btn v-if="isLoggedOn()" color="blue-grey lighten-4" @click="logout" round fab><v-icon color="primary">logout</v-icon></v-btn>
      </v-toolbar-items>
    </v-toolbar>

    <!-- Main photo and venue name -->
    <v-layout fluid justify-center list-grid class="main-container">
      <v-flex xs4>
        <v-card elevation="10" class="venue-card">
          <v-layout column list-grid>

            <!-- Photo -->
            <v-flex xs4>
              <v-card
                class="card-background"
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
      <v-flex xs8>
        <v-card elevation="10">
          <v-card-text>

            <v-layout row class="info-section">

              <!-- Left side -->
              <v-flex xs6>

                <!-- City Row -->
                <v-layout row>
                  <v-flex xs4 class="left-column">
                    <h3 class="font-weight-regular">
                      City
                    </h3>
                  </v-flex>
                  <v-flex xs8 class="right-column">
                    <h3 class="font-weight-regular">
                      {{ venue.city }}
                    </h3>
                  </v-flex>
                </v-layout>

                <!-- Address Row -->
                <v-layout row>
                  <v-flex xs4 class="left-column">
                    <h3 class="font-weight-regular">
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
                  <v-flex xs4 class="left-column">
                    <h3 class="font-weight-regular">
                      Category
                    </h3>
                  </v-flex>
                  <v-flex xs8 class="right-column">
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on }">
                        <h3 v-on="on" class="font-weight-regular">
                          {{ venue.category.categoryName }}
                        </h3>
                      </template>
                      <span>{{ venue.category.categoryDescription }}</span>
                    </v-tooltip>
                  </v-flex>
                </v-layout>

                <!-- Date Row -->
                <v-layout row>
                  <v-flex xs4 class="left-column">
                    <h3 class="font-weight-regular">
                      Date Added
                    </h3>
                  </v-flex>
                  <v-flex xs8 class="right-column">
                    <h3 class="font-weight-regular">
                      {{ getStartDate(venue.dateAdded) }}
                    </h3>
                  </v-flex>
                </v-layout>

                <!-- Star Rating Row -->
                <v-flex>
                  <v-layout row>
                    <v-flex xs4 class="left-column">
                      <h3 class="font-weight-regular">
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
                    <v-flex xs4 class="left-column">
                      <h3 class="font-weight-regular">
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
              <v-flex xs6>

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
                        class="profile-photo"
                        height="225"
                        width="225"
                      >
                      </v-img>
                      <v-img
                        v-else
                        src="/src/Resources/Images/placeholder-image.jpg"
                        aspect-ratio="1"
                        class="profile-photo"
                        height="225"
                        width="225"
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
              </v-flex>

              <!-- Description Row -->
              <v-flex>
                <pre class="description-text" v-if="longDescription">{{ venue.shortDescription }}<br/>{{ venue.longDescription }}</pre>
                <p v-else>
                  {{ venue.shortDescription }}
                </p>
              </v-flex>

              <!-- Button Row -->
              <v-spacer align="right">
                <v-spacer v-if="venue.longDescription" align="right">
                  <v-btn v-if="longDescription" v-on:click="toggleLongDescription" flat color="grey" class="description-button">
                    Show Less
                  </v-btn>
                  <v-btn v-else v-on:click="toggleLongDescription" flat color="grey" class="description-button">
                    Show More
                  </v-btn>
                </v-spacer>
              </v-spacer>

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
                          label="Long Description"
                          hint="Long description displayed after the short description when requested"
                          :value="editedVenue.longDescription"
                          v-model="editedVenue.longDescription"
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
                        <p class="warning-header">Mandatory fields marked with *</p>
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
          <v-card-media>
            <photos-card
            :photos="venue.photos"
            :venueId="venueId"
            :isAdmin="isAdmin"></photos-card>
          </v-card-media>

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

            <v-card class="card-background">
              <v-card-title
                class="headline primary title-text"
                color="primary darken-1"
              >
                Upload a Venue Picture
              </v-card-title>

              <v-card-media>
                <v-spacer align="center">
                  <div v-if="imageUrl" class="image-preview">
                    <h2>Preview</h2>
                    <v-img
                      :src="imageUrl"
                      width="35%"
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
              </v-card-media>

              <v-card-actions>
                <v-spacer align="right">
                  <v-btn
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
          <v-card-media>
            <v-container fluid>
              <v-layout row wrap>
                <review-card
                  v-for="review in reviews"
                  :review="review"
                ></review-card>
              </v-layout>
            </v-container>
          </v-card-media>
        </v-card>
      </v-flex>
    </v-layout>

  </div>
</template>

<script>

  import {Map, View} from 'ol';
  import OSM from "ol/source/OSM";
  import TileLayer from 'ol/layer/Tile';
  import {fromLonLat} from "ol/proj";
  import {getUserImage, requestVenueDetails} from "../Search/VenueCard/VenueCardService";
  import {endpoint} from "../../Utilities/endpoint";
  import UserStorage from "../../DataStorage/UserStorage";
  import NavigationMenu from "../App/NavigationMenu/NavigationMenu";
  import ReviewCard from "./ReviewCard/ReviewCard";
  import PhotosCard from "./PhotosCard/PhotosCard";
  import {sendLogoutRequest} from "../../Utilities/loginPortal";
  import {
    checkUserPhoto,
    putVenuePhoto,
    requestVenueRatings,
    requestVenueReviews,
    sendVenueUpdate
  } from "./VenueService";
  import {getCategories} from "../Search/SearchService";

  export default {

    name: "Venue",

    components: {
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
        imageName: '',
        imageFile: '',
        imageUrl: '',
        uploadPhotoDialog: false,
        showFullDescription: false,
        editVenueDialog: false,
        editedVenue: {
          venueName: null,
          categoryId: null,
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
        reviews: []
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

      toggleLongDescription: async function () {
        this.longDescription = !this.longDescription;
      },

      getAdminPhoto: async function () {
        let response = await getUserImage(this.venue.admin.userId);
        if (response.status === 200) {
          this.adminPhoto = endpoint(`/users/${this.venue.admin.userId}/photo`);
        } else {
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
          this.imageName = '';
          this.imageFile = '';
          this.imageUrl = '';
        }
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

      getMainPhoto: function () {
        for (let i = 0; i < this.venue["photos"].length; i++) {
          if (this.venue["photos"][i].isPrimary) {
            return this.venue["photos"][i]["photoFilename"];
          }
        }
        return null;
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

      uploadPhoto: function () {
        //TODO: change this to use form data
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
            console.log(fileContents);
            let response = await putVenuePhoto(fileContents, fileType);
            if (response.status === 200) {
              // TODO: implement an alert message here.
              // Profile Picture Updated Successfully
              this.$router.go();
            } else if (response.status === 201) {
              // TODO: implement an alert message here.
              // Profile Picture Added Successfully
              this.$router.go();
            } else if (response.status === 400) {
              // TODO: implement an alert message here.
              // Bad image
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
          });
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

      validateVenueName: function () {
        if (this.editedVenue.venueName !== null) {
          this.venueNameErrors = [];
          this.validVenueName = true;
        } else if (this.editedVenue.city.length > 64) {
          this.venueNameErrors.push("City name is too long. Character limit is 64, you have " + this.editedVenue.city.length);
          this.validVenueName = false;
        } else {
          this.venueNameErrors.push("City is mandatory");
          this.validVenueName = false;
        }
      },

      validateCategory: function () {
        if (this.editedVenue.categoryId !== null) {
          this.venueCategoryErrors = [];
          this.validVenueCategory = true;
        } else {
          this.venueCategoryErrors.push("Category is mandatory");
          this.validVenueCategory = false;
        }
      },

      validateVenueCity: function () {
        if (this.editedVenue.city !== null) {
          this.venueCityErrors = [];
          this.validVenueCity = true;
        } else if (this.editedVenue.city.length > 128) {
          this.venueCityErrors.push("City name is too long. Character limit is 128, you have " + this.editedVenue.city.length);
          this.validVenueCity = false;
        } else {
          this.venueCityErrors.push("City is mandatory");
          this.validVenueCity = false;
        }
      },

      validateShortDescription: function () {
        this.venueShortDescriptionErrors = [];
        if (!/^[a-z0-9 ,+=*/"':;.{}()%$&#@!?\n]+$/i.test(this.editedVenue.shortDescription)) {
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
        if (!/^[a-z0-9 ,+=*/"':;.{}()%$&#@!?\n\t]+$/i.test(this.editedVenue.longDescription)) {
          this.venueLongDescriptionErrors.push("Long Description uses invalid characters, please rephrase using only letter, numbers or the following: ,.+='\"(){}$%&#@!?");
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
        if (!/^[a-z0-9, ]+$/i.test(this.editedVenue.address)) {
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

      getPosition: function () {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition((position) => {
            this.editedVenue.latitude = position.coords.latitude;
            this.editedVenue.longitude = position.coords.longitude;
          });
        } else {
          // TODO: implement an error pop up here
          // Could not retrieve your location.
        }
      },

      editVenue: async function () {
        this.validateAll();
        if (this.hasValidInput) {
          let response = await sendVenueUpdate(this.editedVenue, this.venue, this.venueId);
          if (response.status === 400) {
            // TODO: implement a custom pop up
            // One or more of your fields have invalid values
          } else if (response.status === 401) {
            // TODO: implement a custom pop up
            // Forbidden, You do not have permission to perform this action.
          } else if (response.status === 403) {
            // TODO: implement a custom pop up
            // Unauthorized, please log in again
          } else if (response.status === 404) {
            // TODO: implement a custom pop up
            // This venue was not found.
          } else {
            // TODO: implement a custom pop up
            // Venue updated successfully
            this.$router.go(0);
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
      }
    },

    mounted: async function () {
      this.venueId = this.$route.params.venueId;
      try {
        let response = await requestVenueDetails(this.venueId);
        this.venue = response.body;
        this.setEditedVenue();
      } catch (error) {
        console.log(error);
        // TODO: add custom alert here
        // Venue not found
        // this.$router; // go back ???
      }
      try {
        let response = await requestVenueRatings(this.venue);
        for (let i = 0; i < response.body.length; i++) {
          if (this.venueId == response.body[i].venueId) {
            this.venue.meanStarRating = response.body[i].meanStarRating;
            this.venue.modeCostRating = response.body[i].modeCostRating;
          }
        }
      } catch (error) {
        console.log(error);
        // TODO: add custom alert here
        // Could not get venue ratings

      }
      try {
        let response = await requestVenueReviews(this.venueId);
        this.reviews = await this.getReviewAuthorPhotos(response.body);
      } catch (error) {
        console.log(error);
        // TODO: add custom alert here
        // Could not load reviews
      }
      this.isAdmin = this.venue["admin"].userId == UserStorage.data.userId;
      this.getAdminPhoto();
      let photo = await this.getMainPhoto();
      if (photo) {
        this.mainPhoto = endpoint(`/venues/${this.venueId}/photos/${photo}`);
      }
      this.categories = await getCategories();
    }
  }
</script>

<style lang="scss" scoped>

  @import "../../Resources/StyleSheets/variables";

  #venue {
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

  .venue-card {
    background-color: $lighter-secondary;
    padding: 20px;
  }

  .profile-photo {
    border-radius: 25em;
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
    margin:0 20px 0 20px;
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

  .address {
    margin: 0;
    padding: 0;
    font-size: 16px;
  }

  .warning-header {
    -webkit-text-fill-color: $error;
    text-align: right;
  }

  .edit-venue-btn {
    right: 30px;
    Bottom: 30px;
    z-index: 1;
  }

  .description-text {
    font-family: 'Roboto', sans-serif;
    font-size: 14px;
  }

  .description-button {
    margin-right: 60px;
  }

  .upload-photo-btn {
    right: 30px;
    bottom: 30px;
    z-index: 1;
  }

</style>
