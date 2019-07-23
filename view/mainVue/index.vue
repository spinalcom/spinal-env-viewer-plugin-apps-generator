<!--
Copyright 2018 SpinalCom - www.spinalcom.com

This file is part of SpinalCore.

Please read all of the following terms and conditions
of the Free Software license Agreement ("Agreement")
carefully.

This Agreement is a legally binding contract between
the Licensee (as defined below) and SpinalCom that
sets forth the terms and conditions that govern your
use of the Program. By installing and/or using the
Program, you agree to abide by all the terms and
conditions stated or referenced herein.

If you do not agree to abide by these terms and
conditions, do not demonstrate your acceptance and do
not install or use the Program.
You should have received a copy of the license along
with this file. If not, see
<http://resources.spinalcom.com/licenses.pdf>.
-->


<template>
  <div>
    <!-- <md-dialog :md-active.sync="showDialog"
               @md-closed="closeDialog()">
      <md-dialog-title>apps generator</md-dialog-title>
      <md-dialog-content>
        <md-field>
          <md-input></md-input>
        </md-field>
      </md-dialog-content>
      <md-dialog-actions>
        <md-button @click="showDialog = false">Cancel</md-button>
        <md-button>Accepte</md-button>
      </md-dialog-actions>
    </md-dialog> -->
    <v-dialog dark
              v-model="showDialog"
              :persistent="true"
              max-width="600">
      <v-card>
        <v-card-title>
          <span class="headline">Apps Profile</span>
        </v-card-title>
        <v-card-text>
          <v-container grid-list-md>
            <v-layout wrap>

              <v-flex xs12>
                <v-text-field maxlength="27"
                              label="Title*"
                              v-model="title"
                              hint="This title will appared in Building Operation Center"
                              required>
                </v-text-field>
              </v-flex>
              <v-flex xs12>
                <v-textarea maxlength="130"
                            rows="3"
                            name="input-7-1"
                            label="Description"
                            v-model="description">
                </v-textarea>
              </v-flex>
              <v-flex xs12
                      class="text-xs-center text-sm-center text-md-center text-lg-center">
                <v-text-field label="Select Image"
                              @click='pickFile'
                              v-model='image.imageName'
                              prepend-icon='attach_file'></v-text-field>
                <input type="file"
                       style="display: none"
                       ref="image"
                       accept="image/*"
                       @change="onFilePicked">
              </v-flex>
            </v-layout>
            <v-card class="marginCentered"
                    max-width='400'
                    light>
              <v-img :src="image.imageUrl"
                     height="200"></v-img>
              <v-card-title primary-title>
                <v-flex xs12>
                  <v-flex xs12
                          class="overflowEllips">
                    <h3 class="headline mb-0">{{title}}</h3>
                    <v-flex xs12
                            class="overflowEllips"> {{ description }} </v-flex>
                  </v-flex>
                </v-flex>
              </v-card-title>
            </v-card>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1"
                 flat
                 @click="showDialog = false">Close</v-btn>
          <v-btn color="blue darken-1"
                 flat
                 @click="saveApps">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { constants } from "crypto";
export default {
  name: "index",
  data() {
    return {
      showDialog: true,
      title: "",
      description: "",
      imageSizeBool: false,
      image: {
        imageName: "",
        imageFile: "",
        imageUrl: "",
        size: "",
        height: "",
        width: ""
      }
    };
  },
  components: {},
  methods: {
    opened(option) {
      console.log(option);

      this.title = "";
      this.description = "";
      this.image = {
        imageName: "",
        imageFile: "",
        imageUrl: "",
        size: "",
        height: "",
        width: ""
      };
      this.showDialog = true;
    },
    removed(option, viewer) {},
    closed(option, viewer) {},
    closeDialog() {},
    pickFile() {
      this.$refs.image.click();
    },
    onFilePicked(e) {
      const files = e.target.files;
      const MAX_WIDTH = 400;
      const MAX_HEIGHT = 200;
      if (files[0] !== undefined) {
        this.image.imageName = files[0].name;
        if (this.image.imageName.lastIndexOf(".") <= 0) {
          return;
        }
        this.image.size = files[0].size;
        const fr = new FileReader();
        fr.readAsDataURL(files[0]);
        fr.addEventListener("load", () => {
          let img = new Image();
          img.onload = () => {
            this.image.width = img.width;
            this.image.height = img.height;
            if (
              this.image.width > MAX_WIDTH ||
              this.image.height > MAX_HEIGHT
            ) {
              imageSizeBool = true;
            }
            img.src = fr.result;
            // this is an image file that can be sent to server...
          };
          this.image.imageUrl = fr.result;
          this.image.imageFile = files[0];
        });
      } else {
        this.image.imageName = "";
        this.image.imageFile = "";
        this.image.imageUrl = "";
      }
    },
    saveApps() {}
  }
};
</script>

<style>
.overflowEllips {
  word-break: break-word;
}
.marginCentered {
  margin-left: auto;
  margin-right: auto;
}
</style>
