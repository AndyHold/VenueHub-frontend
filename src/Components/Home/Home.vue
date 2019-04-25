<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
    <div id="home">
      <div>
        <navigation-menu></navigation-menu>
        <h2>Welcome to</h2>
        <h1>Venue Hub</h1>
        <v-flex>
          <v-layout row>
            <v-dialog
              v-model="loginDialog"
              persistent
              width="500"
              >
                <template v-slot:activator="{ on }">
                <v-btn
                  class="home-button"
                  block
                  color="primary darken-1"
                  round
                  v-on="on"
                  >
                  Login
                </v-btn>
              </template>

              <v-card>
                <v-card-title
                  class="headline primary title-text"
                  primary-title
                  >
                  Enter Login Details:
                </v-card-title>

                <v-card-text>
                  <v-container grid-list-md>
                    <v-layout wrap>

                      <v-flex xs12>
                        <v-text-field
                          label="Username or Email*"
                          hint="Username or Email must be provided"
                          :value="userIdentity"
                          v-model="userIdentity"
                          @focus="userIdentityErrors = []"
                          @blur="validateUserIdentity"
                          :error-messages="userIdentityErrors"
                          v-on:keyup.enter="login"
                        ></v-text-field>
                      </v-flex>

                      <v-flex xs12>
                        <v-text-field
                          label="Password*"
                          type="password"
                          hint="Enter your password here"
                          :value="loginPassword"
                          v-model="loginPassword"
                          @focus="loginPasswordErrors = []"
                          @blur="validateLoginPassword"
                          :error-messages="loginPasswordErrors"
                          v-on:keyup.enter="login"
                        ></v-text-field>
                      </v-flex>

                      <v-flex xs12>
                        <p class="warning-header">Mandatory fields marked with *</p>
                      </v-flex>

                    </v-layout>
                  </v-container>
                </v-card-text>

                <v-card-actions>
                  <v-spacer align="right">
                    <v-btn class="normal-button" color="success darken-1" flat @click="login">Accept</v-btn>
                    <v-btn class="normal-button" color="error darken-1" flat @click="closeLoginModal">Close</v-btn>
                  </v-spacer>
                </v-card-actions>
              </v-card>
            </v-dialog>
            <v-dialog
              v-model="signupDialog"
              persistent
              width="500"
            >
              <template v-slot:activator="{ on }">
                <v-btn
                  class="home-button"
                  block
                  color="primary darken-1"
                  round
                  v-on="on"
                >
                  Sign Up
                </v-btn>
              </template>

              <v-card>
                <v-card-title
                  class="headline primary title-text"
                  primary-title
                >
                  Enter Your Details:
                </v-card-title>

                <v-card-text>
                  <v-container grid-list-md>
                    <v-layout wrap>

                      <v-flex xs12 sm6 md6>
                        <v-text-field
                          label="First Name*"
                          hint="Enter your given name here"
                          :value="newUser.givenName"
                          v-model="newUser.givenName"
                          @focus="givenNameErrors = []"
                          @blur="validateGivenName"
                          :error-messages="givenNameErrors"
                          v-on:keyup.enter="signup"
                        ></v-text-field>
                      </v-flex>

                      <v-flex xs12 sm6 md6>
                        <v-text-field
                          label="Last Name*"
                          hint="Enter your family name here"
                          :value="newUser.familyName"
                          v-model="newUser.familyName"
                          @focus="familyNameErrors = []"
                          @blur="validateFamilyName"
                          :error-messages="familyNameErrors"
                          v-on:keyup.enter="signup"
                        ></v-text-field>
                      </v-flex>

                      <v-flex xs12>
                        <v-text-field
                          label="Username*"
                          hint="Enter your desired username here"
                          :value="newUser.username"
                          v-model="newUser.username"
                          @focus="usernameErrors = []"
                          @blur="validateUsername"
                          :error-messages="usernameErrors"
                          v-on:keyup.enter="signup"
                        ></v-text-field>
                      </v-flex>

                      <v-flex xs12>
                        <v-text-field
                          label="Email*"
                          hint="Enter your email here"
                          :value="newUser.email"
                          v-model="newUser.email"
                          @focus="emailErrors = []"
                          @blur="validateEmail"
                          :error-messages="emailErrors"
                          v-on:keyup.enter="signup"
                        ></v-text-field>
                      </v-flex>

                      <v-flex xs12>
                        <v-text-field
                          label="Password*"
                          type="password"
                          hit="Enter your password here"
                          :value="newUser.password"
                          v-model="newUser.password"
                          @focus="passwordErrors = []"
                          @blur="validatePassword"
                          :error-messages="passwordErrors"
                          v-on:keyup.enter="signup"
                        ></v-text-field>
                      </v-flex>

                      <v-flex xs12>
                        <v-text-field
                          label="Confirm Password*"
                          type="password"
                          hit="Enter your password again here"
                          :value="confirmPassword"
                          v-model="confirmPassword"
                          @focus="passwordErrors = []"
                          @blur="validatePassword"
                          :error-messages="passwordErrors"
                          v-on:keyup.enter="signup"
                        ></v-text-field>
                      </v-flex>

                      <v-flex xs12>
                        <p class="warning-header">Mandatory fields marked with *</p>
                      </v-flex>
                    </v-layout>
                  </v-container>
                </v-card-text>

                <v-card-actions>
                  <v-spacer align="right">
                    <v-btn class="normal-button" color="success darken-1" flat @click="signup">Accept</v-btn>
                    <v-btn class="normal-button" color="error darken-1" flat @click="closeSignUpModal">Close</v-btn>
                  </v-spacer>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </v-layout>
        </v-flex>
      </div>
    </div>
</template>

<script>
  import {sendLoginRequest, sendSignUpRequest} from "./../../Utilities/loginPortal";
  import UserStorage from "../../DataStorage/UserStorage";
  import {getUser} from "./HomeService";
  import NavigationMenu from "../App/NavigationMenu/NavigationMenu";

  export default {
    name: "Home",

    components: {NavigationMenu},

    data() {
      return {
        newUser: {
          "username": null,
          "email": null,
          "givenName":null,
          "familyName":null,
          "password": null,
        },
        confirmPassword: null,
        loginDialog: false,
        signupDialog: false,
        userIdentity: null,
        loginPassword: null,
        hasValidUserIdentity: false,
        userIdentityErrors: [],
        hasValidLoginPassword: false,
        loginPasswordErrors: [],
        hasValidLoginInput: false,
        hasValidGivenName: false,
        givenNameErrors: [],
        hasValidFamilyName: false,
        familyNameErrors: [],
        hasValidUsername: false,
        usernameErrors: [],
        hasValidEmail: false,
        emailErrors: [],
        hasValidPassword: false,
        passwordErrors: [],
        hasValidSignUpInput: false,
        // TODO: swap this with the one from the story guide
        // taken from https://vuejs.org/v2/cookbook/form-validation.html
        emailExpression: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      };
    },

    methods: {
      async login() {
        let user;
        this.validateAllLoginFields();
        if (this.hasValidLoginInput) {
          if (this.emailExpression.test(this.userIdentity)) {
            user = {
              "email": this.userIdentity,
              "password": this.loginPassword
            };
          } else {
            user = {
              "username": this.userIdentity,
              "password": this.loginPassword
            };
          }
          try {
            const loginResponse = await sendLoginRequest(user);
            let loginInfo = loginResponse.body;

            localStorage.setItem("userId", loginInfo.userId);
            localStorage.setItem("authToken", loginInfo.token);
            const userInfo = await getUser(loginInfo.userId);
            UserStorage.methods.setUserData(userInfo, loginInfo.userId);
            this.$router.push('/profile');
          } catch (error) {
            console.log(error);
            this.loginPasswordErrors.push("Incorrect Username or password, please try again");
          }
        }
      },

      async signup() {
        this.validateAllSignUpFields();
        if (this.hasValidSignUpInput) {
          try {
            await sendSignUpRequest(this.newUser);
            const userResponse = await sendLoginRequest({
              "username": this.newUser.username,
              "password": this.newUser.password
            });
            const userInfo = userResponse.body;
            localStorage.setItem("userId", userInfo.userId);
            localStorage.setItem("authToken", userInfo.token);
            this.$router.push('/profile');
          } catch (error) {
            console.log(error);
            this.usernameErrors.push("Username or Email is already in use, please choose another");
            this.emailErrors.push("Username or Email is already in use, please choose another");
          }
        }

      },

      closeLoginModal() {
        this.loginDialog = false;
        this.userIdentityErrors = [];
        this.loginPasswordErrors = [];
      },

      closeSignUpModal() {
        this.signupDialog = false;
        this.givenNameErrors = [];
        this.familyNameErrors = [];
        this.usernameErrors = [];
        this.emailErrors = [];
        this.passwordErrors = [];
      },

      validateUserIdentity() {
        if (this.userIdentity) {
          if(this.emailExpression.test(this.userIdentity)) {
            if (this.userIdentity.length <= 128) {
              this.hasValidUserIdentity = true;
              this.userIdentityErrors = []
            } else {
              this.hasValidUserIdentity = false;
              this.userIdentityErrors.push(`Email is too long, character limit is 128, you have ${this.userIdentity.length}`);
            }
          } else if (this.userIdentity.length <= 64) {
            this.hasValidUserIdentity = true;
            this.userIdentityErrors = [];
          } else {
            this.hasValidUserIdentity = false;
            this.userIdentityErrors.push(`Username is too long, character limit is 64, you have ${this.userIdentity.length}`);
          }
        } else {
          this.hasValidUserIdentity = false;
          this.userIdentityErrors.push("Either username or valid email is required");
        }
      },

      validateLoginPassword() {
        // temporary just check length > 1
        if (!this.loginPassword) {
          this.hasValidLoginPassword = false;
          this.loginPasswordErrors.push("Please enter a valid password");
        } else if (this.loginPassword.length > 256) {
          this.hasValidLoginPassword = false;
          this.loginPasswordErrors.push(`Your password is too long, character limit is 256, you have ${this.loginPassword.length}`);
        } else {
          this.hasValidLoginPassword = true;
          this.loginPasswordErrors = [];
        }
      },

      validatePassword() {
        // TODO: implement strength test here.
        // temporary just check length > 1
        if (!this.newUser.password) {
          this.hasValidPassword = false;
          this.passwordErrors.push("Please enter a valid password");
        } else if (this.newUser.password.length > 256) {
          this.hasValidPassword = false;
          this.passwordErrors.push(`Your password is too long, character limit is 256, you have ${this.newUser.password.length}`);
        } else if (!this.confirmPassword) {
          this.hasValidPassword = false;
          this.passwordErrors.push("Please confirm your password");
        } else {
          if (this.newUser.password !== this.confirmPassword) {
            this.hasValidPassword = false;
            this.passwordErrors.push("Your passwords do not match, please try again");
          } else {
            this.hasValidPassword = true;
            this.passwordErrors = [];
          }
        }
      },

      validateGivenName() {
        if (!this.newUser.givenName) {
          this.hasValidGivenName = false;
          this.givenNameErrors.push("First name is required");
        } else if (this.newUser.givenName.length > 128) {
          this.hasValidGivenName = false;
          this.givenNameErrors.push(`Your first name is too long, character limit is 128, you have ${this.newUser.givenName.length}`);
        } else if (/\d/.test(this.newUser.givenName)) {
          this.hasValidGivenName = false;
          this.givenNameErrors.push("First name cannot contain numbers");
        } else {
          this.hasValidGivenName = true;
          this.givenNameErrors = [];
        }
      },

      validateFamilyName() {
        if (!this.newUser.familyName) {
          this.hasValidFamilyName = false;
          this.familyNameErrors.push("Last name is required");
        } else if (this.newUser.familyName.length > 128) {
          this.hasValidFamilyName = false;
          this.familyNameErrors.push(`Your last name is too long, character limit is 128, you have ${this.newUser.familyName.length}`);
        } else if (/\d/.test(this.newUser.familyName)) {
          this.hasValidFamilyName = false;
          this.familyNameErrors.push("Last name cannot contain numbers");
        } else {
          this.hasValidFamilyName = true;
          this.familyNameErrors = [];
        }
      },

      validateUsername() {
        if (this.newUser.username) {
          if(this.emailExpression.test(this.newUser.username)) {
            this.hasValidUsername = false;
            this.usernameErrors.push("Username cannot be an email");
          } else if (this.newUser.username.length <= 64) {
            this.hasValidUsername = true;
            this.usernameErrors = [];
          } else {
            this.hasValidUsername = false;
            this.usernameErrors.push(`Username is too long, character limit is 64, you have ${this.newUser.username.length}`);
          }
        } else {
          this.hasValidUsername = false;
          this.usernameErrors.push("Username is required");
        }
      },

      validateEmail() {
        if (this.newUser.email) {
          if (!this.emailExpression.test(this.newUser.email)) {
            this.hasValidEmail = false;
            this.emailErrors.push("This is not a valid email, please try again");
          } else if (this.newUser.email.length <= 128) {
            this.hasValidEmail = true;
            this.emailErrors = [];
          } else {
            this.hasValidEmail = false;
            this.emailErrors.push(`Email is too long, character limit is 128, you have ${this.newUser.email.length}`);
          }
        } else {
          this.hasValidEmail = false;
          this.emailErrors.push("Email is required");
        }
      },

      validateAllLoginFields() {
        this.validateUserIdentity();
        this.validateLoginPassword();
        this.hasValidLoginInput = (this.hasValidUserIdentity && this.hasValidLoginPassword);
      },

      validateAllSignUpFields() {
        this.validateGivenName();
        this.validateFamilyName();
        this.validateUsername();
        this.validateEmail();
        this.validatePassword();
        this.hasValidSignUpInput = (this.hasValidGivenName && this.hasValidFamilyName &&
          this.hasValidUsername && this.hasValidEmail && this.hasValidPassword);
      }
    }
  }
</script>

<style lang="scss" scoped>

  @import "../../Resources/StyleSheets/variables";

  .v-card {
    background-color: $lighter-secondary;
  }

  #home {
    display: flex;
    align-items: center;
    justify-content: center;
    background-image: url("../../Resources/Images/background.jpg");
    background-size: cover;
    box-shadow: inset 0 0 0 1000px rgba(0,0,0,.4);
    width: 100%;
    height: 100%;
  }

  h1 {
    font-size: 5rem;
    text-align: center;
    color: $lighter-secondary;
    text-shadow: 1px 1px 1px #000;
  }

  h2 {
    font-size: 3rem;
    text-align: center;
    color: $lighter-secondary;
  }

  .home-button {
    margin: 10px
  }

  .title-text {
    color: $lighter-secondary;
  }

  .warning-header {
    -webkit-text-fill-color: $error;
    text-align: right;
  }

</style>
