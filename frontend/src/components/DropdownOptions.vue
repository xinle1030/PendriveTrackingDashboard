<template>
  <Menu as="div" class="relative inline-block text-left">
    <div>
      <MenuButton
        class="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
      >
        {{ selectedStatus ? selectedStatus.description : "-" }}
        <ChevronDownIcon
          class="-mr-1 h-5 w-5 text-gray-400"
          aria-hidden="true"
        />
      </MenuButton>
    </div>

    <transition
      enter-active-class="transition ease-out duration-100"
      enter-from-class="transform opacity-0 scale-95"
      enter-to-class="transform opacity-100 scale-100"
      leave-active-class="transition ease-in duration-75"
      leave-from-class="transform opacity-100 scale-100"
      leave-to-class="transform opacity-0 scale-95"
    >
      <MenuItems
        class="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
      >
        <div class="py-1">
          <!-- Loop through the menu items dynamically -->
          <MenuItem
            v-for="status in props.options"
            :key="status.id"
            v-slot="{ active }"
          >
            <a
              href="#"
              :class="[
                active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                'block px-4 py-2 text-sm',
              ]"
              @click="selectStatus(status)"
              >{{ status.description }}</a
            >
          </MenuItem>
        </div>
      </MenuItems>
    </transition>
  </Menu>
</template>

<script setup lang="ts">
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/vue";
import { ChevronDownIcon } from "@heroicons/vue/20/solid";
import { ItemEnum } from "../enums/ItemEnum";
import { PendriveStatus } from "../models/PendriveStatus";
import { RequestStatus } from "../models/requestStatus";
import { useRequestStatuses } from "../stores/requestStatuses";
import { usePendriveStatuses } from "../stores/pendriveStatuses";
import { onMounted, ref, watchEffect } from "vue";

const props = defineProps<{
  options: RequestStatus[] | PendriveStatus[];
  item: ItemEnum.LoanRequest | ItemEnum.Pendrive;
}>();

const requestStatusStore = useRequestStatuses();
const pendriveStatusStore = usePendriveStatuses();

let selectedStatus = ref<RequestStatus | PendriveStatus | null>(null);

onMounted(() => {
  watchEffect(() => {
    switch (props.item) {
      case ItemEnum.LoanRequest:
        selectedStatus.value = requestStatusStore.selectedRequestStatus;
        break;
      case ItemEnum.Pendrive:
        selectedStatus.value = pendriveStatusStore.selectedPendriveStatus;
        break;
    }
  });
});

// Function to set the selected status
const selectStatus = (status: RequestStatus | PendriveStatus) => {
  switch (props.item) {
    case ItemEnum.LoanRequest:
      requestStatusStore.setSelectedRequestStatus(status.id);
      selectedStatus.value = requestStatusStore.selectedRequestStatus;
      break;
    case ItemEnum.Pendrive:
      pendriveStatusStore.setSelectedPendriveStatus(status.id);
      selectedStatus.value = pendriveStatusStore.selectedPendriveStatus;
      break;
  }
};
</script>
