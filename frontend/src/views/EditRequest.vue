<script setup lang="ts">
import RequestForm from "../components/RequestForm.vue";
import { useRoute, useRouter } from "vue-router";
import { useLoanRequests } from "../stores/loanRequests";
import { LoanRequestUpdate } from "../models/loanRequest";
import { usePendrives } from "../stores/pendrives";
import { ActionEnum } from "../enums/ActionEnum";

const route = useRoute();
const router = useRouter();
const loanRequestsStore = useLoanRequests();
const pendrivesStore = usePendrives();

const id = route.params.id as string;
const currLoanRequest = JSON.parse(
  JSON.stringify(loanRequestsStore.all.get(id))
);

if (!currLoanRequest) {
  window.alert(`Loan Request with id ${id} was not found!`);
  router.push("/");
} else {
  currLoanRequest.returnDate = currLoanRequest.returnDate
    ? currLoanRequest.returnDate
    : null;
}

console.log(currLoanRequest);

async function handleSubmit(finalLoanRequest: LoanRequestUpdate) {
  try {
    await loanRequestsStore.updateLoanRequest({
      ...finalLoanRequest,
    });

    window.alert("Request has been updated successfully!");

    router.push("/").then(() => router.go(0));

    pendrivesStore.selectedPendrives.length = 0;
  } catch (error) {
    console.error("Error creating loan request:", error);
  }
}
</script>

<template>
  <main class="create-request-page">
    <div>
      <h2
        class="text-2xl font-bold leading-7 sm:truncate sm:text-3xl sm:tracking-tight mb-5"
      >
        Edit Request
      </h2>
      <div class="flex flex-col sm:flex-row sm:flex-wrap sm:space-x-6">
        <RequestForm
          :currLoanRequest="currLoanRequest"
          :action="ActionEnum.Update"
          @submit="handleSubmit"
        />
      </div>
    </div>
  </main>
</template>

<style scoped lang="scss">
h1 {
  color: var(--primary);
}
</style>
