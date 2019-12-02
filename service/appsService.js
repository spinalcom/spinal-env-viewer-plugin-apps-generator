const spinalSystem = window.spinal.spinalSystem;
import { SpinalGraphService, SPINAL_RELATION_PTR_LST_TYPE } from "spinal-env-viewer-graph-service";
const relationName = "hasApps"
const relationType = SPINAL_RELATION_PTR_LST_TYPE
const nodeTypeApp = "appStore"
import {
  groupService
} from 'spinal-env-viewer-room-manager/services/service'
import { SERVICE_TYPE } from 'spinal-service-ticket/dist/Constants'
import { SCENE_RELATION_NAME, PART_RELATION_NAME, SCENE_RELATION_TYPE } from "spinal-env-viewer-plugin-scene/src/constants";
import taskService from 'spinal-env-viewer-task-service'


const isShownType = [groupService.constants.ROOMS_GROUP_CONTEXT, groupService.constants.EQUIPMENTS_GROUP_CONTEXT, SERVICE_TYPE, "EquipmentGroupContext", "geographicContext", ...taskService.VISITS.map(el => el.type)]
const availableContextType = [SERVICE_TYPE, groupService.constants.ROOMS_GROUP_CONTEXT, groupService.constants.EQUIPMENTS_GROUP_CONTEXT]

class AppsContextModel extends Model {
  constructor(title, description, userLst, roleLst, context, sceneId, file) {
    super();
    this.add_attr({
      userLst: userLst,
      context: context,
      image: new Ptr(file),
      description: description,
      title: title,
      role: roleLst,
      selectedScene: sceneId
    });
  }
}

class appsService {
  constructor() {
    this.appsLst = []
    this.users = []
    this.context = undefined
    this.bind = undefined
  }
  bindForUpdateApp() {
    if (this.context != undefined) {
      SpinalGraphService.getChildrenInContext(this.context.info.id.get(), this.context.info.id.get()).then((appsLst) => {
        this.appsLst = appsLst
      })
    }
  }
  createContext() {
    let _this = this
    return new Promise(function (resolve, reject) {
      var myInterval = setInterval(() => {
        if (_this.context != undefined) {
          clearInterval(myInterval);
          if (_this.bind == undefined)
            _this.bind = _this.context.bind(_this.bindForUpdateApp.bind(_this));
          resolve(_this.context);
        } else {
          let context = SpinalGraphService.getContext("Apps")
          if (context == undefined) {
            SpinalGraphService.addContext("Apps", "appsContext", new Model())
          } else {
            _this.context = context
          }
        }
      }, 1000);
    });


  }
  getAvailableContext() {
    let contextLst = []
    let formatedFrontLst = []
    for (let i = 0; i < availableContextType.length; i++) {
      const type = availableContextType[i];
      let context = SpinalGraphService.getContextWithType(type)
      Array.prototype.push.apply(contextLst, context);
    }
    for (let j = 0; j < contextLst.length; j++) {
      const element = contextLst[j];
      formatedFrontLst.push(element.info.name.get())
    }
    this.availableContext = contextLst
    return formatedFrontLst;
  }
  getUsers() {
    return spinalSystem.load("/etc/users").then(usersLst => {
      this.users = usersLst
      let tab = []
      for (let i = 0; i < usersLst.length; i++) {
        const element = usersLst[i];
        tab.push(element.name.get())
      }
      return (tab);
    })

  }
  getRole() {
    return spinalSystem.load("/etc/config/UserProfileLst").then(roleLst => {
      this.roles = roleLst.users
      let tab = []
      for (let i = 0; i < this.roles.length; i++) {
        const element = this.roles[i];
        tab.push(element.name.get())
      }
      return (tab);
    })
  }
  getScene() {
    let sceneList = []
    let sceneContextLst = SpinalGraphService.getContextWithType("SpinalService")
    let sceneContext = sceneContextLst[0]
    return sceneContext.getChildren(SCENE_RELATION_NAME).then(sceneLst => {
      this.scene = sceneLst
      for (let i = 0; i < sceneLst.length; i++) {
        const element = sceneLst[i];
        let obj = {
          value: element.info.id.get(),
          text: element.info.name.get()
        }
        sceneList.push(obj)
      }
      return sceneList
    })
  }
  getAllApps() {
    if (this.appsLst.length != 0) {
      return Promise.resolve(this.appsLst)
    } else {
      return this.createContext().then(res => {
        return SpinalGraphService.getChildrenInContext(res.info.id.get(), res.info.id.get()).then((appsLst) => {
          return appsLst
        })
      })
    }
  }
  getAppsByUser(user) {
    let appLst = []
    return this.getAllApps().then(res => {
      for (let i = 0; i < res.length; i++) {
        const nodeInfo = res[i];
        nodeInfo.element.ptr.load(app => {
          for (let j = 0; j < app.userLst.length; j++) {
            const userObj = app.userLst[j];
            if (userObj.name.get() == user) {
              appLst.push(nodeInfo)
            }
          }
        })
      }
      return appLst
    });
  }
  getAppsByRole(role) {
    let appLst = []
    return this.getAllApps().then(res => {
      for (let i = 0; i < res.length; i++) {
        const nodeInfo = res[i];
        nodeInfo.element.ptr.load(app => {
          for (let j = 0; j < app.roleLst.length; j++) {
            const role = app.roleLst[j];
            if (role.name.get() == role) {
              appLst.push(nodeInfo)
            }
          }
        })
      }
      return appLst
    });
  }
  saveApps(info) {
    let userLst = []
    let roleLst = []
    let scene = null;
    for (let i = 0; i < info.selectedUser.length; i++) {
      const element = info.selectedUser[i];
      for (let j = 0; j < this.users.length; j++) {
        const userModel = this.users[j];
        if (element == userModel.name.get()) {
          userLst.push(userModel)
        }
      }
    }
    for (let i = 0; i < info.selectedRole.length; i++) {
      const element = info.selectedRole[i];
      for (let j = 0; j < this.roles.length; j++) {
        const roleModel = this.roles[j];
        if (element == roleModel.name.get()) {
          roleLst.push(roleModel)
        }
      }
    }
    let filePath = new Path(info.image.imageFile);
    let nodeElement = new AppsContextModel(info.title, info.description, userLst, roleLst, info.selectedContext, info.selectedScene, filePath)
    let node = SpinalGraphService.createNode({ name: info.title, type: nodeTypeApp }, nodeElement)
    SpinalGraphService.addChildInContext(this.context.info.id.get(), node, this.context.info.id.get(), relationName, relationType)
  }
  editApps(element, info, boolImageChange) {
    let userLst = []
    let roleLst = []
    for (let i = 0; i < info.selectedUser.length; i++) {
      const element = info.selectedUser[i];
      for (let j = 0; j < this.users.length; j++) {
        const userModel = this.users[j];
        if (element == userModel.name.get()) {
          userLst.push(userModel)
        }
      }
    }
    for (let i = 0; i < info.selectedRole.length; i++) {
      const element = info.selectedRole[i];
      for (let j = 0; j < this.roles.length; j++) {
        const roleModel = this.roles[j];
        if (element == roleModel.name.get()) {
          roleLst.push(roleModel)
        }
      }
    }
    if (boolImageChange) {
      let filePath = new Path(info.image.imageFile);
      element.image.set(filePath)
    }
    element.userLst = userLst
    element.roleLst = roleLst
    element.description = info.description
    element.title = info.title
  }
  getFileByElement(file) {
    return new Promise(function (resolve, reject) {
      file.load((path) => {
        let url = 'http://' + window.location.host + "/sceen/_?u=" + path._server_id
        fetch(url)
          .then(res => res.blob()) // Gets the response and returns it as a blob
          .then(blob => {
            const fr = new FileReader();
            fr.readAsDataURL(blob);
            fr.addEventListener("load", () => {
              let myImage = new Image();
              let imageUrl = fr.result
              myImage.onload = () => {
                myImage.src = fr.result;
                imageUrl = fr.result;
              }
              resolve({ myImage, imageUrl })
            })
          });
      })

    })

  }
}
const appService = new appsService;
appService.createContext();

export { appService, isShownType, AppsContextModel, nodeTypeApp, relationName, relationType };
export default appService
//  defautlt getUsers;
