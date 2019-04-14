<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
    <div id="profile">
      <!-- Title Bar -->
      <v-toolbar fixed color="primary" class="page-header" z-index="9999">
        <v-toolbar-title class="page-title">Welcome {{ user.givenName }}</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-toolbar-items class="logout-button">
          <v-btn v-if="isLoggedOn()" color="blue-grey lighten-4" @click="logout" round fab><v-icon color="primary">logout</v-icon></v-btn>
        </v-toolbar-items>
      </v-toolbar>

      <!-- Main Container -->
      <v-layout fluid justify-center list-grid class="main-container">

        <v-flex xs4>
          <v-card elevation="10" class="profile-card">
            <v-layout column list-grid>
              <v-flex xs4>
                <v-card
                  class="image-card"
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
                      src="src/Resources/Images/placeholder-image.jpg"
                      aspect-ratio="1"
                      class="profile-photo"
                    ></v-img>
                  </v-flex>
                  <v-dialog
                    v-model="uploadPhotoDialog"
                    persistent
                    full-width
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

                    <v-card>
                      <v-card-title
                        class="headline primary title-text"
                        color="primary darken-1"
                        >
                        Upload a Profile Picture
                      </v-card-title>

                      <v-card-media>
                        <!-- code to upload image here -->
                      </v-card-media>

                      <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn
                          flat
                          color="success darken-1"
                        >Upload</v-btn>
                        <v-btn
                          flat
                          color="error darken-1"
                          @click="uploadPhotoDialog = false"
                          >Close</v-btn>
                      </v-card-actions>
                    </v-card>

                  </v-dialog>
                </v-card>
              </v-flex>
              <v-layout xs4 row>
                <v-spacer></v-spacer>
                <h4 class="display-1 first-name">
                  {{ user.givenName }}
                </h4>
                <h4 class="display-1 last-name">
                  {{ user.familyName }}
                </h4>
                <v-spacer></v-spacer>

                <v-dialog
                  v-model="editProfileDialog"
                  persistent
                  full-width
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

                  <v-card>
                    <v-card-title
                      class="headline primary title-text"
                      color="primary darken-1"
                    >
                      Edit your profile
                    </v-card-title>

                    <v-card-text>
                      <!-- code to edit profile here -->
                    </v-card-text>

                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn
                        flat
                        color="success darken-1"
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
            </v-layout>
          </v-card>
        </v-flex>

      </v-layout>

      <v-layout fluid jusify-center list-grid class="venues-layout">

        <v-flex xs12>
          <v-card
            elevation="10"
            class="venues-card"
          >

            <v-card-title
              primary-title
              color="primary darken-1"
              class="headline primary title-text"
            >
              My Venues
            </v-card-title>

            <v-card-text>
              <!-- Code for venues here -->
            </v-card-text>
          </v-card>
        </v-flex>

      </v-layout>

      <v-layout fluid jusify-center list-grid class="venues-layout">

        <v-flex xs12>
          <v-card
            elevation="10"
            class="reviews-card"
          >

            <v-card-title
              primary-title
              color="primary darken-1"
              class="headline primary title-text"
            >
              My Reviews
            </v-card-title>

            <v-card-text>
              <!-- Code for venues here -->
            </v-card-text>
          </v-card>
        </v-flex>

      </v-layout>


    </div>
</template>

<script>
  import UserStorage from "../../DataStorage/userStorage";
  import {sendLogoutRequest} from "../../Utilities/loginPortal";
  import {endpoint} from "../../Utilities/endpoint";

  export default {
    name: "Profile",
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
        editProfileDialog: false
      }
    },
    methods: {
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
      getUserPhoto: function () {
        let path = endpoint(`/users/${this.user.userId}/photo`);
        this.userPhoto = path;
        console.log(path);
      }
    },
    mounted: async function () {
      this.user.userId = UserStorage.data.userId;
      this.user.username = UserStorage.data.username;
      this.user.email = UserStorage.data.email;
      this.user.givenName = UserStorage.data.givenName;
      this.user.familyName = UserStorage.data.familyName;
      this.getUserPhoto();
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../Resources/StyleSheets/variables";

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

  .image-card {
    background-color: $lighter-secondary;
  }

  .venues-card {
    margin: 20px;
  }

  .reviews-card {
    margin: 20px;
  }

</style>
