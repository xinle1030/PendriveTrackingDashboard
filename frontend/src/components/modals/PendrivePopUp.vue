<template>
  <TransitionRoot as="template" :show="modal.show.value">
    <Dialog as="div" class="relative z-10" @close="modal.hideModal()">
      <TransitionChild
        as="template"
        enter="ease-out duration-300"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="ease-in duration-200"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div
          class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
        />
      </TransitionChild>

      <div class="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div
          class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0"
        >
          <TransitionChild
            as="template"
            enter="ease-out duration-300"
            enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enter-to="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leave-from="opacity-100 translate-y-0 sm:scale-100"
            leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <DialogPanel
              class="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-3xl"
            >
              <div class="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                <div class="sm:flex sm:items-start">
                  <div class="px-4 sm:px-0">
                    <h3 class="text-base font-semibold leading-7 text-gray-900">
                      Pendrive Information
                    </h3>
                    <p class="mt-1 max-w-2xl text-sm leading-6 text-gray-500">
                      Pendrive details and application.
                    </p>
                  </div>
                </div>

                <div class="mt-6 border-t border-gray-100">
                  <dl class="divide-y divide-gray-100">
                    <div
                      class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0"
                    >
                      <dt class="text-sm font-medium leading-6 text-gray-900">
                        Pendrive Id
                      </dt>
                      <dd
                        class="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0"
                      >
                        {{ props.item.id }}
                      </dd>
                    </div>
                    <div
                      class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0"
                    >
                      <dt class="text-sm font-medium leading-6 text-gray-900">
                        Description
                      </dt>
                      <dd
                        class="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0"
                      >
                        {{ props.item.description }}
                      </dd>
                    </div>
                    <div
                      class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0"
                    >
                      <dt class="text-sm font-medium leading-6 text-gray-900">
                        Location
                      </dt>
                      <dd
                        class="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0"
                      >
                        {{ props.item.location }}
                      </dd>
                    </div>
                    <div
                      class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0"
                    >
                      <dt class="text-sm font-medium leading-6 text-gray-900">
                        Pendrive Status
                      </dt>
                      <dd
                        class="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0"
                      >
                        <DropdownOptions
                          :options="pendriveStatus"
                          :item="ItemEnum.Pendrive"
                        />
                      </dd>
                    </div>
                    <div
                      class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0"
                    >
                      <dt class="text-sm font-medium leading-6 text-gray-900">
                        Created At
                      </dt>
                      <dd
                        class="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0"
                      >
                        {{ formatDate(props.item.createdAt) }}
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>
              <div
                class="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6"
              >
                <button
                  type="button"
                  class="inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:ml-3 sm:w-auto"
                  @click="modal.hideModal()"
                  ref="cancelButtonRef"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  class="inline-flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 sm:ml-3 sm:w-auto"
                  @click="handleEdit"
                >
                  Save
                </button>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script setup lang="ts">
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  TransitionChild,
  TransitionRoot,
} from "@headlessui/vue";
import { ExclamationTriangleIcon } from "@heroicons/vue/24/outline";
import { PaperClipIcon } from "@heroicons/vue/20/solid";
import { useModal } from "../../composables/modal";
import { Pendrive, PendriveUpdate } from "../../models/pendrive";
import { formatDate } from "../../utils/utilFuncs";
import { usePendrives } from "../../stores/pendrives";
import { router } from "../../router";
import { usePendriveStatuses } from "../../stores/pendriveStatuses";
import { ItemEnum } from "../../enums/ItemEnum";
import DropdownOptions from "../DropdownOptions.vue";
import { onMounted, watchEffect } from "vue";

const modal = useModal();
const pendrivesStore = usePendrives();
const pendriveStatusStore = usePendriveStatuses();

const pendriveStatus = pendriveStatusStore.allItems;

const props = defineProps<{
  item: Pendrive;
}>();

onMounted(() => {
  watchEffect(() => {
    pendriveStatusStore.setSelectedPendriveStatus(
      props.item.pendriveStatusId ?? 1
    );
  });
});

async function handleEdit() {
  const newPendrive: PendriveUpdate = {
    ...props.item,
    pendriveStatusId: pendriveStatusStore.selectedPendriveStatus?.id ?? null,
  };
  try {
    await pendrivesStore.updatePendrive({
      ...newPendrive,
    });

    modal.hideModal();

    window.alert("Pendrive information has been updated successfully!");

    router.push("/pendrives").then(() => router.go(0));
  } catch (error) {
    console.error("Error creating loan request:", error);
  }
}
</script>
