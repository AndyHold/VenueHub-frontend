<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
    <div id="profile">
      <!-- Title Bar -->
      <v-toolbar fixed color="primary" class="page-header" z-index="9999">
        <navigation-menu title="true"></navigation-menu>
        <v-toolbar-title class="page-title">Welcome {{ user.givenName }}</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-toolbar-items class="logout-button">
          <v-btn v-if="isLoggedOn()" color="blue-grey lighten-4" @click="logout" round fab><v-icon color="primary">logout</v-icon></v-btn>
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

                <v-dialog
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
                              v-on:keyup.enter="signup"
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
                              v-on:keyup.enter="signup"
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

      <!-- My Venues -->
      <v-layout fluid jusify-center list-grid class="venues-layout">

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
              My Venues
            </v-card-title>

            <v-card-text>

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

      <!-- My Reviews -->
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
              My Reviews
            </v-card-title>

            <v-card-text>
              <review-card
                v-for="review in reviews"
                v-bind:key="review.venue.venueId"
                :review="review"
              ></review-card>
            </v-card-text>
          </v-card>
        </v-flex>

      </v-layout>

      <v-card>
        <pre>
          {{ reviews }}
        </pre>
      </v-card>
    </div>
</template>

<script>
  import UserStorage from "../../DataStorage/UserStorage";
  import {sendLoginRequest, sendLogoutRequest} from "../../Utilities/loginPortal";
  import {endpoint} from "../../Utilities/endpoint";
  import {
    deleteProfilePhoto,
    getUserImage, getUserReviews,
    putProfilePhoto, requestCategories,
    requestUserVenues,
    sendEditUserRequest
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
        reviews: []
      }
    },

    computed: {
      // TODO: fix this (disable accept till fields are changed)
      editFieldsChanged() {
        return (this.givenName !== this.user.givenName || this.familyName !== this.user.familyName || this.newPassword !== null || this.oldPassword !== null);
      }
    },

    watch: {
      "imageName": {
        handler: "onImageNameChanged",
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

      getUserPhoto: async function () {
        let response = await getUserImage(this.user.userId);
        if (response.status === 200) {
          this.userPhoto = endpoint(`/users/${this.user.userId}/photo`);
        } else {
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
      this.user.userId = UserStorage.data.userId;
      this.user.username = UserStorage.data.username;
      this.user.email = UserStorage.data.email;
      this.user.givenName = UserStorage.data.givenName;
      this.user.familyName = UserStorage.data.familyName;
      this.givenName = this.user.givenName;
      this.familyName = this.user.familyName;
      this.getUserPhoto();
      this.venues = await requestUserVenues(this.user.userId);
      this.categories = await requestCategories();
      this.getUserReviews();
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
  }

  .edit-profile-btn {
    right:15px;
    bottom: 15px;
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

</style>
