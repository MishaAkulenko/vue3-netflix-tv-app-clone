import { onMounted, onUnmounted, computed, useId, provide, inject } from 'vue';
import {
  NavigationManager,
  type FocusableNode,
  type FocusableNodeConfig
} from '@/plugins/NavigationManager';

type InitGrid = {
  row?: number;
  column?: number;
};
const FOCUS_PARENT_KEY = Symbol('focusParentId');
export function useFocus(config: FocusableNodeConfig) {
  // config.id передавати у випадку коли потрібно точно знати його, щоб примусово туди можна було встановити фокус(наприклад хідер), решта генеруються унікальні
  const uniqId = config.id ?? useId(); // Якщо config.id є, то використовуємо його, якщо ні то генеруємо унікальний автоматично
  const injectedParentId = inject(FOCUS_PARENT_KEY, 'App'); // App - це корневий компонент, якщо FOCUS_PARENT_KEY був undefined

  const parentId = config.isOverlay
    ? NavigationManager.getLastFocusLayerId() // для нового рівню фокусу створимо нову площину нод яка є корневою і самостійною сама навколо себе
    : injectedParentId;

  const focusedParams: FocusableNode = {
    ...config,
    parentId,
    id: uniqId
  };

  provide(FOCUS_PARENT_KEY, uniqId); // стаємо батьком внутрішнім компонентам, вони отримають цей id через injectedParentId

  const resetChildren = () => NavigationManager.resetChildren(focusedParams.id);
  const isFocused = computed(() => NavigationManager.currentFocusId.value === focusedParams.id);
  const hasFocusedChildren = computed(() =>
    NavigationManager.parentsOfFocusedNode.value.has(focusedParams.id)
  );

  const focusMe = () => NavigationManager.setFocus(focusedParams.id);
  // Повертаємо функцію примусового фокусу (наприклад, по кліку мишкою)
  const setInitFocus = (args: InitGrid = { row: 0, column: 0 }) =>
    NavigationManager.setInitFocus(focusedParams, args);

  const setFocusOnHeader = () => NavigationManager.setFocusOnHeader();

  const setFocusOnFirstChild = () => NavigationManager.setFocusOnFirstChild(focusedParams); //focusedParams зберігає контекст
  const getChildrenList = () => NavigationManager.getChildrenList(focusedParams.id); //повертає список дочірніх компонентів, які зареєстровані в менеджері, для поточного компонента
  const setFocusOnNewLayer = (id: string) => NavigationManager.setFocusOnNewLayer(id); //створює новий шар фокусу, який буде над поточним, і встановлює фокус на вказаний id
  const goBackToPreviousFocusLayer = () => NavigationManager.goBackToPreviousFocusLayer(); //створює новий шар фокусу, який буде над поточним, і встановлює фокус на вказаний id
  onMounted(() => {
    // Коли компонент з'являється на екрані, він повідомляє менеджера про себе
    // і передає свої локальні функції
    NavigationManager.registerNode(focusedParams);
  });

  onUnmounted(() => {
    // Коли зникає (наприклад v-if), видаляємо його з сітки
    resetChildren(); // щоб не було витоку памяті, обовязково потрібно очищати перед видаленням childMatrix відповідної ноди
    NavigationManager.unregisterNode(focusedParams.id);
  });

  return {
    idForChildren: uniqId, //id цього компонента буде parentId для дочірніх компонентів, захист від різних неймінгів
    focusMe,
    isFocused,
    setInitFocus,
    resetChildren,
    getChildrenList,
    setFocusOnHeader,
    hasFocusedChildren,
    setFocusOnNewLayer,
    setFocusOnFirstChild,
    goBackToPreviousFocusLayer
  };
}

export const useFocusedMethods = function () {
  return {
    moveFocusDown() {
      NavigationManager.handleBottomBtn(NavigationManager.getFocusedNode());
    },
    moveFocusUp() {
      NavigationManager.handleTopBtn(NavigationManager.getFocusedNode());
    },
    moveFocusLeft() {
      NavigationManager.handleLeftBtn(NavigationManager.getFocusedNode());
    },
    moveFocusRight() {
      NavigationManager.handleRightBtn(NavigationManager.getFocusedNode());
    }
  };
};
