export const ROLE_ID_LIST = {
  superadmin: 1, // admin
  purchase: 2, // 采购专员
  supplymanager: 3, // 供应链主管
  supply: 4, // 供应链专员
  treasury: 5, // 财务专员
  warehouseadmin: 6, // 仓库主管
  warehouse: 7, // 仓库专员
  operation: 8, // 运营专员
  cinemaaccountmng: 9, // 院线账号管理员
  resource: 13, // 资源部专员
  resourcemng: 19, // 资源部主管
};

const ATTR_ID_LIST = {
  storehouseId: 1,
};

const resoloveMenus = (menus) => {
  let res = [];
  for (let v of menus) {
    if (v.isLeaf === 0 && v.submenus.length === 0) {
      continue;
    }
    let childrenNode = [];
    if (!v.isLeaf) {
      childrenNode = resoloveMenus(v.submenus);
      if (childrenNode.length === 0) {
        continue;
      }
    }
    if (!v.enabled) continue;
    res.push({
      name: v.name,
      id: v.id,
      source: v.source || '/ver1',
      route: v.route,
      isLeaf: !!v.isLeaf,
      submenus: childrenNode,
    });
  }
  return res;
};

class Permissions {
  constructor() {
    this.roleId = '';
    this.roleName = '';
    this.attrs = [];
    this.accountControlRoles = [];
    this.menus = [];
    this.userId = '';
    this.userName = '';
  }
  savePermissions(permissionList, user) {
    let {
      roleId,
      roleName,
      attrs,
      menus,
      accountControlRoles,
    } = permissionList;
    let { accountName, id } = user;
    this.roleId = roleId;
    this.roleName = roleName;
    this.attrs = attrs;
    this.accountControlRoles = accountControlRoles;
    this.menus = resoloveMenus(menus);
    this.userId = id;
    this.userName = accountName;
  }

  getUserInfo() {
    return {
      userId: this.userId,
      userName: this.userName,
    };
  }

  getRole() {
    return {
      roleId: this.roleId,
      roleName: this.roleName,
    };
  }

  getMenu() {
    return this.menus;
  }

  getCountrolRoles() {
    return this.accountControlRoles;
  }

  getAttr(attrId) {
    if (attrId === 'storehouseId') {
      attrId = ATTR_ID_LIST.storehouseId;
    }
    let result;
    if (!this.attrs || this.attrs.length === 0) {
      return '';
    }
    this.attrs.forEach((attr) => {
      if (attr.attrId === attrId) {
        result = attr;
      }
    });
    if (!result) return console.warn('attr不存在');
    if (result.attrStyle === 0) {
      // 文本
      return result.attrValues.length ? result.attrValues[0] : '';
    } else if (result.attrStyle === 1) {
      // 单选
      return result.attrValues.length ? result.attrValues[0] : '';
    } else if (result.attrStyle === 2) {
      // 多选
      let tmp = {};
      tmp[result.attrName] = result.attrValues;
      return tmp;
    }
  }

  isSuperadmin() {
    return this.roleId === ROLE_ID_LIST.superadmin;
  }

  isSupplymanager() {
    return this.roleId === ROLE_ID_LIST.supplymanager;
  }

  isTreasury() {
    return this.roleId === ROLE_ID_LIST.treasury;
  }

  isWarehouse() {
    return this.roleId === ROLE_ID_LIST.warehouse;
  }

  isWarehouseadmin() {
    return this.roleId === ROLE_ID_LIST.warehouseadmin;
  }
}

export const permissions = new Permissions();
