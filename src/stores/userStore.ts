import { ref } from 'vue';
import { defineStore } from 'pinia';

export const useUserStore = defineStore(
  'user',
  () => {
    const adultConfirmed = ref(false);

    function confirmAdult() {
      adultConfirmed.value = true;
    }

    function rejectAdult() {
      adultConfirmed.value = false;
    }

    return { adultConfirmed, confirmAdult, rejectAdult };
  },
  {
    persist: {
      pick: ['adultConfirmed']
    }
  }
);
