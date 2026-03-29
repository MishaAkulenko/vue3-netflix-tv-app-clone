import { ref } from 'vue';
import { defineStore } from 'pinia';

export const useUserStore = defineStore(
  'user',
  () => {
    const adultConfirmed = ref(false);
    const hasSeenControlsHelp = ref(false);

    function confirmAdult() {
      adultConfirmed.value = true;
    }

    function rejectAdult() {
      adultConfirmed.value = false;
    }

    function confirmControlsHelp() {
      hasSeenControlsHelp.value = true;
    }

    return { adultConfirmed, hasSeenControlsHelp, confirmAdult, rejectAdult, confirmControlsHelp };
  },
  {
    persist: {
      pick: ['adultConfirmed', 'hasSeenControlsHelp']
    }
  }
);
