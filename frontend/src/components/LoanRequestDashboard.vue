<template>
  <div class="card">
    <DataTable
      v-model:filters="filters"
      v-model:selection="selectedLoanRequests"
      :value="loanRequests"
      paginator
      :rows="10"
      dataKey="id"
      filterDisplay="menu"
      :globalFilterFields="[
        'id',
        'name',
        'startDate',
        'endDate',
        'returnDate',
        'loanType.description',
        'requestStatus.description',
        'demand.name',
        'pendrives',
        'createdBy.name',
        'approvedBy.name',
        'returnApprovedBy.name',
        'createdAt',
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
      <template #empty> No loan requests found. </template>
      <Column
        field="id"
        header="LoanRequest Id"
        sortable
        style="min-width: 14rem"
      >
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
      <Column field="name" header="Name" sortable style="min-width: 14rem">
        <template #body="{ data }">
          {{ data.name }}
        </template>
        <template #filter="{ filterModel }">
          <InputText
            v-model="filterModel.value"
            type="text"
            class="p-column-filter"
            placeholder="Search by name"
          />
        </template>
      </Column>
      <Column
        field="startDate"
        header="Start Date"
        sortable
        filterField="startDate"
        dataType="date"
        style="min-width: 10rem"
      >
        <template #body="{ data }">
          {{ formatDate(data.startDate) }}
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
        field="endDate"
        header="End Date"
        sortable
        filterField="endDate"
        dataType="date"
        style="min-width: 10rem"
      >
        <template #body="{ data }">
          {{ formatDate(data.endDate) }}
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
        field="returnDate"
        header="Return Date"
        sortable
        filterField="returnDate"
        dataType="date"
        style="min-width: 10rem"
      >
        <template #body="{ data }">
          {{ data.returnDate ? formatDate(data.returnDate) : "-" }}
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
        header="Loan Type"
        sortable
        sortField="loanType.description"
        filterField="loanType.description"
        filterMatchMode="equals"
        style="width: 25%"
      >
        <template #body="{ data }">
          <Tag
            :value="data.loanType.description"
            :severity="getSeverity(data.loanType.id)"
          />
        </template>
        <template #filter="{ filterModel }">
          <Dropdown
            v-model="filterModel.value"
            :options="loanTypes"
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
        header="Status"
        sortable
        sortField="requestStatus.description"
        filterField="requestStatus.description"
        filterMatchMode="equals"
        style="width: 25%"
      >
        <template #body="{ data }">
          <Tag
            :value="data.requestStatus.description"
            :severity="getSeverity(data.requestStatus.id)"
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
        header="Demand ID"
        sortable
        sortField="demand.id"
        filterField="demand.id"
        :showFilterMatchModes="false"
        style="min-width: 14rem"
      >
        <template #body="{ data }">
          {{ data.demand.id }}
        </template>
        <template #filter="{ filterModel }">
          <InputText
            v-model="filterModel.value"
            type="text"
            class="p-column-filter"
            placeholder="Search by Demand Id"
          />
        </template>
      </Column>
      <Column
        header="Pendrive(s)"
        filterField="pendrives"
        style="min-width: 14rem"
        :showFilterMatchModes="false"
      >
        <template #body="{ data }">
          <div>
            <div v-for="pendrive in data.pendrives" :key="pendrive.id">
              <span>{{ pendrive.id }} | {{ pendrive.description }}</span>
              <br />
            </div>
          </div>
        </template>
        <template #filter="{ filterModel }">
          <MultiSelect
            v-model="filterModel.value"
            :options="pendrives"
            optionLabel="description"
            placeholder="Any"
            class="p-column-filter"
          >
            <template #option="slotProps">
              <div class="flex items-center gap-2">
                <span>{{ slotProps.option.description }}</span>
              </div>
            </template>
          </MultiSelect>
        </template>
      </Column>
      <Column
        header="Created By"
        filterField="createdBy"
        :showFilterMatchModes="false"
        :filterMenuStyle="{ width: '14rem' }"
        style="min-width: 14rem"
      >
        <template #body="{ data }">
          <div class="flex items-center gap-2">
            <img
              :alt="data.createdBy.name"
              :src="`https://primefaces.org/cdn/primevue/images/avatar/ionibowcher.png`"
              style="width: 32px"
            />
            <span>{{ data.createdBy.name }}</span>
          </div>
        </template>
        <template #filter="{ filterModel }">
          <MultiSelect
            v-model="filterModel.value"
            :options="users"
            optionLabel="name"
            placeholder="Any"
            class="p-column-filter"
          >
            <template #option="slotProps">
              <div class="flex items-center gap-2">
                <img
                  :alt="slotProps.option.name"
                  :src="`https://primefaces.org/cdn/primevue/images/avatar/ionibowcher.png`"
                  style="width: 32px"
                />
                <span>{{ slotProps.option.name }}</span>
              </div>
            </template>
          </MultiSelect>
        </template>
      </Column>
      <Column
        header="Approved By"
        filterField="approvedBy"
        :showFilterMatchModes="false"
        :filterMenuStyle="{ width: '14rem' }"
        style="min-width: 14rem"
      >
        <template #body="{ data }">
          <div class="flex items-center gap-2">
            <div v-if="data.approvedBy">
              <img
                :alt="data.approvedBy.name"
                :src="`https://primefaces.org/cdn/primevue/images/avatar/ionibowcher.png`"
                style="width: 32px"
              />
              <span>{{ data.approvedBy.name }}</span>
            </div>
            <div v-else>-</div>
          </div>
        </template>
        <template #filter="{ filterModel }">
          <MultiSelect
            v-model="filterModel.value"
            :options="users"
            optionLabel="name"
            placeholder="Any"
            class="p-column-filter"
          >
            <template #option="slotProps">
              <div class="flex items-center gap-2">
                <img
                  :alt="slotProps.option.name"
                  :src="`https://primefaces.org/cdn/primevue/images/avatar/ionibowcher.png`"
                  style="width: 32px"
                />
                <span>{{ slotProps.option.name }}</span>
              </div>
            </template>
          </MultiSelect>
        </template>
      </Column>
      <Column
        header="Return Approved By"
        filterField="returnApprovedBy"
        :showFilterMatchModes="false"
        :filterMenuStyle="{ width: '14rem' }"
        style="min-width: 14rem"
      >
        <template #body="{ data }">
          <div class="flex items-center gap-2">
            <div v-if="data.returnApprovedBy">
              <img
                :alt="data.returnApprovedBy.name"
                :src="`https://primefaces.org/cdn/primevue/images/avatar/ionibowcher.png`"
                style="width: 32px"
              />
              <span>{{ data.returnApprovedBy.name }}</span>
            </div>
            <div v-else>-</div>
          </div>
        </template>

        <template #filter="{ filterModel }">
          <MultiSelect
            v-model="filterModel.value"
            :options="users"
            optionLabel="name"
            placeholder="Any"
            class="p-column-filter"
          >
            <template #option="slotProps">
              <div class="flex items-center gap-2">
                <img
                  :alt="slotProps.option.name"
                  :src="`https://primefaces.org/cdn/primevue/images/avatar/ionibowcher.png`"
                  style="width: 32px"
                />
                <span>{{ slotProps.option.name }}</span>
              </div>
            </template>
          </MultiSelect>
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
                ItemEnum.LoanRequest,
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
import MultiSelect from "primevue/multiselect";
import Tag from "primevue/tag";
import Dropdown from "primevue/dropdown";
import Button from "primevue/button";
import Calendar from "primevue/calendar";

import { useLoanRequests } from "../stores/loanRequests";
import { useLoanTypes } from "../stores/loanTypes";
import { useRequestStatuses } from "../stores/requestStatuses";
import { useUsers } from "../stores/users";
import { usePendrives } from "../stores/pendrives";

import { LoanRequest } from "../models/loanRequest";
import { getSeverity } from "../utils/utilFuncs";

import { useModal } from "../composables/modal";
import { ItemEnum } from "../enums/ItemEnum";

const modal = useModal();

const loanRequestsStore = useLoanRequests();
const loanTypesStore = useLoanTypes();
const requestStatusStore = useRequestStatuses();
const usersStore = useUsers();
const pendrivesStore = usePendrives();

const loanRequests = ref<LoanRequest[]>([]);
const selectedLoanRequests = ref<LoanRequest[]>([]);
const filters = ref<any>();
const pendrives = pendrivesStore.allItems;

const statuses = requestStatusStore.allItems;
const users = usersStore.allItems;
const loanTypes = loanTypesStore.allItems;

onMounted(() => {
  loanRequests.value = getLoanRequests(loanRequestsStore.allItems);
});

console.log(loanRequests.value);

const initFilters = () => {
  filters.value = {
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    id: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
    },
    name: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
    },
    startDate: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }],
    },
    endDate: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }],
    },
    returnDate: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }],
    },
    "loanType.description": {
      operator: FilterOperator.OR,
      constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
    },
    "requestStatus.description": {
      operator: FilterOperator.OR,
      constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
    },
    "demand.id": {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.IN }],
    },

    pendrives: {
      operator: FilterOperator.OR,
      constraints: [{ value: null, matchMode: FilterMatchMode.IN }],
    },
    createdBy: { value: null, matchMode: FilterMatchMode.IN },
    approvedBy: { value: null, matchMode: FilterMatchMode.IN },
    returnApprovedBy: { value: null, matchMode: FilterMatchMode.IN },
    createdAt: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }],
    }
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

const getLoanRequests = (data: LoanRequest[]): LoanRequest[] => {
  return data.map((d) => {
    // Assuming that your 'date' property is a string, parse it into a Date object
    if (d.createdAt && typeof d.createdAt === "string") {
      d.createdAt = new Date(d.createdAt);
    }
    d.startDate = new Date(d.startDate);
    d.endDate = new Date(d.endDate);
    d.returnDate = d.returnDate ? new Date(d.returnDate) : d.returnDate;
    return d;
  });
};
</script>

<style scoped>
/* Order */
@import "primevue/resources/themes/lara-dark-teal/theme.css";
@import "primevue/resources/primevue.min.css";
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
