"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import {
  ClipboardList,
  LayoutDashboard,
  LogOut,
  Menu,
  Package,
  ScrollText,
  ShoppingCart,
  User,
  X,
} from "lucide-react";
import { logoutAPI } from "@/services/mutations";
import { removeToken } from "@/lib";

function Sidebar() {
  const pathname = usePathname();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isMdSidebarExpanded, setIsMdSidebarExpanded] = useState(false);
  const sidebarLinkClass =
    "relative flex items-center gap-2 overflow-hidden rounded-[14px] px-4 py-3 text-sm font-medium transition";
  const sidebarActiveLinkClass =
    "bg-[#fff6c8] text-dark-gray before:absolute before:right-0 before:top-1/2 before:h-[34px] before:w-1 before:-translate-y-1/2 before:rounded-l-full before:bg-primary";
  const sidebarInactiveLinkClass = "text-gray hover:bg-neutral-100";
  const sidebarLogoutClass =
    "mt-auto flex items-center gap-2 rounded-md bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-500 transition hover:bg-rose-100";

  const closeSidebar = () => setIsMobileSidebarOpen(false);
  const closeMdSidebar = () => setIsMdSidebarExpanded(false);

  const handleDashboardNavigation = (
    event: React.MouseEvent<HTMLAnchorElement>,
  ) => {
    event.preventDefault();
    window.location.assign("/");
  };

  const handleLogout = async () => {
    closeSidebar();
    await logoutAPI();
    await removeToken();
    window.location.assign("/login");
  };

  const isDashboardActive = pathname === "/";
  const isAssetsCatalogActive = pathname === "/assets-catalog";
  const isConsultationRequestsActive = pathname === "/consultation-requests";
  const isRegistrationRequestsActive = pathname === "/registration-requests";
  const isProductOrdersActive = pathname === "/product-orders";

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-neutral-200 bg-white">
        <div className="flex h-16 items-center justify-between gap-3 px-4 md:pr-20 lg:px-6 lg:pr-72">
          <h1 className="min-w-0 truncate text-sm font-extrabold text-secondary sm:text-base md:text-lg lg:text-2xl">
            لوحة التحكم الرئيسية
          </h1>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={() => setIsMobileSidebarOpen(true)}
              className="rounded-md border border-neutral-300 p-2 text-secondary transition hover:bg-neutral-100 md:hidden"
              aria-label="فتح القائمة"
            >
              <Menu size={20} />
            </button>

            <div className="flex items-center gap-2">
              <div className="grid size-8 place-items-center rounded-full bg-neutral-200 text-neutral-600">
                <User size={16} className="shrink-0" />
              </div>
              <div className="leading-tight">
                <p className="text-xs font-bold text-secondary">admin</p>
                <p className="hidden text-[10px] font-semibold text-emerald-600 sm:block">
                  مدير النظام
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <aside className="fixed inset-y-0 right-0 z-50 hidden w-64 border-l border-neutral-200 bg-white text-secondary lg:flex lg:flex-col">
        <div className="flex h-16 items-center justify-center border-b border-neutral-200 bg-primary px-4">
          <Image
            src="/images/logo.svg"
            alt="EV Share"
            width={150}
            height={42}
            className="h-10 w-auto object-contain"
            priority
          />
        </div>

        <nav className="flex flex-1 flex-col px-3 py-4">
          <p className="mb-2 px-3 text-right text-[11px] font-medium text-gray/80">
            القائمة الرئيسية
          </p>
          <Link
            href="/"
            onClick={handleDashboardNavigation}
            className={`${sidebarLinkClass} ${
              isDashboardActive ? sidebarActiveLinkClass : sidebarInactiveLinkClass
            }`}
          >
            <LayoutDashboard size={18} />
            <span>لوحة التحكم</span>
          </Link>

          <Link
            href="/assets-catalog"
            className={`${sidebarLinkClass} mt-2 ${
              isAssetsCatalogActive
                ? sidebarActiveLinkClass
                : sidebarInactiveLinkClass
            }`}
          >
            <Package size={18} />
            <span>كتالوج الأصول</span>
          </Link>

          <Link
            href="/consultation-requests"
            className={`${sidebarLinkClass} mt-2 ${
              isConsultationRequestsActive
                ? sidebarActiveLinkClass
                : sidebarInactiveLinkClass
            }`}
          >
            <ClipboardList size={18} />
            <span>طلبات الاستشارة</span>
          </Link>

          <Link
            href="/registration-requests"
            className={`${sidebarLinkClass} mt-2 ${
              isRegistrationRequestsActive
                ? sidebarActiveLinkClass
                : sidebarInactiveLinkClass
            }`}
          >
            <ScrollText size={18} />
            <span>طلبات التسجيل</span>
          </Link>

          <Link
            href="/product-orders"
            className={`${sidebarLinkClass} mt-2 ${
              isProductOrdersActive
                ? sidebarActiveLinkClass
                : sidebarInactiveLinkClass
            }`}
          >
            <ShoppingCart size={18} />
            <span>طلبات المنتجات</span>
          </Link>

          <button
            type="button"
            onClick={handleLogout}
            className={`${sidebarLogoutClass} w-full`}
          >
            <LogOut size={18} />
            <span>تسجيل الخروج</span>
          </button>
        </nav>
      </aside>

      <aside
        className={`fixed inset-y-0 right-0 z-40 hidden border-l border-neutral-200 bg-white text-secondary transition-all duration-300 md:flex md:flex-col lg:hidden ${
          isMdSidebarExpanded ? "w-64" : "w-16"
        }`}
      >
        <div
          className={`flex h-16 items-center border-b border-neutral-200 bg-primary ${
            isMdSidebarExpanded ? "justify-between px-4" : "justify-center px-3"
          }`}
        >
          {isMdSidebarExpanded ? (
            <>
              <Image
                src="/images/logo.svg"
                alt="EV Share"
                width={140}
                height={40}
                className="h-10 w-auto object-contain"
                priority
              />
              <button
                type="button"
                onClick={closeMdSidebar}
                className="rounded-md p-1 text-secondary transition hover:bg-black/5"
                aria-label="إغلاق القائمة"
              >
                <X size={22} />
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={() => setIsMdSidebarExpanded((prev) => !prev)}
              className="grid size-10 shrink-0 place-items-center rounded-md bg-primary text-xl font-black text-secondary"
              aria-label="Expand sidebar"
            >
              <Image
                src="/images/favicon.svg"
                alt="favicon"
                height={100}
                width={100}
                className="h-10 w-auto object-contain"
              />
            </button>
          )}
        </div>

        <nav
          className={`flex flex-1 flex-col gap-3 py-4 ${
            isMdSidebarExpanded ? "px-2" : "items-center px-2"
          }`}
        >
          <Link
            href="/"
            onClick={handleDashboardNavigation}
            className={`transition-colors ${
              isMdSidebarExpanded
                ? "relative flex h-10 w-full items-center gap-2 overflow-hidden rounded-[14px] px-3 text-sm font-medium"
                : "flex h-10 w-10 items-center justify-center rounded-md"
            } ${
              isDashboardActive
                ? isMdSidebarExpanded
                  ? sidebarActiveLinkClass
                  : "bg-[#fff6c8] text-dark-gray"
                : sidebarInactiveLinkClass
            }`}
            aria-label="Dashboard"
          >
            <LayoutDashboard size={18} className="shrink-0" />
            {isMdSidebarExpanded ? (
              <span className="ms-2 text-sm font-semibold">لوحة التحكم</span>
            ) : null}
          </Link>

          <Link
            href="/assets-catalog"
            className={`transition-colors ${
              isMdSidebarExpanded
                ? "relative flex h-10 w-full items-center gap-2 overflow-hidden rounded-[14px] px-3 text-sm font-medium"
                : "flex h-10 w-10 items-center justify-center rounded-md"
            } ${
              isAssetsCatalogActive
                ? isMdSidebarExpanded
                  ? sidebarActiveLinkClass
                  : "bg-[#fff6c8] text-dark-gray"
                : sidebarInactiveLinkClass
            }`}
            aria-label="Assets catalog"
          >
            <Package size={18} className="shrink-0" />
            {isMdSidebarExpanded ? (
              <span className="ms-2 text-sm font-semibold">كتالوج الأصول</span>
            ) : null}
          </Link>

          <Link
            href="/consultation-requests"
            className={`transition-colors ${
              isMdSidebarExpanded
                ? "relative flex h-10 w-full items-center gap-2 overflow-hidden rounded-[14px] px-3 text-sm font-medium"
                : "flex h-10 w-10 items-center justify-center rounded-md"
            } ${
              isConsultationRequestsActive
                ? isMdSidebarExpanded
                  ? sidebarActiveLinkClass
                  : "bg-[#fff6c8] text-dark-gray"
                : sidebarInactiveLinkClass
            }`}
            aria-label="Consultation requests"
          >
            <ClipboardList size={18} className="shrink-0" />
            {isMdSidebarExpanded ? (
              <span className="ms-2 text-sm font-semibold">طلبات الاستشارة</span>
            ) : null}
          </Link>

          <Link
            href="/registration-requests"
            className={`transition-colors ${
              isMdSidebarExpanded
                ? "relative flex h-10 w-full items-center gap-2 overflow-hidden rounded-[14px] px-3 text-sm font-medium"
                : "flex h-10 w-10 items-center justify-center rounded-md"
            } ${
              isRegistrationRequestsActive
                ? isMdSidebarExpanded
                  ? sidebarActiveLinkClass
                  : "bg-[#fff6c8] text-dark-gray"
                : sidebarInactiveLinkClass
            }`}
            aria-label="Registration requests"
          >
            <ScrollText size={18} className="shrink-0" />
            {isMdSidebarExpanded ? (
              <span className="ms-2 text-sm font-semibold">طلبات التسجيل</span>
            ) : null}
          </Link>

          <Link
            href="/product-orders"
            className={`transition-colors ${
              isMdSidebarExpanded
                ? "relative flex h-10 w-full items-center gap-2 overflow-hidden rounded-[14px] px-3 text-sm font-medium"
                : "flex h-10 w-10 items-center justify-center rounded-md"
            } ${
              isProductOrdersActive
                ? isMdSidebarExpanded
                  ? sidebarActiveLinkClass
                  : "bg-[#fff6c8] text-dark-gray"
                : sidebarInactiveLinkClass
            }`}
            aria-label="Product orders"
          >
            <ShoppingCart size={18} className="shrink-0" />
            {isMdSidebarExpanded ? (
              <span className="ms-2 text-sm font-semibold">طلبات المنتجات</span>
            ) : null}
          </Link>

          <button
            type="button"
            onClick={handleLogout}
            className={`transition-colors ${
              isMdSidebarExpanded
                ? "mt-auto flex h-10 w-full items-center gap-2 rounded-md bg-rose-50 px-3 text-sm font-semibold text-rose-500 hover:bg-rose-100"
                : "mt-auto flex h-10 w-10 items-center justify-center rounded-md bg-rose-50 text-rose-500 transition hover:bg-rose-100"
            }`}
            aria-label="Logout"
          >
            <LogOut size={18} className="shrink-0" />
            {isMdSidebarExpanded ? (
              <span className="ms-2 text-sm font-semibold">تسجيل الخروج</span>
            ) : null}
          </button>
        </nav>
      </aside>

      <div
        className={`fixed inset-0 z-30 hidden bg-black/35 transition-opacity duration-200 md:block lg:hidden ${
          isMdSidebarExpanded
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }`}
        onClick={() => setIsMdSidebarExpanded(false)}
      />

      <div
        className={`fixed inset-0 z-40 bg-black/40 transition-opacity duration-200 md:hidden ${
          isMobileSidebarOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }`}
        onClick={closeSidebar}
      />

      <aside
        className={`fixed inset-y-0 right-0 z-50 flex w-[84%] max-w-72 flex-col bg-white text-secondary shadow-xl transition-transform duration-300 md:hidden ${
          isMobileSidebarOpen ? "translate-x-0" : "translate-x-full"
        }`}
        aria-hidden={!isMobileSidebarOpen}
      >
        <div className="flex h-16 items-center justify-between border-b border-neutral-200 bg-primary px-4">
          <Image
            src="/images/logo.svg"
            alt="EV Share"
            width={140}
            height={40}
            className="h-9 w-auto object-contain"
            priority
          />
          <button
            type="button"
            onClick={closeSidebar}
            className="rounded-md p-1 text-secondary transition hover:bg-black/5"
            aria-label="إغلاق القائمة"
          >
            <X size={22} />
          </button>
        </div>

        <nav className="flex flex-1 flex-col px-3 py-4">
          <p className="mb-2 px-3 text-right text-[11px] font-medium text-gray/80">
            القائمة الرئيسية
          </p>
          <Link
            href="/"
            onClick={(event) => {
              closeSidebar();
              handleDashboardNavigation(event);
            }}
            className={`${sidebarLinkClass} ${
              isDashboardActive ? sidebarActiveLinkClass : sidebarInactiveLinkClass
            }`}
          >
            <LayoutDashboard size={18} />
            <span>لوحة التحكم</span>
          </Link>

          <Link
            href="/assets-catalog"
            onClick={closeSidebar}
            className={`${sidebarLinkClass} mt-2 ${
              isAssetsCatalogActive
                ? sidebarActiveLinkClass
                : sidebarInactiveLinkClass
            }`}
          >
            <Package size={18} />
            <span>كتالوج الأصول</span>
          </Link>

          <Link
            href="/consultation-requests"
            onClick={closeSidebar}
            className={`${sidebarLinkClass} mt-2 ${
              isConsultationRequestsActive
                ? sidebarActiveLinkClass
                : sidebarInactiveLinkClass
            }`}
          >
            <ClipboardList size={18} />
            <span>طلبات الاستشارة</span>
          </Link>

          <Link
            href="/registration-requests"
            onClick={closeSidebar}
            className={`${sidebarLinkClass} mt-2 ${
              isRegistrationRequestsActive
                ? sidebarActiveLinkClass
                : sidebarInactiveLinkClass
            }`}
          >
            <ScrollText size={18} />
            <span>طلبات التسجيل</span>
          </Link>

          <Link
            href="/product-orders"
            onClick={closeSidebar}
            className={`${sidebarLinkClass} mt-2 ${
              isProductOrdersActive
                ? sidebarActiveLinkClass
                : sidebarInactiveLinkClass
            }`}
          >
            <ShoppingCart size={18} />
            <span>طلبات المنتجات</span>
          </Link>

          <button
            type="button"
            onClick={handleLogout}
            className={`${sidebarLogoutClass} w-full`}
          >
            <LogOut size={18} />
            <span>تسجيل الخروج</span>
          </button>
        </nav>
      </aside>
    </>
  );
}

export default Sidebar;
