import ShippingCompanies from "@/components/panel/shipping-companies";
import PermissionGate from "@/components/permission-gate";

function ShippingCompaniesPage() {
  return <PermissionGate slug="Admin Index Shipping Companies"><ShippingCompanies /></PermissionGate>;
}

export default ShippingCompaniesPage;
