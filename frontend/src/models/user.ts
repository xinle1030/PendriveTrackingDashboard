export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
}

export const emptyUser: User = {
  id: "",
  name: "",
  email: "",
  password: "",
};