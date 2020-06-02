class BSTNode {
  constructor({ key, value, parent, left, right }) {
    this.key = key;
    this.value = value;
    this.parent = parent;
    this.left = left;
    this.right = right;
  }
}

class BinarySearchTree {
  constructor(Node = BSTNode) {
    this.Node = Node;
    this._count = 0;
    this._root = undefined;
  }

  insert(key, value = true) {
    let node = this._root;
    // if root is undefined make root new node w/ no parent
    if (!node) {
      this._root = new this.Node({ key, value })
      this._count += 1;
    }
    else {
      // to make new node we need parent
      let parent = node.parent;
      while (node) {
        if (key < node.key) {
          parent = node;
          node = node.left;
        } else if (key > node.key) {
          parent = node;
          node = node.right;
        }
        else {
          break;
        }
      }

      if (node?.key) {
        // replace value if key is in tree
        node.value = value;

      } else {
        // new node
        node = new this.Node({ key, value, parent });
        this._count += 1;

          if (parent.key) {
            if (key < parent.key) {
              parent.left = node;
            } else {
              parent.right = node;
            }
          }
        }
    }

  }

  lookup(key) {
    let node = this._root;

    while (node) {
      if (key < node.key) {
        node = node.left;
      } else if (key > node.key) {
        node = node.right;
      } else { // equal
        return node.value;
      }
    }
  }

  delete(key) {
    let node = this._root;

    while (node) {
      if (key < node.key) {
        node = node.left;
      } else if (key > node.key) {
        node = node.right;
      } else { // equal
        let replacement = node;

        if (node.left && node.right) {
          // Both children (complex case)
          // Find in-order successor and transpose it to node's spot
          let successor = node.right;

          if (successor.left) {
            // Walk all the way to the left
            while (successor.left) {
              successor = successor.left;
            }

            // Make sure its old right child is taken care of
            successor.parent.left = successor.right;
            if (successor.right) {
              successor.right.parent = successor.parent;
            }

            // Assign the new right child
            successor.right = node.right;
            node.right.parent = successor;
          }

          successor.left = node.left;
          successor.left.parent = successor;

          replacement = successor;

        } else {
          // One or no child -> acts like a linked list
          replacement = node.left ? node.left : node.right;

        }

        // fixup links to parent
        if (node.parent) {
          const direction = node === node.parent.left ? 'left' : 'right';
          node.parent[direction] = replacement;

        } else {
          this._root = replacement;
        }

        if (replacement) {
          replacement.parent = node.parent;
        }

        // fix count and return
        this._count -= 1;
        return node.value;
      }
    }
  }

  count() {
    return this._count;
  }

  forEach(callback) {
    // This is a little different from the version presented in the video.
    // The form is similar, but it invokes the callback with more arguments
    // to match the interface for Array.forEach:
    //   callback({ key, value }, i, this)
    const visitSubtree = (node, callback, i = 0) => {
      if (node) {
        i = visitSubtree(node.left, callback, i);
        callback({ key: node.key, value: node.value }, i, this);
        i = visitSubtree(node.right, callback, i + 1);
      }
      return i;
    }
    visitSubtree(this._root, callback)
  }
}

export default BinarySearchTree;