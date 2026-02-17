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