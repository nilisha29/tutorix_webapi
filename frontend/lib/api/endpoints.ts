// backend route paths

export const API = {
    AUTH:{
        REGISTER: "/api/auth/register", // backend ko route path
        LOGIN: "/api/auth/login",

           WHOAMI: '/api/auth/whoami',
         UPDATEPROFILE: '/api/auth/update-profile',
            TUTORS: '/api/auth/tutors',
        
    },
    TUTORS: {
        GET_BY_ID: '/api/tutors',
    },
    BOOKINGS: {
        CREATE: '/api/bookings',
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