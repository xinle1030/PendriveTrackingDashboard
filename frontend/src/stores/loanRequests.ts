import { defineStore } from "pinia";
import {
  LoanRequest,
  LoanRequestCreation,
  LoanRequestUpdate,
} from "../models/loanRequest";
import axios from "axios";

interface LoanRequestsState {
  ids: string[]; // array of string type
  all: Map<string, LoanRequest>; // {id : LoanRequest}
  allItems: LoanRequest[];
  selectedLoanRequest: LoanRequest | null; // Allow null
}

// define store
export const useLoanRequests = defineStore("loanRequests", {
  state: (): LoanRequestsState => ({
    ids: [],
    all: new Map(),
    allItems: [],
    selectedLoanRequest: null,
  }),

  actions: {
    // setSelectedPeriod (period: Period) {
    //   this.selectedPeriod = period
    // },

    async fetchLoanRequests() {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/loanRequests`,
          {
            headers: {
              Accept: "application/json",
            },
          }
        );

        console.log("Response:", response.data);

        // Handle success, e.g., return data or perform other actions
        const data = response.data as LoanRequest[]; // cast to array of Loan Request
        data.forEach((loanRequest) => {
          loanRequest.pendrives.sort((a, b) => a.id - b.id);
        });

        let ids: string[] = [];
        let all = new Map<string, LoanRequest>();
        let allItems: LoanRequest[] = [];
        for (const loanRequest of data) {
          allItems.push(loanRequest);
          ids.push(loanRequest.id);

          // Check if the key exists in the map
          if (!all.has(loanRequest.id)) {
            all.set(loanRequest.id, loanRequest);
          }
        }

        this.ids = ids;
        this.all = all;
        this.allItems = allItems;
      } catch (error) {
        console.error("Error fetching loanRequest:", error);
      }
    },

    async createLoanRequest(loanRequest: LoanRequestCreation): Promise<any> {
      try {
        const response = await axios.post(
          "http://localhost:3000/api/loanRequests",
          loanRequest,
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
        console.error("Error creating loan request:", error);
      }
    },
    updateLoanRequest(loanRequest: LoanRequestUpdate) {
      const body = JSON.stringify(loanRequest);
      try {
        return window.fetch(
          `http://localhost:3000/api/loanRequests/${loanRequest.id}`,
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
    deleteLoanRequest(loanRequestId: string) {
      return window.fetch(
        `http://localhost:3000/api/loanRequests/${loanRequestId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    },
  },

  // to get the state: accLoanRequests
  getters: {},
});
