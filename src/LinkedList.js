class Node {
  constructor(data) {
    this.data = data;
    this.next = null;
    this.pre = null;
  }
}

class LinkedList {
  constructor() {
    this.head = null;
    this.current = null;
  }

  insert(data) {
    let newNode = new Node(data);
    if (this.head === null) {
      this.head = newNode;
      this.current = newNode;
    } else {
      let temp = this.head;
      while (temp.next !== null) {
        temp = temp.next;
      }
      temp.next = newNode;
      newNode.pre = temp;
      this.current = newNode;
    }
  }

  undoEdit = () => {
    const preData = this.current?.pre;
    if (preData) {
      this.current = preData;
      return preData.data;
    } else {
      return null;
    }
  };

  redoEdit = () => {
    const nextData = this.current?.next;
    if (nextData) {
      this.current = nextData;
      return nextData.data;
    } else {
      return null;
    }
  };

  reset() {
    this.head = null;
    this.current = null;
  }
}

const storeData = {};

export const getLinkedListForImage = (imageIndex) => {
  if (!storeData[imageIndex]) {
    storeData[imageIndex] = new LinkedList();
  }
  return storeData[imageIndex];
};

export default storeData;
