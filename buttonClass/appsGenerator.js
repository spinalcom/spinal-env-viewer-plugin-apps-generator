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
const {
  spinalContextMenuService,
} = require('spinal-env-viewer-context-menu-service');
const circularMenuHookName = 'circularMenu';
const SideBarHookName = 'GraphManagerSideBar';
const appName = "appsGenerator"
////////////////////////////////////////////////////////////////////////////////////////////////////
//                                Documentation Panel                                             //
////////////////////////////////////////////////////////////////////////////////////////////////////


// export const appsGenerator = SpinalForgeExtention.createExtention({
//   name: appName,
//   vueMountComponent: Vue.extend(index),
//   // toolbar is optional

//   panel: {
//     title: appName,
//     classname: 'spinal-pannel',
//     closeBehaviour: 'remove', // if something else panel is deleted
//   },

//   onload: () => {},
//   onUnLoad: () => {},
// });

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
    return Promise.resolve(true)
  }

  action(option) {
    spinalPanelManagerService.openPanel(appName, option);
  }
}

// SpinalForgeExtention.registerExtention(appName, appsGenerator);

spinalContextMenuService.registerApp(
  SideBarHookName,
  new appsGeneratorButton(),
  [7]
);

const dialogsRename = [{
  name: appName,
  vueMountComponent: Vue.extend(index),
  parentContainer: document.body
}];

for (let i = 0; i < dialogsRename.length; i++) {
  SpinalMountExtention.mount(dialogsRename[i]);
}





// /////////////////////////:
// class SpinalContextRename extends SpinalContextApp {
//   constructor() {
//     super("Rename button", "rename", {
//       icon: "text_format",
//       icon_type: "in",
//       backgroundColor: "#FF0000",
//       fontColor: "#FFFFFF"
//     });
//   }

//   isShown(option) {
//     // const type = option.selectedNode.type.get();
//     // if (type === "SpinalService" || type === "scene" || type ===
//     //   "SpinalContext" || type === "BimFile")
//     //   return (Promise.resolve(-1))
//     return (Promise.resolve(true));
//   }

//   action(option) {
//     spinalPanelManagerService.openPanel("standardButtonRename", option);
//   }
// }
// spinalContextMenuService.registerApp("GraphManagerSideBar",
//   new SpinalContextRename(), [3]);

// const dialogsRename = [{
//   name: "standardButtonRename",
//   vueMountComponent: vue.extend(dialogRenameComponent),
//   parentContainer: document.body
// }];

// for (let index = 0; index < dialogsRename.length; index++) {
//   SpinalMountExtention.mount(dialogsRename[index]);
// }