// backend route paths

export const API = {
    AUTH:{
        REGISTER: "/api/auth/register", // backend ko route path
        LOGIN: "/api/auth/login",
        FORGOT_PASSWORD: "/api/auth/forgot-password",
        RESET_PASSWORD: "/api/auth/reset-password",

           WHOAMI: '/api/auth/whoami',
         UPDATEPROFILE: '/api/auth/update-profile',
            TUTORS: '/api/auth/tutors',
        
    },
    TUTORS: {
        GET_BY_ID: '/api/tutors',
    },
    BOOKINGS: {
        CREATE: '/api/bookings',
        INITIATE_PAYMENT: '/api/bookings/payments/initiate',
        VERIFY_PAYMENT: '/api/bookings/payments/verify',
        MY_STUDENT: '/api/bookings/my-student',
        MY_TUTOR: '/api/bookings/my-tutor',
        ADMIN_ALL: '/api/bookings/admin',
    },
     ADMIN:{
        USER:{
            CREATE: '/api/admin/users/',
            GET_ALL: '/api/admin/users/',
            GET_BY_ID: '/api/admin/users/',
            UPDATE: '/api/admin/users/',
            DELETE: '/api/admin/users/',
        }
    }
}