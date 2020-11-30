/*
 * @Date: 2020-09-11 10:55:32
 * @LastEditors: heyangjie
 * @LastEditTime: 2020-09-11 14:55:16
 * @FilePath: \npmpublish\main\index.js
 * @Description: 常用函数封装
 */

import hhh from "./content";
import json from "./index.json";
/**
 * @description: 树形结构数据转数组
 * @param {Array} treeData 树形结构数据
 * @param {String} childrenKey 树形接口数据的子数据
 * @return {Array} 转变后的数据
 */
export const treeTransferList = (treeData = [], childrenKey) => {
  if (!Array.isArray(treeData)) {
    throw new Error("treeData is not array !");
  }
  const data = [...treeData];
  let count = 0;
  while (data.length !== count) {
    const current = data[count];
    if (childrenKey && Array.isArray(current[childrenKey])) {
      data.push(...current[childrenKey]);
      delete current[childrenKey];
      count++;
      break;
    }
    if (!childrenKey && Array.isArray(current)) {
      data.splice(count, 1);
      data.push(...current);
      break;
    }
    count++;
  }
  return data;
};
/**
 * @description: 数组转树形结构
 * @param {Array}  list 原数组
 * @param {String} id 数组id
 * @param {String} parentKey 数据item的parentId
 * @param {String} childrenKey 树形结构的子数据key
 * @return {treeData} 数组
 */
export const listTransferTree = (
  list = [],
  id = "id",
  parentKey = "parentId",
  childrenKey = "children"
) => {
  if (!Array.isArray(list)) {
    throw new Error("listData is not array !");
  }
  const data = [...list];
  let count = 0;
  while (data.length !== count) {
    const current = data[count];
    if (current[parentKey]) {
      const currentParent = data.find(
        (item) => item[id] === current[parentKey]
      );
      currentParent[childrenKey] = currentParent[childrenKey] || [];
      currentParent[childrenKey].push(current);
    }
    count++;
  }
  return data.filter((item) => !item[parentKey]);
};
export default {
  listTransferTree,
  treeTransferList,
  hhh,
  json
}
