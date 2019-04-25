<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <v-container grid-list-sm fluid>
    <v-layout row wrap>
      <!-- Photos -->
      <v-flex
        v-for="photo in photos"
        :key="photo.photoFilename"
        xs3
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
                  class="grey lighten-2"
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

                    <pre class="description-text photo-description-column">  {{ currentPhoto.photoDescription }}</pre>

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
  </v-container>
</template>

<script>
  import {endpoint} from "../../../Utilities/endpoint";
  import {deleteVenuePhoto, makePrimary} from "../VenueService";

  export default {

    name: "PhotosCard",

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
          photoDescription: ""
        }
      }
    },

    methods: {

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
        // TODO: implement an are you sure pop up
        let response = await deleteVenuePhoto(this.venueId, this.currentPhoto.photoFilename);
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

      setPhotoPrimary: async function() {
        try {
          await makePrimary(this.venueId, this.currentPhoto.photoFilename);
          // TODO: make custom pop up
          // Successfully changed primary photo
          this.$router.go(0);
        } catch (error) {
          if (error.status === 401) {
            // TODO: make custom pop up
            // Unauthorized
            console.log(error);
          } else if (error.status === 403) {
            // TODO: make custom pop up
            // Forbidden
            console.log(error);
          } else if (error.status === 404) {
            // TODO: make custom pop up
            // Not Found
            console.log(error);
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

  .photo-description-column {
    padding: 20px;
  }

  .dialog-card {
    padding: 20px;
  }

  .description-text {
    font-family: 'Roboto', sans-serif;
    font-size: 14px;
  }

  .photo :hover {
    cursor: pointer;
  }

  pre {
    white-space: pre-wrap;       /* Since CSS 2.1 */
    white-space: -moz-pre-wrap;  /* Mozilla, since 1999 */
    white-space: -pre-wrap;      /* Opera 4-6 */
    white-space: -o-pre-wrap;    /* Opera 7 */
    word-wrap: break-word;       /* Internet Explorer 5.5+ */
  }

</style>
