import { defineStore } from "pinia";
import { Demand } from "../models/demand";
import axios from "axios";

interface DemandsState {
  ids: string[]; // array of string type
  all: Map<string, Demand>; // {id : Pendrive}
  allItems: Demand[];
  selectedDemand: Demand | null; // Allow null
}

// define store
export const useDemands = defineStore("demands", {
  state: (): DemandsState => ({
    ids: [],
    all: new Map(),
    allItems: [],
    selectedDemand: null,
  }),

  actions: {
    setSelectedDemand(demand: Demand | null) {
      this.selectedDemand = demand;
    },

    async fetchDemands() {
      try {
        const response = await axios.get(`http://localhost:3000/api/demands`, {
          headers: {
            Accept: "application/json",
          },
        });

        console.log("Response:", response.data);

        // Handle success, e.g., return data or perform other actions
        const data = response.data as Demand[]; // cast to array of Loan Request

        let ids: string[] = [];
        let all = new Map<string, Demand>();
        let allItems: Demand[] = [];
        for (const demand of data) {
          allItems.push(demand);
          ids.push(demand.id);
          all.set(demand.id, demand);
        }

        this.ids = ids;
        this.all = all;
        this.allItems = allItems;
      } catch (error) {
        console.error("Error fetching demand:", error);
      }
    },

    async createDemand(demand: Demand): Promise<any> {
      try {
        const response = await axios.post(
          "http://localhost:3000/api/demands",
          demand,
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
        console.error("Error creating demand:", error);
      }
    },
    updateDemand(demand: Demand) {
      const body = JSON.stringify(demand);
      return window.fetch("/api/demands", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body,
      });
    },
    async getDemandById(demandId: string) {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/demands/${demandId}`,
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
        console.error("Error creating demand:", error);
      }
    },
  },

  // to get the state: filteredDemands
  getters: {
    // filteredDemands: (state): Demand[] => {
    //   return state.ids
    //     .map((id) => {
    //       const demand = state.all.get(id); // to get demand based on corresponding id
    //       // null check
    //       if (!demand) {
    //         throw Error(
    //           `Demand with id of ${id} was expected but not found.`
    //         );
    //       }
    //       return {
    //         ...demand,
    //         startDate: DateTime.fromISO(demand.startDate),
    //         endDate: DateTime.fromISO(demand.endDate),
    //         returnDate: DateTime.fromISO(demand.returnDate),
    //       };
    //     })
    //     .filter((demand) => {
    //       // if (state.selectedPeriod === "Today") {
    //       //   // return today's demand
    //       //   return demand.created >= DateTime.now().minus({ day: 1 })
    //       // }
    //       // if (state.selectedPeriod  === "This Week") {
    //       //   // return this week's demand
    //       //   return demand.created >= DateTime.now().minus({ week: 1 })
    //       // }
    //       return demand;
    //     });
    // },
  },
});
