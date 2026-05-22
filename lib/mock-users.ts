export interface MockUser {
  id: string;
  username: string;
  password: string; // Plain text only for this MVP mockup
  name: string;
}

export const mockUsers: MockUser[] = [
  {
    id: "user_vibratos",
    username: "vibratos",
    password: "demo123",
    name: "Vibratos Café",
  },
  {
    id: "user_cafe2",
    username: "cafe2",
    password: "demo123",
    name: "Cafetería 2",
  },
  {
    id: "user_cafe3",
    username: "cafe3",
    password: "demo123",
    name: "Cafetería 3",
  },
  {
    id: "user_demo",
    username: "demo",
    password: "demo1234",
    name: "Café Demo",
  },
];
