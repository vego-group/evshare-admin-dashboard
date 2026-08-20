import ShippingCities from "@/components/panel/shipping-cities";
import PermissionGate from "@/components/permission-gate";

function ShippingCitiesPage() {
  return <PermissionGate slug="Admin Index Shipping Cities"><ShippingCities /></PermissionGate>;
}

export default ShippingCitiesPage;
