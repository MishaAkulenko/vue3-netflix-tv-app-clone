<script setup lang="ts">
import defaultAvatar from '@/assets/icons/profile/yoshi.png';
import { useFocus } from '@/composables/useFocus.ts';
import type { Grid } from '@/types/grid.ts';
import { useRouter } from 'vue-router';
import { ref, watch } from 'vue';

import BaseButton from '@/components/base/BaseButton.vue';
import ThemeSwitcher from '@/components/header/ThemeSwitcher.vue';
import LocaleSwitcher from '@/components/header/LocaleSwitcher.vue';

const props = defineProps<{
  grid: Grid;
}>();

const router = useRouter();
const avatar = ref(defaultAvatar);
const isOpen = ref(false);

const closeMenu = () => {
  setFocusOnFirstChild();
  isOpen.value = false;
};
const openMenu = () => (isOpen.value = true);

const { hasFocusedChildren, idForChildren, setInitFocus, setFocusOnFirstChild } = useFocus({
  id: `HeaderProfileMenu`,
  row: props.grid.row,
  column: props.grid.column,
  parentId: props.grid.parentId,
  stopHoistFocusFromBottom: true,
  afterFocusEnter() {
    setInitFocus();
  }
});

watch(hasFocusedChildren, (hasFocusedChildren) => {
  isOpen.value = hasFocusedChildren;
});
</script>

<template>
  <div class="header-profile-wrapper">
    <BaseButton
      class="header-profile-avatar"
      :class="{ 'menu-opened': isOpen }"
      :grid="{ row: 0, column: 0, parentId: idForChildren }"
      :style="{ 'background-image': `url(${avatar})` }"
      :focus-on-hover="true"
      @on-enter="openMenu"
      @on-back="closeMenu"
    />
    <div v-show="isOpen" class="options-list">
      <BaseButton
        class="menu-btn"
        :grid="{ row: 1, column: 0, parentId: idForChildren }"
        :focus-on-hover="true"
        @on-focus="openMenu"
        @on-back="closeMenu"
      >
        <svg
          class="menu-icon"
          xmlns="http://www.w3.org/2000/svg"
          height="24"
          viewBox="0 -960 960 960"
          width="24"
        >
          <path
            d="M371.5-273Q323-306 300-360h360q-23 54-71.5 87T480-240q-60 0-108.5-33Zm-27-161.5Q330-449 330-470t14.5-35.5Q359-520 380-520t35.5 14.5Q430-491 430-470t-14.5 35.5Q401-420 380-420t-35.5-14.5Zm200 0Q530-449 530-470t14.5-35.5Q559-520 580-520t35.5 14.5Q630-491 630-470t-14.5 35.5Q601-420 580-420t-35.5-14.5ZM480-80q-75 0-140.5-28.5t-114-77q-48.5-48.5-77-114T120-440q0-32 5-62t16-59l80 14q-11 25-16 51.5t-5 55.5q0 117 81.5 198.5T480-160q117 0 198.5-81.5T760-440q0-16-2-31.5t-5-30.5q-81-9-150-48T485-651l70-41q32 37 72.5 63t88.5 39q-25-39-61.5-68.5T573-704l84-50q83 47 133 129.5T840-440q0 75-28.5 140.5t-77 114q-48.5 48.5-114 77T480-80ZM200-615l413-155q-32-26-70-39.5T463-823q-95 0-169.5 57.5T200-615Zm-64 110q-7-20-11.5-41t-4.5-43q0-91 51-163t129-112q-2-4-2.5-7.5t-.5-8.5q0-17 11.5-28.5T337-920q14 0 24 8t14 20q22-5 43.5-8t44.5-3q67 0 127.5 26T697-802l122-46 28 75-711 268Zm271-188Z"
          />
        </svg>
        {{ $t('header.kids_profile') }}
      </BaseButton>
      <RouterLink to="/profile">
        <BaseButton
          class="menu-btn"
          :grid="{ row: 2, column: 0, parentId: idForChildren }"
          :focus-on-hover="true"
          @on-enter="router.push('/profile')"
          @on-back="closeMenu"
        >
          <svg
            class="menu-icon"
            xmlns="http://www.w3.org/2000/svg"
            height="24"
            viewBox="0 -960 960 960"
            width="24"
          >
            <path
              d="M367-527q-47-47-47-113t47-113q47-47 113-47t113 47q47 47 47 113t-47 113q-47 47-113 47t-113-47ZM160-160v-112q0-34 17.5-62.5T224-378q62-31 126-46.5T480-440q66 0 130 15.5T736-378q29 15 46.5 43.5T800-272v112H160Zm80-80h480v-32q0-11-5.5-20T700-306q-54-27-109-40.5T480-360q-56 0-111 13.5T260-306q-9 5-14.5 14t-5.5 20v32Zm296.5-343.5Q560-607 560-640t-23.5-56.5Q513-720 480-720t-56.5 23.5Q400-673 400-640t23.5 56.5Q447-560 480-560t56.5-23.5ZM480-640Zm0 400Z"
            />
          </svg>
          {{ $t('header.account') }}
        </BaseButton>
      </RouterLink>
      <RouterLink to="/profile">
        <BaseButton
          class="menu-btn"
          :grid="{ row: 3, column: 0, parentId: idForChildren }"
          :focus-on-hover="true"
          @on-enter="router.push('/profile')"
          @on-back="closeMenu"
        >
          <svg
            class="menu-icon"
            xmlns="http://www.w3.org/2000/svg"
            height="24"
            viewBox="0 -960 960 960"
            width="24"
          >
            <path
              d="M167-120q-21 5-36.5-10.5T120-167l40-191 198 198-191 40Zm191-40L160-358l458-458q23-23 57-23t57 23l84 84q23 23 23 57t-23 57L358-160Zm317-600L261-346l85 85 414-414-85-85Z"
            />
          </svg>
          {{ $t('header.manage_profiles') }}
        </BaseButton>
      </RouterLink>
      <div class="settings-block">
        <ThemeSwitcher :grid="{ row: 4, column: 0, parentId: idForChildren }" />
        <LocaleSwitcher :grid="{ row: 4, column: 1, parentId: idForChildren }" />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.header-profile-wrapper {
  position: relative;
}
.header-profile-avatar {
  cursor: pointer;
  display: block;
  padding: 0;
  border-radius: 0;
  width: var(--vt-c-header-icons-heiht);
  height: var(--vt-c-header-icons-heiht);
  position: relative;
  background-position: center;
  background-size: contain;
  background-repeat: no-repeat;
  transition: none;
  &::after {
    content: '';
    position: absolute;
    width: 0.4rem;
    height: 0.3rem;
    right: -1rem;
    transform: translateY(-50%);
    clip-path: polygon(50% 100%, 100% 0, 0 0);
    top: 50%;
    background-color: var(--color-text);
    z-index: 1;
    transition: transform 0.2s;
    overflow: hidden;
  }
  &.focused {
    outline: 0.15rem solid var(--color-border);
  }
  &.menu-opened {
    &::after {
      transform: rotate(180deg);
    }
  }
}
.options-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  position: absolute;
  left: 0;
  top: 3rem;
  background: var(--color-background-soft);
  padding: 0.5rem 1rem;
  min-width: max-content;

  .menu-btn {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 0.5rem 1rem;
    white-space: nowrap;
    justify-content: flex-start;
    color: var(--color-text);
  }

  .menu-icon {
    width: 1.2rem;
    height: 1.2rem;
    fill: currentColor;
  }

  .settings-block {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.5rem;
    border-top: 1px solid var(--color-border);
    padding-top: 0.5rem;
  }
}
</style>
