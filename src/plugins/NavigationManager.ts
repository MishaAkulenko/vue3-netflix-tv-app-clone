import { ref } from 'vue';
import { APP_HEADER_ID } from '@/constants/globalConst.ts';

export interface FocusableNodeConfig {
  id?: string;
  name?: string; // це чисто для відладки, щоб зручно було розуміти що за компонент, туди бажано тайтл передавати, чи аналогічну піпл рід френдлі інформацію
  parentId?: string;
  row: number;
  column: number;
  cantTakeFocus?: boolean;
  isOverlay?: boolean;
  stopHoistFocusFromLeft?: boolean;
  stopHoistFocusFromRight?: boolean;
  stopHoistFocusFromTop?: boolean;
  stopHoistFocusFromBottom?: boolean;
  lastFocusedChildren?: FocusableNodeConfig;
  afterFocusEnter?: () => void;
  beforeFocusLeave?: () => void;
  onEnter?: () => void;
  onBack?: () => void;
  onLeft?: () => void;
  onRight?: () => void;
  onUp?: () => void;
  onDown?: () => void;
}

export interface FocusableNode extends FocusableNodeConfig {
  id: string;
  parentId: string;
  childrenMatrix?: FocusableNodeConfig[][];
}
type initFocusParams = {
  id: string;
  row: number;
  column: number;
};
type focusLayer = {
  lastFocusedOnPreviousLayer: FocusableNode;
};
class NavManager {
  // nodes = reactive<Map<string, FocusableNode>>(new Map());
  private nodes = new Map();
  private initFocusParams: initFocusParams | null = null;
  focusLayers: focusLayer[] = [];
  parentsOfFocusedNode = ref<Set<string>>(new Set());
  currentFocusId = ref<string | null>(null);

  init() {
    window.addEventListener('keydown', this.handleKeyDown.bind(this));
  }

  registerNode(node: FocusableNode) {
    const { row, column, id, parentId } = node;

    if (!this.nodes.get(parentId)) {
      // якщо батьківська нода ще не створена, наприклад, корнева нода "App"
      //то створюється таким чином, а не в ручну по ініціалізації
      this.nodes.set(parentId, {
        id: parentId
      });
    }

    const existingNode = this.nodes.get(id) || {}; // цей id вже міг бути створений раніше через установки childrenMatrix
    this.nodes.set(id, { ...existingNode, ...node }); // зливаємо node + childrenMatrix

    const parentNode = this.nodes.get(parentId);
    const matrix = parentNode.childrenMatrix || [];

    if (!matrix[row]) matrix[row] = []; // якщо такого ряду ще не було створено, то встановимо початковий []
    matrix[row][column] = node;

    this.nodes.set(parentId, {
      ...parentNode,
      childrenMatrix: matrix
    });

    if (this.initFocusParams) {
      // чекаємо, коли зареєструється компонент, який очікує setInitFocus
      const { id, row: initRow, column: initColumn } = this.initFocusParams;

      if (id === parentId && row === initRow && column === initColumn) {
        this.setFocus(matrix[initRow][initColumn].id);
        this.initFocusParams = null;
      }
    }
  }
  unregisterNode(id: string) {
    this.removeNodeFromParent(id);
    this.nodes.delete(id);
    // Логіка передачі фокусу іншому, якщо цей компонент (наприклад модалка) зник
  }
  removeNodeFromParent(id: string) {
    const node = this.nodes.get(id);
    if (!node?.parentId) return;

    const parentNode = this.nodes.get(node.parentId);

    if (parentNode?.lastFocusedChildren?.id === node.id) {
      // якщо нода, яку видаляємо, була останньо сфокусованим чілдреном для батька, то очищаємо цей параметр у батька
      parentNode.lastFocusedChildren = null;
    }
    if (parentNode?.childrenMatrix?.[node.row]) {
      // Потрібно видалити ноду з матриці батька, щоб вони не накопичувались.
      // Часто компоненти оновлюють свої дані,
      // і щоб в ручну не очищати чілдрени в кожному компоненті(а тобто програміст має за цим слідкувати),
      // то краще глобально зробити заглушку, щоб чілдрен сам себе помічав як видалений
      //TODO додати після тестів перевірку на null в усіх навігаційних функціях.
      parentNode.childrenMatrix[node.row][node.column] = null;
    }
  }
  setFocus(id: string) {
    if (import.meta.env.DEV && id === undefined) {
      console.warn('SET_FOCUS_ERROR');
      return;
    }
    const currentNode = this.nodes.get(this.currentFocusId.value);

    if (currentNode) {
      const parentOfCurrentNode: FocusableNode = this.nodes.get(currentNode.parentId);

      parentOfCurrentNode.lastFocusedChildren = currentNode;

      // Викликаємо метод onBlur у старого елемента
      this.nodes.get(this.currentFocusId.value)?.beforeFocusLeave?.();
    }
    this.currentFocusId.value = id;

    // Викликаємо метод onFocus у нового елемента
    this.fillParentsOfFocusedNode();
    this.nodes.get(id)?.afterFocusEnter?.();
  }
  setInitFocus({ id }: FocusableNode, { row = 0, column = 0 }) {
    const currentNode = this.nodes.get(id);
    const needfulChild = currentNode?.childrenMatrix?.[row]?.[column];

    if (currentNode?.lastFocusedChildren) {
      this.setFocus(currentNode.lastFocusedChildren.id);
      return;
    }
    if (needfulChild === undefined) {
      // якщо на момент встановлення початкового фокусу потрібні ноди чілдренів ще не зареєстровані,
      this.initFocusParams = { id, row, column }; // то вкажемо, що цей компонент очікує реєстрації чілдренів
    } else {
      this.setFocus(needfulChild.id);
    }
  }
  getLastFocusLayerId() {
    return `Overlay[${this.focusLayers.length}]`;
  }
  setFocusOnNewLayer(id: string) {
    this.focusLayers.push({ lastFocusedOnPreviousLayer: this.getFocusedNode() });
    this.setFocus(id);
  }
  goBackToPreviousFocusLayer() {
    if (!this.focusLayers.length) return;
    const lastFocusedOnPreviousLayer = this.focusLayers.pop()?.lastFocusedOnPreviousLayer;
    const focusLayerId = this.getLastFocusLayerId();

    if (lastFocusedOnPreviousLayer) {
      this.setFocus(lastFocusedOnPreviousLayer.id);
      this.nodes.delete(focusLayerId);
    } else if (import.meta.env.DEV) {
      console.warn('No previous layer to focus on');
    }
  }
  fillParentsOfFocusedNode() {
    const newParents = new Set<string>();
    const addParent = (node: FocusableNode) => {
      if (!node || !node.parentId) return;
      const parent: FocusableNode = this.nodes.get(node.parentId);
      if (parent) {
        newParents.add(parent.id);
        addParent(parent);
      }
    };
    const currentNode = this.nodes.get(this.currentFocusId.value);
    if (currentNode) {
      addParent(currentNode);
    }

    this.parentsOfFocusedNode.value = newParents;
  }
  getFocusedNode() {
    return this.nodes.get(this.currentFocusId.value);
  }
  getChildrenList(id: string) {
    return this.nodes.get(id)?.childrenMatrix;
  }
  resetChildren(id: string) {
    if (!this.nodes.get(id)) return;
    this.nodes.get(id).childrenMatrix = [];
  }
  setFocusOnHeader() {
    // Він завжди в DOM і ніколи не перемальовується. Тому будемо вважати його як константу, в яку можна повернутись з різних крайніх випадків
    this.setFocus(APP_HEADER_ID);
  }
  setFocusOnFirstChild(params: FocusableNode) {
    const node = this.nodes.get(params.id);
    this.setFocus(node?.childrenMatrix?.[0]?.[0]?.id);
  }
  handleKeyDown(event: KeyboardEvent) {
    if (!this.currentFocusId.value) return;

    const currentNode: FocusableNodeConfig = this.nodes.get(this.currentFocusId.value);

    if (!currentNode) return;

    switch (event.key) {
      case 'Enter':
        if (currentNode.onEnter) currentNode.onEnter();
        break;
      case 'Escape':
        if (currentNode.onBack) currentNode.onBack();
        break;
      case 'ArrowRight':
        this.handleRightBtn(currentNode);
        break;
      case 'ArrowLeft':
        this.handleLeftBtn(currentNode);
        break;
      case 'ArrowUp':
        this.handleTopBtn(currentNode);
        break;
      case 'ArrowDown':
        this.handleBottomBtn(currentNode);
        break;
    }
  }
  handleRightBtn(currentNode: FocusableNodeConfig) {
    const matrix = this.nodes.get(currentNode.parentId).childrenMatrix;
    const { row, column, stopHoistFocusFromRight } = currentNode;

    if (currentNode.onRight) {
      currentNode.onRight();
      return;
    }

    if (stopHoistFocusFromRight && !matrix[row][column + 1]) return; //крайня права позиція + не шукаємо сусіда з права на рівень вище

    if (!matrix[row][column + 1]) {
      this.hoistFocusToRightNeighbor(currentNode);
      return;
    }
    if (matrix[row][column + 1]) this.setFocus(matrix[row][column + 1].id); // рухаємо фокус на сусіда з права
  }
  hoistFocusToRightNeighbor(node: FocusableNodeConfig) {
    // якщо вперлись з права в крайній компонент на даному рівні,
    // то піднімемося на рівень, де реєструвався батьківський компонент і знайдемо першого правого сусіда
    const parent = this.nodes.get(node.parentId);
    const grandParent = this.nodes.get(parent?.parentId);

    if (
      !parent ||
      !grandParent ||
      parent?.stopHoistFocusFromRight ||
      grandParent?.stopHoistFocusFromRight
    )
      return;

    const nextNeighbor = grandParent.childrenMatrix[parent.row][parent.column + 1];
    if (nextNeighbor) this.setFocus(nextNeighbor.id);
  }
  handleLeftBtn(currentNode: FocusableNodeConfig) {
    const matrix = this.nodes.get(currentNode.parentId).childrenMatrix;
    const { row, column, stopHoistFocusFromLeft } = currentNode;

    if (currentNode.onLeft) {
      currentNode.onLeft();
      return;
    }

    if (stopHoistFocusFromLeft && !matrix[row][column - 1]) return; //крайня ліва позиція + не шукаємо сусіда з ліва на рівень вище

    if (!matrix[row][column - 1]) {
      this.hoistFocusToLeftNeighbor(currentNode);
      return;
    }
    if (matrix[row][column - 1]) this.setFocus(matrix[row][column - 1].id); // рухаємо фокус на сусіда з ліва
  }
  hoistFocusToLeftNeighbor(node: FocusableNodeConfig) {
    // якщо вперлись зліва в крайній компонент на даному рівні,
    // то піднімемося на рівень, де реєструвався батьківський компонент і знайдемо першого лівого сусіда
    const parent = this.nodes.get(node.parentId);
    const grandParent = this.nodes.get(parent?.parentId);

    if (
      !parent ||
      !grandParent ||
      parent?.stopHoistFocusFromLeft ||
      grandParent?.stopHoistFocusFromLeft
    )
      return;

    const prevNeighbor = grandParent.childrenMatrix[parent.row][parent.column - 1];
    if (prevNeighbor) this.setFocus(prevNeighbor.id);
  }
  handleTopBtn(currentNode: FocusableNodeConfig) {
    const matrix = this.nodes.get(currentNode.parentId).childrenMatrix;
    const { row, column, stopHoistFocusFromTop } = currentNode;

    if (currentNode.onDown) {
      currentNode.onDown();
      return;
    }

    if (stopHoistFocusFromTop && !matrix[row - 1]) return; //крайня верхня позиція + не шукаємо сусіда зверху на рівень вище

    if (!matrix[row - 1]) {
      this.hoistFocusToTopNeighbor(currentNode);
      return;
    }
    if (matrix[row - 1][column]) this.setFocus(matrix[row - 1][column].id); // рухаємо фокус на сусіда знизу
  }
  hoistFocusToTopNeighbor(node: FocusableNodeConfig) {
    const parent = this.nodes.get(node.parentId);
    const grandParent = this.nodes.get(parent?.parentId);

    if (
      !parent ||
      !grandParent ||
      parent?.stopHoistFocusFromTop ||
      grandParent?.stopHoistFocusFromTop
    )
      return;
    const prevRow = grandParent.childrenMatrix[parent.row - 1];

    if (!prevRow) {
      // якщо нема наступного рядка в поточному рівні, то піднімемось ще на один і так в циклі поки рівні не закінчатсья
      this.hoistFocusToTopNeighbor(parent);
      return;
    }

    const prevNeighbor = prevRow?.[parent.column] || prevRow?.[0];
    if (prevNeighbor) this.setFocus(prevNeighbor.id);
  }
  handleBottomBtn(currentNode: FocusableNodeConfig) {
    const matrix = this.nodes.get(currentNode.parentId).childrenMatrix;
    const { row, column, stopHoistFocusFromBottom } = currentNode;

    if (currentNode.onDown) {
      currentNode.onDown();
      return;
    }

    if (stopHoistFocusFromBottom && !matrix[row + 1]) return; //крайня нижня позиція + не шукаємо сусіда знизу на рівень вище

    if (!matrix[row + 1]) {
      this.hoistFocusToBottomNeighbor(currentNode);
      return;
    }
    if (matrix[row + 1][column]) this.setFocus(matrix[row + 1][column].id); // рухаємо фокус на сусіда знизу
  }
  hoistFocusToBottomNeighbor(node: FocusableNodeConfig) {
    const parent = this.nodes.get(node.parentId);
    const grandParent = this.nodes.get(parent?.parentId);
    if (
      !parent ||
      !grandParent ||
      parent?.stopHoistFocusFromBottom ||
      grandParent?.stopHoistFocusFromBottom
    )
      return;

    const nextRow = grandParent.childrenMatrix[parent.row + 1];

    if (!nextRow) {
      // якщо нема наступного рядка в поточному рівні, то піднімемось ще на один і так в циклі поки рівні не закінчатсья
      this.hoistFocusToBottomNeighbor(parent);
      return;
    }

    const nextNeighbor = nextRow?.[parent.column] || nextRow?.[0];

    if (nextNeighbor) this.setFocus(nextNeighbor.id);
  }
  logNodes() {
    if (!import.meta.env.DEV) return;
    console.log(
      'NODES: ',
      Array.from(this.nodes.values()).map((node) => {
        // для кращої наочності, краще видно імена компонентів
        return {
          name: node.name,
          children: node.childrenMatrix,
          node: node
        };
      })
    );
  }
}

export const NavigationManager = new NavManager();
