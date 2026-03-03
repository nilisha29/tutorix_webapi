export const API = {
  // ---------------- AUTH ----------------
  AUTH: {
    BASE: "/api/auth",
    REGISTER: "/api/auth/register",
    LOGIN: "/api/auth/login",
    FORGOT_PASSWORD: "/api/auth/forgot-password",
    RESET_PASSWORD: "/api/auth/reset-password",
    CHANGE_PASSWORD: "/api/auth/change-password",
    WHOAMI: "/api/auth/whoami",
    UPDATE_PROFILE: "/api/auth/update-profile",

    // User operations
    CREATE_USER: "/api/auth/user",
    UPDATE_BY_ID: (id: string) => `/api/auth/${id}`,

    // Tutor operations
    TUTOR: {
      BECOME: "/api/auth/become-tutor",
      LIST: "/api/auth/tutors",
    },

    // Admin operations
    ADMIN_USER: {
      CREATE: "/api/auth/user",
    },

    // Nested for clarity
    PASSWORD: {
      FORGOT: "/api/auth/forgot-password",
      RESET: "/api/auth/reset-password",
      CHANGE: "/api/auth/change-password",
    },
    PROFILE: {
      WHOAMI: "/api/auth/whoami",
      UPDATE: "/api/auth/update-profile",
    },
  },

  // ---------------- TUTORS ----------------
  TUTORS: {
    BASE: "/api/tutors",
    BY_ID: (id: string) => `/api/tutors/${id}`,
    REVIEWS: (id: string) => `/api/tutors/${id}/reviews`,
    ADD_REVIEW: (id: string) => `/api/tutors/${id}/reviews`,
    DETAIL: (id: string) => `/api/tutors/${id}`,
  },

  // ---------------- BOOKINGS ----------------
  BOOKINGS: {
    BASE: "/api/bookings",
    CREATE: "/api/bookings",
    BY_ID: (id: string) => `/api/bookings/${id}`,
    UPDATE: (id: string) => `/api/bookings/${id}`,
    DELETE: (id: string) => `/api/bookings/${id}`,
    MY_STUDENT: "/api/bookings/my-student",
    MY_TUTOR: "/api/bookings/my-tutor",

    // Admin bookings
    ADMIN: {
      BASE: "/api/bookings/admin",
      LIST: "/api/bookings/admin",
    },

    // Payments
    PAYMENTS: {
      INITIATE: "/api/bookings/payments/initiate",
      VERIFY: "/api/bookings/payments/verify",
    },
  },

  // ---------------- PAYMENTS ----------------
  PAYMENTS: {
    BASE: "/api/bookings/payments",
    INITIATE: "/api/bookings/payments/initiate",
    VERIFY: "/api/bookings/payments/verify",
  },

  // ---------------- MESSAGES ----------------
  MESSAGES: {
    BASE: "/api/messages",
    SEND: "/api/messages",
    TUTOR_INBOX: "/api/messages/tutor",
    BY_ID: (messageId: string) => `/api/messages/${messageId}`,
    DELETE: (messageId: string) => `/api/messages/${messageId}`,
  },

  // ---------------- SAVED TUTORS ----------------
  SAVED_TUTORS: {
    BASE: "/api/saved-tutors",
    SAVE: "/api/saved-tutors",
    MY: "/api/saved-tutors/my",
    BY_TUTOR_ID: (tutorId: string) => `/api/saved-tutors/${tutorId}`,
    REMOVE: (tutorId: string) => `/api/saved-tutors/${tutorId}`,
  },

  // ---------------- ADMIN ----------------
  ADMIN: {
    USER: {
      BASE: "/api/admin/users",
      CREATE: "/api/admin/users",
      LIST: "/api/admin/users",
      BY_ID: (id: string) => `/api/admin/users/${id}`,
      UPDATE: (id: string) => `/api/admin/users/${id}`,
      DELETE: (id: string) => `/api/admin/users/${id}`,
      REVIEWS: (id: string) => `/api/admin/users/${id}/reviews`,
      REVIEW_BY_REVIEWER: (id: string, reviewerId: string) =>
        `/api/admin/users/${id}/reviews/${reviewerId}`,
    },

    BOOKINGS: {
      BASE: "/api/bookings/admin",
      LIST: "/api/bookings/admin",
    },

    PAYMENTS: {
      BASE: "/api/bookings/admin",
      LIST: "/api/bookings/admin",
    },

    REVIEWS: {
      BASE: "/api/admin/users",
      LIST: "/api/admin/users",
      REVIEW_BY_REVIEWER: (id: string, reviewerId: string) =>
        `/api/admin/users/${id}/reviews/${reviewerId}`,
    },

    PROFILE: {
      VIEW: "/api/auth/whoami",
      UPDATE: "/api/auth/update-profile",
    },
  },

  // ---------------- PROFILE ----------------
  PROFILE: {
    USER_VIEW: "/api/auth/whoami",
    USER_EDIT: "/api/auth/update-profile",
    TUTOR_EDIT: "/api/auth/become-tutor",
  },
};