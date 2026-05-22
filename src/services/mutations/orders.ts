"use server";

import { safeApi } from "..";

export const updateOrderStatusAPI = async (orderId: string) =>
  await safeApi("POST", `/orders/${orderId}/status`);
