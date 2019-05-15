<template>
  <v-flex id="profile-info-card">
    <v-card elevation="10" class="profile-card">
      <v-layout column list-grid>

        <!-- Photo and upload button -->
        <v-flex xs4>
          <v-card
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
            <upload-photo-dialog
              v-if="owner"
              :userPhoto="userPhoto"
              v-on:loggedOut="$emit('loggedOut')"
              v-on:displayMessage="displayMessage"
            ></upload-photo-dialog>
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

          <edit-profile-dialog
            v-if="owner"
            :user="dataUser"
            v-on:userChanged="userEdited"
            v-on:loggedOut="$emit('loggedOut')"
            v-on:displayMessage="displayMessage"
          ></edit-profile-dialog>

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
</template>

<script>

  import {getUserImage} from "../ProfileService";
  import {endpoint} from "../../../Utilities/endpoint";
  import EditProfileDialog from "./EditProfileDialog/EditProfileDialog";
  import UploadPhotoDialog from "./UploadPhotoDialog/UploadPhotoDialog";

  export default {

    name: "profile-info-card",
    components: {UploadPhotoDialog, EditProfileDialog},
    props: {
      user: {
        type: Object,
        required: true,
        userId: {
          type: Number,
          required: true
        },
        username: {
          type: String,
          required: true
        },
        email: {
          type: String,
          required: false
        },
        givenName: {
          type: String,
          required: true
        },
        familyName: {
          type: String,
          required: true
        }
      },
      owner: {
        type: Boolean,
        required: true
      }
    },

    data() {
      return {
        userId: null,
        userPhoto: null,
        dataUser: {
          givenName: "",
          familyName: ""
        }
      }
    },

    watch: {
      user: {
        handler: "onUserChanged",
        immediate: true,
        deep: true
      }
    },

    methods: {

      displayMessage: function (snackBar) {
        this.$emit("displayMessage", snackBar);
      },

      getUserPhoto: async function () {
        try {
          await getUserImage(this.userId);
          this.userPhoto = endpoint(`/users/${this.userId}/photo`);
        } catch (error) {
          this.userPhoto = false;
        }
      },

      onUserChanged: function () {
        this.dataUser.givenName = this.user.givenName;
        this.dataUser.familyName = this.user.familyName;
      },

      userEdited: function (userData) {
        this.$emit("userChanged", userData);
      }
    },

    mounted: function () {
      this.userId = parseInt(this.$route.params.userId);
      this.getUserPhoto();
    }
  }

</script>

<style lang="scss" scoped>

  @import "../../../Resources/StyleSheets/commonStyles";

  .profile-card {
    background-color: $lighter-secondary;
    padding: 20px;
  }

  .profile-photo {
    border-radius: 25em;
  }

  .first-name {
    font-size: 1vw;
    padding: 20px 10px 0 0;
    -webkit-text-fill-color: $primary;
  }

  .last-name {
    padding: 20px 0 0 10px;
    -webkit-text-fill-color: $primary;
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
