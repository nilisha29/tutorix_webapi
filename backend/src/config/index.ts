import dotenv from "dotenv";

dotenv.config();
/**
 * Application configuration values
 * Loaded from environment variables with safe defaults
 */

export const PORT: number =
  process.env.PORT ? parseInt(process.env.PORT) : 5050;

export const MONGODB_URI: string =
  process.env.MONGODB_URI || "mongodb://localhost:27017/tutorix_hometutor";

export const JWT_SECRET: string =
  process.env.JWT_SECRET || "default_secret";

export const FRONTEND_BASE_URL: string =
  process.env.FRONTEND_BASE_URL || "http://localhost:3000";

export const KHALTI_SECRET_KEY: string = (process.env.KHALTI_SECRET_KEY || "").trim();
export const KHALTI_PUBLIC_KEY: string = (process.env.KHALTI_PUBLIC_KEY || "").trim();
export const KHALTI_INITIATE_URL: string =
  process.env.KHALTI_INITIATE_URL || "https://a.khalti.com/api/v2/epayment/initiate/";
export const KHALTI_LOOKUP_URL: string =
  process.env.KHALTI_LOOKUP_URL || "https://a.khalti.com/api/v2/epayment/lookup/";

export const ESEWA_SECRET_KEY: string = (process.env.ESEWA_SECRET_KEY || "").trim();
export const ESEWA_PRODUCT_CODE: string = process.env.ESEWA_PRODUCT_CODE || "EPAYTEST";
export const ESEWA_INITIATE_URL: string =
  process.env.ESEWA_INITIATE_URL || "https://rc-epay.esewa.com.np/api/epay/main/v2/form";
export const ESEWA_STATUS_URL: string =
  process.env.ESEWA_STATUS_URL || "https://rc.esewa.com.np/api/epay/transaction/status/";
export const ESEWA_SUCCESS_URL: string =
  process.env.ESEWA_SUCCESS_URL || "http://localhost:3000/esewa/success";
export const ESEWA_FAILURE_URL: string =
  process.env.ESEWA_FAILURE_URL || "http://localhost:3000/esewa/failure";



