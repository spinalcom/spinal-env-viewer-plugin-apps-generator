import Vue from 'vue';
const {
  SpinalContextApp
} = require('spinal-env-viewer-context-menu-service');
import {
  SpinalGraphService
} from 'spinal-env-viewer-graph-service';
const {
  spinalPanelManagerService,
  SpinalMountExtention
} = require('spinal-env-viewer-panel-manager-service');
const {
  SpinalForgeExtention,
} = require('spinal-env-viewer-panel-manager-service_spinalforgeextention');
import index from '../view/mainVue/index.vue';
import editComponent from '../view/edit/edit.vue'
const {
  spinalContextMenuService,
} = require('spinal-env-viewer-context-menu-service');
const circularMenuHookName = 'circularMenu';
const SideBarHookName = 'GraphManagerSideBar';
const appName = "appsGenerator"
const appNameEdit = "appsGeneratorEdit"
import { isShownType, nodeTypeApp } from '../service/appsService'
////////////////////////////////////////////////////////////////////////////////////////////////////
//                                apps Panel                                                      //
////////////////////////////////////////////////////////////////////////////////////////////////////


export class appsGeneratorButton extends SpinalContextApp {
  constructor() {
    super('appsGenerator', 'appsGenerator', {
      icon: 'screen_share',
      icon_type: 'in',
      backgroundColor: '#356BAB',
      fontColor: '#FFFFFF',
    });
  }

  isShown(option) {
    if (isShownType.indexOf(option.selectedNode.type.get()) > -1) {
      return Promise.resolve(true)
    } else {
      return Promise.resolve(-1)
    }

  }

  action(option) {
    spinalPanelManagerService.openPanel(appName, option);
  }
}

export class appsGeneratorEditButton extends SpinalContextApp {
  constructor() {
    super('appsGeneratorEdit', 'appsGeneratorEdit', {
      icon: 'screen_share',
      icon_type: 'in',
      backgroundColor: '#356BAB',
      fontColor: '#FFFFFF',
    });
  }

  isShown(option) {
    if (option.selectedNode.type.get() == nodeTypeApp) {
      return Promise.resolve(true)
    } else {
      return Promise.resolve(-1)
    }
  }

  action(option) {
    spinalPanelManagerService.openPanel(appNameEdit, option);
  }
}
// SpinalForgeExtention.registerExtention(appName, appsGenerator);

spinalContextMenuService.registerApp(
  SideBarHookName,
  new appsGeneratorButton(),
  [7]
);
spinalContextMenuService.registerApp(
  SideBarHookName,
  new appsGeneratorEditButton(),
  [7]
);

const dialogLst = [{
  name: appName,
  vueMountComponent: Vue.extend(index),
  parentContainer: document.body
}, {
  name: appNameEdit,
  vueMountComponent: Vue.extend(editComponent),
  parentContainer: document.body
}];

for (let i = 0; i < dialogLst.length; i++) {
  SpinalMountExtention.mount(dialogLst[i]);
}