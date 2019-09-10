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
  <v-app dark>
    <v-dialog v-model="showDialog"
              :persistent="true"
              max-width="600">
      <v-card>
        <v-card-title class=" deleteBottomPadding">
          <span class="headline marginCentered">Apps Profile</span>
        </v-card-title>
        <v-card-text class="deletePadding">
          <v-container class="deleteHeightPadding"
                       grid-list-md>
            <v-layout wrap>
              <v-flex xs12>
                <v-select :items="sceneLst"
                          v-model="selectedScene"
                          label="Select your scene"></v-select>
              </v-flex>
              <v-flex xs6>
                <v-combobox v-model="selectedusers"
                            :items="userLst"
                            :search-input="searchUser"
                            label="Add some user"
                            hide-selected
                            multiple
                            persistent-hint
                            small-chips
                            clearable>
                  <template v-if="noData"
                            v-slot:no-data>
                    <v-list-item>
                      <v-list-item-content>
                        <v-list-item-title>
                          No results matching
                          "<strong>{{ searchUser }}</strong>".
                        </v-list-item-title>
                      </v-list-item-content>
                    </v-list-item>
                  </template>
                </v-combobox>
              </v-flex>
              <v-flex xs6>
                <v-combobox v-model="selectedRole"
                            :items="roleLst"
                            :search-input="searchRole"
                            label="Add some role"
                            hide-selected
                            multiple
                            persistent-hint
                            small-chips
                            clearable>
                  <template v-if="noData"
                            v-slot:no-data>
                    <v-list-item>
                      <v-list-item-content>
                        <v-list-item-title>
                          No results matching
                          "<strong>{{ searchRole }}</strong>".
                        </v-list-item-title>
                      </v-list-item-content>
                    </v-list-item>
                  </template>
                </v-combobox>
              </v-flex>
              <v-flex xs6>
                <v-text-field maxlength="23"
                              label="Title*"
                              v-model="title"
                              hint="Title of your application in BOC"
                              required>
                </v-text-field>
              </v-flex>
              <v-flex xs6
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
              <v-flex xs12>
                <v-textarea maxlength="123"
                            rows="3"
                            name="input-7-1"
                            label="Description"
                            v-model="description">
                </v-textarea>
              </v-flex>
            </v-layout>
            <v-card outlined
                    class="marginCentered"
                    max-width='400'>
              <v-img :src="image.imageUrl"
                     height="200"></v-img>
              <v-card-title primary-title>
                <v-flex xs12>
                  <v-flex xs12
                          class="overflowEllips">
                    <h3 class="headline mb-0">{{title}}</h3>
                    <v-flex xs12
                            class="overflowEllips">
                      <v-card-text>
                        {{ description }}
                      </v-card-text>
                    </v-flex>
                  </v-flex>
                </v-flex>
              </v-card-title>
            </v-card>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <div v-ripple>
            <v-btn color="blue"
                   text
                   @click="showDialog = false">Close</v-btn>
            <v-btn @click="saveApps"
                   color="blue"
                   text
                   outlined>Save</v-btn>
          </div>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-app>
</template>

<script>
import appsService from "../../service/appsService";
import { constants } from "crypto";
export default {
  name: "index",
  data() {
    return {
      selectedContext: undefined,
      showDialog: true,
      userLst: null,
      searchUser: null,
      selectedusers: [],
      roleLst: null,
      selectedRole: [],
      searchRole: null,
      sceneLst: [],
      selectedScene: null,
      searchScene: null,
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
      this.selectedContext = option.selectedNode;
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
      appsService.getScene().then(sceneLst => {
        this.sceneLst = sceneLst;
      });
      appsService
        .getUsers()
        .then(userLst => {
          this.userLst = userLst;
        })
        .catch(console.error);
      appsService
        .getRole()
        .then(roleLst => {
          this.roleLst = roleLst;
        })
        .catch(console.error);
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
            // img.src = fr.result;
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
    saveApps() {
      let info = {
        selectedContext: this.selectedContext,
        title: this.title,
        description: this.description,
        image: this.image,
        selectedUser: this.selectedusers,
        selectedRole: this.selectedRole,
        selectedScene: this.selectedScene
      };
      if (
        info.selectedContext &&
        info.title &&
        info.title != "" &&
        info.description &&
        info.description != "" &&
        info.image &&
        info.selectedUser.length != 0 &&
        info.selectedRole.length != 0 &&
        info.selectedScene != null
      ) {
        appsService.saveApps(info);
        this.showDialog = false;
      }
    }
  },
  watch: {
    selectedusers(val) {
      for (let i = 0; i < val.length; i++) {
        const element = val[i];
        if (!this.userLst.includes(element)) {
          val.splice(i, 1);
        }
      }
      if (val.length > this.userLst.length) {
        this.$nextTick(() => this.selectedusers.pop());
      }
    },
    selectedRole(val) {
      for (let i = 0; i < val.length; i++) {
        const element = val[i];
        if (!this.roleLst.includes(element)) {
          val.splice(i, 1);
        }
      }
      if (val.length > this.roleLst.length) {
        this.$nextTick(() => this.selectedRole.pop());
      }
    }
  }
};
</script>

<style scoped>
.overflowEllips {
  word-break: break-word;
}
.marginCentered {
  margin-left: auto;
  margin-right: auto;
}
.deleteBottomPadding {
  padding-bottom: 0px;
}
.deletePadding {
  padding: 0px;
}
.deleteHeightPadding {
  padding-bottom: 0px;
  padding-top: 0px;
}
</style>
