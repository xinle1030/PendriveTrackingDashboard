import { defineStore } from "pinia";
import { RequestStatus } from "../models/requestStatus";
import axios from "axios";

interface RequestStatusesState {
  ids: number[]; // array of string type
  all: Map<number, RequestStatus>; // {id : RequestStatus}
  allItems: RequestStatus[];
  selectedRequestStatus: RequestStatus | null; // Allow null
}

// define store
export const useRequestStatuses = defineStore("requestStatuses", {
  state: (): RequestStatusesState => ({
    ids: [],
    all: new Map(),
    allItems: [],
    selectedRequestStatus: null,
  }),

  actions: {
    setSelectedRequestStatus(requestStatusId: number) {
      this.selectedRequestStatus = this.all.get(requestStatusId) ?? null;
    },

    async fetchRequestStatuses() {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/requestStatuses`,
          {
            headers: {
              Accept: "application/json",
            },
          }
        );

        console.log("Response:", response.data);

        // Handle success, e.g., return data or perform other actions
        const data = response.data as RequestStatus[]; // cast to array of RequestStatus

        let ids: number[] = [];
        let all = new Map<number, RequestStatus>();
        let allItems: RequestStatus[] = [];
        for (const requestStatus of data) {
          allItems.push(requestStatus);
          ids.push(requestStatus.id);
          all.set(requestStatus.id, requestStatus);
        }

        this.ids = ids;
        this.all = all;
        this.allItems = allItems;
      } catch (error) {
        console.error("Error fetching requestStatus:", error);
      }
    },

    async createRequestStatus(requestStatus: RequestStatus): Promise<any> {
      try {
        const response = await axios.post(
          "http://localhost:3000/api/requestStatuses",
          requestStatus,
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
        console.error("Error creating requestStatus:", error);
      }
    },
    updateRequestStatus(requestStatus: RequestStatus) {
      const body = JSON.stringify(requestStatus);
      return window.fetch("/api/requestStatuses", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body,
      });
    },
    async getRequestStatusById(requestStatusId: string) {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/requestStatuses/${requestStatusId}`,
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
        console.error("Error creating requestStatus:", error);
      }
    },
  },

  // to get the state: filteredRequestStatuses
  getters: {
    // filteredRequestStatuses: (state): RequestStatus[] => {
    //   return state.ids
    //     .map((id) => {
    //       const requestStatus = state.all.get(id); // to get requestStatus based on corresponding id
    //       // null check
    //       if (!requestStatus) {
    //         throw Error(
    //           `RequestStatus with id of ${id} was expected but not found.`
    //         );
    //       }
    //       return {
    //         ...requestStatus,
    //         startDate: DateTime.fromISO(requestStatus.startDate),
    //         endDate: DateTime.fromISO(requestStatus.endDate),
    //         returnDate: DateTime.fromISO(requestStatus.returnDate),
    //       };
    //     })
    //     .filter((requestStatus) => {
    //       // if (state.selectedPeriod === "Today") {
    //       //   // return today's requestStatus
    //       //   return requestStatus.created >= DateTime.now().minus({ day: 1 })
    //       // }
    //       // if (state.selectedPeriod  === "This Week") {
    //       //   // return this week's requestStatus
    //       //   return requestStatus.created >= DateTime.now().minus({ week: 1 })
    //       // }
    //       return requestStatus;
    //     });
    // },
  },
});
