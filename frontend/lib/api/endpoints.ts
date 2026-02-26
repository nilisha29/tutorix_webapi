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
        GET_BY_ID: "/api/tutors",
        GET_BY_ID_PATH: "/api/tutors/:id",
        CREATE_REVIEW: "/api/tutors/:id/reviews",
    },

    BOOKINGS: {
        BASE: "/api/bookings",
        CREATE: "/api/bookings",
        INITIATE_PAYMENT: "/api/bookings/payments/initiate",
        VERIFY_PAYMENT: "/api/bookings/payments/verify",
        MY_STUDENT: "/api/bookings/my-student",
        MY_TUTOR: "/api/bookings/my-tutor",
        ADMIN_ALL: "/api/bookings/admin",
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
            LIST: "/api/admin/users",
            GET_BY_ID: "/api/admin/users/:id",
            UPDATE: "/api/admin/users/:id",
            DELETE: "/api/admin/users/:id",
            UPDATE_REVIEW: "/api/admin/users/:id/reviews/:reviewerId",
            DELETE_REVIEW: "/api/admin/users/:id/reviews/:reviewerId",
        },
    },

    PROFILE: {
        USER_VIEW: "/api/auth/whoami",
        USER_EDIT: "/api/auth/update-profile",
        TUTOR_EDIT: "/api/auth/become-tutor",
    },
};