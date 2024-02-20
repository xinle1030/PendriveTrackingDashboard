import { ref, shallowRef } from "vue";
import PendrivePopUp from "../components/modals/PendrivePopUp.vue";
import LoanRequestPopUp from "../components/modals/LoanRequestPopUp.vue";
import AlertPopUp from "../components/modals/AlertPopUp.vue";
import { LoanRequest } from "../models/loanRequest";
import { Pendrive } from "../models/pendrive";
import { ItemEnum } from "../enums/ItemEnum";

const show = ref(false);
const component = shallowRef(); // useShallowRef for optimization due to nested components to have shallow watch
const item = shallowRef();

export function useModal() {
  return {
    show, // whether the modal is shown or not
    component,
    item,
    showModal: (type: ItemEnum, passItem?: Pendrive | LoanRequest) => {
      show.value = true; // update show.value to true when showing modal
      switch (type) {
        case ItemEnum.Pendrive: {
          // Pass props to the component
          component.value = PendrivePopUp;
          break;
        }
        case ItemEnum.LoanRequest: {
          // Pass props to the component
          component.value = LoanRequestPopUp;
          break;
        }
        case ItemEnum.Alert: {
          // Pass props to the component
          component.value = AlertPopUp;
          break;
        }
      }

      if (passItem) {
        item.value = passItem;
      }
    },
    hideModal: () => {
      show.value = false;
    },
  };
}
