<script setup lang="ts">
import { onMounted, reactive, ref, watch } from "vue";
import { defineProps, defineEmits } from "vue";
import {
  emptyLoanRequest,
  EmptyLoanRequest,
  LoanRequest,
  LoanRequestCreation,
  LoanRequestUpdate,
} from "../models/loanRequest";
import { useDemands } from "../stores/demands";
import { useUsers } from "../stores/users";
import { usePendrives } from "../stores/pendrives";
import { formatDate, isValidEmail } from "../utils/utilFuncs";
import debounce from "lodash/debounce";
import Calendar from "primevue/calendar";
import { Demand } from "../models/demand";
import { emptyUser, User } from "../models/user";
import PendriveDashboard from "./PendriveDashboard.vue";
import DropdownOptions from "./DropdownOptions.vue";
import { ActionEnum } from "../enums/ActionEnum";
import { ItemEnum } from "../enums/ItemEnum";
import { useRequestStatuses } from "../stores/requestStatuses";

const props = defineProps<{
  currLoanRequest: EmptyLoanRequest | LoanRequest;
  action: ActionEnum;
}>();

const emit = defineEmits<{
  (
    event: "submit",
    finalLoanRequest: LoanRequestCreation | LoanRequestUpdate
  ): void;
}>();

const demandsStore = useDemands();
const usersStore = useUsers();
const pendrivesStore = usePendrives();
const requestStatusStore = useRequestStatuses();

const requestStatus = requestStatusStore.allItems;

const demandId = ref("");
const demandName = ref("");

let requestor = reactive({ ...emptyUser });
let approver = reactive({ ...emptyUser });
let returnApprover = reactive({ ...emptyUser });

const demandIdError = ref("");

const emailErrorMsg = "Invalid Email";
const emailErrors = reactive({
  requestor: "",
  approver: "",
  returnApprover: "",
});
const pendriveError = ref("");

const pendrives = pendrivesStore.availablePendrives;
const loanRequest = ref<EmptyLoanRequest | LoanRequest>(emptyLoanRequest);

onMounted(() => {
  loanRequest.value = getLoanRequest(props.currLoanRequest);
  requestStatusStore.setSelectedRequestStatus(
    props.currLoanRequest.requestStatusId ?? 1
  );

  requestor.email = loanRequest.value.createdBy.email || "";
  requestor.name = loanRequest.value.createdBy.name || "";
  requestor.id = loanRequest.value.createdBy.id || "";

  approver.email = loanRequest.value.approvedBy?.email || "";
  approver.name = loanRequest.value.approvedBy?.name || "";
  approver.id = loanRequest.value.approvedBy?.id || "";

  returnApprover.email = loanRequest.value.returnApprovedBy?.email || "";
  returnApprover.name = loanRequest.value.returnApprovedBy?.name || "";
  returnApprover.id = loanRequest.value.returnApprovedBy?.id || "";

  const parsedLoanReq = JSON.parse(JSON.stringify(loanRequest.value));
  pendrivesStore.setSelectedPendrives(parsedLoanReq.pendrives);

  demandId.value = loanRequest.value.demandId;
  demandName.value = loanRequest.value.demand.name;
});

const getLoanRequest = (
  d: EmptyLoanRequest | LoanRequest
): EmptyLoanRequest | LoanRequest => {
  d.startDate = d.startDate ? new Date(d.startDate) : "";
  d.endDate = d.endDate ? new Date(d.endDate) : "";
  d.returnDate = d.returnDate ? new Date(d.returnDate) : "";
  return d;
};

watch(
  [demandId],
  debounce(async ([newDemandId]: [string, string]) => {
    pendriveError.value = "";
    demandIdError.value = "";

    try {
      if (newDemandId.length === 11) {
        const fetchedDemand: Demand = await demandsStore.getDemandById(
          newDemandId
        );

        console.log(fetchedDemand);

        demandName.value = fetchedDemand ? fetchedDemand.name : "";

        if (!fetchedDemand) {
          demandIdError.value = "Invalid Demand Id";
        }
      } else {
        demandName.value = "";
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }, 250),
  {
    immediate: true,
  }
);

const watchEmail = (emailField: string, user: any) => {
  watch(
    () => user.email,
    async (newEmail: string) => {
      debounce(async () => {
        emailErrors.requestor = "";
        emailErrors.approver = "";
        emailErrors.returnApprover = "";
        try {
          if (isValidEmail(newEmail)) {
            const fetchedUser: User = await usersStore.getUserByEmail(newEmail);

            if (!fetchedUser) {
              switch (emailField) {
                case "requestor":
                  emailErrors.requestor = emailErrorMsg;
                  break;
                case "approver":
                  emailErrors.approver = emailErrorMsg;
                  break;
                case "returnApproved":
                  emailErrors.returnApprover = emailErrorMsg;
                  break;
                default:
                  break;
              }
            } else {
              switch (emailField) {
                case "requestor":
                  requestor.email = fetchedUser.email;
                  requestor.name = fetchedUser.name;
                  requestor.id = fetchedUser.id;
                  emailErrors.requestor = "";
                  break;
                case "approver":
                  approver.email = fetchedUser.email;
                  approver.name = fetchedUser.name;
                  approver.id = fetchedUser.id;
                  emailErrors.approver = "";
                  break;
                case "returnApproved":
                  returnApprover.email = fetchedUser.email;
                  returnApprover.name = fetchedUser.name;
                  returnApprover.id = fetchedUser.id;
                  emailErrors.returnApprover = "";
                  break;
                default:
                  break;
              }
            }
          }
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      }, 250)();
    },
    { immediate: true }
  );
};

watchEmail("requestor", requestor);
watchEmail("approver", approver);
watchEmail("returnApproved", returnApprover);

const handleClick = () => {
  if (props.currLoanRequest.name.length === 0) {
    demandIdError.value = "Invalid Demand Id";
  } else if (pendrivesStore.selectedPendrives.length == 0) {
    pendriveError.value =
      "Please pick at least one pendrive before submitting loan request.";
  } else {
    pendriveError.value = "";
    const { createdBy, demand, startDate, endDate, ...remainingLoanReq } =
      props.currLoanRequest;

    const pendriveIds = pendrivesStore.selectedPendrives.map((p) => p.id);
    pendriveIds.sort();

    const newLoanReq: LoanRequestCreation = {
      ...remainingLoanReq,
      startDate: formatDate(startDate),
      endDate: formatDate(endDate),
      pendriveIds: pendriveIds,
      demandId: demandId.value,
      createdById: requestor.id,
    };

    if (props.action == ActionEnum.Write) {
      emit("submit", newLoanReq);
    } else {
      const updatedLoanReq: LoanRequestUpdate = {
        ...newLoanReq,
        id: remainingLoanReq.id ?? null,
        returnDate: remainingLoanReq.returnDate
          ? formatDate(remainingLoanReq.returnDate)
          : null,
        createdById: requestor.id,
        approvedById: approver.id ? approver.id : null,
        returnApprovedById: returnApprover.id ? returnApprover.id : null,
        requestStatusId: requestStatusStore.selectedRequestStatus?.id ?? null,
      };

      emit("submit", updatedLoanReq);
    }
  }
};
</script>

<template>
  <!-- prevent default behaviour of reloading the page when posting a request using .prevent -->
  <form class="form" @submit.prevent="handleClick">
    <div class="space-y-5">
      <div class="border-b border-gray-900/10 pb-8">
        <h2 class="text-base font-semibold leading-7 text-gray-900">
          Loan Pendrive Request Details
        </h2>
        <p class="mt-1 text-sm leading-6 text-gray-600">
          Enter the loan pendrive request details.
        </p>

        <div class="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
          <div class="sm:col-span-3">
            <label
              for="request-name"
              class="block text-sm font-medium leading-6 text-gray-900"
              >Request Title</label
            >
            <div class="mt-2">
              <input
                v-model="loanRequest.name"
                required
                type="text"
                name="request-name"
                id="request-name"
                autocomplete="text"
                class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>
          <div class="sm:col-span-3" v-if="props.action === ActionEnum.Update">
            <label
              for="request-status"
              class="block text-sm font-medium leading-6 text-gray-900"
              >Request Status</label
            >
            <div class="mt-2">
              <DropdownOptions
                :options="requestStatus"
                :item="ItemEnum.LoanRequest"
              />
            </div>
          </div>
        </div>
      </div>

      <div class="border-b border-gray-900/10 pb-8">
        <h2 class="text-base font-semibold leading-7 text-gray-900">
          Demand Details
        </h2>
        <p class="mt-1 text-sm leading-6 text-gray-600">
          Enter the loan type and demand details.
        </p>

        <div class="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
          <div class="sm:col-span-4">
            <fieldset>
              <label
                for="loan-type"
                class="block text-sm font-medium leading-6 text-gray-900"
                >Loan Type</label
              >
              <div class="mt-6 flex flex-col sm:flex-row items-start gap-x-3">
                <div class="flex items-center gap-x-3">
                  <input
                    required
                    v-bind:checked="loanRequest.loanTypeId === 1"
                    @change="loanRequest.loanTypeId = 1"
                    id="internal-req"
                    name="loan-type"
                    type="radio"
                    class="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                  />
                  <label
                    for="internal-req"
                    class="block text-sm font-medium leading-6 text-gray-900"
                    >Internal Request (Validation Purpose)</label
                  >
                </div>
                <div class="flex items-center gap-x-3 mt-2 sm:mt-0 sm:ml-4">
                  <input
                    required
                    v-bind:checked="loanRequest.loanTypeId === 2"
                    @change="loanRequest.loanTypeId = 2"
                    id="personal-loan"
                    name="loan-type"
                    type="radio"
                    class="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                  />
                  <label
                    for="personal-loan"
                    class="block text-sm font-medium leading-6 text-gray-900"
                    >Personal Loan (Internal Long-Term Loan)</label
                  >
                </div>
              </div>
            </fieldset>
          </div>

          <div class="sm:col-span-3">
            <label
              for="demand-id"
              class="block text-sm font-medium leading-6 text-gray-900"
              >Demand ID</label
            >
            <div class="mt-2">
              <input
                required
                v-model="demandId"
                type="text"
                name="demand-id"
                id="demand-id"
                autocomplete="text"
                class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
              <div v-if="demandIdError" class="mt-2">
                <p className="text-sm text-red-500 ">{{ demandIdError }}</p>
              </div>
            </div>
          </div>

          <div class="sm:col-span-3">
            <label
              for="demand-name"
              class="block text-sm font-medium leading-6 text-gray-900"
              >Demand Name</label
            >
            <div class="mt-2">
              <input
                required
                disabled
                v-model="demandName"
                type="text"
                name="demand-name"
                id="demand-name"
                autocomplete="text"
                class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 opacity-40"
              />
            </div>
          </div>
        </div>
      </div>

      <div class="border-b border-gray-900/10 pb-8">
        <h2 class="text-base font-semibold leading-7 text-gray-900">
          User Details
        </h2>
        <p class="mt-1 text-sm leading-6 text-gray-600">
          Enter the loan person details
        </p>

        <div class="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
          <div class="sm:col-span-3">
            <label
              for="created-by-email"
              class="block text-sm font-medium leading-6 text-gray-900"
              >Requestor Email</label
            >
            <div class="mt-2">
              <input
                required
                v-model="requestor.email"
                type="email"
                name="created-by-email"
                id="created-by-email"
                autocomplete="email"
                class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
              <div v-if="emailErrors.requestor" class="mt-2">
                <p className="text-sm text-red-500 ">
                  {{ emailErrors.requestor }}
                </p>
              </div>
            </div>
          </div>

          <div class="sm:col-span-3">
            <label
              for="created-by"
              class="block text-sm font-medium leading-6 text-gray-900"
              >Requestor Name</label
            >
            <div class="mt-2">
              <input
                disabled
                v-model="requestor.name"
                type="text"
                name="created-by"
                id="created-by"
                autocomplete="name"
                class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 opacity-40"
              />
            </div>
          </div>
        </div>

        <template v-if="props.action === ActionEnum.Update">
          <div class="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            <div class="sm:col-span-3">
              <label
                for="created-by-email"
                class="block text-sm font-medium leading-6 text-gray-900"
                >Approver Email</label
              >
              <div class="mt-2">
                <input
                  v-model="approver.email"
                  type="email"
                  name="approved-by-email"
                  id="approved-by-email"
                  autocomplete="email"
                  class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
                <div v-if="emailErrors.approver" class="mt-2">
                  <p className="text-sm text-red-500 ">
                    {{ emailErrors.approver }}
                  </p>
                </div>
              </div>
            </div>

            <div class="sm:col-span-3">
              <label
                for="approved-by"
                class="block text-sm font-medium leading-6 text-gray-900"
                >Approver Name</label
              >
              <div class="mt-2">
                <input
                  disabled
                  v-model="approver.name"
                  type="text"
                  name="approved-by"
                  id="approved-by"
                  autocomplete="name"
                  class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 opacity-40"
                />
              </div>
            </div>
          </div>

          <div class="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            <div class="sm:col-span-3">
              <label
                for="created-by-email"
                class="block text-sm font-medium leading-6 text-gray-900"
                >Return Approver Email</label
              >
              <div class="mt-2">
                <input
                  v-model="returnApprover.email"
                  type="email"
                  name="return-approved-by-email"
                  id="return-approved-by-email"
                  autocomplete="email"
                  class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
                <div v-if="emailErrors.returnApprover" class="mt-2">
                  <p className="text-sm text-red-500 ">
                    {{ emailErrors.returnApprover }}
                  </p>
                </div>
              </div>
            </div>

            <div class="sm:col-span-3">
              <label
                for="return-approved-by"
                class="block text-sm font-medium leading-6 text-gray-900"
                >Return Approver Name</label
              >
              <div class="mt-2">
                <input
                  disabled
                  v-model="returnApprover.name"
                  type="text"
                  name="return-approved-by"
                  id="return-approved-by"
                  autocomplete="name"
                  class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 opacity-40"
                />
              </div>
            </div>
          </div>
        </template>
      </div>

      <div class="border-b border-gray-900/10 pb-8">
        <h2 class="text-base font-semibold leading-7 text-gray-900">
          Loan Duration
        </h2>
        <p class="mt-1 text-sm leading-6 text-gray-600">
          Select date range for loan.
        </p>

        <div class="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
          <div class="sm:col-span-2">
            <label
              for="startDate"
              class="block text-sm font-medium leading-6 text-gray-900"
              >Start Date</label
            >
            <div class="mt-2">
              <Calendar
                aria-required="true"
                :min-date="new Date()"
                :maxDate="loanRequest.endDate ? loanRequest.endDate : null"
                v-model="loanRequest.startDate"
                dateFormat="yy-mm-dd"
                showIcon
                inputId="startDate"
              />
            </div>
          </div>

          <div class="sm:col-span-2">
            <label
              for="endDate"
              class="block text-sm font-medium leading-6 text-gray-900"
              >End Date</label
            >
            <div class="mt-2">
              <Calendar
                aria-required="true"
                :minDate="loanRequest.startDate ? loanRequest.startDate : null"
                v-model="loanRequest.endDate"
                dateFormat="yy-mm-dd"
                showIcon
                inputId="endDate"
              />
            </div>
          </div>

          <div class="sm:col-span-2" v-if="props.action === ActionEnum.Update">
            <label
              for="returnDate"
              class="block text-sm font-medium leading-6 text-gray-900"
              >Return Date</label
            >
            <div class="mt-2">
              <Calendar
                aria-required="true"
                :minDate="loanRequest.startDate ? loanRequest.startDate : null"
                v-model="loanRequest.returnDate"
                dateFormat="yy-mm-dd"
                showIcon
                inputId="returnDate"
              />
            </div>
          </div>
        </div>
      </div>
      <div class="border-b border-gray-900/10 pb-8">
        <h2 class="text-base font-semibold leading-7 text-gray-900">
          Pendrive Details
        </h2>
        <p class="mt-1 text-sm leading-6 text-gray-600">Select pendrive(s).</p>

        <div class="mt-10 space-y-10">
          <fieldset>
            <!-- data table with checkbox for selection -->
            <PendriveDashboard
              :showCheckbox="true"
              :displayPendrives="pendrives"
            />
            <div v-if="pendriveError" class="mt-2">
              <p className="text-sm text-red-500 ">{{ pendriveError }}</p>
            </div>
          </fieldset>
        </div>
      </div>
    </div>

    <div class="mt-6 flex items-center justify-end gap-x-6">
      <button
        type="button"
        class="text-sm font-semibold leading-6 text-gray-900"
      >
        Cancel
      </button>
      <button
        type="submit"
        class="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
      >
        Submit
      </button>
    </div>
  </form>
</template>

<style lang="scss" scoped></style>
