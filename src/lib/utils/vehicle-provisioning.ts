import type { VehicleListItem } from "@/types";

type VehicleProvisioningFields = Pick<
  VehicleListItem,
  "provisioning" | "provisioning_status"
>;

export function isVehicleProvisioningReady(
  vehicle: VehicleProvisioningFields,
) {
  if (typeof vehicle.provisioning?.ready === "boolean") {
    return vehicle.provisioning.ready;
  }

  return (
    vehicle.provisioning?.status === "ready" ||
    vehicle.provisioning_status === "ready"
  );
}
