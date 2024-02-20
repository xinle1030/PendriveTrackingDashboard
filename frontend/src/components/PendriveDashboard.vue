<template>
  <div class="card">
    <DataTable
      v-model:filters="filters"
      v-model:selection="pendrivesStore.selectedPendrives"
      :value="pendrives"
      paginator
      :rows="10"
      dataKey="id"
      filterDisplay="menu"
      :globalFilterFields="[
        'id',
        'description',
        'location',
        'createdAt',
        'pendriveStatus.description',
      ]"
    >
      <template #header>
        <div class="flex justify-between">
          <Button
            type="button"
            icon="pi pi-filter-slash"
            label="Clear"
            outlined
            @click="clearFilter()"
          />
          <span class="relative">
            <i
              class="pi pi-search absolute top-2/4 -mt-2 left-3 text-surface-400 dark:text-surface-600"
            />
            <InputText
              v-model="filters['global'].value"
              placeholder="Keyword Search"
              class="pl-10 font-normal"
            />
          </span>
        </div>
      </template>
      <template #empty> No pendrives found. </template>
      <template v-if="showCheckbox">
        <Column selectionMode="multiple" headerStyle="width: 3rem"></Column>
      </template>

      <Column field="id" header="Pendrive Id" sortable style="min-width: 14rem">
        <template #body="{ data }">
          {{ data.id }}
        </template>
        <template #filter="{ filterModel }">
          <InputText
            v-model="filterModel.value"
            type="number"
            class="p-column-filter"
            placeholder="Search by id"
          />
        </template>
      </Column>
      <Column
        field="description"
        header="Description"
        sortable
        style="min-width: 14rem"
      >
        <template #body="{ data }">
          {{ data.description }}
        </template>
        <template #filter="{ filterModel }">
          <InputText
            v-model="filterModel.value"
            type="text"
            class="p-column-filter"
            placeholder="Search by description"
          />
        </template>
      </Column>
      <Column
        header="Location"
        sortable
        sortField="location"
        filterField="location"
        style="min-width: 14rem"
      >
        <template #body="{ data }">
          {{ data.location }}
        </template>
        <template #filter="{ filterModel }">
          <InputText
            v-model="filterModel.value"
            type="text"
            class="p-column-filter"
            placeholder="Search by location"
          />
        </template>
      </Column>
      <Column
        field="createdAt"
        header="Created At"
        sortable
        filterField="createdAt"
        dataType="date"
        style="min-width: 10rem"
      >
        <template #body="{ data }">
          {{ formatDate(data.createdAt) }}
        </template>
        <template #filter="{ filterModel }">
          <Calendar
            v-model="filterModel.value"
            dateFormat="mm/dd/yy"
            placeholder="mm/dd/yyyy"
            mask="99/99/9999"
          />
        </template>
      </Column>
      <Column
        field="status"
        header="Status"
        sortable
        sortField="pendriveStatus.description"
        filterField="pendriveStatus.description"
        filterMatchMode="equals"
        style="width: 25%"
      >
        <template #body="{ data }">
          <Tag
            :value="data.pendriveStatus.description"
            :severity="getSeverity(data.pendriveStatus.id)"
          />
        </template>
        <template #filter="{ filterModel }">
          <Dropdown
            v-model="filterModel.value"
            :options="statuses"
            optionLabel="description"
            placeholder="Select One"
            class="p-column-filter"
            showClear
          >
            <template #option="slotProps">
              <Tag
                :value="slotProps.option.description"
                :severity="getSeverity(slotProps.option.id)"
              />
            </template>
          </Dropdown>
        </template>
      </Column>
      <Column
        v-if="pendrivesStore.pendriveAction === ActionEnum.Update"
        header="Action"
        headerStyle="width: 5rem; text-align: center"
        style="min-width: 6rem"
        bodyStyle="overflow: visible"
      >
        <template #body="{ data }">
          <Button
            type="button"
            icon="pi pi-cog"
            rounded
            @click="
              modal.showModal(
                ItemEnum.Pendrive,
                JSON.parse(JSON.stringify(data))
              )
            "
          />
        </template>
      </Column>
    </DataTable>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { FilterMatchMode, FilterOperator } from "primevue/api";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import InputText from "primevue/inputtext";
import Tag from "primevue/tag";
import Dropdown from "primevue/dropdown";
import Button from "primevue/button";
import Calendar from "primevue/calendar";

import { usePendrives } from "../stores/pendrives";
import { usePendriveStatuses } from "../stores/pendriveStatuses";
import { Pendrive } from "../models/pendrive";
import { getSeverity } from "../utils/utilFuncs";

import { useModal } from "../composables/modal";
import { ItemEnum } from "../enums/ItemEnum";
import { ActionEnum } from "../enums/ActionEnum";
import { PendriveStatus } from "../models/PendriveStatus";

const modal = useModal();

const props = defineProps<{
  showCheckbox: boolean;
  displayPendrives: Pendrive[];
}>();

const pendriveStatusStore = usePendriveStatuses();
const pendrivesStore = usePendrives();

const pendrives = ref<Pendrive[]>([]);
const filters = ref<any>();
const statuses = ref<PendriveStatus[]>();

onMounted(() => {
  const { showCheckbox, displayPendrives } = props;
  pendrives.value = getPendrives(displayPendrives);
  statuses.value = pendriveStatusStore.allItems;
});

const initFilters = () => {
  filters.value = {
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    id: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
    },
    description: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
    },
    location: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
    },
    createdAt: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }],
    },
    "pendriveStatus.description": {
      operator: FilterOperator.OR,
      constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
    },
  };
};

initFilters();

const formatDate = (value: Date): string => {
  return value.toLocaleDateString("en-US", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

const clearFilter = () => {
  initFilters();
};

const getPendrives = (data: Pendrive[]): Pendrive[] => {
  return data.map((d) => {
    // Assuming that your 'date' property is a string, parse it into a Date object
    if (d.createdAt && typeof d.createdAt === "string") {
      d.createdAt = new Date(d.createdAt);
    }
    return d;
  });
};
</script>

<style scoped>
@import "primevue/resources/themes/lara-dark-teal/theme.css";
@import "primevue/resources/primevue.min.css";
/* Order */
@layer reset, primevue;

/* Reset CSS */
@layer reset {
  Button {
    /* CSS to Reset */
    color: green;
  }
}
</style>
../enums/ItemEnum
