<script setup lang="ts">
import LoanRequestDashboard from "../components/LoanRequestDashboard.vue";
</script>

<template>
  <main class="home-page">
    <div>
      <h2 class="text-2xl font-bold leading-7 sm:truncate sm:text-3xl sm:tracking-tight mb-5">Pendrive Loan Request Tracking Dashboard</h2>
      <div class="flex flex-col sm:flex-row sm:flex-wrap sm:space-x-6">
        <LoanRequestDashboard />
      </div>
    </div>
  </main>
</template>

<style scoped lang="scss">
</style>
