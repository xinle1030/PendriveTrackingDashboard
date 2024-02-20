import { createRouter, createWebHistory } from "vue-router";
import Home from "./views/Home.vue";
import CreateRequest from "./views/CreateRequest.vue";
import EditRequest from "./views/EditRequest.vue";
import PendriveDetails from "./views/PendriveDetails.vue";
import { ActionEnum } from "./enums/ActionEnum";

import { usePendrives } from "./stores/pendrives";

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      component: Home,
    },
    {
      path: "/loanRequests",
      component: CreateRequest,
      beforeEnter: () => {
        const pendrivesStore = usePendrives();

        pendrivesStore.setPendriveAction(ActionEnum.Read);
      },
    },
    {
      path: "/loanRequests/:id/edit",
      component: EditRequest,
      beforeEnter: () => {
        const pendrivesStore = usePendrives();

        pendrivesStore.setPendriveAction(ActionEnum.Read);
      },
    },
    {
      path: "/pendrives",
      component: PendriveDetails,
      beforeEnter: () => {
        const pendrivesStore = usePendrives();

        pendrivesStore.setPendriveAction(ActionEnum.Update);
      },
    },
  ],
});
