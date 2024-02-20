import { defineStore } from "pinia";
import { LoanType } from "../models/loanType";
import axios from "axios";

interface LoanTypesState {
  ids: number[]; // array of string type
  all: Map<number, LoanType>; // {id : LoanType}
  allItems: LoanType[];
  selectedLoanType: LoanType | null; // Allow null
}

// define store
export const useLoanTypes = defineStore("loanTypes", {
  state: (): LoanTypesState => ({
    ids: [],
    all: new Map(),
    allItems: [],
    selectedLoanType: null,
  }),

  actions: {
    setSelectedLoanType(loanType: LoanType | null) {
      this.selectedLoanType = loanType;
    },

    async fetchLoanTypes() {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/loanTypes`,
          {
            headers: {
              Accept: "application/json",
            },
          }
        );

        console.log("Response:", response.data);

        // Handle success, e.g., return data or perform other actions
        const data = response.data as LoanType[]; // cast to array of LoanType

        let ids: number[] = [];
        let all = new Map<number, LoanType>();
        let allItems: LoanType[] = [];
        for (const loanType of data) {
          allItems.push(loanType);
          ids.push(loanType.id);
          all.set(loanType.id, loanType);
        }

        this.ids = ids;
        this.all = all;
        this.allItems = allItems;
      } catch (error) {
        console.error("Error fetching loanType:", error);
      }
    },

    async createLoanType(loanType: LoanType): Promise<any> {
      try {
        const response = await axios.post(
          "http://localhost:3000/api/loanTypes",
          loanType,
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
        console.error("Error creating loanType:", error);
      }
    },
    updateLoanType(loanType: LoanType) {
      const body = JSON.stringify(loanType);
      return window.fetch("/api/loanTypes", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body,
      });
    },
    async getLoanTypeById(loanTypeId: string) {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/loanTypes/${loanTypeId}`,
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
        console.error("Error creating loanType:", error);
      }
    },
  },

  // to get the state: filteredLoanTypes
  getters: {
    // filteredLoanTypes: (state): LoanType[] => {
    //   return state.ids
    //     .map((id) => {
    //       const loanType = state.all.get(id); // to get loanType based on corresponding id
    //       // null check
    //       if (!loanType) {
    //         throw Error(
    //           `LoanType with id of ${id} was expected but not found.`
    //         );
    //       }
    //       return {
    //         ...loanType,
    //         startDate: DateTime.fromISO(loanType.startDate),
    //         endDate: DateTime.fromISO(loanType.endDate),
    //         returnDate: DateTime.fromISO(loanType.returnDate),
    //       };
    //     })
    //     .filter((loanType) => {
    //       // if (state.selectedPeriod === "Today") {
    //       //   // return today's loanType
    //       //   return loanType.created >= DateTime.now().minus({ day: 1 })
    //       // }
    //       // if (state.selectedPeriod  === "This Week") {
    //       //   // return this week's loanType
    //       //   return loanType.created >= DateTime.now().minus({ week: 1 })
    //       // }
    //       return loanType;
    //     });
    // },
  },
});
