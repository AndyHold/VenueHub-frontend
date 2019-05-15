<template>
  <v-dialog
    v-model="dialog"
    width="500"
    persistent
  >
    <v-card>
      <v-card-title class="warning headline">
        <v-spacer align="center">
          <h2>Warning</h2>
        </v-spacer>
      </v-card-title>
      <v-card-text>
        <v-flex>
          <pre>{{ message }}</pre>
        </v-flex>
      </v-card-text>
      <v-responsive>
        <v-layout row>
          <v-spacer align="center">
            <v-btn color="green" flat v-on:click="sendResponse(true)">Confirm</v-btn>
          </v-spacer>
          <v-spacer align="center">
            <v-btn color="red" flat v-on:click="sendResponse(false)">Cancel</v-btn>
          </v-spacer>
        </v-layout>
      </v-responsive>
    </v-card>
  </v-dialog>
</template>

<script>

  export default {

    name: "prompt-dialog",

    props: {
      dialog: {
        type: Boolean,
        required: true
      },
      message: {
        type: String,
        required: true
      },
      onConfirm: {
        type: Function,
        required: false
      }
    },

    methods: {

      sendResponse: function(response) {
        if (response && this.onConfirm) {
          this.onConfirm();
        }
        this.$emit("promptEnded", response);
      }

    }
  }
</script>

<style lang="scss" scoped>

  @import "../../../Resources/StyleSheets/variables";

  .v-card {
    background-color: $lighter-secondary;
  }

  h2{
    color: $lighter-secondary;
  }

  pre {
    white-space: pre-wrap;       /* Since CSS 2.1 */
    white-space: -moz-pre-wrap;  /* Mozilla, since 1999 */
    white-space: -pre-wrap;      /* Opera 4-6 */
    white-space: -o-pre-wrap;    /* Opera 7 */
    word-wrap: break-word;       /* Internet Explorer 5.5+ */
    font-family: 'Roboto', sans-serif;
    font-size: 14px;
    text-align: center;
  }

</style>
