import { defineStore } from "pinia";
import { Pendrive, PendriveUpdate } from "../models/pendrive";
import axios from "axios";
import { ActionEnum } from "../enums/ActionEnum";

interface PendrivesState {
  ids: number[]; // array of string type
  all: Map<number, Pendrive>; // {id : Pendrive}
  allItems: Pendrive[];
  selectedPendrives: Pendrive[];
  pendriveAction: ActionEnum;
}

// define store
export const usePendrives = defineStore("pendrives", {
  state: (): PendrivesState => ({
    ids: [],
    all: new Map(),
    allItems: [],
    selectedPendrives: [],
    pendriveAction: ActionEnum.Update,
  }),

  actions: {
    setPendriveAction(pendriveAction: ActionEnum) {
      this.pendriveAction = pendriveAction;
    },

    setSelectedPendrives(pendrives: Pendrive[]) {
      this.selectedPendrives = pendrives;
    },

    async fetchPendrives() {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/pendrives`,
          {
            headers: {
              Accept: "application/json",
            },
          }
        );

        console.log("Response:", response.data);

        // Handle success, e.g., return data or perform other actions
        const data = response.data as Pendrive[]; // cast to array of Pendrive

        let ids: number[] = [];
        let all = new Map<number, Pendrive>();
        let allItems: Pendrive[] = [];
        for (const pendrive of data) {
          allItems.push(pendrive);
          ids.push(pendrive.id);
          all.set(pendrive.id, pendrive);
        }

        this.ids = ids;
        this.all = all;
        this.allItems = allItems;
      } catch (error) {
        console.error("Error fetching pendrive:", error);
      }
    },

    async createPendrive(pendrive: Pendrive): Promise<any> {
      try {
        const response = await axios.post(
          "http://localhost:3000/api/pendrives",
          pendrive,
          {
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
          }
        );

        console.log("Response:", response.data);

        // Handle success, e.g., return data or perform other actions
        return response.data;
      } catch (error) {
        console.error("Error creating pendrive:", error);
      }
    },
    updatePendrive(pendrive: PendriveUpdate) {
      const body = JSON.stringify(pendrive);
      try {
        return window.fetch(
          `http://localhost:3000/api/pendrives/${pendrive.id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body,
          }
        );
      } catch (err) {
        console.log(err);
      }
    },
    deletePendrive(pendriveId: number) {
      return window.fetch(`http://localhost:3000/api/pendrives/${pendriveId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
    },
    async getPendriveById(pendriveId: number) {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/pendrives/${pendriveId}`,
          {
            headers: {
              Accept: "application/json",
            },
          }
        );

        console.log("Response:", response.data);

        // Handle success, e.g., return data or perform other actions
        return response.data;
      } catch (error) {
        console.error("Error creating pendrive:", error);
      }
    },
  },

  getters: {
    availablePendrives: (state): Pendrive[] => {
      return state.allItems.filter((pendrive) => {
        if (pendrive.pendriveStatusId == 1) {
          return pendrive;
        }
      });
    },
  },
});
