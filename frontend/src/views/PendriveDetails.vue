<script setup lang="ts">
import PendriveDashboard from "../components/PendriveDashboard.vue";
import { usePendrives } from "../stores/pendrives";

const pendrivesStore = usePendrives();
const pendrives = pendrivesStore.allItems;

</script>

<template>
  <main class="pendrive-details-page">
    <div>
      <h2 class="text-2xl font-bold leading-7 sm:truncate sm:text-3xl sm:tracking-tight mb-5">Pendrive Details Dashboard</h2>
      <div class="flex flex-col sm:flex-row sm:flex-wrap sm:space-x-6">
        <PendriveDashboard :showCheckbox="false" :displayPendrives="pendrives"/>
      </div>
    </div>
  </main>
</template>

<style scoped lang="scss">
</style>
