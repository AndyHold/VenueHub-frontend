<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <div id="upload-photo-dialog">
    <v-dialog
      v-model="dialog"
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

      <v-card>
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
        </v-responsive>

        <v-card-actions>
          <v-spacer align="left">
            <v-btn
              v-if="userPhoto"
              flat
              color="error darken-1"
              v-on:click="deletePhoto"
            >Delete
            </v-btn>
          </v-spacer>
          <v-spacer align="right">
            <v-btn
              flat
              color="success darken-1"
              v-on:click="uploadPhoto"
            >Upload
            </v-btn>
            <v-btn
              flat
              color="error darken-1"
              v-on:click="dialog = false"
            >Close
            </v-btn>
          </v-spacer>
        </v-card-actions>
      </v-card>

    </v-dialog>
    <!-- Warning Prompts -->
    <prompt-dialog
      :dialog="warningMessage.showPromptDialog"
      :message="warningMessage.message"
      :onConfirm="warningMessage.confirmationFunction"
      v-on:promptEnded="promptEnded"
    />
  </div>
</template>

<script>

  import {deleteProfilePhoto, putProfilePhoto} from "../../ProfileService";
  import PromptDialog from "../../../App/PromptDialog/PromptDialog";

  export default {

    name: "upload-photo-dialog",
    components: {PromptDialog},
    props: {
      userPhoto: {
        type: String
      }
    },

    data() {
      return {
        dialog: false,
        isDragging: false,
        dragCount: 0,
        imageName: '',
        imageFile: '',
        imageUrl: '',
        warningMessage: {
          showPromptDialog: false,
          message: "",
          confirmationFunction: null
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

      /**
       * Closes the warning dialog.
       */
      promptEnded: function() {
        this.warningMessage.showPromptDialog = false;
      },

      /**
       * Displays a warning prompt to the user.
       */
      displayPrompt: function(prompt) {
        this.warningMessage = prompt;
      },

      /**
       * Method to close the dialog and rest the error messages and image variables.
       */
      closeDialog: function () {
        this.dialog = false;
        this.imageName = "";
        this.imageUrl = "";
        this.imageFile = "";
      },

      /**
       * Method called when the user selects an image.
       * @param event the event that triggers this method.
       */
      onInputChange: function (event) {
        const files = event.target.files;
        this.processFile(files);
      },

      /**
       * This method is called when the user drags a file into the drop zone for file upload.
       * @param event the event that triggers this method.
       */
      onDragEnter: function (event) {
        event.preventDefault();
        this.dragCount++;
        this.isDragging = true;
      },

      /**
       * Method called when the user is dragging a file and leaves the drop zone.
       * @param event the event that triggers this method.
       */
      onDragLeave: function (event) {
        event.preventDefault();
        this.dragCount--;
        if (this.dragCount <= 0) {
          this.isDragging = false;
        }
      },

      /**
       * Method called when a file is dropped in the drop zone.
       * @param event the event that triggers this method.
       */
      onDrop: function (event) {
        const files = event.dataTransfer.files;
        this.processFile(files);
        event.preventDefault();
        event.stopPropagation();

        this.isDragging = false;
      },

      /**
       * Method called to process a file input by the user.
       * @param files a list of files selected by the user.
       */
      processFile: function (files) {
        if (files.length > 0 && ["image/png", "image/jpeg"].includes(files[0].type)) {
          this.imageName = files[0].name;
          const fileReader = new FileReader();
          fileReader.readAsDataURL(files[0]);
          fileReader.addEventListener('load', () => {
            this.imageUrl = fileReader.result;
            this.imageFile = files[0];
          })
        } else if (files.length === 0) {
          this.imageName = '';
          this.imageFile = '';
          this.imageUrl = '';
        }
      },

      /**
       * Method called when the delete photo button is pressed.
       * Creates a prompt window for the user to decide whether or not to delete the photo.
       * Calls the deletePhotoCallback method on confirmation.
       */
      deletePhoto: async function () {
        this.displayPrompt({
          showPromptDialog: true,
          message: "This deletion will be permanent.\nAre you sure you want to delete your profile photo?",
          confirmationFunction: this.deletePhotoCallback
        });
      },

      /**
       * Callback method to delete a photo, called if the user confirms the deletion.
       * Makes a request to the server to delete the current profile photo.
       */
      deletePhotoCallback: async function () {
        try {
          let response = await deleteProfilePhoto();
          if (response.status === 200) {
            this.$router.go(0);
          }
        } catch (error) {
          if ([401, 403].includes(error.status)) {
            this.$emit("displayMessage", {
              text: "Error: " + error.message,
              color: "red",
              showSnackbar: true
            });
            // Forbidden, you do not have permission to perform this action.
          } else if (error.status === 404) {
            this.$emit("displayMessage", {
              text: "Error: " + error.message,
              color: "red",
              showSnackbar: true
            });
            // User not found
            this.$emit("loggedOut")
          }
        }
      },

      /**
       * Method called when the choose file input is selected.
       * Opens the file browser window.
       */
      pickFile: function () {
        this.$refs.image.click();
      },

      /**
       * Method called when the image name is changed.
       * If the image is set to null, updates the other image fields to match.
       */
      onImageNameChanged: function () {
        if (this.imageName === null) {
          this.imageFile = '';
          this.imageUrl = '';
        }
      },

      /**
       * Method called when the upload button is pressed.
       * Checks the file is valid and sends it in a http request to the server. Handles errors appropriately.
       */
      uploadPhoto: function () {
        const fileType = this.imageFile.type;
        const fileSize = this.imageFile.size;
        if (fileSize > 20971520) {
          this.$emit("displayMessage", {
            text: "Error: File size too large, limit is 20mb",
            color: "red",
            showSnackbar: true
          });
          // Image is too large, please resize or chose another image
        } else {
          let fileReader = new FileReader();
          fileReader.readAsArrayBuffer(this.imageFile);
          fileReader.addEventListener("load", async () => {
            const fileContents = fileReader.result;
            try {
              let response = await putProfilePhoto(fileContents, fileType);
              if ([200, 201].includes(response.status)) {
                // Profile Picture Updated Successfully
                this.$router.go(0);
              }
            } catch (error) {
              if ([400, 401, 403].includes(error.status)) {
                this.$emit("displayMessage", {
                  text: "Error: " + error.message,
                  color: "red",
                  showSnackbar: true
                });
              } else if (error.status === 404) {
                this.$emit("displayMessage", {
                  text: "Error: User not found, please log in again",
                  color: "red",
                  showSnackbar: true
                });
                // User not found
                this.$emit("loggedOut");
              }
            }
          });
        }
      }

    }

  }

</script>

<style lang="scss" scoped>

  @import "../../../../Resources/StyleSheets/variables";

  .v-card {
    background-color: $lighter-secondary;
  }

  .upload-photo-btn {
    right: 30px;
    bottom: 30px;
    z-index: 1;
  }

  .title-text {
    color: $lighter-secondary;
    font-size: 23px;
    justify-content: center;
  }

  .image-preview {
    margin: 10px;
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
        width: 300px;
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
      width: 300px;
    }
  }

</style>
