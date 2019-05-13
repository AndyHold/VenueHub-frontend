<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <v-flex id="profile-info">
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

          <edit-profile-dialog
            v-if="owner"
            :user="user"
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

  import {deleteProfilePhoto, getUserImage, putProfilePhoto} from "../ProfileService";
  import {endpoint} from "../../../Utilities/endpoint";
  import EditProfileDialog from "./EditProfileDialog/EditProfileDialog";

  export default {

    name: "profile-info-card",
    components: {EditProfileDialog},
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
        uploadPhotoDialog: false,
        isDragging: false,
        dragCount: 0,
        imageName: '',
        imageFile: '',
        imageUrl: ''
      }
    },

    watch: {

      "imageName": {
        handler: "onImageNameChanged",
        immediate: true
      }
    },

    methods: {

      getUserPhoto: async function () {
        try {
          await getUserImage(this.userId);
          this.userPhoto = endpoint(`/users/${this.userId}/photo`);
        } catch (error) {
          this.userPhoto = false;
        }
      },

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
      }
    },

    mounted: function () {
      this.userId = parseInt(this.$route.params.userId);
      this.getUserPhoto();
    }
  }

</script>

<style lang="scss" scoped>

  @import "../../../Resources/StyleSheets/variables";

  .v-card {
    background-color: $lighter-secondary;
  }

  .profile-card {
    background-color: $lighter-secondary;
    padding: 20px;
  }

  .profile-photo {
    border-radius: 25em;
  }

  .title-text {
    color: $lighter-secondary;
    font-size: 23px;
    justify-content: center;
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
