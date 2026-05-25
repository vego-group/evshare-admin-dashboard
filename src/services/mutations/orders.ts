"use server";

import { safeApi } from "..";
import type { OrderNewStatus } from "@/types";

export const updateOrderStatusAPI = async (
  orderId: string,
  status: OrderNewStatus,
) => await safeApi("POST", `/orders/${orderId}/status`, { status });
