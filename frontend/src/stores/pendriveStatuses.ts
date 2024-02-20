import { defineStore } from "pinia";
import { PendriveStatus } from "../models/pendriveStatus";
import axios from "axios";

interface PendriveStatusesState {
  ids: number[]; // array of string type
  all: Map<number, PendriveStatus>; // {id : PendriveStatus}
  allItems: PendriveStatus[];
  selectedPendriveStatus: PendriveStatus | null; // Allow null
}

// define store
export const usePendriveStatuses = defineStore("pendriveStatuses", {
  state: (): PendriveStatusesState => ({
    ids: [],
    all: new Map(),
    allItems: [],
    selectedPendriveStatus: null,
  }),

  actions: {
    setSelectedPendriveStatus(pendriveStatus: number) {
      this.selectedPendriveStatus = this.all.get(pendriveStatus) ?? null;
    },

    async fetchPendriveStatuses() {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/pendriveStatuses`,
          {
            headers: {
              Accept: "application/json",
            },
          }
        );

        console.log("Response:", response.data);

        // Handle success, e.g., return data or perform other actions
        const data = response.data as PendriveStatus[]; // cast to array of PendriveStatus

        let ids: number[] = [];
        let all = new Map<number, PendriveStatus>();
        let allItems: PendriveStatus[] = [];
        for (const pendriveStatus of data) {
          allItems.push(pendriveStatus);
          ids.push(pendriveStatus.id);
          all.set(pendriveStatus.id, pendriveStatus);
        }

        this.ids = ids;
        this.all = all;
        this.allItems = allItems;
      } catch (error) {
        console.error("Error fetching pendriveStatus:", error);
      }
    },

    async createPendriveStatus(pendriveStatus: PendriveStatus): Promise<any> {
      try {
        const response = await axios.post(
          "http://localhost:3000/api/pendriveStatuses",
          pendriveStatus,
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
        console.error("Error creating pendriveStatus:", error);
      }
    },
    updatePendriveStatus(pendriveStatus: PendriveStatus) {
      const body = JSON.stringify(pendriveStatus);
      return window.fetch("/api/pendriveStatuses", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body,
      });
    },
    async getPendriveStatusById(pendriveStatusId: string) {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/pendriveStatuses/${pendriveStatusId}`,
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
        console.error("Error creating pendriveStatus:", error);
      }
    },
  },

  // to get the state: filteredPendriveStatuses
  getters: {
    // filteredPendriveStatuses: (state): PendriveStatus[] => {
    //   return state.ids
    //     .map((id) => {
    //       const pendriveStatus = state.all.get(id); // to get pendriveStatus based on corresponding id
    //       // null check
    //       if (!pendriveStatus) {
    //         throw Error(
    //           `PendriveStatus with id of ${id} was expected but not found.`
    //         );
    //       }
    //       return {
    //         ...pendriveStatus,
    //         startDate: DateTime.fromISO(pendriveStatus.startDate),
    //         endDate: DateTime.fromISO(pendriveStatus.endDate),
    //         returnDate: DateTime.fromISO(pendriveStatus.returnDate),
    //       };
    //     })
    //     .filter((pendriveStatus) => {
    //       // if (state.selectedPeriod === "Today") {
    //       //   // return today's pendriveStatus
    //       //   return pendriveStatus.created >= DateTime.now().minus({ day: 1 })
    //       // }
    //       // if (state.selectedPeriod  === "This Week") {
    //       //   // return this week's pendriveStatus
    //       //   return pendriveStatus.created >= DateTime.now().minus({ week: 1 })
    //       // }
    //       return pendriveStatus;
    //     });
    // },
  },
});
