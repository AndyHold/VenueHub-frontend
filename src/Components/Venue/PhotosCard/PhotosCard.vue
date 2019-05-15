<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <v-container grid-list-sm fluid>
    <v-layout row wrap>
      <!-- Photos -->
      <v-flex
        v-for="photo in photos"
        :key="photo.photoFilename"
        xl2 lg3 md4 sm6 xs12
      >
        <v-card flat tile class="d-flex">
          <v-img
            :src="getVenuePhotoEndpoint(photo)"
            :lazy-src="getVenuePhotoEndpoint(photo)"
            aspect-ratio="1"
            class="grey lighten-2 photo"
            v-on:click.stop="openPhotoDialog(photo)"
          >
            <template v-slot:placeholder>
              <v-layout
                fill-height
                align-center
                justify-center
                ma-0
              >
                <v-progress-circular indeterminate color="grey lighten-5"></v-progress-circular>
              </v-layout>
            </template>
          </v-img>
        </v-card>
      </v-flex>

      <!-- Enlarged Photo Dialog -->
      <v-dialog
        v-model="viewPhotoLargeDialog"
        width="90%"
      >
        <v-card class="dialog-card">
          <v-responsive>
            <v-layout row list-grid>

              <!-- Picture -->
              <v-flex xs9>
                <v-img
                  v-if="currentPhoto.photoFilename"
                  :src="getVenuePhotoEndpoint(currentPhoto)"
                  :lazy-src="getVenuePhotoEndpoint(currentPhoto)"
                  aspect-ratio="2"
                  class="grey darken-4"
                  contain
                >
                  <template v-slot:placeholder>
                    <v-layout
                      fill-height
                      align-center
                      justify-center
                      ma-0
                    >
                      <v-progress-circular indeterminate color="grey lighten-5"></v-progress-circular>
                    </v-layout>
                  </template>
                </v-img>
              </v-flex>

              <!-- Description -->
              <v-flex xs3 d-flex>
                <v-card>
                  <v-layout fill-height column class="photo-description-column">
                    <h4 align="center">
                      Description
                    </h4>

                    <pre class="photo-description-column">  {{ currentPhoto.photoDescription }}</pre>

                    <v-layout align-end>
                      <v-spacer align="center">
                        <v-btn
                          v-if="!currentPhoto.isPrimary && isAdmin"
                          flat
                          color="warning darken-1"
                          v-on:click="setPhotoPrimary"
                        >Make This The Primary Photo</v-btn>
                      </v-spacer>
                    </v-layout>
                  </v-layout>
                </v-card>
              </v-flex>

            </v-layout>
          </v-responsive>

          <v-card-actions>
            <v-layout row>
              <v-spacer v-if="isAdmin" align="left">
                <v-btn
                  flat
                  color="error darken-1"
                  v-on:click="deletePhoto"
                >Delete</v-btn>
              </v-spacer>
              <v-spacer align="right">
                <v-btn flat color="success darken-1"
                       v-on:click="closeVenuePhotoDialog"
                >Close</v-btn>
              </v-spacer>
            </v-layout>
          </v-card-actions>

        </v-card>
      </v-dialog>

    </v-layout>
    <!-- Warning Prompts -->
    <prompt-dialog
      :dialog="warningMessage.showPromptDialog"
      :message="warningMessage.message"
      :onConfirm="warningMessage.confirmationFunction"
      v-on:promptEnded="promptEnded"
    />
  </v-container>
</template>

<script>
  import {endpoint} from "../../../Utilities/endpoint";
  import {deleteVenuePhoto, makePrimary} from "../VenueService";
  import PromptDialog from "../../App/PromptDialog/PromptDialog";

  export default {

    name: "PhotosCard",
    components: {PromptDialog},
    props: {
      photos: {
        type: Array,
        required: true
      },
      venueId: {
        type: Number,
        required: true
      },
      isAdmin: {
        type: Boolean,
        required: true
      }
    },

    data: () => {
      return {
        viewPhotoLargeDialog: false,
        currentPhoto: {
          photoFilename: false,
          photoDescription: "",
        },
        warningMessage: {
          showPromptDialog: false,
          message: "",
          confirmationFunction: null
        }
      }
    },

    methods: {

      promptEnded: function() {
        this.warningMessage.showPromptDialog = false;
      },

      displayPrompt: function(prompt) {
        this.warningMessage = prompt;
      },

      getVenuePhotoEndpoint: function (photo) {
        return endpoint(`/venues/${this.venueId}/photos/${photo.photoFilename}`);
      },

      openPhotoDialog: function (photo) {
        this.viewPhotoLargeDialog = true;
        this.currentPhoto = photo;
      },

      closeVenuePhotoDialog: function () {
        this.viewPhotoLargeDialog = false;
        this.currentPhoto = {
          photoFilename: false,
          photoDescription: ""
        };
      },

      deletePhoto: async function () {
        this.displayPrompt({
          showPromptDialog: true,
          message: "This deletion will be permanent.\nAre you sure you want to delete this photo?",
          confirmationFunction: this.deletePhotoCallback
        });
      },

      setPhotoPrimary: async function() {
        try {
          await makePrimary(this.venueId, this.currentPhoto.photoFilename);
          this.$emit("displayMessage", {
            text: "Primary photo successfully updated",
            color: "green",
            showSnackbar: true
          });
          // Successfully changed primary photo
          this.$router.go(0);
        } catch (error) {
          this.$emit("displayMessage", {
            text: "Error: " + error.message,
            color: "red",
            showSnackbar: true
          });
        }
      },

      deletePhotoCallback: async function () {
        try {
          await deleteVenuePhoto(this.venueId, this.currentPhoto.photoFilename);
          this.$emit("displayMessage", {
            text: "Photo deleted successfully",
            color: "green",
            showSnackbar: true
          });
          this.$emit("photoDeleted", this.currentPhoto.isPrimary);
          this.closeVenuePhotoDialog()
          // Photo Deleted Successfully
        } catch (error) {
          this.$emit("displayMessage", {
            text: "Error: " + error.message,
            color: "red",
            showSnackbar: true
          });
        }
      }
    }
  }
</script>

<style lang="scss" scoped>

  @import "../../../Resources/StyleSheets/commonStyles";

  .photo-description-column {
    padding: 20px;
  }

  .dialog-card {
    padding: 20px;
  }

  .photo :hover {
    cursor: pointer;
  }

</style>
