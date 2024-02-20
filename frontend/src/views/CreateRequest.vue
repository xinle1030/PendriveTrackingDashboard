<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import RequestForm from "../components/RequestForm.vue";
import {
  EmptyLoanRequest,
  emptyLoanRequest,
  LoanRequestCreation,
} from "../models/loanRequest";
import { useLoanRequests } from "../stores/loanRequests";
import { usePendrives } from "../stores/pendrives";
import { ActionEnum } from "../enums/ActionEnum";

const newLoanRequest = ref<EmptyLoanRequest>(emptyLoanRequest);
const loanRequestsStore = useLoanRequests();
const pendrivesStore = usePendrives();
const router = useRouter();

async function handleSubmit(finalLoanRequest: LoanRequestCreation) {
  try {
    await loanRequestsStore.createLoanRequest({
      ...finalLoanRequest,
    });

    window.alert("Request has been created successfully!");

    router.push("/").then(() => {
      router.go(0);
    });

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
        Create Request
      </h2>
      <div class="flex flex-col sm:flex-row sm:flex-wrap sm:space-x-6">
        <RequestForm :currLoanRequest="newLoanRequest" :action="ActionEnum.Write" @submit="handleSubmit" />
      </div>
    </div>
  </main>
</template>

<style scoped lang="scss">
h1 {
  color: var(--primary);
}
</style>
