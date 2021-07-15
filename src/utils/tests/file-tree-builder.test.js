import FileTreeBuilder, { Node } from 'utils/file-tree-builder'

test('splitPath splits path into two parts', () => {
  const builder = new FileTreeBuilder()
  var pathArray = ['a', 'b', 'c']
  const expected = {
    basename: 'c',
    dirname: ['a', 'b'],
  }
  expect(builder.splitPath(pathArray)).toEqual(expected)
})

test('splitPath splits path into two parts', () => {
  const builder = new FileTreeBuilder()
  var pathArray = ['a']
  const expected = {
    basename: 'a',
    dirname: [],
  }
  expect(builder.splitPath(pathArray)).toEqual(expected)
})

test('splitPath splits path into two parts', () => {
  const builder = new FileTreeBuilder()
  var pathArray = []
  const expected = {
    basename: '',
    dirname: [],
  }
  expect(builder.splitPath(pathArray)).toEqual(expected)
})

test('findParent returns the parent node if just one node', () => {
  var parentNode = new Node('parent', '/path', null)
  const builder = new FileTreeBuilder()
  const path = ['/path', 'file']
  const actual = builder.findParent(path, parentNode)
  expect(actual).toBe(parentNode)
})

test('findParent returns the parent node for multilevel tree', () => {
  var parentNode = new Node('parent', '/parent', null)
  var childNode = new Node('child', '/parent/child', parentNode)
  const builder = new FileTreeBuilder()
  const path = ['parent']
  const actual = builder.findParent(path, childNode)
  expect(actual).toBe(parentNode)
})

test('findParent returns the child node for multilevel tree', () => {
  var parentNode = new Node('parent', '/parent', null)
  var childNode = new Node('child', '/parent/child', parentNode)
  parentNode.children.push(childNode)
  const builder = new FileTreeBuilder()
  const path = ['parent', 'child']
  const actual = builder.findParent(path, childNode)
  expect(actual).toBe(childNode)
})

test('findRoot finds root node', () => {
  var parentNode = new Node('parent', '/parent', null)
  var childNode = new Node('child', '/parent/child', parentNode)
  parentNode.children.push(childNode)
  const builder = new FileTreeBuilder()
  expect(builder.findRoot(childNode)).toBe(parentNode)
  expect(builder.findRoot(parentNode)).toBe(parentNode)
})

test('format creates nodes with correct format', () => {
  var parentNode = new Node('parent', '/parent', null)
  var childNode = new Node('child', '/parent/child.txt', parentNode)
  parentNode.children.push(childNode)
  const builder = new FileTreeBuilder()
  var expected = {
    title: 'parent',
    key: '/parent',
    isLeaf: false,
    value: '/parent',
    children: [
      {
        title: 'child',
        key: '/parent/child.txt',
        isLeaf: true,
        children: [],
        value: '/parent/child.txt',
      },
    ],
  }
  expect(builder.format(parentNode)).toEqual(expected)
})

test('buildNodeTree creates tree based on list of filesystem paths', () => {
  const pathList = ['/a', '/a/b.txt', '/a/c', '/a/c/d.txt', '/a/e.txt']

  // This:
  //   expect(builder.buildNodeTree(pathList)).toEqual(root);
  // does not work because of this error:
  //   Compared values have no visual difference.
  // toEqual() does not work with objects and cannot stringify because of circular dependencies.
  // Thus, have to test individual values and remove circular dependencies.

  var root = new Node('root', '', null)
  var a = new Node('a', '/a', null)
  var b = new Node('b.txt', '/a/b.txt', null)
  var c = new Node('c', '/a/c', null)
  var d = new Node('d.txt', '/a/c/d.txt', null)
  var e = new Node('e.txt', '/a/e.txt', null)
  root.children = [a]
  a.children = [b, c, e]
  c.children = [d]
  const builder = new FileTreeBuilder()

  const tree = builder.buildNodeTree(pathList)
  const actual_a = tree.children[0]
  const actual_b = actual_a.children[0]
  const actual_c = actual_a.children[1]
  const actual_d = actual_c.children[0]
  const actual_e = actual_a.children[2]

  expect(tree.children[0].value).toEqual(a.value)
  expect(actual_a.children[0].value).toEqual(b.value)
  expect(actual_a.children[1].value).toEqual(c.value)
  expect(actual_a.children[2].value).toEqual(e.value)
  expect(actual_c.children[0].value).toEqual(d.value)

  actual_a.parent = null
  actual_b.parent = null
  actual_c.parent = null
  actual_d.parent = null
  actual_e.parent = null
  expect(JSON.stringify(tree)).toEqual(JSON.stringify(root))
})

test('run returns a tree for display with ant Tree', () => {
  const pathList = ['/parent', '/parent/child.txt']
  const builder = new FileTreeBuilder()
  var expected = [
    {
      title: 'parent',
      key: '/parent',
      isLeaf: false,
      value: '/parent',
      children: [
        {
          title: 'child.txt',
          key: '/parent/child.txt',
          isLeaf: true,
          children: [],
          value: '/parent/child.txt',
        },
      ],
    },
  ]
  expect(builder.run(pathList)).toEqual(expected)
})

test('backfillPaths populates folders that were missing', () => {
  const pathList = ['axy', 'axy/bed/caterpillar.txt', '/a/grab.txt', '/d/e/fox.txt']
  const builder = new FileTreeBuilder()
  const backfilledPaths = builder.backfillPaths(pathList)
  const expectedPathList = [
    '/a',
    '/a/grab.txt',
    '/d',
    '/d/e',
    '/d/e/fox.txt',
    'axy',
    'axy/bed',
    'axy/bed/caterpillar.txt',
  ]
  expect(backfilledPaths).toEqual(expectedPathList)
})

test('Node constructor works', () => {
  var node = new Node('test', 'test', null)
  expect(node.value).toBe('test')
  expect(node.fullpath).toBe('test')
  expect(node.isFile).toBe(false)
  expect(node.parent).toBe(null)
  expect(node.children).toEqual([])
})

test('Node.isAFile detects a file', () => {
  var node = new Node('test', 'test', null)
  expect(node.isAFile('/path/to/file.txt')).toBe(true)
})

test('Node.isAFile detects a folder', () => {
  var node = new Node('test', 'test', null)
  expect(node.isAFile('/path/to/file')).toBe(false)
})
