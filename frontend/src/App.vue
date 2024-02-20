<script setup lang="ts">
import { computed } from "vue";
import SideBar from "./components/SideBar.vue";
import { useModal } from "./composables/modal";

const modal = useModal();

const modalStyle = computed(() => {
  // depending on modal.show.value, display modal or not
  return {
    display: modal.show.value ? "block" : "none",
  };
});
</script>

<template>
  <div>
    <div class="app">
      <SideBar />
      <router-view />
    </div>

    <!-- modal code-->
    <div class="modal" :style="modalStyle">
      <div class="modal-background">
        <div class="modal-content">
          <!-- div with id = modal to be teleported here -->
          <div id="modal"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

:root {
  --primary: #25476a;
  --primary-alt: #03a0f4;
  --secondary: #edf1f6;
  --secondary-alt: #e1e7f0;
  --grey: #b0b0b0;
  --dark: #1e293b;
  --dark-alt: #334155;
  --light: #f1f5f9;
  --white: #ffffff;
  --sidebar-width: 300px;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: "Fira sans", sans-serif;
}

body {
  background: var(--secondary);
}

button {
  cursor: pointer;
  appearance: none;
  border: none;
  outline: none;
  background: none;
}

.app {
  display: flex;

  main {
    flex: 1 1 0;
    padding: 2rem;

    @media (max-width: 1024px) {
      padding-left: 6rem;
    }
  }
}
</style>
