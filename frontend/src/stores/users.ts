import { defineStore } from "pinia";
import { User } from "../models/user";
import axios from "axios";

interface UsersState {
  ids: string[]; // array of string type
  all: Map<string, User>; // {id : Pendrive}
  allItems: User[];
  selectedUser: User | null; // Allow null
}

// define store
export const useUsers = defineStore("users", {
  state: (): UsersState => ({
    ids: [],
    all: new Map(),
    allItems: [],
    selectedUser: null,
  }),

  actions: {
    setSelectedUser(user: User | null) {
      this.selectedUser = user;
    },

    async fetchUsers() {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/users`,
          {
            headers: {
              Accept: "application/json",
            },
          }
        );

        console.log("Response:", response.data);

        // Handle success, e.g., return data or perform other actions
        const data = response.data as User[]; // cast to array of Pendrive

        let ids: string[] = [];
        let all = new Map<string, User>();
        let allItems: User[] = [];
        for (const user of data) {
          allItems.push(user);
          ids.push(user.id);
          all.set(user.id, user);
        }

        this.ids = ids;
        this.all = all;
        this.allItems = allItems;
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    },

    async createUser(user: User): Promise<any> {
      try {
        const response = await axios.post(
          "http://localhost:3000/api/users",
          user,
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
        console.error("Error creating user:", error);
      }
    },
    updateUser(user: User) {
      const body = JSON.stringify(user);
      return window.fetch("/api/users", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body,
      });
    },
    async getUserByEmail(email: string) {
      try {
        const response = await axios.get("http://localhost:3000/api/users", {
          params: { email: email },
          headers: {
            Accept: "application/json",
          },
        });

        console.log("Response:", response.data);

        // Handle success, e.g., return data or perform other actions
        return response.data[0];
      } catch (error) {
        console.error("Error creating user:", error);
      }
    },
  },

  // to get the state: filteredUsers
  getters: {
    // filteredUsers: (state): User[] => {
    //   return state.ids
    //     .map((id) => {
    //       const user = state.all.get(id); // to get user based on corresponding id
    //       // null check
    //       if (!user) {
    //         throw Error(
    //           `User with id of ${id} was expected but not found.`
    //         );
    //       }
    //       return {
    //         ...user,
    //         startDate: DateTime.fromISO(user.startDate),
    //         endDate: DateTime.fromISO(user.endDate),
    //         returnDate: DateTime.fromISO(user.returnDate),
    //       };
    //     })
    //     .filter((user) => {
    //       // if (state.selectedPeriod === "Today") {
    //       //   // return today's user
    //       //   return user.created >= DateTime.now().minus({ day: 1 })
    //       // }
    //       // if (state.selectedPeriod  === "This Week") {
    //       //   // return this week's user
    //       //   return user.created >= DateTime.now().minus({ week: 1 })
    //       // }
    //       return user;
    //     });
    // },
  },
});
