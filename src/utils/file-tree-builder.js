/**
 * @fileoverview Classes to support building a tree from a list of file paths
 */

const sep = '/'

/**
 * @class Builds a tree based on a list of paths.
 */
export default class FileTreeBuilder {
  /**
   * Splits an array of strings representing folders in file path into bottom level and rest of folders
   * @param {Array<string>} pathArray array of folder names with possible filename at the end
   * @return {string} basename bottom-most level of path
   * @return {Array<string>} dirname array of folders in path
   */
  splitPath(pathArray) {
    if (pathArray.length > 0) {
      return {
        basename: pathArray.pop(),
        dirname: pathArray,
      }
    } else {
      return {
        basename: '',
        dirname: pathArray,
      }
    }
  }

  /**
   * Finds the correct parent node given a full path and start node.
   * Relies on parent node being either startNode or one of its parents.
   * @param {Array<string>} path path components saved in array in order
   * @param {Node} startNode node to begin to search
   * @return {Node} parent Node
   */
  findParent(path, startNode) {
    if (startNode.parent === null) {
      return startNode
    }
    if (path[path.length - 1] === startNode.value) {
      return startNode
    } else {
      return this.findParent(path, startNode.parent)
    }
  }

  /**
   * Finds root node of the tree given any starting node
   * @param {Node} node node from which to begin search
   * @return {Node} root node
   */
  findRoot(node) {
    if (node.parent === null) {
      return node
    } else {
      return this.findRoot(node.parent)
    }
  }

  /**
   * Formats a tree starting at given node for use with ant Tree component
   * @param {Node} node node from which to begin search
   */
  format(node) {
    var d = null
    var formattedNode = {
      title: node.value,
      key: node.fullpath,
      isLeaf: node.isFile,
      value: node.fullpath,
      children: [],
    }
    if (node.children.length > 0) {
      for (d of node.children) {
        formattedNode.children.push(this.format(d))
      }
    }
    return formattedNode
  }

  /**
   * Builds array starting at head node for use with ant Tree component
   * @param {Node} node
   * @return {Array} array holding tree information
   */
  buildDisplayTree(node) {
    return this.format(node).children
  }

  /**
   * Builds a tree of Nodes from list of filesystem paths
   * @param {Array<string>} pathList array of file system paths
   */
  buildNodeTree(pathList) {
    pathList.sort()
    const validPathList = this.backfillPaths(pathList)
    var previousNode = new Node('root', '', null)
    var path = ''
    for (path of validPathList) {
      var pathArray = path.split('/')
      var { dirname, basename } = this.splitPath(pathArray)
      var parent = this.findParent(dirname, previousNode)
      var currentNode = new Node(basename, path, parent)
      parent.children.push(currentNode)
      if (!currentNode.isFile) {
        previousNode = currentNode
      }
    }
    return this.findRoot(currentNode)
  }

  /**
   * Backfills array of paths to include missing folders
   * @param {Array<string>} pathList array of file system paths
   */
  backfillPaths(pathList) {
    let path
    let tempPath
    let newPaths = []
    let searchSlice
    let i
    for (i = 0; i < pathList.length; i++) {
      path = pathList[i]
      tempPath = path

      if (tempPath.includes(sep)) {
        // Remove last part of tempPath
        tempPath = tempPath.slice(0, tempPath.lastIndexOf(sep))
        while (tempPath.length > 0) {
          // If it is not in either list, add it to newPaths
          searchSlice = pathList.slice(0, i)

          if (!searchSlice.includes(tempPath) && !newPaths.includes(tempPath)) {
            newPaths.push(tempPath)
          }

          if (tempPath.includes(sep)) {
            // Remove last part of path and check to see if it is in pathList or in newPaths
            tempPath = tempPath.slice(0, tempPath.lastIndexOf(sep))
          } else {
            tempPath = ''
          }
        }
      }
    }
    let completePathList = pathList.concat(newPaths)
    completePathList.sort()
    return completePathList
  }

  /**
   * Builds a tree corresponding to file hierarchy in path list
   * @param {Array<string>} pathList array of file system paths
   */
  run(pathList) {
    const nodeTree = this.buildNodeTree(pathList)
    return this.buildDisplayTree(nodeTree)
  }
}

/**
 * Node in a tree representing a path
 */
export class Node {
  /**
   * Creates a Node
   * @param {string} value
   * @param {string} fullpath
   * @param {Node} parent
   */
  constructor(value, fullpath, parent) {
    this.value = value
    this.fullpath = fullpath
    this.isFile = this.isAFile(fullpath)
    this.parent = parent
    this.children = []
  }

  /**
   * Returns true if path is a file rather than a folder
   * @param {string} path
   * @return {boolean} true if path is a file
   */
  isAFile = path =>
    path
      .split('/')
      .pop()
      .indexOf('.') > -1
}
