const spinalSystem = window.spinal.spinalSystem;
import { SpinalGraphService, SPINAL_RELATION_PTR_LST_TYPE } from "spinal-env-viewer-graph-service";
const relationName = "hasApps"
const relationType = SPINAL_RELATION_PTR_LST_TYPE
const nodeTypeApp = ["appStore"]
import {
  ROOMS_GROUP_CONTEXT,
  EQUIPMENTS_GROUP_CONTEXT,
} from 'spinal-env-viewer-room-manager/js/service'
import { SERVICE_TYPE } from 'spinal-service-ticket/dist/Constants'
const isShownType = [ROOMS_GROUP_CONTEXT, EQUIPMENTS_GROUP_CONTEXT, SERVICE_TYPE]


class AppsContextModel extends Model {
  constructor(title, description, userLst, roleLst, context, file) {
    super();
    this.add_attr({
      userLst: userLst,
      context: context,
      image: new Ptr(file),
      description: description,
      title: title,
      role: roleLst
    });
  }
}

class UsersService {
  constructor() {
    this.users = []
    this.context = undefined;
  }
  createContext() {
    var myInterval = setInterval(() => {
      if (this.context != undefined) {
        clearInterval(myInterval);
        return this.context;
      } else {
        let context = SpinalGraphService.getContext("Apps")
        if (context == undefined) {
          SpinalGraphService.addContext("Apps", "appsContext", new Model())
        } else {
          this.context = context
        }
      }
    }, 1000);
  }
  getAvailableContext() {
    // console.log("get availible context");
    let contextLst = []
    let formatedFrontLst = []
    for (let i = 0; i < availableContextType.length; i++) {
      const type = availableContextType[i];
      let context = SpinalGraphService.getContextWithType(type)
      Array.prototype.push.apply(contextLst, context);
    }
    // console.log(contextLst);
    for (let j = 0; j < contextLst.length; j++) {
      const element = contextLst[j];
      formatedFrontLst.push(element.info.name.get())
    }
    return formatedFrontLst;
    this.availableContext = contextLst
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
  saveApps(info) {
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
    let filePath = new Path(info.image.imageFile);
    // let myFile = new File(info.image.imageFile.name, filePath);
    let nodeElement = new AppsContextModel(info.title, info.description, userLst, roleLst, info.selectedContext, filePath)
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
      // let myFile = new File(info.image.imageFile.name, filePath);
      // element.image.set(myFile)
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
        console.log(url);
        // fetch(url).then(res =>
        //   res.blob
        // ).then(blob => {
        //   console.log(blob);

        // })
        fetch(url)
          .then(res => res.blob()) // Gets the response and returns it as a blob
          .then(blob => {
            // Here's where you get access to the blob
            // And you can use it for whatever you want
            // Like calling ref().put(blob)
            // Here, I use it to make an image appear on the page
            // console.log(blob);
            const fr = new FileReader();
            fr.readAsDataURL(blob);
            fr.addEventListener("load", () => {
              let myImage = new Image();
              let imageUrl = fr.result
              // myImage.src = objectURL;
              myImage.onload = () => {
                myImage.src = fr.result;
                imageUrl = fr.result;
              }
              resolve({ myImage, imageUrl })
            })
            // let objectURL = URL.createObjectURL(blob);

            // resolve(myImage)
          });
      })

    })

  }
}
const usersService = new UsersService;
usersService.createContext();

export { usersService, isShownType, AppsContextModel, nodeTypeApp, relationName, relationType };
export default usersService
//  defautlt getUsers;