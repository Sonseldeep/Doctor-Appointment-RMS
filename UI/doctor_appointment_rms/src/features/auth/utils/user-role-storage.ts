const USER_ROLE_KEY = "user_role";

export const userRoleStorage = {
  getUserRole: () => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(USER_ROLE_KEY);
  },

  setUserRole: (role: string) => {
    localStorage.setItem(USER_ROLE_KEY, role);
  },

  clear: () => {
    localStorage.removeItem(USER_ROLE_KEY);
  },
};