const ACCESS_TOKEN_KEY = "access_token";

export const tokenStorage = {
  getAccessToken: () => {
    if (typeof window === "undefined") return null;

    return localStorage.getItem(ACCESS_TOKEN_KEY);
  },

  setAccessToken: (token: string) => {
    if (typeof window === "undefined") return;

    localStorage.setItem(ACCESS_TOKEN_KEY, token);

    document.cookie = `${ACCESS_TOKEN_KEY}=${token}; path=/; max-age=604800; samesite=lax${
      process.env.NODE_ENV === "production" ? "; secure" : ""
    }`;
  },

  clear: () => {
    if (typeof window === "undefined") return;

    localStorage.removeItem(ACCESS_TOKEN_KEY);
   
    document.cookie = `${ACCESS_TOKEN_KEY}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
  },
};