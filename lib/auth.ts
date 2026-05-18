import { mockUsers, MockUser } from "./mock-users";

const ACTIVE_SESSION_KEY = "activeCafeteria";

export const auth = {
    login: async (username: string, password: string): Promise<{ success: boolean; user?: Omit<MockUser, "password">; error?: string }> => {
        // Simulated delay for realism
        await new Promise((resolve) => setTimeout(resolve, 500));

        const user = mockUsers.find(
            (u) => u.username === username && u.password === password
        );

        if (user) {
            const userData = {
                id: user.id,
                username: user.username,
                name: user.name,
            };

            if (typeof window !== "undefined") {
                localStorage.setItem(ACTIVE_SESSION_KEY, JSON.stringify(userData));
            }
            return { success: true, user: userData };
        }

        return { success: false, error: "Usuario o contraseña incorrectos" };
    },

    logout: () => {
        if (typeof window !== "undefined") {
            localStorage.removeItem(ACTIVE_SESSION_KEY);
        }
    },

    getActiveUser: (): Omit<MockUser, "password"> | null => {
        if (typeof window === "undefined") return null;

        const stored = localStorage.getItem(ACTIVE_SESSION_KEY);
        if (!stored) return null;

        try {
            return JSON.parse(stored);
        } catch (error) {
            return null;
        }
    },
};
