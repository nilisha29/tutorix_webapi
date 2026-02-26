// backend route paths

export const API = {
    AUTH: {
        REGISTER: "/api/auth/register",
        LOGIN: "/api/auth/login",
        FORGOT_PASSWORD: "/api/auth/forgot-password",
        RESET_PASSWORD: "/api/auth/reset-password",
        WHOAMI: "/api/auth/whoami",
        UPDATE_PROFILE: "/api/auth/update-profile",
        BECOME_TUTOR: "/api/auth/become-tutor",
        CREATE_USER_BY_ADMIN: "/api/auth/user",
        UPDATE_BY_ID: "/api/auth/:id",
        TUTORS: "/api/auth/tutors",

        // backward compatibility
        UPDATEPROFILE: "/api/auth/update-profile",
    },

    TUTORS: {
        BASE: "/api/tutors",
        GET_ALL: "/api/auth/tutors",
        LIST: "/api/auth/tutors",
        GET_BY_ID: "/api/tutors",
        GET_BY_ID_PATH: "/api/tutors/:id",
        DETAIL: "/api/tutors/:id",
        CREATE_REVIEW: "/api/tutors/:id/reviews",
        REVIEWS: "/api/tutors/:id/reviews",
    },

    BOOKINGS: {
        BASE: "/api/bookings",
        CREATE: "/api/bookings",
        LIST: "/api/bookings",
        GET_BY_ID: "/api/bookings/:id",
        UPDATE: "/api/bookings/:id",
        DELETE: "/api/bookings/:id",
        INITIATE_PAYMENT: "/api/bookings/payments/initiate",
        VERIFY_PAYMENT: "/api/bookings/payments/verify",
        PAYMENTS_BASE: "/api/bookings/payments",
        MY_STUDENT: "/api/bookings/my-student",
        MY_TUTOR: "/api/bookings/my-tutor",
        ADMIN_ALL: "/api/bookings/admin",
        ADMIN_LIST: "/api/bookings/admin",
    },

    MESSAGES: {
        BASE: "/api/messages",
        SEND: "/api/messages",
        CREATE: "/api/messages",
        LIST: "/api/messages",
        TUTOR_INBOX: "/api/messages/tutor",
        DELETE: "/api/messages",
        DELETE_BY_ID: "/api/messages/:messageId",
    },

    SAVED_TUTORS: {
        BASE: "/api/saved-tutors",
        SAVE: "/api/saved-tutors",
        CREATE: "/api/saved-tutors",
        LIST: "/api/saved-tutors/my",
        MY_LIST: "/api/saved-tutors/my",
        REMOVE: "/api/saved-tutors",
        DELETE: "/api/saved-tutors/:tutorId",
    },

    ADMIN: {
        USER: {
            BASE: "/api/admin/users",
            CREATE: "/api/admin/users",
            GET_ALL: "/api/admin/users",
            GET_BY_ID: "/api/admin/users/",
            GET_BY_ID_PATH: "/api/admin/users/:id",
            UPDATE: "/api/admin/users/",
            UPDATE_PATH: "/api/admin/users/:id",
            DELETE: "/api/admin/users/",
            DELETE_PATH: "/api/admin/users/:id",
            UPDATE_REVIEW: "/api/admin/users/:id/reviews/:reviewerId",
            DELETE_REVIEW: "/api/admin/users/:id/reviews/:reviewerId",
        },

        TUTOR: {
            BASE: "/api/admin/users",
            LIST: "/api/admin/users",
            CREATE: "/api/admin/users",
            GET_BY_ID: "/api/admin/users/:id",
            UPDATE: "/api/admin/users/:id",
            DELETE: "/api/admin/users/:id",
            UPDATE_REVIEW: "/api/admin/users/:id/reviews/:reviewerId",
            DELETE_REVIEW: "/api/admin/users/:id/reviews/:reviewerId",
        },

        BOOKINGS: {
            BASE: "/api/bookings/admin",
            LIST: "/api/bookings/admin",
            GET_BY_ID: "/api/bookings/:id",
            UPDATE: "/api/bookings/:id",
            DELETE: "/api/bookings/:id",
        },

        PAYMENTS: {
            BASE: "/api/bookings/admin",
            LIST: "/api/bookings/admin",
            DETAIL: "/api/bookings/:id",
            UPDATE_STATUS: "/api/bookings/:id",
        },

        REVIEWS: {
            BASE: "/api/admin/users/:id/reviews",
            LIST: "/api/admin/users",
            UPDATE: "/api/admin/users/:id/reviews/:reviewerId",
            DELETE: "/api/admin/users/:id/reviews/:reviewerId",
        },

        PROFILE: {
            VIEW: "/api/auth/whoami",
            UPDATE: "/api/auth/update-profile",
        },
    },

    PROFILE: {
        USER_VIEW: "/api/auth/whoami",
        USER_EDIT: "/api/auth/update-profile",
        TUTOR_EDIT: "/api/auth/become-tutor",
    },
};