import axios from "../axios";
import { API } from "../endpoints";

export const getAdminPayments = async () => {
  const response = await axios.get(API.ADMIN.PAYMENTS.LIST);
  return response.data;
};
