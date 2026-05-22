export interface MockUser {
  id: string;
  username: string;
  password: string; // Plain text only for this MVP mockup
  name: string;
}

export const mockUsers: MockUser[] = [
  {
    id: "user_demo",
    username: "demo",
    password: "demo1234",
    name: "Café Demo",
  },
];
