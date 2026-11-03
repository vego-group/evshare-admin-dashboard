import { beforeEach, describe, expect, it, vi } from "vitest";

const serviceMocks = vi.hoisted(() => ({
  baseAPI: vi.fn(),
  safeApi: vi.fn(),
}));

vi.mock("@/services", () => serviceMocks);

import {
  buildAddShippingCompanyPayload,
  buildChangedShippingCompanyPayload,
  shippingCompanyDefaultValues,
} from "@/components/panel/shipping-companies/modals/shipping-company-form-utils";
import {
  buildAddShippingCityPayload,
  buildChangedShippingCityPayload,
  shippingCityDefaultValues,
} from "@/components/panel/shipping-cities/modals/shipping-city-form-utils";
import {
  addShippingCompany,
  deleteShippingCompany,
  editShippingCompany,
} from "@/services/mutations/shipping-companies";
import {
  addShippingCity,
  deleteShippingCity,
  editShippingCity,
} from "@/services/mutations/shipping-cities";
import { shippingCompaniesAPI } from "@/services/queries/shipping-companies";
import { shippingCitiesAPI } from "@/services/queries/shipping-cities";

describe("shipping reference data contract", () => {
  beforeEach(() => {
    serviceMocks.baseAPI.mockReset().mockResolvedValue({ data: [] });
    serviceMocks.safeApi.mockReset().mockResolvedValue({ ok: true });
  });

  it("uses the documented company and city list query parameters", async () => {
    await shippingCompaniesAPI({
      page: 2,
      limit: 25,
      search: "smsa",
      status: "active",
      order_by: "asc",
    });
    await shippingCitiesAPI({
      page: 3,
      limit: 50,
      search: "Jeddah",
      status: "inactive",
      country_code: "SA",
      city_uuid: "city-id",
    });

    expect(serviceMocks.baseAPI).toHaveBeenNthCalledWith(
      1,
      "GET",
      "/shipping/companies?page=2&limit=25&search=smsa&status=active&order_by=asc",
    );
    expect(serviceMocks.baseAPI).toHaveBeenNthCalledWith(
      2,
      "GET",
      "/shipping/cities?page=3&limit=50&search=Jeddah&status=inactive&country_code=SA&city_uuid=city-id",
    );
  });

  it("uses every documented create, edit, and delete endpoint", async () => {
    await addShippingCompany({ name_ar: "ناقل", name_en: "Carrier", code: "carrier" });
    await editShippingCompany("company-id", { active: false });
    await deleteShippingCompany("company-id");
    await addShippingCity({ name_ar: "جدة", name_en: "Jeddah" });
    await editShippingCity("shipping-city-id", { city_uuid: null });
    await deleteShippingCity("shipping-city-id");

    expect(serviceMocks.safeApi.mock.calls).toEqual([
      ["POST", "/shipping/companies/add", { name_ar: "ناقل", name_en: "Carrier", code: "carrier" }],
      ["POST", "/shipping/companies/company-id/edit", { active: false }],
      ["DELETE", "/shipping/companies/company-id/delete"],
      ["POST", "/shipping/cities/add", { name_ar: "جدة", name_en: "Jeddah" }],
      ["POST", "/shipping/cities/shipping-city-id/edit", { city_uuid: null }],
      ["DELETE", "/shipping/cities/shipping-city-id/delete"],
    ]);
  });

  it("applies documented company defaults and trims provider identifiers", () => {
    const payload = buildAddShippingCompanyPayload({
      ...shippingCompanyDefaultValues,
      name_ar: " ناقل ",
      name_en: " Carrier ",
      code: " carrier ",
      shipping_id: " 7323 ",
      avg_delivery_time: " 1 to 2 days ",
    });

    expect(payload).toMatchObject({
      name_ar: "ناقل",
      name_en: "Carrier",
      code: "carrier",
      shipping_id: "7323",
      avg_delivery_time: "1 to 2 days",
      base_price: 0,
      cod_charge: 0,
      return_fee: 0,
      supports_cod: false,
      active: true,
      sort_order: 0,
    });
  });

  it("sends only changed company fields on edit", () => {
    const payload = buildChangedShippingCompanyPayload(
      {
        ...shippingCompanyDefaultValues,
        name_ar: "ناقل",
        name_en: "Carrier",
        code: "carrier",
        active: false,
      },
      { active: true },
    );

    expect(payload).toEqual({ active: false });
  });

  it("normalizes country codes, relies on the provider-name default, and supports unmapping", () => {
    const addPayload = buildAddShippingCityPayload({
      ...shippingCityDefaultValues,
      name_ar: " جدة ",
      name_en: " Jeddah ",
      country_code: " sa ",
      oto_name: "",
    });
    const editPayload = buildChangedShippingCityPayload(
      { ...shippingCityDefaultValues, name_ar: "جدة", name_en: "Jeddah", city_uuid: "" },
      { city_uuid: true },
    );

    expect(addPayload).toMatchObject({
      name_ar: "جدة",
      name_en: "Jeddah",
      country_code: "SA",
    });
    expect(addPayload).not.toHaveProperty("oto_name");
    expect(editPayload).toEqual({ city_uuid: null });
  });
});
