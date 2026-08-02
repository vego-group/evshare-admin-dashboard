"use client";

import { useEffect } from "react";

import { isPhoneLikeSearchValue } from "@/lib/utils/search-direction";

const DASHBOARD_SEARCH_INPUT_ATTR = "data-dashboard-search-input";
const PHONE_SEARCH_INPUT_ATTR = "data-phone-search-input";
const SEARCH_INPUT_SELECTOR = 'input[type="search"]';

function updateSearchInput(input: HTMLInputElement) {
  input.setAttribute(DASHBOARD_SEARCH_INPUT_ATTR, "true");

  if (isPhoneLikeSearchValue(input.value)) {
    input.setAttribute(PHONE_SEARCH_INPUT_ATTR, "true");
  } else {
    input.removeAttribute(PHONE_SEARCH_INPUT_ATTR);
  }
}

function SearchDirectionController() {
  useEffect(() => {
    const updateAllSearchInputs = () => {
      document
        .querySelectorAll<HTMLInputElement>(SEARCH_INPUT_SELECTOR)
        .forEach(updateSearchInput);
    };

    const handleInput = (event: Event) => {
      const target = event.target;

      if (
        target instanceof HTMLInputElement &&
        target.type === "search"
      ) {
        updateSearchInput(target);
      }
    };

    updateAllSearchInputs();

    const observer = new MutationObserver(updateAllSearchInputs);

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    document.addEventListener("input", handleInput, true);
    document.addEventListener("change", handleInput, true);

    return () => {
      observer.disconnect();
      document.removeEventListener("input", handleInput, true);
      document.removeEventListener("change", handleInput, true);
    };
  }, []);

  return null;
}

export default SearchDirectionController;
