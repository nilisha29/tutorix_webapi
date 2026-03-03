import axios from "../axios";
import { API } from "../endpoints";

export const getAdminBookings = async () => {
  const response = await axios.get(API.ADMIN.BOOKINGS.LIST);
  return response.data;
};
