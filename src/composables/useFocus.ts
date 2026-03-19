import { onMounted, onUnmounted, computed, useId } from 'vue';
import {
  NavigationManager,
  type FocusableNode,
  type FocusableNodeConfig
} from '@/plugins/NavigationManager';

type InitGrid = {
  row?: number;
  column?: number;
};

export function useFocus(config: FocusableNodeConfig) {
  const uniqId = config.id ?? useId(); // Якщо config.id є, то використовуємо його, якщо ні то генеруємо унікальний автоматично
  const focusedParams: FocusableNode = {
    ...config,
    id: uniqId
  };

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
    isFocused,
    focusMe,
    setInitFocus,
    setFocusOnHeader,
    hasFocusedChildren,
    getChildrenList,
    setFocusOnFirstChild,
    resetChildren
  };
}
