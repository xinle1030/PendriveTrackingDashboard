import { createApp } from "vue";
import App from "./App.vue";
import { createPinia } from "pinia";
import { router } from "./router";

import "material-design-icons-iconfont/dist/material-design-icons.css";

// TailwindCSS
import "./style.css";

// PrimaVue
import PrimeVue from "primevue/config";
import "primeicons/primeicons.css";
import Lara from "./presets/lara"; //import preset
import { useDemands } from "./stores/demands";
import { usePendrives } from "./stores/pendrives";
import { usePendriveStatuses } from "./stores/pendriveStatuses";
import { useLoanRequests } from "./stores/loanRequests";
import { useLoanTypes } from "./stores/loanTypes";
import { useRequestStatuses } from "./stores/requestStatuses";
import { useUsers } from "./stores/users";

const app = createApp(App);

app
  .use(PrimeVue, {
    unstyled: false,
    pt: Lara, //apply preset
  })
  .use(createPinia());

const demandsStore = useDemands();
const pendrivesStore = usePendrives();
const pendriveStatusStore = usePendriveStatuses();
const loanRequestStore = useLoanRequests();
const loanTypeStore = useLoanTypes();
const requestStatusStore = useRequestStatuses();
const usersStore = useUsers();

// Use Promise.all to execute multiple asynchronous call
// by the time we install our router and mount application, we ady loaded the authentication state and all posts
Promise.all([
  loanTypeStore.fetchLoanTypes(),
  pendriveStatusStore.fetchPendriveStatuses(),
  requestStatusStore.fetchRequestStatuses(),

  pendrivesStore.fetchPendrives(),
  usersStore.fetchUsers(),
  demandsStore.fetchDemands(),
  loanRequestStore.fetchLoanRequests(),
]).then(() => {
  app.use(router).mount("#app"); // mount it to the div with id = app in index.html
});
