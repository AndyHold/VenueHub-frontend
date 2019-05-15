<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <div id="edit-profile-dialog">
    <v-dialog
    v-model="dialog"
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

    <v-card>
      <v-card-title
        class="headline primary title-text"
        color="primary darken-1"
      >
        Edit your profile
      </v-card-title>

      <v-card-text>
        <v-form
          ref="form"
          v-model="validForm"
        >
          <v-container grid-list-md>
            <v-layout wrap>

              <!-- Given Name -->
              <v-flex xs12 sm6 md6>
                <v-text-field
                  label="First Name"
                  hint="Enter your given name here"
                  :value="givenName"
                  v-model="givenName"
                  :rules="nameRules"
                  :counter="128"
                  required
                  v-on:keyup.enter="editUser"
                ></v-text-field>
              </v-flex>

              <!-- Family Name -->
              <v-flex xs12 sm6 md6>
                <v-text-field
                  label="Last Name"
                  hint="Enter your family name here"
                  :value="familyName"
                  v-model="familyName"
                  :rules="nameRules"
                  :counter="128"
                  required
                  v-on:keyup.enter="editUser"
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
                  :rules="passwordRules"
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
                  :rules="passwordRules"
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
                  :rules="passwordRules"
                  :error-messages="newPasswordErrors"
                  v-on:keyup.enter="editUser"
                ></v-text-field>
              </v-flex>

              <v-flex xs12>
                <p class="information">Please change the fields you wish to edit</p>
              </v-flex>

            </v-layout>
          </v-container>
        </v-form>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          flat
          color="success darken-1"
          v-on:click="editUser"
        >Accept
        </v-btn>
        <v-btn
          flat
          color="error darken-1"
          @click="closeDialog"
        >Close
        </v-btn>
      </v-card-actions>
    </v-card>

  </v-dialog>
  </div>
</template>

<script>

  import {rules, sendEditUserRequest} from "../../ProfileService";
  import {sendLoginRequest} from "../../../../Utilities/loginPortal";

  export default {

    name: "edit-profile-dialog",

    props: {
      user: {
        type: Object,
        required: true,
        givenName: {
          type: String,
          required: true
        },
        familyName: {
          type: String,
          required: true
        }
      }
    },

    data() {
      return {
        dialog: false,
        givenName: "",
        familyName: "",
        validForm: false,
        passwordRules: [rules.stringLessThanLimit(256)],
        nameRules: [rules.requiredString, rules.stringLessThanLimit(128)],
        newPassword: '',
        oldPassword: '',
        confirmNewPassword: '',
        editPassword: false,
        oldPasswordIsValid: false,
        oldPasswordErrors: [],
        newPasswordIsValid: false,
        newPasswordErrors: [],
        hasValidEditData: false
      }
    },

    watch: {
      user: {
        handler: "onUserChanged",
        deep: true,
        immediate: true
      }
    },

    methods: {

      /**
       * Method called when a users info is changed.
       */
      onUserChanged: function () {
        this.givenName = this.user.givenName;
        this.familyName = this.user.familyName;
      },

      /**
       * Method to close the dialog and reset the error lists.
       */
      closeDialog: function() {
        this.dialog = false;
        this.$refs.form.resetValidation();
        this.newPasswordErrors = [];
        this.oldPasswordErrors = [];
      },

      /**
       * Method called when the edit user button is pressed.
       * Sends a request to the server to update the user and handles the response appropriately.
       */
      editUser: async function () {
        this.validateAll();
        if (this.hasValidEditData) {
          let user = {};
          let userChanged = false;
          if (this.givenName !== this.user.givenName) {
            user.givenName = this.givenName;
            userChanged = true;
          }
          if (this.familyName !== this.user.familyName) {
            user.familyName = this.familyName;
            userChanged = true;
          }
          if (this.newPassword) {
            user.password = this.newPassword;
            userChanged = true;
          }
          if (userChanged) {
            try {
              const response = await sendEditUserRequest(user);
              if (response.status === 200) {
                this.$emit("displayMessage", {
                  text: "Change successful",
                  color: "green",
                  showSnackbar: true
                });
                this.$emit("userChanged", {
                  givenName: this.givenName,
                  familyName: this.familyName
                });
                this.dialog = false;
              }
            } catch (error) {
              if (error.status === 400) {
                this.newPasswordErrors.push("Please make a valid change to proceed");
                this.newPasswordIsValid = false;
              } else if (error.status === 401 || error.status === 403) {
                this.oldPasswordErrors.push("Authentication failed, please enter your current password again");
                this.oldPasswordIsValid = false;
              } else if (error.status === 404) {
                this.$emit("displayMessage", {
                  text: "Error: User not found, please log in again",
                  color: "red",
                  showSnackbar: true
                });
                this.dialog = false;
                localStorage.removeItem("authToken");
                localStorage.removeItem("userId");
                this.$emit("loggedOut");
              } else {
                this.$emit("displayMessage", {
                  text: "Error: Server error, please try again later",
                  color: "red",
                  showSnackbar: true
                });
              }
            }
          } else {
            this.$emit("displayMessage", {
              text: "No changes made",
              color: "yellow",
              showSnackbar: true
            });
            this.closeDialog();
          }
        }
      },

      /**
       * Method to validate the old password field.
       * Sends a request to the back end to check if the entered password is correct.
       * Updates the users authentication token if successful and handles errors appropriately if not.
       */
      validateOldPassword: async function () {
        try {
          let response = await sendLoginRequest({"username": this.user.username, "password": this.oldPassword});
          if (response.status === 200) {
            this.oldPasswordIsValid = true;
            this.oldPasswordErrors = [];
            localStorage.setItem("authToken", response.body.token);
          }
        } catch (error) {
          this.oldPasswordIsValid = false;
          this.oldPasswordErrors.push("Incorrect password, please try again")
        }
      },

      /**
       * Method to validate the new password field.
       * simply checks that the confirm password field is the same as the new password field.
       */
      validateNewPassword: function () {
        if (this.newPassword !== this.confirmNewPassword) {
          this.newPasswordIsValid = false;
          this.newPasswordErrors.push("Your passwords do not match, please try again");
        } else {
          this.newPasswordIsValid = true;
          this.newPasswordErrors = [];
        }
      },

      /**
       * Method called to check the validation of all fields in the form before sending the edit user request.
       */
      validateAll: function () {
        this.$refs.form.validate();
        if (this.newPassword) {
          this.validateNewPassword();
          this.validateOldPassword();
          this.hasValidEditData = (this.newPasswordIsValid && this.oldPasswordIsValid && this.validForm);
        } else {
          this.hasValidEditData = this.validForm;
        }
      }
    }

  }

</script>

<style lang="scss" scoped>

  @import "../../../../Resources/StyleSheets/commonStyles";

  .edit-profile-btn {
    right: 15px;
    bottom: 15px;
    z-index: 1;
  }

  .information {
    -webkit-text-fill-color: $error;
    text-align: right;
  }

</style>
