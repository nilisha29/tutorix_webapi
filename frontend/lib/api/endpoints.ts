// export const API = {
//   // ---------------- AUTH ----------------
//   AUTH: {
//     BASE: "/api/auth",
//     REGISTER: "/api/auth/register",
//     LOGIN: "/api/auth/login",
//     FORGOT_PASSWORD: "/api/auth/forgot-password",
//     RESET_PASSWORD: "/api/auth/reset-password",
//     CHANGE_PASSWORD: "/api/auth/change-password",
//     WHOAMI: "/api/auth/whoami",
//     UPDATE_PROFILE: "/api/auth/update-profile",

//     // User operations
//     CREATE_USER: "/api/auth/user",
//     UPDATE_BY_ID: (id: string) => `/api/auth/${id}`,

//     // Tutor operations
//     TUTOR: {
//       BECOME: "/api/auth/become-tutor",
//       LIST: "/api/auth/tutors",
//     },

//     // Nested aliases (used by some existing files)
//     PASSWORD: {
//       FORGOT: "/api/auth/forgot-password",
//       RESET: "/api/auth/reset-password",
//       CHANGE: "/api/auth/change-password",
//     },
//     PROFILE: {
//       WHOAMI: "/api/auth/whoami",
//       UPDATE: "/api/auth/update-profile",
//     },
//   },

//   // ---------------- TUTORS ----------------
//   TUTORS: {
//     BASE: "/api/tutors",
//     BY_ID: (id: string) => `/api/tutors/${id}`,
//     REVIEWS: (id: string) => `/api/tutors/${id}/reviews`,
//     ADD_REVIEW: (id: string) => `/api/tutors/${id}/reviews`,
//     DETAIL: (id: string) => `/api/tutors/${id}`,
//   },

//   // ---------------- BOOKINGS ----------------
//   BOOKINGS: {
//     BASE: "/api/bookings",
//     CREATE: "/api/bookings",
//     MY_STUDENT: "/api/bookings/my-student",
//     MY_TUTOR: "/api/bookings/my-tutor",

//     // Payments
//     PAYMENTS: {
//       INITIATE: "/api/bookings/payments/initiate",
//       VERIFY: "/api/bookings/payments/verify",
//     },
//   },

//   // ---------------- PAYMENTS ----------------
//   PAYMENTS: {
//     BASE: "/api/bookings/payments",
//     INITIATE: "/api/bookings/payments/initiate",
//     VERIFY: "/api/bookings/payments/verify",
//   },

//   // ---------------- MESSAGES ----------------
//   MESSAGES: {
//     BASE: "/api/messages",
//     SEND: "/api/messages",
//     REPLY: "/api/messages/reply",
//     TUTOR_INBOX: "/api/messages/tutor",
//     STUDENT_INBOX: "/api/messages/student",
//     DELETE_CONVERSATION: (partnerId: string) => `/api/messages/conversation/${partnerId}`,
//     BY_ID: (messageId: string) => `/api/messages/${messageId}`,
//     DELETE: (messageId: string) => `/api/messages/${messageId}`,
//   },

//   // ---------------- SAVED TUTORS ----------------
//   SAVED_TUTORS: {
//     BASE: "/api/saved-tutors",
//     SAVE: "/api/saved-tutors",
//     MY: "/api/saved-tutors/my",
//     BY_TUTOR_ID: (tutorId: string) => `/api/saved-tutors/${tutorId}`,
//     REMOVE: (tutorId: string) => `/api/saved-tutors/${tutorId}`,
//   },

//   // ---------------- ADMIN ----------------
//   ADMIN: {
//     USER: {
//       BASE: "/api/admin/users",
//       CREATE: "/api/admin/users",
//       LIST: "/api/admin/users",
//       BY_ID: (id: string) => `/api/admin/users/${id}`,
//       UPDATE: (id: string) => `/api/admin/users/${id}`,
//       DELETE: (id: string) => `/api/admin/users/${id}`,
//     },

//     BOOKINGS: {
//       BASE: "/api/admin/bookings",
//       LIST: "/api/admin/bookings",
//       BY_ID: (id: string) => `/api/admin/bookings/${id}`,
//       UPDATE: (id: string) => `/api/admin/bookings/${id}`,
//       DELETE: (id: string) => `/api/admin/bookings/${id}`,
//     },

//     PAYMENTS: {
//       BASE: "/api/admin/payments",
//       LIST: "/api/admin/payments",
//       BY_ID: (id: string) => `/api/admin/payments/${id}`,
//       UPDATE: (id: string) => `/api/admin/payments/${id}`,
//       DELETE: (id: string) => `/api/admin/payments/${id}`,
//     },

//     REVIEWS: {
//       BASE: "/api/admin/reviews",
//       LIST: "/api/admin/reviews",
//       BY_ID: (id: string) => `/api/admin/reviews/${id}`,
//       REVIEW_BY_REVIEWER: (id: string, reviewerId: string) =>
//         `/api/admin/reviews/${id}/reviews/${reviewerId}`,
//     },

//     TUTORS: {
//       BASE: "/api/admin/tutors",
//       LIST: "/api/admin/tutors",
//       BY_ID: (id: string) => `/api/admin/tutors/${id}`,
//       UPDATE: (id: string) => `/api/admin/tutors/${id}`,
//       DELETE: (id: string) => `/api/admin/tutors/${id}`,
//     },

//     PROFILE: {
//       VIEW: "/api/auth/whoami", // handled by shared auth profile endpoints
//       UPDATE: "/api/auth/update-profile", // handled by shared auth profile endpoints
//     },
//   },

//   // ---------------- PROFILE ----------------
//   PROFILE: {
//     USER_VIEW: "/api/auth/whoami",
//     USER_EDIT: "/api/auth/update-profile",
//     TUTOR_EDIT: "/api/auth/become-tutor",
//   },
// };



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

    // User operations (Admin/Management)
    CREATE_USER: "/api/auth/user",
    UPDATE_BY_ID: (id: string) => `/api/auth/${id}`,

    // Tutor-specific operations
    TUTOR: {
      BECOME: "/api/auth/become-tutor",
      LIST: "/api/auth/tutors",
    },
  },

  // ---------------- TUTORS ----------------
  TUTORS: {
    BASE: "/api/tutors",
    BY_ID: (id: string) => `/api/tutors/${id}`,
    DETAIL: (id: string) => `/api/tutors/${id}`,
    REVIEWS: (id: string) => `/api/tutors/${id}/reviews`,
    ADD_REVIEW: (id: string) => `/api/tutors/${id}/reviews`,
  },

  // ---------------- BOOKINGS ----------------
  BOOKINGS: {
    BASE: "/api/bookings",
    CREATE: "/api/bookings",
    MY_STUDENT: "/api/bookings/my-student",
    MY_TUTOR: "/api/bookings/my-tutor",

    // Payments
    PAYMENTS: {
      INITIATE: "/api/bookings/payments/initiate",
      VERIFY: "/api/bookings/payments/verify",
    },
  },

  // ---------------- MESSAGES ----------------
  MESSAGES: {
    BASE: "/api/messages",
    SEND: "/api/messages",
    REPLY: "/api/messages/reply",
    TUTOR_INBOX: "/api/messages/tutor",
    STUDENT_INBOX: "/api/messages/student",
    DELETE_CONVERSATION: (partnerId: string) =>
      `/api/messages/conversation/${partnerId}`,
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
    PROFILE: {
      VIEW: "/api/auth/whoami",
      UPDATE: "/api/auth/update-profile",
    },

    USER: {
      BASE: "/api/admin/users",
      CREATE: "/api/admin/users",
      LIST: "/api/admin/users",
      BY_ID: (id: string) => `/api/admin/users/${id}`,
      UPDATE: (id: string) => `/api/admin/users/${id}`,
      DELETE: (id: string) => `/api/admin/users/${id}`,
    },

    TUTORS: {
      BASE: "/api/admin/tutors",
      LIST: "/api/admin/tutors",
      BY_ID: (id: string) => `/api/admin/tutors/${id}`,
      UPDATE: (id: string) => `/api/admin/tutors/${id}`,
      DELETE: (id: string) => `/api/admin/tutors/${id}`,
    },

    BOOKINGS: {
      BASE: "/api/admin/bookings",
      LIST: "/api/admin/bookings",
      BY_ID: (id: string) => `/api/admin/bookings/${id}`,
      UPDATE: (id: string) => `/api/admin/bookings/${id}`,
      DELETE: (id: string) => `/api/admin/bookings/${id}`,
    },

    PAYMENTS: {
      BASE: "/api/admin/payments",
      LIST: "/api/admin/payments",
      BY_ID: (id: string) => `/api/admin/payments/${id}`,
      UPDATE: (id: string) => `/api/admin/payments/${id}`,
      DELETE: (id: string) => `/api/admin/payments/${id}`,
    },

    REVIEWS: {
      BASE: "/api/admin/reviews",
      LIST: "/api/admin/reviews",
      BY_ID: (id: string) => `/api/admin/reviews/${id}`,
      REVIEW_BY_REVIEWER: (id: string, reviewerId: string) =>
        `/api/admin/reviews/${id}/reviews/${reviewerId}`,
    },
  },

  // ---------------- PROFILE ----------------
  PROFILE: {
    USER_VIEW: "/api/auth/whoami",
    USER_EDIT: "/api/auth/update-profile",
    TUTOR_EDIT: "/api/auth/become-tutor",
  },
};