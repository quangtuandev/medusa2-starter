var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
import { jsx, jsxs, Fragment as Fragment$1 } from "react/jsx-runtime";
import { PassThrough } from "stream";
import { createReadableStreamFromReadable } from "@react-router/node";
import * as Sentry from "@sentry/remix";
import { isbot } from "isbot";
import { renderToPipeableStream } from "react-dom/server";
import { ServerRouter, createCookie, data, useMatches, useFetchers, useFetcher, useNavigate, Link, NavLink, UNSAFE_withComponentProps, UNSAFE_withErrorBoundaryProps, useRouteError, Meta, Links, Scripts, Outlet, ScrollRestoration, useNavigation, useLoaderData, redirect, useParams, useRouteLoaderData } from "react-router";
import dotenv from "dotenv";
import { events } from "fetch-event-stream";
import { stringify } from "qs";
import cachified, { totalTtl } from "@epic-web/cachified";
import LRUCache from "lru-cache";
import omit from "lodash.omit";
import { forwardRef, useReducer, createContext, useContext, useState, useRef, useCallback, useEffect, useMemo, Fragment, memo } from "react";
import clsx, { clsx as clsx$1 } from "clsx";
import merge from "lodash/merge.js";
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle, Transition, TabList as TabList$1, Tab, TabGroup, TabPanels, TabPanel, RadioGroup, Radio, Label } from "@headlessui/react";
import XMarkIcon from "@heroicons/react/24/outline/XMarkIcon";
import isNumber from "lodash/isNumber.js";
import { ShoppingCartIcon, Bars3Icon, PlusIcon, MagnifyingGlassPlusIcon, MinusIcon, ChevronLeftIcon as ChevronLeftIcon$1, ChevronRightIcon as ChevronRightIcon$1 } from "@heroicons/react/24/outline";
import { initReactI18next, I18nextProvider, useTranslation } from "react-i18next";
import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { zodResolver } from "@hookform/resolvers/zod";
import { getValidatedFormData, useRemixForm, useRemixFormContext, RemixFormProvider } from "remix-hook-form";
import * as z from "zod";
import { z as z$1 } from "zod";
import ChevronLeftIcon from "@heroicons/react/24/solid/ChevronLeftIcon";
import ChevronRightIcon from "@heroicons/react/24/solid/ChevronRightIcon";
import ArrowRightIcon from "@heroicons/react/24/solid/ArrowRightIcon";
import { animate, spring } from "animejs";
import { MemoryFileStorage } from "@mjackson/file-storage/memory";
import { parseFormData } from "@mjackson/form-data-parser";
import TrashIcon from "@heroicons/react/24/outline/TrashIcon";
import CheckCircleIcon from "@heroicons/react/24/solid/CheckCircleIcon";
import ExclamationTriangleIcon from "@heroicons/react/24/solid/ExclamationTriangleIcon";
import InformationCircleIcon from "@heroicons/react/24/solid/InformationCircleIcon";
import XCircleIcon from "@heroicons/react/24/solid/XCircleIcon";
import { FileUploader } from "react-drag-drop-files";
import { TextField, Textarea } from "@lambdacurry/forms/remix-hook-form";
import { Rating, RoundedStar } from "@smastrom/react-rating";
import PencilIcon from "@heroicons/react/24/outline/PencilIcon";
import Lightbox from "yet-another-react-lightbox";
import Captions from "yet-another-react-lightbox/plugins/captions";
import Fullscreen from "yet-another-react-lightbox/plugins/fullscreen";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import ArrowLeftIcon from "@heroicons/react/24/solid/ArrowLeftIcon";
import debounce from "lodash/debounce.js";
import { Controller, useForm } from "react-hook-form";
import { useFetcher as useFetcher$1, useNavigate as useNavigate$1, Link as Link$1 } from "react-router-dom";
import CheckIcon from "@heroicons/react/24/solid/CheckIcon";
import { Elements, AddressElement } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { RadioGroupItem, RadioGroup as RadioGroup$1 } from "@lambdacurry/forms/ui";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import ShoppingCartIcon$1 from "@heroicons/react/24/outline/ShoppingCartIcon";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { send } from "@emailjs/browser";
import { motion as motion$1 } from "motion/react";
if (process.env.SENTRY_DSN)
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    environment: process.env.SENTRY_ENVIRONMENT,
    tracesSampleRate: 0
  });
const handleError = Sentry.sentryHandleError;
const ABORT_DELAY = 5e3;
function handleRequest(...props) {
  return isbot(props[0].headers.get("user-agent")) ? handleBotRequest(...props) : handleBrowserRequest(...props);
}
function handleBotRequest(request, responseStatusCode, responseHeaders, reactRouterContext) {
  return new Promise((resolve, reject) => {
    let didError = false;
    const { pipe, abort } = renderToPipeableStream(/* @__PURE__ */ jsx(ServerRouter, { context: reactRouterContext, url: request.url }), {
      onAllReady() {
        const body = new PassThrough();
        const stream = createReadableStreamFromReadable(body);
        responseHeaders.set("Content-Type", "text/html");
        resolve(
          new Response(stream, {
            headers: responseHeaders,
            status: didError ? 500 : responseStatusCode
          })
        );
        pipe(body);
      },
      onShellError(error) {
        reject(error);
      },
      onError(error) {
        didError = true;
        console.error(error);
      }
    });
    setTimeout(abort, ABORT_DELAY);
  });
}
function handleBrowserRequest(request, responseStatusCode, responseHeaders, reactRouterContext) {
  return new Promise((resolve, reject) => {
    let didError = false;
    const { pipe, abort } = renderToPipeableStream(/* @__PURE__ */ jsx(ServerRouter, { context: reactRouterContext, url: request.url }), {
      onShellReady() {
        const body = new PassThrough();
        const stream = createReadableStreamFromReadable(body);
        responseHeaders.set("Content-Type", "text/html");
        resolve(
          new Response(stream, {
            headers: responseHeaders,
            status: didError ? 500 : responseStatusCode
          })
        );
        pipe(body);
      },
      onShellError(err) {
        reject(err);
      },
      onError(error) {
        didError = true;
        console.error(error);
      }
    });
    setTimeout(abort, ABORT_DELAY);
  });
}
const entryServer = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: handleRequest,
  handleError
}, Symbol.toStringTag, { value: "Module" }));
const filterEmptyMeta = (meta2) => meta2.filter(
  (meta22) => "title" in meta22 && !!meta22.title || "name" in meta22 && !!meta22.content || "property" in meta22 && !!meta22.content
);
const mergeMetaArrays = (prevMeta, nextMeta) => {
  const mergedMeta = [...prevMeta];
  const filteredNextMeta = filterEmptyMeta(nextMeta);
  for (let override of filteredNextMeta) {
    const index = mergedMeta.findIndex(
      (meta2) => "title" in meta2 && "title" in override || "name" in meta2 && "name" in override && meta2.name === override.name || "property" in meta2 && "property" in override && meta2.property === override.property
    );
    if (index !== -1) {
      mergedMeta.splice(index, 1);
    }
    mergedMeta.push(override);
  }
  return mergedMeta;
};
const mergeMeta = (...overrideFuncs) => (arg) => overrideFuncs.reduce(
  (acc, override) => mergeMetaArrays(acc, override(arg) ?? []),
  []
);
const getParentMeta = ({ matches }) => matches.reduce((acc, match) => mergeMetaArrays(acc, match.meta || []), []);
const getCommonMeta = ({ matches }) => {
  var _a;
  const rootMatch = matches[0];
  const currentMatch = matches == null ? void 0 : matches[(matches == null ? void 0 : matches.length) - 1];
  const siteDetails = (_a = rootMatch.data) == null ? void 0 : _a.siteDetails;
  if (!siteDetails) return [];
  const canonicalUrl = `${siteDetails.settings.storefront_url}${currentMatch.pathname}`;
  return [
    { charset: "utf-8" },
    {
      name: "viewport",
      content: "width=device-width, initial-scale=1.0, height=device-height, user-scalable=0"
    },
    { property: "og:url", content: canonicalUrl },
    { property: "og:type", content: "website" },
    { property: "og:site_name", content: siteDetails.store.name }
  ];
};
var NavigationItemLocation = /* @__PURE__ */ ((NavigationItemLocation2) => {
  NavigationItemLocation2["header"] = "header";
  NavigationItemLocation2["footer"] = "footer";
  return NavigationItemLocation2;
})(NavigationItemLocation || {});
const headerNavigationItems = [
  {
    id: 1,
    label: "Products",
    url: "/pick-a-card",
    sort_order: 0,
    location: NavigationItemLocation.header,
    new_tab: false
  },
  {
    id: 2,
    label: "About Us",
    url: "/stories",
    sort_order: 1,
    location: NavigationItemLocation.header,
    new_tab: false
  },
  {
    id: 3,
    label: "Blog",
    url: "/blogs",
    sort_order: 1,
    location: NavigationItemLocation.header,
    new_tab: false
  },
  {
    id: 4,
    label: "Let's talk",
    url: "/contact",
    sort_order: 1,
    location: NavigationItemLocation.header,
    new_tab: false
  }
];
const footerNavigationItems = [
  {
    id: 1,
    label: "About Us",
    url: "/stories",
    location: NavigationItemLocation.footer,
    sort_order: 1,
    new_tab: false
  },
  {
    id: 2,
    label: "FAQs",
    url: "/faqs",
    location: NavigationItemLocation.footer,
    sort_order: 1,
    new_tab: false
  },
  {
    id: 3,
    label: "Documentation",
    url: "/docs",
    location: NavigationItemLocation.footer,
    sort_order: 1,
    new_tab: false
  },
  {
    id: 4,
    label: "Terms of Service",
    url: "/terms-of-service",
    location: NavigationItemLocation.footer,
    sort_order: 1,
    new_tab: false
  }
];
const loadEnv = () => {
  const envFile = process.env.NODE_ENV ? `.env.${process.env.NODE_ENV}` : ".env";
  dotenv.config({ path: envFile });
  dotenv.config({ path: ".env.local" });
  dotenv.config({ path: ".env" });
};
loadEnv();
const config = {
  NODE_ENV: process.env.NODE_ENV,
  ENVIRONMENT: process.env.ENVIRONMENT,
  STRIPE_PUBLIC_KEY: process.env.STRIPE_PUBLIC_KEY,
  PAYPAL_CLIENT_ID: process.env.PAYPAL_CLIENT_ID,
  PUBLIC_MEDUSA_API_URL: process.env.PUBLIC_MEDUSA_API_URL,
  STOREFRONT_URL: process.env.STOREFRONT_URL,
  SENTRY_DSN: process.env.SENTRY_DSN,
  SENTRY_ENVIRONMENT: process.env.SENTRY_ENVIRONMENT,
  EVENT_LOGGING: process.env.EVENT_LOGGING,
  AUTH_COOKIE_NAME: process.env.AUTH_COOKIE_NAME ?? "_medusa_jwt",
  MEDUSA_PUBLISHABLE_KEY: process.env.MEDUSA_PUBLISHABLE_KEY
};
const siteSettings = {
  storefront_url: config.STOREFRONT_URL,
  description: "",
  favicon: "/favicon.svg",
  social_facebook: "https://www.facebook.com/kiraparfum",
  social_instagram: "https://www.instagram.com/bykiraparfum",
  social_tiktok: "https://www.tiktok.com/@kira.parfum"
};
const authCookie = createCookie(config.AUTH_COOKIE_NAME);
const getAuthHeaders = async (request) => {
  if (!request.headers) {
    throw Error("No request provided for getting auth headers");
  }
  const token = await getCookie(request.headers, authCookie);
  if (!token) {
    return {};
  }
  return { authorization: `Bearer ${token}` };
};
const withAuthHeaders = (asyncFn) => {
  return async (request, ...args) => {
    const authHeaders = await getAuthHeaders(request);
    return await asyncFn(request, authHeaders, ...args);
  };
};
async function setCookie(headers, cookie, value) {
  return headers.append(
    "set-cookie",
    typeof cookie === "string" ? `${cookie}=${value}; Max-Age=604800; path=/;` : await cookie.serialize(value, { maxAge: 604800, path: "/" })
  );
}
async function destroyCookie(headers, cookie) {
  return headers.append(
    "set-cookie",
    `${cookie}=; Max-Age=0; path=/;`
  );
}
async function getCookie(headers, cookie) {
  return typeof cookie === "string" ? parseCookie(headers.get("Cookie"))[cookie] : await cookie.parse(headers.get("Cookie"));
}
function parseCookie(str) {
  if (!str) return {};
  return (str || "").split(";").map((v) => v.split("=")).reduce(
    (acc, v) => {
      acc[decodeURIComponent(v[0].trim())] = decodeURIComponent(v[1].trim());
      return acc;
    },
    {}
  );
}
const getCartId = (headers) => {
  return getCookie(headers, "_medusa_cart_id");
};
const getSelectedRegionId = (headers) => {
  return getCookie(headers, "_medusa_region_id");
};
const setSelectedRegionId = async (headers, regionId) => {
  await setCookie(headers, "_medusa_region_id", regionId);
};
const setCartId = async (headers, cartId) => {
  await setCookie(headers, "_medusa_cart_id", cartId);
};
const removeCartId = async (headers) => {
  await destroyCookie(headers, "_medusa_cart_id");
};
function medusaError(error) {
  console.error("~ medusaError ~ error:", error);
  if (error.response) {
    const u = new URL(error.config.url, error.config.baseURL);
    console.error("Resource:", u.toString());
    console.error("Response data:", error.response.data);
    console.error("Status code:", error.response.status);
    console.error("Headers:", error.response.headers);
    const message = error.response.data.message || error.response.data;
    throw new Error(message.charAt(0).toUpperCase() + message.slice(1) + ".");
  } else if (error.request) {
    throw new Error("No response received: " + error.request);
  } else {
    throw new Error("Error setting up the request: " + error.message);
  }
}
var __awaiter$M = function(thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function(resolve) {
      resolve(value);
    });
  }
  return new (P || (P = Promise))(function(resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }
    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }
    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};
class ApiKey {
  /**
   * @ignore
   */
  constructor(client) {
    this.client = client;
  }
  /**
   * This methods retrieves a paginated list of API keys. It sends a request to the
   * [List API Keys](https://docs.medusajs.com/api/admin#api-keys_getapikeys) API route.
   *
   * @param queryParams - Filters and pagination configurations.
   * @param headers - Headers to pass in the request.
   * @returns The paginated list of API keys.
   *
   * @example
   * To retrieve the list of API keys:
   *
   * ```ts
   * sdk.admin.apiKey.list()
   * .then(({ api_keys, count, limit, offset }) => {
   *   console.log(api_keys)
   * })
   * ```
   *
   * To configure the pagination, pass the `limit` and `offset` query parameters.
   *
   * For example, to retrieve only 10 items and skip 10 items:
   *
   * ```ts
   * sdk.admin.apiKey.list({
   *   limit: 10,
   *   offset: 10
   * })
   * .then(({ api_keys, count, limit, offset }) => {
   *   console.log(api_keys)
   * })
   * ```
   *
   * Using the `fields` query parameter, you can specify the fields and relations to retrieve
   * in each API key:
   *
   * ```ts
   * sdk.admin.apiKey.list({
   *   fields: "id,*sales_channels"
   * })
   * .then(({ api_keys, count, limit, offset }) => {
   *   console.log(api_keys)
   * })
   * ```
   *
   * Learn more about the `fields` property in the [API reference](https://docs.medusajs.com/api/store#select-fields-and-relations).
   */
  list(queryParams, headers) {
    return __awaiter$M(this, void 0, void 0, function* () {
      return yield this.client.fetch(`/admin/api-keys`, {
        query: queryParams,
        headers
      });
    });
  }
  /**
   * This method creates an API key. It sends a request to the [Create API Key](https://docs.medusajs.com/api/admin#api-keys_postapikeys)
   * API route.
   *
   * @param body - The API key's details.
   * @param query - Configure the fields to retrieve in the created API key.
   * @param headers - Headers to pass in the request
   * @returns The created API key
   *
   * @example
   * sdk.admin.apiKey.create({
   *   title: "Development",
   *   type: "publishable"
   * })
   * .then(({ api_key }) => {
   *   console.log(api_key)
   * })
   */
  create(body, query, headers) {
    return __awaiter$M(this, void 0, void 0, function* () {
      return yield this.client.fetch(`/admin/api-keys`, {
        method: "POST",
        headers,
        body,
        query
      });
    });
  }
  /**
   * This method revokes an API key. It sends a request to the
   * [Revoke API Key](https://docs.medusajs.com/api/admin#api-keys_postapikeysidrevoke) API route.
   *
   * @param id - The API key's ID.
   * @param headers - Headers to pass in the request.
   * @returns The API key's details.
   *
   * @example
   * sdk.admin.apiKey.revoke("apk_123")
   * .then(({ api_key }) => {
   *   console.log(api_key)
   * })
   */
  revoke(id, headers) {
    return __awaiter$M(this, void 0, void 0, function* () {
      return yield this.client.fetch(`/admin/api-keys/${id}/revoke`, {
        method: "POST",
        headers
      });
    });
  }
  /**
   * This method retrieves an API key's details. It sends a request to the
   * [Get API key](https://docs.medusajs.com/api/admin#api-keys_getapikeysid) API route.
   *
   * @param id - The API key's ID.
   * @param headers - Headers to pass in the request.
   * @returns The API key's details.
   *
   * @example
   * sdk.admin.apiKey.retrieve("apk_123")
   * .then(({ api_key }) => {
   *   console.log(api_key)
   * })
   */
  retrieve(id, headers) {
    return __awaiter$M(this, void 0, void 0, function* () {
      return yield this.client.fetch(`/admin/api-keys/${id}`, {
        headers
      });
    });
  }
  /**
   * This method updates an API key's details. It sends a request to the
   * [Update API Key](https://docs.medusajs.com/api/admin#api-keys_postapikeysid) API route.
   *
   * @param id - The API key's ID.
   * @param body - The data to update in the API key.
   * @param query - Configure the fields to retrieve in the API key.
   * @param headers - Headers to pass in the request.
   * @returns The API key's details.
   *
   * @example
   * sdk.admin.apiKey.update("apk_123", {
   *   title: "Development"
   * })
   * .then(({ api_key }) => {
   *   console.log(api_key)
   * })
   */
  update(id, body, query, headers) {
    return __awaiter$M(this, void 0, void 0, function* () {
      return yield this.client.fetch(`/admin/api-keys/${id}`, {
        method: "POST",
        headers,
        body,
        query
      });
    });
  }
  /**
   * This method deletes an API key by its ID. It sends a request to the
   * [Delete API Key](https://docs.medusajs.com/api/admin#api-keys_deleteapikeysid) API route.
   *
   * @param id - The API key's ID.
   * @param headers - Headers to pass in the request.
   * @returns The deletion's details.
   *
   * @example
   * sdk.admin.apiKey.delete("apk_123")
   * .then(({ deleted }) => {
   *   console.log(deleted)
   * })
   */
  delete(id, headers) {
    return __awaiter$M(this, void 0, void 0, function* () {
      return yield this.client.fetch(`/admin/api-keys/${id}`, {
        method: "DELETE",
        headers
      });
    });
  }
  /**
   * This method manages the sales channels associated with a publishable API key to either add
   * or remove associations. It sends a request to the [Manage Sales Channels](https://docs.medusajs.com/api/admin#api-keys_postapikeysidsaleschannels)
   * API route.
   *
   * @param id - The API key's ID.
   * @param body - The sales channels to add or remove from the API key.
   * @param headers - Headers to pass in the request.
   * @returns The API key's details.
   *
   * @example
   * sdk.admin.apiKey.batchSalesChannels("apk_123", {
   *   add: ["sc_123"],
   *   remove: ["sc_321"]
   * })
   * .then(({ api_key }) => {
   *   console.log(api_key)
   * })
   */
  batchSalesChannels(id, body, headers) {
    return __awaiter$M(this, void 0, void 0, function* () {
      return yield this.client.fetch(`/admin/api-keys/${id}/sales-channels`, {
        method: "POST",
        headers,
        body
      });
    });
  }
}
var __awaiter$L = function(thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function(resolve) {
      resolve(value);
    });
  }
  return new (P || (P = Promise))(function(resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }
    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }
    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};
class Campaign {
  /**
   * @ignore
   */
  constructor(client) {
    this.client = client;
  }
  /**
   * This method retrieves a campaign by its ID. It sends a request to the
   * [Get Campaign](https://docs.medusajs.com/api/admin#campaigns_getcampaignsid) API route.
   *
   * @param id - The campaign's ID.
   * @param query - Configure the fields to retrieve in the campaign.
   * @param headers - Headers to pass in the request
   * @returns The campaign's details.
   *
   * @example
   * To retrieve a campaign by its ID:
   *
   * ```ts
   * sdk.admin.campaign.retrieve("procamp_123")
   * .then(({ campaign }) => {
   *   console.log(campaign)
   * })
   * ```
   *
   * To specify the fields and relations to retrieve:
   *
   * ```ts
   * sdk.admin.campaign.retrieve("procamp_123", {
   *   fields: "id,*budget"
   * })
   * .then(({ campaign }) => {
   *   console.log(campaign)
   * })
   * ```
   *
   * Learn more about the `fields` property in the [API reference](https://docs.medusajs.com/api/store#select-fields-and-relations).
   */
  retrieve(id, query, headers) {
    return __awaiter$L(this, void 0, void 0, function* () {
      return yield this.client.fetch(`/admin/campaigns/${id}`, {
        headers,
        query
      });
    });
  }
  /**
   * This method retrieves a paginated list of campaigns. It sends a request to the
   * [List Campaigns](https://docs.medusajs.com/api/admin#campaigns_getcampaigns) API route.
   *
   * @param query - Filters and pagination configurations.
   * @param headers - Headers to pass in the request.
   * @returns The paginated list of campaigns.
   *
   * @example
   * To retrieve the list of campaigns:
   *
   * ```ts
   * sdk.admin.campaign.list()
   * .then(({ campaigns, count, limit, offset }) => {
   *   console.log(campaigns)
   * })
   * ```
   *
   * To configure the pagination, pass the `limit` and `offset` query parameters.
   *
   * For example, to retrieve only 10 items and skip 10 items:
   *
   * ```ts
   * sdk.admin.campaign.list({
   *   limit: 10,
   *   offset: 10
   * })
   * .then(({ campaigns, count, limit, offset }) => {
   *   console.log(campaigns)
   * })
   * ```
   *
   * Using the `fields` query parameter, you can specify the fields and relations to retrieve
   * in each campaign:
   *
   * ```ts
   * sdk.admin.campaign.list({
   *   fields: "id,*budget"
   * })
   * .then(({ campaigns, count, limit, offset }) => {
   *   console.log(campaigns)
   * })
   * ```
   *
   * Learn more about the `fields` property in the [API reference](https://docs.medusajs.com/api/store#select-fields-and-relations).
   */
  list(query, headers) {
    return __awaiter$L(this, void 0, void 0, function* () {
      return yield this.client.fetch(`/admin/campaigns`, {
        headers,
        query
      });
    });
  }
  /**
   * This method creates a campaign. It sends a request to the
   * [Create Campaign](https://docs.medusajs.com/api/admin#campaigns_postcampaigns) API route.
   *
   * @param payload - The details of the campaign to create.
   * @param headers - Headers to pass in the request
   * @returns The campaign's details.
   *
   * @example
   * sdk.admin.campaign.create({
   *   name: "Summer Campaign"
   * })
   * .then(({ campaign }) => {
   *   console.log(campaign)
   * })
   */
  create(payload, headers) {
    return __awaiter$L(this, void 0, void 0, function* () {
      return yield this.client.fetch(`/admin/campaigns`, {
        method: "POST",
        headers,
        body: payload
      });
    });
  }
  /**
   * This method updates a campaign. It sends a request to the
   * [Update Campaign](https://docs.medusajs.com/api/admin#campaigns_postcampaignsid) API route.
   *
   * @param id - The campaign's ID.
   * @param payload - The data to update in the campaign.
   * @param headers - Headers to pass in the request
   * @returns The campaign's details.
   *
   * @example
   * sdk.admin.campaign.update("procamp_123", {
   *   name: "Summer Campaign"
   * })
   * .then(({ campaign }) => {
   *   console.log(campaign)
   * })
   */
  update(id, payload, headers) {
    return __awaiter$L(this, void 0, void 0, function* () {
      return yield this.client.fetch(`/admin/campaigns/${id}`, {
        method: "POST",
        headers,
        body: payload
      });
    });
  }
  /**
   * This method deletes a campaign by its ID. It sends a request to the
   * [Delete Campaign](https://docs.medusajs.com/api/admin#campaigns_deletecampaignsid) API route.
   *
   * @param id - The campaign's ID.
   * @param headers - Headers to pass in the request
   * @returns The deletion's details.
   *
   * @example
   * sdk.admin.campaign.delete("procamp_123")
   * .then(({ deleted }) => {
   *   console.log(deleted)
   * })
   */
  delete(id, headers) {
    return __awaiter$L(this, void 0, void 0, function* () {
      return yield this.client.fetch(`/admin/campaigns/${id}`, {
        method: "DELETE",
        headers
      });
    });
  }
  /**
   * This method manages the promotions of a campaign to either add or remove the association between them.
   * It sends a request to the [Manage Promotions](https://docs.medusajs.com/api/admin#campaigns_postcampaignsidpromotions)
   * API route.
   *
   * @param id - The campaign's ID.
   * @param payload - The promotions to add or remove associations to them.
   * @param headers - Headers to pass in the request
   * @returns The campaign's details.
   *
   * @example
   * sdk.admin.campaign.batchPromotions("procamp_123", {
   *   add: ["prom_123", "prom_456"],
   *   remove: ["prom_789"]
   * })
   * .then(({ campaign }) => {
   *   console.log(campaign)
   * })
   */
  batchPromotions(id, payload, headers) {
    return __awaiter$L(this, void 0, void 0, function* () {
      return yield this.client.fetch(`/admin/campaigns/${id}/promotions`, {
        method: "POST",
        headers,
        body: payload
      });
    });
  }
}
var __awaiter$K = function(thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function(resolve) {
      resolve(value);
    });
  }
  return new (P || (P = Promise))(function(resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }
    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }
    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};
class Claim {
  /**
   * @ignore
   */
  constructor(client) {
    this.client = client;
  }
  /**
   * This method retrieves a paginated list of claims. It sends a request to the
   * [List Claims](https://docs.medusajs.com/api/admin#claims_getclaims) API route.
   *
   * @param query - Filters and pagination configurations.
   * @param headers - Headers to pass in the request.
   * @returns The paginated list of claims.
   *
   * @example
   * To retrieve the list of claims:
   *
   * ```ts
   * sdk.admin.claim.list()
   * .then(({ claims, count, limit, offset }) => {
   *   console.log(claims)
   * })
   * ```
   *
   * To configure the pagination, pass the `limit` and `offset` query parameters.
   *
   * For example, to retrieve only 10 items and skip 10 items:
   *
   * ```ts
   * sdk.admin.claim.list({
   *   limit: 10,
   *   offset: 10
   * })
   * .then(({ claims, count, limit, offset }) => {
   *   console.log(claims)
   * })
   * ```
   *
   * Using the `fields` query parameter, you can specify the fields and relations to retrieve
   * in each claim:
   *
   * ```ts
   * sdk.admin.claim.list({
   *   fields: "id,*additional_items"
   * })
   * .then(({ claims, count, limit, offset }) => {
   *   console.log(claims)
   * })
   * ```
   *
   * Learn more about the `fields` property in the [API reference](https://docs.medusajs.com/api/store#select-fields-and-relations).
   */
  list(query, headers) {
    return __awaiter$K(this, void 0, void 0, function* () {
      return yield this.client.fetch(`/admin/claims`, {
        query,
        headers
      });
    });
  }
  /**
   * This method retrieves a claim. It sends a request to the
   * [Get Claim](https://docs.medusajs.com/api/admin#claims_getclaimsid) API route.
   *
   * @param id - The claim's ID.
   * @param query - Configure the fields to retrieve in the claim.
   * @param headers - Headers to pass in the request
   * @returns The claim's details.
   *
   * @example
   * To retrieve a claim by its ID:
   *
   * ```ts
   * sdk.admin.claim.retrieve("claim_123")
   * .then(({ claim }) => {
   *   console.log(claim)
   * })
   * ```
   *
   * To specify the fields and relations to retrieve:
   *
   * ```ts
   * sdk.admin.claim.retrieve("claim_123", {
   *   fields: "id,*additional_items"
   * })
   * .then(({ claim }) => {
   *   console.log(claim)
   * })
   * ```
   *
   * Learn more about the `fields` property in the [API reference](https://docs.medusajs.com/api/store#select-fields-and-relations).
   */
  retrieve(id, query, headers) {
    return __awaiter$K(this, void 0, void 0, function* () {
      return yield this.client.fetch(`/admin/claims/${id}`, {
        query,
        headers
      });
    });
  }
  /**
   * This method creates a claim. It sends a request to the
   * [Create Claim](https://docs.medusajs.com/api/admin#claims_postclaims) API route.
   *
   * @param body - The claim's details.
   * @param query - Configure the fields to retrieve in the claim.
   * @param headers - Headers to pass in the request
   * @returns The claim and order's details.
   *
   * @example
   * sdk.admin.claim.create({
   *   type: "refund",
   *   order_id: "order_123",
   * })
   * .then(({ claim }) => {
   *   console.log(claim)
   * })
   */
  create(body, query, headers) {
    return __awaiter$K(this, void 0, void 0, function* () {
      return yield this.client.fetch(`/admin/claims`, {
        method: "POST",
        headers,
        body,
        query
      });
    });
  }
  /**
   * This method cancels a claim. It sends a request to the
   * [Cancel Claim](https://docs.medusajs.com/api/admin#claims_postclaimsidcancel) API route.
   *
   * @param id - The claim's ID.
   * @param query - Configure the fields to retrieve in the claim.
   * @param headers - Headers to pass in the request
   * @returns The claim's details.
   *
   * @example
   * sdk.admin.claim.cancel("claim_123")
   * .then(({ claim }) => {
   *   console.log(claim)
   * })
   */
  cancel(id, query, headers) {
    return __awaiter$K(this, void 0, void 0, function* () {
      return yield this.client.fetch(`/admin/claims/${id}/cancel`, {
        method: "POST",
        headers,
        query
      });
    });
  }
  /**
   * This method adds items to the claim. It sends a request to the
   * [Add Items](https://docs.medusajs.com/api/admin#claims_postclaimsidclaimitems) API route.
   *
   * @param id - The ID of the claim to add the items to.
   * @param body - The items' details.
   * @param query - Configure the fields to retrieve in the claim.
   * @param headers - Headers to pass in the request
   * @returns The claim's details with a preview of the order when the claim is applied.
   *
   * @example
   * sdk.admin.claim.addItems("claim_123", {
   *   items: [
   *     {
   *       id: "orli_123",
   *       quantity: 1
   *     }
   *   ]
   * })
   * .then(({ claim }) => {
   *   console.log(claim)
   * })
   */
  addItems(id, body, query, headers) {
    return __awaiter$K(this, void 0, void 0, function* () {
      return yield this.client.fetch(`/admin/claims/${id}/claim-items`, {
        method: "POST",
        headers,
        body,
        query
      });
    });
  }
  /**
   * This method updates a claim item by the ID of the item's `WRITE_OFF_ITEM` action. It
   * sends a request to the [Update Claim Item](https://docs.medusajs.com/api/admin#claims_postclaimsidclaimitemsaction_id) API route.
   *
   * Every item has an `actions` property, whose value is an array of actions.
   * You can check the action's name using its `action` property, and use the value of the `id` property.
   *
   * @param id - The claim's ID.
   * @param actionId - The id of the order item's `WRITE_OFF_ITEM` action.
   * @param body - The details to update.
   * @param query - Configure the fields to retrieve in the claim.
   * @param headers - Headers to pass in the request
   * @returns The claim's details with a preview of the order when the claim is applied.
   *
   * @example
   * sdk.admin.claim.updateItem(
   *   "claim_123",
   *   "ordchact_123",
   *   {
   *     quantity: 1
   *   }
   *   )
   * .then(({ claim }) => {
   *   console.log(claim)
   * })
   */
  updateItem(id, actionId, body, query, headers) {
    return __awaiter$K(this, void 0, void 0, function* () {
      return yield this.client.fetch(`/admin/claims/${id}/claim-items/${actionId}`, {
        method: "POST",
        headers,
        body,
        query
      });
    });
  }
  /**
   * This method removes a claim item from a claim by the ID of the item's `WRITE_OFF_ITEM` action.
   * It sends a request to the [Remove Claim Item](https://docs.medusajs.com/api/admin#claims_deleteclaimsidclaimitemsaction_id)
   * API route.
   *
   * Every item has an `actions` property, whose value is an array of actions.
   * You can check the action's name using its `action` property, and use the value of the `id` property.
   *
   * @param id - The claim's ID.
   * @param actionId - The id of the order item's `WRITE_OFF_ITEM` action.
   * @param query - Configure the fields to retrieve in the claim.
   * @param headers - Headers to pass in the request
   * @returns The claim's details with a preview of the order when the claim is applied.
   *
   * @example
   * sdk.admin.claim.removeItem(
   *   "claim_123",
   *   "ordchact_123",
   *   )
   * .then(({ claim }) => {
   *   console.log(claim)
   * })
   */
  removeItem(id, actionId, query, headers) {
    return __awaiter$K(this, void 0, void 0, function* () {
      return yield this.client.fetch(`/admin/claims/${id}/claim-items/${actionId}`, {
        method: "DELETE",
        headers,
        query
      });
    });
  }
  /**
   * This method adds inbound (or return) items to the claim. These inbound items will have a `RETURN_ITEM` action.
   *
   * This method sends a request to the [Add Inbound Items](https://docs.medusajs.com/api/admin#claims_postclaimsidinbounditems)
   * API route.
   *
   * @param id - The ID of the claim to add the inbound items to.
   * @param body - The inbound items' details.
   * @param query - Configure the fields to retrieve in the return.
   * @param headers - Headers to pass in the request
   * @returns The details of the return associated with the claim, with a preview of the order when the claim is applied.
   *
   * @example
   * sdk.admin.claim.addInboundItems(
   *   "claim_123",
   *   {
   *     items: [
   *       {
   *         id: "orli_123",
   *         quantity: 1
   *       }
   *     ]
   *   },
   *   )
   * .then(({ return: returnData }) => {
   *   console.log(returnData)
   * })
   */
  addInboundItems(id, body, query, headers) {
    return __awaiter$K(this, void 0, void 0, function* () {
      return yield this.client.fetch(`/admin/claims/${id}/inbound/items`, {
        method: "POST",
        headers,
        body,
        query
      });
    });
  }
  /**
   * This method updates an inbound (or return) item of a claim using the ID of the item's `RETURN_ITEM` action.
   * It sends a request to the [Update Inbound Item](https://docs.medusajs.com/api/admin#claims_postclaimsidinbounditemsaction_id)
   * API route.
   *
   * Every item has an `actions` property, whose value is an array of actions.
   * You can check the action's name using its `action` property, and use the value of the `id` property.
   *
   * @param id - The claim's ID.
   * @param actionId - The id of the return item's `RETURN_ITEM` action.
   * @param body - The details to update in the inbound item.
   * @param query - Configure the fields to retrieve in the return.
   * @param headers - Headers to pass in the request
   * @returns The details of the return associated wth the claim, with a preview of the order when the claim is applied.
   *
   * @example
   * sdk.admin.claim.updateInboundItem(
   *   "claim_123",
   *   "ordchact_123",
   *   {
   *     quantity: 1
   *   },
   *   )
   * .then(({ return: returnData }) => {
   *   console.log(returnData)
   * })
   */
  updateInboundItem(id, actionId, body, query, headers) {
    return __awaiter$K(this, void 0, void 0, function* () {
      return yield this.client.fetch(`/admin/claims/${id}/inbound/items/${actionId}`, {
        method: "POST",
        headers,
        body,
        query
      });
    });
  }
  /**
   * This method removes an inbound (or return) item from a claim using the ID of the item's `RETURN_ITEM` action.
   * It sends a request to the [Remove Inbound Item](https://docs.medusajs.com/api/admin#claims_deleteclaimsidinbounditemsaction_id)
   * API route.
   *
   * Every item has an `actions` property, whose value is an array of actions.
   * You can check the action's name using its `action` property, and use the value of the `id` property.
   *
   * @param id - The claim's ID.
   * @param actionId - The ID of the return item's `RETURN_ITEM` action.
   * @param query - Configure the fields to retrieve in the return.
   * @param headers - Headers to pass in the request
   * @returns The details of the return associated wth the claim, with a preview of the order when the claim is applied.
   *
   * @example
   * sdk.admin.claim.removeInboundItem(
   *   "claim_123",
   *   "ordchact_123",
   *   )
   * .then(({ return: returnData }) => {
   *   console.log(returnData)
   * })
   */
  removeInboundItem(id, actionId, query, headers) {
    return __awaiter$K(this, void 0, void 0, function* () {
      return yield this.client.fetch(`/admin/claims/${id}/inbound/items/${actionId}`, {
        method: "DELETE",
        headers,
        query
      });
    });
  }
  /**
   * This method adds an inbound (or return) shipping method to a claim.
   * The inbound shipping method will have a `SHIPPING_ADD` action.
   *
   * This method sends a request to the [Add Inbound Shipping](https://docs.medusajs.com/api/admin#claims_postclaimsidinboundshippingmethod)
   * API route.
   *
   * @param id - The claim's ID.
   * @param body - The shipping method's details.
   * @param query - Configure the fields to retrieve in the return.
   * @param headers - Headers to pass in the request
   * @returns The details of the return associated wth the claim, with a preview of the order when the claim is applied.
   *
   * @example
   * sdk.admin.claim.addInboundShipping(
   *   "claim_123",
   *   {
   *     shipping_option_id: "so_123",
   *     custom_amount: 10
   *   },
   *   )
   * .then(({ return: returnData }) => {
   *   console.log(returnData)
   * })
   */
  addInboundShipping(id, body, query, headers) {
    return __awaiter$K(this, void 0, void 0, function* () {
      return yield this.client.fetch(`/admin/claims/${id}/inbound/shipping-method`, {
        method: "POST",
        headers,
        body,
        query
      });
    });
  }
  /**
   * This method updates a shipping method for returning items in the claim using the ID of the method's `SHIPPING_ADD` action.
   * It sends a request to the [Update Inbound Shipping](https://docs.medusajs.com/api/admin#claims_postclaimsidinboundshippingmethodaction_id)
   * API route.
   *
   * Every shipping method has an `actions` property, whose value is an array of actions.
   * You can check the action's name using its `action` property, and use the value of the `id` property.
   *
   * @param id - The claim's ID.
   * @param actionId - The id of the shipping method's `SHIPPING_ADD` action.
   * @param body - The details to update in the shipping method
   * @param query - Configure the fields to retrieve in the claim.
   * @param headers - Headers to pass in the request
   * @returns The details of the claim, with a preview of the order when the claim is applied.
   *
   * @example
   * sdk.admin.claim.updateInboundShipping(
   *   "claim_123",
   *   "ordchact_123",
   *   {
   *     custom_amount: 10
   *   },
   *   )
   * .then(({ claim }) => {
   *   console.log(claim)
   * })
   */
  updateInboundShipping(id, actionId, body, query, headers) {
    return __awaiter$K(this, void 0, void 0, function* () {
      return yield this.client.fetch(`/admin/claims/${id}/inbound/shipping-method/${actionId}`, {
        method: "POST",
        headers,
        body,
        query
      });
    });
  }
  /**
   * This method deletes a shipping method for returning items in the claim using the ID of the method's `SHIPPING_ADD` action.
   * It sends a request to the [Remove Inbound Shipping](https://docs.medusajs.com/api/admin#claims_deleteclaimsidinboundshippingmethodaction_id)
   * API route.
   *
   * Every shipping method has an `actions` property, whose value is an array of actions.
   * You can check the action's name using its `action` property, and use the value of the `id` property.
   *
   * @param id - The claim's ID.
   * @param actionId - The id of the shipping method's `SHIPPING_ADD` action.
   * @param query - Configure the fields to retrieve in the return.
   * @param headers - Headers to pass in the request
   * @returns The details of the return associated wth the claim, with a preview of the order when the claim is applied.
   *
   * @example
   * sdk.admin.claim.deleteInboundShipping(
   *   "claim_123",
   *   "ordchact_123",
   *   )
   * .then(({ return: returnData }) => {
   *   console.log(returnData)
   * })
   */
  deleteInboundShipping(id, actionId, query, headers) {
    return __awaiter$K(this, void 0, void 0, function* () {
      return yield this.client.fetch(`/admin/claims/${id}/inbound/shipping-method/${actionId}`, {
        method: "DELETE",
        headers,
        query
      });
    });
  }
  /**
   * This method adds outbound (or new) items to a claim. These outbound items will have an `ITEM_ADD` action.
   * It sends a request to the [Add Outbound Items](https://docs.medusajs.com/api/admin#claims_postclaimsidoutbounditems)
   * API route.
   *
   * @param id - The ID of the claim to add the outbound items to.
   * @param body - The items' details.
   * @param query - Configure the fields to retrieve in the claim.
   * @param headers - Headers to pass in the request
   * @returns The details of the claim, with a preview of the order when the claim is applied.
   *
   * @example
   * sdk.admin.claim.addOutboundItems(
   *   "claim_123",
   *   {
   *     items: [{
   *       id: "orli_123",
   *       quantity: 1
   *     }]
   *   },
   *   )
   * .then(({ claim }) => {
   *   console.log(claim)
   * })
   */
  addOutboundItems(id, body, query, headers) {
    return __awaiter$K(this, void 0, void 0, function* () {
      return yield this.client.fetch(`/admin/claims/${id}/outbound/items`, {
        method: "POST",
        headers,
        body,
        query
      });
    });
  }
  /**
   * This method updates an outbound (or new) item of a claim using the ID of the item's `ITEM_ADD` action.
   * It sends a request to the [Update Outbound Item](https://docs.medusajs.com/api/admin#claims_postclaimsidoutbounditemsaction_id)
   * API route.
   *
   * Every item has an `actions` property, whose value is an array of actions.
   * You can check the action's name using its `action` property, and use the value of the `id` property.
   *
   * @param id - The claim's ID.
   * @param actionId - The id of the new claim item's `ITEM_ADD` action.
   * @param body - The item's details.
   * @param query - Configure the fields to retrieve in the claim.
   * @param headers - Headers to pass in the request
   * @returns The details of the claim, with a preview of the order when the claim is applied.
   *
   * @example
   * sdk.admin.claim.updateOutboundItem(
   *   "claim_123",
   *   "ordchact_123",
   *   {
   *     quantity: 1
   *   },
   *   )
   * .then(({ claim }) => {
   *   console.log(claim)
   * })
   */
  updateOutboundItem(id, actionId, body, query, headers) {
    return __awaiter$K(this, void 0, void 0, function* () {
      return yield this.client.fetch(`/admin/claims/${id}/outbound/items/${actionId}`, {
        method: "POST",
        headers,
        body,
        query
      });
    });
  }
  /**
   * This method removes an outbound (or new) item from a claim using the ID of the item's `ITEM_ADD` action.
   * It sends a request to the [Remove Outbound Item](https://docs.medusajs.com/api/admin#claims_deleteclaimsidoutbounditemsaction_id)
   * API route.
   *
   * Every item has an `actions` property, whose value is an array of actions.
   * You can check the action's name using its `action` property, and use the value of the `id` property.
   *
   * @param id - The claim's ID.
   * @param actionId - The id of the new claim item's `ITEM_ADD` action.
   * @param query - Configure the fields to retrieve in the claim.
   * @param headers - Headers to pass in the request
   * @returns The details of the claim, with a preview of the order when the claim is applied.
   *
   * @example
   * sdk.admin.claim.removeOutboundItem(
   *   "claim_123",
   *   "ordchact_123",
   * )
   * .then(({ claim }) => {
   *   console.log(claim)
   * })
   */
  removeOutboundItem(id, actionId, query, headers) {
    return __awaiter$K(this, void 0, void 0, function* () {
      return yield this.client.fetch(`/admin/claims/${id}/outbound/items/${actionId}`, {
        method: "DELETE",
        headers,
        query
      });
    });
  }
  /**
   * This method adds outbound an outbound shipping method to a claim.
   * The outbound shipping method will have a `SHIPPING_ADD` action.
   *
   * This method sends a request to the
   * [Add Outbound Shipping](https://docs.medusajs.com/api/admin#claims_postclaimsidoutboundshippingmethod)
   * API route.
   *
   * @param id - The claim's ID.
   * @param body - The shipping method's details.
   * @param query - Configure the fields to retrieve in the claim.
   * @param headers - Headers to pass in the request
   * @returns The details of the claim, with a preview of the order when the claim is applied.
   *
   * @example
   * sdk.admin.claim.addOutboundShipping(
   *   "claim_123",
   *   {
   *     shipping_option_id: "so_123",
   *     custom_amount: 10
   *   },
   * )
   * .then(({ claim }) => {
   *   console.log(claim)
   * })
   */
  addOutboundShipping(id, body, query, headers) {
    return __awaiter$K(this, void 0, void 0, function* () {
      return yield this.client.fetch(`/admin/claims/${id}/outbound/shipping-method`, {
        method: "POST",
        headers,
        body,
        query
      });
    });
  }
  /**
   * This method updates the shipping method for delivering outbound items in a claim using the ID of the method's `SHIPPING_ADD` action.
   * It sends a request to the [Update Outbound Shipping](https://docs.medusajs.com/api/admin#claims_postclaimsidoutboundshippingmethodaction_id)
   * API route.
   *
   * Every shipping method has an `actions` property, whose value is an array of actions.
   * You can check the action's name using its `action` property, and use the value of the `id` property.
   *
   * @param id - The claim's ID.
   * @param actionId - The id of the shipping method's `SHIPPING_ADD` action.
   * @param body - The shipping method's details.
   * @param query - Configure the fields to retrieve in the claim.
   * @param headers - Headers to pass in the request
   * @returns The details of the claim, with a preview of the order when the claim is applied.
   *
   * @example
   * sdk.admin.claim.updateOutboundShipping(
   *   "claim_123",
   *   "ordchact_123",
   *   {
   *     custom_amount: 10
   *   },
   * )
   * .then(({ claim }) => {
   *   console.log(claim)
   * })
   */
  updateOutboundShipping(id, actionId, body, query, headers) {
    return __awaiter$K(this, void 0, void 0, function* () {
      return yield this.client.fetch(`/admin/claims/${id}/outbound/shipping-method/${actionId}`, {
        method: "POST",
        headers,
        body,
        query
      });
    });
  }
  /**
   * This method deletes the shipping method for delivering outbound items in the claim using the ID of the method's `SHIPPING_ADD` action.
   *
   * Every shipping method has an `actions` property, whose value is an array of actions.
   * You can check the action's name using its `action` property, and use the value of the `id` property.
   *
   * @param id - The claim's ID.
   * @param actionId - The id of the shipping method's `SHIPPING_ADD` action.
   * @param query - Configure the fields to retrieve in the claim.
   * @param headers - Headers to pass in the request
   * @returns The details of the claim, with a preview of the order when the claim is applied.
   *
   * @example
   * sdk.admin.claim.deleteOutboundShipping(
   *   "claim_123",
   *   "ordchact_123",
   * )
   * .then(({ claim }) => {
   *   console.log(claim)
   * })
   */
  deleteOutboundShipping(id, actionId, query, headers) {
    return __awaiter$K(this, void 0, void 0, function* () {
      return yield this.client.fetch(`/admin/claims/${id}/outbound/shipping-method/${actionId}`, {
        method: "DELETE",
        headers,
        query
      });
    });
  }
  /**
   * This method confirms a claim request, applying its changes on the associated order.
   * It sends a request to the [Confirm Claim Request](https://docs.medusajs.com/api/admin#claims_postclaimsidrequest)
   * API route.
   *
   * @param id - The claim's ID.
   * @param body - The confirmation details.
   * @param query - Configure the fields to retrieve in the claim.
   * @param headers - Headers to pass in the request
   * @returns The details of the claim and its associated return, with a preview of the order when the claim is applied.
   *
   * @example
   * sdk.admin.claim.request(
   *   "claim_123",
   *   {},
   * )
   * .then(({ claim }) => {
   *   console.log(claim)
   * })
   */
  request(id, body, query, headers) {
    return __awaiter$K(this, void 0, void 0, function* () {
      return yield this.client.fetch(`/admin/claims/${id}/request`, {
        method: "POST",
        headers,
        body,
        query
      });
    });
  }
  /**
   * This method cancels a requested claim. It sends a request to the
   * [Cancel Claim Request](https://docs.medusajs.com/api/admin#claims_deleteclaimsidrequest)
   * API route.
   *
   * @param id - The claim's ID.
   * @param query - Configure the fields to retrieve in the claim.
   * @param headers - Headers to pass in the request
   * @returns The cancelation's details.
   *
   * @example
   * sdk.admin.claim.cancelRequest(
   *   "claim_123",
   * )
   * .then(({ deleted }) => {
   *   console.log(deleted)
   * })
   */
  cancelRequest(id, query, headers) {
    return __awaiter$K(this, void 0, void 0, function* () {
      return yield this.client.fetch(`/admin/claims/${id}/request`, {
        method: "DELETE",
        headers,
        query
      });
    });
  }
}
var __awaiter$J = function(thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function(resolve) {
      resolve(value);
    });
  }
  return new (P || (P = Promise))(function(resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }
    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }
    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};
class Currency {
  /**
   * @ignore
   */
  constructor(client) {
    this.client = client;
  }
  /**
   * This method retrieves a paginated list of currencies. It sends a request to the
   * [List Currencies](https://docs.medusajs.com/api/admin#currencies_getcurrencies)
   * API route.
   *
   * @param query - Filters and pagination configurations.
   * @param headers - Headers to pass in the request.
   * @returns The paginated list of currencies.
   *
   * @example
   * To retrieve the list of currencies:
   *
   * ```ts
   * sdk.admin.currency.list()
   * .then(({ currencies, count, limit, offset }) => {
   *   console.log(currencies)
   * })
   * ```
   *
   * To configure the pagination, pass the `limit` and `offset` query parameters.
   *
   * For example, to retrieve only 10 items and skip 10 items:
   *
   * ```ts
   * sdk.admin.currency.list({
   *   limit: 10,
   *   offset: 10
   * })
   * .then(({ currencies, count, limit, offset }) => {
   *   console.log(currencies)
   * })
   * ```
   *
   * Using the `fields` query parameter, you can specify the fields and relations to retrieve
   * in each currency:
   *
   * ```ts
   * sdk.admin.currency.list({
   *   fields: "code,symbol"
   * })
   * .then(({ currencies, count, limit, offset }) => {
   *   console.log(currencies)
   * })
   * ```
   *
   * Learn more about the `fields` property in the [API reference](https://docs.medusajs.com/api/store#select-fields-and-relations).
   */
  list(query, headers) {
    return __awaiter$J(this, void 0, void 0, function* () {
      return this.client.fetch(`/admin/currencies`, {
        headers,
        query
      });
    });
  }
  /**
   * This method retrieves a currency by its code. It sends a request to the
   * [Get Currency](https://docs.medusajs.com/api/admin#currencies_getcurrenciescode) API route.
   *
   * @param code - The currency's code.
   * @param query - Configure the fields to retrieve in the currency.
   * @param headers - Headers to pass in the request
   * @returns The currency's details.
   *
   * @example
   * To retrieve a currency by its code:
   *
   * ```ts
   * sdk.admin.currency.retrieve("usd")
   * .then(({ currency }) => {
   *   console.log(currency)
   * })
   * ```
   *
   * To specify the fields and relations to retrieve:
   *
   * ```ts
   * sdk.admin.currency.retrieve("usd", {
   *   fields: "code,symbol"
   * })
   * .then(({ currency }) => {
   *   console.log(currency)
   * })
   * ```
   *
   * Learn more about the `fields` property in the [API reference](https://docs.medusajs.com/api/store#select-fields-and-relations).
   */
  retrieve(code, query, headers) {
    return __awaiter$J(this, void 0, void 0, function* () {
      return this.client.fetch(`/admin/currencies/${code}`, {
        headers,
        query
      });
    });
  }
}
var __awaiter$I = function(thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function(resolve) {
      resolve(value);
    });
  }
  return new (P || (P = Promise))(function(resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }
    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }
    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};
class Customer {
  /**
   * @ignore
   */
  constructor(client) {
    this.client = client;
  }
  /**
   * This method creates a customer. It sends a request to the
   * [Create Customer](https://docs.medusajs.com/api/admin#customers_postcustomers) API route.
   *
   * @param body - The customer's details.
   * @param query - Configure the fields to retrieve in the customer.
   * @param headers - Headers to pass in the request.
   * @returns The customer's details.
   *
   * @example
   * sdk.admin.customer.create({
   *   email: "customer@gmail.com"
   * })
   * .then(({ customer }) => {
   *   console.log(customer)
   * })
   */
  create(body, query, headers) {
    return __awaiter$I(this, void 0, void 0, function* () {
      return this.client.fetch(`/admin/customers`, {
        method: "POST",
        headers,
        body,
        query
      });
    });
  }
  /**
   * This method updates a customer's details. It sends a request to the
   * [Update Customer](https://docs.medusajs.com/api/admin#customers_postcustomersid) API route.
   *
   * @param id - The customer's ID.
   * @param body - The details to update of the customer.
   * @param query - Configure the fields to retrieve in the customer.
   * @param headers - Headers to pass in the request.
   * @returns The customer's details.
   *
   * @example
   * sdk.admin.customer.update("cus_123", {
   *   first_name: "John"
   * })
   * .then(({ customer }) => {
   *   console.log(customer)
   * })
   */
  update(id, body, query, headers) {
    return __awaiter$I(this, void 0, void 0, function* () {
      return this.client.fetch(`/admin/customers/${id}`, {
        method: "POST",
        headers,
        body,
        query
      });
    });
  }
  /**
   * This method retrieves a paginated list of customers. It sends a request to the
   * [List Customers](https://docs.medusajs.com/api/admin#customers_getcustomers)
   * API route.
   *
   * @param queryParams - Filters and pagination configurations.
   * @param headers - Headers to pass in the request.
   * @returns The paginated list of customers.
   *
   * @example
   * To retrieve the list of customers:
   *
   * ```ts
   * sdk.admin.customer.list()
   * .then(({ customers, count, limit, offset }) => {
   *   console.log(customers)
   * })
   * ```
   *
   * To configure the pagination, pass the `limit` and `offset` query parameters.
   *
   * For example, to retrieve only 10 items and skip 10 items:
   *
   * ```ts
   * sdk.admin.customer.list({
   *   limit: 10,
   *   offset: 10
   * })
   * .then(({ customers, count, limit, offset }) => {
   *   console.log(customers)
   * })
   * ```
   *
   * Using the `fields` query parameter, you can specify the fields and relations to retrieve
   * in each customer:
   *
   * ```ts
   * sdk.admin.customer.list({
   *   fields: "id,*groups"
   * })
   * .then(({ customers, count, limit, offset }) => {
   *   console.log(customers)
   * })
   * ```
   *
   * Learn more about the `fields` property in the [API reference](https://docs.medusajs.com/api/store#select-fields-and-relations).
   */
  list(queryParams, headers) {
    return __awaiter$I(this, void 0, void 0, function* () {
      return this.client.fetch(`/admin/customers`, {
        headers,
        query: queryParams
      });
    });
  }
  /**
   * This method retrieves a customer by its ID. It sends a request to the
   * [Get Customer](https://docs.medusajs.com/api/admin#customers_getcustomersid)
   * API route.
   *
   * @param id - The customer's ID.
   * @param query - Configure the fields to retrieve in the customer.
   * @param headers - Headers to pass in the request.
   * @returns The customer's details.
   *
   * @example
   * To retrieve a customer by its ID:
   *
   * ```ts
   * sdk.admin.customer.retrieve("cus_123")
   * .then(({ customer }) => {
   *   console.log(customer)
   * })
   * ```
   *
   * To specify the fields and relations to retrieve:
   *
   * ```ts
   * sdk.admin.customer.retrieve("cus_123", {
   *   fields: "id,*groups"
   * })
   * .then(({ customer }) => {
   *   console.log(customer)
   * })
   * ```
   *
   * Learn more about the `fields` property in the [API reference](https://docs.medusajs.com/api/store#select-fields-and-relations).
   */
  retrieve(id, query, headers) {
    return __awaiter$I(this, void 0, void 0, function* () {
      return this.client.fetch(`/admin/customers/${id}`, {
        query,
        headers
      });
    });
  }
  /**
   * This method deletes a customer by its ID. It sends a request to the
   * [Delete Customer](https://docs.medusajs.com/api/admin#customers_deletecustomersid)
   * API route.
   *
   * @param id - The customer's ID.
   * @param headers - Headers to pass in the request.
   * @returns The deletion's details.
   *
   * @example
   * sdk.admin.customer.delete("cus_123")
   * .then(({ deleted }) => {
   *   console.log(deleted)
   * })
   */
  delete(id, headers) {
    return __awaiter$I(this, void 0, void 0, function* () {
      return this.client.fetch(`/admin/customers/${id}`, {
        method: "DELETE",
        headers
      });
    });
  }
  /**
   * This method manages customer groups for a customer.
   * It sends a request to the [Manage Customers](https://docs.medusajs.com/api/admin#customers_postcustomersidcustomergroups)
   * API route.
   *
   * @param id - The customer's ID.
   * @param body - The groups to add customer to or remove customer from.
   * @param headers - Headers to pass in the request
   * @returns The customers details.
   *
   * @example
   * sdk.admin.customer.batchCustomerGroups("cus_123", {
   *   add: ["cusgroup_123"],
   *   remove: ["cusgroup_321"]
   * })
   * .then(({ customer }) => {
   *   console.log(customer)
   * })
   */
  batchCustomerGroups(id, body, headers) {
    return __awaiter$I(this, void 0, void 0, function* () {
      return yield this.client.fetch(`/admin/customers/${id}/customer-groups`, {
        method: "POST",
        headers,
        body
      });
    });
  }
  /**
   * This method creates a customer address. It sends a request to the
   * [Create Customer Address](https://docs.medusajs.com/api/admin#customers_postcustomersidaddresses)
   * API route.
   *
   * @param id - The customer's ID.
   * @param body - The customer address's details.
   * @param headers - Headers to pass in the request.
   * @returns The customer address's details.
   *
   * @example
   * sdk.admin.customer.createAddress("cus_123", {
   *   address_1: "123 Main St",
   *   city: "Anytown",
   *   country_code: "US",
   *   postal_code: "12345"
   * })
   * .then(({ customer }) => {
   *   console.log(customer)
   * })
   */
  createAddress(id, body, headers) {
    return __awaiter$I(this, void 0, void 0, function* () {
      return yield this.client.fetch(`/admin/customers/${id}/addresses`, {
        method: "POST",
        headers,
        body
      });
    });
  }
  /**
   * This method updates a customer address. It sends a request to the
   * [Update Customer Address](https://docs.medusajs.com/api/admin#customers_postcustomersidaddressesaddressid)
   * API route.
   *
   * @param id - The customer's ID.
   * @param addressId - The customer address's ID.
   * @param body - The customer address's details.
   * @param headers - Headers to pass in the request.
   * @returns The customer address's details.
   *
   * @example
   * sdk.admin.customer.updateAddress("cus_123", "cus_addr_123", {
   *   address_1: "123 Main St",
   *   city: "Anytown",
   *   country_code: "US",
   *   postal_code: "12345"
   * })
   * .then(({ customer }) => {
   *   console.log(customer)
   * })
   */
  updateAddress(id, addressId, body, headers) {
    return __awaiter$I(this, void 0, void 0, function* () {
      return yield this.client.fetch(`/admin/customers/${id}/addresses/${addressId}`, {
        method: "POST",
        headers,
        body
      });
    });
  }
  /**
   * This method deletes a customer address. It sends a request to the
   * [Delete Customer Address](https://docs.medusajs.com/api/admin#customers_deletecustomersidaddressesaddressid)
   * API route.
   *
   * @param id - The customer's ID.
   * @param addressId - The customer address's ID.
   * @param headers - Headers to pass in the request.
   * @returns The customer address's details.
   *
   * @example
   * sdk.admin.customer.deleteAddress("cus_123", "cus_addr_123")
   * .then(({ customer }) => {
   *   console.log(customer)
   * })
   */
  deleteAddress(id, addressId, headers) {
    return __awaiter$I(this, void 0, void 0, function* () {
      return yield this.client.fetch(`/admin/customers/${id}/addresses/${addressId}`, {
        method: "DELETE",
        headers
      });
    });
  }
  /**
   * This method retrieves a customer address by its ID. It sends a request to the
   * [Get Customer Address](https://docs.medusajs.com/api/admin#customers_getcustomersidaddressesaddressid)
   * API route.
   *
   * @param id - The customer's ID.
   * @param addressId - The customer address's ID.
   * @param headers - Headers to pass in the request.
   * @returns The customer address's details.
   *
   * @example
   * sdk.admin.customer.retrieveAddress("cus_123", "cus_addr_123")
   * .then(({ customer }) => {
   *   console.log(customer)
   * })
   */
  retrieveAddress(id, addressId, headers) {
    return __awaiter$I(this, void 0, void 0, function* () {
      return yield this.client.fetch(`/admin/customers/${id}/addresses/${addressId}`, {
        headers
      });
    });
  }
  /**
   * This method retrieves a list of customer addresses. It sends a request to the
   * [List Customer Addresses](https://docs.medusajs.com/api/admin#customers_getcustomersidaddresses)
   * API route.
   *
   * @param id - The customer's ID.
   * @param headers - Headers to pass in the request.
   * @returns The list of customer addresses.
   *
   * @example
   * sdk.admin.customer.listAddresses("cus_123")
   * .then(({ addresses }) => {
   *   console.log(addresses)
   * })
   */
  listAddresses(id, headers) {
    return __awaiter$I(this, void 0, void 0, function* () {
      return yield this.client.fetch(`/admin/customers/${id}/addresses`, {
        headers
      });
    });
  }
}
var __awaiter$H = function(thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function(resolve) {
      resolve(value);
    });
  }
  return new (P || (P = Promise))(function(resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }
    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }
    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};
class CustomerGroup {
  /**
   * @ignore
   */
  constructor(client) {
    this.client = client;
  }
  /**
   * This method retrieves a customer group by its ID. It sends a request to the
   * [Get Customer Group](https://docs.medusajs.com/api/admin#customer-groups_getcustomergroupsid) API route.
   *
   * @param id - The customer group's ID.
   * @param query - Configure the fields to retrieve in the customer group.
   * @param headers - Headers to pass in the request
   * @returns The group's details.
   *
   * @example
   * To retrieve a customer group by its ID:
   *
   * ```ts
   * sdk.admin.customerGroup.retrieve("cusgroup_123")
   * .then(({ customer_group }) => {
   *   console.log(customer_group)
   * })
   * ```
   *
   * To specify the fields and relations to retrieve:
   *
   * ```ts
   * sdk.admin.customerGroup.retrieve("cusgroup_123", {
   *   fields: "id,*customer"
   * })
   * .then(({ customer_group }) => {
   *   console.log(customer_group)
   * })
   * ```
   *
   * Learn more about the `fields` property in the [API reference](https://docs.medusajs.com/api/store#select-fields-and-relations).
   */
  retrieve(id, query, headers) {
    return __awaiter$H(this, void 0, void 0, function* () {
      return yield this.client.fetch(`/admin/customer-groups/${id}`, {
        method: "GET",
        query,
        headers
      });
    });
  }
  /**
   * This method retrieves a paginated list of customer groups. It sends a request to the
   * [List Customer Groups](https://docs.medusajs.com/api/admin#customer-groups_getcustomergroups)
   * API route.
   *
   * @param query - Filters and pagination configurations.
   * @param headers - Headers to pass in the request.
   * @returns The paginated list of customer groups.
   *
   * @example
   * To retrieve the list of customer groups:
   *
   * ```ts
   * sdk.admin.customerGroup.list()
   * .then(({ customer_groups, count, limit, offset }) => {
   *   console.log(customer_groups)
   * })
   * ```
   *
   * To configure the pagination, pass the `limit` and `offset` query parameters.
   *
   * For example, to retrieve only 10 items and skip 10 items:
   *
   * ```ts
   * sdk.admin.customerGroup.list({
   *   limit: 10,
   *   offset: 10
   * })
   * .then(({ customer_groups, count, limit, offset }) => {
   *   console.log(customer_groups)
   * })
   * ```
   *
   * Using the `fields` query parameter, you can specify the fields and relations to retrieve
   * in each customer group:
   *
   * ```ts
   * sdk.admin.customerGroup.list({
   *   fields: "id,*customer"
   * })
   * .then(({ customer_groups, count, limit, offset }) => {
   *   console.log(customer_groups)
   * })
   * ```
   *
   * Learn more about the `fields` property in the [API reference](https://docs.medusajs.com/api/store#select-fields-and-relations).
   */
  list(query, headers) {
    return __awaiter$H(this, void 0, void 0, function* () {
      return yield this.client.fetch(`/admin/customer-groups`, {
        method: "GET",
        headers,
        query
      });
    });
  }
  /**
   * This method creates a customer group. It sends a request to the
   * [Create Customer Group](https://docs.medusajs.com/api/admin#customer-groups_postcustomergroups)
   * API route.
   *
   * @param body - The customer group's details.
   * @param query - Configure the fields to retrieve in the customer group.
   * @param headers - Headers to pass in the request.
   * @returns The customer group's details.
   *
   * @example
   * sdk.admin.customerGroup.create({
   *   name: "VIP"
   * })
   * .then(({ customer_group }) => {
   *   console.log(customer_group)
   * })
   */
  create(body, query, headers) {
    return __awaiter$H(this, void 0, void 0, function* () {
      return yield this.client.fetch(`/admin/customer-groups`, {
        method: "POST",
        headers,
        body,
        query
      });
    });
  }
  /**
   * This method updates a customer group's details. It sends a request to the
   * [Update Customer](https://docs.medusajs.com/api/admin#customer-groups_postcustomergroupsid)
   * API route.
   *
   * @param id - The customer group's ID.
   * @param body - The details to update in the group.
   * @param query - Configure the fields to retrieve in the customer group.
   * @param headers - Headers to pass in the request.
   * @returns The customer group's details.
   *
   * @example
   * sdk.admin.customerGroup.update("cusgroup_123", {
   *   name: "VIP"
   * })
   * .then(({ customer_group }) => {
   *   console.log(customer_group)
   * })
   */
  update(id, body, query, headers) {
    return __awaiter$H(this, void 0, void 0, function* () {
      return yield this.client.fetch(`/admin/customer-groups/${id}`, {
        method: "POST",
        headers,
        body,
        query
      });
    });
  }
  /**
   * This method deletes a customer group. This method sends a request to the
   * [Delete Customer Group](https://docs.medusajs.com/api/admin#customer-groups_deletecustomergroupsid)
   * API route.
   *
   * @param id - The customer group's ID.
   * @param headers - Headers to pass in the request
   * @returns The deletion's details.
   *
   * @example
   * sdk.admin.customerGroup.delete("cusgroup_123")
   * .then(({ deleted }) => {
   *   console.log(deleted)
   * })
   */
  delete(id, headers) {
    return __awaiter$H(this, void 0, void 0, function* () {
      return yield this.client.fetch(`/admin/customer-groups/${id}`, {
        method: "DELETE",
        headers
      });
    });
  }
  /**
   * This method manages customers of a group to add or remove them from the group.
   * It sends a request to the [Manage Customers](https://docs.medusajs.com/api/admin#customer-groups_postcustomergroupsidcustomers)
   * API route.
   *
   * @param id - The group's ID.
   * @param body - The customers to add or remove from the group.
   * @param headers - Headers to pass in the request
   * @returns The customer group's details.
   *
   * @example
   * sdk.admin.customerGroup.batchCustomers("cusgroup_123", {
   *   add: ["cus_123"],
   *   remove: ["cus_321"]
   * })
   * .then(({ customer_group }) => {
   *   console.log(customer_group)
   * })
   */
  batchCustomers(id, body, headers) {
    return __awaiter$H(this, void 0, void 0, function* () {
      return yield this.client.fetch(`/admin/customer-groups/${id}/customers`, {
        method: "POST",
        headers,
        body
      });
    });
  }
}
var __awaiter$G = function(thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function(resolve) {
      resolve(value);
    });
  }
  return new (P || (P = Promise))(function(resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }
    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }
    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};
class DraftOrder {
  /**
   * @ignore
   */
  constructor(client) {
    this.client = client;
  }
  /**
   * This method retrieves a draft order by its ID. It sends a request to the
   * [Get Draft Order](https://docs.medusajs.com/api/admin#draft-orders_getdraftordersid)
   * API route.
   *
   * @param id - The draft order's ID.
   * @param query - Configure the fields to retrieve in the draft order.
   * @param headers - Headers to pass in the request
   * @returns The draft order's details.
   *
   * @example
   * To retrieve a draft order by its ID:
   *
   * ```ts
   * sdk.admin.draftOrder.retrieve("order_123")
   * .then(({ draft_order }) => {
   *   console.log(draft_order)
   * })
   * ```
   *
   * To specify the fields and relations to retrieve:
   *
   * ```ts
   * sdk.admin.draftOrder.retrieve("order_123", {
   *   fields: "id,*items"
   * })
   * .then(({ draft_order }) => {
   *   console.log(draft_order)
   * })
   * ```
   *
   * Learn more about the `fields` property in the [API reference](https://docs.medusajs.com/api/store#select-fields-and-relations).
   */
  retrieve(id, query, headers) {
    return __awaiter$G(this, void 0, void 0, function* () {
      return yield this.client.fetch(`/admin/draft-orders/${id}`, {
        query,
        headers
      });
    });
  }
  /**
   * This method retrieves a paginated list of draft orders. It sends a request to the
   * [List Draft Orders](https://docs.medusajs.com/api/admin#draft-orders_getdraftorders) API route.
   *
   * @param queryParams - Filters and pagination configurations.
   * @param headers - Headers to pass in the request.
   * @returns The paginated list of draft orders.
   *
   * @example
   * To retrieve the list of draft orders:
   *
   * ```ts
   * sdk.admin.draftOrder.list()
   * .then(({ draft_orders, count, limit, offset }) => {
   *   console.log(draft_orders)
   * })
   * ```
   *
   * To configure the pagination, pass the `limit` and `offset` query parameters.
   *
   * For example, to retrieve only 10 items and skip 10 items:
   *
   * ```ts
   * sdk.admin.draftOrder.list({
   *   limit: 10,
   *   offset: 10
   * })
   * .then(({ draft_orders, count, limit, offset }) => {
   *   console.log(draft_orders)
   * })
   * ```
   *
   * Using the `fields` query parameter, you can specify the fields and relations to retrieve
   * in each draft order:
   *
   * ```ts
   * sdk.admin.draftOrder.list({
   *   fields: "id,*items"
   * })
   * .then(({ draft_orders, count, limit, offset }) => {
   *   console.log(draft_orders)
   * })
   * ```
   *
   * Learn more about the `fields` property in the [API reference](https://docs.medusajs.com/api/store#select-fields-and-relations).
   */
  list(queryParams, headers) {
    return __awaiter$G(this, void 0, void 0, function* () {
      return yield this.client.fetch(`/admin/draft-orders`, {
        query: queryParams,
        headers
      });
    });
  }
  /**
   * This method creates a draft order. It sends a request to the
   * [Create Draft Order](https://docs.medusajs.com/api/admin#draft-orders_postdraftorders) API route.
   *
   * @param body - The data to create the draft order.
   * @param query - Configure the fields to retrieve in the draft order.
   * @param headers - Headers to pass in the request.
   * @returns The draft order's details.
   *
   * @example
   * sdk.admin.draftOrder.create({
   *   email: "test@test.com",
   *   items: [
   *     {
   *       variant_id: "variant_123",
   *       quantity: 1,
   *     },
   *   ],
   *   region_id: "region_123",
   *   sales_channel_id: "sc_123",
   * })
   * .then(({ draft_order }) => {
   *   console.log(draft_order)
   * })
   */
  create(body, query, headers) {
    return __awaiter$G(this, void 0, void 0, function* () {
      return yield this.client.fetch(`/admin/draft-orders`, {
        method: "POST",
        body,
        query,
        headers
      });
    });
  }
  /**
   * This method deletes a draft order. It sends a request to the
   * [Delete Draft Order](https://docs.medusajs.com/api/admin#draft-orders_deleteordereditsid) API route.
   *
   * @param id - The draft order's ID.
   * @param headers - Headers to pass in the request.
   *
   * @example
   * sdk.admin.draftOrder.delete("order_123")
   * .then(({ id, object, deleted }) => {
   *   console.log(id, object, deleted)
   * })
   */
  delete(id, headers) {
    return __awaiter$G(this, void 0, void 0, function* () {
      return yield this.client.fetch(`/admin/draft-orders/${id}`, {
        method: "DELETE",
        headers
      });
    });
  }
  /**
   * This method updates a draft order. It sends a request to the
   * [Update Draft Order](https://docs.medusajs.com/api/admin#draft-orders_postdraftordersid) API route.
   *
   * @param id - The draft order's ID.
   * @param body - The data to update the draft order.
   * @param query - Configure the fields to retrieve in the draft order.
   * @param headers - Headers to pass in the request.
   * @returns The draft order's details.
   *
   * @example
   * sdk.admin.draftOrder.update("order_123", {
   *   email: "test@test.com",
   * })
   * .then(({ draft_order }) => {
   *   console.log(draft_order)
   * })
   */
  update(id, body, query, headers) {
    return __awaiter$G(this, void 0, void 0, function* () {
      return yield this.client.fetch(`/admin/draft-orders/${id}`, {
        method: "POST",
        body,
        query,
        headers
      });
    });
  }
  /**
   * This method converts a draft order to an order. It sends a request to the
   * [Convert Draft Order to Order](https://docs.medusajs.com/api/admin#draft-orders_postdraftordersidconverttoorder) API route.
   *
   * @param id - The draft order's ID.
   * @param query - Configure the fields to retrieve in the order.
   * @param headers - Headers to pass in the request.
   * @returns The order's details.
   *
   * @example
   * sdk.admin.draftOrder.convertToOrder("order_123")
   * .then(({ order }) => {
   *   console.log(order)
   * })
   */
  convertToOrder(id, query, headers) {
    return __awaiter$G(this, void 0, void 0, function* () {
      return yield this.client.fetch(`/admin/draft-orders/${id}/convert-to-order`, {
        method: "POST",
        query,
        headers
      });
    });
  }
  /**
   * This method adds items to a draft order. It sends a request to the
   * [Add Draft Order Items](https://docs.medusajs.com/api/admin#draft-orders_postdraftordersidedititems) API route.
   *
   * @param id - The draft order's ID.
   * @param body - The data to add the items to the draft order.
   * @param headers - Headers to pass in the request.
   * @returns The draft order preview's details.
   *
   * @example
   * sdk.admin.draftOrder.addItems("order_123", {
   *   items: [
   *     {
   *       variant_id: "variant_123",
   *       quantity: 1,
   *     },
   *   ],
   * })
   * .then(({ draft_order_preview }) => {
   *   console.log(draft_order_preview)
   * })
   */
  addItems(id, body, headers) {
    return __awaiter$G(this, void 0, void 0, function* () {
      return yield this.client.fetch(`/admin/draft-orders/${id}/edit/items`, {
        method: "POST",
        body,
        headers
      });
    });
  }
  /**
   * This method updates an item that is part of an action in a draft order. It sends a request to the
   * [Update Draft Order Item](https://docs.medusajs.com/api/admin#draft-orders_postdraftordersidedititemsaction_id) API route.
   *
   * @param id - The draft order's ID.
   * @param actionId - The action ID.
   * @param body - The data to update the item.
   * @param headers - Headers to pass in the request.
   * @returns The draft order preview's details.
   *
   * @example
   * sdk.admin.draftOrder.updateActionItem("order_123", "action_123", {
   *   quantity: 2,
   * })
   * .then(({ draft_order_preview }) => {
   *   console.log(draft_order_preview)
   * })
   */
  updateActionItem(id, actionId, body, headers) {
    return __awaiter$G(this, void 0, void 0, function* () {
      return yield this.client.fetch(`/admin/draft-orders/${id}/edit/items/${actionId}`, {
        method: "POST",
        body,
        headers
      });
    });
  }
  /**
   * This method removes an item that is part of an action in a draft order. It sends a request to the
   * [Remove Draft Order Item](https://docs.medusajs.com/api/admin#draft-orders_deletedraftordersidedititemsaction_id) API route.
   *
   * @param id - The draft order's ID.
   * @param actionId - The action ID.
   * @param headers - Headers to pass in the request.
   * @returns The draft order preview's details.
   *
   * @example
   * sdk.admin.draftOrder.removeActionItem("order_123", "action_123")
   * .then(({ draft_order_preview }) => {
   *   console.log(draft_order_preview)
   * })
   */
  removeActionItem(id, actionId, headers) {
    return __awaiter$G(this, void 0, void 0, function* () {
      return yield this.client.fetch(`/admin/draft-orders/${id}/edit/items/${actionId}`, {
        method: "DELETE",
        headers
      });
    });
  }
  /**
   * This method updates an item in a draft order. It sends a request to the
   * [Update Draft Order Item](https://docs.medusajs.com/api/admin#draft-orders_postdraftordersidedititemsitemitem_id) API route.
   *
   * @param id - The draft order's ID.
   * @param itemId - The item ID.
   * @param body - The data to update the item.
   * @param headers - Headers to pass in the request.
   * @returns The draft order preview's details.
   *
   * @example
   * sdk.admin.draftOrder.updateItem("order_123", "item_123", {
   *   quantity: 2,
   * })
   * .then(({ draft_order_preview }) => {
   *   console.log(draft_order_preview)
   * })
   */
  updateItem(id, itemId, body, headers) {
    return __awaiter$G(this, void 0, void 0, function* () {
      return yield this.client.fetch(`/admin/draft-orders/${id}/edit/items/item/${itemId}`, {
        method: "POST",
        body,
        headers
      });
    });
  }
  /**
   * This method adds promotions to a draft order. It sends a request to the
   * [Add Draft Order Promotions](https://docs.medusajs.com/api/admin#draft-orders_postdraftordersideditpromotions) API route.
   *
   * @param id - The draft order's ID.
   * @param body - The data to add the promotions to the draft order.
   * @param headers - Headers to pass in the request.
   * @returns The draft order preview's details.
   *
   * @example
   * sdk.admin.draftOrder.addPromotions("order_123", {
   *   promo_codes: ["PROMO_CODE_1", "PROMO_CODE_2"],
   * })
   * .then(({ draft_order_preview }) => {
   *   console.log(draft_order_preview)
   * })
   */
  addPromotions(id, body, headers) {
    return __awaiter$G(this, void 0, void 0, function* () {
      return yield this.client.fetch(`/admin/draft-orders/${id}/edit/promotions`, {
        method: "POST",
        body,
        headers
      });
    });
  }
  /**
   * This method removes promotions from a draft order. It sends a request to the
   * [Remove Draft Order Promotions](https://docs.medusajs.com/api/admin#draft-orders_deletedraftordersideditpromotions) API route.
   *
   * @param id - The draft order's ID.
   * @param body - The data to remove the promotions from the draft order.
   * @param headers - Headers to pass in the request.
   * @returns The draft order preview's details.
   *
   * @example
   * sdk.admin.draftOrder.removePromotions("order_123", {
   *   promo_codes: ["PROMO_CODE_1", "PROMO_CODE_2"],
   * })
   */
  removePromotions(id, body, headers) {
    return __awaiter$G(this, void 0, void 0, function* () {
      return yield this.client.fetch(`/admin/draft-orders/${id}/edit/promotions`, {
        method: "DELETE",
        body,
        headers
      });
    });
  }
  /**
   * This method adds a shipping method to a draft order. It sends a request to the
   * [Add Draft Order Shipping Method](https://docs.medusajs.com/api/admin#draft-orders_postdraftordersideditshippingmethods) API route.
   *
   * @param id - The draft order's ID.
   * @param body - The data to add the shipping method to the draft order.
   * @param headers - Headers to pass in the request.
   * @returns The draft order preview's details.
   *
   * @example
   * sdk.admin.draftOrder.addShippingMethod("order_123", {
   *   shipping_option_id: "shipping_option_123",
   * })
   * .then(({ draft_order_preview }) => {
   *   console.log(draft_order_preview)
   * })
   */
  addShippingMethod(id, body, headers) {
    return __awaiter$G(this, void 0, void 0, function* () {
      return yield this.client.fetch(`/admin/draft-orders/${id}/edit/shipping-methods`, {
        method: "POST",
        body,
        headers
      });
    });
  }
  /**
   * This method updates a shipping method in a draft order. It sends a request to the
   * [Update Draft Order Shipping Method](https://docs.medusajs.com/api/admin#draft-orders_postdraftordersideditshippingmethodsaction_id) API route.
   *
   * @param id - The draft order's ID.
   * @param actionId - The action ID.
   * @param body - The data to update the shipping method.
   * @param headers - Headers to pass in the request.
   * @returns The draft order preview's details.
   *
   * @example
   * sdk.admin.draftOrder.updateShippingMethod("order_123", "action_123", {
   *   shipping_option_id: "shipping_option_123",
   * })
   * .then(({ draft_order_preview }) => {
   *   console.log(draft_order_preview)
   * })
   */
  updateActionShippingMethod(id, actionId, body, headers) {
    return __awaiter$G(this, void 0, void 0, function* () {
      return yield this.client.fetch(`/admin/draft-orders/${id}/edit/shipping-methods/${actionId}`, {
        method: "POST",
        body,
        headers
      });
    });
  }
  /**
   * This method removes a shipping method from a draft order. It sends a request to the
   * [Remove Draft Order Shipping Method](https://docs.medusajs.com/api/admin#draft-orders_deletedraftordersideditshippingmethodsaction_id) API route.
   *
   * @param id - The draft order's ID.
   * @param actionId - The action ID.
   * @param headers - Headers to pass in the request.
   * @returns The draft order preview's details.
   *
   * @example
   * sdk.admin.draftOrder.removeShippingMethod("order_123", "action_123")
   * .then(({ draft_order_preview }) => {
   *   console.log(draft_order_preview)
   * })
   */
  removeActionShippingMethod(id, actionId, headers) {
    return __awaiter$G(this, void 0, void 0, function* () {
      return yield this.client.fetch(`/admin/draft-orders/${id}/edit/shipping-methods/${actionId}`, {
        method: "DELETE",
        headers
      });
    });
  }
  /**
   * This method removes a shipping method from an edited draft order. It sends a request to the
   * [Remove Draft Order Shipping Method](https://docs.medusajs.com/api/admin#draft-orders_deletedraftordersideditshippingmethodsmethodmethod_id) API route.
   *
   * @param id - The draft order's ID.
   * @param shippingMethodId - The shipping method's ID.
   * @param headers - Headers to pass in the request.
   * @returns The draft order preview's details.
   *
   * @example
   * sdk.admin.draftOrder.removeShippingMethod(
   *   "order_123",
   *   "shipping_method_123"
   * )
   * .then(({ draft_order_preview }) => {
   *   console.log(draft_order_preview)
   * })
   */
  removeShippingMethod(id, shippingMethodId, headers) {
    return __awaiter$G(this, void 0, void 0, function* () {
      return yield this.client.fetch(`/admin/draft-orders/${id}/edit/shipping-methods/method/${shippingMethodId}`, {
        method: "DELETE",
        headers
      });
    });
  }
  /**
   * This method updates a shipping method in a draft order. It sends a request to the
   * [Update Draft Order Shipping Method](https://docs.medusajs.com/api/admin#draft-orders_postdraftordersideditshippingmethodsmethodmethod_id) API route.
   *
   * @param id - The draft order's ID.
   * @param methodId - The shipping method's ID.
   * @param body - The data to update the shipping method.
   * @param headers - Headers to pass in the request.
   * @returns The draft order preview's details.
   *
   * @example
   * sdk.admin.draftOrder.updateShippingMethod("order_123", "sm_123", {
   *  shipping_option_id: "so_123",
   * })
   * .then(({ draft_order_preview }) => {
   *   console.log(draft_order_preview)
   * })
   */
  updateShippingMethod(id, methodId, body, headers) {
    return __awaiter$G(this, void 0, void 0, function* () {
      return yield this.client.fetch(`/admin/draft-orders/${id}/edit/shipping-methods/method/${methodId}`, {
        method: "POST",
        body,
        headers
      });
    });
  }
  /**
   * This method begins an edit to a draft order. It sends a request to the
   * [Begin Draft Order Edit](https://docs.medusajs.com/api/admin#draft-orders_postdraftordersidedit) API route.
   *
   * @param id - The draft order's ID.
   * @param headers - Headers to pass in the request.
   *
   * @example
   * sdk.admin.draftOrder.beginEdit("order_123")
   * .then(({ draft_order_preview }) => {
   *   console.log(draft_order_preview)
   * })
   */
  beginEdit(id, headers) {
    return __awaiter$G(this, void 0, void 0, function* () {
      return yield this.client.fetch(`/admin/draft-orders/${id}/edit`, {
        method: "POST",
        headers
      });
    });
  }
  /**
   * This method cancels an edit to a draft order. It sends a request to the
   * [Cancel Draft Order Edit](https://docs.medusajs.com/api/admin#draft-orders_deletedraftordersidedit) API route.
   *
   * @param id - The draft order's ID.
   * @param headers - Headers to pass in the request.
   * @returns The cancelation's details.
   *
   * @example
   * sdk.admin.draftOrder.cancelEdit("order_123")
   * .then(({ id, object, deleted }) => {
   *   console.log(id, object, deleted)
   * })
   */
  cancelEdit(id, headers) {
    return __awaiter$G(this, void 0, void 0, function* () {
      return yield this.client.fetch(`/admin/draft-orders/${id}/edit`, {
        method: "DELETE",
        headers
      });
    });
  }
  /**
   * This method requests an edit to a draft order. It sends a request to the
   * [Request Draft Order Edit](https://docs.medusajs.com/api/admin#draft-orders_postdraftordersideditrequest) API route.
   *
   * @param id - The draft order's ID.
   * @param headers - Headers to pass in the request.
   * @returns The draft order preview's details.
   *
   * @example
   * sdk.admin.draftOrder.requestEdit("order_123")
   * .then(({ draft_order_preview }) => {
   *   console.log(draft_order_preview)
   * })
   */
  requestEdit(id, headers) {
    return __awaiter$G(this, void 0, void 0, function* () {
      return yield this.client.fetch(`/admin/draft-orders/${id}/edit/request`, {
        method: "POST",
        headers
      });
    });
  }
  /**
   * This method confirms an edit to a draft order. It sends a request to the
   * [Confirm Draft Order Edit](https://docs.medusajs.com/api/admin#draft-orders_postdraftordersideditconfirm) API route.
   *
   * @param id - The draft order's ID.
   * @param headers - Headers to pass in the request.
   * @returns The draft order preview's details.
   *
   * @example
   * sdk.admin.draftOrder.confirmEdit("order_123")
   * .then(({ draft_order_preview }) => {
   *   console.log(draft_order_preview)
   * })
   */
  confirmEdit(id, headers) {
    return __awaiter$G(this, void 0, void 0, function* () {
      return yield this.client.fetch(`/admin/draft-orders/${id}/edit/confirm`, {
        method: "POST",
        headers
      });
    });
  }
}
var __awaiter$F = function(thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function(resolve) {
      resolve(value);
    });
  }
  return new (P || (P = Promise))(function(resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }
    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }
    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};
class Exchange {
  /**
   * @ignore
   */
  constructor(client) {
    this.client = client;
  }
  /**
   * This method retrieves a paginated list of exchanges. It sends a request to the
   * [List Exchanges](https://docs.medusajs.com/api/admin#exchanges_getexchanges)
   * API route.
   *
   * @param query - Filters and pagination configurations.
   * @param headers - Headers to pass in the request.
   * @returns The paginated list of exchanges.
   *
   * @example
   * To retrieve the list of exchanges:
   *
   * ```ts
   * sdk.admin.exchange.list()
   * .then(({ exchanges, count, limit, offset }) => {
   *   console.log(exchanges)
   * })
   * ```
   *
   * To configure the pagination, pass the `limit` and `offset` query parameters.
   *
   * For example, to retrieve only 10 items and skip 10 items:
   *
   * ```ts
   * sdk.admin.exchange.list({
   *   limit: 10,
   *   offset: 10
   * })
   * .then(({ exchanges, count, limit, offset }) => {
   *   console.log(exchanges)
   * })
   * ```
   *
   * Using the `fields` query parameter, you can specify the fields and relations to retrieve
   * in each exchange:
   *
   * ```ts
   * sdk.admin.exchange.list({
   *   fields: "id,*order"
   * })
   * .then(({ exchanges, count, limit, offset }) => {
   *   console.log(exchanges)
   * })
   * ```
   *
   * Learn more about the `fields` property in the [API reference](https://docs.medusajs.com/api/store#select-fields-and-relations).
   */
  list(query, headers) {
    return __awaiter$F(this, void 0, void 0, function* () {
      return yield this.client.fetch(`/admin/exchanges`, {
        query,
        headers
      });
    });
  }
  /**
   * This method retrieves an exchange by its ID. It sends a request to the
   * [Get Exchange](https://docs.medusajs.com/api/admin#exchanges_getexchangesid)
   * API route.
   *
   * @param id - The exchange's ID.
   * @param query - Configure the fields to retrieve in the exchange.
   * @param headers - Headers to pass in the request.
   * @returns The exchange's details.
   *
   * @example
   * To retrieve an exchange by its ID:
   *
   * ```ts
   * sdk.admin.exchange.retrieve("exchange_123")
   * .then(({ exchange }) => {
   *   console.log(exchange)
   * })
   * ```
   *
   * To specify the fields and relations to retrieve:
   *
   * ```ts
   * sdk.admin.exchange.retrieve("exchange_123", {
   *   fields: "id,*order"
   * })
   * .then(({ exchange }) => {
   *   console.log(exchange)
   * })
   * ```
   *
   * Learn more about the `fields` property in the [API reference](https://docs.medusajs.com/api/store#select-fields-and-relations).
   */
  retrieve(id, query, headers) {
    return __awaiter$F(this, void 0, void 0, function* () {
      return yield this.client.fetch(`/admin/exchanges/${id}`, {
        query,
        headers
      });
    });
  }
  /**
   * This method creates an admin exchange. It sends a request to the
   * [Create Exchange](https://docs.medusajs.com/api/admin#exchanges_postexchanges) API route.
   *
   * @param body - The exchange's details.
   * @param query - Configure the fields to retrieve in the exchange.
   * @param headers - Headers to pass in the request.
   * @returns The exchange's details.
   *
   * @example
   * sdk.admin.exchange.create({
   *   order_id: "order_123"
   * })
   * .then(({ exchange }) => {
   *   console.log(exchange)
   * })
   */
  create(body, query, headers) {
    return __awaiter$F(this, void 0, void 0, function* () {
      return yield this.client.fetch(`/admin/exchanges`, {
        method: "POST",
        headers,
        body,
        query
      });
    });
  }
  /**
   * This method cancels an exchange. It sends a request to the
   * [Cancel Exchange](https://docs.medusajs.com/api/admin#exchanges_postexchangesidcancel) API route.
   *
   * @param id - The exchange's ID.
   * @param query - Configure the fields to retrieve in the exchange.
   * @param headers - Headers to pass in the request.
   * @returns The exchange's details.
   *
   * @example
   * sdk.admin.exchange.cancel("exchange_123")
   * .then(({ exchange }) => {
   *   console.log(exchange)
   * })
   */
  cancel(id, query, headers) {
    return __awaiter$F(this, void 0, void 0, function* () {
      return yield this.client.fetch(`/admin/exchanges/${id}/cancel`, {
        method: "POST",
        headers,
        query
      });
    });
  }
  /**
   * This method adds inbound (or return) items to an exchange. These inbound items will
   * have the action `RETURN_ITEM`.
   *
   * This method sends a request to the [Add Inbound Items](https://docs.medusajs.com/api/admin#exchanges_postexchangesidinbounditems)
   * API route.
   *
   * @param id - The exchange's ID.
   * @param body - The items to add.
   * @param query - Configure the fields to retrieve in the return.
   * @param headers - Headers to pass in the request.
   * @returns The details of the return associated with the exchange, with a preview of the order when the exchange is applied.
   *
   * @example
   * sdk.admin.exchange.addInboundItems("exchange_123", {
   *   items: [{
   *     id: "orli_123",
   *     quantity: 1
   *   }]
   * })
   * .then(({ return: returnData }) => {
   *   console.log(returnData)
   * })
   */
  addInboundItems(id, body, query, headers) {
    return __awaiter$F(this, void 0, void 0, function* () {
      return yield this.client.fetch(`/admin/exchanges/${id}/inbound/items`, {
        method: "POST",
        headers,
        body,
        query
      });
    });
  }
  /**
   * This method updates an inbound (or return) item from an exchange using the ID of
   * the item's `RETURN_ITEM` action.
   *
   * Every item has an `actions` property, whose value is an array of actions. You can
   * check the action's name using its `action` property, and use the value of the `id` property.
   *
   * This method sends a request to the [Update Inbound Item](https://docs.medusajs.com/api/admin#exchanges_postexchangesidinbounditemsaction_id)
   * API route.
   *
   * @param id - The exchange's ID.
   * @param actionId - The id of the return item's `RETURN_ITEM` action.
   * @param body - The details to update.
   * @param query - Configure the fields to retrieve in the return.
   * @param headers - Headers to pass in the request.
   * @returns The details of the return associated with the exchange, with a preview of the order when the exchange is applied.
   *
   * @example
   * sdk.admin.exchange.updateInboundItem(
   *   "exchange_123",
   *   "ordchact_123",
   *   {
   *     quantity: 1
   *   }
   * )
   * .then(({ return: returnData }) => {
   *   console.log(returnData)
   * })
   */
  updateInboundItem(id, actionId, body, query, headers) {
    return __awaiter$F(this, void 0, void 0, function* () {
      return yield this.client.fetch(`/admin/exchanges/${id}/inbound/items/${actionId}`, {
        method: "POST",
        headers,
        body,
        query
      });
    });
  }
  /**
   * This method removes an inbound (or return) item from an exchange using the ID of the
   * item's `RETURN_ITEM` action.
   *
   * Every item has an `actions` property, whose value is an array of actions.
   * You can check the action's name using its `action` property, and use the value of the `id` property.
   *
   * This method sends a request to the [Remove Inbound Item](https://docs.medusajs.com/api/admin#exchanges_deleteexchangesidinbounditemsaction_id)
   * API route.
   *
   * @param id - The exchange's ID.
   * @param actionId - The id of the return item's `RETURN_ITEM` action.
   * @param query - Configure the fields to retrieve in the return.
   * @param headers - Headers to pass in the request.
   * @returns The details of the return associated with the exchange, with a preview of the order when the exchange is applied.
   *
   * @example
   * sdk.admin.exchange.removeInboundItem(
   *   "exchange_123",
   *   "ordchact_123",
   * )
   * .then(({ return: returnData }) => {
   *   console.log(returnData)
   * })
   */
  removeInboundItem(id, actionId, query, headers) {
    return __awaiter$F(this, void 0, void 0, function* () {
      return yield this.client.fetch(`/admin/exchanges/${id}/inbound/items/${actionId}`, {
        method: "DELETE",
        headers,
        query
      });
    });
  }
  /**
   * This method adds an inbound (or return) shipping method to an exchange.
   * The inbound shipping method will have a `SHIPPING_ADD` action.
   *
   * This method sends a request to the [Add Inbound Shipping](https://docs.medusajs.com/api/admin#exchanges_postexchangesidinboundshippingmethod)
   * API route.
   *
   * This method sends a request to the [Add Inbound Shipping](https://docs.medusajs.com/api/admin#exchanges_postexchangesidinboundshippingmethod)
   * API route.
   *
   * @param id - The exchange's ID.
   * @param body - The shipping method's details.
   * @param query - Configure the fields to retrieve in the return.
   * @param headers - Headers to pass in the request.
   * @returns The details of the return associated with the exchange, with a preview of the order when the exchange is applied.
   *
   * @example
   * sdk.admin.exchange.addInboundShipping("exchange_123", {
   *   shipping_option_id: "so_123"
   * })
   * .then(({ return: returnData }) => {
   *   console.log(returnData)
   * })
   */
  addInboundShipping(id, body, query, headers) {
    return __awaiter$F(this, void 0, void 0, function* () {
      return yield this.client.fetch(`/admin/exchanges/${id}/inbound/shipping-method`, {
        method: "POST",
        headers,
        body,
        query
      });
    });
  }
  /**
   * This method updates the shipping method for returning items in the exchange using the ID
   * of the method's `SHIPPING_ADD` action.
   *
   * Every shipping method has an `actions` property, whose value is an array of actions.
   * You can check the action's name using its `action` property, and use the value of the `id` property.
   *
   * This method sends a request to the [Update Inbound Shipping](https://docs.medusajs.com/api/admin#exchanges_postexchangesidinboundshippingmethodaction_id)
   * API route.
   *
   * @param id - The exchange's ID.
   * @param actionId - The id of the shipping method's `SHIPPING_ADD` action.
   * @param body - The details to update.
   * @param query - Configure the fields to retrieve in the return.
   * @param headers - Headers to pass in the request.
   * @returns The details of the return associated with the exchange, with a preview of the order when the exchange is applied.
   *
   * @example
   * sdk.admin.exchange.updateInboundShipping(
   *   "exchange_123",
   *   "ordchact_123",
   *    {
   *     custom_amount: 10
   *   }
   * )
   * .then(({ return: returnData }) => {
   *   console.log(returnData)
   * })
   */
  updateInboundShipping(id, actionId, body, query, headers) {
    return __awaiter$F(this, void 0, void 0, function* () {
      return yield this.client.fetch(`/admin/exchanges/${id}/inbound/shipping-method/${actionId}`, {
        method: "POST",
        headers,
        body,
        query
      });
    });
  }
  /**
   * This method removes the shipping method for returning items in the exchange using the ID
   * of the method's `SHIPPING_ADD` action.
   *
   * Every shipping method has an `actions` property, whose value is an array of actions.
   * You can check the action's name using its `action` property, and use the value of the `id` property.
   *
   * This method sends a request to the [Remove Inbound Shipping](https://docs.medusajs.com/api/admin#exchanges_deleteexchangesidinboundshippingmethodaction_id)
   * API route.
   *
   * @param id - The exchange's ID.
   * @param actionId - The id of the shipping method's `SHIPPING_ADD` action.
   * @param query - Configure the fields to retrieve in the return.
   * @param headers - Headers to pass in the request.
   * @returns The details of the return associated with the exchange, with a preview of the order when the exchange is applied.
   *
   * @example
   * sdk.admin.exchange.deleteInboundShipping(
   *   "exchange_123",
   *   "ordchact_123",
   * )
   * .then(({ return: returnData }) => {
   *   console.log(returnData)
   * })
   */
  deleteInboundShipping(id, actionId, query, headers) {
    return __awaiter$F(this, void 0, void 0, function* () {
      return yield this.client.fetch(`/admin/exchanges/${id}/inbound/shipping-method/${actionId}`, {
        method: "DELETE",
        headers,
        query
      });
    });
  }
  /**
   * This method adds outbound (or new) items to an exchange.
   * These outbound items will have the action `ITEM_ADD`.
   *
   * This method sends a request to the [Add Outbound Items](https://docs.medusajs.com/api/admin#exchanges_postexchangesidoutbounditems)
   * API route.
   *
   * @param id - The exchange's ID.
   * @param body - The items to add.
   * @param query - Configure the fields to retrieve in the exchange.
   * @param headers - Headers to pass in the request
   * @returns The exchange's details with a preview of the order when the exchange is applied.
   *
   * @example
   * sdk.admin.exchange.addOutboundItems("exchange_123", {
   *   items: [{
   *     id: "variant_123",
   *     quantity: 1
   *   }]
   * })
   * .then(({ exchange }) => {
   *   console.log(exchange)
   * })
   */
  addOutboundItems(id, body, query, headers) {
    return __awaiter$F(this, void 0, void 0, function* () {
      return yield this.client.fetch(`/admin/exchanges/${id}/outbound/items`, {
        method: "POST",
        headers,
        body,
        query
      });
    });
  }
  /**
   * This method updates an outbound (or new) item from an exchange using the ID
   * of the item's `ITEM_ADD` action.
   *
   * Every item has an `actions` property, whose value is an array of actions.
   * You can check the action's name using its `action` property, and use the value of the `id` property.
   *
   * This method sends a request to the [Update Inbound Item](https://docs.medusajs.com/api/admin#exchanges_postexchangesidoutbounditemsaction_id)
   * API route.
   *
   * @param id - The exchange's ID.
   * @param actionId - The id of the new exchange item's `ITEM_ADD` action.
   * @param body - The item's details to update.
   * @param query - Configure the fields to retrieve in the exchange.
   * @param headers - Headers to pass in the request
   * @returns The exchange's details with a preview of the order when the exchange is applied.
   *
   * @example
   * sdk.admin.exchange.updateOutboundItem(
   *   "exchange_123",
   *   "ordchact_123",
   *   {
   *     quantity: 1
   *   }
   * )
   * .then(({ exchange }) => {
   *   console.log(exchange)
   * })
   */
  updateOutboundItem(id, actionId, body, query, headers) {
    return __awaiter$F(this, void 0, void 0, function* () {
      return yield this.client.fetch(`/admin/exchanges/${id}/outbound/items/${actionId}`, {
        method: "POST",
        headers,
        body,
        query
      });
    });
  }
  /**
   * This method removes an outbound (or new) item from an exchange using the ID
   * of the item's `ITEM_ADD` action.
   *
   * Every item has an `actions` property, whose value is an array of actions.
   * You can check the action's name using its `action` property, and use the value of the `id` property.
   *
   * This method sends a request to the [Update Outbound Item](https://docs.medusajs.com/api/admin#exchanges_deleteexchangesidoutbounditemsaction_id)
   * API route.
   *
   * @param id - The exchange's ID.
   * @param actionId - The id of the new exchange item's `ITEM_ADD` action.
   * @param query - Configure the fields to retrieve in the exchange.
   * @param headers - Headers to pass in the request
   * @returns The exchange's details with a preview of the order when the exchange is applied.
   *
   * @example
   * sdk.admin.exchange.removeOutboundItem(
   *   "exchange_123",
   *   "ordchact_123",
   * )
   * .then(({ exchange }) => {
   *   console.log(exchange)
   * })
   */
  removeOutboundItem(id, actionId, query, headers) {
    return __awaiter$F(this, void 0, void 0, function* () {
      return yield this.client.fetch(`/admin/exchanges/${id}/outbound/items/${actionId}`, {
        method: "DELETE",
        headers,
        query
      });
    });
  }
  /**
   * This method adds an outbound shipping method to an exchange. The outbound shipping method
   * will have a `SHIPPING_ADD` action.
   *
   * This method sends a request to the [Add Outbound Shipping](https://docs.medusajs.com/api/admin#exchanges_postexchangesidoutboundshippingmethod)
   * API route.
   *
   * @param id - The exchange's ID.
   * @param body - The shipping method's details.
   * @param query - Configure the fields to retrieve in the exchange.
   * @param headers - Headers to pass in the request
   * @returns The exchange's details with a preview of the order when the exchange is applied.
   *
   * @example
   * sdk.admin.exchange.addOutboundShipping("exchange_123", {
   *   shipping_option_id: "so_123"
   * })
   * .then(({ exchange }) => {
   *   console.log(exchange)
   * })
   */
  addOutboundShipping(id, body, query, headers) {
    return __awaiter$F(this, void 0, void 0, function* () {
      return yield this.client.fetch(`/admin/exchanges/${id}/outbound/shipping-method`, {
        method: "POST",
        headers,
        body,
        query
      });
    });
  }
  /**
   * This method updates the shipping method for delivering outbound items in the exchange using
   * the ID of the method's `SHIPPING_ADD` action.
   *
   * Every shipping method has an `actions` property, whose value is an array of actions.
   * You can check the action's name using its `action` property, and use the value of the `id` property.
   *
   * This method sends a request to the [Update Outbound Shipping](https://docs.medusajs.com/api/admin#exchanges_postexchangesidoutboundshippingmethodaction_id)
   * API route.
   *
   * @param id - The exchange's ID.
   * @param actionId - The id of the shipping method's `SHIPPING_ADD` action.
   * @param body - The details to update.
   * @param query - Configure the fields to retrieve in the exchange.
   * @param headers - Headers to pass in the request
   * @returns The exchange's details with a preview of the order when the exchange is applied.
   *
   * @example
   * sdk.admin.exchange.updateOutboundShipping(
   *   "exchange_123",
   *   "ordchact_123",
   *   {
   *     custom_amount: 10
   *   }
   * )
   * .then(({ exchange }) => {
   *   console.log(exchange)
   * })
   */
  updateOutboundShipping(id, actionId, body, query, headers) {
    return __awaiter$F(this, void 0, void 0, function* () {
      return yield this.client.fetch(`/admin/exchanges/${id}/outbound/shipping-method/${actionId}`, {
        method: "POST",
        headers,
        body,
        query
      });
    });
  }
  /**
   * This method removes the shipping method for delivering outbound items in the exchange using
   * the ID of the method's `SHIPPING_ADD` action.
   *
   * Every shipping method has an `actions` property, whose value is an array of actions.
   * You can check the action's name using its `action` property, and use the value of the `id` property.
   *
   * This method sends a request to the [Remove Outbound Shipping](https://docs.medusajs.com/api/admin#exchanges_deleteexchangesidoutboundshippingmethodaction_id)
   * API route.
   *
   * @param id - The exchange's ID.
   * @param actionId - The id of the shipping method's `SHIPPING_ADD` action.
   * @param query - Configure the fields to retrieve in the exchange.
   * @param headers - Headers to pass in the request
   * @returns The exchange's details with a preview of the order when the exchange is applied.
   *
   * @example
   * sdk.admin.exchange.deleteOutboundShipping(
   *   "exchange_123",
   *   "ordchact_123",
   * )
   * .then(({ exchange }) => {
   *   console.log(exchange)
   * })
   */
  deleteOutboundShipping(id, actionId, query, headers) {
    return __awaiter$F(this, void 0, void 0, function* () {
      return yield this.client.fetch(`/admin/exchanges/${id}/outbound/shipping-method/${actionId}`, {
        method: "DELETE",
        headers,
        query
      });
    });
  }
  /**
   * This method confirms an exchange request, applying its changes on the associated order.
   *
   * This method sends a request to the [Confirm Exchange](https://docs.medusajs.com/api/admin#exchanges_postexchangesidrequest)
   * API route.
   *
   * @param id - The exchange's ID.
   * @param body - The confirmation's details.
   * @param query - Configure the fields to retrieve in the exchange.
   * @param headers - Headers to pass in the request
   * @returns The exchange and associated return's details with a preview of the order when the exchange is applied.
   *
   * @example
   * sdk.admin.exchange.request("exchange_123", {})
   * .then(({ exchange }) => {
   *   console.log(exchange)
   * })
   */
  request(id, body, query, headers) {
    return __awaiter$F(this, void 0, void 0, function* () {
      return yield this.client.fetch(`/admin/exchanges/${id}/request`, {
        method: "POST",
        headers,
        body,
        query
      });
    });
  }
  /**
   * This method cancels an exchange request. It sends a request to the
   * [Cancel Exchange Request](https://docs.medusajs.com/api/admin#exchanges_deleteexchangesidrequest)
   * API route.
   *
   * @param id - The exchange's ID.
   * @param query - Configure the fields to retrieve in the exchange.
   * @param headers - Headers to pass in the request
   * @returns The cancelation's details.
   *
   * @example
   * sdk.admin.exchange.cancel("exchange_123")
   * .then(({ deleted }) => {
   *   console.log(deleted)
   * })
   */
  cancelRequest(id, query, headers) {
    return __awaiter$F(this, void 0, void 0, function* () {
      return yield this.client.fetch(`/admin/exchanges/${id}/request`, {
        method: "DELETE",
        headers,
        query
      });
    });
  }
}
var __awaiter$E = function(thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function(resolve) {
      resolve(value);
    });
  }
  return new (P || (P = Promise))(function(resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }
    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }
    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};
class Fulfillment {
  /**
   * @ignore
   */
  constructor(client) {
    this.client = client;
  }
  /**
   * This method creates a fulfillment. It sends a request to the
   * [Create Fulfillment](https://docs.medusajs.com/api/admin#fulfillments_postfulfillments)
   * API route.
   *
   * @param body - The fulfillment's details.
   * @param query - Configure the fields to retrieve in the fulfillment.
   * @param headers - Headers to pass in the request.
   * @returns The fulfillment's details.
   *
   * @example
   * sdk.admin.fulfillment.create({
   *   location_id: "sloc_123",
   *   provider_id: "my_fulfillment",
   *   delivery_address: {
   *     country_code: "us"
   *   },
   *   items: [
   *     {
   *       title: "Shirt",
   *       sku: "SHIRT",
   *       quantity: 1,
   *       barcode: "123"
   *     }
   *   ],
   *   labels: [],
   *   order: {},
   *   order_id: "order_123"
   * })
   * .then(({ fulfillment }) => {
   *   console.log(fulfillment)
   * })
   */
  create(body, query, headers) {
    return __awaiter$E(this, void 0, void 0, function* () {
      return yield this.client.fetch(`/admin/fulfillments`, {
        method: "POST",
        headers,
        body,
        query
      });
    });
  }
  /**
   * This method cancels a fulfillment. It sends a request to the
   * [Cancel Fulfillment](https://docs.medusajs.com/api/admin#fulfillments_postfulfillmentsidcancel)
   * API route.
   *
   * @param id - The fulfillment's ID.
   * @param query - Configure the fields to retrieve in the fulfillment.
   * @param headers - Headers to pass in the request.
   * @returns The fulfillment's details.
   *
   * @example
   * sdk.admin.fulfillment.cancel("ful_123")
   * .then(({ fulfillment }) => {
   *   console.log(fulfillment)
   * })
   */
  cancel(id, query, headers) {
    return __awaiter$E(this, void 0, void 0, function* () {
      return yield this.client.fetch(`/admin/fulfillments/${id}/cancel`, {
        method: "POST",
        body: {},
        headers,
        query
      });
    });
  }
  /**
   * This method creates a shipment for a fulfillment. It sends a request to the
   * [Create Shipment](https://docs.medusajs.com/api/admin#fulfillments_postfulfillmentsidshipment)
   * API route.
   *
   * @param id - The fulfillment's ID.
   * @param body - The shipment's details.
   * @param query - Configure the fields to retrieve in the fulfillment.
   * @param headers - Headers to pass in the request.
   * @returns The fulfillment's details.
   *
   * @example
   * sdk.admin.fulfillment.createShipment("ful_123", {
   *   labels: [
   *     {
   *       tracking_number: "123",
   *       tracking_url: "example.com",
   *       label_url: "example.com"
   *     }
   *   ]
   * })
   * .then(({ fulfillment }) => {
   *   console.log(fulfillment)
   * })
   */
  createShipment(id, body, query, headers) {
    return __awaiter$E(this, void 0, void 0, function* () {
      return yield this.client.fetch(`/admin/fulfillments/${id}/shipment`, {
        method: "POST",
        headers,
        body,
        query
      });
    });
  }
}
var __awaiter$D = function(thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function(resolve) {
      resolve(value);
    });
  }
  return new (P || (P = Promise))(function(resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }
    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }
    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};
class FulfillmentProvider {
  /**
   * @ignore
   */
  constructor(client) {
    this.client = client;
  }
  /**
   * This method retrieves a paginated list of fulfillment providers. It sends a request to the
   * [List Fulfillment Providers](https://docs.medusajs.com/api/admin#fulfillment-providers_getfulfillmentproviders)
   * API route.
   *
   * @param query - Filters and pagination configurations.
   * @param headers - Headers to pass in the request.
   * @returns The paginated list of providers.
   *
   * @example
   * To retrieve the list of fulfillment providers:
   *
   * ```ts
   * sdk.admin.fulfillmentProvider.list()
   * .then(({ fulfillment_providers, count, limit, offset }) => {
   *   console.log(fulfillment_providers)
   * })
   * ```
   *
   * To configure the pagination, pass the `limit` and `offset` query parameters.
   *
   * For example, to retrieve only 10 items and skip 10 items:
   *
   * ```ts
   * sdk.admin.fulfillmentProvider.list({
   *   limit: 10,
   *   offset: 10
   * })
   * .then(({ fulfillment_providers, count, limit, offset }) => {
   *   console.log(fulfillment_providers)
   * })
   * ```
   *
   * Using the `fields` query parameter, you can specify the fields and relations to retrieve
   * in each fulfillment provider:
   *
   * ```ts
   * sdk.admin.fulfillmentProvider.list({
   *   fields: "id"
   * })
   * .then(({ fulfillment_providers, count, limit, offset }) => {
   *   console.log(fulfillment_providers)
   * })
   * ```
   *
   * Learn more about the `fields` property in the [API reference](https://docs.medusajs.com/api/store#select-fields-and-relations).
   */
  list(query, headers) {
    return __awaiter$D(this, void 0, void 0, function* () {
      return yield this.client.fetch(`/admin/fulfillment-providers`, {
        method: "GET",
        headers,
        query
      });
    });
  }
  /**
   * This method retrieves a list of fulfillment options for a given fulfillment provider. It sends a request to the
   * [List Fulfillment Options](https://docs.medusajs.com/api/admin#fulfillment-providers_getfulfillmentprovidersidoptions)
   * API route.
   *
   * @param id - The ID of the fulfillment provider.
   * @param headers - Headers to pass in the request.
   * @returns The list of fulfillment options.
   *
   * @example
   * sdk.admin.fulfillmentProvider.listFulfillmentOptions("fp_123")
   * .then(({ fulfillment_options }) => {
   *   console.log(fulfillment_options)
   * })
   */
  listFulfillmentOptions(id, headers) {
    return __awaiter$D(this, void 0, void 0, function* () {
      return yield this.client.fetch(`/admin/fulfillment-providers/${id}/options`, {
        method: "GET",
        headers
      });
    });
  }
}
var __awaiter$C = function(thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function(resolve) {
      resolve(value);
    });
  }
  return new (P || (P = Promise))(function(resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }
    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }
    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};
class FulfillmentSet {
  /**
   * @ignore
   */
  constructor(client) {
    this.client = client;
  }
  /**
   * This method deletes a fulfillment set. It sends a request to the
   * [Delete Fulfillment Set](https://docs.medusajs.com/api/admin#fulfillment-sets_deletefulfillmentsetsid)
   * API route.
   *
   * @param id - The fulfillment set's ID.
   * @param headers - Headers to pass in the request.
   * @returns The deletion's details.
   *
   * @example
   * sdk.admin.fulfillmentSet.delete("fset_123")
   * .then(({ deleted }) => {
   *   console.log(deleted)
   * })
   */
  delete(id, headers) {
    return __awaiter$C(this, void 0, void 0, function* () {
      return yield this.client.fetch(`/admin/fulfillment-sets/${id}`, {
        method: "DELETE",
        headers
      });
    });
  }
  /**
   * This method adds a service zone to a fulfillment set. It uses the
   * [Add Service Zone](https://docs.medusajs.com/api/admin#fulfillment-sets_postfulfillmentsetsidservicezones)
   * API route.
   *
   * @param id - The fulfillment set's ID.
   * @param body - The service zone's details.
   * @param query - Configure the fields to retrieve in the fulfillment set.
   * @param headers - Headers to pass in the request.
   * @returns The fulfillment set's details.
   *
   * @example
   * sdk.admin.fulfillmentSet.createServiceZone("fset_123", {
   *   name: "Europe Service Zone",
   *   geo_zones: [{
   *     type: "country",
   *     country_code: "us"
   *   }]
   * })
   * .then(({ fulfillment_set }) => {
   *   console.log(fulfillment_set)
   * })
   */
  createServiceZone(id, body, query, headers) {
    return __awaiter$C(this, void 0, void 0, function* () {
      return yield this.client.fetch(`/admin/fulfillment-sets/${id}/service-zones`, {
        method: "POST",
        headers,
        body,
        query
      });
    });
  }
  /**
   * This method retrieves a fulfillment set's service zone's details. It sends a request to the
   * [Get Service Zone](https://docs.medusajs.com/api/admin#fulfillment-sets_getfulfillmentsetsidservicezoneszone_id)
   * API route.
   *
   * @param fulfillmentSetId - The fulfillment set's ID.
   * @param serviceZoneId - The service zone's ID.
   * @param query - Configure the fields to retrieve in the service zone.
   * @param headers - Headers to pass in the request.
   * @returns The service zone's details.
   *
   * @example
   * To retrieve a fulfillment set's service zone by its ID:
   *
   * ```ts
   * sdk.admin.fulfillmentSet.retrieveServiceZone(
   *   "fset_123",
   *   "serzo_123"
   * )
   * .then(({ service_zone }) => {
   *   console.log(service_zone)
   * })
   * ```
   *
   * To specify the fields and relations to retrieve:
   *
   * ```ts
   * sdk.admin.fulfillmentSet.retrieveServiceZone(
   *   "fset_123",
   *   "serzo_123",
   *   {
   *     fields: "id,*geo_zones"
   *   }
   * )
   * .then(({ service_zone }) => {
   *   console.log(service_zone)
   * })
   * ```
   *
   * Learn more about the `fields` property in the [API reference](https://docs.medusajs.com/api/store#select-fields-and-relations).
   */
  retrieveServiceZone(fulfillmentSetId, serviceZoneId, query, headers) {
    return __awaiter$C(this, void 0, void 0, function* () {
      return yield this.client.fetch(`/admin/fulfillment-sets/${fulfillmentSetId}/service-zones/${serviceZoneId}`, {
        method: "GET",
        headers,
        query
      });
    });
  }
  /**
   * This method updates a service zone in a fulfillment set. It sends a request to the
   * [Update Service Zone](https://docs.medusajs.com/api/admin#fulfillment-sets_postfulfillmentsetsidservicezoneszone_id)
   * API route.
   *
   * @param fulfillmentSetId - The fulfillment set's ID.
   * @param serviceZoneId - The service zone's ID.
   * @param body - The data to update in the service zone.
   * @param query - Configure the fields to retrieve in the fulfillment set.
   * @param headers - Headers to pass in the request.
   * @returns The fulfillment set's details.
   *
   * @example
   * sdk.admin.fulfillmentSet.updateServiceZone(
   *   "fset_123",
   *   "serzo_123",
   *   {
   *     name: "Europe Service Zone",
   *   }
   * )
   * .then(({ fulfillment_set }) => {
   *   console.log(fulfillment_set)
   * })
   */
  updateServiceZone(fulfillmentSetId, serviceZoneId, body, query, headers) {
    return __awaiter$C(this, void 0, void 0, function* () {
      return yield this.client.fetch(`/admin/fulfillment-sets/${fulfillmentSetId}/service-zones/${serviceZoneId}`, {
        method: "POST",
        headers,
        body,
        query
      });
    });
  }
  /**
   * This method deletes a service zone in a fulfillment set. It sends a request to the
   * [Remove Service Zone](https://docs.medusajs.com/api/admin#fulfillment-sets_deletefulfillmentsetsidservicezoneszone_id)
   * API route.
   *
   * @param fulfillmentSetId - The fulfullment set's ID.
   * @param serviceZoneId - The service zone's ID.
   * @param headers - Headers to pass in the request.
   * @returns The deletion's details.
   *
   * @example
   * sdk.admin.fulfillmentSet.deleteServiceZone(
   *   "fset_123",
   *   "serzo_123",
   * )
   * .then(({ deleted, parent: fulfillmentSet }) => {
   *   console.log(deleted, fulfillmentSet)
   * })
   */
  deleteServiceZone(fulfillmentSetId, serviceZoneId, headers) {
    return __awaiter$C(this, void 0, void 0, function* () {
      return yield this.client.fetch(`/admin/fulfillment-sets/${fulfillmentSetId}/service-zones/${serviceZoneId}`, {
        method: "DELETE",
        headers
      });
    });
  }
}
var __awaiter$B = function(thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function(resolve) {
      resolve(value);
    });
  }
  return new (P || (P = Promise))(function(resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }
    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }
    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};
class InventoryItem {
  /**
   * @ignore
   */
  constructor(client) {
    this.client = client;
  }
  /**
   * This method creates an inventory item. It sends a request to the
   * [Create Inventory Item](https://docs.medusajs.com/api/admin#inventory-items_postinventoryitems)
   * API route.
   *
   * @param body - The inventory item's details.
   * @param query - Configure the fields to retrieve in the inventory item.
   * @param headers - Headers to pass in the request.
   * @returns The inventory item's details.
   *
   * @example
   * sdk.admin.inventoryItem.create({
   *   sku: "SHIRT"
   * })
   * .then(({ inventory_item }) => {
   *   console.log(inventory_item)
   * })
   */
  create(body, query, headers) {
    return __awaiter$B(this, void 0, void 0, function* () {
      return yield this.client.fetch(`/admin/inventory-items`, {
        method: "POST",
        headers,
        body,
        query
      });
    });
  }
  /**
   * This method updates an inventory level. It sends a request to the
   * [Update Inventory Item](https://docs.medusajs.com/api/admin#inventory-items_postinventoryitemsid)
   * API route.
   *
   * @param id - The inventory item's ID.
   * @param body - The data to update.
   * @param query - Configure the fields to retrieve in the inventory item.
   * @param headers - Headers to pass in the request.
   * @returns The inventory item's details.
   *
   * @example
   * sdk.admin.inventoryItem.update("iitem_123", {
   *   sku: "SHIRT"
   * })
   * .then(({ inventory_item }) => {
   *   console.log(inventory_item)
   * })
   */
  update(id, body, query, headers) {
    return __awaiter$B(this, void 0, void 0, function* () {
      return yield this.client.fetch(`/admin/inventory-items/${id}`, {
        method: "POST",
        headers,
        body,
        query
      });
    });
  }
  /**
   * This method retrieves a paginated list of inventory items. It sends a request to the
   * [List Inventory Items](https://docs.medusajs.com/api/admin#inventory-items_getinventoryitems)
   * API route.
   *
   * @param query - Filters and pagination configurations.
   * @param headers - Headers to pass in the request.
   * @returns The paginated list of inventory items.
   *
   * @example
   * To retrieve the list of inventory items:
   *
   * ```ts
   * sdk.admin.inventoryItem.list()
   * .then(({ inventory_items, count, limit, offset }) => {
   *   console.log(inventory_items)
   * })
   * ```
   *
   * To configure the pagination, pass the `limit` and `offset` query parameters.
   *
   * For example, to retrieve only 10 items and skip 10 items:
   *
   * ```ts
   * sdk.admin.inventoryItem.list({
   *   limit: 10,
   *   offset: 10
   * })
   * .then(({ inventory_items, count, limit, offset }) => {
   *   console.log(inventory_items)
   * })
   * ```
   *
   * Using the `fields` query parameter, you can specify the fields and relations to retrieve
   * in each inventory item:
   *
   * ```ts
   * sdk.admin.inventoryItem.list({
   *   fields: "id,*location_levels"
   * })
   * .then(({ inventory_items, count, limit, offset }) => {
   *   console.log(inventory_items)
   * })
   * ```
   *
   * Learn more about the `fields` property in the [API reference](https://docs.medusajs.com/api/store#select-fields-and-relations).
   */
  list(query, headers) {
    return __awaiter$B(this, void 0, void 0, function* () {
      return yield this.client.fetch(`/admin/inventory-items`, {
        query,
        headers
      });
    });
  }
  /**
   * This method retrieves an inventory item by its ID. It sends a request to the
   * [Get Inventory Item](https://docs.medusajs.com/api/admin#inventory-items_getinventoryitemsid) API route.
   *
   * @param id - The inventory item's ID.
   * @param query - Configure the fields to retrieve in the inventory item.
   * @param headers - Headers to pass in the request
   * @returns The inventory item's details.
   *
   * @example
   * To retrieve an inventory item by its ID:
   *
   * ```ts
   * sdk.admin.inventoryItem.retrieve("iitem_123")
   * .then(({ inventory_item }) => {
   *   console.log(inventory_item)
   * })
   * ```
   *
   * To specify the fields and relations to retrieve:
   *
   * ```ts
   * sdk.admin.inventoryItem.retrieve("iitem_123", {
   *   fields: "id,*location_levels"
   * })
   * .then(({ inventory_item }) => {
   *   console.log(inventory_item)
   * })
   * ```
   *
   * Learn more about the `fields` property in the [API reference](https://docs.medusajs.com/api/store#select-fields-and-relations).
   */
  retrieve(id, query, headers) {
    return __awaiter$B(this, void 0, void 0, function* () {
      return yield this.client.fetch(`/admin/inventory-items/${id}`, {
        query,
        headers
      });
    });
  }
  /**
   * This method deletes an inventory item. This sends a request to the
   * [Delete Inventory Item](https://docs.medusajs.com/api/admin#inventory-items_deleteinventoryitemsid)
   * API route.
   *
   * @param id - The inventory item's ID.
   * @param headers - Headers to pass in the request
   * @returns The deletion's details.
   *
   * @example
   * sdk.admin.inventoryItem.delete("iitem_123")
   * .then(({ deleted }) => {
   *   console.log(deleted)
   * })
   */
  delete(id, headers) {
    return __awaiter$B(this, void 0, void 0, function* () {
      return yield this.client.fetch(`/admin/inventory-items/${id}`, {
        method: "DELETE",
        headers
      });
    });
  }
  /**
   * This method retrieves a paginated list of inventory levels that belong to an inventory item.
   * It sends a request to the [List Inventory Items](https://docs.medusajs.com/api/admin#inventory-items_getinventoryitems)
   * API route.
   *
   * @param id - The inventory item's ID.
   * @param query - Filters and pagination configurations.
   * @param headers - Headers to pass in the request.
   * @returns The paginated list of inventory levels.
   *
   * @example
   * To retrieve the list of inventory levels:
   *
   * ```ts
   * sdk.admin.inventoryItem.listLevels("iitem_123")
   * .then(({ inventory_levels, count, limit, offset }) => {
   *   console.log(inventory_levels)
   * })
   * ```
   *
   * To configure the pagination, pass the `limit` and `offset` query parameters.
   *
   * For example, to retrieve only 10 items and skip 10 items:
   *
   * ```ts
   * sdk.admin.inventoryItem.listLevels("iitem_123", {
   *   limit: 10,
   *   offset: 10
   * })
   * .then(({ inventory_levels, count, limit, offset }) => {
   *   console.log(inventory_levels)
   * })
   * ```
   *
   * Using the `fields` query parameter, you can specify the fields and relations to retrieve
   * in each inventory level:
   *
   * ```ts
   * sdk.admin.inventoryItem.listLevels("iitem_123", {
   *   fields: "id,*inventory_item"
   * })
   * .then(({ inventory_levels, count, limit, offset }) => {
   *   console.log(inventory_levels)
   * })
   * ```
   *
   * Learn more about the `fields` property in the [API reference](https://docs.medusajs.com/api/store#select-fields-and-relations).
   */
  listLevels(id, query, headers) {
    return __awaiter$B(this, void 0, void 0, function* () {
      return yield this.client.fetch(`/admin/inventory-items/${id}/location-levels`, {
        query,
        headers
      });
    });
  }
  /**
   * This method updates the inventory level of the specified inventory item and
   * stock location.
   *
   * This method sends a request to the
   * [Update Inventory Level](https://docs.medusajs.com/api/admin#inventory-items_postinventoryitemsidlocationlevelslocation_id)
   * API route.
   *
   * @param id - The inventory item's ID.
   * @param locationId - The stock location's ID.
   * @param body - The details to update.
   * @param query - Configure the fields to retrieve in the inventory item.
   * @param headers - Headers to pass in the request
   * @returns The inventory item's details.
   *
   * @example
   * sdk.admin.inventoryItem.updateLevel(
   *   "iitem_123",
   *   "sloc_123",
   *   {
   *     stocked_quantity: 10
   *   }
   * )
   * .then(({ inventory_item }) => {
   *   console.log(inventory_item)
   * })
   */
  updateLevel(id, locationId, body, query, headers) {
    return __awaiter$B(this, void 0, void 0, function* () {
      return yield this.client.fetch(`/admin/inventory-items/${id}/location-levels/${locationId}`, {
        method: "POST",
        headers,
        body,
        query
      });
    });
  }
  /**
   * This method deletes an inventory level associated with an inventory item
   * and a stock location.
   *
   * This method sends a request to the
   * [Remove Inventory Level](https://docs.medusajs.com/api/admin#inventory-items_deleteinventoryitemsidlocationlevelslocation_id)
   * API route.
   *
   * @param id - The inventory item's ID.
   * @param locationId - The stock location's ID.
   * @param headers - Headers to pass in the request
   * @returns The deletion's details.
   *
   * @example
   * sdk.admin.inventoryItem.deleteLevel(
   *   "iitem_123",
   *   "sloc_123",
   * )
   * .then(({ deleted, parent: inventoryItem }) => {
   *   console.log(deleted, inventoryItem)
   * })
   */
  deleteLevel(id, locationId, headers) {
    return __awaiter$B(this, void 0, void 0, function* () {
      return yield this.client.fetch(`/admin/inventory-items/${id}/location-levels/${locationId}`, {
        method: "DELETE",
        headers
      });
    });
  }
  /**
   * This method manages the inventory levels of an inventory item. It sends a request to the
   * [Manage Inventory Levels](https://docs.medusajs.com/api/admin#inventory-items_postinventoryitemsidlocationlevelsbatch)
   * API route.
   *
   * @deprecated Use `batchInventoryItemLocationLevels` instead.
   *
   * @param id - The inventory item's ID.
   * @param body - The inventory levels to create or delete.
   * @param query - Configure the fields to retrieve in the inventory item.
   * @param headers - Headers to pass in the request
   * @returns The inventory item's details.
   *
   * @example
   * sdk.admin.inventoryItem.batchUpdateLevels("iitem_123", {
   *   create: [{
   *     location_id: "sloc_123",
   *     stocked_quantity: 10
   *   }],
   *   delete: ["ilvl_123"]
   * })
   * .then(({ created, updated, deleted }) => {
   *   console.log(created, updated, deleted)
   * })
   */
  batchUpdateLevels(id, body, query, headers) {
    return __awaiter$B(this, void 0, void 0, function* () {
      return yield this.client.fetch(`/admin/inventory-items/${id}/location-levels/batch`, {
        method: "POST",
        headers,
        body,
        query
      });
    });
  }
  /**
   * This method manages the inventory levels of an inventory item. It sends a request to the
   * [Manage Inventory Levels](https://docs.medusajs.com/api/admin#inventory-items_postinventoryitemsidlocationlevelsbatch)
   * API route.
   *
   * @param id - The inventory item's ID.
   * @param body - The inventory levels to create, update or delete, and an optional `force` flag.
   * @param headers - Headers to pass in the request
   * @returns The inventory item's details.
   *
   * @example
   * sdk.admin.inventoryItem.batchInventoryItemLocationLevels("iitem_123", {
   *   create: [{
   *     location_id: "sloc_123",
   *     stocked_quantity: 10
   *   }],
   *   delete: ["ilvl_123"]
   * })
   * .then(({ created, updated, deleted }) => {
   *   console.log(created, updated, deleted)
   * })
   */
  batchInventoryItemLocationLevels(id, body, headers) {
    return __awaiter$B(this, void 0, void 0, function* () {
      return yield this.client.fetch(`/admin/inventory-items/${id}/location-levels/batch`, {
        method: "POST",
        headers,
        body
      });
    });
  }
  /**
   * This method manages the inventory levels of multiple inventory items.
   *
   * @param body - The inventory levels to create, update or delete, and an optional `force` flag.
   * @param headers - Headers to pass in the request
   * @returns The inventory item's details.
   *
   * @example
   * sdk.admin.inventoryItem.batchInventoryItemsLocationLevels({
   *   create: [{
   *     inventory_item_id: "iitem_123",
   *     location_id: "sloc_123",
   *     stocked_quantity: 10
   *   }],
   *   delete: ["ilvl_123"]
   * })
   * .then(({ created, updated, deleted }) => {
   *   console.log(created, updated, deleted)
   * })
   */
  batchInventoryItemsLocationLevels(body, headers) {
    return __awaiter$B(this, void 0, void 0, function* () {
      return yield this.client.fetch(`/admin/inventory-items/location-levels/batch`, {
        method: "POST",
        headers,
        body
      });
    });
  }
}
var __awaiter$A = function(thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function(resolve) {
      resolve(value);
    });
  }
  return new (P || (P = Promise))(function(resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }
    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }
    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};
var __rest = function(s, e) {
  var t = {};
  for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
    t[p] = s[p];
  if (s != null && typeof Object.getOwnPropertySymbols === "function")
    for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
      if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
        t[p[i]] = s[p[i]];
    }
  return t;
};
class Invite {
  /**
   * @ignore
   */
  constructor(client) {
    this.client = client;
  }
  /**
   * This method accepts an invite. It requires sending a previous request to
   * the {@link Auth.register}.
   *
   * This method sends a request to the [Accept Invite]
   * (https://docs.medusajs.com/api/admin#invites_postinvitesaccept)
   * API route.
   *
   * @param input - The details of the user to create.
   * @param query - Configure the fields to retrieve in the user.
   * @param headers - Headers to pass in the request
   * @returns The user's details.
   *
   * @example
   * await sdk.auth.register("user", "emailpass", {
   *   email: "user@gmail.com",
   *   password: "supersecret"
   * })
   *
   * // all subsequent requests will use the token in the header
   * const { user } = await sdk.admin.invite.accept(
   *   {
   *     email: "user@gmail.com",
   *     first_name: "John",
   *     last_name: "Smith",
   *     invite_token: "12345..."
   *   },
   * )
   */
  accept(input, query, headers) {
    return __awaiter$A(this, void 0, void 0, function* () {
      const { invite_token } = input, rest = __rest(input, ["invite_token"]);
      return yield this.client.fetch(`/admin/invites/accept?token=${input.invite_token}`, {
        method: "POST",
        headers,
        body: rest,
        query
      });
    });
  }
  /**
   * This method creates an invite. It sends a request to the
   * [Create Invite](https://docs.medusajs.com/api/admin#invites_postinvites)
   * API route.
   *
   * @param body - The invite's details.
   * @param query - Configure the fields to retrieve in the invite.
   * @param headers - Headers to pass in the request
   * @returns The invite's details.
   *
   * @example
   * sdk.admin.invite.create({
   *   email: "user@gmail.com",
   * })
   * .then(({ invite }) => {
   *   console.log(invite)
   * })
   */
  create(body, query, headers) {
    return __awaiter$A(this, void 0, void 0, function* () {
      return yield this.client.fetch(`/admin/invites`, {
        method: "POST",
        headers,
        body,
        query
      });
    });
  }
  /**
   * This method retrieves an invite by its ID. It sends a request to the
   * [Get Invite](https://docs.medusajs.com/api/admin#invites_getinvitesid)
   * API route.
   *
   * @param id - The invite's ID.
   * @param query - Configure the fields to retrieve in the invite.
   * @param headers - Headers to pass in the request
   * @returns The invite's details.
   *
   * @example
   * To retrieve an invite its ID:
   *
   * ```ts
   * sdk.admin.invite.retrieve("invite_123")
   * .then(({ invite }) => {
   *   console.log(invite)
   * })
   * ```
   *
   * To specify the fields and relations to retrieve:
   *
   * ```ts
   * sdk.admin.invite.retrieve("invite_123", {
   *   fields: "id,email"
   * })
   * .then(({ invite }) => {
   *   console.log(invite)
   * })
   * ```
   *
   * Learn more about the `fields` property in the [API reference](https://docs.medusajs.com/api/store#select-fields-and-relations).
   */
  retrieve(id, query, headers) {
    return __awaiter$A(this, void 0, void 0, function* () {
      return yield this.client.fetch(`/admin/invites/${id}`, {
        headers,
        query
      });
    });
  }
  /**
   * This method retrieves a paginated list of invites. It sends a request to the
   * [List Invites](https://docs.medusajs.com/api/admin#invites_getinvites)
   * API route.
   *
   * @param queryParams - Filters and pagination configurations.
   * @param headers - Headers to pass in the request.
   * @returns The paginated list of invites.
   *
   * @example
   * To retrieve the list of invites:
   *
   * ```ts
   * sdk.admin.invite.list()
   * .then(({ invites, count, limit, offset }) => {
   *   console.log(invites)
   * })
   * ```
   *
   * To configure the pagination, pass the `limit` and `offset` query parameters.
   *
   * For example, to retrieve only 10 items and skip 10 items:
   *
   * ```ts
   * sdk.admin.invite.list({
   *   limit: 10,
   *   offset: 10
   * })
   * .then(({ invites, count, limit, offset }) => {
   *   console.log(invites)
   * })
   * ```
   *
   * Using the `fields` query parameter, you can specify the fields and relations to retrieve
   * in each invite:
   *
   * ```ts
   * sdk.admin.invite.list({
   *   fields: "id,email"
   * })
   * .then(({ invites, count, limit, offset }) => {
   *   console.log(invites)
   * })
   * ```
   *
   * Learn more about the `fields` property in the [API reference](https://docs.medusajs.com/api/store#select-fields-and-relations).
   */
  list(queryParams, headers) {
    return __awaiter$A(this, void 0, void 0, function* () {
      return yield this.client.fetch(`/admin/invites`, {
        headers,
        query: queryParams
      });
    });
  }
  /**
   * This method refreshes the token of an invite. It sends a request to the
   * [Refresh Invite Token](https://docs.medusajs.com/api/admin#invites_postinvitesidresend)
   * API route.
   *
   * @param id - The invite's ID.
   * @param headers - Headers to pass in the request.
   * @returns The invite's details.
   *
   * @example
   * sdk.admin.invite.resend("invite_123")
   * .then(({ invite }) => {
   *   console.log(invite)
   * })
   */
  resend(id, headers) {
    return __awaiter$A(this, void 0, void 0, function* () {
      return yield this.client.fetch(`/admin/invites/${id}/resend`, {
        method: "POST",
        headers
      });
    });
  }
  /**
   * This method deletes an invite. It sends a request to the
   * [Delete Invite](https://docs.medusajs.com/api/admin#invites_deleteinvitesid)
   * API route.
   *
   * @param id - The invite's ID.
   * @param headers - Headers to pass in the request.
   * @returns The deletion's details.
   *
   * @example
   * sdk.admin.invite.delete("invite_123")
   * .then(({ deleted }) => {
   *   console.log(deleted)
   * })
   */
  delete(id, headers) {
    return __awaiter$A(this, void 0, void 0, function* () {
      return yield this.client.fetch(`/admin/invites/${id}`, {
        method: "DELETE",
        headers
      });
    });
  }
}
var __awaiter$z = function(thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function(resolve) {
      resolve(value);
    });
  }
  return new (P || (P = Promise))(function(resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }
    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }
    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};
class Notification {
  /**
   * @ignore
   */
  constructor(client) {
    this.client = client;
  }
  /**
   * This method retrieves a notification's details. It sends a request to the
   * [Get Notification](https://docs.medusajs.com/api/admin#notifications_getnotificationsid)
   * API route.
   *
   * @param id - The notification's ID.
   * @param query - Configure the fields to retrieve in the notification.
   * @param headers - Headers to pass in the request
   * @returns The notification's details.
   *
   * @example
   * To retrieve a notification by its ID:
   *
   * ```ts
   * sdk.admin.notification.retrieve("notif_123")
   * .then(({ notification }) => {
   *   console.log(notification)
   * })
   * ```
   *
   * To specify the fields and relations to retrieve:
   *
   * ```ts
   * sdk.admin.notification.retrieve("notif_123", {
   *   fields: "id,to"
   * })
   * .then(({ notification }) => {
   *   console.log(notification)
   * })
   * ```
   *
   * Learn more about the `fields` property in the [API reference](https://docs.medusajs.com/api/store#select-fields-and-relations).
   */
  retrieve(id, query, headers) {
    return __awaiter$z(this, void 0, void 0, function* () {
      return yield this.client.fetch(`/admin/notifications/${id}`, {
        method: "GET",
        headers,
        query
      });
    });
  }
  /**
   * This method retrieves a paginated list of notifications. It sends a request to the
   * [List Notifications](https://docs.medusajs.com/api/admin#notifications_getnotifications)
   * API route.
   *
   * @param query - Filters and pagination configurations.
   * @param headers - Headers to pass in the request.
   * @returns The paginated list of notifications.
   *
   * @example
   * To retrieve the list of notifications:
   *
   * ```ts
   * sdk.admin.notification.list()
   * .then(({ notifications, count, limit, offset }) => {
   *   console.log(notifications)
   * })
   * ```
   *
   * To configure the pagination, pass the `limit` and `offset` query parameters.
   *
   * For example, to retrieve only 10 items and skip 10 items:
   *
   * ```ts
   * sdk.admin.notification.list({
   *   limit: 10,
   *   offset: 10
   * })
   * .then(({ notifications, count, limit, offset }) => {
   *   console.log(notifications)
   * })
   * ```
   *
   * Using the `fields` query parameter, you can specify the fields and relations to retrieve
   * in each notification:
   *
   * ```ts
   * sdk.admin.notification.list({
   *   fields: "id,to"
   * })
   * .then(({ notifications, count, limit, offset }) => {
   *   console.log(notifications)
   * })
   * ```
   *
   * Learn more about the `fields` property in the [API reference](https://docs.medusajs.com/api/store#select-fields-and-relations).
   */
  list(query, headers) {
    return __awaiter$z(this, void 0, void 0, function* () {
      return yield this.client.fetch(`/admin/notifications`, {
        method: "GET",
        headers,
        query
      });
    });
  }
}
var __awaiter$y = function(thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function(resolve) {
      resolve(value);
    });
  }
  return new (P || (P = Promise))(function(resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }
    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }
    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};
class Order {
  /**
   * @ignore
   */
  constructor(client) {
    this.client = client;
  }
  /**
   * This method retrieves an order by its ID. It sends a request to the
   * [Get Order](https://docs.medusajs.com/api/admin#orders_getordersid)
   * API route.
   *
   * @param id - The order's ID.
   * @param query - Configure the fields to retrieve in the order.
   * @param headers - Headers to pass in the request
   * @returns The order's details.
   *
   * @example
   * To retrieve an order by its ID:
   *
   * ```ts
   * sdk.admin.order.retrieve("order_123")
   * .then(({ order }) => {
   *   console.log(order)
   * })
   * ```
   *
   * To specify the fields and relations to retrieve:
   *
   * ```ts
   * sdk.admin.order.retrieve("order_123", {
   *   fields: "id,*items"
   * })
   * .then(({ order }) => {
   *   console.log(order)
   * })
   * ```
   *
   * Learn more about the `fields` property in the [API reference](https://docs.medusajs.com/api/store#select-fields-and-relations).
   */
  retrieve(id, query, headers) {
    return __awaiter$y(this, void 0, void 0, function* () {
      return yield this.client.fetch(`/admin/orders/${id}`, {
        query,
        headers
      });
    });
  }
  /**
   * This method updates an order. It sends a request to the
   * [Update Order Email](https://docs.medusajs.com/api/admin#orders_postordersid)
   * API route.
   *
   * @param id - The order's ID.
   * @param body - The update details.
   * @param headers - Headers to pass in the request
   * @returns The order's details.
   *
   * @example
   * sdk.admin.order.update(
   *   "order_123",
   *   {
   *     email: "new_email@example.com",
   *     shipping_address: {
   *       first_name: "John",
   *       last_name: "Doe",
   *       address_1: "123 Main St",
   *     }
   *   }
   * )
   * .then(({ order }) => {
   *   console.log(order)
   * })
   */
  update(id, body, headers) {
    return __awaiter$y(this, void 0, void 0, function* () {
      return yield this.client.fetch(`/admin/orders/${id}`, {
        method: "POST",
        headers,
        body
      });
    });
  }
  /**
   * This method retrieves the preview of an order based on its last associated change. It sends a request to the
   * [Get Order Preview](https://docs.medusajs.com/api/admin#orders_getordersidpreview) API route.
   *
   * @param id - The order's ID.
   * @param query - Query parameters.
   * @param headers - Headers to pass in the request
   * @returns The order preview's details.
   *
   * @example
   * sdk.admin.order.retrievePreview("order_123")
   * .then(({ order }) => {
   *   console.log(order)
   * })
   */
  retrievePreview(id, query, headers) {
    return __awaiter$y(this, void 0, void 0, function* () {
      return yield this.client.fetch(`/admin/orders/${id}/preview`, {
        query,
        headers
      });
    });
  }
  /**
   * This method retrieves a paginated list of orders. It sends a request to the
   * [List Orders](https://docs.medusajs.com/api/admin#orders_getorders) API route.
   *
   * @param queryParams - Filters and pagination configurations.
   * @param headers - Headers to pass in the request.
   * @returns The paginated list of orders.
   *
   * @example
   * To retrieve the list of orders:
   *
   * ```ts
   * sdk.admin.order.list()
   * .then(({ orders, count, limit, offset }) => {
   *   console.log(orders)
   * })
   * ```
   *
   * To configure the pagination, pass the `limit` and `offset` query parameters.
   *
   * For example, to retrieve only 10 items and skip 10 items:
   *
   * ```ts
   * sdk.admin.order.list({
   *   limit: 10,
   *   offset: 10
   * })
   * .then(({ orders, count, limit, offset }) => {
   *   console.log(orders)
   * })
   * ```
   *
   * Using the `fields` query parameter, you can specify the fields and relations to retrieve
   * in each order:
   *
   * ```ts
   * sdk.admin.order.list({
   *   fields: "id,*items"
   * })
   * .then(({ orders, count, limit, offset }) => {
   *   console.log(orders)
   * })
   * ```
   *
   * Learn more about the `fields` property in the [API reference](https://docs.medusajs.com/api/store#select-fields-and-relations).
   */
  list(queryParams, headers) {
    return __awaiter$y(this, void 0, void 0, function* () {
      return yield this.client.fetch(`/admin/orders`, {
        query: queryParams,
        headers
      });
    });
  }
  /**
   * This method archives an order. It sends a request to the
   * [Archive Order](https://docs.medusajs.com/api/admin#orders_postordersidarchive)
   * API route.
   *
   * @param id - The order's ID.
   * @param queryParams - Configure the fields to retrieve in the order.
   * @param headers - Headers to pass in the request
   * @returns The order's details.
   *
   * @example
   * sdk.admin.order.archive("order_123")
   * .then(({ order }) => {
   *   console.log(order)
   * })
   */
  archive(id, queryParams, headers) {
    return __awaiter$y(this, void 0, void 0, function* () {
      return yield this.client.fetch(`/admin/orders/${id}/archive`, {
        method: "POST",
        query: queryParams,
        headers
      });
    });
  }
  /**
   * This method cancels an order. It sends a request to the
   * [Cancel Order](https://docs.medusajs.com/api/admin#orders_postordersidcancel)
   * API route.
   *
   * @param id - The order's ID.
   * @param headers - Headers to pass in the request.
   * @returns The order's details.
   *
   * @example
   * sdk.admin.order.cancel("order_123")
   * .then(({ order }) => {
   *   console.log(order)
   * })
   */
  cancel(id, headers) {
    return __awaiter$y(this, void 0, void 0, function* () {
      return yield this.client.fetch(`/admin/orders/${id}/cancel`, {
        method: "POST",
        headers
      });
    });
  }
  /**
   * This method completes an order. It sends a request to the
   * [Complete Order](https://docs.medusajs.com/api/admin#orders_postordersidcomplete)
   * API route.
   *
   * @param id - The order's ID.
   * @param headers - Headers to pass in the request.
   * @returns The order's details.
   *
   * @example
   * sdk.admin.order.complete("order_123")
   * .then(({ order }) => {
   *   console.log(order)
   * })
   */
  complete(id, body, queryParams, headers) {
    return __awaiter$y(this, void 0, void 0, function* () {
      return yield this.client.fetch(`/admin/orders/${id}/complete`, {
        method: "POST",
        body,
        query: queryParams,
        headers
      });
    });
  }
  /**
   * This method requests an order transfer. It sends a request to the
   * [Request Order Transfer](https://docs.medusajs.com/api/admin#orders_postordersidrequesttransfer)
   * API route.
   *
   * @param id - The order's ID.
   * @param headers - Headers to pass in the request.
   * @param body - The transfer's details - the id of the next owner.
   * @returns The order's details.
   *
   * @example
   * sdk.admin.order.requestTransfer("order_123", {
   *   customer_id: "cus_123",
   *   internal_note: "Internal note",
   * })
   * .then(({ order }) => {
   *   console.log(order)
   * })
   */
  requestTransfer(id, body, headers) {
    return __awaiter$y(this, void 0, void 0, function* () {
      return yield this.client.fetch(`/admin/orders/${id}/transfer`, {
        method: "POST",
        headers,
        body
      });
    });
  }
  /**
   * This method cancels an order transfer request. It sends a request to the
   * [Cancel Order Transfer Request](https://docs.medusajs.com/api/admin#orders_postordersidcanceltransferrequest)
   * API route.
   *
   * @param id - The order's ID.
   * @param headers - Headers to pass in the request.
   * @returns The order's details.
   *
   * @example
   * sdk.admin.order.cancelTransfer("order_123")
   * .then(({ order }) => {
   *   console.log(order)
   * })
   */
  cancelTransfer(id, headers) {
    return __awaiter$y(this, void 0, void 0, function* () {
      return yield this.client.fetch(`/admin/orders/${id}/transfer/cancel`, {
        method: "POST",
        headers
      });
    });
  }
  /**
   * This method creates a fulfillment for an order. It sends a request to the
   * [Create Fulfillment](https://docs.medusajs.com/api/admin#orders_postordersidfulfillments)
   * API route.
   *
   * @param id - The order's ID.
   * @param body - The fulfillment's details.
   * @param query - Configure the fields to retrieve in the order.
   * @param headers - Headers to pass in the request
   * @returns The order's details.
   *
   * @example
   * sdk.admin.order.createFulfillment("order_123", {
   *   items: [
   *     {
   *       id: "orli_123",
   *       quantity: 1
   *     }
   *   ]
   * })
   * .then(({ order }) => {
   *   console.log(order)
   * })
   */
  createFulfillment(id, body, query, headers) {
    return __awaiter$y(this, void 0, void 0, function* () {
      return yield this.client.fetch(`/admin/orders/${id}/fulfillments`, {
        method: "POST",
        headers,
        body,
        query
      });
    });
  }
  /**
   * This method cancels an order's fulfillment. It sends a request to the
   * [Cancel Fulfillment](https://docs.medusajs.com/api/admin#orders_postordersidfulfillmentsfulfillment_idcancel)
   * API route.
   *
   * @param id - The order's ID.
   * @param fulfillmentId - The ID of the fulfillment to cancel.
   * @param body - The cancelation's details.
   * @param headers - Headers to pass in the request
   * @returns The order's details.
   *
   * @example
   * sdk.admin.order.cancelFulfillment(
   *   "order_123",
   *   "ful_123",
   *   {
   *     no_notification: false
   *   }
   * )
   * .then(({ order }) => {
   *   console.log(order)
   * })
   */
  cancelFulfillment(id, fulfillmentId, body, headers) {
    return __awaiter$y(this, void 0, void 0, function* () {
      return yield this.client.fetch(`/admin/orders/${id}/fulfillments/${fulfillmentId}/cancel`, {
        method: "POST",
        headers,
        body
      });
    });
  }
  /**
   * This method creates a shipment for an order's fulfillment. It sends a request to the
   * [Create Shipment](https://docs.medusajs.com/api/admin#orders_postordersidfulfillmentsfulfillment_idshipments)
   * API route.
   *
   * @param id - The order's ID.
   * @param fulfillmentId - The ID of the fulfillment.
   * @param body - The shipment's details.
   * @param query - Configure the fields to retrieve in the order.
   * @param headers - Headers to pass in the request
   * @returns The order's details.
   *
   * @example
   * sdk.admin.order.createShipment(
   *   "order_123",
   *   "ful_123",
   *   {
   *     items: [
   *       {
   *         id: "fulit_123",
   *         quantity: 1
   *       }
   *     ]
   *   }
   * )
   * .then(({ order }) => {
   *   console.log(order)
   * })
   */
  createShipment(id, fulfillmentId, body, query, headers) {
    return __awaiter$y(this, void 0, void 0, function* () {
      return yield this.client.fetch(`/admin/orders/${id}/fulfillments/${fulfillmentId}/shipments`, {
        method: "POST",
        headers,
        body,
        query
      });
    });
  }
  /**
   * This method marks an order's fulfillment as delivered. It sends a request to the
   * [Mark Delivered ](https://docs.medusajs.com/api/admin#orders_postordersidfulfillmentsfulfillment_idmarkasdelivered)
   * API route.
   *
   * @param id - The order's ID.
   * @param fulfillmentId - The fulfillment's ID.
   * @param query - Configure the fields to retrieve in the order.
   * @param headers - Headers to pass in the request
   * @returns The order's details.
   *
   * @example
   * sdk.admin.order.markAsDelivered(
   *   "order_123",
   *   "ful_123",
   * )
   * .then(({ order }) => {
   *   console.log(order)
   * })
   */
  markAsDelivered(id, fulfillmentId, query, headers) {
    return __awaiter$y(this, void 0, void 0, function* () {
      return yield this.client.fetch(`/admin/orders/${id}/fulfillments/${fulfillmentId}/mark-as-delivered`, {
        method: "POST",
        headers,
        query
      });
    });
  }
  /**
   * This method retrieves a list of shipping options for an order based on the order's shipping address.
   *
   * This method sends a request to the [List Shipping Options](https://docs.medusajs.com/api/admin#orders_getordersidshipping-options)
   * API route.
   *
   * @param id - The order's ID.
   * @param queryParams - Configure the fields to retrieve in each shipping option.
   * @param headers - Headers to pass in the request
   * @returns The list of shipping options.
   *
   * @example
   * sdk.admin.order.listShippingOptions("order_123")
   * .then(({ shipping_options }) => {
   *   console.log(shipping_options)
   * })
   */
  listShippingOptions(id, queryParams, headers) {
    return __awaiter$y(this, void 0, void 0, function* () {
      return yield this.client.fetch(`/admin/orders/${id}/shipping-options`, {
        query: queryParams,
        headers
      });
    });
  }
  /**
   * This method retrieves a list of changes made on an order, including returns, exchanges, etc...
   *
   * This method sends a request to the [List Changes](https://docs.medusajs.com/api/admin#orders_getordersidchanges)
   * API route.
   *
   * @param id - The order's ID.
   * @param queryParams - Configure the fields to retrieve in each order change.
   * @param headers - Headers to pass in the request
   * @returns The list of order changes.
   *
   * @example
   * sdk.admin.order.listChanges("order_123")
   * .then(({ order_changes }) => {
   *   console.log(order_changes)
   * })
   */
  listChanges(id, queryParams, headers) {
    return __awaiter$y(this, void 0, void 0, function* () {
      return yield this.client.fetch(`/admin/orders/${id}/changes`, {
        query: queryParams,
        headers
      });
    });
  }
  /**
   * This method retrieves the order's line items. It sends a request to the
   * [List Line Items](https://docs.medusajs.com/api/admin#orders_getordersidlineitems)
   * API routes.
   *
   * @param id - The order's ID.
   * @param queryParams - Configure the fields to retrieve in each line item.
   * @param headers - Headers to pass in the request
   * @returns The list of line items.
   *
   * @example
   * sdk.admin.order.listLineItems("order_123")
   * .then(({ order_items }) => {
   *   console.log(order_items)
   * })
   */
  listLineItems(id, queryParams, headers) {
    return __awaiter$y(this, void 0, void 0, function* () {
      return yield this.client.fetch(`/admin/orders/${id}/line-items`, {
        query: queryParams,
        headers
      });
    });
  }
  /**
   * This method creates a credit line for an order. It sends a request to the
   * [Create Credit Line](https://docs.medusajs.com/api/admin#orders_postordersidcredit-lines) API route.
   *
   * @param orderId - The order's ID.
   * @param body - The credit line's details.
   * @param query - Configure the fields to retrieve in the order.
   * @param headers - Headers to pass in the request
   * @returns The order's details.
   *
   * @example
   * sdk.admin.order.createCreditLine(
   *   "order_123",
   *   {
   *     amount: 100,
   *     reference: "order",
   *     reference_id: "order_123",
   *   }
   * )
   * .then(({ order }) => {
   *   console.log(order)
   * })
   */
  createCreditLine(orderId, body, query, headers) {
    return __awaiter$y(this, void 0, void 0, function* () {
      return yield this.client.fetch(`/admin/orders/${orderId}/credit-lines`, {
        method: "POST",
        headers,
        body,
        query
      });
    });
  }
}
var __awaiter$x = function(thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function(resolve) {
      resolve(value);
    });
  }
  return new (P || (P = Promise))(function(resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }
    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }
    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};
class OrderEdit {
  /**
   * @ignore
   */
  constructor(client) {
    this.client = client;
  }
  /**
   * This method creates an order edit request. It sends a HTTP request to the
   * [Create Order Edit](https://docs.medusajs.com/api/admin#order-edits_postorderedits)
   * API route.
   *
   * @param body - The order edit's details.
   * @param query - Configure the fields to retrieve in the order edit.
   * @param headers - Headers to pass in the request.
   * @returns The order edit's details.
   *
   * @example
   * sdk.admin.orderEdit.initiateRequest({
   *   order_id: "order_123"
   * })
   * .then(({ order_change }) => {
   *   console.log(order_change)
   * })
   */
  initiateRequest(body, query, headers) {
    return __awaiter$x(this, void 0, void 0, function* () {
      return yield this.client.fetch(`/admin/order-edits`, {
        method: "POST",
        headers,
        body,
        query
      });
    });
  }
  /**
   * This method changes an order edit to requested. It sends a request to the
   * [Request Order Edit](https://docs.medusajs.com/api/admin#order-edits_postordereditsidrequest)
   * API route.
   *
   * @param id - The order edit's ID.
   * @param query - Configure the fields to retrieve in the order preview.
   * @param headers - Headers to pass in the request.
   * @returns The order preview's details.
   *
   * @example
   * sdk.admin.orderEdit.request("ordch_123")
   * .then(({ order_preview }) => {
   *   console.log(order_preview)
   * })
   */
  request(id, query, headers) {
    return __awaiter$x(this, void 0, void 0, function* () {
      return yield this.client.fetch(`/admin/order-edits/${id}/request`, {
        method: "POST",
        headers,
        query
      });
    });
  }
  /**
   * This method confirms an order edit and applies it on the order. It sends a request
   * to the [Confirm Order Edit](https://docs.medusajs.com/api/admin#order-edits_postordereditsidconfirm)
   * API route.
   *
   * @param id - The order edit's ID.
   * @param query - Configure the fields to retrieve in the order preview.
   * @param headers - Headers to pass in the request.
   * @returns The order preview's details.
   *
   * @example
   * sdk.admin.orderEdit.confirm("ordch_123")
   * .then(({ order_preview }) => {
   *   console.log(order_preview)
   * })
   */
  confirm(id, query, headers) {
    return __awaiter$x(this, void 0, void 0, function* () {
      return yield this.client.fetch(`/admin/order-edits/${id}/confirm`, {
        method: "POST",
        headers,
        query
      });
    });
  }
  /**
   * This method cancels a requested order edit. It sends a request to the
   * [Cancel Order Edit](https://docs.medusajs.com/api/admin#order-edits_deleteordereditsid)
   * API route.
   *
   * @param id - The order edit's ID.
   * @param query - Query parameters
   * @param headers - Headers to pass in the request.
   * @returns The deletion's details.
   *
   * @example
   * sdk.admin.orderEdit.cancelRequest("ordch_123")
   * .then(({ deleted }) => {
   *   console.log(deleted)
   * })
   */
  cancelRequest(id, query, headers) {
    return __awaiter$x(this, void 0, void 0, function* () {
      return yield this.client.fetch(`/admin/order-edits/${id}`, {
        method: "DELETE",
        headers,
        query
      });
    });
  }
  /**
   * This method adds items to an order edit. These items will have the action `ITEM_ADD`.
   *
   * The method sends a request to the [Add Items](https://docs.medusajs.com/api/admin#order-edits_postordereditsiditems)
   * API route.
   *
   * @param id - The order edit's ID.
   * @param body - The items to add.
   * @param query - Configure the fields to retrieve in the order preview.
   * @param headers - Headers to pass in the request.
   * @returns The order preview's details.
   *
   * @example
   * sdk.admin.orderEdit.addItems("ordch_123", {
   *   items: [
   *     {
   *       variant_id: "variant_123",
   *       quantity: 1
   *     }
   *   ]
   * })
   * .then(({ order_preview }) => {
   *   console.log(order_preview)
   * })
   */
  addItems(id, body, query, headers) {
    return __awaiter$x(this, void 0, void 0, function* () {
      return yield this.client.fetch(`/admin/order-edits/${id}/items`, {
        method: "POST",
        headers,
        body,
        query
      });
    });
  }
  /**
   * This method updates the quantity and other details of an item in an order. It sends a request to the
   * [Update Item Quantity](https://docs.medusajs.com/api/admin#order-edits_postordereditsiditemsitemitem_id)
   * API route.
   *
   * You can also use this method to remove an item from an order by setting the `quantity` to `0`.
   *
   * @param id - The order edit's ID.
   * @param itemId - The item's ID in the order.
   * @param body - The data to edit in the item.
   * @param query - Configure the fields to retrieve in the order preview.
   * @param headers - Headers to pass in the request.
   * @returns The order preview's details.
   *
   * @example
   * sdk.admin.orderEdit.updateOriginalItem(
   *   "ordch_123",
   *   "orli_123",
   *   {
   *     quantity: 1
   *   }
   * )
   * .then(({ order_preview }) => {
   *   console.log(order_preview)
   * })
   */
  updateOriginalItem(id, itemId, body, query, headers) {
    return __awaiter$x(this, void 0, void 0, function* () {
      return yield this.client.fetch(`/admin/order-edits/${id}/items/item/${itemId}`, {
        method: "POST",
        headers,
        body,
        query
      });
    });
  }
  /**
   * This method updates an added item in the order edit by the ID of the item's `ITEM_ADD` action.
   *
   * Every item has an `actions` property, whose value is an array of actions.
   * You can check the action's name using its `action` property, and use the value of the `id` property.
   *
   * It sends a request
   * to the [Update Item](https://docs.medusajs.com/api/admin#order-edits_postordereditsiditemsaction_id)
   * API route.
   *
   * @param id - The order edit's ID.
   * @param actionId - The id of the new item's `ITEM_ADD` action.
   * @param body - The data to update.
   * @param query - Configure the fields to retrieve in the order preview.
   * @param headers - Headers to pass in the request.
   * @returns The order preview's details.
   *
   * @example
   * sdk.admin.orderEdit.updateAddedItem(
   *   "ordch_123",
   *   "orli_123",
   *   {
   *     quantity: 1
   *   }
   * )
   * .then(({ order_preview }) => {
   *   console.log(order_preview)
   * })
   */
  updateAddedItem(id, actionId, body, query, headers) {
    return __awaiter$x(this, void 0, void 0, function* () {
      return yield this.client.fetch(`/admin/order-edits/${id}/items/${actionId}`, {
        method: "POST",
        headers,
        body,
        query
      });
    });
  }
  /**
   * This method removes an added item in the order edit by the ID of the item's `ITEM_ADD` action.
   *
   * Every item has an `actions` property, whose value is an array of actions.
   * You can check the action's name using its `action` property, and use the value of the `id` property.
   *
   * @param id - The order edit's ID.
   * @param actionId - The id of the new item's `ITEM_ADD` action.
   * @param query - Configure the fields to retrieve in the order preview.
   * @param headers - Headers to pass in the request.
   * @returns The order preview's details.
   *
   * @example
   * sdk.admin.orderEdit.removeAddedItem(
   *   "ordch_123",
   *   "orli_123",
   * )
   * .then(({ order_preview }) => {
   *   console.log(order_preview)
   * })
   */
  removeAddedItem(id, actionId, query, headers) {
    return __awaiter$x(this, void 0, void 0, function* () {
      return yield this.client.fetch(`/admin/order-edits/${id}/items/${actionId}`, {
        method: "DELETE",
        headers,
        query
      });
    });
  }
}
var __awaiter$w = function(thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function(resolve) {
      resolve(value);
    });
  }
  return new (P || (P = Promise))(function(resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }
    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }
    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};
class Payment {
  /**
   * @ignore
   */
  constructor(client) {
    this.client = client;
  }
  /**
   * This method retrieves a paginated list of payments. It sends a request to the
   * [List Payments](https://docs.medusajs.com/api/admin#payments_getpayments) API route.
   *
   * @param query  - Filters and pagination configurations.
   * @param headers - Headers to pass in the request.
   * @returns The paginated list of payments.
   *
   * @example
   * To retrieve the list of payments:
   *
   * ```ts
   * sdk.admin.payment.list()
   * .then(({ payments, count, limit, offset }) => {
   *   console.log(payments)
   * })
   * ```
   *
   * To configure the pagination, pass the `limit` and `offset` query parameters.
   *
   * For example, to retrieve only 10 items and skip 10 items:
   *
   * ```ts
   * sdk.admin.payment.list({
   *   limit: 10,
   *   offset: 10
   * })
   * .then(({ payments, count, limit, offset }) => {
   *   console.log(payments)
   * })
   * ```
   *
   * Using the `fields` query parameter, you can specify the fields and relations to retrieve
   * in each payment:
   *
   * ```ts
   * sdk.admin.payment.list({
   *   fields: "id,*payment_collection"
   * })
   * .then(({ payments, count, limit, offset }) => {
   *   console.log(payments)
   * })
   * ```
   *
   * Learn more about the `fields` property in the [API reference](https://docs.medusajs.com/api/store#select-fields-and-relations).
   */
  list(query, headers) {
    return __awaiter$w(this, void 0, void 0, function* () {
      return yield this.client.fetch(`/admin/payments`, {
        query,
        headers
      });
    });
  }
  /**
   * This method retrieves a paginated list of payment providers. It sends a request to the
   * [List Payment Providers](https://docs.medusajs.com/api/admin#payments_getpaymentspaymentproviders) API route.
   *
   * @param query - Filters and pagination configurations.
   * @param headers - Headers to pass in the request.
   * @returns The paginated list of payment providers.
   *
   * @example
   * To retrieve the list of payment providers:
   *
   * ```ts
   * sdk.admin.payment.listPaymentProviders()
   * .then(({ payment_providers, count, limit, offset }) => {
   *   console.log(payment_providers)
   * })
   * ```
   *
   * To configure the pagination, pass the `limit` and `offset` query parameters.
   *
   * For example, to retrieve only 10 items and skip 10 items:
   *
   * ```ts
   * sdk.admin.payment.listPaymentProviders({
   *   limit: 10,
   *   offset: 10
   * })
   * .then(({ payment_providers, count, limit, offset }) => {
   *   console.log(payment_providers)
   * })
   * ```
   *
   * Using the `fields` query parameter, you can specify the fields and relations to retrieve
   * in each payment provider:
   *
   * ```ts
   * sdk.admin.payment.listPaymentProviders({
   *   fields: "id,is_enabled"
   * })
   * .then(({ payment_providers, count, limit, offset }) => {
   *   console.log(payment_providers)
   * })
   * ```
   *
   * Learn more about the `fields` property in the [API reference](https://docs.medusajs.com/api/store#select-fields-and-relations).
   */
  listPaymentProviders(query, headers) {
    return __awaiter$w(this, void 0, void 0, function* () {
      return yield this.client.fetch(`/admin/payments/payment-providers`, {
        query,
        headers
      });
    });
  }
  /**
   * This method retrieves a payment's details. It sends a request to the
   * [Get Payment](https://docs.medusajs.com/api/admin#payments_getpaymentsid)
   * API route.
   *
   * @param id - The payment's ID.
   * @param query - Configure the fields to retrieve in the payment.
   * @param headers - Headers to pass in the request
   * @returns The payment's details.
   *
   * @example
   * To retrieve a payment by its ID:
   *
   * ```ts
   * sdk.admin.payment.retrieve("pay_123")
   * .then(({ payment }) => {
   *   console.log(payment)
   * })
   * ```
   *
   * To specify the fields and relations to retrieve:
   *
   * ```ts
   * sdk.admin.payment.retrieve("pay_123", {
   *   fields: "id,*payment_collection"
   * })
   * .then(({ payment }) => {
   *   console.log(payment)
   * })
   * ```
   *
   * Learn more about the `fields` property in the [API reference](https://docs.medusajs.com/api/store#select-fields-and-relations).
   */
  retrieve(id, query, headers) {
    return __awaiter$w(this, void 0, void 0, function* () {
      return yield this.client.fetch(`/admin/payments/${id}`, {
        query,
        headers
      });
    });
  }
  /**
   * This method captures a payment. It sends a request to the
   * [Capture Payment](https://docs.medusajs.com/api/admin#payments_postpaymentsidcapture) API route.
   *
   * The API route uses the `capturePayment` method of the payment provider associated with the payment's collection.
   *
   * @param id - The payment's ID.
   * @param body - The capture's details.
   * @param query - Configure the fields to retrieve in the payment.
   * @param headers - Headers to pass in the request
   * @returns The payment's details.
   *
   * @example
   * sdk.admin.payment.capture("paycol_123", {})
   * .then(({ payment }) => {
   *   console.log(payment)
   * })
   */
  capture(id, body, query, headers) {
    return __awaiter$w(this, void 0, void 0, function* () {
      return yield this.client.fetch(`/admin/payments/${id}/capture`, {
        method: "POST",
        headers,
        body,
        query
      });
    });
  }
  /**
   * This method refunds a payment. It sends a request to the
   * [Refund Payment](https://docs.medusajs.com/api/admin#payments_postpaymentsidrefund) API route.
   *
   * The API route uses the `refundPayment` method of the payment provider associated with the payment's collection.
   *
   * @param id - The payment's ID.
   * @param body - The refund's details.
   * @param query - Configure the fields to retrieve in the payment.
   * @param headers - Headers to pass in the request
   * @returns The payment's details.
   *
   * @example
   * sdk.admin.payment.refund("paycol_123", {})
   * .then(({ payment }) => {
   *   console.log(payment)
   * })
   */
  refund(id, body, query, headers) {
    return __awaiter$w(this, void 0, void 0, function* () {
      return yield this.client.fetch(`/admin/payments/${id}/refund`, {
        method: "POST",
        headers,
        body,
        query
      });
    });
  }
}
var __awaiter$v = function(thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function(resolve) {
      resolve(value);
    });
  }
  return new (P || (P = Promise))(function(resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }
    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }
    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};
class PaymentCollection {
  /**
   * @ignore
   */
  constructor(client) {
    this.client = client;
  }
  /**
   * This method creates a payment collection. It sends a request to the
   * [Create Payment Collection](https://docs.medusajs.com/api/admin#payment-collections_postpaymentcollections)
   * API route.
   *
   * @param body - The details of the payment collection to create.
   * @param query - Configure the fields to retrieve in the payment collection.
   * @param headers - Headers to pass in the request
   * @returns The payment collection's details.
   *
   * @example
   * sdk.admin.paymentCollection.create({
   *   order_id: "order_123"
   * })
   * .then(({ payment_collection }) => {
   *   console.log(payment_collection)
   * })
   */
  create(body, query, headers) {
    return __awaiter$v(this, void 0, void 0, function* () {
      return yield this.client.fetch(`/admin/payment-collections`, {
        method: "POST",
        headers,
        body,
        query
      });
    });
  }
  /**
   * This method deletes a payment collection. It sends a request to the
   * [Delete Payment Collection](https://docs.medusajs.com/api/admin#payment-collections_deletepaymentcollectionsid)
   * API route.
   *
   * @param id - The payment collection's ID.
   * @param headers - Headers to pass in the request
   * @returns The deletion's details.
   *
   * @example
   * sdk.admin.paymentCollection.delete("paycol_123")
   * .then(({ deleted }) => {
   *   console.log(deleted)
   * })
   */
  delete(id, headers) {
    return __awaiter$v(this, void 0, void 0, function* () {
      return yield this.client.fetch(`/admin/payment-collections/${id}`, {
        method: "DELETE",
        headers
      });
    });
  }
  /**
   * This method marks a payment collection as paid. It sends a request to the
   * [Mark as Paid](https://docs.medusajs.com/api/admin#payment-collections_postpaymentcollectionsidmarkaspaid)
   * API route.
   *
   * The API route creates and authorizes a payment session, then capture its payment,
   * using the manual payment provider.
   *
   * @param id - The payment collection to mark as paid.
   * @param body - The details to mark the payment collection as paid.
   * @param query - Configure the fields to retrieve in the payment collection.
   * @param headers - Headers to pass in the request.
   * @returns The payment collection's details.
   *
   * @example
   * sdk.admin.paymentCollection.markAsPaid("paycol_123", {
   *   order_id: "order_123"
   * })
   * .then(({ payment_collection }) => {
   *   console.log(payment_collection)
   * })
   */
  markAsPaid(id, body, query, headers) {
    return __awaiter$v(this, void 0, void 0, function* () {
      return yield this.client.fetch(`/admin/payment-collections/${id}/mark-as-paid`, {
        method: "POST",
        headers,
        body,
        query
      });
    });
  }
}
var __awaiter$u = function(thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function(resolve) {
      resolve(value);
    });
  }
  return new (P || (P = Promise))(function(resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }
    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }
    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};
class Plugin {
  /**
   * @ignore
   */
  constructor(client) {
    this.client = client;
  }
  /**
   * This method retrieves the list of plugins installed in a Medusa application.
   *
   * @param headers - Headers to pass in the request.
   * @returns The list of plugins.
   *
   * @example
   * sdk.admin.plugin.list()
   * .then(({ plugins }) => {
   *   console.log(plugins)
   * })
   */
  list(headers) {
    return __awaiter$u(this, void 0, void 0, function* () {
      return yield this.client.fetch(`/admin/plugins`, {
        headers,
        query: {}
      });
    });
  }
}
var __awaiter$t = function(thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function(resolve) {
      resolve(value);
    });
  }
  return new (P || (P = Promise))(function(resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }
    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }
    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};
class PriceList {
  /**
   * @ignore
   */
  constructor(client) {
    this.client = client;
  }
  /**
   * This method retrieves a price list. It sends a request to the
   * [Get Price List](https://docs.medusajs.com/v2/api/admin#price-lists_getpricelistsid)
   * API route.
   *
   * @param id - The price list's ID.
   * @param query - Configure the fields to retrieve in the price list.
   * @param headers - Headers to pass in the request
   * @returns The price list's details.
   *
   * @example
   * To retrieve a price list by its ID:
   *
   * ```ts
   * sdk.admin.priceList.retrieve("plist_123")
   * .then(({ price_list }) => {
   *   console.log(price_list)
   * })
   * ```
   *
   * To specify the fields and relations to retrieve:
   *
   * ```ts
   * sdk.admin.priceList.retrieve("plist_123", {
   *   fields: "id,*prices"
   * })
   * .then(({ price_list }) => {
   *   console.log(price_list)
   * })
   * ```
   *
   * Learn more about the `fields` property in the [API reference](https://docs.medusajs.com/v2/api/store#select-fields-and-relations).
   */
  retrieve(id, query, headers) {
    return __awaiter$t(this, void 0, void 0, function* () {
      return this.client.fetch(`/admin/price-lists/${id}`, {
        method: "GET",
        headers,
        query
      });
    });
  }
  /**
   * This method retrieves a paginated list of price lists. It sends a request to the
   * [List Price Lists](https://docs.medusajs.com/v2/api/admin#price-lists_getpricelists) API route.
   *
   * @param query - Filters and pagination configurations.
   * @param headers - Headers to pass in the request.
   * @returns The paginated list of price lists.
   *
   * @example
   * To retrieve the list of price lists:
   *
   * ```ts
   * sdk.admin.priceList.list()
   * .then(({ price_lists, count, limit, offset }) => {
   *   console.log(price_lists)
   * })
   * ```
   *
   * To configure the pagination, pass the `limit` and `offset` query parameters.
   *
   * For example, to retrieve only 10 items and skip 10 items:
   *
   * ```ts
   * sdk.admin.priceList.list({
   *   limit: 10,
   *   offset: 10
   * })
   * .then(({ price_lists, count, limit, offset }) => {
   *   console.log(price_lists)
   * })
   * ```
   *
   * Using the `fields` query parameter, you can specify the fields and relations to retrieve
   * in each price list:
   *
   * ```ts
   * sdk.admin.priceList.list({
   *   fields: "id,*prices"
   * })
   * .then(({ price_lists, count, limit, offset }) => {
   *   console.log(price_lists)
   * })
   * ```
   *
   * Learn more about the `fields` property in the [API reference](https://docs.medusajs.com/v2/api/store#select-fields-and-relations).
   */
  list(query, headers) {
    return __awaiter$t(this, void 0, void 0, function* () {
      return this.client.fetch(`/admin/price-lists`, {
        method: "GET",
        headers,
        query
      });
    });
  }
  /**
   * This method creates a price list. It sends a request to the
   * [Create Price List](https://docs.medusajs.com/v2/api/admin#price-lists_postpricelists)
   * API route.
   *
   * @param body - The details of the price list to create.
   * @param query - Configure the fields to retrieve in the price list.
   * @param headers - Headers to pass in the request
   * @returns The price list's details.
   *
   * @example
   * sdk.admin.priceList.create({
   *   title: "My Price List",
   *   status: "active",
   *   type: "sale",
   *   prices: [
   *     {
   *       variant_id: "variant_123",
   *       amount: 10,
   *       currency_code: "usd",
   *       rules: {
   *         region_id: "reg_123"
   *       }
   *     }
   *   ]
   * })
   * .then(({ price_list }) => {
   *   console.log(price_list)
   * })
   */
  create(body, query, headers) {
    return __awaiter$t(this, void 0, void 0, function* () {
      return this.client.fetch(`/admin/price-lists`, {
        method: "POST",
        headers,
        body,
        query
      });
    });
  }
  /**
   * This method updates a price list. It sends a request to the
   * [Update Price List](https://docs.medusajs.com/v2/api/admin#price-lists_postpricelistsid)
   * API route.
   *
   * @param id - The price list's ID.
   * @param body - The data to update in the price list.
   * @param query - Configure the fields to retrieve in the price list.
   * @param headers - Headers to pass in the request
   * @returns The price list's details.
   *
   * @example
   * sdk.admin.priceList.update("plist_123", {
   *   title: "My Price List",
   * })
   * .then(({ price_list }) => {
   *   console.log(price_list)
   * })
   */
  update(id, body, query, headers) {
    return __awaiter$t(this, void 0, void 0, function* () {
      return this.client.fetch(`/admin/price-lists/${id}`, {
        method: "POST",
        headers,
        body,
        query
      });
    });
  }
  /**
   * This method deletes a price list. It sends a request to the
   * [Delete Price List](https://docs.medusajs.com/v2/api/admin#price-lists_deletepricelistsid)
   * API route.
   *
   * @param id - The price list's ID.
   * @param headers - Headers to pass in the request
   * @returns The deletion's details.
   *
   * @example
   * sdk.admin.priceList.delete("plist_123")
   * .then(({ deleted }) => {
   *   console.log(deleted)
   * })
   */
  delete(id, headers) {
    return __awaiter$t(this, void 0, void 0, function* () {
      return this.client.fetch(`/admin/price-lists/${id}`, {
        method: "DELETE",
        headers
      });
    });
  }
  /**
   * This method manages the prices of a price list to create, update, or delete them.
   * It sends a request to the [Manage Prices](https://docs.medusajs.com/v2/api/admin#price-lists_postpricelistsidpricesbatch)
   * API route.
   *
   * @param id - The price list's ID.
   * @param body - The prices to create, update, or delete.
   * @param query - Configure the fields to retrieve in the price list.
   * @param headers - Headers to pass in the request
   * @returns The price list's details.
   *
   * @example
   * sdk.admin.priceList.batchPrices("plist_123", {
   *   create: [{
   *     variant_id: "variant_123",
   *     currency_code: "usd",
   *     amount: 10,
   *     rules: {
   *       region_id: "reg_123"
   *     }
   *   }],
   *   update: [{
   *     id: "price_123",
   *     variant_id: "variant_123",
   *     amount: 20,
   *   }],
   *   delete: ["price_123"]
   * })
   * .then(({ created, updated, deleted }) => {
   *   console.log(created, updated, deleted)
   * })
   */
  batchPrices(id, body, query, headers) {
    return __awaiter$t(this, void 0, void 0, function* () {
      return this.client.fetch(`/admin/price-lists/${id}/prices/batch`, {
        method: "POST",
        headers,
        body,
        query
      });
    });
  }
  /**
   * This method removes products from a price list. It sends a request to the
   * [Remove Product](https://docs.medusajs.com/v2/api/admin#price-lists_postpricelistsidproducts)
   * API route.
   *
   * @param id - The price list's ID.
   * @param body - The details of the products to remove.
   * @param query - Configure the fields to retrieve in the price list.
   * @param headers - Headers to pass in the request
   * @returns The price list's details.
   *
   * @example
   * sdk.admin.priceList.linkProducts("plist_123", {
   *   remove: ["prod_123"]
   * })
   * .then(({ price_list }) => {
   *   console.log(price_list)
   * })
   */
  linkProducts(id, body, query, headers) {
    return __awaiter$t(this, void 0, void 0, function* () {
      return this.client.fetch(`/admin/price-lists/${id}/products`, {
        method: "POST",
        headers,
        body,
        query
      });
    });
  }
}
var __awaiter$s = function(thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function(resolve) {
      resolve(value);
    });
  }
  return new (P || (P = Promise))(function(resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }
    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }
    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};
class PricePreference {
  /**
   * @ignore
   */
  constructor(client) {
    this.client = client;
  }
  /**
   * This method retrieves a price preference. It sends a request to the
   * [Get Price Preference](https://docs.medusajs.com/api/admin#price-preferences_getpricepreferencesid)
   * API route.
   *
   * @param id - The price preference's ID.
   * @param query - Configure the fields to retrieve in the price preference.
   * @param headers - Headers to pass in the request
   * @returns The price preference's details.
   *
   * @example
   * To retrieve a price preference by its ID:
   *
   * ```ts
   * sdk.admin.pricePreference.retrieve("prpref_123")
   * .then(({ price_preference }) => {
   *   console.log(price_preference)
   * })
   * ```
   *
   * To specify the fields and relations to retrieve:
   *
   * ```ts
   * sdk.admin.pricePreference.retrieve("prpref_123", {
   *   fields: "id,is_tax_inclusive"
   * })
   * .then(({ price_preference }) => {
   *   console.log(price_preference)
   * })
   * ```
   *
   * Learn more about the `fields` property in the [API reference](https://docs.medusajs.com/api/store#select-fields-and-relations).
   */
  retrieve(id, query, headers) {
    return __awaiter$s(this, void 0, void 0, function* () {
      return this.client.fetch(`/admin/price-preferences/${id}`, {
        method: "GET",
        headers,
        query
      });
    });
  }
  /**
   * This method retrieves a paginated list of price preferences. It sends a request to the
   * [List Price Preferences](https://docs.medusajs.com/api/admin#price-preferences_getpricepreferences) API route.
   *
   * @param query - Filters and pagination configurations.
   * @param headers - Headers to pass in the request.
   * @returns The paginated list of price preferences.
   *
   * @example
   * To retrieve the list of price preferences:
   *
   * ```ts
   * sdk.admin.pricePreference.list()
   * .then(({ price_preferences, count, limit, offset }) => {
   *   console.log(price_preferences)
   * })
   * ```
   *
   * To configure the pagination, pass the `limit` and `offset` query parameters.
   *
   * For example, to retrieve only 10 items and skip 10 items:
   *
   * ```ts
   * sdk.admin.pricePreference.list({
   *   limit: 10,
   *   offset: 10
   * })
   * .then(({ price_preferences, count, limit, offset }) => {
   *   console.log(price_preferences)
   * })
   * ```
   *
   * Using the `fields` query parameter, you can specify the fields and relations to retrieve
   * in each price preference:
   *
   * ```ts
   * sdk.admin.pricePreference.list({
   *   fields: "id,is_tax_inclusive"
   * })
   * .then(({ price_preferences, count, limit, offset }) => {
   *   console.log(price_preferences)
   * })
   * ```
   *
   * Learn more about the `fields` property in the [API reference](https://docs.medusajs.com/api/store#select-fields-and-relations).
   */
  list(query, headers) {
    return __awaiter$s(this, void 0, void 0, function* () {
      return this.client.fetch(`/admin/price-preferences`, {
        method: "GET",
        headers,
        query
      });
    });
  }
  /**
   * This method creates a price preference. It sends a request to the
   * [Create Price Preference](https://docs.medusajs.com/api/admin#price-preferences_postpricepreferences)
   * API route.
   *
   * @param body - The details of the price preference to create.
   * @param query - Configure the fields to retrieve in the price preference.
   * @param headers - Headers to pass in the request
   * @returns The price preference's details.
   *
   * @example
   * sdk.admin.pricePreference.create({
   *   attribute: "region_id",
   *   value: "region_123",
   *   is_tax_inclusive: true
   * })
   * .then(({ price_preference }) => {
   *   console.log(price_preference)
   * })
   */
  create(body, query, headers) {
    return __awaiter$s(this, void 0, void 0, function* () {
      return this.client.fetch(`/admin/price-preferences`, {
        method: "POST",
        headers,
        body,
        query
      });
    });
  }
  /**
   * This method updates a price preference. It sends a request to the
   * [Update Price Preference](https://docs.medusajs.com/api/admin#price-preferences_postpricepreferencesid)
   * API route.
   *
   * @param id - The price preference's ID.
   * @param body - The data to update in the price preference.
   * @param query - Configure the fields to retrieve in the price preference.
   * @param headers - Headers to pass in the request
   * @returns The price preference's details.
   *
   * @example
   * sdk.admin.pricePreference.update("prpref_123", {
   *   is_tax_inclusive: true
   * })
   * .then(({ price_preference }) => {
   *   console.log(price_preference)
   * })
   */
  update(id, body, query, headers) {
    return __awaiter$s(this, void 0, void 0, function* () {
      return this.client.fetch(`/admin/price-preferences/${id}`, {
        method: "POST",
        headers,
        body,
        query
      });
    });
  }
  /**
   * This method deletes a price preference. It sends a request to the
   * [Delete Price Preference](https://docs.medusajs.com/api/admin#price-preferences_deletepricepreferencesid)
   * API route.
   *
   * @param id - The price preference's ID.
   * @param headers - Headers to pass in the request
   * @returns The deletion's details.
   *
   * @example
   * sdk.admin.pricePreference.delete("prpref_123")
   * .then(({ deleted }) => {
   *   console.log(deleted)
   * })
   */
  delete(id, headers) {
    return __awaiter$s(this, void 0, void 0, function* () {
      return this.client.fetch(`/admin/price-preferences/${id}`, {
        method: "DELETE",
        headers
      });
    });
  }
}
var __awaiter$r = function(thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function(resolve) {
      resolve(value);
    });
  }
  return new (P || (P = Promise))(function(resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }
    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }
    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};
const PUBLISHABLE_KEY_HEADER = "x-publishable-api-key";
const getBaseUrl = (passedBaseUrl) => {
  if (typeof window === "undefined") {
    return passedBaseUrl;
  }
  if (passedBaseUrl === "" || passedBaseUrl === "/") {
    return window.location.origin;
  }
  return passedBaseUrl;
};
const hasStorage = (storage) => {
  if (typeof window !== "undefined") {
    return storage in window;
  }
  return false;
};
const toBase64 = (str) => {
  if (typeof window !== "undefined") {
    return window.btoa(str);
  }
  return Buffer.from(str).toString("base64");
};
const sanitizeHeaders = (headers) => {
  return Object.assign(Object.assign({}, Object.fromEntries(headers.entries())), { authorization: "<REDACTED>" });
};
const normalizeRequest = (init, headers, config2) => {
  var _a, _b, _c;
  let body = init === null || init === void 0 ? void 0 : init.body;
  if (body && ((_a = headers.get("content-type")) === null || _a === void 0 ? void 0 : _a.includes("application/json"))) {
    body = JSON.stringify(body);
  }
  const isFetchCredentialsSupported = "credentials" in Request.prototype;
  const credentials = ((_b = config2.auth) === null || _b === void 0 ? void 0 : _b.type) === "session" ? ((_c = config2.auth) === null || _c === void 0 ? void 0 : _c.fetchCredentials) || "include" : "omit";
  return Object.assign(Object.assign(Object.assign({}, init), { headers, credentials: isFetchCredentialsSupported ? credentials : void 0 }), body ? { body } : {});
};
const normalizeResponse = (resp, reqHeaders) => __awaiter$r(void 0, void 0, void 0, function* () {
  var _a, _b;
  if (resp.status >= 300) {
    const jsonError = yield resp.json().catch(() => ({}));
    throw new FetchError((_a = jsonError.message) !== null && _a !== void 0 ? _a : resp.statusText, resp.statusText, resp.status);
  }
  const isJsonRequest = (_b = reqHeaders.get("accept")) === null || _b === void 0 ? void 0 : _b.includes("application/json");
  return isJsonRequest ? yield resp.json() : resp;
});
class FetchError extends Error {
  constructor(message, statusText, status) {
    super(message);
    this.statusText = statusText;
    this.status = status;
  }
}
class Client {
  constructor(config2) {
    this.DEFAULT_JWT_STORAGE_KEY = "medusa_auth_token";
    this.token = "";
    this.getApiKeyHeader_ = () => {
      return this.config.apiKey ? { Authorization: "Basic " + toBase64(this.config.apiKey + ":") } : {};
    };
    this.getPublishableKeyHeader_ = () => {
      return this.config.publishableKey ? { [PUBLISHABLE_KEY_HEADER]: this.config.publishableKey } : {};
    };
    this.getTokenStorageInfo_ = () => {
      var _a, _b, _c;
      const hasLocal = hasStorage("localStorage");
      const hasSession = hasStorage("sessionStorage");
      const hasCustom = Boolean((_a = this.config.auth) === null || _a === void 0 ? void 0 : _a.storage);
      const storageMethod = ((_b = this.config.auth) === null || _b === void 0 ? void 0 : _b.jwtTokenStorageMethod) || (hasLocal ? "local" : "nostore");
      const storageKey = ((_c = this.config.auth) === null || _c === void 0 ? void 0 : _c.jwtTokenStorageKey) || this.DEFAULT_JWT_STORAGE_KEY;
      if (!hasLocal && storageMethod === "local") {
        this.throwError_("Local JWT storage is only available in the browser");
      }
      if (!hasSession && storageMethod === "session") {
        this.throwError_("Session JWT storage is only available in the browser");
      }
      if (!hasCustom && storageMethod === "custom") {
        this.throwError_("Custom storage was not provided in the config");
      }
      return {
        storageMethod,
        storageKey
      };
    };
    this.config = Object.assign(Object.assign({}, config2), { baseUrl: getBaseUrl(config2.baseUrl) });
    const logger = config2.logger || {
      error: console.error,
      warn: console.warn,
      info: console.info,
      debug: console.debug
    };
    this.logger = Object.assign(Object.assign({}, logger), { debug: config2.debug ? logger.debug : () => {
    } });
    this.fetch_ = this.initClient();
  }
  /**
   * `fetch` closely follows (and uses under the hood) the native `fetch` API. There are, however, few key differences:
   * - Non 2xx statuses throw a `FetchError` with the status code as the `status` property, rather than resolving the promise
   * - You can pass `body` and `query` as objects, and they will be encoded and stringified.
   * - The response gets parsed as JSON if the `accept` header is set to `application/json`, otherwise the raw Response object is returned
   *
   * Since the response is dynamically determined, we cannot know if it is JSON or not. Therefore, it is important to pass `Response` as the return type
   *
   * @param input: FetchInput
   * @param init: FetchArgs
   * @returns Promise<T>
   */
  fetch(input, init) {
    return this.fetch_(input, init);
  }
  /**
   * `fetchStream` is a helper method to deal with server-sent events. It returns an object with a stream and an abort function.
   * It follows a very similar interface to `fetch`, with the return value being an async generator.
   * The stream is an async generator that yields `ServerSentEventMessage` objects, which contains the event name, stringified data, and few other properties.
   * The caller is responsible for handling `disconnect` events and aborting the stream. The caller is also responsible for parsing the data field.
   *
   * @param input: FetchInput
   * @param init: FetchArgs
   * @returns FetchStreamResponse
   */
  fetchStream(input, init) {
    return __awaiter$r(this, void 0, void 0, function* () {
      const abortController = new AbortController();
      const abortFunc = abortController.abort.bind(abortController);
      let res = yield this.fetch_(input, Object.assign(Object.assign({}, init), { signal: abortController.signal, headers: Object.assign(Object.assign({}, init === null || init === void 0 ? void 0 : init.headers), { accept: "text/event-stream" }) }));
      if (res.ok) {
        return { stream: events(res, abortController.signal), abort: abortFunc };
      }
      return { stream: null, abort: abortFunc };
    });
  }
  setToken(token) {
    return __awaiter$r(this, void 0, void 0, function* () {
      yield this.setToken_(token);
    });
  }
  getToken() {
    return __awaiter$r(this, void 0, void 0, function* () {
      return yield this.getToken_();
    });
  }
  clearToken() {
    return __awaiter$r(this, void 0, void 0, function* () {
      yield this.clearToken_();
    });
  }
  clearToken_() {
    return __awaiter$r(this, void 0, void 0, function* () {
      var _a, _b;
      const { storageMethod, storageKey } = this.getTokenStorageInfo_();
      switch (storageMethod) {
        case "local": {
          window.localStorage.removeItem(storageKey);
          break;
        }
        case "session": {
          window.sessionStorage.removeItem(storageKey);
          break;
        }
        case "custom": {
          yield (_b = (_a = this.config.auth) === null || _a === void 0 ? void 0 : _a.storage) === null || _b === void 0 ? void 0 : _b.removeItem(storageKey);
          break;
        }
        case "memory": {
          this.token = "";
          break;
        }
      }
    });
  }
  initClient() {
    const defaultHeaders = new Headers(Object.assign(Object.assign({ "content-type": "application/json", accept: "application/json" }, this.getApiKeyHeader_()), this.getPublishableKeyHeader_()));
    this.logger.debug("Initiating Medusa client with default headers:\n", `${JSON.stringify(sanitizeHeaders(defaultHeaders), null, 2)}
`);
    return (input, init) => __awaiter$r(this, void 0, void 0, function* () {
      const headers = new Headers(defaultHeaders);
      const customHeaders = Object.assign(Object.assign(Object.assign({}, this.config.globalHeaders), yield this.getJwtHeader_()), init === null || init === void 0 ? void 0 : init.headers);
      Object.entries(customHeaders).forEach(([key, value]) => {
        if (value === null) {
          headers.delete(key);
        } else {
          headers.set(key, value);
        }
      });
      let normalizedInput = input;
      if (input instanceof URL || typeof input === "string") {
        const baseUrl = new URL(this.config.baseUrl);
        const fullPath = `${baseUrl.pathname.replace(/\/$/, "")}/${input.toString().replace(/^\//, "")}`;
        normalizedInput = new URL(fullPath, baseUrl.origin);
        if (init === null || init === void 0 ? void 0 : init.query) {
          const params = Object.fromEntries(normalizedInput.searchParams.entries());
          const stringifiedQuery = stringify(Object.assign(Object.assign({}, params), init.query), { skipNulls: true });
          normalizedInput.search = stringifiedQuery;
        }
      }
      this.logger.debug("Performing request to:\n", `URL: ${normalizedInput.toString()}
`, `Headers: ${JSON.stringify(sanitizeHeaders(headers), null, 2)}
`);
      return yield fetch(normalizedInput, normalizeRequest(init, headers, this.config)).then((resp) => {
        this.logger.debug(`Received response with status ${resp.status}
`);
        return normalizeResponse(resp, headers);
      });
    });
  }
  getJwtHeader_() {
    return __awaiter$r(this, void 0, void 0, function* () {
      var _a;
      if (((_a = this.config.auth) === null || _a === void 0 ? void 0 : _a.type) === "session") {
        return {};
      }
      const token = yield this.getToken_();
      return token ? { Authorization: `Bearer ${token}` } : {};
    });
  }
  setToken_(token) {
    return __awaiter$r(this, void 0, void 0, function* () {
      var _a, _b;
      const { storageMethod, storageKey } = this.getTokenStorageInfo_();
      switch (storageMethod) {
        case "local": {
          window.localStorage.setItem(storageKey, token);
          break;
        }
        case "session": {
          window.sessionStorage.setItem(storageKey, token);
          break;
        }
        case "custom": {
          yield (_b = (_a = this.config.auth) === null || _a === void 0 ? void 0 : _a.storage) === null || _b === void 0 ? void 0 : _b.setItem(storageKey, token);
          break;
        }
        case "memory": {
          this.token = token;
          break;
        }
      }
    });
  }
  getToken_() {
    return __awaiter$r(this, void 0, void 0, function* () {
      var _a, _b;
      const { storageMethod, storageKey } = this.getTokenStorageInfo_();
      switch (storageMethod) {
        case "local": {
          return window.localStorage.getItem(storageKey);
        }
        case "session": {
          return window.sessionStorage.getItem(storageKey);
        }
        case "custom": {
          return yield (_b = (_a = this.config.auth) === null || _a === void 0 ? void 0 : _a.storage) === null || _b === void 0 ? void 0 : _b.getItem(storageKey);
        }
        case "memory": {
          return this.token;
        }
      }
      return null;
    });
  }
  throwError_(message) {
    this.logger.error(message);
    throw new Error(message);
  }
}
var __awaiter$q = function(thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function(resolve) {
      resolve(value);
    });
  }
  return new (P || (P = Promise))(function(resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }
    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }
    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};
class Product {
  /**
   * @ignore
   */
  constructor(client) {
    this.client = client;
  }
  /**
   * This method creates a product import. The products are only imported after
   * the import is confirmed using the {@link confirmImport} method.
   *
   * This method sends a request to the
   * [Create Product Import](https://docs.medusajs.com/api/admin#products_postproductsimport)
   * API route.
   *
   * @param body - The import's details.
   * @param query - Query parameters to pass to the request.
   * @param headers - Headers to pass in the request.
   * @returns The import's details.
   *
   * @example
   * sdk.admin.product.import({
   *   file // uploaded File instance
   * })
   * .then(({ transaction_id }) => {
   *   console.log(transaction_id)
   * })
   */
  import(body, query, headers) {
    return __awaiter$q(this, void 0, void 0, function* () {
      const form = new FormData();
      form.append("file", body.file);
      return yield this.client.fetch(`/admin/products/import`, {
        method: "POST",
        headers: Object.assign(Object.assign({}, headers), {
          // Let the browser determine the content type.
          "content-type": null
        }),
        body: form,
        query
      });
    });
  }
  /**
   * This method creates a product import. The products are only imported after
   * the import is confirmed using the {@link confirmImport} method.
   *
   * This method sends a request to the
   * [Create Product Import](https://docs.medusajs.com/api/admin#products_postproductsimports)
   * API route.
   *
   * @since 2.8.5
   *
   * @param body - The import's details.
   * @param query - Query parameters to pass to the request.
   * @param headers - Headers to pass in the request.
   * @returns The import's details.
   *
   * @example
   * sdk.admin.product.createImport({
   *   file // uploaded File instance
   * })
   * .then(({ transaction_id }) => {
   *   console.log(transaction_id)
   * })
   */
  createImport(body, query, headers) {
    return __awaiter$q(this, void 0, void 0, function* () {
      const response = yield this.client.fetch("admin/uploads/presigned-urls", {
        method: "POST",
        headers,
        body: {
          originalname: body.file.name,
          mime_type: body.file.type,
          size: body.file.size
        },
        query
      });
      if (response.url.startsWith("http://") || response.url.startsWith("https://")) {
        const uploadResponse = yield fetch(response.url, {
          method: "PUT",
          body: body.file
        });
        if (uploadResponse.status >= 400) {
          throw new FetchError(uploadResponse.statusText, uploadResponse.statusText, uploadResponse.status);
        }
      } else {
        const form = new FormData();
        form.append("files", body.file);
        const localUploadResponse = yield this.client.fetch("admin/uploads", {
          method: "POST",
          headers: Object.assign(Object.assign({}, headers), {
            // Let the browser determine the content type.
            "content-type": null
          }),
          body: form,
          query
        });
        response.filename = localUploadResponse.files[0].id;
      }
      return yield this.client.fetch("/admin/products/imports", {
        method: "POST",
        headers: Object.assign({}, headers),
        body: {
          file_key: response.filename,
          originalname: response.originalname,
          extension: response.extension,
          size: response.size,
          mime_type: response.mime_type
        },
        query
      });
    });
  }
  /**
   * This method confirms a product import created using the method {@link import}.
   * It sends a request to the
   * [Confirm Product Import](https://docs.medusajs.com/api/admin#products_postproductsimporttransaction_idconfirm)
   * API route.
   *
   * @since 2.8.5
   *
   * @param transactionId - The ID of the transaction of the created product import. This is returned
   * by the API route used to create the product import.
   * @param query - Query parameters to pass in the request.
   * @param headers - Headers to pass in the request.
   *
   * @example
   * sdk.admin.product.confirmImport("transaction_123")
   * .then(() => {
   *   console.log("Import confirmed")
   * })
   */
  confirmImport(transactionId, query, headers) {
    return __awaiter$q(this, void 0, void 0, function* () {
      return yield this.client.fetch(`/admin/products/imports/${transactionId}/confirm`, {
        method: "POST",
        headers,
        body: {},
        query
      });
    });
  }
  /**
   * This method starts a product export process to retrieve a CSV of exported products.
   *
   * You'll receive in the response the transaction ID of the workflow generating the CSV file.
   * To check the status of the execution, send a `GET` request to
   * `/admin/workflows-executions/export-products/:transaction-id`.
   *
   * Once the execution finishes successfully, a notification is created for the export.
   * You can retrieve the notifications using the `/admin/notification` API route to
   * retrieve the file's download URL.
   *
   * This method sends a request to the [Export Product](https://docs.medusajs.com/api/admin#products_postproductsexport)
   * API route.
   *
   * @param body - The export's details.
   * @param query - Filters to specify which products to export.
   * @param headers - Headers to pass in the request.
   * @returns The export's details.
   *
   * @example
   * sdk.admin.product.export({})
   * .then(({ transaction_id }) => {
   *   console.log(transaction_id)
   * })
   */
  export(body, query, headers) {
    return __awaiter$q(this, void 0, void 0, function* () {
      return yield this.client.fetch(`/admin/products/export`, {
        method: "POST",
        headers,
        body,
        query
      });
    });
  }
  /**
   * This method manages products to create, update, or delete them. It sends a request to the
   * [Manage Products](https://docs.medusajs.com/api/admin#products_postproductsbatch)
   * API route.
   *
   * @param body - The products to create, update, or delete.
   * @param query - Configure the fields to retrieve in the products.
   * @param headers - Headers to pass in the request
   * @returns The batch operations details.
   *
   * @example
   * sdk.admin.product.batch({
   *   create: [
   *     {
   *       title: "Shirt",
   *       options: [{
   *         title: "Default",
   *         values: ["Default Option"]
   *       }],
   *       variants: [
   *         {
   *           title: "Default",
   *           options: {
   *             Default: "Default Option"
   *           },
   *           prices: []
   *         }
   *       ]
   *     }
   *   ],
   *   update: [{
   *     id: "prod_123",
   *     title: "Pants"
   *   }],
   *   delete: ["prod_321"]
   * })
   * .then(({ created, updated, deleted }) => {
   *   console.log(created, updated, deleted)
   * })
   */
  batch(body, query, headers) {
    return __awaiter$q(this, void 0, void 0, function* () {
      return yield this.client.fetch(`/admin/products/batch`, {
        method: "POST",
        headers,
        body,
        query
      });
    });
  }
  /**
   * This method creates a product. It sends a request to the
   * [Create Product](https://docs.medusajs.com/api/admin#products_postproducts)
   * API route.
   *
   * @param body - The product's details.
   * @param query - Configure the fields to retrieve in the product.
   * @param headers - Headers to pass in the request
   * @returns The product's details.
   *
   * @example
   * sdk.admin.product.create({
   *   title: "Shirt",
   *   options: [{
   *     title: "Default",
   *     values: ["Default Option"]
   *   }],
   *   variants: [
   *     {
   *       title: "Default",
   *       options: {
   *         Default: "Default Option"
   *       },
   *       prices: []
   *     }
   *   ],
   *   shipping_profile_id: "sp_123"
   * })
   * .then(({ product }) => {
   *   console.log(product)
   * })
   */
  create(body, query, headers) {
    return __awaiter$q(this, void 0, void 0, function* () {
      return yield this.client.fetch(`/admin/products`, {
        method: "POST",
        headers,
        body,
        query
      });
    });
  }
  /**
   * This method updates a product. It sends a request to the
   * [Update Product](https://docs.medusajs.com/api/admin#products_postproductsid)
   * API route.
   *
   * @param id - The product's ID.
   * @param body - The data to update in the product.
   * @param query - Configure the fields to retrieve in the product.
   * @param headers - Headers to pass in the request
   * @returns The product's details.
   *
   * @example
   * sdk.admin.product.update("prod_123", {
   *   title: "Shirt",
   * })
   * .then(({ product }) => {
   *   console.log(product)
   * })
   */
  update(id, body, query, headers) {
    return __awaiter$q(this, void 0, void 0, function* () {
      return yield this.client.fetch(`/admin/products/${id}`, {
        method: "POST",
        headers,
        body,
        query
      });
    });
  }
  /**
   * This method retrieves a paginated list of products. It sends a request to the
   * [List Products](https://docs.medusajs.com/api/admin#products_getproducts) API route.
   *
   * @param queryParams - Filters and pagination configurations.
   * @param headers - Headers to pass in the request.
   * @returns The paginated list of products.
   *
   * @example
   * To retrieve the list of products:
   *
   * ```ts
   * sdk.admin.product.list()
   * .then(({ products, count, limit, offset }) => {
   *   console.log(products)
   * })
   * ```
   *
   * To configure the pagination, pass the `limit` and `offset` query parameters.
   *
   * For example, to retrieve only 10 items and skip 10 items:
   *
   * ```ts
   * sdk.admin.product.list({
   *   limit: 10,
   *   offset: 10
   * })
   * .then(({ products, count, limit, offset }) => {
   *   console.log(products)
   * })
   * ```
   *
   * Using the `fields` query parameter, you can specify the fields and relations to retrieve
   * in each products:
   *
   * ```ts
   * sdk.admin.product.list({
   *   fields: "id,*variants"
   * })
   * .then(({ products, count, limit, offset }) => {
   *   console.log(products)
   * })
   * ```
   *
   * Learn more about the `fields` property in the [API reference](https://docs.medusajs.com/api/store#select-fields-and-relations).
   */
  list(queryParams, headers) {
    return __awaiter$q(this, void 0, void 0, function* () {
      return yield this.client.fetch(`/admin/products`, {
        headers,
        query: queryParams
      });
    });
  }
  /**
   * This method retrieves a product by its ID. It sends a request to the
   * [Get Product](https://docs.medusajs.com/api/admin#products_getproductsid)
   * API route.
   *
   * @param id - The product's ID.
   * @param query - Configure the fields to retrieve in the product.
   * @param headers - Headers to pass in the request
   * @returns The product's details.
   *
   * @example
   * To retrieve a product by its ID:
   *
   * ```ts
   * sdk.admin.product.retrieve("prod_123")
   * .then(({ product }) => {
   *   console.log(product)
   * })
   * ```
   *
   * To specify the fields and relations to retrieve:
   *
   * ```ts
   * sdk.admin.product.retrieve("prod_123", {
   *   fields: "id,*variants"
   * })
   * .then(({ product }) => {
   *   console.log(product)
   * })
   * ```
   *
   * Learn more about the `fields` property in the [API reference](https://docs.medusajs.com/api/store#select-fields-and-relations).
   */
  retrieve(id, query, headers) {
    return __awaiter$q(this, void 0, void 0, function* () {
      return yield this.client.fetch(`/admin/products/${id}`, {
        query,
        headers
      });
    });
  }
  /**
   * This method deletes a product. It sends a request to the
   * [Delete Product](https://docs.medusajs.com/api/admin#products_deleteproductsid)
   * API route.
   *
   * @param id - The product's ID.
   * @param headers - Headers to pass in the request
   * @returns The deletion's details.
   *
   * @example
   * sdk.admin.product.delete("prod_123")
   * .then(({ deleted }) => {
   *   console.log(deleted)
   * })
   */
  delete(id, headers) {
    return __awaiter$q(this, void 0, void 0, function* () {
      return yield this.client.fetch(`/admin/products/${id}`, {
        method: "DELETE",
        headers
      });
    });
  }
  /**
   * This method manages the variants of a product. It sends a request to the
   * [Manage Variants](https://docs.medusajs.com/api/admin#products_postproductsidvariantsbatch)
   * API route.
   *
   * @param productId - The product's ID.
   * @param body - The variants to create, update, or delete.
   * @param query - Configure the fields to retrieve in the product variants.
   * @param headers - Headers to pass in the request
   * @returns The product variants' details.
   *
   * @example
   * sdk.admin.product.batchVariants("prod_123", {
   *   create: [
   *     {
   *       title: "Blue Shirt",
   *       options: {
   *         Color: "Blue"
   *       },
   *       prices: []
   *     }
   *   ],
   *   update: [
   *     {
   *       id: "variant_123",
   *       title: "Pants"
   *     }
   *   ],
   *   delete: ["variant_123"]
   * })
   * .then(({ created, updated, deleted }) => {
   *   console.log(created, updated, deleted)
   * })
   */
  batchVariants(productId, body, query, headers) {
    return __awaiter$q(this, void 0, void 0, function* () {
      return yield this.client.fetch(`/admin/products/${productId}/variants/batch`, {
        method: "POST",
        headers,
        body,
        query
      });
    });
  }
  /**
   * This method creates a variant for a product. It sends a request to the
   * [Create Variant](https://docs.medusajs.com/api/admin#products_postproductsidvariants)
   * API route.
   *
   * @param productId - The product's ID.
   * @param body - The variant's details.
   * @param query - Configure the fields to retrieve in the product.
   * @param headers - Headers to pass in the request
   * @returns The product's details.
   *
   * @example
   * sdk.admin.product.createVariant("prod_123", {
   *   title: "Blue Shirt",
   *   options: {
   *     Color: "Blue"
   *   },
   *   prices: [
   *     {
   *       amount: 10,
   *       currency_code: "usd"
   *     }
   *   ]
   * })
   * .then(({ product }) => {
   *   console.log(product)
   * })
   */
  createVariant(productId, body, query, headers) {
    return __awaiter$q(this, void 0, void 0, function* () {
      return yield this.client.fetch(`/admin/products/${productId}/variants`, {
        method: "POST",
        headers,
        body,
        query
      });
    });
  }
  /**
   * This method updates a variant of a product. It sends a request to the
   * [Update Variant](https://docs.medusajs.com/api/admin#products_postproductsidvariantsvariant_id)
   * API route.
   *
   * @param productId - The product's ID.
   * @param id - The variant's ID.
   * @param body - The data to update in the variant.
   * @param query - Configure the fields to retrieve in the product.
   * @param headers - Headers to pass in the request
   * @returns The product's details.
   *
   * @example
   * sdk.admin.product.updateVariant(
   *   "prod_123",
   *   "variant_123",
   *     {
   *     title: "Blue Shirt",
   *   }
   * )
   * .then(({ product }) => {
   *   console.log(product)
   * })
   */
  updateVariant(productId, id, body, query, headers) {
    return __awaiter$q(this, void 0, void 0, function* () {
      return yield this.client.fetch(`/admin/products/${productId}/variants/${id}`, {
        method: "POST",
        headers,
        body,
        query
      });
    });
  }
  /**
   * This method retrieves a paginated list of products. It sends a request to the
   * [List Products](https://docs.medusajs.com/api/admin#products_getproductsidvariants) API route.
   *
   * @param productId - The ID of the product to retrieve its variants.
   * @param query - Filters and pagination configurations.
   * @param headers - Headers to pass in the request.
   * @returns The paginated list of product variants.
   *
   * @example
   * To retrieve the list of product variants:
   *
   * ```ts
   * sdk.admin.product.listVariants("prod_123")
   * .then(({ variants, count, limit, offset }) => {
   *   console.log(variants)
   * })
   * ```
   *
   * To configure the pagination, pass the `limit` and `offset` query parameters.
   *
   * For example, to retrieve only 10 items and skip 10 items:
   *
   * ```ts
   * sdk.admin.product.listVariants("prod_123", {
   *   limit: 10,
   *   offset: 10
   * })
   * .then(({ variants, count, limit, offset }) => {
   *   console.log(variants)
   * })
   * ```
   *
   * Using the `fields` query parameter, you can specify the fields and relations to retrieve
   * in each product variant:
   *
   * ```ts
   * sdk.admin.product.listVariants("prod_123", {
   *   fields: "id,*product"
   * })
   * .then(({ variants, count, limit, offset }) => {
   *   console.log(variants)
   * })
   * ```
   *
   * Learn more about the `fields` property in the [API reference](https://docs.medusajs.com/api/store#select-fields-and-relations).
   */
  listVariants(productId, query, headers) {
    return __awaiter$q(this, void 0, void 0, function* () {
      return yield this.client.fetch(`/admin/products/${productId}/variants`, {
        headers,
        query
      });
    });
  }
  /**
   * This method retrieves a product's variant. It sends a request to the
   * [Retrieve Variant](https://docs.medusajs.com/api/admin#products_getproductsidvariantsvariant_id)
   * API route.
   *
   * @param productId - The product's ID.
   * @param id - The variant's ID.
   * @param query - Configure the fields to retrieve in the product variant.
   * @param headers - Headers to pass in the request
   * @returns The product variant's details.
   *
   * @example
   * To retrieve a product variant by its ID:
   *
   * ```ts
   * sdk.admin.product.retrieveVariant(
   *   "prod_123",
   *   "variant_123"
   * )
   * .then(({ variant }) => {
   *   console.log(variant)
   * })
   * ```
   *
   * To specify the fields and relations to retrieve:
   *
   * ```ts
   * sdk.admin.product.retrieveVariant(
   *   "prod_123",
   *   "variant_123",
   *   {
   *     fields: "id, *product"
   *   }
   * )
   * .then(({ variant }) => {
   *   console.log(variant)
   * })
   * ```
   *
   * Learn more about the `fields` property in the [API reference](https://docs.medusajs.com/api/store#select-fields-and-relations).
   */
  retrieveVariant(productId, id, query, headers) {
    return __awaiter$q(this, void 0, void 0, function* () {
      return yield this.client.fetch(`/admin/products/${productId}/variants/${id}`, {
        query,
        headers
      });
    });
  }
  /**
   * This method deletes a product's variant. It sends a request to the
   * [Delete Variant](https://docs.medusajs.com/api/admin#products_deleteproductsidvariantsvariant_id)
   * API route.
   *
   * @param productId - The product's ID.
   * @param id - The ID of the variant.
   * @param headers - Headers to pass in the request
   * @returns The deletion's details.
   *
   * @example
   * sdk.admin.product.deleteVariant("prod_123", "variant_123")
   * .then(({ deleted }) => {
   *   console.log(deleted)
   * })
   */
  deleteVariant(productId, id, headers) {
    return __awaiter$q(this, void 0, void 0, function* () {
      return yield this.client.fetch(`/admin/products/${productId}/variants/${id}`, {
        method: "DELETE",
        headers
      });
    });
  }
  /**
   * This method manages a product's variant's inventories to associate them with inventory items,
   * update their inventory items, or delete their association with inventory items.
   *
   * It sends a request to the
   * [Manage Variant Inventory](https://docs.medusajs.com/api/admin#products_postproductsidvariantsinventoryitemsbatch)
   * API route.
   *
   * @param productId - The ID of the product that the variant belongs to.
   * @param body - The inventory items to create, update, or delete.
   * @param query - Pass query parameters in the request.
   * @param headers - Headers to pass in the request
   * @returns The details of the created, updated, or deleted inventory items.
   *
   * @example
   * sdk.admin.product.batchVariantInventoryItems(
   *   "prod_123",
   *   {
   *     create: [
   *       {
   *         inventory_item_id: "iitem_123",
   *         variant_id: "variant_123",
   *         required_quantity: 10
   *       }
   *     ],
   *     update: [
   *       {
   *         inventory_item_id: "iitem_1234",
   *         variant_id: "variant_1234",
   *         required_quantity: 20
   *       }
   *     ],
   *     delete: [
   *       {
   *         inventory_item_id: "iitem_321",
   *         variant_id: "variant_321"
   *       }
   *     ]
   *   }
   * )
   * .then(({ created, updated, deleted }) => {
   *   console.log(created, updated, deleted)
   * })
   */
  batchVariantInventoryItems(productId, body, query, headers) {
    return __awaiter$q(this, void 0, void 0, function* () {
      return yield this.client.fetch(`/admin/products/${productId}/variants/inventory-items/batch`, {
        method: "POST",
        headers,
        body,
        query
      });
    });
  }
  /**
   * This method creates an option in a product. It sends a request to the
   * [Create Option](https://docs.medusajs.com/api/admin#products_postproductsidoptions)
   * API route.
   *
   * @param productId - The product's ID.
   * @param body - The option's details.
   * @param query - Configure the fields to retrieve in the product.
   * @param headers - Headers to pass in the request
   * @returns The product's details.
   *
   * @example
   * sdk.admin.product.createOption(
   *   "prod_123",
   *   {
   *     title: "Color",
   *     values: ["Green", "Blue"]
   *   }
   * )
   * .then(({ product }) => {
   *   console.log(product)
   * })
   */
  createOption(productId, body, query, headers) {
    return __awaiter$q(this, void 0, void 0, function* () {
      return yield this.client.fetch(`/admin/products/${productId}/options`, {
        method: "POST",
        headers,
        body,
        query
      });
    });
  }
  /**
   * This method updates a product's option. It sends a request to the
   * [Update Option](https://docs.medusajs.com/api/admin#products_postproductsidoptionsoption_id)
   * API route.
   *
   * @param productId - The product's ID.
   * @param id - The ID of the option to update.
   * @param body - The data to update in the option.
   * @param query - Configure the fields to retrieve in the product.
   * @param headers - Headers to pass in the request
   * @returns The product's details.
   *
   * @example
   * sdk.admin.product.updateOption(
   *   "prod_123",
   *   "prodopt_123",
   *   {
   *     title: "Color"
   *   }
   * )
   * .then(({ product }) => {
   *   console.log(product)
   * })
   */
  updateOption(productId, id, body, query, headers) {
    return __awaiter$q(this, void 0, void 0, function* () {
      return yield this.client.fetch(`/admin/products/${productId}/options/${id}`, {
        method: "POST",
        headers,
        body,
        query
      });
    });
  }
  /**
   * This method retrieves a paginated list of product options. It sends a request to the
   * [List Options](https://docs.medusajs.com/api/admin#products_getproductsidoptions) API route.
   *
   * @param productId - The ID of the product to retrieve its options
   * @param query - Filters and pagination configurations.
   * @param headers - Headers to pass in the request.
   * @returns The paginated list of product options.
   *
   * @example
   * To retrieve the list of product options:
   *
   * ```ts
   * sdk.admin.product.listOptions("prod_123")
   * .then(({ product_options, count, limit, offset }) => {
   *   console.log(product_options)
   * })
   * ```
   *
   * To configure the pagination, pass the `limit` and `offset` query parameters.
   *
   * For example, to retrieve only 10 items and skip 10 items:
   *
   * ```ts
   * sdk.admin.product.listOptions("prod_123", {
   *   limit: 10,
   *   offset: 10
   * })
   * .then(({ product_options, count, limit, offset }) => {
   *   console.log(product_options)
   * })
   * ```
   *
   * Using the `fields` query parameter, you can specify the fields and relations to retrieve
   * in each product options:
   *
   * ```ts
   * sdk.admin.product.listOptions("prod_123", {
   *   fields: "id,title"
   * })
   * .then(({ product_options, count, limit, offset }) => {
   *   console.log(product_options)
   * })
   * ```
   *
   * Learn more about the `fields` property in the [API reference](https://docs.medusajs.com/api/store#select-fields-and-relations).
   */
  listOptions(productId, query, headers) {
    return __awaiter$q(this, void 0, void 0, function* () {
      return yield this.client.fetch(`/admin/products/${productId}/options`, {
        headers,
        query
      });
    });
  }
  /**
   * This method retrieves a product's option. It sends a request to the
   * [Get Option](https://docs.medusajs.com/api/admin#products_getproductsidoptionsoption_id)
   * API route.
   *
   * @param productId - The product's ID.
   * @param id - The product option's ID.
   * @param query - Configure the fields to retrieve in the product option.
   * @param headers - Headers to pass in the request
   * @returns The product option's details.
   *
   * @example
   * To retrieve a product option by its ID:
   *
   * ```ts
   * sdk.admin.product.retrieveOption(
   *   "prod_123",
   *   "prodopt_123"
   * )
   * .then(({ product_option }) => {
   *   console.log(product_option)
   * })
   * ```
   *
   * To specify the fields and relations to retrieve:
   *
   * ```ts
   * sdk.admin.product.retrieveOption(
   *   "prod_123",
   *   "prodopt_123",
   *   {
   *     fields: "id,title"
   *   }
   * )
   * .then(({ product_option }) => {
   *   console.log(product_option)
   * })
   * ```
   *
   * Learn more about the `fields` property in the [API reference](https://docs.medusajs.com/api/store#select-fields-and-relations).
   */
  retrieveOption(productId, id, query, headers) {
    return __awaiter$q(this, void 0, void 0, function* () {
      return yield this.client.fetch(`/admin/products/${productId}/options/${id}`, {
        query,
        headers
      });
    });
  }
  /**
   * This method deletes a product's option. It sends a request to the
   * [Delete Option](https://docs.medusajs.com/api/admin#products_deleteproductsidoptionsoption_id)
   * API route.
   *
   * @param productId - The product's ID.
   * @param id - The option's ID.
   * @param headers - Headers to pass in the request
   * @returns The deletion's details.
   *
   * @example
   * sdk.admin.product.deleteOption("prod_123", "prodopt_123")
   * .then(({ deleted }) => {
   *   console.log(deleted)
   * })
   */
  deleteOption(productId, id, headers) {
    return __awaiter$q(this, void 0, void 0, function* () {
      return yield this.client.fetch(`/admin/products/${productId}/options/${id}`, {
        method: "DELETE",
        headers
      });
    });
  }
  /**
   * This method manages image-variant associations for a specific image. It sends a request to the
   * [Batch Image Variants](https://docs.medusajs.com/api/admin#products_postproductsidimagesimage_idvariantsbatch)
   * API route.
   *
   * @param productId - The product's ID.
   * @param imageId - The image's ID.
   * @param body - The variants to add or remove from the image.
   * @param headers - Headers to pass in the request
   * @returns The batch operation details.
   *
   * @example
   * sdk.admin.product.batchImageVariants("prod_123", "img_123", {
   *   add: ["variant_123", "variant_456"],
   *   remove: ["variant_789"]
   * })
   * .then(({ added, removed }) => {
   *   console.log(added, removed)
   * })
   */
  batchImageVariants(productId, imageId, body, headers) {
    return __awaiter$q(this, void 0, void 0, function* () {
      return yield this.client.fetch(`/admin/products/${productId}/images/${imageId}/variants/batch`, {
        method: "POST",
        headers,
        body
      });
    });
  }
  /**
   * This method manages variant-image associations for a specific variant. It sends a request to the
   * [Batch Variant Images](https://docs.medusajs.com/api/admin#products_postproductsidvariantsvariant_idimagesbatch)
   * API route.
   *
   * @param productId - The product's ID.
   * @param variantId - The variant's ID.
   * @param body - The images to add or remove from the variant.
   * @param headers - Headers to pass in the request
   * @returns The batch operation details.
   *
   * @example
   * sdk.admin.product.batchVariantImages("prod_123", "variant_123", {
   *   add: ["img_123", "img_456"],
   *   remove: ["img_789"]
   * })
   * .then(({ added, removed }) => {
   *   console.log(added, removed)
   * })
   */
  batchVariantImages(productId, variantId, body, headers) {
    return __awaiter$q(this, void 0, void 0, function* () {
      return yield this.client.fetch(`/admin/products/${productId}/variants/${variantId}/images/batch`, {
        method: "POST",
        headers,
        body
      });
    });
  }
}
var __awaiter$p = function(thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function(resolve) {
      resolve(value);
    });
  }
  return new (P || (P = Promise))(function(resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }
    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }
    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};
class ProductCategory {
  /**
   * @ignore
   */
  constructor(client) {
    this.client = client;
  }
  /**
   * This method creates a product category. It sends a request to the
   * [Create Category](https://docs.medusajs.com/api/admin#product-categories_postproductcategories)
   * API route.
   *
   * @param body - The details of the category to create.
   * @param query - Configure the fields to retrieve in the category.
   * @param headers - Headers to pass in the request
   * @returns The category's details.
   *
   * @example
   * sdk.admin.productCategory.create({
   *   name: "Shirts"
   * })
   * .then(({ product_category }) => {
   *   console.log(product_category)
   * })
   */
  create(body, query, headers) {
    return __awaiter$p(this, void 0, void 0, function* () {
      return this.client.fetch(`/admin/product-categories`, {
        method: "POST",
        headers,
        body,
        query
      });
    });
  }
  /**
   * This method updates a product category. It sends a request to the
   * [Update Category](https://docs.medusajs.com/api/admin#product-categories_postproductcategoriesid)
   * API route.
   *
   * @param id - The product category's ID.
   * @param body - The data to update in the category.
   * @param query - Configure the fields to retrieve in the category.
   * @param headers - Headers to pass in the request
   * @returns The category's details.
   *
   * @example
   * sdk.admin.productCategory.update("pcat_123", {
   *   name: "Shirts"
   * })
   * .then(({ product_category }) => {
   *   console.log(product_category)
   * })
   */
  update(id, body, query, headers) {
    return __awaiter$p(this, void 0, void 0, function* () {
      return this.client.fetch(`/admin/product-categories/${id}`, {
        method: "POST",
        headers,
        body,
        query
      });
    });
  }
  /**
   * This method retrieves a paginated list of product categories. It sends a request to the
   * [List Product Categories](https://docs.medusajs.com/api/admin#product-categories_getproductcategories) API route.
   *
   * @param query - Filters and pagination configurations.
   * @param headers - Headers to pass in the request.
   * @returns The paginated list of product categories.
   *
   * @example
   * To retrieve the list of product categories:
   *
   * ```ts
   * sdk.admin.productCategory.list()
   * .then(({ product_categories, count, limit, offset }) => {
   *   console.log(product_categories)
   * })
   * ```
   *
   * To configure the pagination, pass the `limit` and `offset` query parameters.
   *
   * For example, to retrieve only 10 items and skip 10 items:
   *
   * ```ts
   * sdk.admin.productCategory.list({
   *   limit: 10,
   *   offset: 10
   * })
   * .then(({ product_categories, count, limit, offset }) => {
   *   console.log(product_categories)
   * })
   * ```
   *
   * Using the `fields` query parameter, you can specify the fields and relations to retrieve
   * in each product category:
   *
   * ```ts
   * sdk.admin.productCategory.list({
   *   fields: "id,*products"
   * })
   * .then(({ product_categories, count, limit, offset }) => {
   *   console.log(product_categories)
   * })
   * ```
   *
   * Learn more about the `fields` property in the [API reference](https://docs.medusajs.com/api/store#select-fields-and-relations).
   */
  list(query, headers) {
    return __awaiter$p(this, void 0, void 0, function* () {
      return this.client.fetch(`/admin/product-categories`, {
        headers,
        query
      });
    });
  }
  /**
   * This method retrieves a product category by its ID. It sends a request to the
   * [Get Product Category](https://docs.medusajs.com/api/admin#product-categories_getproductcategoriesid) API route.
   *
   * @param id - The category's ID.
   * @param query - Configure the fields to retrieve in the product category.
   * @param headers - Headers to pass in the request
   * @returns The product category's details.
   *
   * @example
   * To retrieve a product category by its ID:
   *
   * ```ts
   * sdk.admin.productCategory.retrieve("pcat_123")
   * .then(({ product_category }) => {
   *   console.log(product_category)
   * })
   * ```
   *
   * To specify the fields and relations to retrieve:
   *
   * ```ts
   * sdk.admin.productCategory.retrieve("pcat_123", {
   *   fields: "id,*products"
   * })
   * .then(({ product_category }) => {
   *   console.log(product_category)
   * })
   * ```
   *
   * Learn more about the `fields` property in the [API reference](https://docs.medusajs.com/api/store#select-fields-and-relations).
   */
  retrieve(id, query, headers) {
    return __awaiter$p(this, void 0, void 0, function* () {
      return this.client.fetch(`/admin/product-categories/${id}`, {
        query,
        headers
      });
    });
  }
  /**
   * This method deletes a product category. It sends a request to the
   * [Delete Product Category](https://docs.medusajs.com/api/admin#product-categories_deleteproductcategoriesid)
   * API route.
   *
   * @param id - The category's ID.
   * @param headers - Headers to pass in the request
   * @returns The deletion's details.
   *
   * @example
   * sdk.admin.productCategory.delete("pcat_123")
   * .then(({ deleted }) => {
   *   console.log(deleted)
   * })
   */
  delete(id, headers) {
    return __awaiter$p(this, void 0, void 0, function* () {
      return this.client.fetch(`/admin/product-categories/${id}`, {
        method: "DELETE",
        headers
      });
    });
  }
  /**
   * This method manaes the products of a category to add or remove them. It sends a request
   * to the [Manage Products](https://docs.medusajs.com/api/admin#product-categories_postproductcategoriesidproducts)
   * API route.
   *
   * @param id - The category's ID.
   * @param body - The products to create or update.
   * @param query - Configure the fields to retrieve in the product category.
   * @param headers - Headers to pass in the request
   * @returns The product category's details.
   *
   * @example
   * sdk.admin.productCategory.updateProducts("pcat_123", {
   *   add: ["prod_123"],
   *   remove: ["prod_321"]
   * })
   * .then(({ product_category }) => {
   *   console.log(product_category)
   * })
   */
  updateProducts(id, body, query, headers) {
    return __awaiter$p(this, void 0, void 0, function* () {
      return this.client.fetch(`/admin/product-categories/${id}/products`, {
        method: "POST",
        headers,
        body,
        query
      });
    });
  }
}
var __awaiter$o = function(thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function(resolve) {
      resolve(value);
    });
  }
  return new (P || (P = Promise))(function(resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }
    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }
    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};
class ProductCollection {
  /**
   * @ignore
   */
  constructor(client) {
    this.client = client;
  }
  /**
   * This method creates a product collection. It sends a request to the
   * [Create Collection](https://docs.medusajs.com/api/admin#collections_postcollections)
   * API route.
   *
   * @param body - The details of the product collection to create.
   * @param query - Configure the fields to retrieve in the product collection.
   * @param headers - Headers to pass in the request
   * @returns The product collection's details.
   *
   * @example
   * sdk.admin.productCollection.create({
   *   title: "Summer Collection"
   * })
   * .then(({ collection }) => {
   *   console.log(collection)
   * })
   */
  create(body, query, headers) {
    return __awaiter$o(this, void 0, void 0, function* () {
      return this.client.fetch(`/admin/collections`, {
        method: "POST",
        headers,
        body,
        query
      });
    });
  }
  /**
   * This method updates a collection. It sends a request to the
   * [Update Collection](https://docs.medusajs.com/api/admin#collections_postcollectionsid)
   * API route.
   *
   * @param id - The ID of the collection.
   * @param body - The data to update in the collection.
   * @param query - Configure the fields to retrieve in the product collection.
   * @param headers - Headers to pass in the request
   * @returns The product collection's details.
   *
   * @example
   * sdk.admin.productCollection.update("pcol_123", {
   *   title: "Summer Collection"
   * })
   * .then(({ collection }) => {
   *   console.log(collection)
   * })
   */
  update(id, body, query, headers) {
    return __awaiter$o(this, void 0, void 0, function* () {
      return this.client.fetch(`/admin/collections/${id}`, {
        method: "POST",
        headers,
        body,
        query
      });
    });
  }
  /**
   * This method retrieves a paginated list of collections. It sends a request to the
   * [List Collections](https://docs.medusajs.com/api/admin#collections_getcollections) API route.
   *
   * @param queryParams - Filters and pagination configurations.
   * @param headers - Headers to pass in the request.
   * @returns The paginated list of collections.
   *
   * @example
   * To retrieve the list of collections:
   *
   * ```ts
   * sdk.admin.productCollection.list()
   * .then(({ collections, count, limit, offset }) => {
   *   console.log(collections)
   * })
   * ```
   *
   * To configure the pagination, pass the `limit` and `offset` query parameters.
   *
   * For example, to retrieve only 10 items and skip 10 items:
   *
   * ```ts
   * sdk.admin.productCollection.list({
   *   limit: 10,
   *   offset: 10
   * })
   * .then(({ collections, count, limit, offset }) => {
   *   console.log(collections)
   * })
   * ```
   *
   * Using the `fields` query parameter, you can specify the fields and relations to retrieve
   * in each collection:
   *
   * ```ts
   * sdk.admin.productCollection.list({
   *   fields: "id,*products"
   * })
   * .then(({ collections, count, limit, offset }) => {
   *   console.log(collections)
   * })
   * ```
   *
   * Learn more about the `fields` property in the [API reference](https://docs.medusajs.com/api/store#select-fields-and-relations).
   */
  list(queryParams, headers) {
    return __awaiter$o(this, void 0, void 0, function* () {
      return this.client.fetch(`/admin/collections`, {
        headers,
        query: queryParams
      });
    });
  }
  /**
   * This method retrieves a collection by its ID. It sends a request to the
   * [Get Collection](https://docs.medusajs.com/api/admin#collections_getcollectionsid) API route.
   *
   * @param id - The collection's ID.
   * @param query - Configure the fields to retrieve in the collection.
   * @param headers - Headers to pass in the request
   * @returns The collection's details.
   *
   * @example
   * To retrieve a collection by its ID:
   *
   * ```ts
   * sdk.admin.productCollection.retrieve("pcol_123")
   * .then(({ collection }) => {
   *   console.log(collection)
   * })
   * ```
   *
   * To specify the fields and relations to retrieve:
   *
   * ```ts
   * sdk.admin.productCollection.retrieve("pcol_123", {
   *   fields: "id,*products"
   * })
   * .then(({ collection }) => {
   *   console.log(collection)
   * })
   * ```
   *
   * Learn more about the `fields` property in the [API reference](https://docs.medusajs.com/api/store#select-fields-and-relations).
   */
  retrieve(id, query, headers) {
    return __awaiter$o(this, void 0, void 0, function* () {
      return this.client.fetch(`/admin/collections/${id}`, {
        query,
        headers
      });
    });
  }
  /**
   * This method deletes a product collection. It sends a request to the
   * [Delete Collection](https://docs.medusajs.com/api/admin#collections_deletecollectionsid)
   * API route.
   *
   * @param id - The collection's ID.
   * @param headers - Headers to pass in the request
   * @returns The deletion's details.
   *
   * @example
   * sdk.admin.productCollection.delete("pcol_123")
   * .then(({ deleted }) => {
   *   console.log(deleted)
   * })
   */
  delete(id, headers) {
    return __awaiter$o(this, void 0, void 0, function* () {
      return this.client.fetch(`/admin/collections/${id}`, {
        method: "DELETE",
        headers
      });
    });
  }
  /**
   * This method manages the products of a collection to add or remove them. It sends a request
   * to the [Manage Products](https://docs.medusajs.com/api/admin#collections_postcollectionsidproducts)
   * API route.
   *
   * @param id - The collection's ID.
   * @param body - The products to add or remove.
   * @param headers - Headers to pass in the request
   * @returns The product category's details.
   *
   * @example
   * sdk.admin.productCollection.updateProducts("pcol_123", {
   *   add: ["prod_123"],
   *   remove: ["prod_321"]
   * })
   * .then(({ collection }) => {
   *   console.log(collection)
   * })
   */
  updateProducts(id, body, headers) {
    return __awaiter$o(this, void 0, void 0, function* () {
      return this.client.fetch(`/admin/collections/${id}/products`, {
        method: "POST",
        headers,
        body
      });
    });
  }
}
var __awaiter$n = function(thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function(resolve) {
      resolve(value);
    });
  }
  return new (P || (P = Promise))(function(resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }
    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }
    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};
class ProductTag {
  /**
   * @ignore
   */
  constructor(client) {
    this.client = client;
  }
  /**
   * This method creates a product tag. It sends a request to the
   * [Create Product Tag](https://docs.medusajs.com/api/admin#product-tags_postproducttags)
   * API route.
   *
   * @param body - The details of the product tag.
   * @param query - Configure the fields to retrieve in the product tag.
   * @param headers - Headers to pass in the request
   * @returns The product tag's details.
   *
   * @example
   * sdk.admin.productTag.create({
   *   value: "shirt"
   * })
   * .then(({ product_tag }) => {
   *   console.log(product_tag)
   * })
   */
  create(body, query, headers) {
    return __awaiter$n(this, void 0, void 0, function* () {
      return this.client.fetch(`/admin/product-tags`, {
        method: "POST",
        headers,
        body,
        query
      });
    });
  }
  /**
   * This method updates a tag's details. It sends a request to the
   * [Update Product Tag](https://docs.medusajs.com/api/admin#product-tags_postproducttagsid)
   * API route.
   *
   * @param id - The tag's ID.
   * @param body - The data to update in the tag.
   * @param query - Configure the fields to retrieve in the product tag.
   * @param headers - Headers to pass in the request
   * @returns The product tag's details.
   *
   * @example
   * sdk.admin.productTag.update("ptag_123", {
   *   value: "shirt"
   * })
   * .then(({ product_tag }) => {
   *   console.log(product_tag)
   * })
   */
  update(id, body, query, headers) {
    return __awaiter$n(this, void 0, void 0, function* () {
      return this.client.fetch(`/admin/product-tags/${id}`, {
        method: "POST",
        headers,
        body,
        query
      });
    });
  }
  /**
   * This method retrieves a paginated list of product tags. It sends a request to the
   * [List Product Tags](https://docs.medusajs.com/api/admin#product-tags_getproducttags) API route.
   *
   * @param query - Filters and pagination configurations.
   * @param headers - Headers to pass in the request.
   * @returns The paginated list of product tags.
   *
   * @example
   * To retrieve the list of product tags:
   *
   * ```ts
   * sdk.admin.productTag.list()
   * .then(({ product_tags, count, limit, offset }) => {
   *   console.log(product_tags)
   * })
   * ```
   *
   * To configure the pagination, pass the `limit` and `offset` query parameters.
   *
   * For example, to retrieve only 10 items and skip 10 items:
   *
   * ```ts
   * sdk.admin.productTag.list({
   *   limit: 10,
   *   offset: 10
   * })
   * .then(({ product_tags, count, limit, offset }) => {
   *   console.log(product_tags)
   * })
   * ```
   *
   * Using the `fields` query parameter, you can specify the fields and relations to retrieve
   * in each product tag:
   *
   * ```ts
   * sdk.admin.productTag.list({
   *   fields: "id,*products"
   * })
   * .then(({ product_tags, count, limit, offset }) => {
   *   console.log(product_tags)
   * })
   * ```
   *
   * Learn more about the `fields` property in the [API reference](https://docs.medusajs.com/api/store#select-fields-and-relations).
   */
  list(query, headers) {
    return __awaiter$n(this, void 0, void 0, function* () {
      return this.client.fetch(`/admin/product-tags`, {
        headers,
        query
      });
    });
  }
  /**
   * This method retrieves a product tag by its ID. It sends a request to the
   * [Get Product Tag](https://docs.medusajs.com/api/admin#product-tags_getproducttagsid) API route.
   *
   * @param id - The product tag's ID.
   * @param query - Configure the fields to retrieve in the product tag.
   * @param headers - Headers to pass in the request
   * @returns The product tag's details.
   *
   * @example
   * To retrieve a product tag by its ID:
   *
   * ```ts
   * sdk.admin.productTag.retrieve("ptag_123")
   * .then(({ product_tag }) => {
   *   console.log(product_tag)
   * })
   * ```
   *
   * To specify the fields and relations to retrieve:
   *
   * ```ts
   * sdk.admin.productTag.retrieve("ptag_123", {
   *   fields: "id,*products"
   * })
   * .then(({ product_tag }) => {
   *   console.log(product_tag)
   * })
   * ```
   *
   * Learn more about the `fields` property in the [API reference](https://docs.medusajs.com/api/store#select-fields-and-relations).
   */
  retrieve(id, query, headers) {
    return __awaiter$n(this, void 0, void 0, function* () {
      return this.client.fetch(`/admin/product-tags/${id}`, {
        query,
        headers
      });
    });
  }
  /**
   * This method deletes a product tag. It sends a request to the
   * [Delete Product Tag](https://docs.medusajs.com/api/admin#product-tags_deleteproducttagsid)
   * API route.
   *
   * @param id - The tag's ID.
   * @param headers - Headers to pass in the request
   * @returns The deletion's details.
   *
   * @example
   * sdk.admin.productTag.delete("ptag_123")
   * .then(({ deleted }) => {
   *   console.log(deleted)
   * })
   */
  delete(id, headers) {
    return __awaiter$n(this, void 0, void 0, function* () {
      return this.client.fetch(`/admin/product-tags/${id}`, {
        method: "DELETE",
        headers
      });
    });
  }
}
var __awaiter$m = function(thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function(resolve) {
      resolve(value);
    });
  }
  return new (P || (P = Promise))(function(resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }
    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }
    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};
class ProductType {
  /**
   * @ignore
   */
  constructor(client) {
    this.client = client;
  }
  /**
   * This method creates a product type. It sends a request to the
   * [Create Product Type](https://docs.medusajs.com/api/admin#product-types_postproducttypes)
   * API route.
   *
   * @param body - The product type's details.
   * @param query - Configure the fields to retrieve in the product type.
   * @param headers - Headers to pass in the request
   * @returns The product type's details.
   *
   * @example
   * sdk.admin.productType.create({
   *   value: "Clothes"
   * })
   * .then(({ product_type }) => {
   *   console.log(product_type)
   * })
   */
  create(body, query, headers) {
    return __awaiter$m(this, void 0, void 0, function* () {
      return this.client.fetch(`/admin/product-types`, {
        method: "POST",
        headers,
        body,
        query
      });
    });
  }
  /**
   * This method updates a product type. It sends a request to the
   * [Update Product Type](https://docs.medusajs.com/api/admin#product-types_postproducttypesid)
   * API route.
   *
   * @param id - The product type's ID.
   * @param body - The data to update in the product type.
   * @param query - Configure the fields to retrieve in the product type.
   * @param headers - Headers to pass in the request
   * @returns The product type's details.
   *
   * @example
   * sdk.admin.productType.update("ptyp_123", {
   *   value: "Clothes"
   * })
   * .then(({ product_type }) => {
   *   console.log(product_type)
   * })
   */
  update(id, body, query, headers) {
    return __awaiter$m(this, void 0, void 0, function* () {
      return this.client.fetch(`/admin/product-types/${id}`, {
        method: "POST",
        headers,
        body,
        query
      });
    });
  }
  /**
   * This method retrieves a paginated list of product types. It sends a request to the
   * [List Product Types](https://docs.medusajs.com/api/admin#product-types_getproducttypes) API route.
   *
   * @param query - Filters and pagination configurations.
   * @param headers - Headers to pass in the request.
   * @returns The paginated list of product types.
   *
   * @example
   * To retrieve the list of product types:
   *
   * ```ts
   * sdk.admin.productType.list()
   * .then(({ product_types, count, limit, offset }) => {
   *   console.log(product_types)
   * })
   * ```
   *
   * To configure the pagination, pass the `limit` and `offset` query parameters.
   *
   * For example, to retrieve only 10 items and skip 10 items:
   *
   * ```ts
   * sdk.admin.productType.list({
   *   limit: 10,
   *   offset: 10
   * })
   * .then(({ product_types, count, limit, offset }) => {
   *   console.log(product_types)
   * })
   * ```
   *
   * Using the `fields` query parameter, you can specify the fields and relations to retrieve
   * in each product type:
   *
   * ```ts
   * sdk.admin.productType.list({
   *   fields: "id,*products"
   * })
   * .then(({ product_types, count, limit, offset }) => {
   *   console.log(product_types)
   * })
   * ```
   *
   * Learn more about the `fields` property in the [API reference](https://docs.medusajs.com/api/store#select-fields-and-relations).
   */
  list(query, headers) {
    return __awaiter$m(this, void 0, void 0, function* () {
      return this.client.fetch(`/admin/product-types`, {
        headers,
        query
      });
    });
  }
  /**
   * This method retrieves a product type by its ID. It sends a request to the
   * [Get Product Type](https://docs.medusajs.com/api/admin#product-types_getproducttypesid)
   * API route.
   *
   * @param id - The product type's ID.
   * @param query - Configure the fields to retrieve in the product type.
   * @param headers - Headers to pass in the request
   * @returns The product type's details.
   *
   * @example
   * To retrieve a product type by its ID:
   *
   * ```ts
   * sdk.admin.productType.retrieve("ptyp_123")
   * .then(({ product_type }) => {
   *   console.log(product_type)
   * })
   * ```
   *
   * To specify the fields and relations to retrieve:
   *
   * ```ts
   * sdk.admin.productType.retrieve("ptyp_123", {
   *   fields: "id,*products"
   * })
   * .then(({ product_type }) => {
   *   console.log(product_type)
   * })
   * ```
   *
   * Learn more about the `fields` property in the [API reference](https://docs.medusajs.com/api/store#select-fields-and-relations).
   */
  retrieve(id, query, headers) {
    return __awaiter$m(this, void 0, void 0, function* () {
      return this.client.fetch(`/admin/product-types/${id}`, {
        query,
        headers
      });
    });
  }
  /**
   * This method deletes a product type. It sends a request to the
   * [Delete Product Type](https://docs.medusajs.com/api/admin#product-types_deleteproducttypesid)
   * API route.
   *
   * @param id - The product type's ID.
   * @param headers - Headers to pass in the request
   * @returns The product type's details.
   *
   * @example
   * sdk.admin.productType.delete("ptyp_123")
   * .then(({ deleted }) => {
   *   console.log(deleted)
   * })
   */
  delete(id, headers) {
    return __awaiter$m(this, void 0, void 0, function* () {
      return this.client.fetch(`/admin/product-types/${id}`, {
        method: "DELETE",
        headers
      });
    });
  }
}
var __awaiter$l = function(thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function(resolve) {
      resolve(value);
    });
  }
  return new (P || (P = Promise))(function(resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }
    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }
    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};
class ProductVariant {
  /**
   * @ignore
   */
  constructor(client) {
    this.client = client;
  }
  /**
   * This method retrieves a paginated list of product variants. It sends a request to the
   * [List Product Variants](https://docs.medusajs.com/api/admin#product-variants_getproductvariants)
   * API route.
   *
   * @param query - Filters and pagination configurations.
   * @param headers - Headers to pass in the request.
   * @returns The paginated list of product variants.
   *
   * @example
   * To retrieve the list of product variants:
   *
   * ```ts
   * sdk.admin.productVariant.list()
   * .then(({ variants, count, limit, offset }) => {
   *   console.log(variants)
   * })
   * ```
   *
   * To configure the pagination, pass the `limit` and `offset` query parameters.
   *
   * For example, to retrieve only 10 items and skip 10 items:
   *
   * ```ts
   * sdk.admin.productVariant.list({
   *   limit: 10,
   *   offset: 10
   * })
   * .then(({ variants, count, limit, offset }) => {
   *   console.log(variants)
   * })
   * ```
   *
   * Using the `fields` query parameter, you can specify the fields and relations to retrieve
   * in each campaign:
   *
   * ```ts
   * sdk.admin.productVariant.list({
   *   fields: "id,products"
   * })
   * .then(({ variants, count, limit, offset }) => {
   *   console.log(variants)
   * })
   * ```
   *
   * Learn more about the `fields` property in the [API reference](https://docs.medusajs.com/api/store#select-fields-and-relations).
   */
  list(query, headers) {
    return __awaiter$l(this, void 0, void 0, function* () {
      return yield this.client.fetch(`/admin/product-variants`, {
        headers,
        query
      });
    });
  }
}
var __awaiter$k = function(thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function(resolve) {
      resolve(value);
    });
  }
  return new (P || (P = Promise))(function(resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }
    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }
    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};
class Promotion {
  /**
   * @ignore
   */
  constructor(client) {
    this.client = client;
  }
  /**
   * This method retrieves a promotion by its ID. It sends a request to the
   * [Retrieve Promotion](https://docs.medusajs.com/api/admin#promotions_getpromotionsid)
   * API route.
   *
   * @param id - The promotion's ID.
   * @param query - Configure the fields to retrieve in the promotion.
   * @param headers - Headers to pass in the request.
   * @returns The promotion's details.
   *
   * @example
   * To retrieve a promotion by its ID:
   *
   * ```ts
   * sdk.admin.promotion.retrieve("promo_123")
   * .then(({ promotion }) => {
   *   console.log(promotion)
   * })
   * ```
   *
   * To specify the fields and relations to retrieve:
   *
   * ```ts
   * sdk.admin.promotion.retrieve("promo_123", {
   *   fields: "id,*application_method"
   * })
   * .then(({ promotion }) => {
   *   console.log(promotion)
   * })
   * ```
   *
   * Learn more about the `fields` property in the [API reference](https://docs.medusajs.com/api/admin#select-fields-and-relations).
   */
  retrieve(id, query, headers) {
    return __awaiter$k(this, void 0, void 0, function* () {
      return yield this.client.fetch(`/admin/promotions/${id}`, {
        headers,
        query
      });
    });
  }
  /**
   * This method retrieves a list of promotions. It sends a request to the
   * [List Promotions](https://docs.medusajs.com/api/admin#promotions_getpromotions)
   * API route.
   *
   * @param query - Filters and pagination configurations.
   * @param headers - Headers to pass in the request.
   * @returns The list of promotions.
   *
   * @example
   * To retrieve the list of promotions:
   *
   * ```ts
   * sdk.admin.promotion.list()
   * .then(({ promotions, count, limit, offset }) => {
   *   console.log(promotions)
   * })
   * ```
   *
   * To configure the pagination, pass the `limit` and `offset` query parameters.
   *
   * For example, to retrieve only 10 items and skip 10 items:
   *
   * ```ts
   * sdk.admin.promotion.list({
   *   limit: 10,
   *   offset: 10
   * })
   * .then(({ promotions, count, limit, offset }) => {
   *   console.log(promotions)
   * })
   * ```
   *
   * Using the `fields` query parameter, you can specify the fields and relations to retrieve
   * in each promotion:
   *
   * ```ts
   * sdk.admin.promotion.list({
   *   fields: "id,*application_method"
   * })
   * .then(({ promotions, count, limit, offset }) => {
   *   console.log(promotions)
   * })
   * ```
   *
   * Learn more about the `fields` property in the [API reference](https://docs.medusajs.com/api/admin#select-fields-and-relations).
   */
  list(query, headers) {
    return __awaiter$k(this, void 0, void 0, function* () {
      return yield this.client.fetch(`/admin/promotions`, {
        headers,
        query
      });
    });
  }
  /**
   * This method creates a new promotion. It sends a request to the
   * [Create Promotion](https://docs.medusajs.com/api/admin#promotions_postpromotions)
   * API route.
   *
   * @param payload - The promotion to create.
   * @param headers - Headers to pass in the request.
   * @returns The promotion's details.
   *
   * @example
   * sdk.admin.promotion.create({
   *   name: "My Promotion",
   *   description: "This is a test promotion",
   *   code: "PROMO123",
   *   starts_at: "2021-01-01",
   *   ends_at: "2021-01-01",
   * })
   * .then(({ promotion }) => {
   *   console.log(promotion)
   * })
   */
  create(payload, headers) {
    return __awaiter$k(this, void 0, void 0, function* () {
      return yield this.client.fetch(`/admin/promotions`, {
        method: "POST",
        headers,
        body: payload
      });
    });
  }
  /**
   * This method updates a promotion. It sends a request to the
   * [Update Promotion](https://docs.medusajs.com/api/admin#promotions_postpromotionsid)
   * API route.
   *
   * @param id - The promotion's ID.
   * @param payload - The details to update in the promotion.
   * @param headers - Headers to pass in the request.
   * @returns The promotion's details.
   *
   * @example
   * sdk.admin.promotion.update("promo_123", {
   *   code: "PROMO123",
   * })
   * .then(({ promotion }) => {
   *   console.log(promotion)
   * })
   */
  update(id, payload, headers) {
    return __awaiter$k(this, void 0, void 0, function* () {
      return yield this.client.fetch(`/admin/promotions/${id}`, {
        method: "POST",
        headers,
        body: payload
      });
    });
  }
  /**
   * This method deletes a promotion. It sends a request to the
   * [Delete Promotion](https://docs.medusajs.com/api/admin#promotions_deletepromotionsid)
   * API route.
   *
   * @param id - The promotion's ID.
   * @param headers - Headers to pass in the request.
   * @returns The deleted promotion's details.
   *
   * @example
   * sdk.admin.promotion.delete("promo_123")
   * .then(({ promotion }) => {
   *   console.log(promotion)
   * })
   */
  delete(id, headers) {
    return __awaiter$k(this, void 0, void 0, function* () {
      return yield this.client.fetch(`/admin/promotions/${id}`, {
        method: "DELETE",
        headers
      });
    });
  }
  /**
   * This method creates and adds rules to a promotion. It can be the promotion's rules,
   * or its application method's buy or target rules. That depends on the rule type
   * you specify as a parameter.
   *
   * - If you set the `ruleType` to `rules`, the method sends a request to the
   * [Manage Promotion's Rules API Route](https://docs.medusajs.com/api/admin#promotions_postpromotionsidrulesbatch).
   * - If you set the `ruleType` to `buy-rules`, the method sends a request to the
   * [Manage Promotion's Buy Rules API Route](https://docs.medusajs.com/api/admin#promotions_postpromotionsidbuyrulesbatch).
   * - If you set the `ruleType` to `target-rules`, the method sends a request to the
   * [Manage Promotion's Target Rules API Route](https://docs.medusajs.com/api/admin#promotions_postpromotionsidtargetrulesbatch).
   *
   * @param id - The promotion's ID.
   * @param ruleType - The type of rules to create.
   * @param payload - The rules to create.
   * @param headers - Headers to pass in the request.
   * @returns The promotion's details.
   *
   * @example
   * sdk.admin.promotion.addRules("promo_123", "rules", {
   *   rules: [
   *     {
   *       operator: "eq",
   *       attribute: "product_id",
   *       values: ["prod_123"]
   *     }
   *   ]
   * })
   * .then(({ promotion }) => {
   *   console.log(promotion)
   * })
   */
  addRules(id, ruleType, payload, headers) {
    return __awaiter$k(this, void 0, void 0, function* () {
      return yield this.client.fetch(`/admin/promotions/${id}/${ruleType}/batch`, {
        method: "POST",
        headers,
        body: { create: payload.rules }
      });
    });
  }
  /**
   * This method updates the rules of a promotion. It can be the promotion's rules,
   * or its application method's buy or target rules. That depends on the rule type
   * you specify as a parameter.
   *
   * - If you set the `ruleType` to `rules`, the method sends a request to the
   * [Manage Promotion's Rules API Route](https://docs.medusajs.com/api/admin#promotions_postpromotionsidrulesbatch).
   * - If you set the `ruleType` to `buy-rules`, the method sends a request to the
   * [Manage Promotion's Buy Rules API Route](https://docs.medusajs.com/api/admin#promotions_postpromotionsidbuyrulesbatch).
   * - If you set the `ruleType` to `target-rules`, the method sends a request to the
   * [Manage Promotion's Target Rules API Route](https://docs.medusajs.com/api/admin#promotions_postpromotionsidtargetrulesbatch).
   *
   * @param id - The promotion's ID.
   * @param ruleType - The type of rules to update.
   * @param payload - The rules to update.
   * @param headers - Headers to pass in the request.
   * @returns The promotion's details.
   *
   * @example
   * sdk.admin.promotion.updateRules("promo_123", "rules", {
   *   rules: [
   *     {
   *       id: "rule_123",
   *       operator: "ne",
   *     }
   *   ]
   * })
   * .then(({ promotion }) => {
   *   console.log(promotion)
   * })
   */
  updateRules(id, ruleType, payload, headers) {
    return __awaiter$k(this, void 0, void 0, function* () {
      return yield this.client.fetch(`/admin/promotions/${id}/${ruleType}/batch`, {
        method: "POST",
        headers,
        body: { update: payload.rules }
      });
    });
  }
  /**
   * This method removes rules from a promotion. It can be the promotion's rules,
   * or its application method's buy or target rules. That depends on the rule type
   * you specify as a parameter.
   *
   * - If you set the `ruleType` to `rules`, the method sends a request to the
   * [Manage Promotion's Rules API Route](https://docs.medusajs.com/api/admin#promotions_postpromotionsidrulesbatch).
   * - If you set the `ruleType` to `buy-rules`, the method sends a request to the
   * [Manage Promotion's Buy Rules API Route](https://docs.medusajs.com/api/admin#promotions_postpromotionsidbuyrulesbatch).
   * - If you set the `ruleType` to `target-rules`, the method sends a request to the
   * [Manage Promotion's Target Rules API Route](https://docs.medusajs.com/api/admin#promotions_postpromotionsidtargetrulesbatch).
   *
   * @param id - The promotion's ID.
   * @param ruleType - The type of rules to remove.
   * @param payload - The rules to remove.
   * @param headers - Headers to pass in the request.
   * @returns The promotion's details.
   *
   * @example
   * sdk.admin.promotion.removeRules("promo_123", "rules", {
   *   rule_ids: ["rule_123"]
   * })
   * .then(({ promotion }) => {
   *   console.log(promotion)
   * })
   */
  removeRules(id, ruleType, payload, headers) {
    return __awaiter$k(this, void 0, void 0, function* () {
      return yield this.client.fetch(`/admin/promotions/${id}/${ruleType}/batch`, {
        method: "POST",
        headers,
        body: { delete: payload.rule_ids }
      });
    });
  }
  /**
   * This method retrieves the rules of a promotion. It can be the promotion's rules,
   * or its application method's buy or target rules. That depends on the rule type
   * you specify as a parameter.
   *
   * This method sends a request to the
   * [List Rules of a Promotion API Route](https://docs.medusajs.com/api/admin#promotions_getpromotionsidrule_type)
   *
   * @param id - The promotion's ID.
   * @param ruleType - The type of rules to retrieve. Can be `rules`, `buy-rules`, or `target-rules`.
   * @param query - Configure the fields to retrieve in the rules.
   * @param headers - Headers to pass in the request.
   * @returns The promotion's rules.
   *
   * @example
   * sdk.admin.promotion.listRules("promo_123", "rules")
   * .then(({ rules }) => {
   *   console.log(rules)
   * })
   */
  listRules(id, ruleType, query, headers) {
    return __awaiter$k(this, void 0, void 0, function* () {
      return yield this.client.fetch(`/admin/promotions/${id}/${ruleType}`, {
        headers,
        query
      });
    });
  }
  /**
   * Retrieve a list of potential rule attributes for the promotion and application method types specified in the query parameters. Only the attributes of the rule type specified in the path parameter are retrieved:
   *
   * - If `rule_type` is `rules`, the attributes of the promotion's type are retrieved.
   * - If `rule_type` is `target-rules`, the target rules' attributes of the application method's type are retrieved.
   * - If `rule_type` is `buy-rules`, the buy rules' attributes of the application method's type are retrieved.
   *
   * This method sends a request to the
   * [List Rule Attribute Options API Route](https://docs.medusajs.com/api/admin#promotions_getpromotionsruleattributeoptionsrule_type)
   *
   * @param ruleType - The type of rules to retrieve the attributes for. Can be `rules`, `buy-rules`, or `target-rules`.
   * @param promotionType - The type of promotion to retrieve the attributes for. It can be `standard` or `buyget`.
   * @param applicationMethodTargetType - The type of application method to retrieve the attributes for. It can be `order`, `items` (default) or `shipping_methods`.
   * @param headers - Headers to pass in the request.
   * @returns The list of rule attributes.
   *
   * @example
   * sdk.admin.promotion.listRuleAttributes("rules", "standard")
   * .then(({ attributes }) => {
   *   console.log(attributes)
   * })
   */
  listRuleAttributes(ruleType, promotionType, applicationMethodTargetType, headers) {
    return __awaiter$k(this, void 0, void 0, function* () {
      return yield this.client.fetch(`/admin/promotions/rule-attribute-options/${ruleType}`, {
        headers,
        query: {
          promotion_type: promotionType,
          application_method_target_type: applicationMethodTargetType
        }
      });
    });
  }
  /**
   * Retrieve all potential values for promotion rules and target and buy rules based on the specified rule attribute and type.
   * For example, if you provide the ID of the `currency_code` rule attribute, and set `rule_type` to rules,
   * a list of currencies are retrieved in label-value pairs.
   *
   * This method sends a request to the
   * [List Rule Values API Route](https://docs.medusajs.com/api/admin#promotions_getpromotionsrulevalueoptionsrule_typerule_attribute_id)
   *
   * @param ruleType - The type of rules to retrieve the values for. Can be `rules`, `buy-rules`, or `target-rules`.
   * @param ruleValue - The ID of the rule attribute to retrieve the values for.
   * @param query - Configure the fields to retrieve in the rule values.
   * @param headers - Headers to pass in the request.
   * @returns The list of rule values.
   *
   * @example
   * sdk.admin.promotion.listRuleValues("rules", "attr_123")
   * .then(({ values }) => {
   *   console.log(values)
   * })
   */
  listRuleValues(ruleType, ruleValue, query, headers) {
    return __awaiter$k(this, void 0, void 0, function* () {
      return yield this.client.fetch(`/admin/promotions/rule-value-options/${ruleType}/${ruleValue}`, {
        headers,
        query
      });
    });
  }
}
var __awaiter$j = function(thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function(resolve) {
      resolve(value);
    });
  }
  return new (P || (P = Promise))(function(resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }
    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }
    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};
class RefundReason {
  /**
   * @ignore
   */
  constructor(client) {
    this.client = client;
  }
  /**
   * This method retrieves a list of refund reasons. It sends a request to the
   * [List Refund Reasons](https://docs.medusajs.com/api/admin#refund-reasons_getrefundreasons)
   * API route.
   *
   * @param query - Filters and pagination configurations.
   * @param headers - Headers to pass in the request.
   * @returns The paginated list of refund reasons.
   *
   * @example
   * To retrieve the list of refund reasons:
   *
   * ```ts
   * sdk.admin.refundReason.list()
   * .then(({ refund_reasons, count, limit, offset }) => {
   *   console.log(refund_reasons)
   * })
   * ```
   *
   * To configure the pagination, pass the `limit` and `offset` query parameters.
   *
   * For example, to retrieve only 10 items and skip 10 items:
   *
   * ```ts
   * sdk.admin.refundReason.list({
   *   limit: 10,
   *   offset: 10
   * })
   * .then(({ refund_reasons, count, limit, offset }) => {
   *   console.log(refund_reasons)
   * })
   * ```
   *
   * Using the `fields` query parameter, you can specify the fields and relations to retrieve
   * in each refund reason:
   *
   * ```ts
   * sdk.admin.refundReason.list({
   *   fields: "id,label"
   * })
   * .then(({ refund_reasons, count, limit, offset }) => {
   *   console.log(refund_reasons)
   * })
   * ```
   *
   * Learn more about the `fields` property in the [API reference](https://docs.medusajs.com/api/admin#select-fields-and-relations).
   *
   */
  list(query, headers) {
    return __awaiter$j(this, void 0, void 0, function* () {
      return yield this.client.fetch(`/admin/refund-reasons`, {
        query,
        headers
      });
    });
  }
  /**
   * This method retrieves a refund reason by ID. It sends a request to the
   * [Get Refund Reason](https://docs.medusajs.com/api/admin#refund-reasons_getrefundreasonsid)
   * API route.
   *
   * @since 2.11.0
   *
   * @param id - The refund reason's ID.
   * @param query - Configure the fields and relations to retrieve in the refund reason.
   * @param headers - Headers to pass in the request.
   * @returns The refund reason's details.
   *
   * @example
   * To retrieve a refund reason by its ID:
   *
   * ```ts
   * sdk.admin.refundReason.retrieve("refr_123")
   * .then(({ refund_reason }) => {
   *   console.log(refund_reason)
   * })
   * ```
   *
   * To specify the fields and relations to retrieve:
   *
   * ```ts
   * sdk.admin.refundReason.retrieve("refr_123", {
   *   fields: "id,code"
   * })
   * .then(({ refund_reason }) => {
   *   console.log(refund_reason)
   * })
   * ```
   *
   * Learn more about the `fields` property in the [API reference](https://docs.medusajs.com/api/admin#select-fields-and-relations).
   */
  retrieve(id, query, headers) {
    return __awaiter$j(this, void 0, void 0, function* () {
      return yield this.client.fetch(`/admin/refund-reasons/${id}`, {
        query,
        headers
      });
    });
  }
  /**
   * This method creates a refund reason. It sends a request to the
   * [Create Refund Reason](https://docs.medusajs.com/api/admin#refund-reasons_postrefundreasons)
   * API route.
   *
   * @since 2.11.0
   *
   * @param body - The details of the refund reason to create.
   * @param query - Configure the fields and relations to retrieve in the refund reason.
   * @param headers - Headers to pass in the request.
   * @returns The refund reason's details.
   *
   * @example
   * sdk.admin.refundReason.create({
   *   code: "refund",
   *   label: "Refund",
   * })
   * .then(({ refund_reason }) => {
   *   console.log(refund_reason)
   * })
   */
  create(body, query, headers) {
    return __awaiter$j(this, void 0, void 0, function* () {
      return this.client.fetch(`/admin/refund-reasons`, {
        method: "POST",
        headers,
        body,
        query
      });
    });
  }
  /**
   * This method updates a refund reason. It sends a request to the
   * [Update Refund Reason](https://docs.medusajs.com/api/admin#refund-reasons_postrefundreasonsid)
   * API route.
   *
   * @since 2.11.0
   *
   * @param id - The refund reason's ID.
   * @param body - The details of the refund reason to update.
   * @param query - Configure the fields and relations to retrieve in the refund reason.
   * @param headers - Headers to pass in the request.
   * @returns The refund reason's details.
   *
   * @example
   * sdk.admin.refundReason.update("ret_123", {
   *   code: "refund",
   *   label: "Refund",
   * })
   * .then(({ refund_reason }) => {
   *   console.log(refund_reason)
   * })
   */
  update(id, body, query, headers) {
    return __awaiter$j(this, void 0, void 0, function* () {
      return this.client.fetch(`/admin/refund-reasons/${id}`, {
        method: "POST",
        headers,
        body,
        query
      });
    });
  }
  /**
   * This method deletes a refund reason. It sends a request to the
   * [Delete Refund Reason](https://docs.medusajs.com/api/admin#refund-reasons_deleterefundreasonsid)
   * API route.
   *
   * @since 2.11.0
   *
   * @param id - The refund reason's ID.
   * @param query - Query parameters to pass to the request.
   * @param headers - Headers to pass in the request.
   * @returns The deletion's details.
   *
   * @example
   * sdk.admin.refundReason.delete("ret_123")
   * .then(({ deleted }) => {
   *   console.log(deleted)
   * })
   */
  delete(id, query, headers) {
    return __awaiter$j(this, void 0, void 0, function* () {
      return yield this.client.fetch(`/admin/refund-reasons/${id}`, {
        method: "DELETE",
        headers,
        query
      });
    });
  }
}
var __awaiter$i = function(thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function(resolve) {
      resolve(value);
    });
  }
  return new (P || (P = Promise))(function(resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }
    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }
    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};
class Region {
  /**
   * @ignore
   */
  constructor(client) {
    this.client = client;
  }
  /**
   * This method creates a new region. It sends a request to the
   * [Create Region](https://docs.medusajs.com/api/admin#regions_postregions)
   * API route.
   *
   * @param body - The details of the region to create.
   * @param query - Configure the fields and relations to retrieve in the region.
   * @param headers - Headers to pass in the request.
   * @returns The created region's details.
   *
   * @example
   * sdk.admin.region.create({
   *   name: "United States",
   *   currency_code: "usd",
   * })
   * .then(({ region }) => {
   *   console.log(region)
   * })
   */
  create(body, query, headers) {
    return __awaiter$i(this, void 0, void 0, function* () {
      return yield this.client.fetch(`/admin/regions`, {
        method: "POST",
        headers,
        body,
        query
      });
    });
  }
  /**
   * This method updates a region. It sends a request to the
   * [Update Region](https://docs.medusajs.com/api/admin#regions_postregionsid)
   * API route.
   *
   * @param id - The ID of the region to update.
   * @param body - The details of the region to update.
   * @param query - Configure the fields and relations to retrieve in the region.
   * @param headers - Headers to pass in the request.
   * @returns The updated region's details.
   *
   * @example
   * sdk.admin.region.update("region_123", {
   *   name: "United States",
   * })
   * .then(({ region }) => {
   *   console.log(region)
   * })
   */
  update(id, body, query, headers) {
    return __awaiter$i(this, void 0, void 0, function* () {
      return yield this.client.fetch(`/admin/regions/${id}`, {
        method: "POST",
        headers,
        body,
        query
      });
    });
  }
  /**
   * This method retrieves a list of regions. It sends a request to the
   * [List Regions](https://docs.medusajs.com/api/admin#regions_getregions)
   * API route.
   *
   * @param queryParams - Filters and pagination configurations.
   * @param headers - Headers to pass in the request.
   * @returns The paginated list of regions.
   *
   * @example
   * To retrieve the list of regions:
   *
   * ```ts
   * sdk.admin.region.list()
   * .then(({ regions, count, limit, offset }) => {
   *   console.log(regions)
   * })
   * ```
   *
   * To configure the pagination, pass the `limit` and `offset` query parameters.
   *
   * For example, to retrieve only 10 items and skip 10 items:
   *
   * ```ts
   * sdk.admin.region.list({
   *   limit: 10,
   *   offset: 10
   * })
   * .then(({ regions, count, limit, offset }) => {
   *   console.log(regions)
   * })
   * ```
   *
   * Using the `fields` query parameter, you can specify the fields and relations to retrieve
   * in each region:
   *
   * ```ts
   * sdk.admin.region.list({
   *   fields: "id,*countries"
   * })
   * .then(({ regions, count, limit, offset }) => {
   *   console.log(regions)
   * })
   * ```
   *
   * Learn more about the `fields` property in the [API reference](https://docs.medusajs.com/api/admin#select-fields-and-relations).
   */
  list(queryParams, headers) {
    return __awaiter$i(this, void 0, void 0, function* () {
      return yield this.client.fetch(`/admin/regions`, {
        query: queryParams,
        headers
      });
    });
  }
  /**
   * This method retrieves a region by ID. It sends a request to the
   * [Get Region](https://docs.medusajs.com/api/admin#regions_getregionsid)
   * API route.
   *
   * @param id - The ID of the region to retrieve.
   * @param query - Configure the fields and relations to retrieve in the region.
   * @param headers - Headers to pass in the request.
   * @returns The region's details.
   *
   * @example
   * To retrieve a region by its ID:
   *
   * ```ts
   * sdk.admin.region.retrieve("region_123")
   * .then(({ region }) => {
   *   console.log(region)
   * })
   * ```
   *
   * To specify the fields and relations to retrieve:
   *
   * ```ts
   * sdk.admin.region.retrieve("region_123", {
   *   fields: "id,*countries"
   * })
   * .then(({ region }) => {
   *   console.log(region)
   * })
   * ```
   *
   * Learn more about the `fields` property in the [API reference](https://docs.medusajs.com/api/admin#select-fields-and-relations).
   */
  retrieve(id, query, headers) {
    return __awaiter$i(this, void 0, void 0, function* () {
      return yield this.client.fetch(`/admin/regions/${id}`, {
        query,
        headers
      });
    });
  }
  /**
   * This method deletes a region by ID. It sends a request to the
   * [Delete Region](https://docs.medusajs.com/api/admin#regions_deleteregionsid)
   * API route.
   *
   * @param id - The ID of the region to delete.
   * @param headers - Headers to pass in the request.
   * @returns The deletion's details.
   *
   * @example
   * sdk.admin.region.delete("region_123")
   * .then(({ deleted }) => {
   *   console.log(deleted)
   * })
   */
  delete(id, headers) {
    return __awaiter$i(this, void 0, void 0, function* () {
      return yield this.client.fetch(`/admin/regions/${id}`, {
        method: "DELETE",
        headers
      });
    });
  }
}
var __awaiter$h = function(thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function(resolve) {
      resolve(value);
    });
  }
  return new (P || (P = Promise))(function(resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }
    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }
    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};
class Reservation {
  /**
   * @ignore
   */
  constructor(client) {
    this.client = client;
  }
  /**
   * This method retrieves a reservation by ID. It sends a request to the
   * [Get Reservation](https://docs.medusajs.com/api/admin#reservations_getreservationsid)
   * API route.
   *
   * @param id - The reservation's ID.
   * @param query - Configure the fields and relations to retrieve in the reservation.
   * @param headers - Headers to pass in the request.
   * @returns The reservation's details.
   *
   * @example
   * To retrieve a reservation by its ID:
   *
   * ```ts
   * sdk.admin.reservation.retrieve("res_123")
   * .then(({ reservation }) => {
   *   console.log(reservation)
   * })
   * ```
   *
   * To specify the fields and relations to retrieve:
   *
   * ```ts
   * sdk.admin.reservation.retrieve("res_123", {
   *   fields: "id,name"
   * })
   * .then(({ reservation }) => {
   *   console.log(reservation)
   * })
   * ```
   *
   * Learn more about the `fields` property in the [API reference](https://docs.medusajs.com/api/admin#select-fields-and-relations).
   */
  retrieve(id, query, headers) {
    return __awaiter$h(this, void 0, void 0, function* () {
      return yield this.client.fetch(`/admin/reservations/${id}`, {
        method: "GET",
        headers,
        query
      });
    });
  }
  /**
   * This method retrieves a list of reservations. It sends a request to the
   * [List Reservations](https://docs.medusajs.com/api/admin#reservations_getreservations)
   * API route.
   *
   * @param query - Filters and pagination configurations.
   * @param headers - Headers to pass in the request.
   * @returns The list of reservations.
   *
   * @example
   * To retrieve the list of reservations:
   *
   * ```ts
   * sdk.admin.reservation.list()
   * .then(({ reservations, count, limit, offset }) => {
   *   console.log(reservations)
   * })
   * ```
   *
   * To configure the pagination, pass the `limit` and `offset` query parameters.
   *
   * For example, to retrieve only 10 items and skip 10 items:
   *
   * ```ts
   * sdk.admin.reservation.list({
   *   limit: 10,
   *   offset: 10
   * })
   * .then(({ reservations, count, limit, offset }) => {
   *   console.log(reservations)
   * })
   * ```
   *
   * Using the `fields` query parameter, you can specify the fields and relations to retrieve
   * in each reservation:
   *
   * ```ts
   * sdk.admin.reservation.list({
   *   fields: "id,*inventory_item"
   * })
   * .then(({ reservations, count, limit, offset }) => {
   *   console.log(reservations)
   * })
   * ```
   *
   * Learn more about the `fields` property in the [API reference](https://docs.medusajs.com/api/admin#select-fields-and-relations).
   */
  list(query, headers) {
    return __awaiter$h(this, void 0, void 0, function* () {
      return yield this.client.fetch("/admin/reservations", {
        method: "GET",
        query,
        headers
      });
    });
  }
  /**
   * This method creates a reservation. It sends a request to the
   * [Create Reservation](https://docs.medusajs.com/api/admin#reservations_postreservations)
   * API route.
   *
   * @param body - The details of the reservation to create.
   * @param query - Configure the fields and relations to retrieve in the reservation.
   * @param headers - Headers to pass in the request.
   * @returns The reservation's details.
   *
   * @example
   * sdk.admin.reservation.create({
   *   inventory_item_id: "iitem_123",
   *   location_id: "sloc_123",
   *   quantity: 10,
   * })
   * .then(({ reservation }) => {
   *   console.log(reservation)
   * })
   */
  create(body, query, headers) {
    return __awaiter$h(this, void 0, void 0, function* () {
      return yield this.client.fetch("/admin/reservations", {
        method: "POST",
        body,
        query,
        headers
      });
    });
  }
  /**
   * This method updates a reservation. It sends a request to the
   * [Update Reservation](https://docs.medusajs.com/api/admin#reservations_postreservationsid)
   * API route.
   *
   * @param id - The reservation's ID.
   * @param body - The details of the reservation to update.
   * @param query - Configure the fields and relations to retrieve in the reservation.
   * @param headers - Headers to pass in the request.
   * @returns The reservation's details.
   *
   * @example
   * sdk.admin.reservation.update("res_123", {
   *   quantity: 20,
   * })
   * .then(({ reservation }) => {
   *   console.log(reservation)
   * })
   */
  update(id, body, query, headers) {
    return __awaiter$h(this, void 0, void 0, function* () {
      return yield this.client.fetch(`/admin/reservations/${id}`, {
        method: "POST",
        body,
        query,
        headers
      });
    });
  }
  /**
   * This method deletes a reservation by ID. It sends a request to the
   * [Delete Reservation](https://docs.medusajs.com/api/admin#reservations_deletereservationsid)
   * API route.
   *
   * @param id - The reservation's ID.
   * @param headers - Headers to pass in the request.
   * @returns The deletion's details.
   *
   * @example
   * sdk.admin.reservation.delete("res_123")
   * .then(({ deleted }) => {
   *   console.log(deleted)
   * })
   */
  delete(id, headers) {
    return __awaiter$h(this, void 0, void 0, function* () {
      return yield this.client.fetch(`/admin/reservations/${id}`, {
        method: "DELETE",
        headers
      });
    });
  }
}
var __awaiter$g = function(thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function(resolve) {
      resolve(value);
    });
  }
  return new (P || (P = Promise))(function(resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }
    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }
    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};
class Return {
  /**
   * @ignore
   */
  constructor(client) {
    this.client = client;
  }
  /**
   * This method retrieves a list of returns. It sends a request to the
   * [List Returns](https://docs.medusajs.com/api/admin#returns_getreturns)
   * API route.
   *
   * @param query - Filters and pagination configurations.
   * @param headers - Headers to pass in the request.
   * @returns The list of returns.
   *
   * @example
   * To retrieve the list of returns:
   *
   * ```ts
   * sdk.admin.return.list()
   * .then(({ returns, count, limit, offset }) => {
   *   console.log(returns)
   * })
   * ```
   *
   * To configure the pagination, pass the `limit` and `offset` query parameters.
   *
   * For example, to retrieve only 10 items and skip 10 items:
   *
   * ```ts
   * sdk.admin.return.list({
   *   limit: 10,
   *   offset: 10
   * })
   * .then(({ returns, count, limit, offset }) => {
   *   console.log(returns)
   * })
   * ```
   *
   * Using the `fields` query parameter, you can specify the fields and relations to retrieve
   * in each return:
   *
   * ```ts
   * sdk.admin.return.list({
   *   fields: "id,*items"
   * })
   * .then(({ returns, count, limit, offset }) => {
   *   console.log(returns)
   * })
   * ```
   *
   * Learn more about the `fields` property in the [API reference](https://docs.medusajs.com/api/admin#select-fields-and-relations).
   */
  list(query, headers) {
    return __awaiter$g(this, void 0, void 0, function* () {
      return yield this.client.fetch(`/admin/returns`, {
        query,
        headers
      });
    });
  }
  /**
   * This method retrieves a return by ID. It sends a request to the
   * [Get Return](https://docs.medusajs.com/api/admin#returns_getreturnsid)
   * API route.
   *
   * @param id - The ID of the return to retrieve.
   * @param query - Configure the fields and relations to retrieve in the return.
   * @param headers - Headers to pass in the request.
   * @returns The return's details.
   *
   * @example
   * To retrieve a return by its ID:
   *
   * ```ts
   * sdk.admin.return.retrieve("return_123")
   * .then(({ return }) => {
   *   console.log(return)
   * })
   * ```
   *
   * To specify the fields and relations to retrieve:
   *
   * ```ts
   * sdk.admin.return.retrieve("return_123", {
   *   fields: "id,*items"
   * })
   * .then(({ return }) => {
   *   console.log(return)
   * })
   * ```
   *
   * Learn more about the `fields` property in the [API reference](https://docs.medusajs.com/api/admin#select-fields-and-relations).
   */
  retrieve(id, query, headers) {
    return __awaiter$g(this, void 0, void 0, function* () {
      return yield this.client.fetch(`/admin/returns/${id}`, {
        query,
        headers
      });
    });
  }
  /**
   * This method initiates a return request by creating a return. It sends a request to the
   * [Create Return](https://docs.medusajs.com/api/admin#returns_postreturns)
   * API route.
   *
   * @param body - The details of the return to create.
   * @param query - Configure the fields and relations to retrieve in the return.
   * @param headers - Headers to pass in the request.
   * @returns The return's details.
   *
   * @example
   * sdk.admin.return.initiateRequest({
   *   order_id: "order_123",
   * })
   * .then(({ return }) => {
   *   console.log(return)
   * })
   */
  initiateRequest(body, query, headers) {
    return __awaiter$g(this, void 0, void 0, function* () {
      return yield this.client.fetch(`/admin/returns`, {
        method: "POST",
        headers,
        body,
        query
      });
    });
  }
  /**
   * This method cancels a return. It sends a request to the
   * [Cancel Return](https://docs.medusajs.com/api/admin#returns_postreturnsidcancel)
   * API route.
   *
   * @param id - The ID of the return to cancel.
   * @param query - Configure the fields and relations to retrieve in the return.
   * @param headers - Headers to pass in the request.
   * @returns The return's details.
   *
   * @example
   * sdk.admin.return.cancel("return_123")
   * .then(({ return }) => {
   *   console.log(return)
   * })
   */
  cancel(id, query, headers) {
    return __awaiter$g(this, void 0, void 0, function* () {
      return yield this.client.fetch(`/admin/returns/${id}/cancel`, {
        method: "POST",
        headers,
        query
      });
    });
  }
  /**
   * This method cancels a return request. It sends a request to the
   * [Cancel Return Request](https://docs.medusajs.com/api/admin#returns_deletereturnsidrequest)
   * API route.
   *
   * @param id - The ID of the return to cancel.
   * @param query - Configure the fields and relations to retrieve in the return.
   * @param headers - Headers to pass in the request.
   * @returns The return's details.
   *
   * @example
   * sdk.admin.return.cancelRequest("return_123")
   * .then(({ return }) => {
   *   console.log(return)
   * })
   */
  cancelRequest(id, query, headers) {
    return __awaiter$g(this, void 0, void 0, function* () {
      return yield this.client.fetch(`/admin/returns/${id}/request`, {
        method: "DELETE",
        headers,
        query
      });
    });
  }
  /**
   * This method adds an item to a return request. It sends a request to the
   * [Add Return Item](https://docs.medusajs.com/api/admin#returns_postreturnsidrequestitems)
   * API route.
   *
   * @param id - The ID of the return to add the item to.
   * @param body - The details of the item to add to the return.
   * @param query - Configure the fields and relations to retrieve in the return.
   * @param headers - Headers to pass in the request.
   * @returns The return's details.
   *
   * @example
   * sdk.admin.return.addReturnItem("return_123", {
   *   id: "orlitem_123",
   *   quantity: 1,
   * })
   * .then(({ return }) => {
   *   console.log(return)
   * })
   */
  addReturnItem(id, body, query, headers) {
    return __awaiter$g(this, void 0, void 0, function* () {
      return yield this.client.fetch(`/admin/returns/${id}/request-items`, {
        method: "POST",
        headers,
        body,
        query
      });
    });
  }
  /**
   * This method updates an item in a return request by the ID of the item's `RETURN_ITEM` action.
   * Every item has an `actions` property, whose value is an array of actions. You can check the action's name
   * using its `action` property, and use the value of the `id` property. For example,
   * `item.actions.find((action) => action.action === "RETURN_ITEM")?.id` is the ID of an item's `RETURN_ITEM` action.
   *
   * This method sends a request to the
   * [Update Requested Return Item](https://docs.medusajs.com/api/admin#returns_postreturnsidrequestitemsaction_id)
   * API route.
   *
   * @param id - The ID of the return to update the item in.
   * @param actionId - The ID of the item's `RETURN_ITEM` action.
   * @param body - The details of the item to update.
   * @param query - Configure the fields and relations to retrieve in the return.
   * @param headers - Headers to pass in the request.
   * @returns The return's details.
   *
   * @example
   * sdk.admin.return.updateReturnItem("return_123", "orchach_123", {
   *   quantity: 2,
   * })
   * .then(({ return }) => {
   *   console.log(return)
   * })
   */
  updateReturnItem(id, actionId, body, query, headers) {
    return __awaiter$g(this, void 0, void 0, function* () {
      return yield this.client.fetch(`/admin/returns/${id}/request-items/${actionId}`, {
        method: "POST",
        headers,
        body,
        query
      });
    });
  }
  /**
   * This method removes an item from a return request by the ID of the item's `RETURN_ITEM` action.
   *
   * Every item has an `actions` property, whose value is an array of actions. You can check the action's name
   * using its `action` property, and use the value of the `id` property. For example,
   * `item.actions.find((action) => action.action === "RETURN_ITEM")?.id` is the ID of an item's `RETURN_ITEM` action.
   *
   * This method sends a request to the
   * [Remove Item from Return](https://docs.medusajs.com/api/admin#returns_deletereturnsidrequestitemsaction_id)
   * API route.
   *
   * @param id - The ID of the return to remove the item from.
   * @param actionId - The ID of the item's `RETURN_ITEM` action.
   * @param query - Configure the fields and relations to retrieve in the return.
   * @param headers - Headers to pass in the request.
   * @returns The return's details.
   *
   * @example
   * sdk.admin.return.removeReturnItem("return_123", "orchach_123")
   * .then(({ return }) => {
   *   console.log(return)
   * })
   */
  removeReturnItem(id, actionId, query, headers) {
    return __awaiter$g(this, void 0, void 0, function* () {
      return yield this.client.fetch(`/admin/returns/${id}/request-items/${actionId}`, {
        method: "DELETE",
        headers,
        query
      });
    });
  }
  /**
   * This method adds a shipping method to a return request. It sends a request to the
   * [Add Shipping Method to Return](https://docs.medusajs.com/api/admin#returns_postreturnsidshippingmethod)
   * API route.
   *
   * @param id - The ID of the return to add the shipping method to.
   * @param body - The details of the shipping method to add to the return.
   * @param query - Configure the fields and relations to retrieve in the return.
   * @param headers - Headers to pass in the request.
   * @returns The return's details.
   *
   * @example
   * sdk.admin.return.addReturnShipping("return_123", {
   *   shipping_option_id: "so_123",
   * })
   * .then(({ return }) => {
   *   console.log(return)
   * })
   */
  addReturnShipping(id, body, query, headers) {
    return __awaiter$g(this, void 0, void 0, function* () {
      return yield this.client.fetch(`/admin/returns/${id}/shipping-method`, {
        method: "POST",
        headers,
        body,
        query
      });
    });
  }
  /**
   * This method updates a shipping method in a return request by the ID of the shipping method's `SHIPPING_ADD` action.
   *
   * Every shipping method has an `actions` property, whose value is an array of actions. You can check the action's name
   * using its `action` property, and use the value of the `id` property.
   *
   * For example, `shipping_method.actions.find((action) => action.action === "SHIPPING_ADD")?.id` is
   * the ID of a shipping method's `SHIPPING_ADD` action.
   *
   * This method sends a request to the
   * [Update Shipping Method in Return](https://docs.medusajs.com/api/admin#returns_postreturnsidshippingmethodaction_id)
   * API route.
   *
   * @param id - The ID of the return to update the shipping method in.
   * @param actionId - The ID of the shipping method's `SHIPPING_ADD` action.
   * @param body - The details of the shipping method to update.
   * @param query - Configure the fields and relations to retrieve in the return.
   * @param headers - Headers to pass in the request.
   * @returns The return's details.
   *
   * @example
   * sdk.admin.return.updateReturnShipping("return_123", "orchach_123", {
   *   custom_amount: 100,
   * })
   * .then(({ return }) => {
   *   console.log(return)
   * })
   */
  updateReturnShipping(id, actionId, body, query, headers) {
    return __awaiter$g(this, void 0, void 0, function* () {
      return yield this.client.fetch(`/admin/returns/${id}/shipping-method/${actionId}`, {
        method: "POST",
        headers,
        body,
        query
      });
    });
  }
  /**
   * This method removes a shipping method from a return request by the ID of the shipping method's `SHIPPING_ADD` action.
   *
   * Every shipping method has an `actions` property, whose value is an array of actions. You can check the action's name
   * using its `action` property, and use the value of the `id` property.
   *
   * For example, `shipping_method.actions.find((action) => action.action === "SHIPPING_ADD")?.id` is
   * the ID of a shipping method's `SHIPPING_ADD` action.
   *
   * This method sends a request to the
   * [Remove Shipping Method from Return](https://docs.medusajs.com/api/admin#returns_deletereturnsidshippingmethodaction_id)
   * API route.
   *
   * @param id - The ID of the return to remove the shipping method from.
   * @param actionId - The ID of the shipping method's `SHIPPING_ADD` action.
   * @param query - Configure the fields and relations to retrieve in the return.
   * @param headers - Headers to pass in the request.
   * @returns The return's details.
   *
   * @example
   * sdk.admin.return.deleteReturnShipping("return_123", "orchach_123")
   * .then(({ return }) => {
   *   console.log(return)
   * })
   */
  deleteReturnShipping(id, actionId, query, headers) {
    return __awaiter$g(this, void 0, void 0, function* () {
      return yield this.client.fetch(`/admin/returns/${id}/shipping-method/${actionId}`, {
        method: "DELETE",
        headers,
        query
      });
    });
  }
  /**
   * This method updates a return request. It sends a request to the
   * [Update Return](https://docs.medusajs.com/api/admin#returns_postreturnsid)
   * API route.
   *
   * @param id - The ID of the return to update.
   * @param body - The details of the return to update.
   * @param query - Configure the fields and relations to retrieve in the return.
   * @param headers - Headers to pass in the request.
   * @returns The return's details.
   *
   * @example
   * sdk.admin.return.updateRequest("return_123", {
   *   location_id: "sloc_123",
   * })
   * .then(({ return }) => {
   *   console.log(return)
   * })
   */
  updateRequest(id, body, query, headers) {
    return __awaiter$g(this, void 0, void 0, function* () {
      return yield this.client.fetch(`/admin/returns/${id}`, {
        method: "POST",
        headers,
        body,
        query
      });
    });
  }
  /**
   * This method confirms a return request. The return's changes are applied on the inventory quantity of the return
   * items and the order only after the return has been confirmed as received using the
   * [Confirm Return Receival](https://docs.medusajs.com/api/admin#returns_postreturnsidreceiveconfirm)
   * API route.
   *
   * This method sends a request to the
   * [Confirm Return Request](https://docs.medusajs.com/api/admin#returns_postreturnsidrequest)
   * API route.
   *
   * @param id - The ID of the return to confirm.
   * @param body - The details of the return to confirm.
   * @param query - Configure the fields and relations to retrieve in the return.
   * @param headers - Headers to pass in the request.
   * @returns The return's details.
   *
   * @example
   * sdk.admin.return.confirmRequest("return_123", {
   *   no_notification: true,
   * })
   * .then(({ return }) => {
   *   console.log(return)
   * })
   */
  confirmRequest(id, body, query, headers) {
    return __awaiter$g(this, void 0, void 0, function* () {
      return yield this.client.fetch(`/admin/returns/${id}/request`, {
        method: "POST",
        headers,
        body,
        query
      });
    });
  }
  /**
   * This method starts the return receival process. It sends a request to the
   * [Start Return Receival](https://docs.medusajs.com/api/admin#returns_postreturnsidreceive)
   * API route.
   *
   * @param id - The ID of the return to start the receival process.
   * @param body - The details of the return to start the receival process.
   * @param query - Configure the fields and relations to retrieve in the return.
   * @param headers - Headers to pass in the request.
   * @returns The return's details.
   *
   * @example
   * sdk.admin.return.initiateReceive("return_123", {
   *   internal_note: "Return received by the customer",
   * })
   * .then(({ return }) => {
   *   console.log(return)
   * })
   */
  initiateReceive(id, body, query, headers) {
    return __awaiter$g(this, void 0, void 0, function* () {
      return yield this.client.fetch(`/admin/returns/${id}/receive`, {
        method: "POST",
        headers,
        body,
        query
      });
    });
  }
  /**
   * This method adds received items to a return. These items will have the action `RECEIVE_RETURN_ITEM`.
   *
   * The method sends a request to the
   * [Add Received Items](https://docs.medusajs.com/api/admin#returns_postreturnsidreceiveitems)
   * API route.
   *
   * @param id - The ID of the return to add the received items to.
   * @param body - The details of the received items to add to the return.
   * @param query - Configure the fields and relations to retrieve in the return.
   * @param headers - Headers to pass in the request.
   * @returns The return's details.
   *
   * @example
   * sdk.admin.return.receiveItems("return_123", {
   *   items: [
   *     { id: "item_123", quantity: 1 },
   *   ],
   * })
   * .then(({ return }) => {
   *   console.log(return)
   * })
   */
  receiveItems(id, body, query, headers) {
    return __awaiter$g(this, void 0, void 0, function* () {
      return yield this.client.fetch(`/admin/returns/${id}/receive-items`, {
        method: "POST",
        headers,
        body,
        query
      });
    });
  }
  /**
   * This method updates a received item in the return by the ID of the item's `RECEIVE_RETURN_ITEM` action.
   *
   * Every item has an `actions` property, whose value is an array of actions. You can check the action's name
   * using its `action` property, and use the value of the `id` property.
   *
   * For example, `received_item.actions.find((action) => action.action === "RECEIVE_RETURN_ITEM")?.id` is
   * the ID of a received item's `RECEIVE_RETURN_ITEM` action.
   *
   * This method sends a request to the
   * [Update Received Item](https://docs.medusajs.com/api/admin#returns_postreturnsidreceiveitemsaction_id)
   * API route.
   *
   * @param id - The ID of the return to update the received item in.
   * @param actionId - The ID of the received item's `RECEIVE_RETURN_ITEM` action.
   * @param body - The details of the received item to update.
   * @param query - Configure the fields and relations to retrieve in the return.
   * @param headers - Headers to pass in the request.
   * @returns The return's details.
   *
   * @example
   * sdk.admin.return.updateReceiveItem("return_123", "orchach_123", {
   *   quantity: 2,
   * })
   * .then(({ return }) => {
   *   console.log(return)
   * })
   */
  updateReceiveItem(id, actionId, body, query, headers) {
    return __awaiter$g(this, void 0, void 0, function* () {
      return yield this.client.fetch(`/admin/returns/${id}/receive-items/${actionId}`, {
        method: "POST",
        headers,
        body,
        query
      });
    });
  }
  /**
   * This method removes a received item from the return by the ID of the item's `RECEIVE_RETURN_ITEM` action.
   *
   * Every item has an `actions` property, whose value is an array of actions. You can check the action's name
   * using its `action` property, and use the value of the `id` property.
   *
   * For example, `received_item.actions.find((action) => action.action === "RECEIVE_RETURN_ITEM")?.id` is
   * the ID of a received item's `RECEIVE_RETURN_ITEM` action.
   *
   * This method sends a request to the
   * [Remove Received Item](https://docs.medusajs.com/api/admin#returns_deletereturnsidreceiveitemsaction_id)
   * API route.
   *
   * @param id - The ID of the return to remove the received item from.
   * @param actionId - The ID of the received item's `RECEIVE_RETURN_ITEM` action.
   * @param query - Configure the fields and relations to retrieve in the return.
   * @param headers - Headers to pass in the request.
   * @returns The return's details.
   *
   * @example
   * sdk.admin.return.removeReceiveItem("return_123", "orchach_123")
   * .then(({ return }) => {
   *   console.log(return)
   * })
   */
  removeReceiveItem(id, actionId, query, headers) {
    return __awaiter$g(this, void 0, void 0, function* () {
      return yield this.client.fetch(`/admin/returns/${id}/receive-items/${actionId}`, {
        method: "DELETE",
        headers,
        query
      });
    });
  }
  /**
   * This method adds damaged items to the return. These items will have the action `RECEIVE_DAMAGED_RETURN_ITEM`.
   *
   * A damaged item's quantity is not added back to the associated inventory item's quantity in the
   * stock location where the return is initiated from.
   *
   * The method sends a request to the
   * [Add Damaged Items](https://docs.medusajs.com/api/admin#returns_postreturnsiddismissitems)
   * API route.
   *
   * @param id - The ID of the return to add the damaged items to.
   * @param body - The details of the damaged items to add to the return.
   * @param query - Configure the fields and relations to retrieve in the return.
   * @param headers - Headers to pass in the request.
   * @returns The return's details.
   *
   * @example
   * sdk.admin.return.dismissItems("return_123", {
   *   items: [
   *     { id: "orli_123", quantity: 1 },
   *   ],
   * })
   * .then(({ return }) => {
   *   console.log(return)
   * })
   */
  dismissItems(id, body, query, headers) {
    return __awaiter$g(this, void 0, void 0, function* () {
      return yield this.client.fetch(`/admin/returns/${id}/dismiss-items`, {
        method: "POST",
        headers,
        body,
        query
      });
    });
  }
  /**
   * This method updates a damaged item in the return by the ID of the item's `RECEIVE_DAMAGED_RETURN_ITEM` action.
   *
   * Every item has an `actions` property, whose value is an array of actions. You can check the action's name
   * using its `action` property, and use the value of the `id` property.
   *
   * For example, `item.actions.find((action) => action.action === "RECEIVE_DAMAGED_RETURN_ITEM")?.id` is
   * the ID of a damaged item's `RECEIVE_DAMAGED_RETURN_ITEM` action.
   *
   * This method sends a request to the
   * [Update Damaged Item](https://docs.medusajs.com/api/admin#returns_postreturnsiddismissitemsaction_id)
   * API route.
   *
   * @param id - The ID of the return to update the damaged item in.
   * @param actionId - The ID of the damaged item's `RECEIVE_DAMAGED_RETURN_ITEM` action.
   * @param body - The details of the damaged item to update.
   * @param query - Configure the fields and relations to retrieve in the return.
   * @param headers - Headers to pass in the request.
   * @returns The return's details.
   *
   * @example
   * sdk.admin.return.updateDismissItem("return_123", "orchach_123", {
   *   quantity: 2,
   * })
   * .then(({ return }) => {
   *   console.log(return)
   * })
   */
  updateDismissItem(id, actionId, body, query, headers) {
    return __awaiter$g(this, void 0, void 0, function* () {
      return yield this.client.fetch(`/admin/returns/${id}/dismiss-items/${actionId}`, {
        method: "POST",
        headers,
        body,
        query
      });
    });
  }
  /**
   * This method removes a damaged item from the return by the ID of the item's `RECEIVE_DAMAGED_RETURN_ITEM` action.
   *
   * Every item has an `actions` property, whose value is an array of actions. You can check the action's name
   * using its `action` property, and use the value of the `id` property.
   *
   * For example, `item.actions.find((action) => action.action === "RECEIVE_DAMAGED_RETURN_ITEM")?.id` is
   * the ID of a damaged item's `RECEIVE_DAMAGED_RETURN_ITEM` action.
   *
   * This method sends a request to the
   * [Remove Damaged Item](https://docs.medusajs.com/api/admin#returns_deletereturnsiddismissitemsaction_id)
   * API route.
   *
   * @param id - The ID of the return to remove the damaged item from.
   * @param actionId - The ID of the damaged item's `RECEIVE_DAMAGED_RETURN_ITEM` action.
   * @param query - Configure the fields and relations to retrieve in the return.
   * @param headers - Headers to pass in the request.
   * @returns The return's details.
   *
   * @example
   * sdk.admin.return.removeDismissItem("return_123", "orchach_123")
   * .then(({ return }) => {
   *   console.log(return)
   * })
   */
  removeDismissItem(id, actionId, query, headers) {
    return __awaiter$g(this, void 0, void 0, function* () {
      return yield this.client.fetch(`/admin/returns/${id}/dismiss-items/${actionId}`, {
        method: "DELETE",
        headers,
        query
      });
    });
  }
  /**
   * This method confirms the return receival. It sends a request to the
   * [Confirm Return Receival](https://docs.medusajs.com/api/admin#returns_postreturnsidreceiveconfirm)
   * API route.
   *
   * @param id - The ID of the return to confirm the receival of.
   * @param body - The details of the receival confirmation.
   * @param query - Configure the fields and relations to retrieve in the return.
   * @param headers - Headers to pass in the request.
   * @returns The return's details.
   *
   * @example
   * sdk.admin.return.confirmReceive("return_123", {
   *   no_notification: true,
   * })
   * .then(({ return }) => {
   *   console.log(return)
   * })
   */
  confirmReceive(id, body, query, headers) {
    return __awaiter$g(this, void 0, void 0, function* () {
      return yield this.client.fetch(`/admin/returns/${id}/receive/confirm`, {
        method: "POST",
        headers,
        body,
        query
      });
    });
  }
  /**
   * This method cancels a return receival. It sends a request to the
   * [Cancel Return Receival](https://docs.medusajs.com/api/admin#returns_deletereturnsidreceive)
   * API route.
   *
   * @param id - The ID of the return to cancel the receival of.
   * @param query - Configure the fields and relations to retrieve in the return.
   * @param headers - Headers to pass in the request.
   * @returns The return's details.
   *
   * @example
   * sdk.admin.return.cancelReceive("return_123")
   * .then(({ return }) => {
   *   console.log(return)
   * })
   */
  cancelReceive(id, query, headers) {
    return __awaiter$g(this, void 0, void 0, function* () {
      return yield this.client.fetch(`/admin/returns/${id}/receive`, {
        method: "DELETE",
        headers,
        query
      });
    });
  }
}
var __awaiter$f = function(thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function(resolve) {
      resolve(value);
    });
  }
  return new (P || (P = Promise))(function(resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }
    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }
    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};
class ReturnReason {
  /**
   * @ignore
   */
  constructor(client) {
    this.client = client;
  }
  /**
   * This method retrieves a list of return reasons. It sends a request to the
   * [List Return Reasons](https://docs.medusajs.com/api/admin#return-reasons_returnreason_schema)
   * API route.
   *
   * @param query - Filters and pagination configurations.
   * @param headers - Headers to pass in the request.
   * @returns The paginated list of return reasons.
   *
   * @example
   * To retrieve the list of return reasons:
   *
   * ```ts
   * sdk.admin.returnReason.list()
   * .then(({ return_reasons, count, limit, offset }) => {
   *   console.log(return_reasons)
   * })
   * ```
   *
   * To configure the pagination, pass the `limit` and `offset` query parameters.
   *
   * For example, to retrieve only 10 items and skip 10 items:
   *
   * ```ts
   * sdk.admin.returnReason.list({
   *   limit: 10,
   *   offset: 10
   * })
   * .then(({ return_reasons, count, limit, offset }) => {
   *   console.log(return_reasons)
   * })
   * ```
   *
   * Using the `fields` query parameter, you can specify the fields and relations to retrieve
   * in each return reason:
   *
   * ```ts
   * sdk.admin.returnReason.list({
   *   fields: "id,value"
   * })
   * .then(({ return_reasons, count, limit, offset }) => {
   *   console.log(return_reasons)
   * })
   * ```
   *
   * Learn more about the `fields` property in the [API reference](https://docs.medusajs.com/api/admin#select-fields-and-relations).
   */
  list(query, headers) {
    return __awaiter$f(this, void 0, void 0, function* () {
      return yield this.client.fetch("/admin/return-reasons", {
        headers,
        query
      });
    });
  }
  /**
   * This method retrieves a return reason by ID. It sends a request to the
   * [Get Return Reason](https://docs.medusajs.com/api/admin#return-reasons_getreturnreasonsid)
   * API route.
   *
   * @param id - The return reason's ID.
   * @param query - Configure the fields and relations to retrieve in the return reason.
   * @param headers - Headers to pass in the request.
   * @returns The return reason's details.
   *
   * @example
   * To retrieve a return reason by its ID:
   *
   * ```ts
   * sdk.admin.returnReason.retrieve("ret_123")
   * .then(({ return_reason }) => {
   *   console.log(return_reason)
   * })
   * ```
   *
   * To specify the fields and relations to retrieve:
   *
   * ```ts
   * sdk.admin.returnReason.retrieve("ret_123", {
   *   fields: "id,value"
   * })
   * .then(({ return_reason }) => {
   *   console.log(return_reason)
   * })
   * ```
   *
   * Learn more about the `fields` property in the [API reference](https://docs.medusajs.com/api/admin#select-fields-and-relations).
   */
  retrieve(id, query, headers) {
    return __awaiter$f(this, void 0, void 0, function* () {
      return yield this.client.fetch(`/admin/return-reasons/${id}`, {
        query,
        headers
      });
    });
  }
  /**
   * This method creates a return reason. It sends a request to the
   * [Create Return Reason](https://docs.medusajs.com/api/admin#return-reasons_postreturnreasons)
   * API route.
   *
   * @param body - The details of the return reason to create.
   * @param query - Configure the fields and relations to retrieve in the return reason.
   * @param headers - Headers to pass in the request.
   * @returns The return reason's details.
   *
   * @example
   * sdk.admin.returnReason.create({
   *   value: "refund",
   *   label: "Refund",
   * })
   * .then(({ return_reason }) => {
   *   console.log(return_reason)
   * })
   */
  create(body, query, headers) {
    return __awaiter$f(this, void 0, void 0, function* () {
      return this.client.fetch(`/admin/return-reasons`, {
        method: "POST",
        headers,
        body,
        query
      });
    });
  }
  /**
   * This method updates a return reason. It sends a request to the
   * [Update Return Reason](https://docs.medusajs.com/api/admin#return-reasons_postreturnreasonsid)
   * API route.
   *
   * @param id - The return reason's ID.
   * @param body - The details of the return reason to update.
   * @param query - Configure the fields and relations to retrieve in the return reason.
   * @param headers - Headers to pass in the request.
   * @returns The return reason's details.
   *
   * @example
   * sdk.admin.returnReason.update("ret_123", {
   *   value: "refund",
   *   label: "Refund",
   * })
   * .then(({ return_reason }) => {
   *   console.log(return_reason)
   * })
   */
  update(id, body, query, headers) {
    return __awaiter$f(this, void 0, void 0, function* () {
      return this.client.fetch(`/admin/return-reasons/${id}`, {
        method: "POST",
        headers,
        body,
        query
      });
    });
  }
  /**
   * This method deletes a return reason. It sends a request to the
   * [Delete Return Reason](https://docs.medusajs.com/api/admin#return-reasons_deletereturnreasonsid)
   * API route.
   *
   * @param id - The return reason's ID.
   * @param query - Query parameters to pass to the request.
   * @param headers - Headers to pass in the request.
   * @returns The deletion's details.
   *
   * @example
   * sdk.admin.returnReason.delete("ret_123")
   * .then(({ deleted }) => {
   *   console.log(deleted)
   * })
   */
  delete(id, query, headers) {
    return __awaiter$f(this, void 0, void 0, function* () {
      return yield this.client.fetch(`/admin/return-reasons/${id}`, {
        method: "DELETE",
        headers,
        query
      });
    });
  }
}
var __awaiter$e = function(thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function(resolve) {
      resolve(value);
    });
  }
  return new (P || (P = Promise))(function(resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }
    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }
    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};
class SalesChannel {
  /**
   * @ignore
   */
  constructor(client) {
    this.client = client;
  }
  /**
   * This method creates a new sales channel. It sends a request to the
   * [Create Sales Channel](https://docs.medusajs.com/api/admin#sales-channels_postsaleschannels)
   * API route.
   *
   * @param body - The details of the sales channel to create.
   * @param query - Configure the fields and relations to retrieve in the sales channel.
   * @param headers - Headers to pass in the request.
   * @returns The sales channel's details.
   *
   * @example
   * sdk.admin.salesChannel.create({
   *   name: "Storefront",
   * })
   * .then(({ salesChannel }) => {
   *   console.log(salesChannel)
   * })
   */
  create(body, query, headers) {
    return __awaiter$e(this, void 0, void 0, function* () {
      return yield this.client.fetch(`/admin/sales-channels`, {
        method: "POST",
        headers,
        body,
        query
      });
    });
  }
  /**
   * This method updates a sales channel. It sends a request to the
   * [Update Sales Channel](https://docs.medusajs.com/api/admin#sales-channels_postsaleschannelsid)
   * API route.
   *
   * @param id - The ID of the sales channel to update.
   * @param body - The details of the sales channel to update.
   * @param query - Configure the fields and relations to retrieve in the sales channel.
   * @param headers - Headers to pass in the request.
   * @returns The sales channel's details.
   *
   * @example
   * sdk.admin.salesChannel.update(
   *   "sc_123",
   *   {
   *     name: "Storefront",
   *   }
   * )
   * .then(({ salesChannel }) => {
   *   console.log(salesChannel)
   * })
   */
  update(id, body, query, headers) {
    return __awaiter$e(this, void 0, void 0, function* () {
      return yield this.client.fetch(`/admin/sales-channels/${id}`, {
        method: "POST",
        headers,
        body,
        query
      });
    });
  }
  /**
   * This method deletes a sales channel. It sends a request to the
   * [Delete Sales Channel](https://docs.medusajs.com/api/admin#sales-channels_deletesaleschannelsid)
   * API route.
   *
   * @param id - The ID of the sales channel to delete.
   * @param headers - Headers to pass in the request.
   * @returns The deletion's details.
   *
   * @example
   * sdk.admin.salesChannel.delete("sc_123")
   * .then(({ deleted }) => {
   *   console.log(deleted)
   * })
   */
  delete(id, headers) {
    return __awaiter$e(this, void 0, void 0, function* () {
      return yield this.client.fetch(`/admin/sales-channels/${id}`, {
        method: "DELETE",
        headers
      });
    });
  }
  /**
   * This method retrieves a sales channel. It sends a request to the
   * [Retrieve Sales Channel](https://docs.medusajs.com/api/admin#sales-channels_getsaleschannelsid)
   * API route.
   *
   * @param id - The ID of the sales channel to retrieve.
   * @param query - Configure the fields and relations to retrieve in the sales channel.
   * @param headers - Headers to pass in the request.
   * @returns The sales channel's details.
   *
   * @example
   * To retrieve a sales channel by its ID:
   *
   * ```ts
   * sdk.admin.salesChannel.retrieve("sc_123")
   * .then(({ sales_channel }) => {
   *   console.log(sales_channel)
   * })
   * ```
   *
   * To specify the fields and relations to retrieve:
   *
   * ```ts
   * sdk.admin.salesChannel.retrieve("sc_123", {
   *   fields: "id,*products"
   * })
   * .then(({ sales_channel }) => {
   *   console.log(sales_channel)
   * })
   * ```
   *
   * Learn more about the `fields` property in the [API reference](https://docs.medusajs.com/api/admin#select-fields-and-relations).
   */
  retrieve(id, query, headers) {
    return __awaiter$e(this, void 0, void 0, function* () {
      return yield this.client.fetch(`/admin/sales-channels/${id}`, {
        method: "GET",
        headers,
        query
      });
    });
  }
  /**
   * This method retrieves a list of sales channels. It sends a request to the
   * [List Sales Channels](https://docs.medusajs.com/api/admin#sales-channels_getsaleschannels)
   * API route.
   *
   * @param query - Filters and pagination configurations.
   * @param headers - Headers to pass in the request.
   * @returns The list of sales channels.
   *
   * @example
   * To retrieve the list of sales channels:
   *
   * ```ts
   * sdk.admin.salesChannel.list()
   * .then(({ sales_channels, count, limit, offset }) => {
   *   console.log(sales_channels)
   * })
   * ```
   *
   * To configure the pagination, pass the `limit` and `offset` query parameters.
   *
   * For example, to retrieve only 10 items and skip 10 items:
   *
   * ```ts
   * sdk.admin.salesChannel.list({
   *   limit: 10,
   *   offset: 10
   * })
   * .then(({ sales_channels, count, limit, offset }) => {
   *   console.log(sales_channels)
   * })
   * ```
   *
   * Using the `fields` query parameter, you can specify the fields and relations to retrieve
   * in each sales channel:
   *
   * ```ts
   * sdk.admin.salesChannel.list({
   *   fields: "id,*products"
   * })
   * .then(({ sales_channels, count, limit, offset }) => {
   *   console.log(sales_channels)
   * })
   * ```
   *
   * Learn more about the `fields` property in the [API reference](https://docs.medusajs.com/api/admin#select-fields-and-relations).
   */
  list(query, headers) {
    return __awaiter$e(this, void 0, void 0, function* () {
      return yield this.client.fetch(`/admin/sales-channels`, {
        method: "GET",
        headers,
        query
      });
    });
  }
  /**
   * This method manages the products in a sales channel to add or remove them. It sends a request to the
   * [Manage Products in Sales Channel](https://docs.medusajs.com/api/admin#sales-channels_postsaleschannelsidproducts)
   * API route.
   *
   * @param id - The ID of the sales channel to manage the products for.
   * @param body - The details of the products to add or remove from the sales channel.
   * @param headers - Headers to pass in the request.
   * @returns The sales channel's details.
   *
   * @example
   * sdk.admin.salesChannel.updateProducts("sc_123", {
   *   add: ["prod_123", "prod_456"],
   *   remove: ["prod_789"]
   * })
   * .then(({ sales_channel }) => {
   *   console.log(sales_channel)
   * })
   *
   * @deprecated Use {@link batchProducts} instead
   */
  updateProducts(id, body, headers) {
    return __awaiter$e(this, void 0, void 0, function* () {
      return yield this.client.fetch(`/admin/sales-channels/${id}/products`, {
        method: "POST",
        headers,
        body
      });
    });
  }
  /**
   * This method manages the products in a sales channel to add or remove them. It sends a request to the
   * [Manage Products in Sales Channel](https://docs.medusajs.com/api/admin#sales-channels_postsaleschannelsidproducts)
   * API route.
   *
   * @param id - The ID of the sales channel to manage the products for.
   * @param body - The details of the products to add or remove from the sales channel.
   * @param headers - Headers to pass in the request.
   * @returns The sales channel's details.
   *
   * @example
   * sdk.admin.salesChannel.batchProducts("sc_123", {
   *   add: ["prod_123", "prod_456"],
   *   remove: ["prod_789"]
   * })
   * .then(({ sales_channel }) => {
   *   console.log(sales_channel)
   * })
   */
  batchProducts(id, body, headers) {
    return __awaiter$e(this, void 0, void 0, function* () {
      return yield this.client.fetch(`/admin/sales-channels/${id}/products`, {
        method: "POST",
        headers,
        body
      });
    });
  }
}
var __awaiter$d = function(thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function(resolve) {
      resolve(value);
    });
  }
  return new (P || (P = Promise))(function(resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }
    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }
    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};
class ShippingOption {
  /**
   * @ignore
   */
  constructor(client) {
    this.client = client;
  }
  /**
   * This method creates a shipping option. It sends a request to the
   * [Create Shipping Option](https://docs.medusajs.com/api/admin#shipping-options_postshippingoptions)
   * API route.
   *
   * @param body - The details of the shipping option to create.
   * @param query - Configure the fields and relations to retrieve in the shipping option.
   * @param headers - Headers to pass in the request.
   * @returns The shipping option's details.
   *
   * @example
   * sdk.admin.shippingOption.create({
   *   name: "Standard Shipping",
   *   profile_id: "shp_123",
   * })
   * .then(({ shipping_option }) => {
   *   console.log(shipping_option)
   * })
   */
  create(body, query, headers) {
    return __awaiter$d(this, void 0, void 0, function* () {
      return yield this.client.fetch(`/admin/shipping-options`, {
        method: "POST",
        headers,
        body,
        query
      });
    });
  }
  /**
   * This method retrieves a shipping option. It sends a request to the
   * [Get Shipping Option](https://docs.medusajs.com/api/admin#shipping-options_getshippingoptionsid)
   * API route.
   *
   * @param id - The ID of the shipping option to retrieve.
   * @param query - Configure the fields and relations to retrieve in the shipping option.
   * @param headers - Headers to pass in the request.
   * @returns The shipping option's details.
   *
   * @example
   * To retrieve a shipping option by its ID:
   *
   * ```ts
   * sdk.admin.shippingOption.retrieve("so_123")
   * .then(({ shipping_option }) => {
   *   console.log(shipping_option)
   * })
   * ```
   *
   * To specify the fields and relations to retrieve:
   *
   * ```ts
   * sdk.admin.shippingOption.retrieve("so_123", {
   *   fields: "id,*service_zone"
   * })
   * .then(({ shipping_option }) => {
   *   console.log(shipping_option)
   * })
   * ```
   *
   * Learn more about the `fields` property in the [API reference](https://docs.medusajs.com/api/admin#select-fields-and-relations).
   */
  retrieve(id, query, headers) {
    return __awaiter$d(this, void 0, void 0, function* () {
      return yield this.client.fetch(`/admin/shipping-options/${id}`, {
        method: "GET",
        headers,
        query
      });
    });
  }
  /**
   * This method updates a shipping option. It sends a request to the
   * [Update Shipping Option](https://docs.medusajs.com/api/admin#shipping-options_postshippingoptionsid)
   * API route.
   *
   * @param id - The ID of the shipping option to update.
   * @param body - The details of the shipping option to update.
   * @param query - Configure the fields and relations to retrieve in the shipping option.
   * @param headers - Headers to pass in the request.
   * @returns The shipping option's details.
   *
   * @example
   * sdk.admin.shippingOption.update("so_123", {
   *   name: "Standard Shipping",
   * })
   * .then(({ shipping_option }) => {
   *   console.log(shipping_option)
   * })
   */
  update(id, body, query, headers) {
    return __awaiter$d(this, void 0, void 0, function* () {
      return yield this.client.fetch(`/admin/shipping-options/${id}`, {
        method: "POST",
        headers,
        body,
        query
      });
    });
  }
  /**
   * This method deletes a shipping option. It sends a request to the
   * [Delete Shipping Option](https://docs.medusajs.com/api/admin#shipping-options_deleteshippingoptionsid)
   * API route.
   *
   * @param id - The ID of the shipping option to delete.
   * @param headers - Headers to pass in the request.
   * @returns The deletion's details.
   *
   * @example
   * sdk.admin.shippingOption.delete("so_123")
   * .then(({ deleted }) => {
   *   console.log(deleted)
   * })
   */
  delete(id, headers) {
    return __awaiter$d(this, void 0, void 0, function* () {
      return yield this.client.fetch(`/admin/shipping-options/${id}`, {
        method: "DELETE",
        headers
      });
    });
  }
  /**
   * This method retrieves a list of shipping options. It sends a request to the
   * [List Shipping Options](https://docs.medusajs.com/api/admin#shipping-options_getshippingoptions)
   * API route.
   *
   * @param query - Filters and pagination configurations.
   * @param headers - Headers to pass in the request.
   * @returns The list of shipping options.
   *
   * @example
   * To retrieve the list of shipping options:
   *
   * ```ts
   * sdk.admin.shippingOption.list()
   * .then(({ shipping_options, count, limit, offset }) => {
   *   console.log(shipping_options)
   * })
   * ```
   *
   * To configure the pagination, pass the `limit` and `offset` query parameters.
   *
   * For example, to retrieve only 10 items and skip 10 items:
   *
   * ```ts
   * sdk.admin.shippingOption.list({
   *   limit: 10,
   *   offset: 10
   * })
   * .then(({ shipping_options, count, limit, offset }) => {
   *   console.log(shipping_options)
   * })
   * ```
   *
   * Using the `fields` query parameter, you can specify the fields and relations to retrieve
   * in each shipping option:
   *
   * ```ts
   * sdk.admin.shippingOption.list({
   *   fields: "id,*service_zone"
   * })
   * .then(({ shipping_options, count, limit, offset }) => {
   *   console.log(shipping_options)
   * })
   * ```
   *
   * Learn more about the `fields` property in the [API reference](https://docs.medusajs.com/api/admin#select-fields-and-relations).
   */
  list(query, headers) {
    return __awaiter$d(this, void 0, void 0, function* () {
      return yield this.client.fetch(`/admin/shipping-options`, {
        method: "GET",
        headers,
        query
      });
    });
  }
  /**
   * This method manages the rules of a shipping option to create, update, or remove them. It sends a request to the
   * [Manage Rules of a Shipping Option](https://docs.medusajs.com/api/admin#shipping-options_postshippingoptionsidrulesbatch)
   * API route.
   *
   * @param id - The ID of the shipping option to manage the rules for.
   * @param body - The details of the shipping option rules to manage.
   * @param headers - Headers to pass in the request.
   * @returns The shipping option's details.
   *
   * @example
   * sdk.admin.shippingOption.updateRules("so_123", {
   *   create: [{ attribute: "enabled_in_store", operator: "eq", value: "true" }],
   * })
   * .then(({ shipping_option }) => {
   *   console.log(shipping_option)
   * })
   */
  updateRules(id, body, headers) {
    return __awaiter$d(this, void 0, void 0, function* () {
      return yield this.client.fetch(`/admin/shipping-options/${id}/rules/batch`, {
        method: "POST",
        headers,
        body
      });
    });
  }
}
var __awaiter$c = function(thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function(resolve) {
      resolve(value);
    });
  }
  return new (P || (P = Promise))(function(resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }
    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }
    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};
class ShippingProfile {
  /**
   * @ignore
   */
  constructor(client) {
    this.client = client;
  }
  /**
   * This method creates a new shipping profile. It sends a request to the
   * [Create Shipping Profile](https://docs.medusajs.com/api/admin#shipping-profiles_postshippingprofiles)
   * API route.
   *
   * @param body - The details of the shipping profile to create.
   * @param query - Configure the fields and relations to retrieve in the shipping profile.
   * @param headers - Headers to pass in the request.
   * @returns The shipping profile's details.
   *
   * @example
   * sdk.admin.shippingProfile.create({
   *   name: "Default Shipping Profile",
   * })
   * .then(({ shipping_profile }) => {
   *   console.log(shipping_profile)
   * })
   */
  create(body, query, headers) {
    return __awaiter$c(this, void 0, void 0, function* () {
      return yield this.client.fetch(`/admin/shipping-profiles`, {
        method: "POST",
        headers,
        body,
        query
      });
    });
  }
  /**
   * This method updates a shipping profile. It sends a request to the
   * [Update Shipping Profile](https://docs.medusajs.com/api/admin#shipping-profiles_postshippingprofilesid)
   * API route.
   *
   * @param id - The ID of the shipping profile to update.
   * @param body - The details of the shipping profile to update.
   * @param query - Configure the fields and relations to retrieve in the shipping profile.
   * @param headers - Headers to pass in the request.
   * @returns The shipping profile's details.
   *
   * @example
   * sdk.admin.shippingProfile.update("sp_123", {
   *   name: "Updated Shipping Profile",
   * })
   * .then(({ shipping_profile }) => {
   *   console.log(shipping_profile)
   * })
   */
  update(id, body, query, headers) {
    return __awaiter$c(this, void 0, void 0, function* () {
      return yield this.client.fetch(`/admin/shipping-profiles/${id}`, {
        method: "POST",
        headers,
        body,
        query
      });
    });
  }
  /**
   * This method deletes a shipping profile. It sends a request to the
   * [Delete Shipping Profile](https://docs.medusajs.com/api/admin#shipping-profiles_deleteshippingprofilesid)
   * API route.
   *
   * @param id - The ID of the shipping profile to delete.
   * @param headers - Headers to pass in the request.
   * @returns The deletion's details.
   *
   * @example
   * sdk.admin.shippingProfile.delete("sp_123")
   * .then(({ deleted }) => {
   *   console.log(deleted)
   * })
   */
  delete(id, headers) {
    return __awaiter$c(this, void 0, void 0, function* () {
      return yield this.client.fetch(`/admin/shipping-profiles/${id}`, {
        method: "DELETE",
        headers
      });
    });
  }
  /**
   * This method retrieves a list of shipping profiles. It sends a request to the
   * [List Shipping Profiles](https://docs.medusajs.com/api/admin#shipping-profiles_getshippingprofiles)
   * API route.
   *
   * @param query - Filters and pagination configurations.
   * @param headers - Headers to pass in the request.
   * @returns The list of shipping profiles.
   *
   * @example
   * To retrieve the list of shipping profiles:
   *
   * ```ts
   * sdk.admin.shippingProfile.list()
   * .then(({ shipping_profiles, count, limit, offset }) => {
   *   console.log(shipping_profiles)
   * })
   * ```
   *
   * To configure the pagination, pass the `limit` and `offset` query parameters.
   *
   * For example, to retrieve only 10 items and skip 10 items:
   *
   * ```ts
   * sdk.admin.shippingProfile.list({
   *   limit: 10,
   *   offset: 10
   * })
   * .then(({ shipping_profiles, count, limit, offset }) => {
   *   console.log(shipping_profiles)
   * })
   * ```
   *
   * Using the `fields` query parameter, you can specify the fields and relations to retrieve
   * in each shipping profile:
   *
   * ```ts
   * sdk.admin.shippingProfile.list({
   *   fields: "id,name"
   * })
   * .then(({ shipping_profiles, count, limit, offset }) => {
   *   console.log(shipping_profiles)
   * })
   * ```
   *
   * Learn more about the `fields` property in the [API reference](https://docs.medusajs.com/api/admin#select-fields-and-relations).
   */
  list(query, headers) {
    return __awaiter$c(this, void 0, void 0, function* () {
      return yield this.client.fetch(`/admin/shipping-profiles`, {
        method: "GET",
        headers,
        query
      });
    });
  }
  /**
   * This method retrieves a shipping profile. It sends a request to the
   * [Get Shipping Profile](https://docs.medusajs.com/api/admin#shipping-profiles_getshippingprofilesid)
   * API route.
   *
   * @param id - The ID of the shipping profile to retrieve.
   * @param query - Configure the fields and relations to retrieve in the shipping profile.
   * @param headers - Headers to pass in the request.
   * @returns The shipping profile's details.
   *
   * @example
   * To retrieve a shipping profile by its ID:
   *
   * ```ts
   * sdk.admin.shippingProfile.retrieve("sp_123")
   * .then(({ shipping_profile }) => {
   *   console.log(shipping_profile)
   * })
   * ```
   *
   * To specify the fields and relations to retrieve:
   *
   * ```ts
   * sdk.admin.shippingProfile.retrieve("sp_123", {
   *   fields: "id,name"
   * })
   * .then(({ shipping_profile }) => {
   *   console.log(shipping_profile)
   * })
   * ```
   *
   * Learn more about the `fields` property in the [API reference](https://docs.medusajs.com/api/admin#select-fields-and-relations).
   */
  retrieve(id, query, headers) {
    return __awaiter$c(this, void 0, void 0, function* () {
      return yield this.client.fetch(`/admin/shipping-profiles/${id}`, {
        method: "GET",
        headers,
        query
      });
    });
  }
}
var __awaiter$b = function(thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function(resolve) {
      resolve(value);
    });
  }
  return new (P || (P = Promise))(function(resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }
    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }
    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};
class StockLocation {
  /**
   * @ignore
   */
  constructor(client) {
    this.client = client;
  }
  /**
   * This method creates a new stock location. It sends a request to the
   * [Create Stock Location](https://docs.medusajs.com/api/admin#stock-locations_poststocklocations)
   * API route.
   *
   * @param body - The details of the stock location to create.
   * @param query - Configure the fields and relations to retrieve in the stock location.
   * @param headers - Headers to pass in the request.
   * @returns The stock location's details.
   *
   * @example
   * sdk.admin.stockLocation.create({
   *   name: "Main Warehouse",
   *   address_id: "addr_123",
   * })
   * .then(({ stock_location }) => {
   *   console.log(stock_location)
   * })
   */
  create(body, query, headers) {
    return __awaiter$b(this, void 0, void 0, function* () {
      return yield this.client.fetch(`/admin/stock-locations`, {
        method: "POST",
        headers,
        body,
        query
      });
    });
  }
  /**
   * This method updates a stock location. It sends a request to the
   * [Update Stock Location](https://docs.medusajs.com/api/admin#stock-locations_poststocklocationsid)
   * API route.
   *
   * @param id - The ID of the stock location to update.
   * @param body - The details of the stock location to update.
   * @param query - Configure the fields and relations to retrieve in the stock location.
   * @param headers - Headers to pass in the request.
   * @returns The stock location's details.
   *
   * @example
   * sdk.admin.stockLocation.update("sloc_123", {
   *   name: "European Warehouse",
   * })
   * .then(({ stock_location }) => {
   *   console.log(stock_location)
   * })
   */
  update(id, body, query, headers) {
    return __awaiter$b(this, void 0, void 0, function* () {
      return yield this.client.fetch(`/admin/stock-locations/${id}`, {
        method: "POST",
        headers,
        body,
        query
      });
    });
  }
  /**
   * This method deletes a stock location. It sends a request to the
   * [Delete Stock Location](https://docs.medusajs.com/api/admin#stock-locations_deletestocklocationsid)
   * API route.
   *
   * @param id - The ID of the stock location to delete.
   * @param headers - Headers to pass in the request.
   * @returns The deletion's details.
   *
   * @example
   * sdk.admin.stockLocation.delete("sloc_123")
   * .then(({ deleted }) => {
   *   console.log(deleted)
   * })
   */
  delete(id, headers) {
    return __awaiter$b(this, void 0, void 0, function* () {
      return yield this.client.fetch(`/admin/stock-locations/${id}`, {
        method: "DELETE",
        headers
      });
    });
  }
  /**
   * This method retrieves a stock location. It sends a request to the
   * [Get Stock Location](https://docs.medusajs.com/api/admin#stock-locations_getstocklocationsid)
   * API route.
   *
   * @param id - The ID of the stock location to retrieve.
   * @param query - Configure the fields and relations to retrieve in the stock location.
   * @param headers - Headers to pass in the request.
   * @returns The stock location's details.
   *
   * @example
   * To retrieve a stock location by its ID:
   *
   * ```ts
   * sdk.admin.stockLocation.retrieve("sloc_123")
   * .then(({ stock_location }) => {
   *   console.log(stock_location)
   * })
   * ```
   *
   * To specify the fields and relations to retrieve:
   *
   * ```ts
   * sdk.admin.stockLocation.retrieve("sloc_123", {
   *   fields: "id,*sales_channels"
   * })
   * .then(({ stock_location }) => {
   *   console.log(stock_location)
   * })
   * ```
   *
   * Learn more about the `fields` property in the [API reference](https://docs.medusajs.com/api/admin#select-fields-and-relations).
   */
  retrieve(id, query, headers) {
    return __awaiter$b(this, void 0, void 0, function* () {
      return yield this.client.fetch(`/admin/stock-locations/${id}`, {
        method: "GET",
        headers,
        query
      });
    });
  }
  /**
   * This method retrieves a list of stock locations. It sends a request to the
   * [List Stock Locations](https://docs.medusajs.com/api/admin#stock-locations_getstocklocations)
   * API route.
   *
   * @param query - Filters and pagination configurations.
   * @param headers - Headers to pass in the request.
   * @returns The list of stock locations.
   *
   * @example
   * To retrieve the list of stock locations:
   *
   * ```ts
   * sdk.admin.stockLocation.list()
   * .then(({ stock_locations, count, limit, offset }) => {
   *   console.log(stock_locations)
   * })
   * ```
   *
   * To configure the pagination, pass the `limit` and `offset` query parameters.
   *
   * For example, to retrieve only 10 items and skip 10 items:
   *
   * ```ts
   * sdk.admin.stockLocation.list({
   *   limit: 10,
   *   offset: 10
   * })
   * .then(({ stock_locations, count, limit, offset }) => {
   *   console.log(stock_locations)
   * })
   * ```
   *
   * Using the `fields` query parameter, you can specify the fields and relations to retrieve
   * in each stock location:
   *
   * ```ts
   * sdk.admin.stockLocation.list({
   *   fields: "id,*sales_channels"
   * })
   * .then(({ stock_locations, count, limit, offset }) => {
   *   console.log(stock_locations)
   * })
   * ```
   *
   * Learn more about the `fields` property in the [API reference](https://docs.medusajs.com/api/admin#select-fields-and-relations).
   */
  list(query, headers) {
    return __awaiter$b(this, void 0, void 0, function* () {
      return yield this.client.fetch(`/admin/stock-locations`, {
        method: "GET",
        headers,
        query
      });
    });
  }
  /**
   * This method manages the sales channels of a stock location by adding or removing them. It sends a request to the
   * [Manage Stock Location Sales Channels](https://docs.medusajs.com/api/admin#stock-locations_poststocklocationsidsaleschannels)
   * API route.
   *
   * @param id - The ID of the stock location to update the sales channels for.
   * @param body - The details of the sales channels to update.
   * @param headers - Headers to pass in the request.
   * @returns The stock location's details.
   *
   * @example
   * sdk.admin.stockLocation.updateSalesChannels("sloc_123", {
   *   add: ["sc_123"],
   *   remove: ["sc_456"],
   * })
   * .then(({ stock_location }) => {
   *   console.log(stock_location)
   * })
   */
  updateSalesChannels(id, body, headers) {
    return __awaiter$b(this, void 0, void 0, function* () {
      return yield this.client.fetch(`/admin/stock-locations/${id}/sales-channels`, {
        method: "POST",
        headers,
        body
      });
    });
  }
  /**
   * This method adds a new fulfillment set to a stock location. It sends a request to the
   * [Add Fulfillment Set to Stock Location](https://docs.medusajs.com/api/admin#stock-locations_poststocklocationsidfulfillmentsets)
   * API route.
   *
   * @param id - The ID of the stock location to add the fulfillment set to.
   * @param body - The details of the fulfillment set to add.
   * @param headers - Headers to pass in the request.
   * @returns The stock location's details.
   *
   * @example
   * sdk.admin.stockLocation.createFulfillmentSet("sloc_123", {
   *   name: "Shipping",
   *   type: "shipping",
   * })
   * .then(({ stock_location }) => {
   *   console.log(stock_location)
   * })
   */
  createFulfillmentSet(id, body, headers) {
    return __awaiter$b(this, void 0, void 0, function* () {
      return yield this.client.fetch(`/admin/stock-locations/${id}/fulfillment-sets`, {
        method: "POST",
        headers,
        body
      });
    });
  }
  /**
   * This method manages the fulfillment providers of a stock location by adding or removing them. It sends a request to the
   * [Manage Fulfillment Providers of Stock Location](https://docs.medusajs.com/api/admin#stock-locations_poststocklocationsidfulfillmentproviders)
   * API route.
   *
   * @param id - The ID of the stock location to manage the fulfillment providers for.
   * @param body - The details of the fulfillment providers to manage.
   * @param headers - Headers to pass in the request.
   * @returns The stock location's details.
   *
   * @example
   * sdk.admin.stockLocation.updateFulfillmentProviders("sloc_123", {
   *   add: ["fp_manual_manual"],
   *   remove: ["fp_shipstation_shipstation"],
   * })
   * .then(({ stock_location }) => {
   *   console.log(stock_location)
   * })
   */
  updateFulfillmentProviders(id, body, headers) {
    return __awaiter$b(this, void 0, void 0, function* () {
      return yield this.client.fetch(`/admin/stock-locations/${id}/fulfillment-providers`, {
        method: "POST",
        headers,
        body
      });
    });
  }
}
var __awaiter$a = function(thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function(resolve) {
      resolve(value);
    });
  }
  return new (P || (P = Promise))(function(resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }
    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }
    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};
let Store$1 = class Store {
  /**
   * @ignore
   */
  constructor(client) {
    this.client = client;
  }
  /**
   * This method retrieves a store by its ID. It sends a request to the
   * [Get Store](https://docs.medusajs.com/api/admin#stores_getstoresid)
   * API route.
   *
   * @param id - The ID of the store to retrieve.
   * @param query - Configure the fields and relations to retrieve in the store.
   * @param headers - Headers to pass in the request.
   * @returns The store's details.
   *
   * @example
   * To retrieve a store by its ID:
   *
   * ```ts
   * sdk.admin.store.retrieve("store_123")
   * .then(({ store }) => {
   *   console.log(store)
   * })
   * ```
   *
   * To specify the fields and relations to retrieve:
   *
   * ```ts
   * sdk.admin.store.retrieve("store_123", {
   *   fields: "id,*supported_currencies"
   * })
   * .then(({ store }) => {
   *   console.log(store)
   * })
   * ```
   *
   * Learn more about the `fields` property in the [API reference](https://docs.medusajs.com/api/admin#select-fields-and-relations).
   */
  retrieve(id, query, headers) {
    return __awaiter$a(this, void 0, void 0, function* () {
      return yield this.client.fetch(`/admin/stores/${id}`, {
        method: "GET",
        headers,
        query
      });
    });
  }
  /**
   * This method retrieves a list of stores. It sends a request to the
   * [List Stores](https://docs.medusajs.com/api/admin#stores_getstores)
   * API route.
   *
   * @param query - Filters and pagination configurations.
   * @param headers - Headers to pass in the request.
   * @returns The list of stores.
   *
   * @example
   * To retrieve the list of stores:
   *
   * ```ts
   * sdk.admin.store.list()
   * .then(({ stores, count, limit, offset }) => {
   *   console.log(stores)
   * })
   * ```
   *
   * To configure the pagination, pass the `limit` and `offset` query parameters.
   *
   * For example, to retrieve only 10 items and skip 10 items:
   *
   * ```ts
   * sdk.admin.store.list({
   *   limit: 10,
   *   offset: 10
   * })
   * .then(({ stores, count, limit, offset }) => {
   *   console.log(stores)
   * })
   * ```
   *
   * Using the `fields` query parameter, you can specify the fields and relations to retrieve
   * in each store:
   *
   * ```ts
   * sdk.admin.store.list({
   *   fields: "id,*supported_currencies"
   * })
   * .then(({ stores, count, limit, offset }) => {
   *   console.log(stores)
   * })
   * ```
   *
   * Learn more about the `fields` property in the [API reference](https://docs.medusajs.com/api/admin#select-fields-and-relations).
   */
  list(query, headers) {
    return __awaiter$a(this, void 0, void 0, function* () {
      return yield this.client.fetch(`/admin/stores`, {
        method: "GET",
        headers,
        query
      });
    });
  }
  /**
   * This method updates a store. It sends a request to the
   * [Update Store](https://docs.medusajs.com/api/admin#stores_poststoresid)
   * API route.
   *
   * @param id - The ID of the store to update.
   * @param body - The details of the store to update.
   * @param query - Configure the fields and relations to retrieve in the store.
   * @param headers - Headers to pass in the request.
   * @returns The store's details.
   *
   * @example
   * sdk.admin.store.update("store_123", {
   *   name: "My Store",
   * })
   * .then(({ store }) => {
   *   console.log(store)
   * })
   */
  update(id, body, query, headers) {
    return __awaiter$a(this, void 0, void 0, function* () {
      return yield this.client.fetch(`/admin/stores/${id}`, {
        method: "POST",
        headers,
        body,
        query
      });
    });
  }
};
var __awaiter$9 = function(thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function(resolve) {
      resolve(value);
    });
  }
  return new (P || (P = Promise))(function(resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }
    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }
    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};
const taxProviderUrl = "/admin/tax-providers";
class TaxProvider {
  /**
   * @ignore
   */
  constructor(client) {
    this.client = client;
  }
  /**
   * This method retrieves a list of tax providers. It sends a request to the
   * [List Tax Providers](https://docs.medusajs.com/api/admin#tax-providers_gettaxproviders)
   * API route.
   *
   * @since 2.8.0
   *
   * @param query - Filters and pagination configurations.
   * @param headers - Headers to pass in the request.
   * @returns The list of tax providers.
   *
   * @example
   * To retrieve the list of tax providers:
   *
   * ```ts
   * sdk.admin.taxProvider.list()
   * .then(({ tax_providers, count, limit, offset }) => {
   *   console.log(tax_providers)
   * })
   * ```
   *
   * To configure the pagination, pass the `limit` and `offset` query parameters.
   *
   * For example, to retrieve only 10 items and skip 10 items:
   *
   * ```ts
   * sdk.admin.taxProvider.list({
   *   limit: 10,
   *   offset: 10,
   * })
   * .then(({ tax_providers, count, limit, offset }) => {
   *   console.log(tax_providers)
   * })
   * ```
   *
   * Using the `fields` query parameter, you can specify the fields and relations to retrieve
   * in each products:
   *
   * ```ts
   * sdk.admin.taxProvider.list({
   *   fields: "id,*regions"
   * })
   * .then(({ tax_providers, count, limit, offset }) => {
   *   console.log(tax_providers)
   * })
   * ```
   *
   * Learn more about the `fields` property in the [API reference](https://docs.medusajs.com/api/store#select-fields-and-relations).
   */
  list(query, headers) {
    return __awaiter$9(this, void 0, void 0, function* () {
      return yield this.client.fetch(taxProviderUrl, {
        method: "GET",
        headers,
        query
      });
    });
  }
}
var __awaiter$8 = function(thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function(resolve) {
      resolve(value);
    });
  }
  return new (P || (P = Promise))(function(resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }
    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }
    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};
const taxRateUrl = "/admin/tax-rates";
class TaxRate {
  /**
   * @ignore
   */
  constructor(client) {
    this.client = client;
  }
  /**
   * This method creates a tax rate. It sends a request to the
   * [Create Tax Rate](https://docs.medusajs.com/api/admin#tax-rates_posttaxrates)
   * API route.
   *
   * @param body - The details of the tax rate to create.
   * @param query - Configure the fields and relations to retrieve in the tax rate.
   * @param headers - Headers to pass in the request.
   * @returns The tax rate's details.
   *
   * @example
   * sdk.admin.taxRate.create({
   *   name: "VAT",
   *   tax_region_id: "txreg_123",
   *   code: "VAT",
   *   rate: 2, // 2%
   * })
   * .then(({ tax_rate }) => {
   *   console.log(tax_rate)
   * })
   */
  create(body, query, headers) {
    return __awaiter$8(this, void 0, void 0, function* () {
      return yield this.client.fetch(taxRateUrl, {
        method: "POST",
        headers,
        body,
        query
      });
    });
  }
  /**
   * This method updates a tax rate. It sends a request to the
   * [Update Tax Rate](https://docs.medusajs.com/api/admin#tax-rates_posttaxratesid)
   * API route.
   *
   * @param id - The ID of the tax rate to update.
   * @param body - The details of the tax rate to update.
   * @param query - Configure the fields and relations to retrieve in the tax rate.
   * @param headers - Headers to pass in the request.
   * @returns The tax rate's details.
   *
   * @example
   * sdk.admin.taxRate.update("txrat_123", {
   *   name: "VAT",
   *   code: "VAT",
   * })
   * .then(({ tax_rate }) => {
   *   console.log(tax_rate)
   * })
   */
  update(id, body, query, headers) {
    return __awaiter$8(this, void 0, void 0, function* () {
      return yield this.client.fetch(`${taxRateUrl}/${id}`, {
        method: "POST",
        headers,
        body,
        query
      });
    });
  }
  /**
   * This method deletes a tax rate. It sends a request to the
   * [Delete Tax Rate](https://docs.medusajs.com/api/admin#tax-rates_deletetaxratesid)
   * API route.
   *
   * @param id - The ID of the tax rate to delete.
   * @param headers - Headers to pass in the request.
   * @returns The deletion's details.
   *
   * @example
   * sdk.admin.taxRate.delete("txrat_123")
   * .then(({ deleted }) => {
   *   console.log(deleted)
   * })
   */
  delete(id, headers) {
    return __awaiter$8(this, void 0, void 0, function* () {
      return yield this.client.fetch(`${taxRateUrl}/${id}`, {
        method: "DELETE",
        headers
      });
    });
  }
  /**
   * This method retrieves a tax rate. It sends a request to the
   * [Get Tax Rate](https://docs.medusajs.com/api/admin#tax-rates_gettaxratesid)
   * API route.
   *
   * @param id - The ID of the tax rate to retrieve.
   * @param query - Configure the fields and relations to retrieve in the tax rate.
   * @param headers - Headers to pass in the request.
   * @returns The tax rate's details.
   *
   * @example
   * To retrieve a tax rate by its ID:
   *
   * ```ts
   * sdk.admin.taxRate.retrieve("txrat_123")
   * .then(({ tax_rate }) => {
   *   console.log(tax_rate)
   * })
   * ```
   *
   * To specify the fields and relations to retrieve:
   *
   * ```ts
   * sdk.admin.taxRate.retrieve("txrat_123", {
   *   fields: "id,*tax_region"
   * })
   * .then(({ tax_rate }) => {
   *   console.log(tax_rate)
   * })
   * ```
   *
   * Learn more about the `fields` property in the [API reference](https://docs.medusajs.com/api/admin#select-fields-and-relations).
   */
  retrieve(id, query, headers) {
    return __awaiter$8(this, void 0, void 0, function* () {
      return yield this.client.fetch(`${taxRateUrl}/${id}`, {
        method: "GET",
        headers,
        query
      });
    });
  }
  /**
   * This method retrieves a list of tax rates. It sends a request to the
   * [List Tax Rates](https://docs.medusajs.com/api/admin#tax-rates_gettaxrates)
   * API route.
   *
   * @param query - Filters and pagination configurations.
   * @param headers - Headers to pass in the request.
   * @returns The list of tax rates.
   *
   * @example
   * To retrieve the list of tax rates:
   *
   * ```ts
   * sdk.admin.taxRate.list()
   * .then(({ tax_rates, count, limit, offset }) => {
   *   console.log(tax_rates)
   * })
   * ```
   *
   * To configure the pagination, pass the `limit` and `offset` query parameters.
   *
   * For example, to retrieve only 10 items and skip 10 items:
   *
   * ```ts
   * sdk.admin.taxRate.list({
   *   limit: 10,
   *   offset: 10
   * })
   * .then(({ tax_rates, count, limit, offset }) => {
   *   console.log(tax_rates)
   * })
   * ```
   *
   * Using the `fields` query parameter, you can specify the fields and relations to retrieve
   * in each tax rate:
   *
   * ```ts
   * sdk.admin.taxRate.list({
   *   fields: "id,*tax_region"
   * })
   * .then(({ tax_rates, count, limit, offset }) => {
   *   console.log(tax_rates)
   * })
   * ```
   *
   * Learn more about the `fields` property in the [API reference](https://docs.medusajs.com/api/admin#select-fields-and-relations).
   */
  list(query, headers) {
    return __awaiter$8(this, void 0, void 0, function* () {
      return yield this.client.fetch(taxRateUrl, {
        method: "GET",
        headers,
        query
      });
    });
  }
}
var __awaiter$7 = function(thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function(resolve) {
      resolve(value);
    });
  }
  return new (P || (P = Promise))(function(resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }
    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }
    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};
const taxRegionUrl = "/admin/tax-regions";
class TaxRegion {
  /**
   * @ignore
   */
  constructor(client) {
    this.client = client;
  }
  /**
   * This method creates a tax region. It sends a request to the
   * [Create Tax Region](https://docs.medusajs.com/api/admin#tax-regions_posttaxregions)
   * API route.
   *
   * @param body - The details of the tax region to create.
   * @param query - Configure the fields and relations to retrieve in the tax region.
   * @param headers - Headers to pass in the request.
   * @returns The tax region's details.
   *
   * @example
   * sdk.admin.taxRegion.create({
   *   country_code: "us",
   *   province_code: "ca",
   *   default_tax_rate: {
   *     code: "VAT",
   *     name: "VAT",
   *     rate: 20, // 20%
   *     is_combinable: true,
   *   },
   * })
   * .then(({ tax_region }) => {
   *   console.log(tax_region)
   * })
   */
  create(body, query, headers) {
    return __awaiter$7(this, void 0, void 0, function* () {
      return yield this.client.fetch(taxRegionUrl, {
        method: "POST",
        headers,
        body,
        query
      });
    });
  }
  /**
   * This method updates a tax region. It sends a request to the
   * [Update Tax Region](https://docs.medusajs.com/api/admin#tax-regions_posttaxregionsid)
   * API route.
   *
   * @since 2.8.0
   *
   * @param id - The ID of the tax region to update.
   * @param body - The details of the tax region to update.
   * @param query - Configure the fields and relations to retrieve in the tax region.
   * @param headers - Headers to pass in the request.
   * @returns The tax region's details.
   *
   * @example
   * sdk.admin.taxRegion.update("txreg_123", {
   *   province_code: "ca",
   * })
   * .then(({ tax_region }) => {
   *   console.log(tax_region)
   * })
   */
  update(id, body, query, headers) {
    return __awaiter$7(this, void 0, void 0, function* () {
      return yield this.client.fetch(`${taxRegionUrl}/${id}`, {
        method: "POST",
        headers,
        body,
        query
      });
    });
  }
  /**
   * This method deletes a tax region. It sends a request to the
   * [Delete Tax Region](https://docs.medusajs.com/api/admin#tax-regions_deletetaxregionsid)
   * API route.
   *
   * @param id - The ID of the tax region to delete.
   * @param headers - Headers to pass in the request.
   * @returns The deletion's details.
   *
   * @example
   * sdk.admin.taxRegion.delete("txreg_123")
   * .then(({ deleted }) => {
   *   console.log(deleted)
   * })
   */
  delete(id, headers) {
    return __awaiter$7(this, void 0, void 0, function* () {
      return yield this.client.fetch(`${taxRegionUrl}/${id}`, {
        method: "DELETE",
        headers
      });
    });
  }
  /**
   * This method retrieves a tax region. It sends a request to the
   * [Get Tax Region](https://docs.medusajs.com/api/admin#tax-regions_gettaxregionsid)
   * API route.
   *
   * @param id - The ID of the tax region to retrieve.
   * @param query - Configure the fields and relations to retrieve in the tax region.
   * @param headers - Headers to pass in the request.
   * @returns The tax region's details.
   *
   * @example
   * To retrieve a tax region by its ID:
   *
   * ```ts
   * sdk.admin.taxRegion.retrieve("txreg_123")
   * .then(({ tax_region }) => {
   *   console.log(tax_region)
   * })
   * ```
   *
   * To specify the fields and relations to retrieve:
   *
   * ```ts
   * sdk.admin.taxRegion.retrieve("txreg_123", {
   *   fields: "id,*tax_rates"
   * })
   * .then(({ tax_region }) => {
   *   console.log(tax_region)
   * })
   * ```
   *
   * Learn more about the `fields` property in the [API reference](https://docs.medusajs.com/api/admin#select-fields-and-relations).
   */
  retrieve(id, query, headers) {
    return __awaiter$7(this, void 0, void 0, function* () {
      return yield this.client.fetch(`${taxRegionUrl}/${id}`, {
        method: "GET",
        headers,
        query
      });
    });
  }
  /**
   * This method retrieves a list of tax regions. It sends a request to the
   * [List Tax Regions](https://docs.medusajs.com/api/admin#tax-regions_gettaxregions)
   * API route.
   *
   * @param query - Filters and pagination configurations.
   * @param headers - Headers to pass in the request.
   * @returns The list of tax regions.
   *
   * @example
   * To retrieve the list of tax regions:
   *
   * ```ts
   * sdk.admin.taxRegion.list()
   * .then(({ tax_regions, count, limit, offset }) => {
   *   console.log(tax_regions)
   * })
   * ```
   *
   * To configure the pagination, pass the `limit` and `offset` query parameters.
   *
   * For example, to retrieve only 10 items and skip 10 items:
   *
   * ```ts
   * sdk.admin.taxRegion.list({
   *   limit: 10,
   *   offset: 10
   * })
   * .then(({ tax_regions, count, limit, offset }) => {
   *   console.log(tax_regions)
   * })
   * ```
   *
   * Using the `fields` query parameter, you can specify the fields and relations to retrieve
   * in each tax region:
   *
   * ```ts
   * sdk.admin.taxRegion.list({
   *   fields: "id,*tax_rates"
   * })
   * .then(({ tax_regions, count, limit, offset }) => {
   *   console.log(tax_regions)
   * })
   * ```
   *
   * Learn more about the `fields` property in the [API reference](https://docs.medusajs.com/api/admin#select-fields-and-relations).
   */
  list(query, headers) {
    return __awaiter$7(this, void 0, void 0, function* () {
      return yield this.client.fetch(taxRegionUrl, {
        method: "GET",
        headers,
        query
      });
    });
  }
}
var __awaiter$6 = function(thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function(resolve) {
      resolve(value);
    });
  }
  return new (P || (P = Promise))(function(resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }
    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }
    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};
class Upload {
  /**
   * @ignore
   */
  constructor(client) {
    this.client = client;
  }
  /**
   * This method creates a new upload. It sends a request to the
   * [Upload Files](https://docs.medusajs.com/api/admin#uploads_postuploads)
   * API route.
   *
   * @param body - The details of the files to upload.
   * @param query - Configure the fields and relations to retrieve in the uploaded files.
   * @param headers - Headers to pass in the request.
   * @returns The upload files' details.
   *
   * @privateRemarks
   *
   * Note: The creation/upload flow be made more advanced, with support for streaming and progress, but for now we keep it simple
   *
   * @example
   * sdk.admin.upload.create(
   *   {
   *     files: [
   *        // file uploaded as a binary string
   *       {
   *         name: "test.txt",
   *         content: "test", // Should be the binary string of the file
   *       },
   *       // file uploaded as a File object
   *       new File(["test"], "test.txt", { type: "text/plain" })
   *     ],
   *   }
   * )
   * .then(({ files }) => {
   *   console.log(files)
   * })
   */
  create(body, query, headers) {
    return __awaiter$6(this, void 0, void 0, function* () {
      const form = new FormData();
      if (body instanceof FileList) {
        Array.from(body).forEach((file) => {
          form.append("files", file);
        });
      } else {
        body.files.forEach((file) => {
          form.append("files", "content" in file ? new Blob([file.content], {
            type: "text/plain"
          }) : file, file.name);
        });
      }
      return this.client.fetch(`/admin/uploads`, {
        method: "POST",
        headers: Object.assign(Object.assign({}, headers), {
          // Let the browser determine the content type.
          "content-type": null
        }),
        body: form,
        query
      });
    });
  }
  /**
   * This method retrieves a file's details by its ID. It sends a request to the
   * [Get File](https://docs.medusajs.com/api/admin#uploads_getuploadsid)
   * API route.
   *
   * @param id - The ID of the file to retrieve.
   * @param query - Query parameters to pass in the request.
   * @param headers - Headers to pass in the request.
   * @returns The file's details.
   *
   * @example
   * sdk.admin.upload.retrieve("test.txt")
   * .then(({ file }) => {
   *   console.log(file)
   * })
   */
  retrieve(id, query, headers) {
    return __awaiter$6(this, void 0, void 0, function* () {
      return this.client.fetch(`/admin/uploads/${id}`, {
        query,
        headers
      });
    });
  }
  /**
   * This method deletes a file by its ID from the configured File Module Provider. It sends a request to the
   * [Delete File](https://docs.medusajs.com/api/admin#uploads_deleteuploadsid)
   * API route.
   *
   * @param id - The ID of the file to delete.
   * @param headers - Headers to pass in the request.
   * @returns The deletion's details.
   *
   * @example
   * sdk.admin.upload.delete("test.txt")
   * .then(({ deleted }) => {
   *   console.log(deleted)
   * })
   */
  delete(id, headers) {
    return __awaiter$6(this, void 0, void 0, function* () {
      return this.client.fetch(`/admin/uploads/${id}`, {
        method: "DELETE",
        headers
      });
    });
  }
  /**
   * This method creates a presigned URL for a file upload. It sends a request to the
   * `/admin/uploads/presigned-urls` API route.
   *
   * @param body - The details of the file to upload.
   * @param query - Query parameters to pass in the request.
   * @param headers - Headers to pass in the request.
   * @returns The presigned URL for the file upload.
   *
   * @example
   * sdk.admin.upload.presignedUrl({
   *   name: "test.txt",
   *   size: 1000,
   *   type: "text/plain",
   * }))
   */
  presignedUrl(body, query, headers) {
    return __awaiter$6(this, void 0, void 0, function* () {
      return this.client.fetch(`/admin/uploads/presigned-urls`, {
        method: "POST",
        headers,
        body,
        query
      });
    });
  }
}
var __awaiter$5 = function(thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function(resolve) {
      resolve(value);
    });
  }
  return new (P || (P = Promise))(function(resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }
    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }
    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};
class User {
  /**
   * @ignore
   */
  constructor(client) {
    this.client = client;
  }
  /**
   * This method updates a user. It sends a request to the
   * [Update User](https://docs.medusajs.com/api/admin#users_postusersid)
   * API route.
   *
   * @param id - The ID of the user to update.
   * @param body - The details of the user to update.
   * @param query - Configure the fields and relations to retrieve in the tax region.
   * @param headers - Headers to pass in the request.
   * @returns The user's details.
   *
   * @example
   * sdk.admin.user.update("user_123", {
   *   first_name: "John",
   *   last_name: "Doe",
   * })
   * .then(({ user }) => {
   *   console.log(user)
   * })
   */
  update(id, body, query, headers) {
    return __awaiter$5(this, void 0, void 0, function* () {
      return this.client.fetch(`/admin/users/${id}`, {
        method: "POST",
        headers,
        body,
        query
      });
    });
  }
  /**
   * This method retrieves a list of users. It sends a request to the
   * [List Users](https://docs.medusajs.com/api/admin#users_getusers)
   * API route.
   *
   * @param queryParams - Filters and pagination configurations.
   * @param headers - Headers to pass in the request.
   * @returns The list of users.
   *
   * @example
   * To retrieve the list of users:
   *
   * ```ts
   * sdk.admin.user.list()
   * .then(({ users, count, limit, offset }) => {
   *   console.log(users)
   * })
   * ```
   *
   * To configure the pagination, pass the `limit` and `offset` query parameters.
   *
   * For example, to retrieve only 10 items and skip 10 items:
   *
   * ```ts
   * sdk.admin.user.list({
   *   limit: 10,
   *   offset: 10
   * })
   * .then(({ users, count, limit, offset }) => {
   *   console.log(users)
   * })
   * ```
   *
   * Using the `fields` query parameter, you can specify the fields and relations to retrieve
   * in each user:
   *
   * ```ts
   * sdk.admin.user.list({
   *   fields: "id,email"
   * })
   * .then(({ users, count, limit, offset }) => {
   *   console.log(users)
   * })
   * ```
   *
   * Learn more about the `fields` property in the [API reference](https://docs.medusajs.com/api/admin#select-fields-and-relations).
   */
  list(queryParams, headers) {
    return __awaiter$5(this, void 0, void 0, function* () {
      return this.client.fetch(`/admin/users`, {
        headers,
        query: queryParams
      });
    });
  }
  /**
   * This method retrieves a user. It sends a request to the
   * [Get User](https://docs.medusajs.com/api/admin#users_getusersid)
   * API route.
   *
   * @param id - The ID of the user to retrieve.
   * @param query - Configure the fields and relations to retrieve in the user.
   * @param headers - Headers to pass in the request.
   * @returns The user's details.
   *
   * @example
   * To retrieve a user by its ID:
   *
   * ```ts
   * sdk.admin.user.retrieve("user_123")
   * .then(({ user }) => {
   *   console.log(user)
   * })
   * ```
   *
   * To specify the fields and relations to retrieve:
   *
   * ```ts
   * sdk.admin.user.retrieve("user_123", {
   *   fields: "id,email"
   * })
   * .then(({ user }) => {
   *   console.log(user)
   * })
   * ```
   *
   * Learn more about the `fields` property in the [API reference](https://docs.medusajs.com/api/admin#select-fields-and-relations).
   */
  retrieve(id, query, headers) {
    return __awaiter$5(this, void 0, void 0, function* () {
      return this.client.fetch(`/admin/users/${id}`, {
        query,
        headers
      });
    });
  }
  /**
   * This method deletes a user. It sends a request to the
   * [Delete User](https://docs.medusajs.com/api/admin#users_deleteusersid)
   * API route.
   *
   * @param id - The ID of the user to delete.
   * @param headers - Headers to pass in the request.
   * @returns The deletion's details.
   *
   * @example
   * sdk.admin.user.delete("user_123")
   * .then(({ deleted }) => {
   *   console.log(deleted)
   * })
   */
  delete(id, headers) {
    return __awaiter$5(this, void 0, void 0, function* () {
      return this.client.fetch(`/admin/users/${id}`, {
        method: "DELETE",
        headers
      });
    });
  }
  /**
   * This method retrieves the currently authenticated user. It sends a request to the
   * [Get Logged-In User](https://docs.medusajs.com/api/admin#users_getusersme)
   * API route.
   *
   * @param query - Configure the fields and relations to retrieve in the user.
   * @param headers - Headers to pass in the request.
   * @returns The user's details.
   *
   * @example
   * To retrieve the currently authenticated user:
   *
   * ```ts
   * sdk.admin.user.me()
   * .then(({ user }) => {
   *   console.log(user)
   * })
   * ```
   *
   * To specify the fields and relations to retrieve:
   *
   * ```ts
   * sdk.admin.user.me({
   *   fields: "id,email"
   * })
   * .then(({ user }) => {
   *   console.log(user)
   * })
   * ```
   *
   * Learn more about the `fields` property in the [API reference](https://docs.medusajs.com/api/admin#select-fields-and-relations).
   */
  me(query, headers) {
    return __awaiter$5(this, void 0, void 0, function* () {
      return this.client.fetch(`/admin/users/me`, {
        query,
        headers
      });
    });
  }
}
var __awaiter$4 = function(thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function(resolve) {
      resolve(value);
    });
  }
  return new (P || (P = Promise))(function(resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }
    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }
    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};
class Views {
  constructor(client) {
    this.client = client;
  }
  /**
   * @since 2.10.3
   * @featureFlag view_configurations
   */
  columns(entity, query, headers) {
    return __awaiter$4(this, void 0, void 0, function* () {
      return yield this.client.fetch(`/admin/views/${entity}/columns`, {
        method: "GET",
        headers,
        query
      });
    });
  }
  /**
   * @since 2.10.3
   * @featureFlag view_configurations
   */
  listConfigurations(entity, query, headers) {
    return __awaiter$4(this, void 0, void 0, function* () {
      return yield this.client.fetch(`/admin/views/${entity}/configurations`, {
        method: "GET",
        headers,
        query
      });
    });
  }
  /**
   * @since 2.10.3
   * @featureFlag view_configurations
   */
  createConfiguration(entity, body, headers) {
    return __awaiter$4(this, void 0, void 0, function* () {
      return yield this.client.fetch(`/admin/views/${entity}/configurations`, {
        method: "POST",
        headers,
        body
      });
    });
  }
  /**
   * @since 2.10.3
   * @featureFlag view_configurations
   */
  retrieveConfiguration(entity, id, query, headers) {
    return __awaiter$4(this, void 0, void 0, function* () {
      return yield this.client.fetch(`/admin/views/${entity}/configurations/${id}`, {
        method: "GET",
        headers,
        query
      });
    });
  }
  /**
   * @since 2.10.3
   * @featureFlag view_configurations
   */
  updateConfiguration(entity, id, body, headers) {
    return __awaiter$4(this, void 0, void 0, function* () {
      return yield this.client.fetch(`/admin/views/${entity}/configurations/${id}`, {
        method: "POST",
        headers,
        body
      });
    });
  }
  /**
   * @since 2.10.3
   * @featureFlag view_configurations
   */
  deleteConfiguration(entity, id, headers) {
    return __awaiter$4(this, void 0, void 0, function* () {
      return yield this.client.fetch(`/admin/views/${entity}/configurations/${id}`, {
        method: "DELETE",
        headers
      });
    });
  }
  /**
   * @since 2.10.3
   * @featureFlag view_configurations
   */
  retrieveActiveConfiguration(entity, headers) {
    return __awaiter$4(this, void 0, void 0, function* () {
      return yield this.client.fetch(`/admin/views/${entity}/configurations/active`, {
        method: "GET",
        headers
      });
    });
  }
  /**
   * @since 2.10.3
   * @featureFlag view_configurations
   */
  setActiveConfiguration(entity, body, headers) {
    return __awaiter$4(this, void 0, void 0, function* () {
      return yield this.client.fetch(`/admin/views/${entity}/configurations/active`, {
        method: "POST",
        headers,
        body
      });
    });
  }
}
var __awaiter$3 = function(thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function(resolve) {
      resolve(value);
    });
  }
  return new (P || (P = Promise))(function(resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }
    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }
    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};
class WorkflowExecution {
  /**
   * @ignore
   */
  constructor(client) {
    this.client = client;
  }
  /**
   * This method retrieves a list of workflow executions. It sends a request to the
   * [List Workflow Executions](https://docs.medusajs.com/api/admin#workflows-executions_getworkflowsexecutions)
   * API route.
   *
   * @param queryParams - Filters and pagination configurations.
   * @param headers - Headers to pass in the request.
   * @returns The list of workflow executions.
   *
   * @example
   * To retrieve the list of workflow executions:
   *
   * ```ts
   * sdk.admin.workflowExecution.list()
   * .then(({ workflow_executions, count, limit, offset }) => {
   *   console.log(workflow_executions)
   * })
   * ```
   *
   * To configure the pagination, pass the `limit` and `offset` query parameters.
   *
   * For example, to retrieve only 10 items and skip 10 items:
   *
   * ```ts
   * sdk.admin.workflowExecution.list({
   *   limit: 10,
   *   offset: 10
   * })
   * .then(({ workflow_executions, count, limit, offset }) => {
   *   console.log(workflow_executions)
   * })
   * ```
   *
   * Using the `fields` query parameter, you can specify the fields and relations to retrieve
   * in each workflow execution:
   *
   * ```ts
   * sdk.admin.workflowExecution.list({
   *   fields: "id,name"
   * })
   * .then(({ workflow_executions, count, limit, offset }) => {
   *   console.log(workflow_executions)
   * })
   * ```
   *
   * Learn more about the `fields` property in the [API reference](https://docs.medusajs.com/api/admin#select-fields-and-relations).
   */
  list(queryParams, headers) {
    return __awaiter$3(this, void 0, void 0, function* () {
      return yield this.client.fetch(`/admin/workflows-executions`, {
        query: queryParams,
        headers
      });
    });
  }
  /**
   * This method retrieves a workflow execution by its ID. It sends a request to the
   * [Get Workflow Execution](https://docs.medusajs.com/api/admin#workflows-executions_getworkflowsexecutionsworkflow_idtransaction_id)
   * API route.
   *
   * @param id - The ID of the workflow execution to retrieve.
   * @param headers - Headers to pass in the request.
   * @returns The workflow execution's details.
   *
   * @example
   * sdk.admin.workflowExecution.retrieve("wrk_123")
   * .then(({ workflow_execution }) => {
   *   console.log(workflow_execution)
   * })
   */
  retrieve(id, headers) {
    return __awaiter$3(this, void 0, void 0, function* () {
      return yield this.client.fetch(`/admin/workflows-executions/${id}`, {
        headers
      });
    });
  }
}
var __awaiter$2 = function(thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function(resolve) {
      resolve(value);
    });
  }
  return new (P || (P = Promise))(function(resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }
    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }
    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};
class ShippingOptionType {
  /**
   * @ignore
   */
  constructor(client) {
    this.client = client;
  }
  /**
   * This method creates a shipping option type. It sends a request to the
   * [Create Shipping Option Type](https://docs.medusajs.com/api/admin#shipping-option-types_postshippingoptiontypes)
   * API route.
   *
   * @param body - The shipping option type's details.
   * @param query - Configure the fields to retrieve in the shipping option type.
   * @param headers - Headers to pass in the request
   * @returns The shipping option type's details.
   *
   * @example
   * sdk.admin.shippingOptionType.create({
   *   label: "Standard",
   *   code: "standard",
   *   description: "Ship in 2-3 days."
   * })
   * .then(({ shipping_option_type }) => {
   *   console.log(shipping_option_type)
   * })
   */
  create(body, query, headers) {
    return __awaiter$2(this, void 0, void 0, function* () {
      return this.client.fetch(`/admin/shipping-option-types`, {
        method: "POST",
        headers,
        body,
        query
      });
    });
  }
  /**
   * This method updates a shipping option type. It sends a request to the
   * [Update Shipping Option Type](https://docs.medusajs.com/api/admin#shipping-option-types_postshippingoptiontypesid)
   * API route.
   *
   * @param id - The shipping option type's ID.
   * @param body - The data to update in the shipping option type.
   * @param query - Configure the fields to retrieve in the shipping option type.
   * @param headers - Headers to pass in the request
   * @returns The shipping option type's details.
   *
   * @example
   * sdk.admin.shippingOptionType.update("sotype_123", {
   *   code: "express"
   * })
   * .then(({ shipping_option_type }) => {
   *   console.log(shipping_option_type)
   * })
   */
  update(id, body, query, headers) {
    return __awaiter$2(this, void 0, void 0, function* () {
      return this.client.fetch(`/admin/shipping-option-types/${id}`, {
        method: "POST",
        headers,
        body,
        query
      });
    });
  }
  /**
   * This method retrieves a paginated list of shipping option types. It sends a request to the
   * [List Shipping Option Types](https://docs.medusajs.com/api/admin#shipping-option-types_getshippingoptiontypes) API route.
   *
   * @param query - Filters and pagination configurations.
   * @param headers - Headers to pass in the request.
   * @returns The paginated list of shipping option types.
   *
   * @example
   * To retrieve the list of shipping option types:
   *
   * ```ts
   * sdk.admin.shippingOptionType.list()
   * .then(({ shipping_option_types, count, limit, offset }) => {
   *   console.log(shipping_option_types)
   * })
   * ```
   *
   * To configure the pagination, pass the `limit` and `offset` query parameters.
   *
   * For example, to retrieve only 10 items and skip 10 items:
   *
   * ```ts
   * sdk.admin.shippingOptionType.list({
   *   limit: 10,
   *   offset: 10
   * })
   * .then(({ shipping_option_types, count, limit, offset }) => {
   *   console.log(shipping_option_types)
   * })
   * ```
   *
   * Using the `fields` query parameter, you can specify the fields and relations to retrieve
   * in each shipping option type:
   *
   * ```ts
   * sdk.admin.shippingOptionType.list({
   *   fields: "id,*shippingOptions"
   * })
   * .then(({ shipping_option_types, count, limit, offset }) => {
   *   console.log(shipping_option_types)
   * })
   * ```
   *
   * Learn more about the `fields` property in the [API reference](https://docs.medusajs.com/api/store#select-fields-and-relations).
   */
  list(query, headers) {
    return __awaiter$2(this, void 0, void 0, function* () {
      return this.client.fetch(`/admin/shipping-option-types`, {
        headers,
        query
      });
    });
  }
  /**
   * This method retrieves a shipping option type by its ID. It sends a request to the
   * [Get Shipping Option Type](https://docs.medusajs.com/api/admin#shipping-option-types_getshippingoptiontypesid)
   * API route.
   *
   * @param id - The shipping option type's ID.
   * @param query - Configure the fields to retrieve in the shipping option type.
   * @param headers - Headers to pass in the request
   * @returns The shipping option type's details.
   *
   * @example
   * To retrieve a shipping option type by its ID:
   *
   * ```ts
   * sdk.admin.shippingOptionType.retrieve("sotype_123")
   * .then(({ shipping_option_type }) => {
   *   console.log(shipping_option_type)
   * })
   * ```
   *
   * To specify the fields and relations to retrieve:
   *
   * ```ts
   * sdk.admin.shippingOptionType.retrieve("sotype_123", {
   *   fields: "id,*shippingOptions"
   * })
   * .then(({ shipping_option_type }) => {
   *   console.log(shipping_option_type)
   * })
   * ```
   *
   * Learn more about the `fields` property in the [API reference](https://docs.medusajs.com/api/store#select-fields-and-relations).
   */
  retrieve(id, query, headers) {
    return __awaiter$2(this, void 0, void 0, function* () {
      return this.client.fetch(`/admin/shipping-option-types/${id}`, {
        query,
        headers
      });
    });
  }
  /**
   * This method deletes a shipping option type. It sends a request to the
   * [Delete Shipping Option Type](https://docs.medusajs.com/api/admin#shipping-option-types_deleteshippingoptiontypesid)
   * API route.
   *
   * @param id - The shipping option type's ID.
   * @param headers - Headers to pass in the request
   * @returns The shipping option type's details.
   *
   * @example
   * sdk.admin.shippingOptionType.delete("sotype_123")
   * .then(({ deleted }) => {
   *   console.log(deleted)
   * })
   */
  delete(id, headers) {
    return __awaiter$2(this, void 0, void 0, function* () {
      return this.client.fetch(`/admin/shipping-option-types/${id}`, {
        method: "DELETE",
        headers
      });
    });
  }
}
class Admin {
  constructor(client) {
    this.invite = new Invite(client);
    this.customer = new Customer(client);
    this.productCollection = new ProductCollection(client);
    this.productCategory = new ProductCategory(client);
    this.priceList = new PriceList(client);
    this.pricePreference = new PricePreference(client);
    this.product = new Product(client);
    this.productType = new ProductType(client);
    this.upload = new Upload(client);
    this.region = new Region(client);
    this.returnReason = new ReturnReason(client);
    this.stockLocation = new StockLocation(client);
    this.salesChannel = new SalesChannel(client);
    this.fulfillmentSet = new FulfillmentSet(client);
    this.fulfillment = new Fulfillment(client);
    this.fulfillmentProvider = new FulfillmentProvider(client);
    this.shippingOption = new ShippingOption(client);
    this.shippingOptionType = new ShippingOptionType(client);
    this.shippingProfile = new ShippingProfile(client);
    this.inventoryItem = new InventoryItem(client);
    this.notification = new Notification(client);
    this.order = new Order(client);
    this.draftOrder = new DraftOrder(client);
    this.orderEdit = new OrderEdit(client);
    this.return = new Return(client);
    this.claim = new Claim(client);
    this.taxRate = new TaxRate(client);
    this.taxRegion = new TaxRegion(client);
    this.store = new Store$1(client);
    this.productTag = new ProductTag(client);
    this.user = new User(client);
    this.currency = new Currency(client);
    this.payment = new Payment(client);
    this.productVariant = new ProductVariant(client);
    this.refundReason = new RefundReason(client);
    this.exchange = new Exchange(client);
    this.paymentCollection = new PaymentCollection(client);
    this.apiKey = new ApiKey(client);
    this.workflowExecution = new WorkflowExecution(client);
    this.reservation = new Reservation(client);
    this.customerGroup = new CustomerGroup(client);
    this.promotion = new Promotion(client);
    this.campaign = new Campaign(client);
    this.plugin = new Plugin(client);
    this.taxProvider = new TaxProvider(client);
    this.views = new Views(client);
  }
}
var __awaiter$1 = function(thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function(resolve) {
      resolve(value);
    });
  }
  return new (P || (P = Promise))(function(resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }
    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }
    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};
class Auth {
  constructor(client, config2) {
    this.register = (actor, method, payload) => __awaiter$1(this, void 0, void 0, function* () {
      const { token } = yield this.client.fetch(`/auth/${actor}/${method}/register`, {
        method: "POST",
        body: payload
      });
      this.client.setToken(token);
      return token;
    });
    this.login = (actor, method, payload) => __awaiter$1(this, void 0, void 0, function* () {
      const { token, location } = yield this.client.fetch(`/auth/${actor}/${method}`, {
        method: "POST",
        body: payload
      });
      if (location) {
        return { location };
      }
      yield this.setToken_(token);
      return token;
    });
    this.callback = (actor, method, query) => __awaiter$1(this, void 0, void 0, function* () {
      const { token } = yield this.client.fetch(`/auth/${actor}/${method}/callback`, {
        method: "GET",
        query
      });
      yield this.setToken_(token);
      return token;
    });
    this.refresh = (headers) => __awaiter$1(this, void 0, void 0, function* () {
      const { token } = yield this.client.fetch("/auth/token/refresh", {
        method: "POST",
        headers
      });
      yield this.setToken_(token);
      return token;
    });
    this.logout = () => __awaiter$1(this, void 0, void 0, function* () {
      var _a, _b;
      if (((_b = (_a = this.config) === null || _a === void 0 ? void 0 : _a.auth) === null || _b === void 0 ? void 0 : _b.type) === "session") {
        yield this.client.fetch("/auth/session", {
          method: "DELETE"
        });
      }
      this.client.clearToken();
    });
    this.resetPassword = (actor, provider, body) => __awaiter$1(this, void 0, void 0, function* () {
      yield this.client.fetch(`/auth/${actor}/${provider}/reset-password`, {
        method: "POST",
        body,
        headers: { accept: "text/plain" }
        // 201 Created response
      });
    });
    this.updateProvider = (actor, provider, body, token) => __awaiter$1(this, void 0, void 0, function* () {
      yield this.client.fetch(`/auth/${actor}/${provider}/update`, {
        method: "POST",
        body,
        headers: { Authorization: `Bearer ${token}` }
      });
    });
    this.setToken_ = (token) => __awaiter$1(this, void 0, void 0, function* () {
      var _a, _b;
      if (((_b = (_a = this.config) === null || _a === void 0 ? void 0 : _a.auth) === null || _b === void 0 ? void 0 : _b.type) === "session") {
        yield this.client.fetch("/auth/session", {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        this.client.setToken(token);
      }
    });
    this.client = client;
    this.config = config2;
  }
}
var __awaiter = function(thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function(resolve) {
      resolve(value);
    });
  }
  return new (P || (P = Promise))(function(resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }
    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }
    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};
class Store2 {
  /**
   * @ignore
   */
  constructor(client) {
    this.region = {
      /**
       * This method retrieves the paginated list of regions in the store. It sends a request to the
       * [List Regions API route](https://docs.medusajs.com/api/store#regions_getregions).
       *
       * Related guide: [How to list regions in a storefront](https://docs.medusajs.com/resources/storefront-development/regions/list).
       *
       * @param query - Filters and pagination configurations.
       * @param headers - Headers to pass in the request
       * @returns The paginated list of regions.
       *
       * @example
       * To retrieve the list of regions:
       *
       * ```ts
       * sdk.store.region.list()
       * .then(({ regions, count, limit, offset }) => {
       *   console.log(regions)
       * })
       * ```
       *
       * To configure the pagination, pass the `limit` and `offset` query parameters.
       *
       * For example, to retrieve only 10 items and skip 10 items:
       *
       * ```ts
       * sdk.store.region.list({
       *   limit: 10,
       *   offset: 10
       * })
       * .then(({ regions, count, limit, offset }) => {
       *   console.log(regions)
       * })
       * ```
       *
       * Using the `fields` query parameter, you can specify the fields and relations to retrieve
       * in each region:
       *
       * ```ts
       * sdk.store.region.list({
       *   fields: "id,*countries"
       * })
       * .then(({ regions, count, limit, offset }) => {
       *   console.log(regions)
       * })
       * ```
       *
       * Learn more about the `fields` property in the [API reference](https://docs.medusajs.com/api/store#select-fields-and-relations).
       */
      list: (query, headers) => __awaiter(this, void 0, void 0, function* () {
        return this.client.fetch(`/store/regions`, {
          query,
          headers
        });
      }),
      /**
       * This method retrieves a region by its ID. It sends a request to the [Get Region](https://docs.medusajs.com/api/store#regions_getregionsid)
       * API route.
       *
       * Related guide: [Store and retrieve regions in a storefront](https://docs.medusajs.com/resources/storefront-development/regions/store-retrieve-region).
       *
       * @param id - The region's ID.
       * @param query - Configure the fields to retrieve in the region.
       * @param headers - Headers to pass in the request
       * @returns The region.
       *
       * @example
       * To retrieve a region by its ID:
       *
       * ```ts
       * sdk.store.region.retrieve("reg_123")
       * .then(({ region }) => {
       *   console.log(region)
       * })
       * ```
       *
       * To specify the fields and relations to retrieve:
       *
       * ```ts
       * sdk.store.region.retrieve(
       *   "reg_123",
       *   {
       *     fields: "id,*countries"
       *   }
       * )
       * .then(({ region }) => {
       *   console.log(region)
       * })
       * ```
       *
       * Learn more about the `fields` property in the [API reference](https://docs.medusajs.com/api/store#select-fields-and-relations).
       */
      retrieve: (id, query, headers) => __awaiter(this, void 0, void 0, function* () {
        return this.client.fetch(`/store/regions/${id}`, {
          query,
          headers
        });
      })
    };
    this.collection = {
      /**
       * This method retrieves a paginated list of product collections. It sends a request to the
       * [List Collections](https://docs.medusajs.com/api/store#collections_getcollections) API route.
       *
       * Related guide: [How to retrieve collections in a storefront](https://docs.medusajs.com/resources/storefront-development/products/collections/list).
       *
       * @param query - Filters and pagination configurations.
       * @param headers - Headers to pass in the request
       * @returns The paginated list of collections.
       *
       * @example
       * To retrieve the list of collections:
       *
       * ```ts
       * sdk.store.collection.list()
       * .then(({ collections, count, limit, offset }) => {
       *   console.log(collections)
       * })
       * ```
       *
       * To configure the pagination, pass the `limit` and `offset` query parameters.
       *
       * For example, to retrieve only 10 items and skip 10 items:
       *
       * ```ts
       * sdk.store.collection.list({
       *   limit: 10,
       *   offset: 10
       * })
       * .then(({ collections, count, limit, offset }) => {
       *   console.log(collections)
       * })
       * ```
       *
       * Using the `fields` query parameter, you can specify the fields and relations to retrieve
       * in each collection:
       *
       * ```ts
       * sdk.store.collection.list({
       *   fields: "id,handle"
       * })
       * .then(({ collections, count, limit, offset }) => {
       *   console.log(collections)
       * })
       * ```
       *
       * Learn more about the `fields` property in the [API reference](https://docs.medusajs.com/api/store#select-fields-and-relations).
       */
      list: (query, headers) => __awaiter(this, void 0, void 0, function* () {
        return this.client.fetch(`/store/collections`, {
          query,
          headers
        });
      }),
      /**
       * This method retrieves a collection by its ID. It sends a request to the [Get Collection](https://docs.medusajs.com/api/store#collections_getcollectionsid)
       * API route.
       *
       * Related guide: [How to retrieve a collection in a storefront](https://docs.medusajs.com/resources/storefront-development/products/collections/retrieve).
       *
       * @param id - The ID of the collection to retrieve.
       * @param query - Configure the fields to retrieve in the collection.
       * @param headers - Headers to pass in the request
       * @returns The collection.
       *
       * @example
       * To retrieve a collection by its ID:
       *
       * ```ts
       * sdk.store.collection.retrieve("pcol_123")
       * .then(({ collection }) => {
       *   console.log(collection)
       * })
       * ```
       *
       * To specify the fields and relations to retrieve:
       *
       * ```ts
       * sdk.store.collection.retrieve("pcol_123", {
       *   fields: "id,handle"
       * })
       * .then(({ collection }) => {
       *   console.log(collection)
       * })
       * ```
       *
       * Learn more about the `fields` property in the [API reference](https://docs.medusajs.com/api/store#select-fields-and-relations).
       */
      retrieve: (id, query, headers) => __awaiter(this, void 0, void 0, function* () {
        return this.client.fetch(`/store/collections/${id}`, {
          query,
          headers
        });
      })
    };
    this.category = {
      /**
       * This method retrieves a paginated list of product categories. It sends a request to the
       * [List Categories](https://docs.medusajs.com/api/store#product-categories_getproductcategories) API route.
       *
       * Related guide: [How to retrieve list of categories in the storefront](https://docs.medusajs.com/resources/storefront-development/products/categories/list).
       *
       * @param query - Filters and pagination configurations.
       * @param headers - Headers to pass in the request.
       * @returns The paginated list of categories.
       *
       * @example
       * To retrieve the list of categories:
       *
       * ```ts
       * sdk.store.category.list()
       * .then(({ product_categories, count, offset, limit }) => {
       *   console.log(product_categories)
       * })
       * ```
       *
       * To configure the pagination, pass the `limit` and `offset` query parameters.
       *
       * For example, to retrieve only 10 items and skip 10 items:
       *
       * ```ts
       * sdk.store.category.list({
       *   limit: 10,
       *   offset: 10
       * })
       * .then(({ product_categories, count, offset, limit }) => {
       *   console.log(product_categories)
       * })
       * ```
       *
       * Using the `fields` query parameter, you can specify the fields and relations to retrieve
       * in each category:
       *
       * ```ts
       * sdk.store.category.list({
       *   fields: "id,*parent_category"
       * })
       * .then(({ product_categories, count, offset, limit }) => {
       *   console.log(product_categories)
       * })
       * ```
       *
       * Learn more about the `fields` property in the [API reference](https://docs.medusajs.com/api/store#select-fields-and-relations).
       */
      list: (query, headers) => __awaiter(this, void 0, void 0, function* () {
        return this.client.fetch(`/store/product-categories`, {
          query,
          headers
        });
      }),
      /**
       * This method retrieves a category by its ID. It sends a request to the
       * [Retrieve Product Category](https://docs.medusajs.com/api/store#product-categories_getproductcategoriesid).
       *
       * Related guide: [How to retrieve a category in the storefront](https://docs.medusajs.com/resources/storefront-development/products/categories/retrieve).
       *
       * @param id - The ID of the category to retrieve.
       * @param query - Configure the fields to retrieve in the category.
       * @param headers - Headers to pass in the request
       * @returns The category.
       *
       * @example
       * To retrieve a category by its ID:
       *
       * ```ts
       * sdk.store.category.retrieve("pcat_123")
       * .then(({ product_category }) => {
       *   console.log(product_category)
       * })
       * ```
       *
       * To specify the fields and relations to retrieve:
       *
       * ```ts
       * sdk.store.category.retrieve("pcat_123", {
       *   fields: "id,*parent_category"
       * })
       * .then(({ product_category }) => {
       *   console.log(product_category)
       * })
       * ```
       *
       * Learn more about the `fields` property in the [API reference](https://docs.medusajs.com/api/store#select-fields-and-relations).
       */
      retrieve: (id, query, headers) => __awaiter(this, void 0, void 0, function* () {
        return this.client.fetch(`/store/product-categories/${id}`, {
          query,
          headers
        });
      })
    };
    this.product = {
      /**
       * This method retrieves a list of products. It sends a request to the
       * [List Products API route](https://docs.medusajs.com/api/store#products_getproducts).
       *
       * Related guides:
       *
       * - [How to list products in a storefront](https://docs.medusajs.com/resources/storefront-development/products/list).
       * - [How to retrieve a product variant's prices in the storefront](https://docs.medusajs.com/resources/storefront-development/products/price)
       *
       * @param query - Filters and pagination configurations.
       * @param headers - Headers to pass in the request.
       * @returns The paginated list of products.
       *
       * @example
       * To retrieve the list of products:
       *
       * ```ts
       * sdk.store.product.list()
       * .then(({ products, count, offset, limit }) => {
       *   console.log(products)
       * })
       * ```
       *
       * To configure the pagination, pass the `limit` and `offset` query parameters.
       *
       * For example, to retrieve only 10 items and skip 10 items:
       *
       * ```ts
       * sdk.store.product.list({
       *   limit: 10,
       *   offset: 10
       * })
       * .then(({ products, count, offset, limit }) => {
       *   console.log(products)
       * })
       * ```
       *
       * Using the `fields` query parameter, you can specify the fields and relations to retrieve
       * in each product:
       *
       * ```ts
       * sdk.store.product.list({
       *   fields: "id,*collection"
       * })
       * .then(({ products, count, offset, limit }) => {
       *   console.log(products)
       * })
       * ```
       *
       * Learn more about the `fields` property in the [API reference](https://docs.medusajs.com/api/store#select-fields-and-relations).
       */
      list: (query, headers) => __awaiter(this, void 0, void 0, function* () {
        return this.client.fetch(`/store/products`, {
          query,
          headers
        });
      }),
      /**
       * This method is used to retrieve a product by its ID. It sends a request to the
       * [Get Product](https://docs.medusajs.com/api/store#products_getproductsid) API route.
       *
       * Related guides:
       *
       * - [How to retrieve a product in the storefront](https://docs.medusajs.com/resources/storefront-development/products/retrieve).
       * - [How to retrieve a product variant's prices in the storefront](https://docs.medusajs.com/resources/storefront-development/products/price)
       *
       * @param id - The product's ID.
       * @param query - Configure the fields to retrieve in the product.
       * @param headers - Headers to pass in the request
       * @returns The product.
       *
       * @example
       * To retrieve a product by its ID:
       *
       * ```ts
       * sdk.store.product.retrieve("prod_123")
       * .then(({ product }) => {
       *   console.log(product)
       * })
       * ```
       *
       * To specify the fields and relations to retrieve:
       *
       * ```ts
       * sdk.store.product.retrieve("prod_123", {
       *   fields: "id,*collection"
       * })
       * .then(({ product }) => {
       *   console.log(product)
       * })
       * ```
       *
       * Learn more about the `fields` property in the [API reference](https://docs.medusajs.com/api/store#select-fields-and-relations).
       */
      retrieve: (id, query, headers) => __awaiter(this, void 0, void 0, function* () {
        return this.client.fetch(`/store/products/${id}`, {
          query,
          headers
        });
      })
    };
    this.cart = {
      /**
       * This method creates a cart. It sends a request to the [Create Cart](https://docs.medusajs.com/api/store#carts_postcarts)
       * API route.
       *
       * Related guide: [How to create a cart in the storefront](https://docs.medusajs.com/resources/storefront-development/cart/create).
       *
       * @param body - The details of the cart to create.
       * @param query - Configure the fields to retrieve in the cart.
       * @param headers - Headers to pass in the request.
       * @returns The created cart.
       *
       * @example
       * sdk.store.cart.create({
       *   region_id: "reg_123"
       * })
       * .then(({ cart }) => {
       *   console.log(cart)
       * })
       */
      create: (body, query, headers) => __awaiter(this, void 0, void 0, function* () {
        return this.client.fetch(`/store/carts`, {
          method: "POST",
          headers,
          body,
          query
        });
      }),
      /**
       * This method updates a cart. It sends a request to the
       * [Update Cart](https://docs.medusajs.com/api/store#carts_postcartsid) API route.
       *
       * Related guide: [How to update a cart in the storefront](https://docs.medusajs.com/resources/storefront-development/cart/update).
       *
       * @param id - The cart's ID.
       * @param body - The data to update in the cart.
       * @param query - Configure the fields to retrieve in the cart.
       * @param headers - Headers to pass in the request.
       * @returns The updated cart.
       *
       * @example
       * sdk.store.cart.update("cart_123", {
       *   region_id: "reg_123"
       * })
       * .then(({ cart }) => {
       *   console.log(cart)
       * })
       */
      update: (id, body, query, headers) => __awaiter(this, void 0, void 0, function* () {
        return this.client.fetch(`/store/carts/${id}`, {
          method: "POST",
          headers,
          body,
          query
        });
      }),
      /**
       * This method retrieves a cart by its ID. It sends a request to the
       * [Get Cart](https://docs.medusajs.com/api/store#carts_getcartsid) API route.
       *
       * Related guide: [How to retrieve a cart in the storefront](https://docs.medusajs.com/resources/storefront-development/cart/retrieve).
       *
       * @param id - The cart's ID.
       * @param query - Configure the fields to retrieve in the cart.
       * @param headers - Headers to pass in the request.
       * @returns The cart's details.
       *
       * @example
       * To retrieve a cart by its ID:
       *
       * ```ts
       * sdk.store.cart.retrieve("cart_123")
       * .then(({ cart }) => {
       *   console.log(cart)
       * })
       * ```
       *
       * To specify the fields and relations to retrieve:
       *
       * ```ts
       * sdk.store.cart.retrieve("cart_123", {
       *   fields: "id,*items"
       * })
       * .then(({ cart }) => {
       *   console.log(cart)
       * })
       * ```
       *
       * Learn more about the `fields` property in the [API reference](https://docs.medusajs.com/api/store#select-fields-and-relations).
       */
      retrieve: (id, query, headers) => __awaiter(this, void 0, void 0, function* () {
        return this.client.fetch(`/store/carts/${id}`, {
          headers,
          query
        });
      }),
      /**
       * This methods adds a product variant to the cart as a line item. It sends a request to the
       * [Add Line Item](https://docs.medusajs.com/api/store#carts_postcartsidlineitems) API route.
       *
       * Related guide: [How to manage a cart's line items in the storefront](https://docs.medusajs.com/resources/storefront-development/cart/manage-items).
       *
       * @param cartId - The cart's ID.
       * @param body - The details of the item to add.
       * @param query - Configure the fields to retrieve in the cart.
       * @param headers - Headers to pass in the request.
       * @returns The cart's details.
       *
       * @example
       * sdk.store.cart.createLineItem("cart_123", {
       *   variant_id: "variant_123",
       *   quantity: 1
       * })
       * .then(({ cart }) => {
       *   console.log(cart)
       * })
       */
      createLineItem: (cartId, body, query, headers) => __awaiter(this, void 0, void 0, function* () {
        return this.client.fetch(`/store/carts/${cartId}/line-items`, {
          method: "POST",
          headers,
          body,
          query
        });
      }),
      /**
       * This method updates a line item in a cart. It sends a request to the
       * [Update Line Item](https://docs.medusajs.com/api/store#carts_postcartsidlineitemsline_id) API route.
       *
       * Related guide: [How to manage a cart's line items in the storefront](https://docs.medusajs.com/resources/storefront-development/cart/manage-items).
       *
       * @param cartId - The cart's ID.
       * @param lineItemId - The line item's ID.
       * @param body - The data to update.
       * @param query - Configure the fields to retrieve in the cart.
       * @param headers - Headers to pass in the request.
       * @returns The cart's details.
       *
       * @example
       * sdk.store.cart.updateLineItem(
       *   "cart_123",
       *   "li_123",
       *   {
       *     quantity: 1
       *   }
       * )
       * .then(({ cart }) => {
       *   console.log(cart)
       * })
       */
      updateLineItem: (cartId, lineItemId, body, query, headers) => __awaiter(this, void 0, void 0, function* () {
        return this.client.fetch(`/store/carts/${cartId}/line-items/${lineItemId}`, {
          method: "POST",
          headers,
          body,
          query
        });
      }),
      /**
       * This method deletes a line item from a cart. It sends a request to the
       * [Remove Line Item](https://docs.medusajs.com/api/store#carts_deletecartsidlineitemsline_id) API route.
       *
       * Related guide: [How to manage a cart's line items in the storefront](https://docs.medusajs.com/resources/storefront-development/cart/manage-items).
       *
       * @param cartId - The cart's ID.
       * @param lineItemId - The item's ID.
       * @param query - Configure the fields to retrieve in the cart.
       * @param headers - Headers to pass in the request.
       * @returns The deletion's details.
       *
       * @example
       * sdk.store.cart.deleteLineItem(
       *   "cart_123",
       *   "li_123"
       * )
       * .then(({ deleted, parent: cart }) => {
       *   console.log(deleted, cart)
       * })
       */
      deleteLineItem: (cartId, lineItemId, query, headers) => __awaiter(this, void 0, void 0, function* () {
        return this.client.fetch(`/store/carts/${cartId}/line-items/${lineItemId}`, {
          method: "DELETE",
          query,
          headers
        });
      }),
      /**
       * This method adds a shipping method to a cart. It sends a request to
       * the [Add Shipping Method](https://docs.medusajs.com/api/store#carts_postcartsidshippingmethods) API routes.
       *
       * Related guide: [Implement shipping step during checkout](https://docs.medusajs.com/resources/storefront-development/checkout/shipping).
       *
       * @param cartId - The cart's ID.
       * @param body - The shipping method's details.
       * @param query - Configure the fields to retrieve in the cart.
       * @param headers - Headers to pass in the request.
       * @returns The cart's details.
       *
       * @example
       * sdk.store.cart.addShippingMethod("cart_123", {
       *   option_id: "so_123",
       *   data: {
       *     // custom data for fulfillment provider.
       *   }
       * })
       * .then(({ cart }) => {
       *   console.log(cart)
       * })
       */
      addShippingMethod: (cartId, body, query, headers) => __awaiter(this, void 0, void 0, function* () {
        return this.client.fetch(`/store/carts/${cartId}/shipping-methods`, {
          method: "POST",
          headers,
          body,
          query
        });
      }),
      /**
       * This method completes a cart and places the order. It's the last step of the checkout flow.
       * The method sends a request to the [Complete Cart](https://docs.medusajs.com/api/store#carts_postcartsidcomplete)
       * API route.
       *
       * Related guide: [Learn how to complete cart in checkout flow](https://docs.medusajs.com/resources/storefront-development/checkout/complete-cart).
       *
       * @param cartId - The cart's ID.
       * @param query - Configure the fields to retrieve in the created order.
       * @param headers - Headers to pass in the request.
       * @returns The order's details, if it was placed successfully. Otherwise, the cart is returned with an error.
       *
       * @example
       * sdk.store.cart.complete("cart_123")
       * .then((data) => {
       *   if(data.type === "cart") {
       *     // an error occurred
       *     console.log(data.error, data.cart)
       *   } else {
       *     // order placed successfully
       *     console.log(data.order)
       *   }
       * })
       */
      complete: (cartId, query, headers) => __awaiter(this, void 0, void 0, function* () {
        return this.client.fetch(`/store/carts/${cartId}/complete`, {
          method: "POST",
          headers,
          query
        });
      }),
      /**
       * This method updates the customer of a cart.
       *
       * @param id - The cart's ID.
       * @param query - Configure the fields to retrieve in the cart.
       * @param headers - Headers to pass in the request.
       * @returns The updated cart.
       *
       * @example
       * // TODO must be authenticated as the customer to set the cart's customer
       * sdk.store.cart.transferCart("cart_123")
       * .then(({ cart }) => {
       *   console.log(cart)
       * })
       */
      transferCart: (id, query, headers) => __awaiter(this, void 0, void 0, function* () {
        return this.client.fetch(`/store/carts/${id}/customer`, {
          method: "POST",
          headers,
          query
        });
      })
    };
    this.fulfillment = {
      /**
       * This method retrieves the list of shipping options for a cart. It sends a request to
       * the [List Shipping Options](https://docs.medusajs.com/api/store#shipping-options_getshippingoptions)
       * API route.
       *
       * Related guide: [Implement shipping step during checkout](https://docs.medusajs.com/resources/storefront-development/checkout/shipping).
       *
       * @param query - The cart's details along with configurations of the fields to retrieve in the options.
       * @param headers - Headers to pass in the request.
       * @returns The shipping options that can be used for the cart.
       *
       * @example
       * sdk.store.fulfillment.listCartOptions({
       *   cart_id: "cart_123"
       * })
       * .then(({ shipping_options }) => {
       *   console.log(shipping_options)
       * })
       */
      listCartOptions: (query, headers) => __awaiter(this, void 0, void 0, function* () {
        return this.client.fetch(`/store/shipping-options`, {
          headers,
          query
        });
      }),
      /**
       * This method calculates the price of a shipping option in a cart, which is useful during checkout.
       * It sends a request to the [Calculate Shipping Option Price](https://docs.medusajs.com/api/store#shipping-options_postshippingoptionsidcalculate)
       * API route.
       *
       * @param id - The shipping option's ID.
       * @param body - The price calculation's details.
       * @param query - Configure the fields to retrieve in the shipping option.
       * @param headers - Headers to pass in the request.
       * @returns The shipping option's details.
       *
       * @example
       * sdk.store.fulfillment.calculate("so_123", {
       *   cart_id: "cart_123"
       * })
       * .then(({ shipping_option }) => {
       *   console.log(shipping_option)
       * })
       */
      calculate: (id, body, query, headers) => __awaiter(this, void 0, void 0, function* () {
        return yield this.client.fetch(`/store/shipping-options/${id}/calculate`, {
          method: "POST",
          headers,
          body,
          query
        });
      })
    };
    this.payment = {
      /**
       * This method retrieves the payment providers available in a region, which is useful during checkout.
       * It sends a request to the [List Payment Providers](https://docs.medusajs.com/api/store#payment-providers_getpaymentproviders)
       * API route.
       *
       * Related guide: [Implement payment step during checkout](https://docs.medusajs.com/resources/storefront-development/checkout/payment).
       *
       * @param query - The filters to apply on the retrieved providers, along with configurations of the
       * fields to retrieve in the options.
       * @param headers - Headers to pass in the request.
       * @returns The list of payment providers.
       *
       * @example
       * To retrieve the list of payment providers for a region:
       *
       * ```ts
       * sdk.store.payment.listPaymentProviders({
       *   region_id: "reg_123"
       * })
       * .then(({ payment_providers, count, offset, limit }) => {
       *   console.log(payment_providers)
       * })
       * ```
       *
       * To configure the pagination, pass the `limit` and `offset` query parameters.
       *
       * For example, to retrieve only 10 items and skip 10 items:
       *
       * ```ts
       * sdk.store.payment.listPaymentProviders({
       *   region_id: "reg_123",
       *   limit: 10,
       *   offset: 10
       * })
       * .then(({ payment_providers, count, offset, limit }) => {
       *   console.log(payment_providers)
       * })
       * ```
       *
       * Using the `fields` query parameter, you can specify the fields and relations to retrieve
       * in each provider:
       *
       * ```ts
       * sdk.store.payment.listPaymentProviders({
       *   region_id: "reg_123",
       *   limit: 10,
       *   offset: 10,
       *   fields: "id"
       * })
       * .then(({ payment_providers, count, offset, limit }) => {
       *   console.log(payment_providers)
       * })
       * ```
       *
       * Learn more about the `fields` property in the [API reference](https://docs.medusajs.com/api/store#select-fields-and-relations).
       */
      listPaymentProviders: (query, headers) => __awaiter(this, void 0, void 0, function* () {
        return this.client.fetch(`/store/payment-providers`, {
          headers,
          query
        });
      }),
      /**
       * This method creates a payment session of a cart's payment collection, selecting a payment provider.
       * It sends a request to the [Initialize Payment Session](https://docs.medusajs.com/api/store#payment-collections_postpaymentcollectionsidpaymentsessions)
       * API route.
       *
       * If the cart doesn't have a payment collection, a payment collection is created for the cart by
       * sending a request to the [Create Payment Collection](https://docs.medusajs.com/api/store#payment-collections_postpaymentcollections)
       * API route.
       *
       * Related guide: [Implement payment step during checkout](https://docs.medusajs.com/resources/storefront-development/checkout/payment).
       *
       * @param cart - The cart's details.
       * @param body - The payment session's details.
       * @param query - Configure the fields to retrieve in the payment collection.
       * @param headers - Headers to pass in the request.
       * @returns The payment collection's details.
       *
       * @example
       * sdk.store.payment.initiatePaymentSession(
       *   cart, // assuming you already have the cart object.
       *   {
       *     provider_id: "pp_stripe_stripe",
       *     data: {
       *       // any data relevant for the provider.
       *     }
       *   }
       * )
       * .then(({ payment_collection }) => {
       *   console.log(payment_collection)
       * })
       */
      initiatePaymentSession: (cart2, body, query, headers) => __awaiter(this, void 0, void 0, function* () {
        var _a;
        let paymentCollectionId = (_a = cart2.payment_collection) === null || _a === void 0 ? void 0 : _a.id;
        if (!paymentCollectionId) {
          const collectionBody = {
            cart_id: cart2.id
          };
          paymentCollectionId = (yield this.client.fetch(`/store/payment-collections`, {
            method: "POST",
            headers,
            body: collectionBody
          })).payment_collection.id;
        }
        return this.client.fetch(`/store/payment-collections/${paymentCollectionId}/payment-sessions`, {
          method: "POST",
          headers,
          body,
          query
        });
      })
    };
    this.order = {
      /**
       * This method retrieves a paginated list of orders matching the specified filters. It
       * sends a request to the [List Orders](https://docs.medusajs.com/api/store#orders_getorders)
       * API route.
       *
       * @param query - Configure the fields to retrieve in the orders.
       * @param headers - Headers to pass in the request.
       * @returns The paginated list of orders.
       *
       * @example
       * To retrieve the list of orders:
       *
       * ```ts
       * // TODO must be authenticated as the customer to list their orders
       * sdk.store.order.list()
       * .then(({ orders, count, offset, limit }) => {
       *   console.log(orders)
       * })
       * ```
       *
       * To configure the pagination, pass the `limit` and `offset` query parameters.
       *
       * For example, to retrieve only 10 items and skip 10 items:
       *
       * ```ts
       * // TODO must be authenticated as the customer to list their orders
       * sdk.store.order.list({
       *   limit: 10,
       *   offset: 10
       * })
       * .then(({ orders, count, offset, limit }) => {
       *   console.log(orders)
       * })
       * ```
       *
       * Using the `fields` query parameter, you can specify the fields and relations to retrieve
       * in each order:
       *
       * ```ts
       * // TODO must be authenticated as the customer to list their orders
       * sdk.store.order.list({
       *   fields: "id,*items"
       * })
       * .then(({ orders, count, offset, limit }) => {
       *   console.log(orders)
       * })
       * ```
       *
       * Learn more about the `fields` property in the [API reference](https://docs.medusajs.com/api/store#select-fields-and-relations).
       */
      list: (query, headers) => __awaiter(this, void 0, void 0, function* () {
        return this.client.fetch(`/store/orders`, {
          query,
          headers
        });
      }),
      /**
       * This method retrieves an order by its ID. It sends a request to the
       * [Get Order](https://docs.medusajs.com/api/store#orders_getordersid) API route.
       *
       * @param id - The order's ID.
       * @param query - Configure the fields to retrieve in the order.
       * @param headers - Headers to pass in the request.
       * @returns The order's details.
       *
       * @example
       * To retrieve an order by its ID:
       *
       * ```ts
       * sdk.store.order.retrieve("order_123")
       * .then(({ order }) => {
       *   console.log(order)
       * })
       * ```
       *
       * To specify the fields and relations to retrieve:
       *
       * ```ts
       * sdk.store.order.retrieve("order_123", {
       *   fields: "id,*items"
       * })
       * .then(({ order }) => {
       *   console.log(order)
       * })
       * ```
       *
       * Learn more about the `fields` property in the [API reference](https://docs.medusajs.com/api/store#select-fields-and-relations).
       */
      retrieve: (id, query, headers) => __awaiter(this, void 0, void 0, function* () {
        return this.client.fetch(`/store/orders/${id}`, {
          headers,
          query
        });
      }),
      /**
       * This method requests a order transfer from a guest account to the current, logged in customer account.
       *
       * Customer requesting the transfer must be logged in.
       *
       * @param body - The transfer's details.
       * @param query - Configure the fields to retrieve in the order.
       * @param headers - Headers to pass in the request.
       * @returns The order details.
       *
       * @example
       * // TODO must be authenticated as the customer to request the order transfer
       * sdk.store.order.requestTransfer(
       *   "order_123",
       *   {
       *     description: "I want to transfer this order to my friend."
       *   },
       *   {},
       *   {
       *     Authorization: `Bearer ${token}`
       *   }
       * )
       * .then(({ order }) => {
       *   console.log(order)
       * })
       */
      requestTransfer: (id, body, query, headers) => __awaiter(this, void 0, void 0, function* () {
        return this.client.fetch(`/store/orders/${id}/transfer/request`, {
          method: "POST",
          headers,
          body,
          query
        });
      }),
      /**
       * This method cancels an order transfer request.
       *
       * Customer requesting the transfer must be logged in.
       *
       * @param id - The order's ID.
       * @param query - Configure the fields to retrieve in the order.
       * @param headers - Headers to pass in the request.
       * @returns The order details.
       *
       * @example
       * // TODO must be authenticated as the customer to cancel the order transfer
       * sdk.store.order.cancelTransfer(
       *   "order_123",
       *   {},
       *   {
       *     Authorization: `Bearer ${token}`
       *   }
       * )
       * .then(({ order }) => {
       *   console.log(order)
       * })
       */
      cancelTransfer: (id, query, headers) => __awaiter(this, void 0, void 0, function* () {
        return this.client.fetch(`/store/orders/${id}/transfer/cancel`, {
          method: "POST",
          headers,
          query
        });
      }),
      /**
       * The method called for the original owner to accept the order transfer to a new owner.
       *
       * @param id - The order's ID.
       * @param body - The payload containing the transfer token.
       * @param query - Configure the fields to retrieve in the order.
       * @param headers - Headers to pass in the request.
       * @returns The order details.
       *
       * @example
       * sdk.store.order.acceptTransfer(
       *   "order_123",
       *   {
       *     token: "transfer_token"
       *   },
       *   {
       *     Authorization: `Bearer ${token}`
       *   }
       * )
       * .then(({ order }) => {
       *   console.log(order)
       * })
       */
      acceptTransfer: (id, body, query, headers) => __awaiter(this, void 0, void 0, function* () {
        return this.client.fetch(`/store/orders/${id}/transfer/accept`, {
          method: "POST",
          headers,
          body,
          query
        });
      }),
      /**
       * The method called for the original owner to decline the order transfer to a new owner.
       *
       * @param id - The order's ID.
       * @param body - The payload containing the transfer token.
       * @param query - Configure the fields to retrieve in the order.
       * @param headers - Headers to pass in the request.
       * @returns The order details.
       *
       * @example
       * sdk.store.order.declineTransfer(
       *   "order_123",
       *   {
       *     token: "transfer_token"
       *   },
       *   {
       *     Authorization: `Bearer ${token}`
       *   }
       * )
       * .then(({ order }) => {
       *   console.log(order)
       * })
       */
      declineTransfer: (id, body, query, headers) => __awaiter(this, void 0, void 0, function* () {
        return this.client.fetch(`/store/orders/${id}/transfer/decline`, {
          method: "POST",
          headers,
          body,
          query
        });
      })
    };
    this.customer = {
      /**
       * This method registers a customer. It sends a request to the [Register Customer](https://docs.medusajs.com/api/store#customers_postcustomers)
       * API route.
       *
       * You must use the {@link Auth.register} method first to retrieve a registration token. Then, pass that
       * registration token in the `headers` parameter of this method as an authorization bearer header.
       *
       * Related guide: [How to register customer in storefront](https://docs.medusajs.com/resources/storefront-development/customers/register)
       *
       * @param body - The customer's details.
       * @param query - Configure the fields to retrieve in the customer.
       * @param headers - Headers to pass in the request. This is where you include the authorization JWT registration token.
       * @returns The customer's details.
       *
       * @example
       * const token = await sdk.auth.register("customer", "emailpass", {
       *   "email": "customer@gmail.com",
       *   "password": "supersecret"
       * })
       *
       * sdk.store.customer.create(
       *   {
       *     "email": "customer@gmail.com"
       *   },
       *   {},
       *   {
       *     Authorization: `Bearer ${token}`
       *   }
       * )
       * .then(({ customer }) => {
       *   console.log(customer)
       * })
       */
      create: (body, query, headers) => __awaiter(this, void 0, void 0, function* () {
        return this.client.fetch(`/store/customers`, {
          method: "POST",
          headers,
          body,
          query
        });
      }),
      /**
       * This method updates the logged-in customer's details. The customer must be logged in
       * first with the {@link Auth.login} method.
       *
       * It sends a request to the
       * [Update Customer](https://docs.medusajs.com/api/store#customers_postcustomersme) API route.
       *
       * Related guide: [How to edit customer's profile in the storefront](https://docs.medusajs.com/resources/storefront-development/customers/profile).
       *
       * @param body - The customer's details to update.
       * @param query - Configure the fields to retrieve in the customer.
       * @param headers - Headers to pass in the request.
       * @returns The customer's details.
       *
       * @example
       * // TODO must be authenticated as the customer to update their details
       * sdk.store.customer.update({
       *   first_name: "John"
       * })
       * .then(({ customer }) => {
       *   console.log(customer)
       * })
       */
      update: (body, query, headers) => __awaiter(this, void 0, void 0, function* () {
        return this.client.fetch(`/store/customers/me`, {
          method: "POST",
          headers,
          body,
          query
        });
      }),
      /**
       * This method retrieves the logged-in customer's details. The customer must be logged in
       * first with the {@link Auth.login} method.
       *
       * It sends a request to the [Get Logged-In Customer](https://docs.medusajs.com/api/store#customers_getcustomersme)
       * API route.
       *
       * @param query - Configure the fields to retrieve in the customer.
       * @param headers - Headers to pass in the request.
       * @returns The customer's details.
       *
       * @example
       * // TODO must be authenticated as the customer to retrieve their details
       * sdk.store.customer.retrieve()
       * .then(({ customer }) => {
       *   console.log(customer)
       * })
       */
      retrieve: (query, headers) => __awaiter(this, void 0, void 0, function* () {
        return this.client.fetch(`/store/customers/me`, {
          query,
          headers
        });
      }),
      /**
       * This method creates an address for the logged-in customer. The customer must be logged in
       * first with the {@link Auth.login} method.
       *
       * It sends a request to the [Create Address](https://docs.medusajs.com/api/store#customers_postcustomersmeaddresses)
       * API route.
       *
       * Related guides: [How to manage customer's addresses in the storefront](https://docs.medusajs.com/resources/storefront-development/customers/addresses)
       *
       * @param body - The address's details.
       * @param query - Configure the fields to retrieve in the customer.
       * @param headers - Headers to pass in the request.
       * @returns The customer's details.
       *
       * @example
       * // TODO must be authenticated as the customer to create an address
       * sdk.store.customer.createAddress({
       *   country_code: "us"
       * })
       * .then(({ customer }) => {
       *   console.log(customer)
       * })
       */
      createAddress: (body, query, headers) => __awaiter(this, void 0, void 0, function* () {
        return this.client.fetch(`/store/customers/me/addresses`, {
          method: "POST",
          headers,
          body,
          query
        });
      }),
      /**
       * This method updates the address of the logged-in customer. The customer must be logged in
       * first with the {@link Auth.login} method.
       *
       * It sends a request to the [Update Address](https://docs.medusajs.com/api/store#customers_postcustomersmeaddressesaddress_id)
       * API route.
       *
       * Related guides: [How to manage customer's addresses in the storefront](https://docs.medusajs.com/resources/storefront-development/customers/addresses)
       *
       * @param addressId - The ID of the address to update.
       * @param body - The details to update in the address.
       * @param query - Configure the fields to retrieve in the customer.
       * @param headers - Headers to pass in the request.
       * @returns The customer's details.
       *
       * @example
       * // TODO must be authenticated as the customer to update their address
       * sdk.store.customer.updateAddress(
       *   "caddr_123",
       *   {
       *     country_code: "us"
       *   }
       * )
       * .then(({ customer }) => {
       *   console.log(customer)
       * })
       */
      updateAddress: (addressId, body, query, headers) => __awaiter(this, void 0, void 0, function* () {
        return this.client.fetch(`/store/customers/me/addresses/${addressId}`, {
          method: "POST",
          headers,
          body,
          query
        });
      }),
      /**
       * This method retrieves the logged-in customer's address. The customer must be logged in
       * first with the {@link Auth.login} method.
       *
       * It sends a request to the [List Customer's Address](https://docs.medusajs.com/api/store#customers_getcustomersmeaddresses)
       * API route.
       *
       * Related guides: [How to manage customer's addresses in the storefront](https://docs.medusajs.com/resources/storefront-development/customers/addresses)
       *
       * @param query - Configure the fields to retrieve in the addresses.
       * @param headers - Headers to pass in the request.
       * @returns The paginated list of addresses.
       *
       * @example
       * To retrieve the list of addresses:
       *
       * ```ts
       * // TODO must be authenticated as the customer to list their addresses
       * sdk.store.customer.listAddress()
       * .then(({ addresses, count, offset, limit }) => {
       *   console.log(addresses)
       * })
       * ```
       *
       * To configure the pagination, pass the `limit` and `offset` query parameters.
       *
       * For example, to retrieve only 10 items and skip 10 items:
       *
       * ```ts
       * // TODO must be authenticated as the customer to list their addresses
       * sdk.store.customer.listAddress({
       *   limit: 10,
       *   offset: 10
       * })
       * .then(({ addresses, count, offset, limit }) => {
       *   console.log(addresses)
       * })
       * ```
       *
       * Using the `fields` query parameter, you can specify the fields and relations to retrieve
       * in each address:
       *
       * ```ts
       * // TODO must be authenticated as the customer to list their addresses
       * sdk.store.customer.listAddress({
       *   fields: "id,country_code"
       * })
       * .then(({ addresses, count, offset, limit }) => {
       *   console.log(addresses)
       * })
       * ```
       *
       * Learn more about the `fields` property in the [API reference](https://docs.medusajs.com/api/store#select-fields-and-relations).
       */
      listAddress: (query, headers) => __awaiter(this, void 0, void 0, function* () {
        return this.client.fetch(`/store/customers/me/addresses`, {
          query,
          headers
        });
      }),
      /**
       * This method retrieves an address of the logged-in customer. The customer must be logged in
       * first with the {@link Auth.login} method.
       *
       * It sends a request to the [Get Address](https://docs.medusajs.com/api/store#customers_getcustomersmeaddressesaddress_id)
       * API route.
       *
       * Related guides: [How to manage customer's addresses in the storefront](https://docs.medusajs.com/resources/storefront-development/customers/addresses)
       *
       * @param addressId - The address's ID.
       * @param query - Configure the fields to retrieve in the address.
       * @param headers - Headers to pass in the request.
       * @returns The address's details.
       *
       * @example
       * To retrieve an address by its ID:
       *
       * ```ts
       * // TODO must be authenticated as the customer to retrieve their address
       * sdk.store.customer.retrieveAddress(
       *   "caddr_123"
       * )
       * .then(({ address }) => {
       *   console.log(address)
       * })
       * ```
       *
       * To specify the fields and relations to retrieve:
       *
       * ```ts
       * // TODO must be authenticated as the customer to retrieve their address
       * sdk.store.customer.retrieveAddress(
       *   "caddr_123",
       *   {
       *     fields: "id,country_code"
       *   }
       * )
       * .then(({ address }) => {
       *   console.log(address)
       * })
       * ```
       *
       * Learn more about the `fields` property in the [API reference](https://docs.medusajs.com/api/store#select-fields-and-relations).
       */
      retrieveAddress: (addressId, query, headers) => __awaiter(this, void 0, void 0, function* () {
        return this.client.fetch(`/store/customers/me/addresses/${addressId}`, {
          query,
          headers
        });
      }),
      /**
       * This method deletes an address of the logged-in customer. The customer must be logged in
       * first with the {@link Auth.login} method.
       *
       * It sends a request to the [Remove Address](https://docs.medusajs.com/api/store#customers_deletecustomersmeaddressesaddress_id)
       * API route.
       *
       * Related guides: [How to manage customer's addresses in the storefront](https://docs.medusajs.com/resources/storefront-development/customers/addresses)
       *
       * @param addressId - The address's ID.
       * @param headers - Headers to pass in the request.
       * @returns The deletion's details.
       *
       * @example
       * // TODO must be authenticated as the customer to delete their address
       * sdk.store.customer.deleteAddress("caddr_123")
       * .then(({ deleted, parent: customer }) => {
       *   console.log(customer)
       * })
       */
      deleteAddress: (addressId, headers) => __awaiter(this, void 0, void 0, function* () {
        return this.client.fetch(`/store/customers/me/addresses/${addressId}`, {
          method: "DELETE",
          headers
        });
      })
    };
    this.client = client;
  }
}
class Medusa {
  constructor(config2) {
    this.client = new Client(config2);
    this.admin = new Admin(this.client);
    this.store = new Store2(this.client);
    this.auth = new Auth(this.client, config2);
  }
}
class AdminProductReviewsResource {
  constructor(client) {
    __publicField(this, "client");
    this.client = client;
  }
  async list(query) {
    return this.client.fetch(`/admin/product-reviews`, {
      method: "GET",
      query
    });
  }
  async updateStatus(productReviewId, status) {
    return this.client.fetch(`/admin/product-reviews/${productReviewId}/status`, {
      method: "PUT",
      body: { status }
    });
  }
  async createResponse(productReviewId, data2) {
    return this.client.fetch(`/admin/product-reviews/${productReviewId}/response`, {
      method: "POST",
      body: data2
    });
  }
  async updateResponse(productReviewId, data2) {
    return this.client.fetch(`/admin/product-reviews/${productReviewId}/response`, {
      method: "PUT",
      body: data2
    });
  }
  async deleteResponse(productReviewId) {
    return this.client.fetch(`/admin/product-reviews/${productReviewId}/response`, {
      method: "DELETE"
    });
  }
}
class ExtendedAdminSDK extends Admin {
  constructor(client) {
    super(client);
    __publicField(this, "productReviews");
    this.productReviews = new AdminProductReviewsResource(client);
  }
}
class StoreProductReviewsResource {
  constructor(client) {
    __publicField(this, "client");
    this.client = client;
  }
  async upsert(data2, headers) {
    return this.client.fetch(`/store/product-reviews`, {
      method: "POST",
      body: data2,
      headers
    });
  }
  async list(query, headers) {
    return this.client.fetch(`/store/product-reviews`, {
      method: "GET",
      query,
      headers
    });
  }
  async listStats(query, headers) {
    return this.client.fetch(`/store/product-review-stats`, {
      method: "GET",
      query,
      headers
    });
  }
}
class ExtendedStorefrontSDK extends Store2 {
  constructor(client) {
    super(client);
    __publicField(this, "productReviews");
    this.productReviews = new StoreProductReviewsResource(client);
  }
}
class MedusaPluginsSDK extends Medusa {
  constructor(config2) {
    super(config2);
    __publicField(this, "admin");
    __publicField(this, "store");
    this.admin = new ExtendedAdminSDK(this.client);
    this.store = new ExtendedStorefrontSDK(this.client);
  }
}
const buildNewLRUCache = ({ max }) => {
  const lruInstance = new LRUCache({ max });
  const lru = {
    set(key, value) {
      var _a;
      const ttl = totalTtl(value == null ? void 0 : value.metadata);
      return lruInstance.set(key, value, {
        ttl: ttl === Infinity ? void 0 : ttl,
        start: (_a = value == null ? void 0 : value.metadata) == null ? void 0 : _a.createdTime
      });
    },
    get(key) {
      return lruInstance.get(key);
    },
    delete(key) {
      return lruInstance.delete(key);
    }
  };
  return lru;
};
const MILLIS = {
  TEN_SECONDS: 1e4,
  ONE_HOUR: 36e5
};
let MEDUSA_BACKEND_URL = "http://localhost:7901";
if (process.env.INTERNAL_MEDUSA_API_URL) {
  MEDUSA_BACKEND_URL = process.env.INTERNAL_MEDUSA_API_URL;
}
if (process.env.PUBLIC_MEDUSA_API_URL) {
  MEDUSA_BACKEND_URL = process.env.PUBLIC_MEDUSA_API_URL;
}
const baseMedusaConfig = {
  baseUrl: MEDUSA_BACKEND_URL,
  debug: process.env.NODE_ENV === "development",
  publishableKey: config.MEDUSA_PUBLISHABLE_KEY
};
const sdk = new MedusaPluginsSDK({
  ...baseMedusaConfig
});
const sdkCache = buildNewLRUCache({ max: 1e3 });
const ONE_HOUR_IN_MS = 36e5;
const listRegions = async function() {
  return cachified({
    key: "list-regions",
    cache: sdkCache,
    staleWhileRevalidate: ONE_HOUR_IN_MS,
    ttl: 1e4,
    async getFreshValue() {
      return _listRegions();
    }
  });
};
const _listRegions = async function() {
  return sdk.store.region.list({}).then(({ regions }) => regions).catch(medusaError);
};
const _retrieveRegion = async function(id) {
  return sdk.store.region.retrieve(id, {}).then(({ region }) => region).catch(medusaError);
};
const retrieveRegion = async function(id) {
  return cachified({
    key: `region-${id}`,
    cache: sdkCache,
    staleWhileRevalidate: 15e4,
    ttl: 1e4,
    async getFreshValue() {
      return _retrieveRegion(id);
    }
  });
};
const getDefaultRegion = async function() {
  const regions = await listRegions().catch((err) => {
    console.error(err);
    return [];
  });
  return regions.sort((r) => {
    var _a;
    return ((_a = r.countries) == null ? void 0 : _a.some((c) => c.iso_2 === "us")) ? -1 : 1;
  })[0];
};
const getSelectedRegion = async (headers) => {
  const regionId = await getSelectedRegionId(headers);
  if (regionId) {
    try {
      return await retrieveRegion(regionId);
    } catch (e) {
      console.warn("RegionId is not valid, using default region");
    }
  }
  return await getDefaultRegion();
};
const getProductsById = ({
  ids,
  regionId
}) => {
  return sdk.store.product.list({
    id: ids,
    region_id: regionId,
    fields: "*variants.calculated_price,+variants.inventory_quantity"
  }).then(({ products }) => products);
};
const retrieveCart = withAuthHeaders(async (request, authHeaders) => {
  const cartId = await getCartId(request.headers);
  if (!cartId) {
    return null;
  }
  return await sdk.store.cart.retrieve(cartId, {}, authHeaders).then(({ cart: cart2 }) => cart2).catch(() => {
    return null;
  });
});
const createCart = withAuthHeaders(async (request, authHeaders, data2) => {
  return await sdk.store.cart.create({ ...data2 }, {}, authHeaders);
});
const updateCart = withAuthHeaders(async (request, authHeaders, data2) => {
  const cartId = await getCartId(request.headers);
  if (!cartId) {
    throw new Error("No existing cart found, please create one before updating");
  }
  return sdk.store.cart.update(cartId, data2, {}, authHeaders).catch(medusaError);
});
const addToCart = withAuthHeaders(
  async (request, authHeaders, data2) => {
    const { variantId, quantity } = data2;
    if (!variantId) {
      throw new Error("Missing variant ID when adding to cart");
    }
    const cartId = await getCartId(request.headers);
    if (cartId) {
      return await sdk.store.cart.createLineItem(
        cartId,
        {
          variant_id: variantId,
          quantity
        },
        {},
        authHeaders
      );
    }
    const region = await getSelectedRegion(request.headers);
    const cart2 = await createCart(request, { region_id: region.id, items: [{ variant_id: variantId, quantity }] });
    return cart2;
  }
);
const ensurePaypalPaymentSession = async (request, cart2) => {
  var _a, _b;
  if (!cart2) throw new Error("Cart was not provided.");
  let activeSession = (_b = (_a = cart2.payment_collection) == null ? void 0 : _a.payment_sessions) == null ? void 0 : _b.find((session) => session.status === "pending");
  if (!activeSession) {
    await initiatePaymentSession(request, cart2, {
      provider_id: "pp_paypal_paypal"
    });
    return await retrieveCart(request);
  }
  return cart2;
};
const updateLineItem = withAuthHeaders(
  async (request, authHeaders, {
    lineId,
    quantity
  }) => {
    if (!lineId) {
      throw new Error("Missing lineItem ID when updating line item");
    }
    const cartId = await getCartId(request.headers);
    if (!cartId) {
      throw new Error("Missing cart ID when updating line item");
    }
    return await sdk.store.cart.updateLineItem(cartId, lineId, { quantity }, {}, authHeaders).catch(medusaError);
  }
);
const deleteLineItem = withAuthHeaders(async (request, authHeaders, lineId) => {
  if (!lineId) {
    throw new Error("Missing lineItem ID when deleting line item");
  }
  const cartId = await getCartId(request.headers);
  if (!cartId) {
    throw new Error("Missing cart ID when deleting line item");
  }
  return await sdk.store.cart.deleteLineItem(cartId, lineId, authHeaders).catch(medusaError);
});
async function enrichLineItems(lineItems, regionId) {
  if (!(lineItems == null ? void 0 : lineItems.length)) return [];
  const queryParams = {
    ids: lineItems.map((lineItem) => lineItem.product_id),
    regionId
  };
  const products = await getProductsById(queryParams);
  if (!(products == null ? void 0 : products.length)) {
    return [];
  }
  const enrichedItems = lineItems.map((item) => {
    var _a;
    const product2 = products.find((p) => p.id === item.product_id);
    const variant = (_a = product2 == null ? void 0 : product2.variants) == null ? void 0 : _a.find((v) => v.id === item.variant_id);
    if (!product2 || !variant) {
      return item;
    }
    return {
      ...item,
      variant: {
        ...variant,
        product: omit(product2, "variants")
      }
    };
  });
  return enrichedItems;
}
const setShippingMethod = withAuthHeaders(
  async (request, authHeaders, {
    cartId,
    shippingOptionId
  }) => {
    return sdk.store.cart.addShippingMethod(cartId, { option_id: shippingOptionId }, {}, authHeaders).catch(medusaError);
  }
);
const initiatePaymentSession = withAuthHeaders(
  async (request, authHeaders, cart2, data2) => {
    return sdk.store.payment.initiatePaymentSession(cart2, data2, {}, authHeaders).catch(medusaError);
  }
);
const placeOrder = withAuthHeaders(async (request, authHeaders) => {
  const cartId = await getCartId(request.headers);
  if (!cartId) {
    throw new Error("No existing cart found when placing an order");
  }
  const cartRes = await sdk.store.cart.complete(cartId, {}, authHeaders).catch(medusaError);
  return cartRes;
});
const getCustomer = withAuthHeaders(async (request, authHeaders) => {
  return await sdk.store.customer.retrieve({}, authHeaders).then(({ customer }) => customer).catch(() => null);
});
const fetchProducts = async (request, { ...query } = {}) => {
  const region = await getSelectedRegion(request.headers);
  return await cachified({
    key: `products-${JSON.stringify(query)}`,
    cache: sdkCache,
    staleWhileRevalidate: MILLIS.ONE_HOUR,
    ttl: MILLIS.TEN_SECONDS,
    async getFreshValue() {
      return await sdk.store.product.list({
        ...query,
        region_id: region.id
      });
    }
  });
};
const fetchHasProducts = async (request) => {
  return await fetchProducts(request, { limit: 1, offset: 999999 }).then((res) => res.count > 0);
};
const getRootLoader = async ({ request }) => {
  var _a;
  const region = await getSelectedRegion(request.headers);
  const [cart2, regions, customer, hasPublishedProducts] = await Promise.all([
    retrieveCart(request),
    listRegions(),
    getCustomer(request),
    fetchHasProducts(request)
  ]);
  const headers = new Headers();
  const currentRegionCookieId = await getSelectedRegionId(headers);
  if (currentRegionCookieId !== (region == null ? void 0 : region.id)) {
    await setSelectedRegionId(headers, region == null ? void 0 : region.id);
  }
  if ((_a = cart2 == null ? void 0 : cart2.items) == null ? void 0 : _a.length) {
    const enrichedItems = await enrichLineItems(cart2 == null ? void 0 : cart2.items, cart2 == null ? void 0 : cart2.region_id);
    cart2.items = enrichedItems;
  }
  const fontLinks = [];
  return data(
    {
      hasPublishedProducts,
      fontLinks,
      env: {
        NODE_ENV: config.NODE_ENV,
        ENVIRONMENT: config.ENVIRONMENT,
        STRIPE_PUBLIC_KEY: config.STRIPE_PUBLIC_KEY,
        PAYPAL_CLIENT_ID: config.PAYPAL_CLIENT_ID,
        PUBLIC_MEDUSA_API_URL: config.PUBLIC_MEDUSA_API_URL,
        STOREFRONT_URL: config.STOREFRONT_URL,
        SENTRY_DSN: config.SENTRY_DSN,
        SENTRY_ENVIRONMENT: config.SENTRY_ENVIRONMENT,
        EVENT_LOGGING: config.EVENT_LOGGING
      },
      customer,
      regions,
      region,
      siteDetails: {
        store: {
          name: "BARRIO"
        },
        settings: siteSettings,
        headerNavigationItems,
        footerNavigationItems
      },
      cart: cart2
    },
    { headers }
  );
};
const ButtonBaseInner = ({ as: T = "button", className, disabled, ...props }, ref) => {
  const type = T === "button" ? "button" : void 0;
  return /* @__PURE__ */ jsx(
    T,
    {
      ref,
      type,
      disabled,
      className: clsx(
        "button focus:ring-primary-300 inline-flex items-center justify-center gap-1 focus:outline-none focus:ring-2",
        { "cursor-not-allowed opacity-50": disabled },
        className
      ),
      ...props
    }
  );
};
const ButtonBase = forwardRef(ButtonBaseInner);
const selectStructureClassNames = (variant) => {
  switch (variant) {
    case "link":
      return "underline";
    case "ghost":
      return "";
    default:
      return "inline-flex items-center gap-2 rounded-full border";
  }
};
const selectSizeClassNames = (variant, size) => {
  if (variant === "link") {
    switch (size) {
      case "sm":
        return "text-sm";
      case "lg":
        return "text-lg";
      case "image":
        return "";
      default:
        return "text-base";
    }
  }
  switch (size) {
    case "sm":
      return "text-sm py-[9px] px-4";
    case "lg":
      return "text-lg py-[13px] px-6";
    case "image":
      return "";
    default:
      return "text-base py-[11px] px-5";
  }
};
const selectVariantClassNames = (variant) => {
  switch (variant) {
    case "primary":
      return "button--primary text-white bg-primary hover:bg-primary-800 focus:border-primary-500";
    case "link":
      return "button--link text-primary-600 hover:text-primary-500";
    case "ghost":
      return "";
    default:
      return "button--default border-primary-100 text-primary-700 hover:text-primary-800 bg-primary-50 hover:bg-primary-100";
  }
};
const Button = forwardRef(({ className, variant = "default", size, ...props }, ref) => /* @__PURE__ */ jsx(
  ButtonBase,
  {
    ref,
    className: clsx(
      selectStructureClassNames(variant),
      selectSizeClassNames(variant, size),
      selectVariantClassNames(variant),
      className
    ),
    ...props
  }
));
const ButtonLink = (props) => /* @__PURE__ */ jsx(Button, { variant: "link", ...props });
const IconButton = ({ icon: Icon, className, iconProps, ...props }) => /* @__PURE__ */ jsx(
  ButtonBase,
  {
    className: clsx(
      "icon-button inline-flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full border-none text-gray-500 placeholder:bg-transparent hover:bg-gray-100 hover:text-gray-700 focus:text-gray-700",
      className
    ),
    ...props,
    children: /* @__PURE__ */ jsx(Icon, { ...iconProps, className: clsx(iconProps == null ? void 0 : iconProps.className, "h-6 w-6 text-primary") })
  }
);
const FetcherCartKeyPrefix = "cart:";
const FetcherKeys = {
  cart: {
    accountDetails: `${FetcherCartKeyPrefix}account-details`,
    removePromotionCode: `${FetcherCartKeyPrefix}remove-promotion-code`,
    createLineItem: `${FetcherCartKeyPrefix}create-line-item`,
    removeLineItem: `${FetcherCartKeyPrefix}remove-line-item`,
    updateLineItem: `${FetcherCartKeyPrefix}update-line-item`
  }
};
const useRootLoaderData = () => {
  const matches = useMatches();
  const rootMatch = matches[0];
  return rootMatch.data;
};
const createReducer = ({
  actionHandlers: actionHandlers2,
  middleware
}) => {
  return (state, action2) => {
    const actionHandler = actionHandlers2[action2.name];
    if (!actionHandler) throw new Error(`Unhandled action type: ${action2.name}`);
    if (middleware) middleware(state, action2);
    const newState = actionHandler(state, action2.payload);
    return newState;
  };
};
var ToggleableTargets = /* @__PURE__ */ ((ToggleableTargets2) => {
  ToggleableTargets2["cart"] = "cart";
  ToggleableTargets2["login"] = "login";
  ToggleableTargets2["search"] = "search";
  return ToggleableTargets2;
})(ToggleableTargets || {});
var StorefrontActionNames = /* @__PURE__ */ ((StorefrontActionNames2) => {
  StorefrontActionNames2["toggle"] = "toggle";
  StorefrontActionNames2["set"] = "set";
  return StorefrontActionNames2;
})(StorefrontActionNames || {});
const StorefrontContext = createContext(null);
const actionHandlers$1 = {
  set: (state, { target, state: newTargetState }) => ({
    ...state,
    [target]: merge({}, state[target], newTargetState)
  }),
  toggle: (state, { target, open, state: newTargetState }) => ({
    ...state,
    [target]: merge({}, state[target], newTargetState, {
      open: open ?? !state[target].open
    })
  })
};
const reducer$1 = createReducer({ actionHandlers: actionHandlers$1 });
const storefrontInitialState = {
  cart: {},
  login: {},
  search: {}
};
const StorefrontProvider = ({ data: data2, ...props }) => {
  const [state, dispatch] = useReducer(reducer$1, storefrontInitialState);
  return /* @__PURE__ */ jsx(StorefrontContext.Provider, { value: { state: merge({}, state, data2), dispatch }, ...props });
};
const toggleActionDispatch = (target, payload) => {
  return typeof payload === "boolean" ? { name: StorefrontActionNames.toggle, payload: { open: payload, target } } : { name: StorefrontActionNames.toggle, payload: { ...payload, target } };
};
const actions$1 = ({ dispatch }) => ({
  toggleCartDrawer: (payload) => dispatch(toggleActionDispatch(ToggleableTargets.cart, payload)),
  toggleLoginModal: (payload) => dispatch(toggleActionDispatch(ToggleableTargets.login, payload)),
  toggleSearchDrawer: (payload) => dispatch(toggleActionDispatch(ToggleableTargets.search, payload))
});
const useStorefront = () => {
  const context = useContext(StorefrontContext);
  if (!context) throw new Error("useStorefront must be used within a StorefrontContext.Provider");
  return { ...context, actions: actions$1(context) };
};
const useCart = () => {
  var _a, _b, _c, _d, _e;
  const { state, actions: actions2 } = useStorefront();
  const data2 = useRootLoaderData();
  const fetchers = useFetchers();
  const [isRemovingLastItem, setIsRemovingLastItem] = useState(false);
  const timerRef = useRef(null);
  const prevItemCountRef = useRef(0);
  const cartFetchers = {
    // Find any fetcher that's removing items from cart
    removing: fetchers.find(
      (f) => {
        var _a2;
        return (f.state === "submitting" || f.state === "loading") && f.key === FetcherKeys.cart.removeLineItem && ((_a2 = f.formData) == null ? void 0 : _a2.get("lineItemId"));
      }
    ),
    // Find any fetcher that's adding items to cart
    adding: fetchers.filter(
      (f) => {
        var _a2;
        return f.key === FetcherKeys.cart.createLineItem && (f.state === "submitting" || f.state === "loading") && ((_a2 = f.formData) == null ? void 0 : _a2.has("variantId"));
      }
    )
  };
  const cart2 = data2 == null ? void 0 : data2.cart;
  const lineItems = (cart2 == null ? void 0 : cart2.items) || [];
  const itemCount = lineItems.length;
  if (cartFetchers.removing) {
    console.log("removing", (_b = (_a = cartFetchers.removing) == null ? void 0 : _a.formData) == null ? void 0 : _b.get("lineItemId"));
  }
  const isAddingItem = cartFetchers.adding.length > 0;
  const isRemovingItemId = (_d = (_c = cartFetchers.removing) == null ? void 0 : _c.formData) == null ? void 0 : _d.get("lineItemId");
  const isLastItemBeingRemoved = isRemovingItemId && (itemCount === 1 && isRemovingItemId === ((_e = lineItems[0]) == null ? void 0 : _e.id) || itemCount === 0 && prevItemCountRef.current === 1 && cartFetchers.removing);
  const clearTimer = useCallback(() => {
    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);
  const toggleCartDrawer = useCallback(
    (open) => {
      if (open !== !!state.cart.open) {
        actions2.toggleCartDrawer(open);
        if (!open) {
          setIsRemovingLastItem(false);
        }
      }
    },
    [actions2, state.cart.open]
  );
  useEffect(() => {
    clearTimer();
    const cartDrawerOpen2 = !!state.cart.open;
    if (isLastItemBeingRemoved && !isRemovingLastItem) {
      setIsRemovingLastItem(true);
      if (cartDrawerOpen2) {
        timerRef.current = window.setTimeout(() => {
          actions2.toggleCartDrawer(false);
          setIsRemovingLastItem(false);
        }, 1500);
      }
    }
    prevItemCountRef.current = itemCount;
    return clearTimer;
  }, [state.cart.open, itemCount, isLastItemBeingRemoved, isRemovingLastItem, actions2, clearTimer]);
  useEffect(() => {
    if (!state.cart.open || isAddingItem) {
      setIsRemovingLastItem(false);
    }
  }, [state.cart.open, isAddingItem]);
  useEffect(() => {
    return clearTimer;
  }, [clearTimer]);
  const showEmptyCartMessage = !isAddingItem && itemCount === 0 && !isRemovingLastItem;
  const cartDrawerOpen = state.cart.open === true;
  return {
    cart: cart2,
    isAddingItem,
    isRemovingItemId,
    isRemovingLastItem,
    cartDrawerOpen,
    toggleCartDrawer,
    showEmptyCartMessage
  };
};
const useRegion = () => {
  const data2 = useRootLoaderData();
  if (!(data2 == null ? void 0 : data2.region)) throw new Error("No region data found, this should be provided in the root loader");
  return { region: data2 == null ? void 0 : data2.region };
};
const locale = "en-US";
function formatPrice(amount, options) {
  const defaultOptions = {
    currency: "usd",
    quantity: 1
  };
  const { currency, quantity } = merge({}, defaultOptions, options);
  if (currency === "vnd") {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "vnd",
      currencyDisplay: "code"
    }).format((amount || 0) * quantity);
  }
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency
  }).format((amount || 0) * quantity);
}
function sortProductVariantsByPrice(product2) {
  if (!product2.variants) return [];
  return product2.variants.sort((a, b) => getVariantFinalPrice(a) - getVariantFinalPrice(b));
}
function getVariantPrices(variant) {
  var _a, _b;
  return {
    calculated: (_a = variant.calculated_price) == null ? void 0 : _a.calculated_amount,
    original: (_b = variant.calculated_price) == null ? void 0 : _b.original_amount
  };
}
function getVariantFinalPrice(variant) {
  const { calculated, original } = getVariantPrices(variant);
  return isNumber(calculated) ? calculated : original;
}
function getCheapestProductVariant(product2) {
  return sortProductVariantsByPrice(product2)[0];
}
function formatLineItemPrice(lineItem, regionCurrency) {
  return formatPrice(lineItem.unit_price, {
    currency: regionCurrency,
    quantity: lineItem.quantity
  });
}
function formatCartSubtotal(cart2) {
  var _a;
  return formatPrice(cart2.item_subtotal || 0, {
    currency: (_a = cart2.region) == null ? void 0 : _a.currency_code
  });
}
const brokenImgSrc = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAyAAAAPYCAQAAACIuFWXAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAAmJLR0QA/4ePzL8AAAAHdElNRQfmAhQENCAuP7p0AABdFklEQVR42u3daYwk6X3n919m1l1d991VfUx3z9EznOExPESI4lACveJSlglphbUXuxSktV/YgOVXa4ivFjDWL/jCgAEJkNZ+4RW0XhjSChJkQRJNLVfiIVEkxWOmp6+Zvqbr6Lqr677y8IusI7Iq4oknIiMjIzK/H0HCqDMrKzOi8vnFE8/z/J+MXC2O576YeUsf0hX1qlUAgGazoRXdL30v81cDf5cpuT0hc/6f1t4q/St9QS0cPQCApCf63cLvjmz6BMj6jcJv6wscLQBAhaXMb/b/XmVPpCJA1r5c+h1d4DgBAFz8v9lf619zDZDV39RXOT4AAE939YXBp+cCZOV/yfxrjg0AwOhR/qdH5ysCZO3Lpd/nuAAAfH1v4LOZA0nKStL6jdLvckwAABY+tfa/Onogq3/JzCsAgKW83hx8R8pKa58jPgAA1lr0byQpK5X+FUcDABDALy7flLKL4/p5jgUAIIBM9lelbO4XKFoCAAjov5Kymbc4DgCAgG4ujGX1GscBABBQpu3VrK5wHAAAgV3NqoejAAAIrDerNo4CACCoUnuWgwAACIMAAQAQIAAAAgQAQIAAAAgQAAAIEAAAAQIAIEAAAAQIAIAAAQCAAAEAECAAAAIEAECAAAAIEAAACBAAAAECACBAAAAECACAAAEAgAABABAgAAACBABAgAAACBAAAAgQAAABAgAgQAAABAgAgAABAIAAAQAQIAAAAgQAQIAAAAgQAAAIEAAAAQIAIEAAAAQIAAAECACAAAEAECAAAAIEAECAAABAgAAACBAAAAECACBAAAAECAAABAgAgAABABAgAAACBABAgAAAQIAAAAgQAAABAgAgQAAABAgAAAQIAIAAAQAQIAAAAgQAQIAAAECAAAAIEAAAAQIAIEAAAAQIAAAECACAAAEAECAAAAIEAECAcAgAAAQIAIAAAQAQIAAAAgQAAAIEAECAAAAIEAAAAQIAIEAAACBAAAAECACAAAEAECAAAAIEAAACBABAgAAACBAAAAECACBAAAAgQAAABAgAgAABABAgAAACBAAAAgQAQIAAAAgQAAABAgAgQAAAIEAAAAQIAIAAAQAQIAAAAgQAAAIEAECAAAAIEAAAAQIAAAECACBAAAAECACAAAEAECAAABAgAAACBABAgAAACBAAAAECAAABAgAgQAAABAgAgAABABAgAAAQIAAAAgQAQIAAAAgQAAABAgAAAQIAIEAAAEnRwiFAOuSUU0ZSRkUVVOCAAAQI4KdNbWpR5sy/FnSoQ+U5PAABApyXUbvaPe6z5pRTh0o61KEOVeJgAQQIcPrH2aWcb8S0qe2oP3LAjS2AAAGkTnUEeHa5P1I8uq1FfwQgQNC0utQe4qeyale7Ssorr0P6IwABAuIjmIxa1arOo/7IIYcTIEDQLNqrio/z/ZHyba0iBxYgQNDYsuqM9PWcw+xM+wUIEDSwrnMrPqJxPMyeZ9ovQICgMf8gW2vcvyn3R8oxwjA7QICgYbTH9offcjLMzrRfgABB6mVq3P843x85nvZ7qEOG2QECBOnVZhz/KGlde2pVb8QxU572yzA7QIAgxUzBsKn72j1q8Hs0qEF1R/zbqa4FECBIqYzhz3FP7570DUra0IaeqF0DGlS/b72soO+CYXaAAEHq/hi9b2A9dbm1tK95zSurPg1qMFDlLLt3wzA7QIAgJbxvYJW04vlYUWta00N1qF9DGoh4FQnVtQACBKkOkA2Loe09zWteOfVpSINqi/SdUV0LIECQYDmPjaMkadX6VQpa1aqkLg1qSL0Rv0em/QIECFLV/5BWVJIC3Zza0Y5m1HrUH4n2z5xpvwABgpQEyL52JOlkINs+SA61rGVl1KMh9etC5H0mpv2CAAHqzjSF9+wAeilgjJSn/Uod6teABpj2CxAgaI7+h9cISNAYOR5mz6pXQxqKvOoW035BgAAJC5Cinht7F0FjpKjneq6H6tCQBtVXs2m/DLODAAHqHCDPLZrh4KMj0p5mNasW9WugRtN+xbRfECBA7f8MvZv+lQCvE7w/kteyliVd0JAGIx9mP91UN09/BAQIEG//Q1oNMWgeNEakLW3pA7VqQEM1G2Yv6FAHDLODAAHiCZBt7YWMhTAxcqhFLSqrXg1oUF0Rf0o21QUBAkQsa7jiX3WNBftgCDM6Uh5mf1yz6lptaqO6FggQoLb9D+8RkDj6I1TXAggQpDZA8tqINBbCxAjVtQACBCn8I1y1GimII0aorgUQIEhg/8M0hbdUs9GOcDFCdS2AAEGCAsS7iV+zbOizell9OtCSZo9uA9VykL2yutaQ+g2F6MP1R6iuBQIEqCpANnVg2V/4mLoltatH17SvNc1oO2AshOuPxFddi2F2ECDAGaZtpFYsm/kudTv+v3aNa1wFbWle87HECNW1QIAAiep/+E3hPW3oJ12DqU99elm7WtGM9mOIkXiqaxWOyqIABAgIEM9HDrRl2dAPGp7TqSlNqaAtPdNCoGAINzpyXF0ro+6aVNfKKSdRXQsECBBkGynv1+iwaHbL/ZEdLWlW+Rj6IyWqa4EAAerT/5CWLafwTgRodrvVras60HPNakNx3NaiuhYIECDmACk6pvCaG+6xwL+1TaMaVUnbWtSsijHECNW1QIAAsf35Pa9oCE0Nd9hRhowu6IKuaV/PNaMt1XoJokR1LRAgQGR/fEGm8Lo33D1VL+Jr15jGVNC2FjSn2g+yU10LBAhQtTBTeM/GyKWI3ktOverVi9rTsqZ1EMNtLaprgQABahAgO9q1bLb7I35PHUfTftc1p5VYYoTqWiBAgMDXyLkQ/Y+zzWNbTd5bToMaVEm7WtJMgGHp8DFCdS0QIEAE/Y/yFF6bhniqxhHXpSu6ogOtaVabMYyOUF0LBAhQVYDktW55PT8ayztt05jGVNSWFjQXy20tqmuBAAFCBchaRaNmaoa7Yny/2aNh9n2t6qn2Y4gRqmuBAAFc//C8m9Rlz2a4siEejvjK3E67JjRxVF1rMZYYiau6FsPsIECQ8v6HtGrZEF+s4/s/rfa7qmnr6/dqRkeorgUCBPAJkE2L20Plhriv7p8ioy51aUqHWte0NmPpj1BdCwQImlrWcP28bPkaHQn6423VsIaPqmvNWQ9LVxMjp9W1ajPMTnUtECBIXf/jeAqvf8N6OXGfqrK61nYMMXI8zE51LRAgIEB0cHIjyK9hHUrspzuurhVkmL26GKG6FggQNAnzNlIlq4Y1a7GNVH2Vh9lf0Z6WNaODADESPkiorgUCBA3/RxdsCq9bjIzVZQpvGM7qWqux9EeorgUCBA2r1dBw+k/hLTesEyn7zKfVtZY1Y3n9Xl2MUF0LBAiaKkCeWzWtJUk9qfzkGXXpsi4fbaprN+23uhihuhYIEDSQnOFa2HYKb0/Ey+jiVt5Ut6gtLWouQIyED5Lj6lpdGtQA1bVAgKDR+h/2U3gvNcSRKFfXuqF9rWpae7H0R06H2amuBQIEDRQguydrJ/yutwcb6ogEr65VbYwcUl0LBAjSxzSFd9myoWyJ/E5+EpxW11rTtNW032pjhOpaIEDQIP0P7xGQsw3lZEMHbJe6NBmgula1MUJ1LRAgSH2AFLRm2VCONcVxOq6utaRZi2HpagfZqa4FAgQpDpBVq9k7JSnye/ZJ7o9c0AW9oH2ta9qqulb1/RGqa4EAQUL/3Exr0EtWDd9QatagR6f9aNrvpuUwe/Uxclxd64L6qa4FAgTJ7n+UR0BsGr6ppj162ZPqWitWw+zVx4i0pS3NqE0DGqzBMHt52m9eh9pndIQAAcIGyKZjHYS54etv+qPYoUlNWlfXqn50RDrQghaUUZ8GNajOyBuhFnXoUHuMjRAggPcVdJBtpNxjpM3Yi2kmzupaT62H2auJkZKe67ke1aS6VnnS77526YkQIECw/offFN7Thu8Kh/FMw1uurnWoNavqWlHc1ipX18qpX4MRD7O3q0Xb9EMIECBIgBxq3bLhG+EwehzbINW1ooiRgla0IkVcXSunHm2x2wgBApy9VrbfRsq74evkQBoEq64VxehI9JtYZXSBCCFAgLN/at4N1ZLlFN6JJpzCG8Zxda11LVpM+42iP3JcXatXgxpQd9URssHkXgIEOGXaRmrZ8nr4IocxgPIwu211rShipKR1retx1dW1MurSFieQAAH8A2S9Yk2yqSHr4zCGaoztq2tFESOn1bX6NKSBULvXt6pd+5w8AgQoXw17T/pcsmzIulO+jVS9A9y+ulY0MVLUmtakkNW1OggQAgTw63+Y9iGsbMgucxgj6I/YV9eKZpA9bHWtrNqsitqDAEETB8ie5W0VaZjDGJkg1bWi6Y8Er67VToAQIEDQbaS8rkg7OJARC1JdK5oYOa2uNagBn2H2FmVYl06AAKYbWEsqWTVMUxzGmilX1zrUpm91rahi5EDzmldWE7pqGB1roeQ7AQJ4B0hRK5YN0wSHseZnyba6VlSjI0XNak+vEiAECBAmQFYrKh+ZGqYeDmMsglTXiqI/sqJVDXo8xqw7AgT8kRnXoNs1TH2R1n6FTejbVteqNkaWPQMEBAhoigyPLVk2TFThrQ/76lrhY4TbVAQIECJAtrXr+9Plholr1Pqyra4VJka8C2RS+YwAQdNfw3rfyV60fI3WSHedQFi21bWCDbL3ez5CQUUCBPQ/PC1ZXrFyAytJ7Ktr2ZzdrCFAKOpOgIAA8Wwe1iwbmrGEf8ZiUw7x21bX8tvj3vvYsTchAQL+xDwsn1ln7N3QdCf6E5a00MSrVGyra3md3QHDaxMgBAiavP8Rbgqvs6kZS/hg6gcM9sq2utb5szto6KFSyCTpmFyPGgeId1Oy5HNdXzpqQJJdxGRWKxXTBBaavEHp0yv6Gb3s22srn90uQ4UzpvcSICBAPGxY1VotqWQYZK2/Jc1XdOSLusPcIWU0pktWZ9c0PZsAIUDQ5H9e3n9gtlN4uxJ5nzWvPW1qWk+ligDZ17Y+4MRLGrV6lneAFBkBSQHGQFCX/sfpFF6/aZ5JnMK7oiceX6MDSe/rEl8sFSwm8bYY9gWh/0EPBASIh32tn/z36WhH+CvZOO1r2vM67EDSgR5w6k9GuExnd8AQLwQIAYKmljEEyPkBdPeGJmsodFEfJT0+d3Ol1REukvTYWDWqOcxZnN1Bw1FmESEBgqZmuo2z6NlwVDY0kwlsGLcNn7Q8MaCg+01+7vddpxKcPbtM4SVAAA+mKbwrPlf5xw1N0gJkU/MuPa3cmR6INOO703tjW7U4u72GvxBuYBEgIEA8mxebGxQllQyDrPWQPzN4fv5zHpy897tNfe5nLM6uaQ06AUKAoKnljFN47W5Q9Mb6B1rU2rnh8UpPXdeuOG/V7Ts+43LTnvuCdiyeNWT4edbSECCg/+EZIH5zr8peiO3dbukDva1HxoZr6aT4o3eAOAPmdtM2gxsWZ7dNF+h/pB7T1RF7gOw4hqHNawWGYnifB1rV8knPodPRH3ms6xX9k1mLT+oMkE3d06tNee6fWZxd07klQAgQNLWM4U/r/Aws9yWFLWqv6XssaE0r2qr4t05Hn+Su2h11uLKa8lhj7tzsqnL67mONxRKCyVI6c4bdzy5TeAkQIHD/Q761Wo8bmtqtQS9pQytad7nF1OHoP0jvqNMRAMM6OLm2dv+sB2desaS39dmm+5LtWpzdjGEInf5HejAGgpgDpGCc4lluaMr3z2uzx8auZnRLD7TmEh8tjve9Kamof6iYjnvRtT/RZmg6d3S76c79ssXZ7TdsdEyAECAgQDybF7uh5ZJhkDWcvBZ1V3e04NlEOVe9bx41Zt93zKySrqjH8Fnd1p9PN12B9xmL5wwazxMIEDSxFkONowWL2VeSNBrhNk0lPddDvaNpn+ml5wNE2tX3HU1aRtfPFVcx9UAk6R2rwvWN4rAicL0MGeKDKbwECOh/eFg6atL9YuRSRO9lT7O6pYd6bhFbnY5m7DRq1vUjx8/mdKPi82UdYxzuFbD2dauJzv1zi7PbZahwxg0sAgQEiIeNikbW1NAMRvA+tnRHtzVv3Sh1nOt/lC1WRECbbjju4LdWhJW7Z55TgBvPrMXZZRspAgTw/KPyHiB1m4Hl1tB0GHsxdpb1nueMIL8eyNlKVk8rSrR36drJDTbnJF7v3/Zuk9TnLZ1bbOl2dr1vYLGNFAEC+h+eFgxNj7OpuVrleyjqiT4IWNG1zRF850sh3qvoRfTqxaPoaLcKkEO9feZf7BrKLZfav0m2ZXF2c+qj/0GAAEED5MCxjZQ5SMaqegf7uudT79fc/5BrLd23Kyao9uhVDVf0QErG/s5SRSHGx7pncS1/X/dTVtV30eLsDhiaHQIkXVhIiIiZ1qAvWfYJsuqq4h2su2z5ZKPDJ0CK+qF+2jG5OKcr6nfMFdv1+XR31a9+SUXd0rS69ZrnM/Na1uJRY5quGVxzFs8xrc1nCi8Bgib/kzJP4ZXF9NyLoafwljRv1Yi56Xb0lPY9ro+/r5+uuGnlvBnjV4G2oL/TuNq1qG1J29pxjck9LVWsldlP0bnf16HFmRs09D/YRooAQVMzbSN1PIX3uK/iZSrk787rsTZC/mzWEQber7Gjv9PHPO7h+5cwL1aE27IuW7z/NAXImsXZ7TFUOOMGVtowBoLYAmTtTAPhPc2zP9Rv3tHd0PGhijvzS4bnbes7et/1fe8E/I1L5+LjPZf3f5Ciq/Jpi7NLFV4CBPBg2kZqwaNfcrahuWCYBuxtRferGi8Ycrwj86qNku7r2y5NfdAAqbyVU9D7roPwpdSMghRcRo7On13TFF7WoBMgoP/hYdHYKJ82NNcC/9aiPtCTqpqfNkeNq2WLNRsb+ls9OtM0BguQVyq2yyroPc+fT8tNrE2Ls9vqUkuM/kd6MQaCmAJk12JCarmRGQn4Ow/0qOrVEs7ewIzVTxR0R/P6yMlAeD7QhNuXdeNM72PH8PnS4ZnF2R0yjHwRIPRA0NRMU3gXrF8j2DZS67oTwWK70wDJa976p1b1LT1VSVJJ7waYOvyyXjwTH6ZPkJYeiM0ZHjLECwFCDwT0Pzws+mxfe9rEBJnCO+d73WvDWdxvPtAakrze0UP1aD1A0ZSXKuKjqIc+Abhf0cxmEnrud1XwPbsZwxReVoAQICBAPBROVnH7xchogMb7icXKdhvO6+KZwD+9HagHdE0vVcTHA99bX84AeaaLCT33yxZnt9/Q4ND/IEDQ1IqG2VMrZ67rvRuaUcfrlQyvuKNHEd3ccW6vuheiBEoQ1/RqwPioDJB1dYWc5FxrT8+d3fPnlym8BAjg0pgvaVEl/bznM7ym8J5taLocpUKWNaNu9anXZcX2ip5GNumzy9Fzmq3pqosXKuKjpEdWA+8F5U++qF26q08n8C8g7zpz7exlwpDhMzKFlwBBkylpXQua13NJ0scMz1z0eZ3jhma04mq7pC1taVbt6lG/eh1NUav6rLaIspG1fp/h5dSn0YqZVyU9sF72eOAIkBUtVFlqshbWLc5up6NYDP0PAgRN7EDLmj+zVZN3AZJNqzUSJcnRNBYdV+f72teyshrSsNqVk9SrXh1qTcsBd/xwU7tr35z6jv7nwpnbOSU9DLBqfv+kD9Yl6V6k2/1GY8bi7LKNFAGCprepeS1p5Vyz22VoIGyn8OYcNzk2zvUvilrSkqRO9alHPWrVqEa1oyWtVhUCpYp3EI2MJnVVfR4NfUmPAg3/n46CdCqjTU2fq6JV757ossWzhg0/zxwsAgQNraBVzeuZ5xW/qQDigkUBRUkacdxO8m5gd7WrebWoR33qV5euaEprWgzdF3GGTxQLo7Ka0g1DQfqSHh3d9AseIFl1akfvaTKyqIvCtsUU7axjqgL9DwIETWNby5rXks/6iClD87B25mrfq6GpHAExy2tNa8qoU/3q07CGQ/dFihH2QLK6rOsVW1Odj4/HAeOjch5Wl3a0p/tHw/ElzWmoYieTeliwOLuDbCNFgKCZlLSqBS1ZNXc5TXg+tniuUfdqaE4DZMeyUSlpRzuaU5t61aspTWlNSwGrUkUVIDld0XXjOvqCtjUfYo/BygCRpEfa1ogONK1dvVH3G1qzFmd32PDzBAgBggayr5VzQ+RmY4ZFhAuejX9lQ9PruHIPukDwQMtaVlYX1KMXVNKqlq3vq0dxC6tFl3TDIzwK2tWOdrQT+ibboWMFetfJUT0+rst1DpAD12pd9lN482wjRYCgMWxqXvNaC/yVvmToIyz59CF01NQ4J6eGW2Fe1IY2NKt29emKilqxmulU7SB6q17QC64Buqll7VjU9vV/hwcn4XR+bGW5zgVOVi2ObY/hNhv9DwIEKVfQkua1ELqxm/R85LnlevGS4wZWPvDeGmd7UItaVFY9uqi8Vn36IiVHAxw0QNp01SM8tjQX4maV9yfyDpADbXjskRiPaYvnsAadAEFDKg+RL1Y1EbZPvZ6PzVteH7c5ZumsR3JTo6h1rau8uv3QWK/qtAhLkABp1zVddf2JdT2LoEJwZYDIM0Ck5ToGSNGqtzhs+PkCX0ICBGlT1IqW9ExbEbyWeQqvrOrwOhfHrUf6SXe0I6lFrTr06IucBkirMlbh1alruuwRHnNV9p/MAdKm1nPX7Eu6Xre/o02Ls9tqCDj6HwQIUmVfi5rXYoSLt7wDZM8RBua1IGOO523W4FPnjz5viwrnIuL0/7+sS9rVnva1o+2jge+zz+7SC7riOty+prkIRjzcHFT8/rMBu6pC3daFzFmcXbaRIkCQepWVq6LTaqjNtOD6Ps43NBnHPoTbNV2XnHftgTjfSVfFbaKi9rSjPe1rWzsqaVKXXJrDklY1X6PwqOyBuAVIUauB93GMOkBMZ5c16AQIUuxAy1rUfI32trtomPy6YGg6nA3NgNpOHlmP/fiY7sJnzwSKXMPjWY33DTy/EqTScp0CZM9j7Mx5djNM4SVAkE7bmteCS+WqKHnfwCr6TOE9bWiqn8JbjXVDnVizopYDrZcJH3HOku7nLelmXf6+li3Obp9hjRA3sAgQJFDxaCngTgy/y3sK74rlDYqSI0AOIqivG9S82gJupRtneBz3QUwBsuGY6BunDyyewxp0AgSpUd7caTG2e8vDhhs88ypJFg1zp2Ma8HodjllJH+ip2tWmdrUd/d9Wnx7BkhZivX+/f9JL6vboC0zGftzy2rY4u8OGo8g2UgQIEqFWQ+R+/Kbw2kzire8NrOPjt1cxCJ7VgMZd10/ntaSF2FcvHDji1m2qcT0CZN3i7Larh/4HAYLkctvcKQkBslWxxsTU0LhvI1VPfZpwvdKvT3iUeyDHMup0uTW5VIf3NGtxdk2D+wQIAYI68trcKT4dhhk23lN4K5uarKOR2UzATY0+XXS9LXegBS3X7f21Vhyx8/a05dhPPp4+27zF2WUKLwGChPHb3CnO/of3zYt5Y+Nz2tCMOBbBrdf58wzoouttq/qGRznWTt+Le5mU5ZgDZMfi7GYN+1TS/yBAELMdLVls7hRngHjJa8XiGlZKxgiIlNGgJlxnMu1rXit1Xq/Q4ugTLXq8lyVdjfU9LVic3X7DCnkChABBbLcL7Dd3ik9WFz0fsy/PeFqFd9d1Z4k4jGjcsZRRjnf0zLGfYv30Onp6ix7PWYm5rPtTq+MqAoQAQf0E39wpPqOujW7ZvFUJRanHMVhdr/7HlGsxlu06zGnz0ue4lFjy7POtGW4YRe1A+xZnd9jQQ2UNOgGCGtrSrBYScf3r5ZLhMZt9siVp3PHf9QmQTMVe7MfH/pnVZlRxvcPTdTJrhkuJhRgDZM3i7HYb1gjR/yBAUCMlPdODREfH8ZW7l+dnCgt6NzSn1/6FiPfQsG+eK23qWUImE582xC3ngtnNU93wWQAZnWmLs8sNLAIEsVvTrRSEh3TBsMvDvEcwnm1oWh3XzOt1uqlR1OrJZOR1zUeyQ0q0nMd50dgoP4ipJlbRZYrE+bPLNlIECGJuzO7qQUreq+kGlu0U3lHHmob6zcD6QAfq0b4WY6kdVk2A7Pr0jR7rqjpjeEdbFme3Rf30PwgQxOdA39Nqat6t9w2sfYvB5/NTeOs35lA6t6tFkrQ5IsFv6mxR9/WRGN7TM4uzO2go80+ANIYshyA59vXtFMVHS8Xw99n+h93NKGcZ923WJfv2P8w3sMpmY+nJzVg8xzQCwrkmQBCpvL6bwLvv3iYMS8TmVVLJIkT6HQv31vkT8A2QgtXizHs1f0d7OvQ9uxnDCMghU3gJEETrRylrQi8ZmrDFk/8yx0j9p/Cm4St6Ws12xWroeanmhRWXHWfX6/z2GvYn4QYWAYJIPfS9q5w0k4bm5fBMoHg1NOOOJmWHPwJXPY4v6aLlz9yt8RX+U5fzexZTeAkQxGQ3htsO0Ro0bAI779kzqWxoOhyzdOh/eAk2AlK24Si0Hr2C63SHs2d3xPDzbCNFgCBCd1I3qGjaRmre+JOnDU0yiigm3eka9M0AvbR7NVxnsW5xdtvYRooAQTy2Ez2JNGiAbFut4i6p5LiBVUrYyu/k6HCMJCwG+Lk9PanZe5q1OLvDhuI1BAgBggg9Tl2Xvt0ww8Z2Cm/WUYFqk3XJHpw3sBYC/eSDGlU2LlmN1o0afp4pvAQIIlO0mlOfLJOGP5xnktUk3mHHKlZuYPkHyGHA8jaHNaposKuC79nNGPappP9BgCBCa47drtPC+wZW4WiKp3xjhCm8/nKOPQaXAs+selKTmW0LFmd30FDiggAhQBChpdS944xhCu/iuZtR/lN491IYofFwbiO1EPini7pfg/f0gcXZZQ06AYKYpO/qe8SwRMw8hfe0qel2XFvT//Di3EZqOcTPR1/W5FC7FmeXKbwECGKSvvlH4afwnl6xTqQ6QuMPkOche2l3I35HaxZnt8uwRogbWAQIIpW+2zeXDL0pu7vuzim8xVRVAItTl2MkYTHkayyH/kl3NvugDxt7MCBAEKG03RPu1oDnY88sB3pbHI3MBoX1PDj3mw+/VW2UZU1KViN2TOElQMAp8OB3A6tkMYk3GdtIJd12xajCVMhX2YxwmvimxdnNGcKO/getFwgQDwcVxcZNDQ0jIDYOK5bsvWqYumB2P7JlmvMWZ3eYbaSaCDsS1l1nqobRc4ZtpBZcmpTz+2RLzipYOzQqxgZ74GQ3wja9ph8dXXK0qU1taj15XkYlSUUVlVNehzrec7z8fwt6L6Kd0p9YnF2q8BIgiFF3qgJk3NFsneVd4qKyoel3bNFK/8OkpA/08slxu6isWtRbMTYSp32PEYzKs+sdIHlGuxoOt7DqbiBV73bK0Nj5LXVjCm9w2xXD1uMarlt8yGc3xPLZ7VEH/Q96IIjPUIMEyKrlhGTnFN68tvkDMF7fDToWXNbbE4vnjBoeI0AIENSgB9Kamq9Wn2GXh/IU3ozva7Q7+lz0P7x1aViDhn3n41bQmsXZ9b6BVaTiMgGCWlxljqRmP5BLhseeHfUv5BMj445HCRA3HerToLpi+m07WlWn+n2jasPi7LY69pik/0GAIBbjqQkQ7xtYu3ru+P+OB0szrp/29FkbqTpPOXWqQy1qUU65cw1u4eR/S0f/WzzzX0XPOlBZtahVrepUp7pjGuU40J7WtHbUL8jogvrUZxjBmLE4uyNsI0WAIG6jR9Mwk67VcIfbfQbW+SvWjGMK71ZqbmrkNKRBdVncwvFXPJlymz2ZwxLFjaq88sqrcDKBt3gUaMf/VVJRE44RldWKnQVL2tSmZtSuPvXpgsvsmhmLs8sadAIEsWtXf8DNgurDbxsp78bjtKEZclxfp+UG1qguRjgWkY0sMspxtKYt7WjPqsrtgV49afBHteSyZ+G+FrWorHrUp37HlO1Nz9c/PbsZQxUspvASIKiZsVQEyJShGfMv2VduQNI2hTejFxI70bqgOS0HKo++p5WTRj6ri57zqopa17q29MLJvzy0OLsDhptv3MBqTKwDSYTxVDSlpm2kbG9QTDiudfdSEZpJjY9t3dZi4N015hw/MeQzUO/cjaS6IooECAGCGjINXibFkGP9+FnPrHZBl7rUm6r+R6exUaynNd0P1SgfViz3nDReMPQ6ftu+xdkdNfSV2EaKAEENjSX+HfpP4ZVvjKTtBtZIQt/Xoh6FHlOYdwRPryMkzuo+txuJ+ex2GtYI0f8gQNDkAeI9ArJ5Zkso74bmNEDSsY1UdwLfU1EfaLqqn39mdVb7HP+9YHF2uYFFgKBuRhO05tj9+tK75Ir7KpbzDU3O0chspuKmRiZx7+i5bofaHd1p2TH65H1eTwNk16Xc5/mzyxReAgR1k6tiz7n69j/8pvCeNjXOkEzHFN4kTT0taFn39NBl6m3wT+VcAXLRtRFodYx4LVqc3azhAoP+R+NiGm9ijFnNdElegBxaXRGnswrvfmwFRbyP26F2tK0dbUXYZ3uurZMlhW0acamj7LyBZTNFe8jQgyZACBDU3LjeTXBHdcLzsXnrhu10svJuBNfRcdiIZBJvUXkVlD9aDV7u1eRdGuHiUU+j/Ky8DpWv2c2fGb1y8t8TWjn3e/oc797mAoEREAIEddWt7sQWNx8zLBF7ZlFAsdwkdaes/yGtq1TFOMi61rWnvUQ2oNt6flL4MKfxM4VKnFN4l5W3OLveAcIa9EbGGEii+iBJZdpGqnIKr3djkcZtpA6rqBCwrQda0mZir79nHedq9Mx+6z2OhmHB4uz2GG710f8gQBDTdX5Sea8BWTu3ntyroZlwXJOmZxuphdA/2ZHweXV7jltTGV0801s8tWRxdrmBRYCg7oYM+43XU49hudmcZ8+ksqFpcxTa20jRTY0drYb8yVzi1/bMOaohV+4/chogm65hf/bsegcI20gRIIjtZAynrP9hnsLrbGjSu43UTOjZT2OG4i9JkK/oX005+k6nN7QWLc5ui2EKOv0PAgSxSeY1q/cIyJ7VGEFJJccNrLRtI3XoE5KmL9cLCf+CLThmw/Wc9Du81qB7nV22kSJAkAjjCVz73GKItWeWV+fObaS2U7cueSF03eBOXU30Jztb1iRzJkDsJhGMGXs5IEAQk3bDntL1YtpMaU6yqsM76Kg2nL590Esuu/HZGjBWvK2/Fe2e/HeHhiTlHLsWLqnge3YzhpKTh0zhJUAQp+TdxDJtIzXvaGRNDY1zjs96Cs/KesWO70F7lUkeTD9f1qTX0QtesDi7/WemAFcGCAgQECCuls41EF6rBU4D5MBxxZsmM1UUEplKbFn4cjielkps1WjFNlKLFmeXKbwECBKjz3A9Vw+DhiVic4brWmdD0+m4Mbee0vOyX8WKEOlyQufXlc1W9JdOp2w/177F2fW+5GEbKQIEMcskrA9imsI75/Ozxw1NGtegn7dQ1YqGK4ZqtfW27RgqzznWIi1YnN2Oijlb9D8IENRZsgLE+wbWlssuEe4NzUXHf2+m9rwUtFLVz19JcMH+WdcRDps+l+nmHAFCgCB2owk6KR2GWy9zVrugS1lHJG6m+qZGdb2njK5GUtu3FvZPpkOcnp89q4kDY4YLB6bwNj6q8SbwlAwlZmeQScO6lNmjZqLcOJoCsSWiJrje11o9Vb5CRi+oVMV8rlqa0656lXcU9FywOLtZ4xReECCog+RsLeV9Aytf8R5NDU3ap/C2qVNd6lJPBMURM7qmhwk9CmtaqxinWbA4u0OGBoQAIUBQpwBJxtZSZ2u0Os27DCm7NzSnr7F3Mqsnq9aj/2lRRjlllFVGOUk5ZVSqeO3C0WsXj/69IKmo4tG/FHW6BVPx6P8L38fIKqeWo/9pU7va1BZxTd2Mric2QszbSLmdXdagEyBInAu6oK0EvI9Rw5Ri0xReZ0PT41jXvKFedatTXTWfqnwcOqfho6OgyZwJhJwjOuKK5Wt6PxHn9/w7O53Cu+LRgyidPNccIHmm8BIgqF/TnYQGZsrwmF+BwdK5/oc0bFx0FqVcov+8s7qu+6Hra9XywuU0RBcszm+3Y4/Js7iB1RyYhZVIydib0DtA1rRj+RoX+WNzvW67kcDtpoJV4TX/lRIgBAjqZjAB187dhkmntlN4WxNdxKOe2hNYp/c0QLat1ut438BiGykCBHWUS0DDa1qDfjyF1y9GxvkD89SfsHBtd1RMnpf/HvcthrX19D8IENRV/deje9/AOqhYk21qaCY5kQYXE/X187qB5XV2RwzvngAhQNDUAZIz3OGec21Q3BqaKU6kQUuiytacBkjh3BRet7PLFF4QIIllKlIXhwnDKMys4eecDc2QozAf3AwlqCE4nW696DkF13l2TVN42UaKAEGd1Xcm1pQhIuZ9f7rc0LzMSfTRnpiJxr2OpmDB4uz2OUZMzuIGFgGCuqvv7Q3vAFn22CXivIucRF9Jmczr7O/OV/nXSYAQIKi7/jpuLdXvuKFx1qzVLujlciXwu5Y/SEwP5Nhz7VqcXe/+MVN4CRAkQCa2ddtB+h+nIyB+MVLkTriv5wk5Rl1qO/nvBYuz2+7YY5L+BwGCRKrfTSzvNSA7Z8qRmxqah5xCo7xxOkKcvG5geZ3dUUOJdwKkmVALK8FGla1LSbo2wxI39yavssTese9rQTfUq05OpYsDPbQeTaq1Xse7WrM4u943sEoECAGCZGjVQJXbqIYzaeiYmq+Zz5b8/kAfSOrWhMZ1kT+2E/taNkyWjb8R6Hb0P0q+ZzdjuMBgBQgBgsQYr0uAeI+AFKyK7J2NkW090APlNKJJTRkquDaDvDa0oo1Evadex7lasDi7Q44Rk7PofxAgSIwx3Y79d2YMBUgWAlxhno2RguY1rx/qgiY1maid3+NwqB1tacO6inGc+hznbNHqskYECAiQ5OtRV+xNzrBhidisx2iHfYxIW7qv+2rTuMY1ZfhdaVfSgfa1r33tajfBDWvlNlL7Fmd3zNBDZRspAgSJ6oM8jvk3mqbwzhmCwT9GnM8/0FM91Q80oElNajClZ6eoogoqqqT8yf8cnvxXOnQ7GoF5i7Pb5Qgc+h8ECAiQCt5TeNfP7RIRLEbOP7+kVa3qljo0oUlNxL70sHQUAAUVVDzaU738f0uO/y6vaCnoeJPc8u7sxQa52vZeg+5+drmBBQIkNUaUi3Vlb6ehNzBrGQtBY0Ta02M9Vk4jGteU4Qq3Wgfa0b72dKhDHVL070yA7LgO7p89W2OG88ocLAIEiZLViFVtotr3P+ym8FYzOlIeZv+JLmhck5qIcJg9rzVtaSsxhUOSo82xSmfe4uy2GKbw0v8gQJA4Y7EGyJSheVgKGQxBY2dLD/RALRrTpC6qq+pex6yeM7jr2/+wK6I4bCj/SIAQIEhggMTZ35nwfGxOhapuUwV9fl6zmpXUp0lNajjAa+lMGFHczyZAClYXCIyAgABJlU71xrbwbNwwjD0TSSwEf/661nVH7RrTpCYNS9i8Yw/eFww9J/+9dDSCkQkZIIwoESBIaB8krgAxbSN1dgpvNaMdwZ+/r6d6qoyGNanxANN+d/jzMehxjDM9szi7vYYbivQ/CBAkNEDer3uArGivymAIFzuVzy9pSUvS0TD7uO92TCWN6LnLO0eZaQTE7exyAwsESOoMqi2W+UO9hgm0szXtXwR9/pZlda2MJjWpfa1rXZvcYnE548e8iqxUHn22kQIBkjoZjWomht9jmsLr9/vrESO21bXaNapRFbWp51rnSvlEh2PPy2cWR79NQ/Q/QICkz1gsAeJ9A2tXq7HFQvDn21XXyqpPfSovl1vXFn9UIfZBZxspECApFMfWUq2GLXTLRRTjHO0IHiOn1bUu6UXDbK0udWlcea1rXRtNfeOlz3Hsli2eb9pGijXoBAgSq039ln2A8C4ahqRn6ti/CBY75epab6tHYxo3VNdq0ZCGVNK21hNaZL3Wcrpw8t8LFiGeMaxIYgovAYJEG6t5gHjfwCpW3CFPVox4PX9Tm0fD7KbqWhld0AVNal+beq6NpmoGndtIPbM4+oOOEZOzuIFFgCDRxnW3xr/BtI3UYUJiIejzbatrtatdwypqS+t63iQVs5zbSC1YHE2m8IIASfH1Ym23lhoyLBGb8Wm24x7tCP58u+paWfWqV5e0p+fabPhpv6e9stWjbaTMZ8s7QNhGigBB4o3qSQ1f3bSN1Gyd+xdRxZRtda0OjWtceW1qXc8bdJi92zE6NG9xPDvVT/8DBEh6jdU0QLzXgGxaF1JJx20t2+paLRrQgEra1bqeN9wwu3MK7zOL53MDCwRIynsgtZvK22FYIjYdaApvemLErrpWRl3q0oQOtKGNBpr2exoge1qzOJoThuPLFF4CBImX1bAWa/TaU4YmxDmFN/mjHUGfb1tdq03DR8Psmw1QXavVMQ40Z3G2soY1QvQ/CBCkwlgNA8RL/szvTMdoR/B346yudclnmD391bW8bmB5HZ8RQ0NBgBAgSIVx3apR3+ai52Pu+2mk5TZV0NhplupapwFSdLkoOX80JwyvRYAQIEiFLl2oSQ2nUUPhj5nUxEKUz2/s6loZl22kzEeHbaRAgDREH+RBDV41iim8yR/tCP780+pak5o0bGKVtupaPY6RnmcWR6fHUfSE/gcIkNQaq0mAeE/hXQkwfTUtox1Bn1+urnVLHZrQZENU1wo6hZcbWCBAGsKgWiP/yl6oaFAqzTTsaEfw5+/psR43RHWt0/O9qU2Lo+MdIGwjRYAgRbIacexNXuv+x+kISOOOdgR9/ml1Lb9h9qRW12o/t42U+ei0apj+BwiQxjAeeYB4j4DsndklonFHO4I/vzzM3nK0mr3TM/CTV13LPIX3/Ocd8wxJAgQESMqMKhNpM5Qz7PIw6/GbGnW0I/jz01hdq8/x7pcsPq9pBIQ16AQIUqVd/VqL8PUuGv4EplPUX4gnprye76yuNWUYZq9/da2sYwrvvKE0zunRHzP0P5jCS4AgZcYiDRDTNlI2N8sYHTmVhupa7ttIeX/aQc/bc9zAAgGSygC5F+GreW8jtRhg6JcYcT7mrK7lvYlVfaprOUdA5i2ezxReECANpV8dkTU3A4YlYjOBX62+t5GSFjvHm1gNJ6q61mmArB3dRMuEDBC2kQIBkkqjehrRK5nWoM+EftVmHB3xenb+qLpWnyY1XvfqWl2O8Zk5i/ffrgH6HyBAGst4DAGyredVvnZz3dbyi53TYfZ6Vtdy3sCas/i0E4bPT4CAAElpDyQXydBrm0Y8H5uO6L0yOuK0X+fqWn2Od7JmEYNsIwUCpOHkNOg6gz+oQcMSsZlI3zFLECsfDV5dK4ph9hZ1n/z3M+NoS+no78xUhRcgQFJqLKIA8VKwKrJX6/5Iow/Kx11dy/sGlrshz2jjBhYIkBQb17s1DZBnNV2dQIHGyrCOq7pWn+M92UzhvWh4jAABAZJa3erWdtWv4r1EbC6Gz8DoSKVaV9fKOPo4S0cBxBReECBN2gd5GFET7t6YxYUYqVSurpXRgMYjrq51wbGN1JxF76jb86Ya/Q8QICk3VtMA6Yr507AE8ezjq1qNuLqWaQTE7f1wAwsESMMaimBrKe+ZNNciLZeS1v5I/WMqTHWtdY/bS6cBsq0Ni/fDFF4QIA0riq2lVvWCxyOjuqm7dftsLEE8+4yg1bXOD7O3ORYvzlm8nxaN0v8AAdK4xqoOENNU4E+pV+9GMFBPjET3/CDVtS6dqa4VdArvmGPEhAABAdKAAVKtFZUMDdZNvaIVzWjmzL6E9YiRxh3tCP78yupaY57PrayudRogBS1YvA+q8IIAaWjtGqhyZ5BDzRh3RM9oWMP6iPY0r2lN13Vn70Yf7Qj+/OPqWuXV7G2e/ZE+9VVMl5g/mbOVCRUgebaRAgHSGH2QareWumsMkGMduqqrKmlJ05rTSsPGSBpjal9P9EQZn+pazleYs3j3/Y6iJ/Q/QIA0aIBUO1dqTmuGgt1nG6FRjepNbWlO05qr487ejI6cf0a5ula3LmpSo8av9ZxFTDGFFwRIw+tTu/arfI0f6vMBf+KCXtJLKmhBM/qgjsPsFGg8b1vv633lNKZJXXTtRXivFnG+vneAFOt44QACBBHKaKzqnUFm9L5eDPFzOV3URX1Sm5rRtObrWNqi8Uc7gj6/oDnNSerTpC5qpOLZTy1ev01D9D9AgDS+sQi2lvqBJgwb2/rp0U3d1L5mNaPZqvtDccVIYwzK2w2zt2lck7qodknzVjc92UYKBEhTGFW26mv/A31NX6giQiSpXdd0TSWtalrTdRxmZ3TE7fyWV7P3qnS0At3v9ScNv4816CBAGuj0DUawSmMrgggpN0xDGtJHtKs5TWu2blerxIjbc9Ytn58xbiPFFF4QIA1kPJJlflv6mj5jaDiC6dR1XVdB85rWTIyVfd2aVZYgBn3+sNo9f4YbWCBAGspYJFtLlSPkJX3CsAddUDlNalKq+zB7M4x2RPlpmcILAqRpXNCFyK7x39OMXtZLho2mwigPsx9oTjOaiWBn7yTGSCMN4nsHCNtIgQBpOKMR3iTa0Y/1ti7rqiYj7ItIUtvRavYVTWu2btW1GB3xe36X+ul/gABpHuN6FOnrFY+KY4xqShcNKwLCKFfX+midq2sx2uGNG1ggQJrKoFpqMLmypAUt6Ie6oIu6GHl/JBnVtZp9tMMNU3hBgDSVnEb0rGavvqX39J5yGtMlXTaU2AvXH0lCdS0KNJ7KGjYJoP8BAqQhjdUwQMrKxTG+px5d0pTGPffEC6dcXSuvxTpW12J0pPyX1EKAgABptgCJy6buHO1BcVGXIp6t1XJUXeu5pvWsTtN+mz1GJg3PJUBAgDSkDvU51hnX3vEeFIO6pEsRD7NL/erX69rXM81pWrt1i5FmLNDoPYTOGnQQIA1rPNYAOW52VrSin6hTF3Up8mH29qNh9npW12q2Ao19hnI29D9AgDSsMd2v2+/e1UM9VE5jmtBlx97bUUhCda3mua3FFF4QIE2pP4KtpapTHmb/oXo0oUuajHiY/bi61oKe6WkdelvNESPeIyBsIwUCpIFlNKrpRLyTTW3qPbVoQpc0pa5IX7u8idWbdayu1cgFGls1Qv8DBEhzGktIgJTlNa1pSf26pEtn9sSrXrm6Vl7PNK0Zzy1a09sfqU9MTRh6jQQICJCGFsXWUtF7rue6pQ6N65IuqS3iP91LuqSSVjWnGS3WYZZQYy1BnDReEAAESANr1UAddwI026tpda0hDen1OlbXaozRkaxhCP2QKbwgQBrdeGID5LihOq2udUkXlYv01etdXSvtBRoH1GEIEIAAaXCjup2K99nY1bXSMNrhZsrwGAECAqTh9aqrLgPK4TR2da30LUGcNJwptpECAdIExvQ4de+5katrpWd0pFOD9D9AgBAg6RRXda16DLOnIUZYgw4CpOmNKJfqFcONXF0r2UsQ2UYKBEjTy2pYCw3wORq5ulYSlyBmNUH/AwQIxhoiQMpOq2vVYpi9vtW1knVba9TQ1yNAQIA0jXG903CfqTzM3ojVtZISI6YpvNzAAgHSNDrVq42G/GSNW12r/ksQJw1HnSm8IECayFiDBsix+KprxX0zsF5LEC+o1/OnuIEFAqTJAuT9JviUjVtdK/7bWqxBBwGCIwNqq0NBwfpo3OpaccaIaQov20iBAGkqWY1qpsk+cxzVtTb1LPbqWnHESIvG6H+AAMGxsaYLkLLj6lr9uqSJyKf99qinTtW1arsEccLQbyNAQIA0nVFlmnr/hvIwe+NV16pNf4QREBAgcGjTgFab/ig0anWtqGPENIWXbaRAgDShMQLkpPlszOpaUcXIoGFhJv0PECBNGiB3OQgVGrO6VvWjI6Z90AkQECBNqU+d2uUwnNOo1bXC90e8R0CKTOEFAdKsRvUBB8FTY1bXCh4j7Rqm/wECBGeNEyC+ytW1MhrUxQaqrhUkRiYNzyNAQIA0cQ8kSxk8ywZ3RSsNV13LbnRkyvDzVOEFAdK0shrWIochgHiqa81qWnMxTvs19Ucyho1smcILAqSpjREgoRrc2lbXuq7rKmo55upa7jEyqnbPn+AGFgiQpjauWxyE0MrVtdp0XVc1HHGMZOtUXetsjLAGHQQIPHTpgrY4DCG1a1TjGlWLpA3l1KqWiBch1qu6ls0U3gLjZyBA6IM84CAElFGfxjWm/jMNakFS5ihGshF/AetRXauk7jOfkf4HCBA4jBEgAbRpWKMaN4wLlHSgA0k5tak14tta8VfXumR4jAABAdL0BtVKU2ChW2Ma15B1z6KgXe0qqxa1qjXi1SPxVddiCi8IEBhkNaI5DoPh+AxpTBdDFnwv6kAHyqhFLZH3R46ra21pTnM1qa6V0zj9DxAgMBkjQFx1aUSjR0Pk1SnpUIfaVVatao18mP2CXtJLNamuNWH47AQICBBIGmvyraXOX9m7DZFHoah97StzdFsr2mH2WlTXYgovCBD4aFe/1jgMkto1pHGNR95HcOuPSDm1qjXyr5azutZ0ldWWvQOENeggQHDSB2n2AOnRuMY0GPFgt1lBBe0pc3RbKxPxF7b66lr9ukD/AwQI/APkXpN+8pxGNK7RiPdED9YfKU/7Ld/WqsUwe9jqWtzAAgECq2vNDu012Wfu1rDGNRL5So2w8srXbJjdWV1rWs8tf8p7DQjbSIEAgcOonjbJJ82qX+MaV08i310th9mDVddq0wj9DxAgsDHeBAFSrlw1UuMh8ijUepi9Ry/p8GgTK69h9quG+CJAQIDAYUS5hr0tkVGfRjQW8e4dcajlMHurLuuypBXNaEbLZ2ZVdeojhnhjDToIEFSc4EEtNdynKg+Rj6kj1Z+ilsPs0pCG9GHtaVYzmj0aZh/TTxv2gGcKLwgQnDHWUAEStHJVGjiH2Vsi7o8cD7OvaV/d6jM+lxtYIEBwxrjebYBPkdWQRjRhWMGQdqfD7NFX18pa3OYrxbjVLggQpOaaPd1bSzk3d2p8ta2uZe5/cAMLBAjOGUtlgNSuclW6+iPRT/t1t88XBQQI3ALkYarer//mTs2ittN+K/sfzMACAQIXQ6nZWqoRh8ijUMtpv+Wg2uEggwCBm+RvLVXd5k7N0x8pT/ttVYvaIg3ZnZj2YgcBghRK7tZS0W3u1DyiHmbfZf4VCBCYAiRpmnuIPApRDbPvNl25TRAgCKRdA4nZGSQ9lavSoLph9pJ2mX0FAgR+phIQID0a1whD5DURZpg9rx3Kt4MAgU2A3K3bRM2cBhkij6k/Yltdq6B9+h4gQGCnTVfqsBrkgsY0Rp8jds7qWrkzR7+gvA5Y9QECBEG8pOnYZttkNKBxjTBEXlfFo15G5ihESiqpQMESECAI0we5qbdr/lvaNaYxpuUmCvt8gABB1a5qUc9q9uo9GteYBmuwThoAAYK6+6i2tBnxa7ZqRGMao3IVQICgkbXq0/pOZHWPLhz1ORgiBwgQNIFOfVbf1XpVr9H4mzsBIEDgol2f0U80G/Jnm2lzJwAECM6d9I9rVHcCLCTLaEBjGvPZUxsAAYImcFkTeqhHvvuEtGlUYxpVG4cMAAGCsla9ohua1axWXSsi9WqMabkACBB4nf4ruqKCVrWpbR2qoIza1KULGqTPAYAAgZ+cRjTCYQAQEFP4AQAECACAAAEAECAAAAIEAAACBABAgAAACBAAAAECACBAAAAgQAAABAgAgAABABAgAAACBAAAAgQAQIAAAAgQAAABAgAgQAAAIEAAAAQIAIAAAQAQIAAAAgQAAAIEAECAAAAIEAAAAQIAIEAAACBAAAAECACAAAEAECAAAAIEAAACBABAgAAACBAAAAECAAABAgAgQAAABAgAgAABABAgAAAQIAAAAgQAQIAAAAgQAAABAgAAAQIAIEAAAAQIAIAAAQAQIAAAECAAAAIEAECAAAAIEAAAAQIAAAECACBAAAAECACAAAEAECAAABAgAAACBABAgAAACBAAAAECAAABAgAgQAAABAgAgAABABAgHAIAAAECACBAAAAECACAAAEAgAABABAgAAACBABAgAAACBAAAAgQAAABAgAgQAAABAgAgAABAIAAAQAQIAAAAgQAQIAAAAgQAAAIEAAAAQIAIEAAAAQIAIAAAQCAAAEAECAAAAIEAECAAAAIEAAACBAAAAECACBAAAAECACAAAEAgAABABAgAAACBABAgAAAQIAAAAgQAAABAgAgQAAABAgAAAQIAIAAAQAQIAAAAgQAQIAAAECAAAAIEAAAAQIAIEAAAAQIAAAeWjgEOFXQoua1og1taFt5HaqgnFrVom71qldDGteochyoJrCpeS1qXZva1J7yOlRRWWXVpnZ16oJ61athDauHQ0WAoPa+6vP4Nf3TCF7pKyHf3XO9rweaUeHcI3nlj5qTspwm9aJuaCAxx+4rVRx1SerVfx+wK17Uv9WGxfPCno28fksHPs9p12/U5Ou7q8d6qCfadr3AKOjwzCNduqRLuqJhZSL6JgTzFZoWAgTSI03rUh1+b1Hv64d6GqCX8lRP9Q1d1pt6sSHugW7ogV4K9BPvW8VHePd940Pa13t6NdLfWtIT/UTvqxjop3Z0X/cldeqqPqQXuCtOgKA+vql/EfvvvKe/0fNQP/lUT9Wvt3SzAY78jwIGyI9q/H5uWT4rugAp6Z6+pbWqei53dVfdelWvaZwvMwGCuM3ooa7H+PuW9Reaq+oVnutP9QN9UcMpP/JPtKrBAMftg5q+m03L13+izYhGIGb0dS1G8krb+oF+wG2lpkF/M1G+pVKMV92/V2V8lM3p39X8ijyOo2HvhzV+L+9a/hWUdDuC35bXN/QfIooPECCoowXdi+X3FPTn+rrykb3a1/XnLsPvaXJLh5bP3Ne7NX8vtt6p+ndt6Pf1gxgvW0CAoIa+HXAIM4xD/VGARsq20fsj6yY4iexj4VaNP+ecVq2fu6pnVf6u36PvAQKkcaxG3rSf7y/8sR7X4HUf649T3QuxuzFVSsgAerhnV5rV/6MdvnIgQBrJdyK7teTuL2oSH+UI+VqKj/uy1VTmJwH6B2HkdTfQ8++G/mtZ0B+mus+IJGAWVuJs6sf6RM1e/R+sBl5H9KKmNKgutSivHa1qWu9r2eJ6eEIfS3Ef5HJE/ZTwHmgv0PN39VAvh/g92/qP2rd6ZpeuakIj6lOnWpRVQQfa0ZbWtKwFLdT4cgcECAL6rj6sthpdZf+173Om9FbFgsY2talf1/SWpvU3mvX56f+sy6md1Pu+77TYdT2s8Xu4FeInggdISX+mLd9nZfSiPqbLZ25TZNWqbo3ohaMe0zM91AOLiwsQIIjFjr6vz9TgdUv6C59Ripx+Vh/3fPSSvqwf6G+Mr5HXX+hXU3rci/qJfsb4jB/VeL7STojbi4+0o66AP/MDPfF9zmV9XqMWDcglXdLntKx3dVubERwD1pCkCWMgifQD7dbgVe/6rPto0a8Y4qPsE/onPlcdcwHv4ifJT4zhWIhg2qzZ7RBz8IqBV4Ns6zu+zcJb+mcW8XFqWJ/T/6AvaZIvLwGCetvXd2twff0tnxsWv3h0W8Lsmn7Rp2zeN2OYilwb27pvbN53a/z7vW9gdRh6GUFve/21T6WtnL6kT1uXRnQ2Jjf1Zf2zulR0AwEChx9GcjvA6T2fmlefsL6X/rJPP+W53k/tcf9RyMeisGBYk/GS4ewsaiHAb3muOz7P+GKoYfljV/TP+foSIKivgv428kgy6ddbAV7rLfVV8buS4oLLv814NsazJwXt/V4jLNNSxleNhRODrI3/B5/+4Sf0Gl8/ECBp905VtVHPWtO08fGfCbRNVIvPIP/TkBV+4/WRQP2MHwZ4jXCXDN5jGV26rCnDDDH7sRO/cZxBfY6vHgiQ9Cvq2xG+2gPjoz2Bi7K/5nPtnYabWB91Dc3brisxdlxHR3L6aGTv5pFhVfiryiqjVzwf37GeXvzAZ/zjLfabBAGSNi+6/uvdCOsUmRv0NwL/IWT14SoCKxm6XXcBybsOSv/YdX7Wy+qO7N2YbkPdPIqRcD/tdN/46HDAfVFAgCABPus656XkM2/KXt5nAWCYQVNzUzOTirpYb7r+6/nVHkX9xPWZ0a263zVEbp8uSpImDNsIP7CcIfbE+OiHQ8y9AgGCOhvxuLp84Lvy286SsTnvDjTj/9iY8eq7kIoqr1Mac/nXtXPL+d5znRM3pqnI3skdwxm6edKsv2o43jarb1Z9iife5KsIAiSNvAaxvxnJqz/zaUbDMS8am0/FcXfvQ/zQ5/839V/CMa3leNWqgbdZDWK+HBmNdE4ZmgGlTBKiX2/oxy7//lSPrZb3ma349CXCGdN7oX9nUrymv3YZNH+k5+p39N/cZrB1RLgj+bIhbocc/cNhjWjJ8yJh2bcK2XJNLiSi9dVAz6bwCT0QSJI+45Hm34yg/tKG8dGhkK9q/rnNVBz1Fr3u8q+Vu3649z/eiPDqy67/UX0fZN2nBwIQICnV7XFLZN54nR9FgPSG7jWFb6yS42OuA8e3TsqU77uuz8hEOIBetJiB5R4nlfxXgzw3PjrIlxCBL8CQGD+ln7ju0fBNvVhl0u/4RFc4nVX8zuQY0DWXVRS7uqM3JEnvuG67dM0nPoN4om3Px8bPNOv9mvAc0drSBz63O83nxG8EhJtLoAeSYJ36pOu/rwYqVeHGvPNcR8hX7ajidyaJ12ReSSq5jkzVYwDdpg/yTlV/B118BUGApNknPXoDf1vlqgpzwxF27XGuQQLkBdf1FfOak/TYdQvbgQgmNhzbN9yizLiMedw0rNV4z2eXwUNuR4AAaVyt+inXf1/3uA62VazJH4E5QAqpOeoZw2Re9wH0j0W44O6u4Ui51b+6YCiXXtC9Ks4JRUxAgKTcRz2GtL9b1RV9top4aYbm6HXXq+97mtMj1yv11yP83cFuYHn/q/+r+f0dFPj6gQBJN686t9v6QVU9m1o0HIUqfmeydLiWMC/oj1ynUH8o9KjReauGxX1ZjxIzLxu+tjOut9yOtREgIEAa24c8plN+z7VKbBQBEvZ193yiME3cB8XdZy19LMLfa5oecdVjWLtTVw0/dTv0OdnhywcCJP2n5LOu/76vvw/9ml01aTjM5fu6U3XUR63XYV+KcMFdKcAKELtHpHcNC0/NE3W3+PIhICZeJNDLGnctbfEP+kTIZrnXuOnpusZDvepzn9+ZLm9qpoq+SjhPDUs8c4Z6xy/ra543nNb1VFc8z4mpKtpaInYzZ/0IPRBUJePRB8mH3ubW3JivhnzVlYYKkJeswrk70h0zTP2PG2r3fKxNN0K9qnkj4iW+eqAH0giu6ZJrAb+39clQK6DNVavC1s1drOJ3Jk9OH9V3fJ/10QivuQ6Nk27NpRpfNWwNdU//yGPUa8T4mn49sPN9g6/yVSVAkESf0793+deCvqP/MsSrmW9Rhd1zxNzgTKTumH9U3/WdmvzRCH/fXePU7D+pKpjcJxqbC/AvaC/C+WVoBtzCSqhJXXf999s+JbndjRpXZWyF2vxp0VDBScr5XO0mkf/tqZcinRrwbs0+idcrDxgDohhB2U4QIEiEtyLc5rblaFNUL2Eajvs+AZjGdc1vVvl4EOuuNymj8dSjFnLGpwTLO3ztQIA0hlG9Ellj77eD+TuBV6MXfRqbF1N5zKeMU3THIt1y6VYE+7x48Z4e/LLx52YsZ6IBBEjifTbC03PD+OiG1Y7aTnd9Noy6kdJjbupjfCzS33S7pp/DK0Cu+wx7/k0NYw0ECGI0EGHNpQGfOf7fOdlAyUZB3zY+ftm1vm0avOY5SuBe7iSsGa3V9HOsefQlWn3+pmb0Nl88ECCN4TMRjiS86dPgfDvAa33LZxHhm6k94t6FEt+IdMrirZp/Eq/f8AmfSsJ/FXpaNwgQJEpPhLdNXvJZRvZ9vW/5Su/r+8bH+1M6AlLmXqo9E+kE3rxP2fUo3PPoUw76jIcV9Ic+S0QBAiQlPu1TQTXIqX7L+HhJf6onFq/zRH/qc5/8rVT/WblvFnUt0ptyfhs/RcF7o6qf8+nX7ug/6AO+eiBA0q/LY5vbMG76LO7L64+ONnL19kP9R5/RkovGUn9p8Kblv4V3K5bP4fVb+vRpn5/c0R/or1O0pyTqhZXoifdJ/SiiQtsZfVG/Z1xrndfXdVdveUxXndE3fdcu5PTF1B/x6zUu6Ldp7On9ks9U20qP9QeGvuKWR/3dT+uR5oyvW9T3dEsf14cNSydrU/49eHkUyi8SIPDUpk/rGxG91oh+Vv/J5znT+r81qhc1pUF1qUV5bWtVM3rfqtjez2mYU+bjtuEWYKtHBQIvV9TpWVa/pNv6lEfMf0n/zncfmB19S9/WlC5pQv26oDZlVdCBtrSuBT1lzQgIkDT4mL7vs+rC3sf1zGIFwmKo4ibSh1I8/yo+phtYNwJ+JbN60bCk85ZHgEh9+iXfm5HlEJqu4Yp5pB1jICmQ89jmNpwv+pSzCO8F/WNOlq9nxjlOrwR+PdOcqmXDlNwr+hJffxAgzeB1j21uw8XRL9ckQl7QL6ey/lWS+h9Bb2CVj3u74VFTwZkX9cup2rkeBAhCnqafifDVWvUrka6qlqTX9Cs0RhYKxqIx10PcU84Zy8bcNU6auKF/nrKth0GAIIRXItyJW8rpF/X5yPoLOX1ev0jvw8oD407y4SZAm25i7eqB8WfH9S9TvewTBAgsZHyWAQb3cf26T5F3OxP6dX2cE2TJdAOrJcQNrHI/ojXkb5Skbv0TfVFdEX7GFr2uX+NUNwVmYaXGdU1FPHFyWF/WPX3Tp66VSZ/e0k2f2ko4ta1HxjMc7uuY03VDaZRH2va9TfWGbup7+l4ESwcn9JpejTSOQIAgEm/pP0Ter7mpl/WefqSngX/2kt7US3RhA7lj3Hcl/Ar+VwwBUtQdfcL3FVr1GX1C7+rHoXa8lDK6qBf1cmqrMIMAaXiXdM14BRtOVq/oFT3X+3pfsz57gpevdyf1om7QVIRQixtYx32XvOG3fsLqVdr1pt7Uot7XAy1YbjHWolFN6rKm1MnpbUKZVfaPwYm8lvRMK9rQhnZ0qEMVlVWrWtWlXvVqSBMa4aqjKf4SFjSv1aO/hLwOVVBWWbWoQx3qUq/61a8RDXADs5n9Jm0BKq4nJ3wKLqJZ/hImNclhgA9uYQMACBAAAAECACBAAAAECAAABAgAgAABABAgAAACBABAgAAAQIAAAAgQAAABAgAgQAAABAgAAAQIAIAAAQAQIAAAAgQAQIAAAECAAAAIEAAAAQIAIEAAAAQIAAAECACAAAEAECAAAAIEAECAAABAgAAACBAAAAECACBAAAAECAAABAgAgAABABAgAIBG08IhiENev6UDn+e06zd8Tsf/pUXPx3L6n9Qe8t3t67dU8Hx0TL8ew2fz8lXjo1+pyU8m54yH+2yVMsoqq1a1q0Pd6lWfhjWi3ljPRW0+mb+vCARIA7jv25hI+3pPrxqf8bq+4flYQff1Ruh3VzA8+qFYPhtnvFZKKqigQ+1U/GuvruiGrtMAoCrcworFrUie9arxdN0O/e7eNf6BvBrLZ+OMx2tDt/Qn+m19Q5t8PUGAJNmmPrB63hOfL3O3rhkefRqyKdjUtOHRa+qO5bNxxuthXz/Q/6G/U4kvKQiQpHrX8gta8u1FvF7VT3v1XEohf2O0n40zXh95fUt/oH2+piBAksn+RsU7Po/fUKcxCsIFiLdO3Yjts3HG6+eJ/kB5vqggQJJnTqvWz13VM+PjOd00PLpkmKXlZVFLhkdvKhfbZ+OM1/c9f52vKgiQNF+N2jzbfEvp3cDvzvwTb8T62Tjj9fSOnvJlBQGSLHndDfT8uz63EiY0ZHj0TsDh0JLx3Q1rPNbPxhmvr2/zdQUBkiwPtBfo+bt6WEUfZMty9s+xD4yzgF6P/bNxxutpOsCtN0BiIWHN3QrxEy8bH39N3zT0M27raoDfZRpAz+i12D8bZzwKXznXJ9rXoh7olu/ixoca5CsLAiQpdvQ48M880o66DI/36KrhVe/p561Pal73DY9e1YXYPxtnvDZf8ha9oBf0Kf2x5o3PnNEnEn10KU2SNNzCqqnbKgb+mWJVq0EO9Z71b3rfeEX6el0+G2e8dnr1X/ssC+UWFgiQBPG+ndFhuOb0uwnykrFson1jZJqB1a6X6vLZOOO11KlPGR+nrAkIkMRYMKzLeMlw33tRCz63JF4xPPpY21bvznyz5RWfG2G1+myc8dq6bnz0kC8tCJCkMF3hv2osUui3nsN0e6loOY30rvFmy+t1+2yc8Voyl3HP8KUFAZIMBcPNpC5d1pR6PB/3u5M+pYGqGyPTra4BTdXts3HGa8kcEe18bUGAJMOjMzswVF6NZpUx3Ija8V0bYJpiO28xGLqmOcOjH6rrZ+OM186G8dF+vrYgQJLB1A+4edSohO9FvG68lvQfSDevAPlQXT8bZ7x2zDF1ka8tCJAk2NUDz8f6jr6oE4YbUQ+0a3z9Pl0yxoNfSRNTgFxWX10/G2e8Vvb1fePjL/LFBQGSBHcM28TePOk9eF+RFnyHwk29hOeaNf7srNZCvnI8n40zXgvb+kPjRN0B40UJQIDExjSz/1VHwxLuFco/22p49N3Q/Y9W4yTheD4bZzxKBW3rib6h/9PnsuLnmIWFgChlUhPLhpIRQxo9+e9hjXjux/FMyxr2aei9m5z7+i889/Io6J7hdV8xBlM8n40zXo2vhvqpN1JwAyvYJ6PwCT2Qhr4arfaK1HSryXRH/rFhtpD/Dax4PhtnPF7X9PN8bUGAJEHRYj6Oe+NSyW9twGXjsrA7no+Y3l2vLifis3HG45PRx/UrPntPAgRITJ4YiomMnymY3a8Jz+f67e5hnm770GNfin1D38RvenB8n40zHpdJ/Qt9noYABEhS2N/O8LsifcfnN5kCxKtY+33jDnivJeazccbj8GH9U03ylQUBkhT7hoLqGZc74DcN1/zvad/4uwaNX3732yqmGVhTPhsKxfnZOONxeFu/ra8Zx8QAAiRGdw3rAdyqIV0wzL43z5eSzEUPZ7R+7t829TTkq8X/2TjjccjrJ/q3epsvLgiQJAh2O8P7X/1frXw16z34WXLpbdwxrFHPRbQCJKrPxhmPy4H+Uv/Jt3oBQIDU2KphsVbWY0eIlw2nYcanMKJ546d3Lf7l1Es+1Vjj/myc8Tj9g77J1xcESH2ZGuirHnvSdeqq4aeq2eB29czytiXPRWyS9EbiPhtnPE5/35AlZlBLrESPVCnAeoDKRx4ZGqjPGKfWXlW3YRLpbY1bNnYXdCVxn40zHsZXzr3HA+1qQU9122Nq97G/0jX2BAEBUi9PDfst5Aw3m17W1zwHYtf11Ni0Z/Uhfc8QID970s0sGRYXSq/5dEfr8dk441HIqF3t6tfL+py+oZ8Ynrmj7+mzCT7aFCdJGm5hxXY744bh2q5NN0K+qmS+ibWjJ47GbjPkq9Tvs3HGo9SqL+iTxme83bD7RYIASbhD4xTMV40/a3r0ng6NPztccZvqfB/k/H+dN+FTxq9en40zHrXPGbdD3m6oCgGoNW5hReiu8Wv/J1U1U6/79EG8a8G+p0O1Sip4rEy363/U77NxxqO+Zvyo/rPh8Wm9wFcZ9EDi927dXvlVw2qQw6PgMK1xzhlrxNb3s3HGo2YeX3nGFxkESPzWNV2z137qsqbcqdN4R/224/+6u6HOxH42znjUeo2PrvFVBgESv1s1XMlb8r0iNZVV/EDb2tHjkD9d/8/GGY9Wm/HRfb7KIEDiV9vlX37NyTWPJWuSVNQd3TPUa+rS9UR/Ns54tPYJEBAgyTJT467/mmaMj+eMhdjfNTZHfitA6v3ZOOPRWqdJAAGSLLfq/htMt6EWNBfyJ5Px2TjjUXpifLSNLzMIkHjlYyjCfc+4EZQ0ptFQrzuqscR/Ns54lO/8R8bH+/g6gwCJVxzbAJm2LSoLt3Lg9VR8Ns54VL5hrEcgDfF1BgESr1uJ+C2vhTid2ao2sU3bEWy0Mx48kv5cP/Z5zhRfZ1hjJXoENo13lX/JY08Id4/1B56PPdGWLhh+tksv6GHA926avZWkzxa1rwb+ia+k9qgcV+N9oju+/aaMrtXliCbnd4AAidltw3qAVt8pspWuqFO7ng3BbX3K+NOvBw6Q11Pz2TjjtWtmne+mly80AtzBQE1vNNwImNFZvVjFLY0b6gj02zp8G7vkfDbOeBx+iq8zCJA4PdOK4dFXAr+eaYvaZUPRxHKH8mag3/WqT2OXpM/GGa+9F407JQIESKxXo0FvZ0jSC8Y94d7x+elgM7FeT9Vn44zX1gX9Y77OIEDiVDDuI309xCBTzlgY8a6hJIkkXdSg9W8a1ESqPhtnvJY69d/4TKgACJCIPfAcAJUU8IbSMdMtjV09iKwP8kbqPhtnvFYG9Ks+W4oBBEjkTLczWkLczpCkG2oN+Rsl6UPKWP2WTFUrQOrz2TjjtWkEPq5/adynECBAamBbjwyPXg85SzpnbIYeadv40z0+GwYdu6qe1H02znjUWvS6/jt93hhgAAFSE3dUNDx6M/TrmmbyFHXH56ftbmK9nsrPxhmPSqtu6Av6H/ULAUbNgLMXIKhCLW5nHF/J5g2/9RPGn35ZX/ddcdxuvO+e3M/GGQ97pZhVqzrVoR71a0jjGubqEVXLrJY4CACAwH6TixAAQMieLQAABAgAgAABABAgAAACBAAAAgQAQIAAAAgQAAABAgAgQAAAIEAAAAQIAIAAAQAQIAAAAgQAAAIEAECAAAAIEAAAAQIAIEAAACBAAAAECACAAAEAECAAAAIEAAACBABAgAAACBAAAAECACBAAAAgQAAABAgAgAABABAgAAACBAAAAgQAQIAAAAgQAAABAgAAAQIAIEAAAAQIAIAAAQAQIAAAECAAAAIEAECAAAAIEAAAAQIAAAECACBAAAAECACAAAEAECAAABAgAAACBABAgAAACBAAAAECAAABAgAgQAAABAgAgAABABAgAAAQIAAAAgQAQIAAAAgQAAABAgAAAQIAIEAAAAQIAIAAAQAQIAAAECAAAAIEAECAAAAIEAAACBAAAAECACBAAAAECACAAAEAgAABABAgAAACBABAgAAACBAAAAgQAAABAgAgQAAABAgAgAABAIAAAQAQIAAAAgQAQIAAAAgQAAAIEAAAAQIAIEAAAAQIAIAAAQCAAAEAECAAAAIEAECAAAAIEAAACBAAAAECACBAAAAECAAABAgAgAABABAgAAACBABAgAAAQIAAAAgQAAABAgAgQAAABAgAAAQIAIAAAQAQIAAAAgQAQIAAAECAAAAIEAAAAQIAIEAAAAQIAAAECACAAAEAECAAAAIEAECAAABAgAAACBAAAAECACBAAAAECAAABAgAgAABABAgAAACBABAgAAAQIAAAAgQAAABAgAgQAAAIEAAAAQIAIAAAQAQIAAAAgQAAAIEAECAAAAIEAAAAQIAIEAAACBAAAAECACAAAEAECAAAAIEAAACBAAQcYAcchAAAEFl9rPa4DAAAALbyOopRwEAENiTrN7lKAAAgjq4ky19i8MAAAjozthCtvjnynMkAACB/JmUHXmm/48jAQAIoFT6fSkrZf43jgUAIEj/Y+iOlJGk1b/UFzgeAAAreb05+M7RSvTcb2ibIwIAsPK/D74jHfVApLUvl36fYwIA8JP5fv/PZA6kk1pYA/++9G84LAAAH48Ov1SOD0cxxaF/TYQAAIzuZX5udP6kL+J8ZO1XS7+jbo4QAMDFn+V+rW/19P+tKOc+8Pu5j7IqBABwznLpvx34kjM+zvRAjvohP1v6n/WPlON4AQAkPdXvln5n6Fzt9oz7s5cuZn8h85Ze02UNcuwAoAntailzv/j3mb8a+NtM0e0J/z9R6fuesGiaAQAAACV0RVh0ZGF0ZTpjcmVhdGUAMjAyMi0wMi0yMFQwNDo1MjozMiswMDowMC5POWcAAAAldEVYdGRhdGU6bW9kaWZ5ADIwMjItMDItMjBUMDQ6NTI6MzIrMDA6MDBfEoHbAAAAAElFTkSuQmCC";
const ImageBase = ({ src, alt, className, fallbackSrc, ...props }) => {
  const [errorCount, setErrorCount] = useState(0);
  const [currentSrc, setCurrentSrc] = useState(src || brokenImgSrc);
  const handleBrokenImage = useCallback(() => {
    if (fallbackSrc && errorCount < fallbackSrc.length) {
      setCurrentSrc(fallbackSrc[errorCount]);
      setErrorCount(errorCount + 1);
    } else {
      setCurrentSrc(brokenImgSrc);
    }
  }, [fallbackSrc, errorCount, setCurrentSrc, setErrorCount]);
  return /* @__PURE__ */ jsx("img", { ...props, src: currentSrc, alt, className, onError: handleBrokenImage });
};
const Source = ({
  src,
  media
}) => {
  return /* @__PURE__ */ jsx("source", { media, src });
};
const Image = ({ src, sources, className, ...rest }) => {
  if (!src && !(sources == null ? void 0 : sources.length)) return null;
  const defaultSrc = src || sources && sources[sources.length - 1].src;
  return /* @__PURE__ */ jsxs("picture", { children: [
    sources == null ? void 0 : sources.map(
      ({ src: src2, media }) => src2 && src2 !== defaultSrc ? /* @__PURE__ */ jsx(Source, { src: src2, media }, src2) : null
    ),
    /* @__PURE__ */ jsx(ImageBase, { className: clsx(`mkt-image`, className), src: defaultSrc, ...rest })
  ] });
};
const useRemoveCartItem = () => {
  const fetcher = useFetcher({ key: FetcherKeys.cart.removeLineItem });
  const submit = ({ id: lineItemId }) => {
    fetcher.submit({ lineItemId }, { method: "delete", action: "/api/cart/line-items/delete" });
  };
  return { fetcher, state: fetcher.state, submit };
};
const CartDrawerItem = ({ item, currencyCode, isRemoving }) => {
  var _a, _b;
  const removeCartItem = useRemoveCartItem();
  const handleRemoveFromCart = () => removeCartItem.submit(item);
  return /* @__PURE__ */ jsxs(
    "li",
    {
      className: clsx("flex h-36 py-6 opacity-100 transition-all", {
        "!h-0 !p-0 !opacity-0": isRemoving
      }),
      children: [
        /* @__PURE__ */ jsx("div", { className: "h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200", children: /* @__PURE__ */ jsx(
          Image,
          {
            src: ((_b = (_a = item.variant) == null ? void 0 : _a.product) == null ? void 0 : _b.thumbnail) || "",
            alt: item.product_title || "product thumbnail",
            className: "h-full w-full object-cover object-center"
          }
        ) }),
        /* @__PURE__ */ jsxs("div", { className: "ml-4 flex flex-1 flex-col", children: [
          /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("h3", { className: "text-base font-bold text-gray-900", children: item.product_title }),
              /* @__PURE__ */ jsx("p", { className: "mt-0.5 text-sm text-gray-500", children: item.variant_title })
            ] }),
            /* @__PURE__ */ jsx(Button, { variant: "link", onClick: handleRemoveFromCart, disabled: isRemoving, className: "text-sm", children: isRemoving ? "Removing" : "Remove" })
          ] }) }),
          /* @__PURE__ */ jsx("div", { className: "flex-1" }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
            /* @__PURE__ */ jsxs("p", { className: "text-sm  text-gray-500", children: [
              "Qty ",
              item.quantity
            ] }),
            /* @__PURE__ */ jsx("div", { className: "flex", children: /* @__PURE__ */ jsx("p", { className: "ml-4", children: formatLineItemPrice(item, currencyCode) }) })
          ] })
        ] })
      ]
    },
    item.id
  );
};
const CartDrawerHeader = ({ itemCount, onClose }) => /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between", children: [
  /* @__PURE__ */ jsxs(DialogTitle, { className: "text-lg font-bold text-gray-900", children: [
    "My Cart",
    " ",
    itemCount > 0 && /* @__PURE__ */ jsxs("span", { className: "pl-2", children: [
      "(",
      itemCount,
      " item",
      itemCount > 1 ? "s" : "",
      ")"
    ] })
  ] }),
  /* @__PURE__ */ jsx("div", { className: "ml-3 flex h-7 items-center", children: /* @__PURE__ */ jsx(IconButton, { icon: XMarkIcon, onClick: onClose, className: "-m-2", "aria-label": "Close panel" }) })
] });
const CartDrawerEmpty = () => /* @__PURE__ */ jsx("p", { className: "text-center text-sm text-gray-500", children: "Looks like your cart is empty!" });
const CartDrawerLoading = ({ className }) => /* @__PURE__ */ jsx("li", { className: clsx("list-none", className), children: /* @__PURE__ */ jsxs("div", { className: "flex animate-pulse space-x-4", children: [
  /* @__PURE__ */ jsx("div", { className: "h-24 w-24 rounded-md bg-slate-300" }),
  /* @__PURE__ */ jsxs("div", { className: "flex h-24 w-full flex-1 flex-col space-y-3 py-1", children: [
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-3 gap-4", children: [
      /* @__PURE__ */ jsx("div", { className: "col-span-2 h-2 rounded bg-slate-300" }),
      /* @__PURE__ */ jsx("div", { className: "col-span-1 h-2 rounded bg-slate-300" })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "h-2 rounded bg-slate-300" }),
    /* @__PURE__ */ jsx("div", { className: "flex-1" }),
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-4 gap-4", children: [
      /* @__PURE__ */ jsx("div", { className: "col-span-1 h-2 rounded bg-slate-300" }),
      /* @__PURE__ */ jsx("div", { className: "col-span-2" }),
      /* @__PURE__ */ jsx("div", { className: "col-span-1 h-2 rounded bg-slate-300" })
    ] })
  ] })
] }) });
const CartDrawerItems = ({ items, isRemovingItemId, currencyCode }) => /* @__PURE__ */ jsx("ul", { className: "-my-6 divide-y divide-gray-200 list-none", children: items.map((item) => /* @__PURE__ */ jsx(CartDrawerItem, { isRemoving: isRemovingItemId === item.id, item, currencyCode }, item.id)) });
const CartDrawerContent = ({ items, isRemovingItemId, isAddingItem, showEmptyCartMessage, isRemovingLastItem, currencyCode }) => {
  const hasItems = items && items.length > 0;
  return /* @__PURE__ */ jsx("div", { className: "mt-8", children: /* @__PURE__ */ jsxs("div", { className: "flow-root", children: [
    hasItems && /* @__PURE__ */ jsx(CartDrawerItems, { items, isRemovingItemId, currencyCode }),
    isAddingItem && /* @__PURE__ */ jsx(CartDrawerLoading, { className: clsx(hasItems ? "pt-10" : "py-0") }),
    !hasItems && !isAddingItem && /* @__PURE__ */ jsx(CartDrawerEmpty, {})
  ] }) });
};
const CartDrawerFooter = ({ cart: cart2, currencyCode, itemCount, navigatingToCheckout, onCheckout, onClose }) => /* @__PURE__ */ jsxs("div", { className: "border-t border-gray-200 px-4 py-6 sm:px-6", children: [
  /* @__PURE__ */ jsxs("div", { className: "flex justify-between text-base font-bold text-gray-900", children: [
    /* @__PURE__ */ jsx("p", { children: "Subtotal" }),
    /* @__PURE__ */ jsx("p", { children: cart2 ? formatCartSubtotal(cart2) : formatPrice(0, {
      currency: currencyCode
    }) })
  ] }),
  /* @__PURE__ */ jsx("p", { className: "mt-0.5 text-sm text-gray-500", children: "Shipping and taxes calculated at checkout." }),
  /* @__PURE__ */ jsx("div", { className: "mt-6", children: /* @__PURE__ */ jsx(
    Button,
    {
      variant: "primary",
      disabled: itemCount === 0 || navigatingToCheckout,
      onClick: onCheckout,
      className: "h-12 w-full !text-base font-bold",
      children: navigatingToCheckout ? "Preparing checkout..." : "Checkout"
    }
  ) }),
  /* @__PURE__ */ jsx("div", { className: "mt-4 flex justify-center text-center text-sm text-gray-500", children: /* @__PURE__ */ jsxs("p", { children: [
    "or",
    " ",
    /* @__PURE__ */ jsx(ButtonLink, { size: "sm", onClick: onClose, children: /* @__PURE__ */ jsxs("div", { children: [
      "Continue Shopping",
      ` `,
      /* @__PURE__ */ jsx("span", { "aria-hidden": "true", children: "→" })
    ] }) })
  ] }) })
] });
const CartDrawer = () => {
  const navigate = useNavigate();
  const {
    cart: cart2,
    cartDrawerOpen,
    toggleCartDrawer,
    isAddingItem,
    isRemovingItemId,
    isRemovingLastItem,
    showEmptyCartMessage
  } = useCart();
  const { region } = useRegion();
  const allFetchers = useFetchers();
  const [navigatingToCheckout, setNavigatingToCheckout] = useState(false);
  const isCartLoading = allFetchers.some(
    (f) => (f.state === "submitting" || f.state === "loading") && f.key.startsWith("cart:")
  );
  const [isOpen, setIsOpen] = useState(false);
  useEffect(() => {
    setIsOpen(cartDrawerOpen === true);
  }, [cartDrawerOpen]);
  const lineItems = (cart2 == null ? void 0 : cart2.items) ?? [];
  const lineItemsTotal = lineItems.reduce((acc, item) => acc + item.quantity, 0);
  const handleCheckoutClick = useCallback(() => {
    setNavigatingToCheckout(true);
    navigate("/checkout");
    setTimeout(() => {
      toggleCartDrawer(false);
      setNavigatingToCheckout(false);
    }, 750);
  }, [navigate, toggleCartDrawer]);
  const handleClose = useCallback(() => {
    toggleCartDrawer(false);
  }, [toggleCartDrawer]);
  return /* @__PURE__ */ jsxs(Dialog, { open: isOpen, onClose: handleClose, className: "relative z-50", children: [
    /* @__PURE__ */ jsx(
      DialogBackdrop,
      {
        transition: true,
        className: "fixed inset-0 bg-gray-300 bg-opacity-50 backdrop-blur-sm duration-300 ease-out data-[closed]:opacity-0"
      }
    ),
    /* @__PURE__ */ jsx("div", { className: "fixed inset-0 overflow-hidden", children: /* @__PURE__ */ jsx("div", { className: "absolute inset-0 overflow-hidden", children: /* @__PURE__ */ jsx("div", { className: "pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10", children: /* @__PURE__ */ jsx(
      DialogPanel,
      {
        transition: true,
        className: "pointer-events-auto w-screen max-w-md transform duration-500 ease-in-out data-[closed]:translate-x-full",
        children: /* @__PURE__ */ jsxs("div", { className: "flex h-full flex-col overflow-y-scroll bg-white shadow-xl", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex-1 overflow-y-auto px-4 py-6 sm:px-6", children: [
            /* @__PURE__ */ jsx(CartDrawerHeader, { itemCount: lineItemsTotal, onClose: handleClose }),
            /* @__PURE__ */ jsx(
              CartDrawerContent,
              {
                items: lineItems,
                isRemovingItemId,
                isAddingItem: isAddingItem || isCartLoading,
                showEmptyCartMessage,
                isRemovingLastItem,
                currencyCode: region.currency_code
              }
            )
          ] }),
          /* @__PURE__ */ jsx(
            CartDrawerFooter,
            {
              navigatingToCheckout,
              cart: cart2,
              currencyCode: region.currency_code,
              itemCount: lineItemsTotal,
              onCheckout: handleCheckoutClick,
              onClose: handleClose
            }
          )
        ] })
      }
    ) }) }) })
  ] });
};
const useSiteDetails = () => {
  const data2 = useRootLoaderData();
  return data2.siteDetails || {};
};
const LogoHeader = ({ primary, className, ...rest }) => primary ? /* @__PURE__ */ jsx("h1", { className: clsx("logo-header", className), ...rest }) : /* @__PURE__ */ jsx("h2", { className, ...rest });
const LogoStoreName = ({
  primary,
  theme = "light",
  className
}) => {
  const { store, settings } = useSiteDetails();
  if (!store || !settings) return null;
  const logoSrc = theme === "light" ? "/logo.svg" : "/logo-dark.svg";
  return /* @__PURE__ */ jsx(
    Link,
    {
      viewTransition: true,
      to: "/",
      prefetch: "viewport",
      className: clsx(
        "logo-header flex flex-nowrap items-center justify-center gap-x-2 gap-y-2 sm:gap-x-4",
        className
      ),
      children: /* @__PURE__ */ jsx(
        LogoHeader,
        {
          primary,
          className: "xs:text-2xl whitespace-nowrap text-lg font-bold font-aboreto",
          children: /* @__PURE__ */ jsx(
            "img",
            {
              src: logoSrc,
              alt: "Logo",
              className: "w-full h-full max-h-[40px]"
            }
          )
        }
      )
    }
  );
};
const Container = ({
  className,
  ...props
}) => {
  return /* @__PURE__ */ jsx("div", { className: clsx("mx-auto w-full max-w-screen-2xl px-4 sm:px-6 md:px-8 xl:px-[86px]", className), ...props });
};
const useRegions = () => {
  const data2 = useRootLoaderData();
  return { regions: data2 == null ? void 0 : data2.regions };
};
const convertToFormData = (data2, formData = new FormData(), parentKey = "") => {
  if (data2 === null || data2 === void 0) return formData;
  if (typeof data2 === "object" && !(data2 instanceof Date) && !(data2 instanceof File)) {
    Object.entries(data2).forEach(([key, value]) => {
      convertToFormData(
        value,
        formData,
        !parentKey ? key : data2[key] instanceof File ? parentKey : `${parentKey}.${key}`
      );
    });
    return formData;
  }
  if (Array.isArray(data2)) {
    data2.forEach((value, index) => {
      convertToFormData(value, formData, `${parentKey}.${index}`);
    });
    return formData;
  }
  formData.append(parentKey, data2);
  return formData;
};
const InstagramIcon = ({ color = "#FFFFFF80", ...props }) => /* @__PURE__ */ jsxs("svg", { width: "23", height: "23", viewBox: "0 0 23 23", fill: "none", xmlns: "http://www.w3.org/2000/svg", children: [
  /* @__PURE__ */ jsxs("g", { clipPath: "url(#clip0_96_358)", children: [
    /* @__PURE__ */ jsx(
      "path",
      {
        d: "M11.3637 2.56239C14.2785 2.56239 14.6236 2.57517 15.7699 2.62631C16.8353 2.67318 17.4106 2.85216 17.7941 3.00131C18.3012 3.19733 18.6677 3.43597 19.0469 3.81523C19.4304 4.19875 19.6648 4.56097 19.8608 5.06807C20.01 5.45159 20.189 6.03114 20.2358 7.09222C20.287 8.24279 20.2998 8.58796 20.2998 11.4985C20.2998 14.4132 20.287 14.7584 20.2358 15.9047C20.189 16.9701 20.01 17.5453 19.8608 17.9289C19.6648 18.436 19.4262 18.8024 19.0469 19.1817C18.6634 19.5652 18.3012 19.7996 17.7941 19.9956C17.4106 20.1448 16.831 20.3238 15.7699 20.3706C14.6194 20.4218 14.2742 20.4345 11.3637 20.4345C8.44891 20.4345 8.10374 20.4218 6.95743 20.3706C5.89209 20.3238 5.31681 20.1448 4.93328 19.9956C4.42618 19.7996 4.0597 19.561 3.68044 19.1817C3.29692 18.7982 3.06254 18.436 2.86652 17.9289C2.71737 17.5453 2.5384 16.9658 2.49152 15.9047C2.44039 14.7542 2.4276 14.409 2.4276 11.4985C2.4276 8.5837 2.44039 8.23853 2.49152 7.09222C2.5384 6.02688 2.71737 5.45159 2.86652 5.06807C3.06254 4.56097 3.30118 4.19449 3.68044 3.81523C4.06396 3.43171 4.42618 3.19733 4.93328 3.00131C5.31681 2.85216 5.89635 2.67318 6.95743 2.62631C8.10374 2.57517 8.44891 2.56239 11.3637 2.56239ZM11.3637 0.5979C8.40203 0.5979 8.03129 0.610684 6.86794 0.661821C5.70885 0.712957 4.91198 0.900457 4.22164 1.16892C3.50146 1.45017 2.89209 1.82091 2.28698 2.43029C1.6776 3.0354 1.30686 3.64478 1.02561 4.36068C0.757147 5.05529 0.569647 5.8479 0.51851 7.00699C0.467374 8.1746 0.45459 8.54534 0.45459 11.507C0.45459 14.4686 0.467374 14.8394 0.51851 16.0027C0.569647 17.1618 0.757147 17.9587 1.02561 18.649C1.30686 19.3692 1.6776 19.9786 2.28698 20.5837C2.89209 21.1888 3.50147 21.5638 4.21737 21.8408C4.91198 22.1093 5.70459 22.2968 6.86368 22.3479C8.02703 22.399 8.39777 22.4118 11.3594 22.4118C14.3211 22.4118 14.6918 22.399 15.8552 22.3479C17.0142 22.2968 17.8111 22.1093 18.5015 21.8408C19.2174 21.5638 19.8267 21.1888 20.4319 20.5837C21.037 19.9786 21.412 19.3692 21.689 18.6533C21.9574 17.9587 22.1449 17.1661 22.1961 16.007C22.2472 14.8436 22.26 14.4729 22.26 11.5113C22.26 8.54961 22.2472 8.17887 22.1961 7.01551C22.1449 5.85642 21.9574 5.05955 21.689 4.36921C21.4205 3.64478 21.0498 3.0354 20.4404 2.43029C19.8353 1.82517 19.2259 1.45017 18.51 1.17318C17.8154 0.904719 17.0228 0.717219 15.8637 0.666082C14.6961 0.610684 14.3253 0.5979 11.3637 0.5979Z",
        fill: color
      }
    ),
    /* @__PURE__ */ jsx(
      "path",
      {
        d: "M11.3635 5.90332C8.26971 5.90332 5.75977 8.41326 5.75977 11.507C5.75977 14.6008 8.26971 17.1107 11.3635 17.1107C14.4572 17.1107 16.9672 14.6008 16.9672 11.507C16.9672 8.41326 14.4572 5.90332 11.3635 5.90332ZM11.3635 15.142C9.35636 15.142 7.72852 13.5141 7.72852 11.507C7.72852 9.49991 9.35636 7.87207 11.3635 7.87207C13.3706 7.87207 14.9984 9.49991 14.9984 11.507C14.9984 13.5141 13.3706 15.142 11.3635 15.142Z",
        fill: color
      }
    ),
    /* @__PURE__ */ jsx(
      "path",
      {
        d: "M18.4973 5.68178C18.4973 6.40621 17.9093 6.99002 17.1891 6.99002C16.4647 6.99002 15.8809 6.40195 15.8809 5.68178C15.8809 4.95734 16.4689 4.37354 17.1891 4.37354C17.9093 4.37354 18.4973 4.9616 18.4973 5.68178Z",
        fill: color
      }
    )
  ] }),
  /* @__PURE__ */ jsx("defs", { children: /* @__PURE__ */ jsx("clipPath", { id: "clip0_96_358", children: /* @__PURE__ */ jsx("rect", { width: "21.8182", height: "21.8182", fill: color, transform: "translate(0.45459 0.5979)" }) }) })
] });
const FacebookIcon = ({ color = "#FFFFFF80", ...props }) => /* @__PURE__ */ jsxs("svg", { role: "img", viewBox: "0 0 24 24", ...props, xmlns: "http://www.w3.org/2000/svg", children: [
  /* @__PURE__ */ jsx("title", { children: "Facebook" }),
  /* @__PURE__ */ jsx(
    "path",
    {
      fill: color,
      d: "M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
    }
  )
] });
const TwitterIcon = ({ color = "currentColor", ...props }) => /* @__PURE__ */ jsxs("svg", { role: "img", viewBox: "0 0 24 24", ...props, xmlns: "http://www.w3.org/2000/svg", children: [
  /* @__PURE__ */ jsx("title", { children: "Twitter" }),
  /* @__PURE__ */ jsx(
    "path",
    {
      fill: color,
      d: "M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"
    }
  )
] });
const YoutubeIcon = ({ color = "currentColor", ...props }) => /* @__PURE__ */ jsxs("svg", { role: "img", viewBox: "0 0 24 24", ...props, xmlns: "http://www.w3.org/2000/svg", children: [
  /* @__PURE__ */ jsx("title", { children: "YouTube" }),
  /* @__PURE__ */ jsx(
    "path",
    {
      fill: color,
      d: "M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"
    }
  )
] });
const PinterestIcon = ({ color = "currentColor", ...props }) => /* @__PURE__ */ jsxs("svg", { role: "img", viewBox: "0 0 24 24", ...props, xmlns: "http://www.w3.org/2000/svg", children: [
  /* @__PURE__ */ jsx("title", { children: "Pinterest" }),
  /* @__PURE__ */ jsx(
    "path",
    {
      fill: color,
      d: "M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.401.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.354-.629-2.758-1.379l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.55.535 6.607 0 11.985-5.365 11.985-11.987C23.97 5.39 18.592.026 11.985.026L12.017 0z"
    }
  )
] });
const LinkedinIcon = ({ color = "currentColor", ...props }) => /* @__PURE__ */ jsxs("svg", { role: "img", viewBox: "0 0 24 24", ...props, xmlns: "http://www.w3.org/2000/svg", children: [
  /* @__PURE__ */ jsx("title", { children: "LinkedIn" }),
  /* @__PURE__ */ jsx(
    "path",
    {
      fill: color,
      d: "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"
    }
  )
] });
const SnapchatIcon = ({ color = "currentColor", ...props }) => /* @__PURE__ */ jsxs("svg", { role: "img", viewBox: "0 0 24 24", ...props, xmlns: "http://www.w3.org/2000/svg", children: [
  /* @__PURE__ */ jsx("title", { children: "Snapchat" }),
  /* @__PURE__ */ jsx(
    "path",
    {
      fill: color,
      d: "M12.206.793c.99 0 4.347.276 5.93 3.821.529 1.193.403 3.219.299 4.847l-.003.06c-.012.18-.022.345-.03.51.075.045.203.09.401.09.3-.016.659-.12 1.033-.301.165-.088.344-.104.464-.104.182 0 .359.029.509.09.45.149.734.479.734.838.015.449-.39.839-1.213 1.168-.089.029-.209.075-.344.119-.45.135-1.139.36-1.333.81-.09.224-.061.524.12.868l.015.015c.06.136 1.526 3.475 4.791 4.014.255.044.435.27.42.509 0 .075-.015.149-.045.225-.24.569-1.273.988-3.146 1.271-.059.091-.12.375-.164.57-.029.179-.074.36-.134.553-.076.271-.27.405-.555.405h-.03c-.135 0-.313-.031-.538-.074-.36-.075-.765-.135-1.273-.135-.3 0-.599.015-.913.074-.6.104-1.123.464-1.723.884-.853.599-1.826 1.288-3.294 1.288-.06 0-.119-.015-.18-.015h-.149c-1.468 0-2.427-.675-3.279-1.288-.599-.42-1.107-.779-1.707-.884-.314-.045-.629-.074-.928-.074-.54 0-.958.089-1.272.149-.211.043-.391.074-.54.074-.374 0-.523-.224-.583-.42-.061-.192-.09-.389-.135-.567-.046-.181-.105-.494-.166-.57-1.918-.222-2.95-.642-3.189-1.226-.031-.063-.052-.15-.055-.225-.015-.243.165-.465.42-.509 3.264-.54 4.73-3.879 4.791-4.02l.016-.029c.18-.345.224-.645.119-.869-.195-.434-.884-.658-1.332-.809-.121-.029-.24-.074-.346-.119-1.107-.435-1.257-.93-1.197-1.273.09-.479.674-.793 1.168-.793.146 0 .27.029.383.074.42.194.789.3 1.104.3.234 0 .384-.06.465-.105l-.046-.569c-.098-1.626-.225-3.651.307-4.837C7.392 1.077 10.739.807 11.727.807l.419-.015h.06z"
    }
  )
] });
const TiktokIcon = ({ color = "#FFFFFF80", ...props }) => /* @__PURE__ */ jsxs("svg", { role: "img", viewBox: "0 0 24 24", ...props, xmlns: "http://www.w3.org/2000/svg", children: [
  /* @__PURE__ */ jsx("title", { children: "TikTok" }),
  /* @__PURE__ */ jsx(
    "path",
    {
      fill: color,
      d: "M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"
    }
  )
] });
const SocialIcons = ({ siteSettings: siteSettings2 }) => {
  const socialLinks = [
    { icon: FacebookIcon, url: siteSettings2 == null ? void 0 : siteSettings2.social_facebook },
    { icon: InstagramIcon, url: siteSettings2 == null ? void 0 : siteSettings2.social_instagram },
    { icon: TwitterIcon, url: siteSettings2 == null ? void 0 : siteSettings2.social_twitter },
    { icon: YoutubeIcon, url: siteSettings2 == null ? void 0 : siteSettings2.social_youtube },
    { icon: LinkedinIcon, url: siteSettings2 == null ? void 0 : siteSettings2.social_linkedin },
    { icon: PinterestIcon, url: siteSettings2 == null ? void 0 : siteSettings2.social_pinterest },
    { icon: TiktokIcon, url: siteSettings2 == null ? void 0 : siteSettings2.social_tiktok },
    { icon: SnapchatIcon, url: siteSettings2 == null ? void 0 : siteSettings2.social_snapchat }
  ].filter((link) => !!link.url);
  if (socialLinks.length === 0) return null;
  return /* @__PURE__ */ jsx("div", { className: "", children: socialLinks.map(({ icon, url }) => /* @__PURE__ */ jsx(
    IconButton,
    {
      as: (props) => /* @__PURE__ */ jsx("a", { href: url, rel: "noopener noreferrer", target: "_blank", ...props }),
      className: "text-white hover:text-black",
      iconProps: { fill: "#FFFFFF80", width: "24" },
      icon
    },
    url
  )) });
};
const Footer = () => {
  const { footerNavigationItems: footerNavigationItems2, settings } = useSiteDetails();
  const rootData = useRootLoaderData();
  rootData == null ? void 0 : rootData.hasPublishedProducts;
  useFetcher();
  const { regions } = useRegions();
  useRegion();
  useMemo(() => {
    return regions.map((region2) => ({
      label: `${region2.name} (${region2.currency_code})`,
      value: region2.id
    }));
  }, [regions]);
  return /* @__PURE__ */ jsx("footer", { className: "bg-black min-h-[140px] py-8 text-white", children: /* @__PURE__ */ jsxs(Container, { className: "flex flex-col gap-[72px]", children: [
    /* @__PURE__ */ jsx(LogoStoreName, { theme: "dark" }),
    /* @__PURE__ */ jsx("div", { className: "flex justify-center gap-[72px]", children: footerNavigationItems2.map((item) => /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx(Link, { to: item.url, className: "hover:underline text-white text-[24px] font-alexandria font-regular leading-[145%] tracking-normal", children: item.label }) }, item.id)) }),
    /* @__PURE__ */ jsxs("div", { className: "flex justify-between", children: [
      /* @__PURE__ */ jsx("span", { className: "text-[18.56px] font-alexandria font-regular leading-[145%] tracking-normal flex-1", children: "© 2025 KIRA" }),
      /* @__PURE__ */ jsx("div", { className: "flex-1 flex justify-center", children: /* @__PURE__ */ jsx(SocialIcons, { siteSettings: settings }) }),
      /* @__PURE__ */ jsxs("p", { className: "text-end flex-1 text-[18.56px] font-alexandria font-regular leading-[145%] tracking-normal inline-block", children: [
        "Designed by ",
        /* @__PURE__ */ jsx(Link, { to: "https://mayday-creative.com", target: "_blank", className: "hover:underline text-white text-[24px] font-alexandria font-regular leading-[145%] tracking-normal", children: "Mayday" })
      ] })
    ] })
  ] }) });
};
const URLAwareNavLink = ({ url, newTab, prefetch = "intent", preventScrollReset, className, children, ...rest }) => {
  const isExternal = url.startsWith("http") || url.startsWith("mailto") || url.startsWith("tel");
  const target = newTab ? "_blank" : "_self";
  const rel = newTab ? "noopener noreferrer" : void 0;
  if (isExternal)
    return /* @__PURE__ */ jsx(
      "a",
      {
        href: url,
        className: typeof className === "function" ? className({ isActive: false }) : className,
        target,
        rel,
        ...rest,
        children
      }
    );
  return /* @__PURE__ */ jsx(
    NavLink,
    {
      viewTransition: true,
      className,
      to: url,
      prefetch,
      preventScrollReset,
      target,
      rel,
      ...rest,
      children
    }
  );
};
const HeaderSideNav = ({ open, setOpen, activeSection }) => {
  const { headerNavigationItems: headerNavigationItems2 } = useSiteDetails();
  return /* @__PURE__ */ jsx(Transition.Root, { show: !!open, as: Fragment, children: /* @__PURE__ */ jsxs(Dialog, { as: "div", className: "relative z-50", onClose: () => setOpen(false), children: [
    /* @__PURE__ */ jsx(
      Transition.Child,
      {
        as: Fragment,
        enter: "ease-in-out duration-200",
        enterFrom: "opacity-0",
        enterTo: "opacity-100",
        leave: "ease-in-out duration-200",
        leaveFrom: "opacity-100",
        leaveTo: "opacity-0",
        children: /* @__PURE__ */ jsx("div", { className: "fixed inset-0 bg-gray-300 bg-opacity-50 backdrop-blur-sm transition-opacity" })
      }
    ),
    /* @__PURE__ */ jsx("div", { className: "fixed inset-0 overflow-hidden", children: /* @__PURE__ */ jsx("div", { className: "absolute inset-0 overflow-hidden", children: /* @__PURE__ */ jsx("div", { className: "pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10", children: /* @__PURE__ */ jsx(
      Transition.Child,
      {
        as: Fragment,
        enter: "transform transition ease-in-out duration-200",
        enterFrom: "translate-x-full",
        enterTo: "translate-x-0",
        leave: "transform transition ease-in-out duration-200",
        leaveFrom: "translate-x-0",
        leaveTo: "translate-x-full",
        children: /* @__PURE__ */ jsx(Dialog.Panel, { className: "pointer-events-auto w-screen max-w-md", children: /* @__PURE__ */ jsx("div", { className: "flex h-full flex-col overflow-y-scroll bg-white shadow-xl", children: /* @__PURE__ */ jsxs("div", { className: "flex-1 overflow-y-auto px-4 py-6 sm:px-6", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
            /* @__PURE__ */ jsx(Dialog.Title, { className: "text-lg font-bold text-gray-900", children: "Navigation" }),
            /* @__PURE__ */ jsx("div", { className: "ml-3 flex h-7 items-center", children: /* @__PURE__ */ jsx(
              IconButton,
              {
                icon: XMarkIcon,
                onClick: () => setOpen(false),
                className: "-m-2",
                "aria-label": "Close panel"
              }
            ) })
          ] }),
          !!(headerNavigationItems2 == null ? void 0 : headerNavigationItems2.length) && /* @__PURE__ */ jsx("div", { className: "flex flex-grow flex-col overflow-y-auto pb-4", children: /* @__PURE__ */ jsx("div", { className: "mt-5 flex flex-grow flex-col", children: /* @__PURE__ */ jsx("nav", { className: "flex-1 space-y-1", "aria-label": "Sidebar", children: headerNavigationItems2.map(({ id, new_tab, ...navItemProps }) => /* @__PURE__ */ jsx(
            URLAwareNavLink,
            {
              ...navItemProps,
              newTab: new_tab,
              onClick: () => setOpen(false),
              className: ({ isActive }) => clsx(
                "group flex items-center rounded-md px-4 py-3 text-sm font-normal",
                isActive && (!navItemProps.url.includes("#") || activeSection === navItemProps.url.split("#")[1].split("?")[0]) ? "bg-gray-100 text-gray-900" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              ),
              prefetch: "viewport",
              children: /* @__PURE__ */ jsx("span", { className: "flex-1", children: navItemProps.label })
            },
            id
          )) }) }) })
        ] }) }) })
      }
    ) }) }) })
  ] }) });
};
const useActiveSection = (navItems) => {
  if (typeof window === "undefined") return { activeSection: null };
  const [activeSection, setActiveSection] = useState(null);
  const localNavigationItems = navItems.filter((item) => item.url.includes("#"));
  const hasLocalNavigation = localNavigationItems.some((item) => {
    const id = item.url.split("#")[1].split("?")[0];
    return document.getElementById(id);
  });
  useEffect(() => {
    if (!hasLocalNavigation) return;
    const sections = localNavigationItems.map((item) => {
      const id = item.url.split("#")[1].split("?")[0];
      const element = document.getElementById(id);
      if (!element) return;
      return {
        id,
        element
      };
    }).filter((section) => section);
    const observer = new IntersectionObserver(
      (entries) => {
        const activeSection2 = entries.find(
          (entry2) => entry2.isIntersecting && entry2.boundingClientRect.top < window.innerHeight / 2
        );
        if (activeSection2) {
          setActiveSection(activeSection2.target.id);
        } else {
          setActiveSection(null);
        }
      },
      { threshold: [0, 1] }
    );
    sections.forEach((section) => {
      if (!section) return;
      observer.observe(section.element);
    });
    return () => {
      observer.disconnect();
    };
  }, [hasLocalNavigation, localNavigationItems]);
  return { activeSection };
};
const Header = () => {
  const [sideNavOpen, setSideNavOpen] = useState(false);
  const { headerNavigationItems: headerNavigationItems2 } = useSiteDetails();
  const { cart: cart2, toggleCartDrawer } = useCart();
  const { activeSection } = useActiveSection(headerNavigationItems2);
  const rootLoader = useRootLoaderData();
  const hasProducts = rootLoader == null ? void 0 : rootLoader.hasPublishedProducts;
  if (!headerNavigationItems2) return /* @__PURE__ */ jsx(Fragment$1, { children: "Loading..." });
  return /* @__PURE__ */ jsxs("header", { className: "sticky top-0 z-40 mkt-header bg-white mt-8", children: [
    /* @__PURE__ */ jsx("nav", { "aria-label": "Top", children: /* @__PURE__ */ jsx("div", { className: "bg-transparent", children: /* @__PURE__ */ jsx("div", { className: "", children: /* @__PURE__ */ jsxs(Container, { children: [
      hasProducts && /* @__PURE__ */ jsxs("div", { className: "-mb-2 flex w-full items-center justify-end gap-4 pt-2 sm:hidden", children: [
        /* @__PURE__ */ jsx(
          IconButton,
          {
            "aria-label": "open shopping cart",
            iconProps: {
              className: "!hover:bg-transparent hover:text-gray-700 focus:text-gray-700"
            },
            className: "!hover:bg-transparent hover:text-gray-700 focus:text-gray-700",
            icon: (iconProps) => /* @__PURE__ */ jsxs("div", { className: "relative", children: [
              /* @__PURE__ */ jsx(
                ShoppingCartIcon,
                {
                  ...iconProps,
                  className: clsx(
                    iconProps.className,
                    "hover:!bg-primary-50 focus:!bg-primary-50"
                  )
                }
              ),
              !!cart2 && hasProducts && cart2.items && cart2.items.length > 0 && /* @__PURE__ */ jsx("span", { className: "flex h-4 min-w-[1rem] items-center justify-center px-1 text-xs font-bold", children: /* @__PURE__ */ jsxs("span", { children: [
                cart2.items.reduce(
                  (acc, item) => acc + item.quantity,
                  0
                ),
                " ",
                /* @__PURE__ */ jsx("span", { className: "sr-only", children: "items in cart, view bag" })
              ] }) })
            ] }),
            onClick: () => toggleCartDrawer(true)
          }
        ),
        /* @__PURE__ */ jsx("div", { className: "flex-auto" })
      ] }),
      /* @__PURE__ */ jsx(
        "div",
        {
          className: clsx(
            "h-[var(--mkt-header-height)] flex sm:h-[var(--mkt-header-height-desktop)] flex-nowrap items-center justify-between gap-2 py-2 bg-white border-[4px] border-[#FFE977] rounded-full xl:px-[96px]"
          ),
          children: /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap-reverse justify-between w-full", children: [
            /* @__PURE__ */ jsx(LogoStoreName, { className: "xs:h-14 h-8", primary: true }),
            headerNavigationItems2 && /* @__PURE__ */ jsx(Fragment$1, { children: headerNavigationItems2.slice(0, 6).map(({ id, new_tab, ...navItemProps }, index) => /* @__PURE__ */ jsx(
              URLAwareNavLink,
              {
                ...navItemProps,
                newTab: new_tab,
                className: ({ isActive }) => clsx(
                  "my-4 flex items-center whitespace-nowrap font-normal font-body font-regular text-[24px] leading-none tracking-normal"
                ),
                prefetch: "viewport",
                children: navItemProps.label
              },
              id
            )) }),
            /* @__PURE__ */ jsx("div", { className: "flex items-center justify-end", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-x-3 text-sm", children: [
              /* @__PURE__ */ jsx(
                IconButton,
                {
                  "aria-label": "open shopping cart",
                  className: "hover:!bg-transparent hidden sm:mr-0.5 sm:inline-flex",
                  iconProps: {
                    className: "hover:!bg-transparent hover:text-gray-700 focus:text-gray-700"
                  },
                  icon: (iconProps) => /* @__PURE__ */ jsxs("div", { className: "relative", children: [
                    /* @__PURE__ */ jsx(
                      ShoppingCartIcon,
                      {
                        ...iconProps,
                        className: clsx(iconProps.className)
                      }
                    ),
                    !!cart2 && hasProducts && cart2.items && cart2.items.length > 0 && /* @__PURE__ */ jsx("span", { className: "absolute -top-1 left-full -ml-2 flex h-4 min-w-[1rem] items-center justify-center rounded-full px-1 text-xs font-bold", children: /* @__PURE__ */ jsxs("span", { children: [
                      cart2.items.reduce(
                        (acc, item) => acc + item.quantity,
                        0
                      ),
                      " ",
                      /* @__PURE__ */ jsx("span", { className: "sr-only", children: "items in cart, view bag" })
                    ] }) })
                  ] }),
                  onClick: () => toggleCartDrawer(true)
                }
              ),
              !!(headerNavigationItems2 == null ? void 0 : headerNavigationItems2.length) && /* @__PURE__ */ jsx(
                IconButton,
                {
                  "aria-label": "open navigation menu",
                  onClick: () => setSideNavOpen(true),
                  className: "hover:!bg-primary-50 focus:!bg-primary-50 sm:inline-flex text-white md:hidden",
                  icon: Bars3Icon
                }
              )
            ] }) })
          ] })
        }
      )
    ] }) }) }) }),
    /* @__PURE__ */ jsx(
      HeaderSideNav,
      {
        activeSection,
        open: sideNavOpen,
        setOpen: setSideNavOpen
      }
    )
  ] });
};
const cursorImg = "/assets/images/cursor.svg";
const Cursor = () => {
  const cursorRef = useRef(null);
  const shadowRef = useRef(null);
  const rippleRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const checkMobile = () => {
      const isMobileDevice = window.innerWidth <= 768 || // Tablet and below
      "ontouchstart" in window || // Touch device
      navigator.maxTouchPoints > 0 || // Touch device
      /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      setIsMobile(isMobileDevice);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);
  const mousePosition = useRef({ x: 0, y: 0 });
  const cursorPosition = useRef({ x: 0, y: 0 });
  const shadowPosition = useRef({ x: 0, y: 0 });
  const isHovering = useRef(false);
  const animationFrameId = useRef();
  const hoverAnimationId = useRef();
  const lerp = (start, end, factor) => {
    return start + (end - start) * factor;
  };
  const animateCursor = useCallback(() => {
    if (cursorRef.current && shadowRef.current) {
      cursorPosition.current.x = lerp(cursorPosition.current.x, mousePosition.current.x, 0.9);
      cursorPosition.current.y = lerp(cursorPosition.current.y, mousePosition.current.y, 0.9);
      shadowPosition.current.x = lerp(shadowPosition.current.x, mousePosition.current.x, 0.25);
      shadowPosition.current.y = lerp(shadowPosition.current.y, mousePosition.current.y, 0.25);
      const offsetX = isHovering.current ? 20 : 16;
      const offsetY = isHovering.current ? 20 : 16;
      const scale = isHovering.current ? 1.2 : 1;
      cursorRef.current.style.transform = `translate3d(${cursorPosition.current.x - offsetX}px, ${cursorPosition.current.y - offsetY}px, 0) scale(${scale})`;
      const shadowScale = isHovering.current ? 1.5 : 1;
      shadowRef.current.style.transform = `translate3d(${shadowPosition.current.x - offsetX}px, ${shadowPosition.current.y - offsetY}px, 0) scale(${shadowScale})`;
    }
    animationFrameId.current = requestAnimationFrame(animateCursor);
  }, []);
  const animateHover = useCallback(() => {
    if (cursorRef.current && shadowRef.current) {
      if (isHovering.current) {
        cursorRef.current.style.filter = "brightness(1.2) contrast(1.1)";
        shadowRef.current.style.opacity = "0.6";
        shadowRef.current.style.filter = "blur(12px)";
      } else {
        cursorRef.current.style.filter = "none";
        shadowRef.current.style.opacity = "0.8";
        shadowRef.current.style.filter = "blur(8px)";
      }
    }
  }, []);
  useEffect(() => {
    if (isMobile) return;
    const moveCursor = (e) => {
      mousePosition.current.x = e.clientX;
      mousePosition.current.y = e.clientY;
    };
    const handleMouseOver = (e) => {
      const target = e.target;
      const computedStyle = window.getComputedStyle(target);
      const cursor = computedStyle.cursor;
      const shouldBeHovering = cursor === "pointer" || target.tagName === "A" || target.tagName === "BUTTON" || typeof target.onclick === "function" || target.getAttribute("role") === "button" || target.closest("a") !== null || target.closest("button") !== null;
      if (shouldBeHovering !== isHovering.current) {
        isHovering.current = shouldBeHovering;
        animateHover();
      }
    };
    const handleClick = (e) => {
      if (rippleRef.current) {
        rippleRef.current.style.left = `${e.clientX}px`;
        rippleRef.current.style.top = `${e.clientY}px`;
        rippleRef.current.classList.remove("show");
        void rippleRef.current.offsetWidth;
        rippleRef.current.classList.add("show");
      }
      if (shadowRef.current) {
        const currentTransform = shadowRef.current.style.transform;
        const scale = isHovering.current ? 1.5 : 1;
        const offsetX = isHovering.current ? 20 : 16;
        const offsetY = isHovering.current ? 20 : 16;
        shadowRef.current.style.transform = `translate3d(${mousePosition.current.x - offsetX}px, ${mousePosition.current.y - offsetY}px, 0) scale(${scale * 2})`;
        shadowRef.current.style.opacity = "0.6";
        setTimeout(() => {
          if (shadowRef.current) {
            shadowRef.current.style.transform = currentTransform;
            shadowRef.current.style.opacity = isHovering.current ? "0.6" : "0.8";
          }
        }, 200);
      }
    };
    document.addEventListener("mousemove", moveCursor);
    document.addEventListener("mousemove", handleMouseOver);
    document.addEventListener("mousedown", handleClick);
    animationFrameId.current = requestAnimationFrame(animateCursor);
    document.body.style.cursor = "none";
    return () => {
      document.removeEventListener("mousemove", moveCursor);
      document.removeEventListener("mousemove", handleMouseOver);
      document.removeEventListener("mousedown", handleClick);
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
      if (hoverAnimationId.current) {
        cancelAnimationFrame(hoverAnimationId.current);
      }
      document.body.style.cursor = "";
    };
  }, [animateCursor, animateHover, isMobile]);
  if (isMobile) {
    return null;
  }
  return /* @__PURE__ */ jsxs(Fragment$1, { children: [
    /* @__PURE__ */ jsx(
      "div",
      {
        ref: shadowRef,
        style: {
          position: "fixed",
          left: 0,
          top: 0,
          pointerEvents: "none",
          width: 32,
          height: 32,
          transform: "translate3d(-100px, -100px, 0) scale(1)",
          willChange: "transform, opacity, filter",
          zIndex: 99999,
          opacity: 0.8,
          filter: "blur(8px)",
          transition: "opacity 0.3s cubic-bezier(.25,.46,.45,.94), filter 0.2s ease-out"
        },
        children: /* @__PURE__ */ jsx(
          "img",
          {
            src: cursorImg,
            width: 32,
            height: 32,
            style: {
              display: "block",
              width: "100%",
              height: "100%",
              mixBlendMode: "multiply"
            },
            draggable: false,
            alt: "cursor shadow"
          }
        )
      }
    ),
    /* @__PURE__ */ jsx(
      "div",
      {
        ref: cursorRef,
        style: {
          position: "fixed",
          left: 0,
          top: 0,
          pointerEvents: "none",
          width: 32,
          height: 32,
          transform: "translate3d(-100px, -100px, 0) scale(1)",
          willChange: "transform, filter",
          zIndex: 1e5,
          transition: "filter 0.2s ease-out"
        },
        children: /* @__PURE__ */ jsx(
          "img",
          {
            src: cursorImg,
            width: 32,
            height: 32,
            style: {
              display: "block",
              width: "100%",
              height: "100%",
              mixBlendMode: "normal"
            },
            draggable: false,
            alt: "cursor"
          }
        )
      }
    ),
    /* @__PURE__ */ jsx(
      "div",
      {
        ref: rippleRef,
        style: {
          position: "fixed",
          left: 0,
          top: 0,
          pointerEvents: "none",
          width: 0,
          height: 0,
          zIndex: 99999
        },
        className: "cursor-ripple"
      }
    ),
    /* @__PURE__ */ jsx("style", { children: `
        .cursor-ripple {
          position: fixed;
          border-radius: 50%;
          pointer-events: none;
          width: 0;
          height: 0;
          transform: translate(-50%, -50%);
        }
        .cursor-ripple.show {
          animation: cursor-ripple-burst 0.6s cubic-bezier(.25,.46,.45,.94);
        }
        @keyframes cursor-ripple-burst {
          0% {
            width: 0px;
            height: 0px;
            border: 2px solid rgba(0,0,0,0.3);
            opacity: 1;
          }
          50% {
            width: 60px;
            height: 60px;
            border: 1px solid rgba(0,0,0,0.2);
            opacity: 0.5;
          }
          100% {
            width: 120px;
            height: 120px;
            border: 0.5px solid rgba(0,0,0,0);
            opacity: 0;
          }
        }
      ` })
  ] });
};
const DEFAULT_CONFIG = {
  facebook: "https://www.facebook.com/your-page",
  zalo: "https://zalo.me/your-phone-number"
};
const LiveChatIcon = memo(({
  config: config2 = DEFAULT_CONFIG,
  className = ""
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const mergedConfig = { ...DEFAULT_CONFIG, ...config2 };
  const handleToggle = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);
  const handleSocialClick = useCallback((url) => {
    if (url) {
      window.open(url, "_blank", "noreferrer");
    }
  }, []);
  const handleClickOutside = useCallback(() => {
    setIsOpen(false);
  }, []);
  return /* @__PURE__ */ jsxs("div", { className: `fixed bottom-6 left-6 z-50 ${className}`, children: [
    isOpen && /* @__PURE__ */ jsxs("div", { className: "absolute bottom-20 right-0 flex flex-col gap-3 mb-2 z-50", children: [
      mergedConfig.facebook && /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => handleSocialClick(mergedConfig.facebook),
          className: "transition-all duration-300 transform hover:scale-110 flex items-center justify-center",
          "aria-label": "Chat on Facebook",
          title: "Chat on Facebook",
          children: /* @__PURE__ */ jsx("img", { src: "/assets/images/facebook.png", alt: "Facebook", className: "w-16 h-16" })
        }
      ),
      mergedConfig.zalo && /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => handleSocialClick(mergedConfig.zalo),
          className: "transition-all duration-300 transform hover:scale-110 flex items-center justify-center",
          "aria-label": "Chat on Zalo",
          title: "Chat on Zalo",
          children: /* @__PURE__ */ jsx("img", { src: "/assets/images/zalo.png", alt: "Zalo", className: "w-16 h-16" })
        }
      )
    ] }),
    /* @__PURE__ */ jsx(
      "button",
      {
        onClick: handleToggle,
        className: "bg-primary hover:bg-primary/80 text-white rounded-tl-full rounded-br-full rounded-tr-full p-2 shadow-lg transition-all duration-300 transform hover:scale-110 flex items-center justify-center relative",
        "aria-label": "Open chat",
        title: "Open chat",
        children: /* @__PURE__ */ jsx("span", { children: /* @__PURE__ */ jsx("img", { src: "/assets/images/livechat.gif", alt: "Chat", className: "w-12 h-12" }) })
      }
    ),
    isOpen && /* @__PURE__ */ jsx(
      "div",
      {
        className: "fixed inset-0 z-40 bg-black bg-opacity-50",
        onClick: handleClickOutside
      }
    )
  ] });
});
LiveChatIcon.displayName = "LiveChatIcon";
const Page = ({ className, children }) => {
  const hiddenHeaderPaths = ["/", "/pick-a-card", "/stories"];
  const hiddenFooterPaths = ["/", "/pick-a-card", "/", "/stories", "/products"];
  const matches = useMatches();
  const currentMatch = matches[matches.length - 1];
  const isHiddenHeader = hiddenHeaderPaths.includes((currentMatch == null ? void 0 : currentMatch.pathname) || "");
  const isHiddenFooter = hiddenFooterPaths.includes((currentMatch == null ? void 0 : currentMatch.pathname) || "");
  const { toggleCartDrawer } = useCart();
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: clsx(
        "page-layout flex min-h-screen flex-col bg-white",
        className
      ),
      children: [
        /* @__PURE__ */ jsx(Cursor, {}),
        /* @__PURE__ */ jsx(CartDrawer, {}),
        !isHiddenHeader && /* @__PURE__ */ jsx(Header, {}),
        /* @__PURE__ */ jsx("main", { className: "flex-auto", children: /* @__PURE__ */ jsx("div", { className: "w-full", children }) }),
        !isHiddenFooter && /* @__PURE__ */ jsx(Footer, {}),
        !isHiddenHeader && /* @__PURE__ */ jsxs(Fragment$1, { children: [
          /* @__PURE__ */ jsx(
            LiveChatIcon,
            {
              config: {
                facebook: "https://m.me/@kiraparfum",
                zalo: "https://zalo.me/your-phone-number"
              }
            }
          ),
          /* @__PURE__ */ jsx("div", { className: "fixed bottom-6 right-6 z-50", children: /* @__PURE__ */ jsx("button", { onClick: () => toggleCartDrawer(true), className: "transition-all duration-300 transform hover:scale-110 flex items-center justify-center", children: /* @__PURE__ */ jsx("span", { children: /* @__PURE__ */ jsx("img", { src: "/assets/images/cart.svg", alt: "Chat", className: "w-24 h-24" }) }) }) })
        ] })
      ]
    }
  );
};
const common$1 = {
  home: "Home",
  about: "About",
  products: "Products",
  contact: "Contact",
  cart: "Cart",
  checkout: "Checkout",
  search: "Search",
  menu: "Menu",
  close: "Close",
  loading: "Loading...",
  error: "Error",
  success: "Success",
  cancel: "Cancel",
  save: "Save",
  edit: "Edit",
  "delete": "Delete",
  add: "Add",
  remove: "Remove",
  quantity: "Quantity",
  price: "Price",
  total: "Total",
  subtotal: "Subtotal",
  shipping: "Shipping",
  tax: "Tax",
  discount: "Discount",
  free: "Free",
  outOfStock: "Out of Stock",
  inStock: "In Stock",
  addToCart: "Add to Cart",
  viewCart: "View Cart",
  continueShopping: "Continue Shopping",
  proceedToCheckout: "Proceed to Checkout",
  backToProducts: "Back to Products",
  newsletter: "Newsletter",
  subscribe: "Subscribe",
  email: "Email",
  firstName: "First Name",
  lastName: "Last Name",
  phone: "Phone",
  address: "Address",
  city: "City",
  state: "State",
  zipCode: "Zip Code",
  country: "Country",
  language: "Language",
  currency: "Currency",
  region: "Region"
};
const navigation$1 = {
  home: "Home",
  products: "Products",
  categories: "Categories",
  about: "About Us",
  contact: "Contact",
  account: "Account",
  login: "Login",
  logout: "Logout",
  register: "Register"
};
const hero$1 = {
  title: "BARRIO",
  subtitle: "COFFEE & COMMUNITY",
  description: "Discover our artisan-roasted coffee, crafted with care and delivered to your door. At Barrio, we're more than a coffee roastery—we're a neighborhood."
};
const footer$1 = {
  company: "Company",
  support: "Support",
  legal: "Legal",
  followUs: "Follow Us",
  newsletter: "Subscribe to our newsletter",
  newsletterDescription: "Get the latest updates on new products and upcoming sales",
  allRightsReserved: "All rights reserved"
};
const product$1 = {
  details: "Product Details",
  description: "Description",
  specifications: "Specifications",
  reviews: "Reviews",
  relatedProducts: "Related Products",
  addToWishlist: "Add to Wishlist",
  share: "Share",
  availability: "Availability",
  sku: "SKU",
  category: "Category",
  tags: "Tags"
};
const cart$1 = {
  title: "Shopping Cart",
  empty: "Your cart is empty",
  item: "Item",
  items: "Items",
  update: "Update Cart",
  clear: "Clear Cart",
  estimatedTotal: "Estimated Total",
  shippingCalculated: "Shipping calculated at checkout"
};
const checkout$1 = {
  title: "Checkout",
  shippingAddress: "Shipping Address",
  billingAddress: "Billing Address",
  shippingMethod: "Shipping Method",
  paymentMethod: "Payment Method",
  orderSummary: "Order Summary",
  placeOrder: "Place Order",
  processing: "Processing...",
  orderConfirmation: "Order Confirmation",
  thankYou: "Thank you for your order!",
  orderNumber: "Order Number"
};
const shop$1 = "EAU DE PARFUM";
const home$1 = {
  "default": {
    description: "Kira was born as a joyful sparkling fragrance, capturing the very essence of sunshine and laughter in every delicate spritz. Like a playful breeze on a warm day, our scents effortlessly invigorate the spirit, infusing the air with a sense of lightness and elegance. Our scents invigorate the spirit and celebrate life's vibrant moments."
  },
  a: {
    description: "Each bottle is a portal to a realm where happiness is not just a fleeting emotion, but a scent that clings to you like a whispered dream, an invisible symphony you carry with you through every step, every breath."
  },
  i: {
    description: "Each of Kira's fragrances invites you to imagine life's most vibrant moments—spontaneous bursts of joy that remind us to embrace the present."
  },
  k: {
    description: "Kira's products are cruelty free, neither the completed product nor its ingredients have ever been tested on animals."
  },
  r: {
    description: "Kira is a shimmering burst of light, an alchemy of sunshine and laughter, woven into each delicate spritz—an ethereal dance of joy that lingers like a memory of the sun's warm embrace."
  }
};
const en = {
  common: common$1,
  navigation: navigation$1,
  hero: hero$1,
  footer: footer$1,
  product: product$1,
  cart: cart$1,
  checkout: checkout$1,
  shop: shop$1,
  home: home$1
};
const common = {
  home: "Trang chủ",
  about: "Giới thiệu",
  products: "Sản phẩm",
  contact: "Liên hệ",
  cart: "Giỏ hàng",
  checkout: "Thanh toán",
  search: "Tìm kiếm",
  menu: "Menu",
  close: "Đóng",
  loading: "Đang tải...",
  error: "Lỗi",
  success: "Thành công",
  cancel: "Hủy",
  save: "Lưu",
  edit: "Chỉnh sửa",
  "delete": "Xóa",
  add: "Thêm",
  remove: "Xóa",
  quantity: "Số lượng",
  price: "Giá",
  total: "Tổng cộng",
  subtotal: "Tạm tính",
  shipping: "Phí vận chuyển",
  tax: "Thuế",
  discount: "Giảm giá",
  free: "Miễn phí",
  outOfStock: "Hết hàng",
  inStock: "Còn hàng",
  addToCart: "Thêm vào giỏ",
  viewCart: "Xem giỏ hàng",
  continueShopping: "Tiếp tục mua sắm",
  proceedToCheckout: "Tiến hành thanh toán",
  backToProducts: "Quay lại sản phẩm",
  newsletter: "Bản tin",
  subscribe: "Đăng ký",
  email: "Email",
  firstName: "Tên",
  lastName: "Họ",
  phone: "Điện thoại",
  address: "Địa chỉ",
  city: "Thành phố",
  state: "Tỉnh/Thành",
  zipCode: "Mã bưu điện",
  country: "Quốc gia",
  language: "Ngôn ngữ",
  currency: "Tiền tệ",
  region: "Khu vực"
};
const navigation = {
  home: "Trang chủ",
  products: "Sản phẩm",
  categories: "Danh mục",
  about: "Giới thiệu",
  contact: "Liên hệ",
  account: "Tài khoản",
  login: "Đăng nhập",
  logout: "Đăng xuất",
  register: "Đăng ký"
};
const hero = {
  title: "BARRIO",
  subtitle: "CÀ PHÊ & CỘNG ĐỒNG",
  description: "Khám phá cà phê rang thủ công của chúng tôi, được chế tác tỉ mỉ và giao tận nơi. Tại Barrio, chúng tôi không chỉ là một cơ sở rang cà phê—chúng tôi là một cộng đồng."
};
const footer = {
  company: "Công ty",
  support: "Hỗ trợ",
  legal: "Pháp lý",
  followUs: "Theo dõi chúng tôi",
  newsletter: "Đăng ký nhận bản tin",
  newsletterDescription: "Nhận thông tin cập nhật mới nhất về sản phẩm và khuyến mãi",
  allRightsReserved: "Bảo lưu mọi quyền"
};
const product = {
  details: "Chi tiết sản phẩm",
  description: "Mô tả",
  specifications: "Thông số kỹ thuật",
  reviews: "Đánh giá",
  relatedProducts: "Sản phẩm liên quan",
  addToWishlist: "Thêm vào yêu thích",
  share: "Chia sẻ",
  availability: "Tình trạng",
  sku: "Mã sản phẩm",
  category: "Danh mục",
  tags: "Thẻ"
};
const cart = {
  title: "Giỏ hàng",
  empty: "Giỏ hàng của bạn đang trống",
  item: "Sản phẩm",
  items: "Sản phẩm",
  update: "Cập nhật giỏ hàng",
  clear: "Xóa giỏ hàng",
  estimatedTotal: "Tổng ước tính",
  shippingCalculated: "Phí vận chuyển được tính khi thanh toán"
};
const checkout = {
  title: "Thanh toán",
  shippingAddress: "Địa chỉ giao hàng",
  billingAddress: "Địa chỉ thanh toán",
  shippingMethod: "Phương thức vận chuyển",
  paymentMethod: "Phương thức thanh toán",
  orderSummary: "Tóm tắt đơn hàng",
  placeOrder: "Đặt hàng",
  processing: "Đang xử lý...",
  orderConfirmation: "Xác nhận đơn hàng",
  thankYou: "Cảm ơn bạn đã đặt hàng!",
  orderNumber: "Số đơn hàng"
};
const shop = "Cửa hàng nước hoa";
const home = {
  "default": {
    description: "Kira ra đời như một hương thơm vui tươi rực rỡ, nắm bắt được bản chất của ánh nắng và tiếng cười trong mỗi lần xịt tinh tế. Như một cơn gió vui đùa trong ngày ấm áp, hương thơm của chúng tôi dễ dàng làm sống lại tinh thần, lan tỏa không khí với cảm giác nhẹ nhàng và thanh lịch. Hương thơm của chúng tôi làm sống lại tinh thần và tôn vinh những khoảnh khắc sôi động của cuộc sống."
  },
  a: {
    description: "Mỗi chai là một cánh cổng đến một thế giới nơi hạnh phúc không chỉ là một cảm xúc thoáng qua, mà là một hương thơm bám lấy bạn như một giấc mơ thì thầm, một bản giao hưởng vô hình bạn mang theo qua mỗi bước đi, mỗi hơi thở."
  },
  i: {
    description: "Mỗi hương thơm của Kira mời bạn tưởng tượng về những khoảnh khắc sôi động nhất của cuộc sống—những bùng nổ vui vẻ tự phát nhắc nhở chúng ta hãy trân trọng hiện tại."
  },
  k: {
    description: "Sản phẩm của Kira không thử nghiệm trên động vật, cả sản phẩm hoàn chỉnh và thành phần của nó chưa bao giờ được thử nghiệm trên động vật."
  },
  r: {
    description: "Kira là một vụ nổ ánh sáng lấp lánh, một phép thuật của ánh nắng và tiếng cười, dệt vào mỗi lần xịt tinh tế—một điệu nhảy tinh thần của niềm vui tồn tại như một kỷ niệm về cái ôm ấm áp của mặt trời."
  }
};
const vi = {
  common,
  navigation,
  hero,
  footer,
  product,
  cart,
  checkout,
  shop,
  home
};
const defaultNS = "translation";
const resources = {
  en: {
    translation: en
  },
  vi: {
    translation: vi
  }
};
const supportedLanguages = ["en", "vi"];
const isBrowser$1 = typeof window !== "undefined";
if (isBrowser$1) {
  i18n.use(LanguageDetector);
}
i18n.init({
  debug: process.env.NODE_ENV === "development",
  fallbackLng: "en",
  defaultNS,
  ns: [defaultNS],
  resources,
  supportedLngs: supportedLanguages,
  lng: "en",
  // Set default language explicitly
  interpolation: {
    escapeValue: false
  },
  // Only provide detection config on the client
  detection: isBrowser$1 ? {
    order: ["localStorage", "navigator", "htmlTag"],
    caches: ["localStorage"],
    lookupLocalStorage: "i18nextLng"
  } : void 0
});
i18n.use(initReactI18next);
const I18nProvider = ({ children }) => {
  return /* @__PURE__ */ jsx(I18nextProvider, { i18n, children });
};
const RootProviders = ({ children }) => /* @__PURE__ */ jsx(I18nProvider, { children: /* @__PURE__ */ jsx(StorefrontProvider, { data: storefrontInitialState, children }) });
const getRootMeta = ({
  data: data2
}) => {
  const title = "Barrio Store";
  const description = "Discover our artisan-roasted coffee, crafted with care and delivered to your door.";
  const ogTitle = title;
  const ogDescription = description;
  const ogImage = "";
  const ogImageAlt = !!ogImage ? `${ogTitle} logo` : void 0;
  return [{
    title
  }, {
    name: "description",
    content: description
  }, {
    property: "og:title",
    content: ogTitle
  }, {
    property: "og:description",
    content: ogDescription
  }, {
    property: "og:image",
    content: ogImage
  }, {
    property: "og:image:alt",
    content: ogImageAlt
  }];
};
const meta$3 = mergeMeta(getCommonMeta, getRootMeta);
const loader$k = getRootLoader;
const shouldRevalidate = ({
  actionResult,
  currentParams,
  currentUrl,
  defaultShouldRevalidate,
  formAction,
  formData,
  formEncType,
  formMethod,
  nextParams,
  nextUrl
}) => {
  if (nextUrl.pathname.startsWith("/checkout/success")) return true;
  if (!formMethod || formMethod === "GET") return false;
  return defaultShouldRevalidate;
};
function App() {
  var _a;
  const headRef = useRef(null);
  const data2 = useRootLoaderData();
  const {
    env = {},
    siteDetails
  } = data2 || {};
  return /* @__PURE__ */ jsx(RootProviders, {
    children: /* @__PURE__ */ jsxs("html", {
      lang: "en",
      className: "min-h-screen",
      children: [/* @__PURE__ */ jsxs("head", {
        ref: headRef,
        children: [/* @__PURE__ */ jsx("meta", {
          charSet: "UTF-8"
        }), /* @__PURE__ */ jsx(Meta, {}), /* @__PURE__ */ jsx("link", {
          rel: "preconnect",
          href: "https://fonts.googleapis.com"
        }), /* @__PURE__ */ jsx("link", {
          rel: "preconnect",
          href: "https://fonts.gstatic.com",
          crossOrigin: "anonymous"
        }), /* @__PURE__ */ jsx("link", {
          href: "https://fonts.googleapis.com/css2?family=Alexandria:wght@100..900&display=swap",
          rel: "stylesheet"
        }), /* @__PURE__ */ jsx("link", {
          href: "https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap",
          rel: "stylesheet"
        }), /* @__PURE__ */ jsx(Links, {}), ((_a = siteDetails == null ? void 0 : siteDetails.settings) == null ? void 0 : _a.description) && /* @__PURE__ */ jsx("meta", {
          name: "description",
          content: siteDetails.settings.description
        })]
      }), /* @__PURE__ */ jsxs("body", {
        className: "min-h-screen",
        children: [/* @__PURE__ */ jsx(Page, {
          children: /* @__PURE__ */ jsx(Outlet, {})
        }), /* @__PURE__ */ jsx("script", {
          dangerouslySetInnerHTML: {
            __html: `window.ENV = ${JSON.stringify(env)}`
          }
        }), /* @__PURE__ */ jsx(ScrollRestoration, {}), /* @__PURE__ */ jsx(Scripts, {})]
      })]
    })
  });
}
const root = UNSAFE_withComponentProps(App);
const ErrorBoundary = UNSAFE_withErrorBoundaryProps(function ErrorBoundary2() {
  const error = useRouteError();
  console.error("error boundary error", error);
  return /* @__PURE__ */ jsxs("html", {
    children: [/* @__PURE__ */ jsxs("head", {
      children: [/* @__PURE__ */ jsx("title", {
        children: "Oh no!"
      }), /* @__PURE__ */ jsx(Meta, {}), /* @__PURE__ */ jsx(Links, {})]
    }), /* @__PURE__ */ jsx("body", {
      children: /* @__PURE__ */ jsx(Scripts, {})
    })]
  });
});
const route0 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  ErrorBoundary,
  default: root,
  getRootMeta,
  loader: loader$k,
  meta: meta$3,
  shouldRevalidate
}, Symbol.toStringTag, { value: "Module" }));
const appleDomainContent = "7B227073704964223A2239373943394538343346343131343044463144313834343232393232313734313034353044314339464446394437384337313531303944334643463542433731222C2276657273696F6E223A312C22637265617465644F6E223A313731353230333737303832312C227369676E6174757265223A223330383030363039326138363438383666373064303130373032613038303330383030323031303133313064333030623036303936303836343830313635303330343032303133303830303630393261383634383836663730643031303730313030303061303830333038323033653333303832303338386130303330323031303230323038313636333463386230653330353731373330306130363038326138363438636533643034303330323330376133313265333032633036303335353034303330633235343137303730366336353230343137303730366336393633363137343639366636653230343936653734363536373732363137343639366636653230343334313230326432303437333333313236333032343036303335353034306230633164343137303730366336353230343336353732373436393636363936333631373436393666366532303431373537343638366637323639373437393331313333303131303630333535303430613063306134313730373036633635323034393665363332653331306233303039303630333535303430363133303235353533333031653137306433323334333033343332333933313337333433373332333735613137306433323339333033343332333833313337333433373332333635613330356633313235333032333036303335353034303330633163363536333633326437333664373032643632373236663662363537323264373336393637366535663535343333343264353035323466343433313134333031323036303335353034306230633062363934663533323035333739373337343635366437333331313333303131303630333535303430613063306134313730373036633635323034393665363332653331306233303039303630333535303430363133303235353533333035393330313330363037326138363438636533643032303130363038326138363438636533643033303130373033343230303034633231353737656465626436633762323231386636386464373039306131323138646337623062643666326332383364383436303935643934616634613534313162383334323065643831316633343037653833333331663163353463336637656233323230643662616435643465666634393238393839336537633066313361333832303231313330383230323064333030633036303335353164313330313031666630343032333030303330316630363033353531643233303431383330313638303134323366323439633434663933653465663237653663346636323836633366613262626664326534623330343530363038326230363031303530353037303130313034333933303337333033353036303832623036303130353035303733303031383632393638373437343730336132663266366636333733373032653631373037303663363532653633366636643266366636333733373033303334326436313730373036633635363136393633363133333330333233303832303131643036303335353164323030343832303131343330383230313130333038323031306330363039326138363438383666373633363430353031333038316665333038316333303630383262303630313035303530373032303233303831623630633831623335323635366336393631366536333635323036663665323037343638363937333230363336353732373436393636363936333631373436353230363237393230363136653739323037303631373237343739323036313733373337353664363537333230363136333633363537303734363136653633363532303666363632303734363836353230373436383635366532303631373037303663363936333631363236633635323037333734363136653634363137323634323037343635373236643733323036313665363432303633366636653634363937343639366636653733323036663636323037353733363532633230363336353732373436393636363936333631373436353230373036663663363936333739323036313665363432303633363537323734363936363639363336313734363936663665323037303732363136333734363936333635323037333734363137343635366436353665373437333265333033363036303832623036303130353035303730323031313632613638373437343730336132663266373737373737326536313730373036633635326536333666366432663633363537323734363936363639363336313734363536313735373436383666373236393734373932663330333430363033353531643166303432643330326233303239613032376130323538363233363837343734373033613266326636333732366332653631373037303663363532653633366636643266363137303730366336353631363936333631333332653633373236633330316430363033353531643065303431363034313439343537646236666435373438313836383938393736326637653537383530376537396235383234333030653036303335353164306630313031666630343034303330323037383033303066303630393261383634383836663736333634303631643034303230353030333030613036303832613836343863653364303430333032303334393030333034363032323130306336663032336362323631346262333033383838613136323938336531613933663130353666353066613738636462396261346361323431636331346532356530323231303062653363643064666431363234376636343934343735333830653964343463323238613130383930613361316463373234623862346362383838393831386263333038323032656533303832303237356130303330323031303230323038343936643266626633613938646139373330306130363038326138363438636533643034303330323330363733313162333031393036303335353034303330633132343137303730366336353230353236663666373432303433343132303264323034373333333132363330323430363033353530343062306331643431373037303663363532303433363537323734363936363639363336313734363936663665323034313735373436383666373236393734373933313133333031313036303335353034306130633061343137303730366336353230343936653633326533313062333030393036303335353034303631333032353535333330316531373064333133343330333533303336333233333334333633333330356131373064333233393330333533303336333233333334333633333330356133303761333132653330326330363033353530343033306332353431373037303663363532303431373037303663363936333631373436393666366532303439366537343635363737323631373436393666366532303433343132303264323034373333333132363330323430363033353530343062306331643431373037303663363532303433363537323734363936363639363336313734363936663665323034313735373436383666373236393734373933313133333031313036303335353034306130633061343137303730366336353230343936653633326533313062333030393036303335353034303631333032353535333330353933303133303630373261383634386365336430323031303630383261383634386365336430333031303730333432303030346630313731313834313964373634383564353161356532353831303737366538383061326566646537626165346465303864666334623933653133333536643536363562333561653232643039373736306432323465376262613038666437363137636538386362373662623636373062656338653832393834666635343435613338316637333038316634333034363036303832623036303130353035303730313031303433613330333833303336303630383262303630313035303530373330303138363261363837343734373033613266326636663633373337303265363137303730366336353265363336663664326636663633373337303330333432643631373037303663363537323666366637343633363136373333333031643036303335353164306530343136303431343233663234396334346639336534656632376536633466363238366333666132626266643265346233303066303630333535316431333031303166663034303533303033303130316666333031663036303335353164323330343138333031363830313462626230646561313538333338383961613438613939646562656264656261666461636232346162333033373036303335353164316630343330333032653330326361303261613032383836323636383734373437303361326632663633373236633265363137303730366336353265363336663664326636313730373036633635373236663666373436333631363733333265363337323663333030653036303335353164306630313031666630343034303330323031303633303130303630613261383634383836663736333634303630323065303430323035303033303061303630383261383634386365336430343033303230333637303033303634303233303361636637323833353131363939623138366662333563333536636136326266663431376564643930663735346461323865626566313963383135653432623738396638393866373962353939663938643534313064386639646539633266653032333033323264643534343231623061333035373736633564663333383362393036376664313737633263323136643936346663363732363938323132366635346638376137643162393963623962303938393231363130363939306630393932316430303030333138323031383833303832303138343032303130313330383138363330376133313265333032633036303335353034303330633235343137303730366336353230343137303730366336393633363137343639366636653230343936653734363536373732363137343639366636653230343334313230326432303437333333313236333032343036303335353034306230633164343137303730366336353230343336353732373436393636363936333631373436393666366532303431373537343638366637323639373437393331313333303131303630333535303430613063306134313730373036633635323034393665363332653331306233303039303630333535303430363133303235353533303230383136363334633862306533303537313733303062303630393630383634383031363530333034303230316130383139333330313830363039326138363438383666373064303130393033333130623036303932613836343838366637306430313037303133303163303630393261383634383836663730643031303930353331306631373064333233343330333533303338333233313332333933333330356133303238303630393261383634383836663730643031303933343331316233303139333030623036303936303836343830313635303330343032303161313061303630383261383634386365336430343033303233303266303630393261383634383836663730643031303930343331323230343230333232323236336439393239313365333235663163306437643761363331346230343535303337343561363032346633633930313232366166333530626332653330306130363038326138363438636533643034303330323034343733303435303232303537386536353236623062356233306465323562346231343865366632336530626438383631353335613666623865633461396465373338343333633262653530323231303062653834323635333334393162303965376330306437333565323762643865623236373964653462366433613138666434636564386261376565306166383161303030303030303030303030227D";
const loader$j = async ({
  request
}) => {
  return new Response(appleDomainContent, {
    status: 200,
    headers: {
      "Content-Type": "text/plain"
    }
  });
};
const route1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  loader: loader$j
}, Symbol.toStringTag, { value: "Module" }));
const removeDiscountCodeSchema = z$1.object({
  cartId: z$1.string(),
  code: z$1.string().min(1, "Discount code is required")
});
async function action$d(actionArgs) {
  var _a;
  const {
    errors,
    data: data$1
  } = await getValidatedFormData(actionArgs.request, zodResolver(removeDiscountCodeSchema));
  if (errors) {
    return data({
      errors
    }, {
      status: 400
    });
  }
  const cart2 = await retrieveCart(actionArgs.request);
  const promoCodes = (_a = cart2 == null ? void 0 : cart2.promotions) == null ? void 0 : _a.filter((promo) => promo.code !== data$1.code).map((promo) => promo.code);
  const {
    cart: updatedCart
  } = await sdk.store.cart.update(data$1.cartId, {
    promo_codes: promoCodes || []
  });
  if (!updatedCart) {
    return data({
      errors: {
        root: {
          message: "Could not remove promo code."
        }
      }
    }, {
      status: 400
    });
  }
  return data({
    cart: updatedCart
  });
}
const route2 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  action: action$d,
  removeDiscountCodeSchema
}, Symbol.toStringTag, { value: "Module" }));
const listCartShippingOptions = async (cartId) => {
  return sdk.store.fulfillment.listCartOptions({ cart_id: cartId }).then(({ shipping_options }) => shipping_options).catch(() => []);
};
const shippingMethodsSchema = z$1.object({
  cartId: z$1.string(),
  shippingOptionIds: z$1.array(z$1.string())
});
async function action$c(actionArgs) {
  const {
    errors,
    data: data$1
  } = await getValidatedFormData(actionArgs.request, zodResolver(shippingMethodsSchema));
  if (errors) {
    return data({
      errors
    }, {
      status: 400
    });
  }
  const shippingOptions = await listCartShippingOptions(data$1.cartId);
  const validShippingOptionIds = data$1.shippingOptionIds.filter((id) => shippingOptions.some((option) => option.id === id));
  if (validShippingOptionIds.length === 0) {
    return data({
      errors: {
        root: {
          message: "No valid shipping options selected"
        }
      }
    }, {
      status: 400
    });
  }
  await Promise.all(validShippingOptionIds.map(async (id) => await setShippingMethod(actionArgs.request, {
    cartId: data$1.cartId,
    shippingOptionId: id
  })));
  const updatedCart = (await updateCart(actionArgs.request, {})).cart;
  await initiatePaymentSession(actionArgs.request, updatedCart, {
    provider_id: "pp_paypal_paypal"
  });
  const cart2 = await retrieveCart(actionArgs.request);
  return data({
    cart: cart2
  });
}
const route3 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  action: action$c,
  shippingMethodsSchema
}, Symbol.toStringTag, { value: "Module" }));
const isBrowser = typeof window !== "undefined";
const getPreviousEnabled = (currentPage) => currentPage > 0;
const getNextEnabled = (currentPage, totalPages) => currentPage + 1 < totalPages;
const getTotalPages = (totalItems, pageSize) => Math.ceil(totalItems / pageSize);
const getStartIndex = (pageSize, currentPage) => pageSize * currentPage;
const getEndIndex = (pageSize, currentPage, totalItems) => {
  const lastPageEndIndex = pageSize * (currentPage + 1);
  if (lastPageEndIndex > totalItems) {
    return totalItems - 1;
  }
  return lastPageEndIndex - 1;
};
const limitPageBounds = (totalItems, pageSize) => (page) => Math.min(Math.max(page, 0), getTotalPages(totalItems, pageSize) - 1);
const getPaginationMeta = ({ totalItems, pageSize, currentPage }) => {
  const totalPages = getTotalPages(totalItems, pageSize);
  return {
    totalPages,
    startIndex: getStartIndex(pageSize, currentPage),
    endIndex: getEndIndex(pageSize, currentPage, totalItems),
    previousEnabled: getPreviousEnabled(currentPage),
    nextEnabled: getNextEnabled(currentPage, totalPages)
  };
};
const getCurrentPageReducer = (rootState) => function currentPageReducer(state, action2) {
  switch (action2.type) {
    case "SET_PAGE":
      return limitPageBounds(rootState.totalItems, rootState.pageSize)(action2.page);
    case "NEXT_PAGE":
      return limitPageBounds(rootState.totalItems, rootState.pageSize)(state + 1);
    case "PREVIOUS_PAGE":
      return limitPageBounds(rootState.totalItems, rootState.pageSize)(state - 1);
    case "SET_PAGESIZE":
      return limitPageBounds(rootState.totalItems, action2.pageSize)(action2.nextPage ?? state);
    case "SET_TOTALITEMS":
      return limitPageBounds(action2.totalItems, rootState.pageSize)(action2.nextPage ?? state);
    default:
      return state;
  }
};
function totalItemsReducer(state, action2) {
  switch (action2.type) {
    case "SET_TOTALITEMS":
      return action2.totalItems;
    default:
      return state;
  }
}
function pageSizeReducer(state, action2) {
  switch (action2.type) {
    case "SET_PAGESIZE":
      return action2.pageSize;
    default:
      return state;
  }
}
function paginationStateReducer(state, action2) {
  return {
    currentPage: getCurrentPageReducer(state)(state.currentPage, action2),
    totalItems: totalItemsReducer(state.totalItems, action2),
    pageSize: pageSizeReducer(state.pageSize, action2)
  };
}
function usePagination({
  totalItems = 0,
  initialPage = 0,
  initialPageSize = 0
} = {}) {
  const initialState = {
    totalItems,
    pageSize: initialPageSize,
    currentPage: initialPage
  };
  const [paginationState, dispatch] = useReducer(paginationStateReducer, initialState);
  const totalItemsRef = useRef(totalItems);
  totalItemsRef.current = totalItems;
  useEffect(() => {
    return () => {
      if (typeof totalItemsRef.current !== "number" || totalItems === totalItemsRef.current) {
        return;
      }
      dispatch({ type: "SET_TOTALITEMS", totalItems: totalItemsRef.current });
    };
  }, [totalItems]);
  return {
    ...paginationState,
    ...useMemo(() => getPaginationMeta(paginationState), [paginationState]),
    setPage: useCallback((page) => {
      dispatch({
        type: "SET_PAGE",
        page
      });
    }, []),
    setNextPage: useCallback(() => {
      dispatch({ type: "NEXT_PAGE" });
    }, []),
    setPreviousPage: useCallback(() => {
      dispatch({ type: "PREVIOUS_PAGE" });
    }, []),
    setPageSize: useCallback((pageSize, nextPage = 0) => {
      dispatch({ type: "SET_PAGESIZE", pageSize, nextPage });
    }, [])
  };
}
const PaginationItem = ({ className, currentPage, page, ...props }) => {
  const currentClasses = "z-10 text-primary";
  const defaultClasses = "text-gray-500 hover:bg-gray-50";
  const isCurrent = page === currentPage;
  return /* @__PURE__ */ jsx(
    Link,
    {
      viewTransition: true,
      className: clsx(
        className,
        "relative inline-flex items-center px-4 py-2 text-sm font-bold",
        isCurrent ? currentClasses : defaultClasses
      ),
      "aria-current": isCurrent ? "page" : "false",
      to: props.href,
      prefetch: "viewport",
      children: page
    }
  );
};
const PaginationButton = ({
  currentPage: _currentPage,
  className: _className,
  isDisabled,
  href,
  children
}) => {
  const className = clsx(
    _className,
    { "pointer-events-none cursor-not-allowed opacity-50": isDisabled },
    "relative inline-flex items-center bg-white px-2 py-2 text-sm font-bold text-gray-500 hover:bg-gray-50 sm:px-4"
  );
  if (isDisabled)
    return /* @__PURE__ */ jsx("button", { "aria-disabled": isDisabled, disabled: true, className, children });
  return /* @__PURE__ */ jsx(
    Link,
    {
      viewTransition: true,
      "aria-disabled": isDisabled,
      onClick: (event) => {
        if (isDisabled) event.preventDefault();
      },
      className,
      to: href,
      prefetch: "viewport",
      children
    }
  );
};
const Pagination = ({
  paginationConfig,
  getNextProps,
  getPaginationItemProps,
  getPreviousProps
}) => {
  const { totalPages, setPage } = usePagination({
    totalItems: paginationConfig.count,
    initialPageSize: paginationConfig.limit
  });
  const currentPage = Math.floor(paginationConfig.offset / paginationConfig.limit) + 1;
  useEffect(() => {
    setPage(currentPage - 1);
  }, [currentPage, setPage]);
  if (paginationConfig.count <= paginationConfig.limit) return null;
  const startPage = totalPages <= 5 ? 1 : Math.max(1, currentPage - 1);
  const endPage = totalPages <= 5 ? totalPages : Math.min(totalPages, currentPage + 1);
  return /* @__PURE__ */ jsx("div", { className: "flex items-center justify-between", children: /* @__PURE__ */ jsx("div", { className: "flex flex-1 flex-col-reverse flex-wrap items-center justify-center gap-4 sm:flex-row", children: /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsxs("nav", { className: "relative z-0 inline-flex", "aria-label": "Pagination", children: [
    /* @__PURE__ */ jsxs(
      PaginationButton,
      {
        className: clsx(currentPage === 1 && "hidden"),
        currentPage,
        isDisabled: currentPage === 1,
        ...getPreviousProps({ currentPage }),
        children: [
          /* @__PURE__ */ jsx("span", { className: "sr-only", children: "Previous" }),
          /* @__PURE__ */ jsx(ChevronLeftIcon, { className: "h-5 w-5", "aria-hidden": "true" })
        ]
      }
    ),
    startPage > 2 && /* @__PURE__ */ jsxs(Fragment$1, { children: [
      /* @__PURE__ */ jsx(PaginationItem, { page: 1, currentPage, ...getPaginationItemProps({ page: 1 }) }),
      /* @__PURE__ */ jsx("span", { className: "relative inline-flex items-center bg-white px-3 py-2 text-sm font-bold text-gray-700 sm:px-4", children: "..." })
    ] }),
    Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i).map((page) => /* @__PURE__ */ jsx(PaginationItem, { page, currentPage, ...getPaginationItemProps({ page }) }, page)),
    endPage < totalPages - 1 && /* @__PURE__ */ jsxs(Fragment$1, { children: [
      /* @__PURE__ */ jsx("span", { className: "relative inline-flex items-center bg-white px-3 py-2 text-sm font-bold text-gray-700 sm:px-4", children: "..." }),
      /* @__PURE__ */ jsx(
        PaginationItem,
        {
          page: totalPages,
          currentPage,
          ...getPaginationItemProps({ page: totalPages })
        }
      )
    ] }),
    /* @__PURE__ */ jsxs(
      PaginationButton,
      {
        className: "rounded-r-md",
        currentPage,
        isDisabled: currentPage === totalPages,
        ...getNextProps({ currentPage }),
        children: [
          /* @__PURE__ */ jsx("span", { className: "sr-only", children: "Next" }),
          /* @__PURE__ */ jsx(ChevronRightIcon, { className: "h-5 w-5", "aria-hidden": "true" })
        ]
      }
    )
  ] }) }) }) });
};
function getPaginationLink({
  context,
  page,
  section,
  difference = 0,
  prefix = ""
}) {
  const windowSearch = isBrowser ? window.location.search : "";
  const contextSplit = isBrowser ? context.split("?")[1] || "" + windowSearch : context.split("?")[1];
  const contextSearchParams = new URLSearchParams(contextSplit);
  const newPage = page + difference;
  if (newPage > 0) contextSearchParams.set(`${prefix}page`, newPage.toString());
  return `/${context.split("?")[0].replace("?", "")}?${contextSearchParams.toString()}${section ? `#${section}` : ""}`;
}
const PaginationWithContext = ({ context, section, ...props }) => {
  if (!props.paginationConfig) return null;
  const prefix = props.paginationConfig.prefix;
  return /* @__PURE__ */ jsx(
    Pagination,
    {
      ...props,
      getPreviousProps: ({ currentPage }) => ({
        href: getPaginationLink({
          context,
          prefix,
          page: currentPage,
          difference: -1,
          section
        })
      }),
      getPaginationItemProps: ({ page }) => ({
        href: getPaginationLink({ context, prefix, page, section })
      }),
      getNextProps: ({ currentPage }) => ({
        href: getPaginationLink({
          context,
          prefix,
          page: currentPage,
          difference: 1,
          section
        })
      })
    }
  );
};
const EmptyProductListItem = ({ className, ...props }) => /* @__PURE__ */ jsx("article", { className: clsx(className, "group"), ...props, children: /* @__PURE__ */ jsx("figure", { className: "aspect-w-1 aspect-h-1 h-full w-full overflow-hidden rounded-lg border", children: /* @__PURE__ */ jsx("div", { className: "h-full w-full bg-gray-200 object-cover object-center group-hover:opacity-75" }) }) });
const ProductGridSkeleton = ({ length }) => /* @__PURE__ */ jsx("div", { className: "xs:grid-cols-2 grid grid-cols-1 gap-y-10 gap-x-6 md:!grid-cols-3 xl:!grid-cols-4 xl:gap-x-8", children: Array.from({ length }, (_, i) => /* @__PURE__ */ jsx(EmptyProductListItem, {}, i)) });
const SectionHeading = ({ className, ...props }) => /* @__PURE__ */ jsx("h2", { className: clsx("text-4xl font-extrabold", className), ...props });
const ProductListHeader = ({ heading, children, text, actions: actions2, customActions }) => {
  if (!(heading || children) && !text && !(actions2 == null ? void 0 : actions2.length) && !customActions) return null;
  return /* @__PURE__ */ jsxs("header", { className: "mb-4 flex flex-col items-start xs:items-end gap-2 md:mb-6 xs:flex-row md:gap-4 lg:mb-8", children: [
    /* @__PURE__ */ jsx("div", { className: "w-full flex-1 md:w-auto", children: /* @__PURE__ */ jsxs("div", { className: "inline-grid !max-w-prose gap-6", children: [
      (heading || children) && /* @__PURE__ */ jsx(SectionHeading, { className: "font-italiana font-normal tracking-wider", children: heading || children }),
      text && /* @__PURE__ */ jsx("div", { children: text })
    ] }) }),
    !!(actions2 == null ? void 0 : actions2.length) && /* @__PURE__ */ jsx("div", { className: "flex grow-0 items-center gap-2", children: actions2.map(({ label, url }, index) => {
      if (!label) return null;
      return /* @__PURE__ */ jsxs(URLAwareNavLink, { url, prefetch: "render", className: "flex items-center hover:underline", children: [
        label,
        /* @__PURE__ */ jsx(ArrowRightIcon, { className: "ml-1.5 h-4" })
      ] }, index);
    }) }),
    customActions && /* @__PURE__ */ jsx("div", { className: "mt-2 flex grow-0 items-center gap-2 sm:mt-0", children: customActions })
  ] });
};
const useAddToCart = () => {
  var _a, _b;
  const fetcher = useFetcher({
    key: FetcherKeys.cart.createLineItem
  });
  const addToCart2 = (data2) => {
    const formData = new FormData();
    formData.append("productId", data2.productId);
    formData.append("quantity", String(data2.quantity || 1));
    if (data2.options) {
      Object.entries(data2.options).forEach(([key, value]) => {
        formData.append(`options.${key}`, value);
      });
    }
    fetcher.submit(formData, {
      method: "post",
      action: "/api/cart/line-items/create"
    });
  };
  return {
    addToCart: addToCart2,
    isLoading: fetcher.state === "submitting" || fetcher.state === "loading",
    error: (_a = fetcher.data) == null ? void 0 : _a.errors,
    cart: (_b = fetcher.data) == null ? void 0 : _b.cart,
    state: fetcher.state
  };
};
const useI18n = () => {
  const { t, i18n: i18n2 } = useTranslation();
  const changeLanguage = (language) => {
    i18n2.changeLanguage(language);
  };
  const currentLanguage = i18n2.language;
  return {
    t,
    changeLanguage,
    currentLanguage,
    isReady: i18n2.isInitialized,
    i18n: i18n2
    // Expose i18n instance for debugging
  };
};
const AddToCartButton = ({
  product: product2,
  selectedOptions = {},
  quantity = 1,
  disabled = false,
  className,
  variant = "primary",
  size = "md"
}) => {
  const { t } = useI18n();
  const { addToCart: addToCart2, isLoading } = useAddToCart();
  const { toggleCartDrawer } = useCart();
  const handleAddToCart = (e) => {
    e.preventDefault();
    addToCart2({
      productId: product2.id,
      options: selectedOptions,
      quantity
    });
    toggleCartDrawer(true);
  };
  const isDisabled = disabled || isLoading;
  const baseClasses = "font-medium rounded-[100px] transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 flex items-center p-2";
  const variantClasses = {
    primary: {
      enabled: "bg-black text-white hover:bg-gray-800 focus:ring-gray-500",
      disabled: "bg-gray-300 text-gray-500 cursor-not-allowed"
    },
    secondary: {
      enabled: "bg-white text-black border border-black hover:bg-gray-50 focus:ring-gray-500",
      disabled: "bg-gray-100 text-gray-400 border border-gray-300 cursor-not-allowed"
    }
  };
  const buttonClasses = clsx(
    baseClasses,
    isDisabled ? variantClasses[variant].disabled : variantClasses[variant].enabled,
    className
  );
  return /* @__PURE__ */ jsxs(
    "button",
    {
      onClick: handleAddToCart,
      disabled: isDisabled,
      className: buttonClasses,
      "aria-label": `${t("common.addToCart")} ${product2.title}`,
      children: [
        /* @__PURE__ */ jsx("i", { className: "w-4", children: /* @__PURE__ */ jsx(PlusIcon, { className: "size-1" }) }),
        /* @__PURE__ */ jsx("span", { className: "text-nowrap btn-add opacity-0 w-0 h-0 transition-all duration-300 group-hover/product-card:opacity-100 group-hover/product-card:w-auto group-hover/product-card:h-auto", children: " Add to cart" })
      ]
    }
  );
};
const SoldOutBadge = ({ className }) => {
  return /* @__PURE__ */ jsx(
    "div",
    {
      className: clsx(
        "inline-flex items-center rounded-md border border-gray-200 bg-gray-200 px-1.5 py-0.5 text-xs font-bold text-gray-600",
        className
      ),
      children: "Sold out"
    }
  );
};
const useProductInventory = (product2) => {
  return useMemo(() => {
    var _a, _b;
    const totalInventory = ((_a = product2.variants) == null ? void 0 : _a.reduce((total, variant) => {
      if (variant.allow_backorder || !variant.manage_inventory) return Infinity;
      return total + (variant.inventory_quantity || 0);
    }, 0)) ?? 0;
    const averageInventory = totalInventory / (((_b = product2 == null ? void 0 : product2.variants) == null ? void 0 : _b.length) ?? 1);
    return { averageInventory, totalInventory };
  }, [product2]);
};
const ProductBadges = ({ product: product2, className }) => {
  const productInventory = useProductInventory(product2);
  const isSoldOut = productInventory.averageInventory === 0;
  return /* @__PURE__ */ jsx("div", { className, children: isSoldOut && /* @__PURE__ */ jsx(SoldOutBadge, {}) });
};
const ProductVariantPrice = ({ variant, currencyCode }) => {
  const { original, calculated } = getVariantPrices(variant);
  const hasSale = isNumber(calculated) && calculated < (original ?? 0);
  return /* @__PURE__ */ jsx(Fragment$1, { children: hasSale ? /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1", children: [
    /* @__PURE__ */ jsx("span", { children: formatPrice(calculated, { currency: currencyCode }) }),
    /* @__PURE__ */ jsx("s", { className: "text-gray-400", children: formatPrice(original || 0, { currency: currencyCode }) })
  ] }) : formatPrice(original || 0, { currency: currencyCode }) });
};
const ProductPrice = ({ product: product2, currencyCode, ...props }) => {
  const variant = useMemo(
    () => props.variant || getCheapestProductVariant(product2),
    [props.variant, product2, currencyCode]
  );
  if (!variant) return null;
  return /* @__PURE__ */ jsx(ProductVariantPrice, { variant, currencyCode });
};
const MorphingShape = ({ className, classNameWrapper, blur = 32, zoom = 0.5, colorStart = "#A2D4FD", colorEnd = "#B8C2FF", id, offsetStart = 7, offsetEnd = 58 }) => {
  const pathRef = useRef(null);
  const path1 = "M58.5,385.506 C-10.7672,421.089 -13.4757,448.009 31,505.506 C-9.44661,694.329 31.2229,735.132 229,679.506 C331.989,707.394 386.507,701.242 477,645.006 C578.662,639.94 605.47,614.734 564,503.506 C579.723,442.148 576.855,407.988 546,347.506 C585.113,183.95 442.107,186.078 389.331,192.148 C377.098,193.556 364.755,191.654 353.695,186.24 C286.05,153.125 38.2558,53.6694 58.5,385.506 Z";
  const path2 = "M379.198464,131.107255 C148.198464,-30.3932451 -85.1425355,279.200255 127.698464,470.607255 C82.7914645,624.472255 157.598464,647.545255 235.198464,681.107255 C277.368464,750.902255 303.928464,755.968255 356.698464,701.607255 C455.718464,711.021255 498.758464,698.192255 546.698464,633.607255 C611.778464,539.980255 617.128464,487.484255 564.698464,394.107255 C597.188464,358.131255 555.698464,217.509255 508.198464,209.107255 C508.198464,148.107255 480.998464,101.867255 379.198464,131.107255 Z";
  const path4 = "M52.8611638,314.630767 C6.78180521,339.429162 3.02208627,361.688847 28.5395318,413.580471 C-17.9046512,540.875766 -26.863119,604.932206 152.681195,635.467685 C220.964177,811.28032 331.830282,873.470708 546.387612,775.896305 C667.782958,632.652116 676.59955,553.313444 569.189142,413.580471 C614.640192,317.460329 597.331297,274.37223 528.146388,207.185381 C476.726405,39.8389436 421.131208,-21.6399067 206.391466,8.28610192 C48.6859503,94.5551313 24.0400299,164.689982 52.8611638,314.630767 Z";
  const path3 = "M257.221157,237.564617 C257.221157,237.564617 210.611157,291.123617 208.721157,334.064617 C-30.6888426,436.722617 -25.8988426,543.175617 143.721157,699.064617 C212.161157,794.871617 264.211157,794.866617 359.221157,736.064617 C474.791157,729.846617 525.401157,707.001617 578.221157,615.064617 C622.811157,545.661617 629.161157,502.453617 600.221157,416.064617 C643.121157,329.311617 626.131157,247.346617 527.221157,188.564617 C457.441157,-85.9703827 198.451157,99.4347173 257.221157,237.564617 Z";
  useEffect(() => {
    if (pathRef.current) {
      animate(pathRef.current, {
        d: [
          // { to: path4 },
          // { to: path1 },
          // { to: path2 },
          { to: path1 },
          { to: path2 },
          { to: path4 },
          { to: path3 }
        ],
        duration: 1e4,
        ease: "inOutQuad",
        loop: true,
        alternate: true
      });
    }
  }, []);
  return /* @__PURE__ */ jsx("div", { className: clsx(className), children: /* @__PURE__ */ jsx("div", { className: clsx("flex h-screen", classNameWrapper), children: /* @__PURE__ */ jsxs(
    "svg",
    {
      style: { filter: `blur(${blur}px)`, zoom },
      width: "643",
      height: "836",
      viewBox: "0 0 643 836",
      children: [
        /* @__PURE__ */ jsxs("linearGradient", { id: `PSgrad_${id}`, x1: "70.711%", x2: "0%", y1: "70.711%", y2: "0%", children: [
          /* @__PURE__ */ jsx("stop", { offset: `${offsetStart}%`, stopColor: colorStart, stopOpacity: "1" }),
          /* @__PURE__ */ jsx("stop", { offset: `${offsetEnd}%`, stopColor: colorEnd, stopOpacity: "1" })
        ] }),
        /* @__PURE__ */ jsx(
          "path",
          {
            fill: `url(#PSgrad_${id})`,
            ref: pathRef,
            d: path1
          }
        )
      ]
    }
  ) }) });
};
const COLORS_MORPHING_SHAPE = {
  BLOSSOM: { colorStart: "#FFFFFF", colorEnd: "#6DCB8F", offsetStart: 8.85, offsetEnd: 79.19 },
  SAFFRON: { colorStart: "#BEB1F8", colorEnd: "#8F5DDB", offsetStart: 8.85, offsetEnd: 79.19 },
  HAZE: { colorStart: "#BFFAED", colorEnd: "#BBEE7C", offsetStart: 8.85, offsetEnd: 79.19 },
  RICE: { colorStart: "#EEF7FF", colorEnd: "#A2D4FD", offsetStart: 8.85, offsetEnd: 79.19 },
  LATTE: { colorStart: "#E4E3D8", colorEnd: "#89E4BB", offsetStart: 8.85, offsetEnd: 79.19 },
  COFFEE: { colorStart: "#F5DDDD", colorEnd: "#FFB578", offsetStart: 8.85, offsetEnd: 79.19 }
};
const randomAssetMorphingShape = (colorType = null) => {
  const colors = colorType ? COLORS_MORPHING_SHAPE[colorType] : Object.values(COLORS_MORPHING_SHAPE);
  const color = Array.isArray(colors) ? colors[Math.floor(Math.random() * colors.length)] : colors;
  return {
    blur: 20,
    zoom: 0.42,
    className: "flex justify-center",
    id: Math.random().toString(36).substring(2, 15),
    ...color
  };
};
const getCustomizationTitles = (title) => {
  let str = title.trim();
  if (str.includes(" ")) {
    const [first2, ...rest] = str.split(/\s+/);
    return [first2, "_" + rest.join(" ")];
  }
  const mid = Math.floor(str.length / 2);
  const first = str.slice(0, mid);
  const last = str.slice(mid);
  return [first, "_" + last];
};
const ProductThumbnail = ({ product: product2, className, isTransitioning, ...props }) => {
  const thumbnailImage = product2.images && product2.images[0] && product2.images[0].url || product2.thumbnail;
  const hoverImage = product2.images && product2.images[1] && product2.images[1].url;
  return /* @__PURE__ */ jsxs(
    "figure",
    {
      className: clsx(
        "product-thumbnail",
        "aspect-w-1 aspect-h-1 w-full overflow-hidden",
        className
      ),
      style: {
        viewTransitionName: isTransitioning ? "product-thumbnail" : void 0
      },
      ...props,
      children: [
        /* @__PURE__ */ jsx(MorphingShape, { ...randomAssetMorphingShape(product2.subtitle) }),
        thumbnailImage ? /* @__PURE__ */ jsx(
          Image,
          {
            loading: "lazy",
            src: thumbnailImage,
            alt: product2.title,
            className: clsx("h-full w-full object-cover object-center transition-all duration-300 -rotate-[14deg]", {
              "group-hover/product-card:opacity-75": !hoverImage
            })
          }
        ) : /* @__PURE__ */ jsx("div", { className: "flex h-full w-full items-center justify-center object-cover object-center group-hover/product-card:opacity-75", children: "No Image" })
      ]
    }
  );
};
const metaOptions = {
  SIZE: "Size"
};
const ProductListItem = ({
  product: product2,
  className,
  isTransitioning,
  ...props
}) => {
  var _a, _b, _c;
  const { region } = useRegion();
  const [selectedSize, setSelectedSize] = useState(null);
  const size = (_a = product2.options) == null ? void 0 : _a.find(
    (option) => option.title === metaOptions.SIZE
  );
  const selectedOptions = {};
  if (selectedSize && size) {
    selectedOptions[size == null ? void 0 : size.id] = selectedSize;
  }
  const requiresSize = size && size.values && size.values.length > 0;
  const canAddToCart = !requiresSize || selectedSize;
  const variant = (_b = product2.variants) == null ? void 0 : _b.find((variant2) => {
    return Object.entries(selectedOptions).every(([optionId, value]) => {
      var _a2;
      return (_a2 = variant2.options) == null ? void 0 : _a2.some((v) => v.option_id === optionId && v.value === value);
    });
  });
  if (!variant) return null;
  return /* @__PURE__ */ jsxs(
    "article",
    {
      className: clsx(className, "group/product-card text-left rounded-[32px] p-4 pb-6 overflow-hidden bg-white shadow-[5px_5px_10px_0px_#00000040]"),
      ...props,
      children: [
        /* @__PURE__ */ jsxs("div", { className: "relative", children: [
          /* @__PURE__ */ jsx(
            ProductBadges,
            {
              className: "absolute right-2 top-2 z-10 flex gap-2",
              product: product2
            }
          ),
          /* @__PURE__ */ jsx(ProductThumbnail, { isTransitioning, product: product2 })
        ] }),
        /* @__PURE__ */ jsx("h4", { className: "mt-4 overflow-hidden text-ellipsis font-extrabold font-title group-hover/product-card:text-[36px] transition-all duration-300 text-[28px]", children: product2.title }),
        /* @__PURE__ */ jsxs("div", { className: "flex gap-2 justify-between items-center", children: [
          /* @__PURE__ */ jsx("div", { className: "flex gap-2 justify-center items-center", children: (_c = size == null ? void 0 : size.values) == null ? void 0 : _c.map((value) => /* @__PURE__ */ jsx(
            "span",
            {
              className: clsx(
                "text-sm font-light  border border-[#716E6E] rounded-full px-2 py-1 hover:text-[#716E6E] hover:border-black text-[10px] font-display leading-none",
                {
                  "!text-black !border-black": selectedSize === value.value
                }
              ),
              onClick: (e) => {
                setSelectedSize(value.value);
                e.preventDefault();
              },
              children: value.value
            },
            value.id
          )) }),
          /* @__PURE__ */ jsx(
            AddToCartButton,
            {
              product: product2,
              selectedOptions,
              disabled: !canAddToCart,
              variant: "primary"
            }
          )
        ] }),
        /* @__PURE__ */ jsx("p", { className: "mt-1 text-lg font-extrabold font-title leading-none tracking-normal hover:text-[]", children: /* @__PURE__ */ jsx(ProductPrice, { product: product2, variant, currencyCode: region.currency_code }) })
      ]
    }
  );
};
const ProductGrid = ({
  heading,
  actions: actions2,
  products,
  className = "grid grid-cols-1 gap-y-6 @md:grid-cols-2 gap-x-[6vw] @2xl:!grid-cols-3 "
}) => {
  const navigation2 = useNavigation();
  const isLoading = navigation2.state !== "idle";
  if (!products) return /* @__PURE__ */ jsx(ProductGridSkeleton, { length: 5 });
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: clsx("@container", {
        "animate-pulse": isLoading
      }),
      children: [
        /* @__PURE__ */ jsx(ProductListHeader, { heading, actions: actions2 }),
        /* @__PURE__ */ jsx("div", { className, children: products == null ? void 0 : products.map((product2) => /* @__PURE__ */ jsx(
          NavLink,
          {
            prefetch: "viewport",
            to: `/products/${product2.handle}`,
            viewTransition: true,
            className: "transition-transform duration-300 hover:scale-110",
            children: ({ isTransitioning }) => /* @__PURE__ */ jsx(
              ProductListItem,
              {
                isTransitioning,
                product: product2
              }
            )
          },
          product2.id
        )) })
      ]
    }
  );
};
const ProductListWithPagination = ({
  context,
  paginationConfig,
  ...props
}) => /* @__PURE__ */ jsxs("div", { children: [
  /* @__PURE__ */ jsx(ProductGrid, { ...props }),
  paginationConfig && /* @__PURE__ */ jsx(PaginationWithContext, { context, paginationConfig })
] });
const fetchCollections = async function(offset = 0, limit = 100) {
  return cachified({
    key: `collections-${JSON.stringify({ offset, limit })}`,
    cache: sdkCache,
    staleWhileRevalidate: MILLIS.ONE_HOUR,
    ttl: MILLIS.TEN_SECONDS,
    async getFreshValue() {
      return _fetchCollections(offset, limit);
    }
  });
};
const _fetchCollections = async function(offset = 0, limit = 100) {
  return sdk.store.collection.list({ limit, offset, fields: "id,handle,title,metadata" }).then(({ collections }) => ({ collections, count: collections.length }));
};
const loader$i = async ({
  request,
  params
}) => {
  const handle = params.collectionHandle;
  const {
    collections
  } = await fetchCollections();
  const collection = collections == null ? void 0 : collections.find((collection2) => collection2.handle === handle);
  if (!collection) throw redirect("/products");
  const {
    products,
    count,
    limit,
    offset
  } = await fetchProducts(request, {
    collection_id: collection.id
  });
  return {
    products,
    count,
    limit,
    offset,
    collection
  };
};
const collections_$collectionHandle = UNSAFE_withComponentProps(function ProductCollectionRoute() {
  const data2 = useLoaderData();
  if (!data2) return null;
  const {
    products,
    count,
    limit,
    offset,
    collection
  } = data2;
  const [description, setDescription] = useState("");
  const {
    currentLanguage
  } = useI18n();
  useEffect(() => {
    var _a, _b;
    if (currentLanguage === "vi") {
      setDescription(((_a = collection.metadata) == null ? void 0 : _a.description_vi) || "");
    } else {
      setDescription(((_b = collection.metadata) == null ? void 0 : _b.description_en) || "");
    }
  }, [currentLanguage, data2.collection.metadata]);
  return /* @__PURE__ */ jsxs(Container, {
    className: "pb-16",
    children: [/* @__PURE__ */ jsxs("h1", {
      className: "relative flex items-end text-[110px] text-[#321D14] mt-12 after:content-[''] after:block after:w-1/2 after:h-[1px] after:bg-[#000000] after:absolute after:bottom-[32px] after:left-0",
      children: [/* @__PURE__ */ jsxs("p", {
        className: "flex-1 font-title font-bold uppercase leading-none relative top-[-18px]",
        children: [/* @__PURE__ */ jsx("span", {
          children: "This"
        }), " ", /* @__PURE__ */ jsx("br", {}), /* @__PURE__ */ jsx("span", {
          className: "pl-[14px] pr-16 bg-white z-10 relative",
          children: "is"
        })]
      }), /* @__PURE__ */ jsx("span", {
        className: "flex-1 inline-block justify-center bg-white z-10 relative px-16 text-center font-centuryBook block italic",
        children: collection.title
      }), /* @__PURE__ */ jsx("div", {
        className: "flex-1",
        children: /* @__PURE__ */ jsxs("div", {
          className: "relative h-20 w-20 -top-16 -left-16 z-10",
          children: [/* @__PURE__ */ jsx("img", {
            className: "animate-rotate-bounce absolute top-0 left-0",
            src: "/assets/images/home/cup.svg",
            alt: "Cup"
          }), /* @__PURE__ */ jsx("img", {
            className: "animate-rotate-bounce-reverse absolute top-0 left-0",
            src: "/assets/images/home/cup-bg.svg",
            alt: "Cup"
          })]
        })
      })]
    }), /* @__PURE__ */ jsx("div", {
      className: "flex gap-4 sm:flex-row max-w-3xl mx-auto h-[84px] mb-6",
      children: /* @__PURE__ */ jsx("p", {
        className: "text-lg font-montserrat font-regular text-[15px] leading-[26px] text-center text-[#000] flex-1",
        children: description
      })
    }), /* @__PURE__ */ jsx("div", {
      className: "flex flex-col gap-4 sm:flex-row",
      children: /* @__PURE__ */ jsx("div", {
        className: "flex-1",
        children: /* @__PURE__ */ jsx(ProductListWithPagination, {
          products,
          paginationConfig: {
            count,
            offset,
            limit
          },
          context: "products"
        })
      })
    })]
  });
});
const route4 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: collections_$collectionHandle,
  loader: loader$i
}, Symbol.toStringTag, { value: "Module" }));
const addressToMedusaAddress = (address) => {
  if (!address) return {};
  return {
    first_name: address.firstName || "",
    last_name: address.lastName || "",
    company: address.company || "",
    address_1: address.address1 || "",
    address_2: address.address2 || "",
    city: address.city || "",
    country_code: address.countryCode || "",
    phone: address.phone || "",
    postal_code: address.postalCode,
    province: address.province
  };
};
const emptyAddress = {
  firstName: "",
  lastName: "",
  company: "",
  address1: "",
  address2: "",
  city: "",
  province: "",
  postalCode: "",
  countryCode: "",
  phone: ""
};
const medusaAddressToAddress = (address) => {
  if (!address) return emptyAddress;
  return {
    ...emptyAddress,
    firstName: (address == null ? void 0 : address.first_name) || "",
    lastName: (address == null ? void 0 : address.last_name) || "",
    company: (address == null ? void 0 : address.company) || "",
    address1: (address == null ? void 0 : address.address_1) || "",
    address2: (address == null ? void 0 : address.address_2) || "",
    city: (address == null ? void 0 : address.city) || "",
    countryCode: (address == null ? void 0 : address.country_code) || "",
    phone: (address == null ? void 0 : address.phone) || "",
    postalCode: (address == null ? void 0 : address.postal_code) || "",
    province: (address == null ? void 0 : address.province) || ""
  };
};
const addressPayload = (address) => {
  if (!address) return emptyAddress;
  return {
    first_name: (address == null ? void 0 : address.first_name) || "",
    last_name: (address == null ? void 0 : address.last_name) || "",
    company: (address == null ? void 0 : address.company) || "",
    address_1: (address == null ? void 0 : address.address_1) || "",
    address_2: (address == null ? void 0 : address.address_2) || "",
    city: (address == null ? void 0 : address.city) || "",
    country_code: (address == null ? void 0 : address.country_code) || "",
    phone: (address == null ? void 0 : address.phone) || "",
    postal_code: (address == null ? void 0 : address.postal_code) || "",
    province: (address == null ? void 0 : address.province) || ""
  };
};
const buildObjectFromSearchParams = (searchParams) => {
  let params = {};
  searchParams.forEach((value, key) => {
    let decodedKey = decodeURIComponent(key);
    const decodedValue = decodeURIComponent(value);
    if (decodedKey.endsWith("[]")) {
      decodedKey = decodedKey.replace("[]", "");
      params[decodedKey] || (params[decodedKey] = []);
      params[decodedKey].push(decodedValue);
    } else {
      params[decodedKey] = decodedValue;
    }
  });
  return params;
};
const buildSearchParamsFromObject = (search, prefix = "", isArray = false) => {
  return Object.entries(search).filter(([key, value]) => value).map(
    ([key, value]) => typeof value === "object" ? buildSearchParamsFromObject(value, key, Array.isArray(value)) : `${prefix ? `${prefix}[${isArray ? "" : key}]` : `${key}`}=${value}`
  ).join("&");
};
const getShippingOptionsByProfile = (shippingOptions) => {
  const shippingOptionsByProfile = shippingOptions.reduce(
    (acc, shippingOption) => {
      const profileId = shippingOption.shipping_profile_id;
      if (!profileId) return acc;
      if (!acc[profileId]) acc[profileId] = [];
      acc[profileId].push(shippingOption);
      return acc;
    },
    {}
  );
  Object.keys(shippingOptionsByProfile).forEach(
    (profileId) => shippingOptionsByProfile[profileId].sort((a, b) => (a.amount || 0) - (b.amount || 0))
  );
  return shippingOptionsByProfile;
};
const checkContactInfoComplete = (cart2, customer) => !!cart2.email || !!(customer == null ? void 0 : customer.email);
const checkAccountDetailsComplete = (cart2) => {
  var _a;
  return !!((_a = cart2.shipping_address) == null ? void 0 : _a.address_1);
};
const checkDeliveryMethodComplete = (cart2, shippingOptions) => {
  var _a;
  const values = ((_a = cart2.shipping_methods) == null ? void 0 : _a.map((sm) => sm.shipping_option_id)) || [];
  const shippingOptionsByProfile = getShippingOptionsByProfile(shippingOptions);
  return Object.values(shippingOptionsByProfile).every(
    (shippingOptions2) => shippingOptions2.find((so) => values.includes(so.id))
  );
};
function calculateEstimatedShipping(shippingOptions) {
  if ((shippingOptions == null ? void 0 : shippingOptions.length) < 1) return 0;
  const shippingOptionsByProfile = getShippingOptionsByProfile(shippingOptions);
  return Object.values(shippingOptionsByProfile).reduce((acc, shippingOptions2) => {
    const cheapestOption = shippingOptions2.reduce(
      (prev, curr) => (prev.amount || 0) < ((curr == null ? void 0 : curr.amount) || 0) ? prev : curr
    );
    return acc + (cheapestOption.amount || 0);
  }, 0);
}
const formatDate = (date, format = "en-US") => {
  return new Intl.DateTimeFormat(format, { dateStyle: "medium" }).format(date);
};
const accountDetailsSchema = z$1.object({
  cartId: z$1.string(),
  customerId: z$1.string().optional(),
  email: z$1.string().email("Please enter a valid email"),
  shippingAddress: z$1.object({
    firstName: z$1.string().min(1, "First name is required"),
    lastName: z$1.string().min(1, "Last name is required"),
    company: z$1.string().optional(),
    address1: z$1.string().min(1, "Address is required"),
    address2: z$1.string().optional(),
    city: z$1.string().min(1, "City is required"),
    province: z$1.string().min(1, "Province is required"),
    countryCode: z$1.string().min(1, "Country is required"),
    postalCode: z$1.string().min(1, "Postal code is required"),
    phone: z$1.string().optional()
  }),
  shippingAddressId: z$1.string(),
  isExpressCheckout: z$1.boolean().optional()
});
async function action$b(actionArgs) {
  const {
    errors,
    data: data$1
  } = await getValidatedFormData(actionArgs.request, zodResolver(accountDetailsSchema));
  if (errors) {
    return data({
      errors
    }, {
      status: 400
    });
  }
  const formattedShippingAddress = addressToMedusaAddress(data$1.shippingAddress);
  const {
    cart: cart2
  } = await updateCart(actionArgs.request, {
    email: data$1.email,
    shipping_address: formattedShippingAddress,
    billing_address: formattedShippingAddress
  });
  return data({
    cart: cart2
  });
}
const route5 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  accountDetailsSchema,
  action: action$b
}, Symbol.toStringTag, { value: "Module" }));
const billingAddressSchema = z$1.object({
  cartId: z$1.string(),
  billingAddress: z$1.object({
    firstName: z$1.string().min(1, "First name is required"),
    lastName: z$1.string().min(1, "Last name is required"),
    company: z$1.string().optional(),
    address1: z$1.string().min(1, "Address is required"),
    address2: z$1.string().optional(),
    city: z$1.string().min(1, "City is required"),
    province: z$1.string().min(1, "Province is required"),
    countryCode: z$1.string().min(1, "Country is required"),
    postalCode: z$1.string().min(1, "Postal code is required"),
    phone: z$1.string().optional()
  })
});
async function action$a(actionArgs) {
  const {
    errors,
    data: data$1
  } = await getValidatedFormData(actionArgs.request, zodResolver(billingAddressSchema));
  if (errors) {
    return data({
      errors
    }, {
      status: 400
    });
  }
  const billingAddress = addressToMedusaAddress(data$1.billingAddress);
  const {
    cart: cart2
  } = await updateCart(actionArgs.request, {
    billing_address: billingAddress
  });
  return data({
    cart: cart2
  });
}
function useBillingAddressForm() {
  return useRemixForm({
    resolver: zodResolver(billingAddressSchema)
  });
}
const route6 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  action: action$a,
  billingAddressSchema,
  useBillingAddressForm
}, Symbol.toStringTag, { value: "Module" }));
const newsletterSubscriberSchema = z$1.object({
  email: z$1.string().email("Please enter a valid email address")
});
const action$9 = async ({
  request
}) => {
  const {
    data: validatedData,
    errors
  } = await getValidatedFormData(await request.formData(), zodResolver(newsletterSubscriberSchema));
  if (errors) {
    return data({
      errors
    }, {
      status: 400
    });
  }
  const {
    email
  } = validatedData;
  console.log("Subscribed to newsletter", email);
  return data({
    success: true
  }, {
    status: 200
  });
};
const route7 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  action: action$9,
  newsletterSubscriberSchema
}, Symbol.toStringTag, { value: "Module" }));
const getVariantBySelectedOptions = (variants, options) => variants.find((variant) => {
  var _a;
  return (_a = variant.options) == null ? void 0 : _a.every((option) => options[option.option_id] === option.value);
});
const selectVariantFromMatrixBySelectedOptions = (matrix, selectedOptions) => {
  if (!selectedOptions) return void 0;
  const serialized = selectedOptions.join("|");
  return matrix[serialized];
};
const selectDiscountFromVariant = (variant) => {
  if (!variant) return void 0;
  const { original, calculated } = getVariantPrices(variant);
  if (!original || !calculated || calculated >= original) return void 0;
  const valueOff = original - calculated;
  const percentageOff = valueOff / original * 100;
  return {
    valueOff,
    percentageOff
  };
};
const generateOptionCombinations = (options) => {
  var _a;
  if (!options.length) return [[]];
  const [first, ...rest] = options;
  const subCombinations = generateOptionCombinations(rest);
  return ((_a = first.values) == null ? void 0 : _a.reduce((acc, optionValue) => {
    const value = optionValue.value;
    const newCombinations = subCombinations.map((sub) => [value, ...sub]);
    return [...acc, ...newCombinations];
  }, [])) || [];
};
const selectVariantMatrix = (product2) => {
  const options = product2.options || [];
  const variants = product2.variants || [];
  const matrix = {};
  const allCombinations = generateOptionCombinations(options);
  allCombinations.forEach((combination) => {
    const serialized = combination.join("|");
    const matchingVariant = variants.find(
      (variant) => {
        var _a;
        return (_a = variant.options) == null ? void 0 : _a.every((option) => combination.includes(option.value));
      }
    );
    if (matchingVariant) {
      matrix[serialized] = matchingVariant;
    }
  });
  return matrix;
};
function getFilteredOptionValues(product2, selectedOptions, currentOptionId) {
  var _a, _b;
  const options = product2.options || [];
  const currentOptionIndex = options.findIndex((option) => option.id === currentOptionId);
  if (currentOptionIndex === 0) {
    const currentOption2 = options.find((option) => option.id === currentOptionId);
    return (currentOption2 == null ? void 0 : currentOption2.values) || [];
  }
  const previousOptionIds = options.slice(0, currentOptionIndex).map((option) => option.id).filter(Boolean);
  const relevantSelectedOptions = Object.entries(selectedOptions).filter(
    ([optionId, value]) => previousOptionIds.includes(optionId) && value !== ""
  );
  if (relevantSelectedOptions.length === 0) {
    const currentOption2 = options.find((option) => option.id === currentOptionId);
    return (currentOption2 == null ? void 0 : currentOption2.values) || [];
  }
  const availableVariants = (_a = product2.variants) == null ? void 0 : _a.filter((variant) => {
    return relevantSelectedOptions.every(([optionId, value]) => {
      var _a2;
      const variantOption = (_a2 = variant.options) == null ? void 0 : _a2.find((option) => option.option_id === optionId);
      return variantOption ? variantOption.value === value : true;
    });
  });
  const possibleValues = /* @__PURE__ */ new Set();
  availableVariants == null ? void 0 : availableVariants.forEach((variant) => {
    var _a2, _b2;
    const optionValue = (_b2 = (_a2 = variant.options) == null ? void 0 : _a2.find((o) => o.option_id === currentOptionId)) == null ? void 0 : _b2.value;
    if (optionValue) possibleValues.add(optionValue);
  });
  const currentOption = options.find((option) => option.id === currentOptionId);
  return ((_b = currentOption == null ? void 0 : currentOption.values) == null ? void 0 : _b.filter((optionValue) => possibleValues.has(optionValue.value))) || [];
}
const getOptionValuesWithDiscountLabels = (productOptionIndex, currencyCode, optionValues, variantMatrix, selectedOptions) => {
  var _a;
  const isLastOption = selectedOptions && productOptionIndex === selectedOptions.length - 1;
  const optionId = (_a = optionValues[0]) == null ? void 0 : _a.option_id;
  return optionValues.map((optionValue) => {
    if (!isLastOption) {
      const allVariantsWithThisOption = Object.values(variantMatrix).filter(
        (variant) => {
          var _a2;
          return (_a2 = variant.options) == null ? void 0 : _a2.some((o) => o.option_id === optionId && o.value === optionValue.value);
        }
      );
      if (allVariantsWithThisOption.length > 0) {
        const prices = allVariantsWithThisOption.map((variant) => getVariantFinalPrice(variant));
        const uniquePrices = [...new Set(prices)].sort((a, b) => a - b);
        if (uniquePrices.length > 1) {
          const minPrice = uniquePrices[0];
          const maxPrice = uniquePrices[uniquePrices.length - 1];
          return {
            ...optionValue,
            minPrice,
            maxPrice
          };
        } else {
          return {
            ...optionValue,
            minPrice: uniquePrices[0],
            maxPrice: uniquePrices[0]
          };
        }
      }
    }
    const currentOptionWithSelectOptions = selectedOptions == null ? void 0 : selectedOptions.map((selectedOption, selectedOptionIndex) => {
      if (selectedOptionIndex === productOptionIndex) return optionValue.value;
      return selectedOption;
    });
    const variantForCurrentOption = selectVariantFromMatrixBySelectedOptions(
      variantMatrix,
      currentOptionWithSelectOptions
    );
    if (variantForCurrentOption) {
      const finalPrice = getVariantFinalPrice(variantForCurrentOption);
      const discount = selectDiscountFromVariant(variantForCurrentOption);
      return {
        ...optionValue,
        exactPrice: finalPrice,
        discountPercentage: (discount == null ? void 0 : discount.percentageOff) ? Math.round(discount.percentageOff) : void 0
      };
    }
    return { ...optionValue };
  });
};
const getProductMeta = ({ data: data2, matches }) => {
  var _a, _b, _c;
  const rootMatch = matches[0];
  const region = (_a = rootMatch.data) == null ? void 0 : _a.region;
  const product2 = data2.product;
  const defaultVariant = getCheapestProductVariant(product2);
  if (!product2) return [];
  const title = product2.title;
  const description = product2.description;
  const ogTitle = title;
  const ogDescription = description;
  const ogImage = product2.thumbnail || ((_c = (_b = product2.images) == null ? void 0 : _b[0]) == null ? void 0 : _c.url);
  const ogImageAlt = !!ogImage ? `${title} product thumbnail` : void 0;
  return [
    { title },
    { name: "description", content: description },
    { property: "og:title", content: ogTitle },
    { property: "og:description", content: ogDescription },
    { property: "og:image", content: ogImage },
    { property: "og:image:alt", content: ogImageAlt },
    { property: "og:type", content: "product" },
    { property: "product:price:currency", content: region.currency_code },
    {
      property: "product:price:amount",
      content: formatPrice(getVariantFinalPrice(defaultVariant), {
        currency: region.currency_code
      })
    }
  ];
};
const getMergedProductMeta = mergeMeta(getParentMeta, getCommonMeta, getProductMeta);
const createLineItemSchema = z$1.object({
  productId: z$1.string().min(1, "Product ID is required"),
  options: z$1.record(z$1.string(), z$1.string().optional()).default({}),
  quantity: z$1.coerce.number().int().min(1, "Quantity must be at least 1")
});
async function action$8({
  request
}) {
  const {
    errors,
    data: validatedFormData
  } = await getValidatedFormData(request, zodResolver(createLineItemSchema));
  if (errors) {
    return data({
      errors
    }, {
      status: 400
    });
  }
  const {
    productId,
    options,
    quantity
  } = validatedFormData;
  const region = await getSelectedRegion(request.headers);
  const [product2] = await getProductsById({
    ids: [productId],
    regionId: region.id
  }).catch(() => []);
  if (!product2) {
    return data({
      errors: {
        root: {
          message: "Product not found."
        }
      }
    }, {
      status: 400
    });
  }
  const variant = getVariantBySelectedOptions(product2.variants || [], options);
  if (!variant) {
    return data({
      errors: {
        root: {
          message: "Product variant not found. Please select all required options."
        }
      }
    }, {
      status: 400
    });
  }
  const responseHeaders = new Headers();
  const {
    cart: cart2
  } = await addToCart(request, {
    variantId: variant.id,
    quantity
  });
  await setCartId(responseHeaders, cart2.id);
  return data({
    cart: cart2
  }, {
    headers: responseHeaders
  });
}
const route8 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  action: action$8,
  createLineItemSchema
}, Symbol.toStringTag, { value: "Module" }));
const deleteLineItemSchema = z$1.object({
  lineItemId: z$1.string().min(1, "Line item ID is required")
});
async function action$7({
  request
}) {
  const {
    errors,
    data: validatedFormData
  } = await getValidatedFormData(request, zodResolver(deleteLineItemSchema));
  if (errors) {
    return data({
      errors
    }, {
      status: 400
    });
  }
  const {
    lineItemId
  } = validatedFormData;
  await deleteLineItem(request, lineItemId);
  const cart2 = await retrieveCart(request);
  return data({
    cart: cart2
  });
}
const route9 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  action: action$7
}, Symbol.toStringTag, { value: "Module" }));
const updateLineItemSchema = z$1.object({
  lineItemId: z$1.string().min(1, "Line item ID is required"),
  quantity: z$1.coerce.number().int()
});
async function action$6({
  request
}) {
  const {
    errors,
    data: validatedFormData
  } = await getValidatedFormData(request, zodResolver(updateLineItemSchema));
  if (errors) {
    return data({
      errors
    }, {
      status: 400
    });
  }
  const {
    lineItemId,
    quantity
  } = validatedFormData;
  const response = await updateLineItem(request, {
    lineId: lineItemId,
    quantity
  });
  return data(response);
}
const route10 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  action: action$6,
  updateLineItemSchema
}, Symbol.toStringTag, { value: "Module" }));
const discountCodeSchema = z$1.object({
  cartId: z$1.string(),
  code: z$1.string().min(1, "Discount code is required")
});
async function action$5(actionArgs) {
  const {
    errors,
    data: data$1
  } = await getValidatedFormData(actionArgs.request, zodResolver(discountCodeSchema));
  if (errors) {
    return data({
      errors
    }, {
      status: 400
    });
  }
  try {
    const {
      cart: cart2
    } = await sdk.store.cart.update(data$1.cartId, {
      promo_codes: [data$1.code]
    });
    if (cart2.promotions.length) {
      if (!cart2) {
        return data({
          errors: {
            root: {
              message: "Cart could not be updated. Please try again."
            }
          }
        }, {
          status: 400
        });
      }
    }
    return data({
      cart: cart2
    });
  } catch (error) {
    console.error(error);
    return data({
      errors: {
        root: {
          message: "Discount code is invalid."
        }
      }
    }, {
      status: 400
    });
  }
}
const route11 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  action: action$5,
  discountCodeSchema
}, Symbol.toStringTag, { value: "Module" }));
const fetchProductReviews = async (productId, query = {}, cacheOptions = {}) => {
  return await cachified({
    key: `product-reviews-${productId}-${JSON.stringify(query)}`,
    cache: sdkCache,
    staleWhileRevalidate: MILLIS.ONE_HOUR,
    ttl: MILLIS.TEN_SECONDS,
    forceFresh: cacheOptions.forceFresh,
    async getFreshValue() {
      return await sdk.client.fetch(`/store/reviews/${productId}`, {
        method: "GET",
        query: {
          ...query,
          offset: query.offset ?? 0,
          limit: query.limit ?? 10
        }
      });
    }
  });
};
const createProductReview = async (data2) => {
  return await sdk.client.fetch(`/store/reviews`, {
    method: "POST",
    body: {
      product_id: data2.product_id,
      name: data2.name,
      content: data2.content,
      stars: data2.stars
    }
  });
};
new MemoryFileStorage();
const schema$1 = z$1.object({
  product_id: z$1.string().min(1, "Product ID is required"),
  name: z$1.string().min(1, "Name is required"),
  stars: z$1.number().min(1, "Rating is required"),
  content: z$1.string().min(1, "Content is required")
});
async function action$4({
  request
}) {
  const formData = await parseFormData(request);
  console.log(formData);
  const {
    errors,
    data: parsedFormData
  } = await getValidatedFormData(formData, zodResolver(schema$1));
  console.log(errors);
  if (errors) {
    return data({
      errors
    }, {
      status: 400
    });
  }
  try {
    const review = await createProductReview(parsedFormData);
    return data({
      review,
      success: true
    });
  } catch (error) {
    console.error("product reviews error", error);
    return data({
      errors: {
        root: {
          message: "Something went wrong when creating or updating your product reviews."
        }
      }
    }, {
      status: 500
    });
  }
}
const route12 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  action: action$4
}, Symbol.toStringTag, { value: "Module" }));
const PageHeading = ({ className, ...props }) => /* @__PURE__ */ jsx("h1", { className: clsx("max-w-full break-words text-4xl font-bold md:text-6xl font-ballet", className), ...props });
const listCategories = async function() {
  return cachified({
    key: "list-categories",
    cache: sdkCache,
    staleWhileRevalidate: MILLIS.ONE_HOUR,
    ttl: MILLIS.TEN_SECONDS,
    async getFreshValue() {
      return _listCategories();
    }
  });
};
const _listCategories = async function() {
  return sdk.store.category.list({ fields: "+category_children" }).then(({ product_categories }) => product_categories);
};
const loader$h = async ({
  request,
  params
}) => {
  const handle = params.categoryHandle;
  const categories = await listCategories();
  const category = categories.find((c) => c.handle === handle);
  if (!category) {
    throw redirect("/products");
  }
  const {
    products,
    count,
    limit,
    offset
  } = await fetchProducts(request, {
    category_id: category.id
  });
  return {
    products,
    count,
    limit,
    offset,
    category,
    categories
  };
};
const categories_$categoryHandle = UNSAFE_withComponentProps(function ProductCategoryRoute() {
  const data2 = useLoaderData();
  if (!data2) return null;
  const {
    products,
    count,
    limit,
    offset,
    categories
  } = data2;
  return /* @__PURE__ */ jsxs(Container, {
    className: "pb-16",
    children: [/* @__PURE__ */ jsx(PageHeading, {
      className: "w-full text-center text-5xl xs:text-6xl md:text-8xl font-ballet mt-24 font-normal lg:font-normal",
      children: data2.category.name
    }), categories.length > 1 && /* @__PURE__ */ jsx("div", {
      className: "flex flex-col w-full items-center",
      children: /* @__PURE__ */ jsx("div", {
        className: "flex-1",
        children: /* @__PURE__ */ jsx("div", {
          className: "inline-flex gap-5 text-2xl font-italiana border-b border-primary mt-4 mb-8",
          children: categories.map((category) => /* @__PURE__ */ jsx(NavLink, {
            to: `/categories/${category.handle}`,
            prefetch: "viewport",
            className: ({
              isActive
            }) => clsx("h-full p-4", {
              "font-bold border-b-2 border-primary": isActive,
              "!border-none active:": !isActive
            }),
            children: category.name
          }, category.id))
        })
      })
    }), /* @__PURE__ */ jsx("div", {
      className: "flex flex-col gap-4 sm:flex-row",
      children: /* @__PURE__ */ jsx("div", {
        className: "flex-1",
        children: /* @__PURE__ */ jsx(ProductListWithPagination, {
          products,
          paginationConfig: {
            count,
            offset,
            limit
          },
          context: "products"
        })
      })
    })]
  });
});
const route13 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: categories_$categoryHandle,
  loader: loader$h
}, Symbol.toStringTag, { value: "Module" }));
const buildSitemapUrlSetXML = (urls) => `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${urls.map((url) => buildSiteMapUrlXML(url)).join("\n")}
    </urlset>
`;
const buildSiteMapUrlXML = (url) => `<url>
<loc>${url.loc}</loc>
${url.lastmod ? `<lastmod>${url.lastmod}</lastmod>` : ""}
${url.changefreq ? `<changefreq>${url.changefreq}</changefreq>` : ""}
${url.priority ? `<priority>${url.priority}</priority>` : ""}
</url>
`;
const loader$g = async ({
  request
}) => {
  const {
    collections
  } = await sdk.store.collection.list({
    limit: 1e3
  });
  const host = request.headers.get("host");
  const baseUrl = `https://${host}`;
  const collectionUrls = collections.map(({
    handle,
    updated_at
  }) => ({
    loc: `${baseUrl}/collections/${handle}`,
    lastmod: updated_at.toString(),
    priority: 0.8,
    changefreq: "weekly"
  }));
  const content = buildSitemapUrlSetXML(collectionUrls);
  return new Response(content, {
    status: 200,
    headers: {
      "Content-Type": "application/xml",
      "xml-version": "1.0",
      encoding: "UTF-8"
    }
  });
};
const route14 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  loader: loader$g
}, Symbol.toStringTag, { value: "Module" }));
const contactInfoSchema = z$1.object({
  cartId: z$1.string(),
  email: z$1.string().email("Please enter a valid email")
});
async function action$3(actionArgs) {
  const {
    errors,
    data: data$1
  } = await getValidatedFormData(actionArgs.request, zodResolver(contactInfoSchema));
  if (errors) {
    return data({
      errors
    }, {
      status: 400
    });
  }
  const {
    cart: cart2
  } = await updateCart(actionArgs.request, {
    email: data$1.email
  });
  return data({
    cart: cart2
  });
}
const route15 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  action: action$3,
  contactInfoSchema
}, Symbol.toStringTag, { value: "Module" }));
const alertClassNameMap = {
  default: {
    wrapper: "bg-gray-100",
    icon: "text-gray-400",
    title: "text-gray-800",
    content: "text-gray-700",
    action: "focus:ring-offset-2 bg-gray-50 text-gray-500 hover:bg-gray-100 focus:ring-offset-gray-50 focus:ring-gray-600"
  },
  success: {
    wrapper: "bg-green-50",
    icon: "text-green-400",
    title: "text-green-800",
    content: "text-green-700",
    action: "focus:ring-offset-2 bg-green-50 text-green-500 hover:bg-green-100 focus:ring-offset-green-50 focus:ring-green-600"
  },
  error: {
    wrapper: "bg-red-50",
    icon: "text-red-400",
    title: "text-red-800",
    content: "text-red-700",
    action: "focus:ring-offset-2 bg-red-50 text-red-500 hover:bg-red-100 focus:ring-offset-red-50 focus:ring-red-600"
  },
  warning: {
    wrapper: "bg-amber-50",
    icon: "text-amber-400",
    title: "text-amber-800",
    content: "text-amber-700",
    action: "focus:ring-offset-2 bg-amber-50 text-amber-500 hover:bg-amber-100 focus:ring-offset-amber-50 focus:ring-amber-600"
  },
  info: {
    wrapper: "bg-blue-50",
    icon: "text-blue-400",
    title: "text-blue-800",
    content: "text-blue-700",
    action: "focus:ring-offset-2 bg-green-50 text-green-500 hover:bg-green-100 focus:ring-offset-green-50 focus:ring-green-600"
  }
};
const Alert = ({ type, title, action: action2, children, className, ...props }) => {
  const iconMap = {
    default: InformationCircleIcon,
    success: CheckCircleIcon,
    error: XCircleIcon,
    warning: ExclamationTriangleIcon,
    info: InformationCircleIcon
  };
  const Icon = iconMap[type];
  const Action = action2;
  return /* @__PURE__ */ jsx("div", { className: clsx("@container rounded-md p-4", className, alertClassNameMap[type].wrapper), ...props, children: /* @__PURE__ */ jsxs("div", { className: "@sm:flex-row flex flex-col", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex", children: [
      /* @__PURE__ */ jsx("div", { className: "flex-shrink-0", children: /* @__PURE__ */ jsx(Icon, { className: clsx("h-5 w-5", alertClassNameMap[type].icon), "aria-hidden": "true" }) }),
      /* @__PURE__ */ jsxs("div", { className: "ml-3", children: [
        title && /* @__PURE__ */ jsx("h3", { className: clsx("text-sm font-bold", alertClassNameMap[type].title), children: title }),
        children && /* @__PURE__ */ jsx("div", { className: clsx("text-sm", alertClassNameMap[type].content, { "mt-1": !!title }), children })
      ] })
    ] }),
    Action && /* @__PURE__ */ jsx("div", { className: "ml-auto pl-3", children: /* @__PURE__ */ jsx("div", { className: "@sm:-mb-1.5 @sm:-mt-1.5 -mx-1.5 -mb-1.5 mt-1.5", children: /* @__PURE__ */ jsx(
      Action,
      {
        className: clsx(
          "inline-flex rounded-md p-1.5 focus:outline-none focus:ring-2",
          alertClassNameMap[type].action
        )
      }
    ) }) })
  ] }) });
};
const FormError = ({ className, error, onClearClick }) => {
  var _a, _b, _c, _d;
  const { formState } = useRemixFormContext();
  if (!((_b = (_a = formState.errors) == null ? void 0 : _a.root) == null ? void 0 : _b.message) && !error) return null;
  return /* @__PURE__ */ jsx(Alert, { type: "error", className: clsx("form__error my-6", className), children: error || ((_d = (_c = formState.errors) == null ? void 0 : _c.root) == null ? void 0 : _d.message) });
};
const ImageUploader = ({ className, ...props }) => {
  return /* @__PURE__ */ jsx(
    FileUploader,
    {
      encType: "multipart/form-data",
      multiple: true,
      types: ["JPG", "JPEG", "PNG", "GIF", "WEBP"],
      classes: clsx("!m-0 !border-none !p-0", className),
      label: "Upload or drop image file(s) here",
      ...props
    }
  );
};
const ImageUploadWithPreview = ({
  existingImages,
  className,
  name = "images",
  limit = 50,
  replace
}) => {
  var _a, _b;
  const imageUploaderComponentRef = useRef(null);
  const [files, setFiles] = useState([...existingImages || []]);
  const [error, setError] = useState("");
  const handleFileInputChange = (newFiles) => {
    var _a2;
    if (newFiles.length + files.length > limit && !replace) return setError(`Maximum number of images is ${limit}`);
    const fileInput = (_a2 = imageUploaderComponentRef.current) == null ? void 0 : _a2.querySelector(`input[type="file"]`);
    if (!fileInput) return;
    const dataTransfer = new DataTransfer();
    const currentFiles = Array.from(files || []).filter((file) => file instanceof File);
    if (!replace) currentFiles.forEach((file) => dataTransfer.items.add(file));
    const newFileArray = Array.from(newFiles || []);
    newFileArray.forEach((file) => dataTransfer.items.add(file));
    fileInput.files = dataTransfer.files;
    if (replace) return setFiles(newFileArray);
    setFiles([...files, ...newFileArray]);
  };
  const handleFileDelete = (removeIndex) => {
    var _a2;
    const fileInput = (_a2 = imageUploaderComponentRef.current) == null ? void 0 : _a2.querySelector(`input[type="file"]`);
    if (!fileInput) return;
    const dataTransfer = new DataTransfer();
    const filteredFiles = files.filter((file, index) => index !== removeIndex && file instanceof File);
    filteredFiles.forEach((file) => dataTransfer.items.add(file));
    if (filteredFiles.length) fileInput.files = dataTransfer.files;
    else fileInput.files = null;
    const newFiles = files.filter((url, index) => index !== removeIndex);
    setFiles(newFiles);
  };
  const urls = useMemo(
    () => files.map((file) => {
      if (file instanceof File) return URL.createObjectURL(file);
      return file.url;
    }),
    [files]
  );
  const keepExistingImages = existingImages == null ? void 0 : existingImages.filter((image) => urls.includes(image.url));
  return /* @__PURE__ */ jsxs("div", { ref: imageUploaderComponentRef, className: clsx("[&_input]:!h-0 [&_input]:!opacity-0", className), children: [
    keepExistingImages && keepExistingImages.length > 0 && /* @__PURE__ */ jsx(
      "input",
      {
        type: "hidden",
        name: "existing_images",
        value: (_b = (_a = keepExistingImages == null ? void 0 : keepExistingImages.filter((image) => image.url)) == null ? void 0 : _a.map((image) => image.url)) == null ? void 0 : _b.filter(Boolean)
      }
    ),
    /* @__PURE__ */ jsx(FormError, { className: "my-2", error }),
    /* @__PURE__ */ jsx(
      ImageUploader,
      {
        handleChange: handleFileInputChange,
        name,
        types: ["JPG", "JPEG", "PNG", "GIF", "WEBP", "AVIF"],
        children: /* @__PURE__ */ jsxs("div", { className: "flex  items-center justify-center gap-2 rounded-md border border-dashed border-gray-300 px-2 py-4 hover:border-gray-500", children: [
          /* @__PURE__ */ jsxs(
            "svg",
            {
              className: "text-primary relative top-0.5",
              width: "24",
              height: "24",
              viewBox: "0 0 32 32",
              fill: "none",
              xmlns: "http://www.w3.org/2000/svg",
              children: [
                /* @__PURE__ */ jsx(
                  "path",
                  {
                    d: "M5.33317 6.66667H22.6665V16H25.3332V6.66667C25.3332 5.196 24.1372 4 22.6665 4H5.33317C3.8625 4 2.6665 5.196 2.6665 6.66667V22.6667C2.6665 24.1373 3.8625 25.3333 5.33317 25.3333H15.9998V22.6667H5.33317V6.66667Z",
                    fill: "currentColor"
                  }
                ),
                /* @__PURE__ */ jsx(
                  "path",
                  {
                    d: "M10.6665 14.6667L6.6665 20H21.3332L15.9998 12L11.9998 17.3333L10.6665 14.6667Z",
                    fill: "currentColor"
                  }
                ),
                /* @__PURE__ */ jsx(
                  "path",
                  {
                    d: "M25.3332 18.6667H22.6665V22.6667H18.6665V25.3333H22.6665V29.3333H25.3332V25.3333H29.3332V22.6667H25.3332V18.6667Z",
                    fill: "currentColor"
                  }
                )
              ]
            }
          ),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("span", { className: "text-sm font-medium text-gray-900 underline", children: `Upload image${limit > 1 ? "s" : ""}` }),
            " ",
            /* @__PURE__ */ jsx("span", { className: "text-sm text-gray-500", children: "or drag and drop" })
          ] })
        ] })
      }
    ),
    /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-2", children: urls.map((url, index) => /* @__PURE__ */ jsxs(
      "div",
      {
        className: "group relative my-2 h-24 w-24 flex-shrink-0  justify-center overflow-hidden rounded-md border border-gray-100 bg-white text-sm font-bold uppercase text-gray-900 hover:bg-gray-50 focus:outline-none focus:ring-1",
        onClick: () => handleFileDelete(index),
        children: [
          /* @__PURE__ */ jsx(
            Image,
            {
              src: url,
              alt: "preview-thumbnail",
              className: "h-full w-full object-contain object-center transition group-hover:scale-110"
            }
          ),
          /* @__PURE__ */ jsx("div", { className: "pointer-events-none absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 transition group-hover:bg-opacity-50", children: /* @__PURE__ */ jsx(TrashIcon, { className: "h-8 w-8 text-white opacity-0 transition group-hover:opacity-100" }) })
        ]
      },
      url
    )) })
  ] });
};
const Actions = ({ className, ...props }) => /* @__PURE__ */ jsx("div", { className: clsx("mt-6 flex items-center gap-2", className), ...props });
const FieldLabel = ({ className, labelComponent, children, ...props }) => {
  if (!labelComponent && !children) return null;
  if (labelComponent) return labelComponent(props);
  return /* @__PURE__ */ jsxs("div", { className: "flex justify-between text-sm", children: [
    /* @__PURE__ */ jsx("label", { ...props, className: clsx("field__label mb-1 whitespace-pre-wrap font-bold text-gray-700", className), children }),
    props.optional && /* @__PURE__ */ jsx("span", { className: "font-normal text-gray-500", children: "Optional" })
  ] });
};
const SubmitButton = ({ children, ...props }) => {
  const { formState } = useRemixFormContext();
  return /* @__PURE__ */ jsx(Button, { variant: "primary", type: "submit", disabled: formState.isSubmitting, ...props, children: children || (formState.isSubmitting ? "Submitting..." : "Submit") });
};
const StarRating = ({ value, ...props }) => {
  if (typeof value !== "number") return null;
  return /* @__PURE__ */ jsx(
    Rating,
    {
      style: { maxWidth: 120 },
      itemStyles: {
        itemShapes: RoundedStar,
        activeFillColor: "#fbbf24",
        inactiveFillColor: "#bdbdbd"
      },
      value,
      ...props
    }
  );
};
const schema = z$1.object({
  id: z$1.string().optional(),
  order_id: z$1.string().min(1, "Order is required"),
  order_line_item_id: z$1.string().min(1, "Line item is required"),
  rating: z$1.number().min(1, "Rating is required"),
  content: z$1.string().optional().default(""),
  existing_images: z$1.string().optional(),
  review_request_id: z$1.string().optional()
});
const ProductReviewForm = ({
  setEditing,
  productReview,
  requestId,
  lineItem,
  orderId
}) => {
  var _a, _b, _c, _d;
  const isComplete = productReview == null ? void 0 : productReview.id;
  const fetcher = useFetcher();
  useEffect(() => {
    var _a2;
    if ((_a2 = fetcher.data) == null ? void 0 : _a2.success) {
      setEditing(false);
    }
  }, [(_a = fetcher.data) == null ? void 0 : _a.success]);
  const formRef = useRef(null);
  const defaultValues = productReview ? { rating: productReview.rating, content: productReview.content, images: productReview.images } : { rating: 5, content: "" };
  const existingImages = (productReview == null ? void 0 : productReview.images) || [];
  const form = useRemixForm({
    resolver: zodResolver(schema),
    fetcher,
    submitHandlers: {
      onValid: (data2) => {
        fetcher.submit(formRef.current, {
          method: "post",
          action: "/api/product-reviews/upsert",
          encType: "multipart/form-data"
        });
      }
    },
    submitConfig: {
      method: "post",
      encType: "multipart/form-data",
      action: "/api/product-reviews/upsert"
    },
    defaultValues: {
      ...defaultValues,
      order_id: orderId,
      order_line_item_id: lineItem.id,
      id: productReview == null ? void 0 : productReview.id,
      review_request_id: requestId
    }
  });
  const ratingValue = form.watch("rating");
  return /* @__PURE__ */ jsx(RemixFormProvider, { ...form, children: /* @__PURE__ */ jsxs(fetcher.Form, { ref: formRef, onSubmit: form.handleSubmit, children: [
    /* @__PURE__ */ jsx(FormError, { className: "mt-0" }),
    /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap justify-between gap-4", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h3", { className: "text-base text-gray-900", children: /* @__PURE__ */ jsx(Link, { to: `/products/${(_c = (_b = lineItem.variant) == null ? void 0 : _b.product) == null ? void 0 : _c.handle}`, children: lineItem.title }) }),
        /* @__PURE__ */ jsx("p", { className: "text-sm font-normal text-gray-500", children: (_d = lineItem.variant) == null ? void 0 : _d.title })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx(FieldLabel, { htmlFor: "rating", children: "Select a rating" }),
        /* @__PURE__ */ jsx(StarRating, { onChange: (value) => form.setValue("rating", value), value: ratingValue })
      ] })
    ] }),
    /* @__PURE__ */ jsx(TextField, { type: "hidden", name: "rating", value: ratingValue }),
    /* @__PURE__ */ jsx(TextField, { type: "hidden", name: "order_id", value: orderId }),
    /* @__PURE__ */ jsx(TextField, { type: "hidden", name: "order_line_item_id", value: lineItem.id }),
    requestId && /* @__PURE__ */ jsx(TextField, { type: "hidden", name: "review_request_id", value: requestId }),
    isComplete && /* @__PURE__ */ jsx(TextField, { type: "hidden", name: "id", value: productReview.id }),
    /* @__PURE__ */ jsx(ImageUploadWithPreview, { existingImages, className: "mb-2 mt-6" }),
    /* @__PURE__ */ jsx(Textarea, { name: "content", placeholder: "Add your review", className: "sm:col-span-12" }),
    /* @__PURE__ */ jsxs(Actions, { children: [
      isComplete && /* @__PURE__ */ jsx(Button, { onClick: () => setEditing(false), children: "Cancel" }),
      /* @__PURE__ */ jsx(SubmitButton, { children: isComplete ? "Save" : "Submit Review" })
    ] })
  ] }) });
};
const LightboxGallery = ({ images, lightBoxIndex, setLightBoxIndex }) => {
  const photos = images.map((image) => ({
    src: image.src,
    alt: image.alt || "",
    description: image.alt,
    width: image.width || 500,
    height: image.height || 500
  }));
  const lightboxPlugins = [Fullscreen, Zoom, Thumbnails, Captions];
  return /* @__PURE__ */ jsx(
    Lightbox,
    {
      slides: photos,
      open: lightBoxIndex >= 0,
      index: lightBoxIndex,
      close: () => setLightBoxIndex(-1),
      plugins: lightboxPlugins,
      zoom: {
        maxZoomPixelRatio: 4
      },
      captions: {
        descriptionTextAlign: "center"
      },
      render: {
        slide: ({ slide }) => /* @__PURE__ */ jsx(
          ImageBase,
          {
            src: slide.src,
            alt: slide.alt,
            style: {
              maxWidth: "100%",
              maxHeight: "100%"
            }
          }
        ),
        thumbnail: ({ slide }) => /* @__PURE__ */ jsx(ImageBase, { src: slide.src, alt: slide.alt })
      }
    }
  );
};
const ScrollArrowButtons = ({
  className,
  orientation = "horizontal",
  showStartArrow,
  showEndArrow,
  handleArrowClick
}) => {
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: clsx(
        "scroll-arrow-buttons pointer-events-none absolute flex justify-between",
        {
          "-left-5 top-1/2 w-[calc(100%+2.3rem)]": orientation === "horizontal",
          "-top-5 left-1/2 h-[calc(100%+2.3rem)] flex-col": orientation === "vertical"
        },
        className
      ),
      children: [
        /* @__PURE__ */ jsx(
          IconButton,
          {
            "aria-label": "Scroll section toward the start",
            onClick: () => handleArrowClick("start"),
            className: clsx(
              "text-primary bg-primary-200 hover:bg-primary-400 hover:text-primary-800 focus:text-primary-800 z-10 opacity-0 transition-opacity",
              {
                "pointer-events-auto opacity-100": showStartArrow,
                "rotate-90 transform": orientation === "vertical"
              }
            ),
            icon: ArrowLeftIcon
          }
        ),
        /* @__PURE__ */ jsx(
          IconButton,
          {
            "aria-label": "Scroll section toward the end",
            onClick: () => handleArrowClick("end"),
            className: clsx(
              "text-primary bg-primary-200 hover:bg-primary-400 hover:text-primary-800 focus:text-primary-800 z-10 opacity-0 transition-opacity",
              {
                "pointer-events-auto opacity-100": showEndArrow,
                "rotate-90 transform": orientation === "vertical"
              }
            ),
            icon: ArrowRightIcon
          }
        )
      ]
    }
  );
};
const updateArrowsVisibility = ({
  scrollableDiv,
  buffer
}) => {
  if (!scrollableDiv) return { showStartArrow: false, showEndArrow: true };
  const isHorizontal = scrollableDiv.scrollWidth > scrollableDiv.clientWidth;
  const scrollPos = isHorizontal ? scrollableDiv.scrollLeft : scrollableDiv.scrollTop;
  const scrollSize = isHorizontal ? scrollableDiv.scrollWidth : scrollableDiv.scrollHeight;
  const clientSize = isHorizontal ? scrollableDiv.clientWidth : scrollableDiv.clientHeight;
  const showStartArrow = scrollPos > buffer;
  const showEndArrow = scrollPos < scrollSize - clientSize - buffer;
  return { showStartArrow, showEndArrow };
};
const useScrollArrows = ({
  buffer = 5,
  resetOnDepChange = []
}) => {
  const scrollableDivRef = useRef(null);
  const initialArrowsVisibility = useMemo(
    () => updateArrowsVisibility({
      scrollableDiv: scrollableDivRef.current,
      buffer
    }),
    [scrollableDivRef.current, buffer]
  );
  const [showStartArrow, setShowStartArrow] = useState(initialArrowsVisibility.showStartArrow);
  const [showEndArrow, setShowEndArrow] = useState(initialArrowsVisibility.showEndArrow);
  useEffect(() => {
    const handleScroll = debounce(() => {
      const { showStartArrow: showStartArrow2, showEndArrow: showEndArrow2 } = updateArrowsVisibility({
        scrollableDiv: scrollableDivRef.current,
        buffer
      });
      setShowStartArrow(showStartArrow2);
      setShowEndArrow(showEndArrow2);
    }, 100);
    const handleResize = debounce(() => {
      const { showStartArrow: showStartArrow2, showEndArrow: showEndArrow2 } = updateArrowsVisibility({
        scrollableDiv: scrollableDivRef.current,
        buffer
      });
      setShowStartArrow(showStartArrow2);
      setShowEndArrow(showEndArrow2);
    }, 100);
    if (scrollableDivRef.current) {
      scrollableDivRef.current.addEventListener("scroll", handleScroll);
      window.addEventListener("resize", handleResize);
    }
    return () => {
      if (scrollableDivRef.current) {
        scrollableDivRef.current.removeEventListener("scroll", handleScroll);
        window.removeEventListener("resize", handleResize);
        handleScroll.cancel();
        handleResize.cancel();
      }
    };
  }, []);
  useEffect(() => {
    if (!scrollableDivRef.current) return;
    scrollableDivRef.current.scrollTo(0, 0);
    const { showStartArrow: showStartArrow2, showEndArrow: showEndArrow2 } = updateArrowsVisibility({
      scrollableDiv: scrollableDivRef.current,
      buffer
    });
    setShowStartArrow(showStartArrow2);
    setShowEndArrow(showEndArrow2);
  }, resetOnDepChange);
  const handleArrowClick = (arrowDirection) => {
    if (!scrollableDivRef.current) return;
    const isHorizontal = scrollableDivRef.current.scrollWidth > scrollableDivRef.current.clientWidth;
    const visibleSize = isHorizontal ? scrollableDivRef.current.clientWidth : scrollableDivRef.current.clientHeight;
    const scrollAmount = arrowDirection === "end" ? visibleSize : -visibleSize;
    const scrollToOptions = { behavior: "smooth" };
    if (isHorizontal) {
      scrollToOptions["left"] = scrollAmount;
    } else {
      scrollToOptions["top"] = scrollAmount;
    }
    scrollableDivRef.current.scrollBy(scrollToOptions);
  };
  return { scrollableDivRef, showStartArrow, showEndArrow, handleArrowClick };
};
const GalleryImagesRow = memo(
  ({ galleryImages, onClick }) => {
    return /* @__PURE__ */ jsx("div", { className: "py flex flex-row gap-2 after:block after:h-8 after:w-8 after:min-w-[8px] after:content-[''] md:p-0", children: galleryImages.map((image, imageIndex) => /* @__PURE__ */ jsxs(
      "div",
      {
        onClick: () => {
          if (typeof onClick === "function") onClick(imageIndex);
        },
        className: "group relative flex h-24 w-24 flex-shrink-0  justify-center overflow-hidden rounded-md border border-gray-100 bg-white text-sm font-bold uppercase text-gray-900 hover:bg-gray-50 focus:outline-none focus:ring-1",
        children: [
          /* @__PURE__ */ jsx(
            Image,
            {
              src: image.url,
              alt: "Gallery Image",
              className: "h-full w-full object-contain object-center transition group-hover:scale-110"
            }
          ),
          /* @__PURE__ */ jsx("div", { className: "pointer-events-none absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 transition group-hover:bg-opacity-50", children: /* @__PURE__ */ jsx(MagnifyingGlassPlusIcon, { className: "h-8 w-8 text-white opacity-0 transition group-hover:opacity-100" }) })
        ]
      },
      image.url
    )) });
  }
);
const ReviewImageThumbnailRow = ({ galleryImages, onClick }) => {
  if (!galleryImages) return null;
  const { scrollableDivRef, showStartArrow, showEndArrow, handleArrowClick } = useScrollArrows({
    buffer: 50,
    resetOnDepChange: [galleryImages]
  });
  return /* @__PURE__ */ jsxs("div", { className: "py-4", children: [
    /* @__PURE__ */ jsx("h2", { className: "sr-only", children: "Images" }),
    /* @__PURE__ */ jsx("div", { className: "flex flex-col-reverse gap-4", children: galleryImages.length > 0 && /* @__PURE__ */ jsxs("div", { className: "flex-grow-1 relative mx-auto h-24 w-full pt-4", children: [
      /* @__PURE__ */ jsx(
        ScrollArrowButtons,
        {
          className: "top-1/3",
          showStartArrow,
          showEndArrow,
          handleArrowClick
        }
      ),
      /* @__PURE__ */ jsx("div", { className: "relative -m-4 block h-24 overflow-hidden p-8 ", children: /* @__PURE__ */ jsx("div", { ref: scrollableDivRef, className: "absolute -bottom-4 left-4 right-4 top-0 h-32 overflow-x-auto ", children: /* @__PURE__ */ jsx(GalleryImagesRow, { galleryImages, onClick }) }) })
    ] }) })
  ] });
};
const ProductReviewView = ({
  lineItem,
  rating,
  content,
  galleryImages,
  setEditing
}) => {
  var _a, _b, _c;
  const [lightboxIndex, setLightboxIndex] = useState(-1);
  return /* @__PURE__ */ jsxs(Fragment$1, { children: [
    /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap justify-between space-y-2", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h3", { className: "text-base text-gray-900", children: /* @__PURE__ */ jsx(Link, { to: `/products/${(_b = (_a = lineItem.variant) == null ? void 0 : _a.product) == null ? void 0 : _b.handle}`, children: lineItem.title }) }),
        /* @__PURE__ */ jsx("p", { className: "text-sm font-normal text-gray-500", children: (_c = lineItem.variant) == null ? void 0 : _c.title })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1", children: [
        /* @__PURE__ */ jsx(StarRating, { value: rating ?? 0, readOnly: true }),
        typeof setEditing === "function" && /* @__PURE__ */ jsx(IconButton, { icon: () => /* @__PURE__ */ jsx(PencilIcon, { className: "text-primary h-5" }), onClick: () => setEditing(true) })
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "rounded border border-gray-200 bg-gray-100 p-2", children: content }),
    galleryImages && galleryImages.length > 0 && /* @__PURE__ */ jsxs(Fragment$1, { children: [
      /* @__PURE__ */ jsx(ReviewImageThumbnailRow, { galleryImages, onClick: setLightboxIndex }),
      /* @__PURE__ */ jsx(
        LightboxGallery,
        {
          images: galleryImages.map(({ url, ...image }) => ({ ...image, src: url })),
          lightBoxIndex: lightboxIndex,
          setLightBoxIndex: setLightboxIndex
        }
      )
    ] })
  ] });
};
const ProductReviewComponent = ({ lineItem, productReview, requestId, orderId }) => {
  var _a;
  if (!lineItem) return null;
  const [editing, setEditing] = useState(!productReview);
  return /* @__PURE__ */ jsxs("div", { className: "xs:grid my-4 grid-cols-6 gap-8 sm:grid-cols-5", children: [
    lineItem.thumbnail && /* @__PURE__ */ jsx("div", { className: "col-span-2 mb-2 sm:col-span-1 sm:mb-0", children: /* @__PURE__ */ jsx(
      Image,
      {
        src: lineItem.thumbnail,
        alt: lineItem.title,
        className: " h-24 w-24 flex-none rounded-md bg-gray-100 object-cover object-center"
      }
    ) }),
    /* @__PURE__ */ jsx("div", { className: "col-span-4 flex flex-auto flex-col gap-y-2", children: !editing && productReview ? /* @__PURE__ */ jsx(
      ProductReviewView,
      {
        lineItem,
        rating: productReview == null ? void 0 : productReview.rating,
        content: productReview == null ? void 0 : productReview.content,
        galleryImages: (productReview == null ? void 0 : productReview.images) ? (_a = productReview.images) == null ? void 0 : _a.map((image) => ({
          url: image.url,
          alt: "Customer's review image",
          name: "Customer's review image"
        })) : void 0,
        setEditing
      }
    ) : /* @__PURE__ */ jsx(
      ProductReviewForm,
      {
        lineItem,
        productReview,
        requestId,
        setEditing,
        orderId
      }
    ) })
  ] });
};
const loader$f = async ({
  request,
  params
}) => {
  const {
    order
  } = await sdk.store.order.retrieve(params.orderId || "", {});
  if (!order) throw redirect("/");
  const {
    product_reviews
  } = await fetchProductReviews({
    order_id: order.id
  }, {
    forceFresh: true
  });
  return {
    order,
    product_reviews
  };
};
const orders__$orderId_reviews = UNSAFE_withComponentProps(function OrderReviewsRoute() {
  var _a;
  const {
    order,
    product_reviews
  } = useLoaderData();
  const fulfilledItems = order.items || [];
  const uniqueItems = {};
  for (const item of fulfilledItems) {
    uniqueItems[item.product_id] = item;
  }
  return /* @__PURE__ */ jsx("section", {
    children: /* @__PURE__ */ jsx(Container, {
      className: "!max-w-3xl pb-16",
      children: /* @__PURE__ */ jsx("div", {
        className: "rounded-lg border border-gray-200 bg-white shadow-sm",
        children: /* @__PURE__ */ jsxs("div", {
          className: "p-8 sm:p-12 lg:p-16",
          children: [/* @__PURE__ */ jsxs("div", {
            className: "flex flex-wrap items-center gap-4 border-b border-gray-200 p-4",
            children: [/* @__PURE__ */ jsxs("dl", {
              className: "mr-4 flex flex-wrap gap-x-6 gap-y-4",
              children: [/* @__PURE__ */ jsxs("div", {
                children: [/* @__PURE__ */ jsx("dt", {
                  className: "text-2xs font-bold text-gray-900",
                  children: "Order"
                }), /* @__PURE__ */ jsxs("dd", {
                  className: "mt-1 text-gray-500",
                  children: ["#", order.display_id]
                })]
              }), /* @__PURE__ */ jsxs("div", {
                children: [/* @__PURE__ */ jsx("dt", {
                  className: "text-2xs font-bold text-gray-900",
                  children: "Date placed"
                }), /* @__PURE__ */ jsx("dd", {
                  className: "mt-1 text-gray-500",
                  children: /* @__PURE__ */ jsx("time", {
                    dateTime: order.created_at,
                    children: formatDate(new Date(order.created_at))
                  })
                })]
              })]
            }), /* @__PURE__ */ jsx("div", {
              className: "flex-auto"
            })]
          }), /* @__PURE__ */ jsx("ul", {
            role: "list",
            className: "mt-4 divide-y divide-gray-200 text-sm font-bold text-gray-500",
            children: (_a = Object.values(uniqueItems)) == null ? void 0 : _a.map((item) => {
              const review = product_reviews ? product_reviews.find((review2) => review2.product_id === item.variant.product_id) : void 0;
              return /* @__PURE__ */ jsx("li", {
                children: /* @__PURE__ */ jsx(ProductReviewComponent, {
                  orderId: order.id,
                  lineItem: item,
                  productReview: review
                })
              }, item.id);
            })
          }), /* @__PURE__ */ jsx("div", {
            className: "mt-16 border-t border-gray-200 pt-6 text-right",
            children: /* @__PURE__ */ jsx(Link, {
              to: "/products",
              children: /* @__PURE__ */ jsxs(ButtonLink, {
                className: "font-bold no-underline",
                children: ["Continue Shopping", /* @__PURE__ */ jsx("span", {
                  "aria-hidden": "true",
                  children: " →"
                })]
              })
            })
          })]
        })
      })
    })
  });
});
const route16 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: orders__$orderId_reviews,
  loader: loader$f
}, Symbol.toStringTag, { value: "Module" }));
const ProductCarouselSkeleton = ({ length }) => /* @__PURE__ */ jsx("div", { className: "xs:grid-cols-2 grid grid-cols-1 gap-y-10 gap-x-6 md:!grid-cols-3 xl:!grid-cols-4 xl:gap-x-8", children: Array.from({ length }, (_, i) => /* @__PURE__ */ jsx(EmptyProductListItem, {}, i)) });
const ProductRow = memo(({ products }) => {
  return /* @__PURE__ */ jsx(Fragment$1, { children: products.map((product2) => /* @__PURE__ */ jsx(
    "div",
    {
      className: "xs:w-[31.2%] xs:snap-start mr-6 inline-block w-[100%] snap-center last:mr-0 sm:mr-6 sm:snap-start md:w-[31.2%] xl:mr-8 xl:w-[23%]",
      children: /* @__PURE__ */ jsx(NavLink, { prefetch: "viewport", to: `/products/${product2.handle}`, viewTransition: true, children: ({ isTransitioning }) => /* @__PURE__ */ jsx(ProductListItem, { isTransitioning, product: product2 }) })
    },
    product2.id
  )) });
});
const ProductCarousel = ({ products, className }) => {
  const { scrollableDivRef, ...scrollArrowProps } = useScrollArrows({
    buffer: 100,
    resetOnDepChange: [products]
  });
  if (!products) return /* @__PURE__ */ jsx(ProductCarouselSkeleton, { length: 4 });
  return /* @__PURE__ */ jsxs("div", { className: clsx("product-carousel relative", className), children: [
    /* @__PURE__ */ jsx(
      "div",
      {
        ref: scrollableDivRef,
        className: "w-full snap-both snap-mandatory overflow-x-auto whitespace-nowrap pb-2 sm:snap-proximity",
        children: /* @__PURE__ */ jsx(ProductRow, { products })
      }
    ),
    /* @__PURE__ */ jsx(ScrollArrowButtons, { className: "-mt-12", ...scrollArrowProps })
  ] });
};
const TabButton = forwardRef(({ selected, className, ...props }, ref) => /* @__PURE__ */ jsx(
  Button,
  {
    ref,
    size: "sm",
    className: clsx(
      "whitespace-nowrap !rounded-full",
      {
        "!bg-white !text-gray-700 shadow-sm": selected,
        "!text-primary-600 hover:!text-primary-800 hover:!bg-primary-100 !border-transparent !bg-transparent": !selected
      },
      className
    ),
    ...props
  }
));
const TabList = ({ className, ...props }) => /* @__PURE__ */ jsx(
  TabList$1,
  {
    className: clsx(
      "bg-primary-50 mb-2 inline-flex w-auto max-w-full snap-x gap-0.5 overflow-auto rounded-full px-2 py-1.5",
      className
    ),
    ...props
  }
);
const ProductCategoryTabs = ({ categories, ...props }) => {
  if (!(categories == null ? void 0 : categories.length)) return null;
  return /* @__PURE__ */ jsx(Tab.Group, { ...props, children: /* @__PURE__ */ jsxs(TabList, { children: [
    /* @__PURE__ */ jsx(Tab, { as: Fragment, children: ({ selected }) => /* @__PURE__ */ jsx(TabButton, { selected, children: "All" }) }),
    categories.map((category) => /* @__PURE__ */ jsx(Tab, { as: Fragment, children: ({ selected }) => /* @__PURE__ */ jsx(TabButton, { selected, children: category.name }) }, category.id))
  ] }) });
};
const ProductCollectionTabs = ({ collections, ...props }) => {
  if (!(collections == null ? void 0 : collections.length)) return null;
  return /* @__PURE__ */ jsx(Tab.Group, { ...props, children: /* @__PURE__ */ jsxs(TabList, { children: [
    /* @__PURE__ */ jsx(Tab, { as: Fragment, children: ({ selected }) => /* @__PURE__ */ jsx(TabButton, { selected, children: "All" }) }),
    collections.map((collection) => /* @__PURE__ */ jsx(Tab, { as: Fragment, children: ({ selected }) => /* @__PURE__ */ jsx(TabButton, { selected, children: collection.title }) }, collection.id))
  ] }) });
};
const ProductListBase = () => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [selectedTab, setSelectedTab] = useState(void 0);
  const fetcher = useFetcher();
  const params = useParams();
  const { collection_tabs, category_tabs, products } = fetcher.data || {};
  const filteredProducts = params.productHandle ? products == null ? void 0 : products.filter((product2) => product2.handle !== params.productHandle) : products;
  const hasCollectionTabs = !!(collection_tabs == null ? void 0 : collection_tabs.length);
  const hasCategoryTabs = !!(category_tabs == null ? void 0 : category_tabs.length);
  const hasProducts = isInitialized && !(filteredProducts == null ? void 0 : filteredProducts.length);
  const fetchData = (filters) => {
    const queryString = buildSearchParamsFromObject({
      subloader: "productList",
      data: JSON.stringify({
        content: filters
      })
    });
    fetcher.load(`/api/page-data?${queryString}`);
  };
  useEffect(() => {
    if (fetcher.data || fetcher.state === "loading") {
      return;
    }
    fetchData();
  }, []);
  const handleTabChange = (index, type) => {
    if (type === "collection") {
      const collection = collection_tabs == null ? void 0 : collection_tabs[index - 1];
      setSelectedTab(index);
      fetchData({ collection_id: [collection == null ? void 0 : collection.id] });
    }
    if (type === "category") {
      const category = category_tabs == null ? void 0 : category_tabs[index - 1];
      setSelectedTab(index);
      fetchData({ category_id: [category == null ? void 0 : category.id] });
    }
  };
  useEffect(() => {
    if (!isInitialized && fetcher.data) {
      setIsInitialized(true);
    }
  }, [fetcher.data]);
  return /* @__PURE__ */ jsxs(Fragment$1, { children: [
    hasCollectionTabs && /* @__PURE__ */ jsx("div", { className: "pb-6", children: /* @__PURE__ */ jsx(
      ProductCollectionTabs,
      {
        selectedIndex: selectedTab,
        collections: collection_tabs,
        onChange: (index) => handleTabChange(index, "collection")
      }
    ) }),
    hasCategoryTabs && /* @__PURE__ */ jsxs("div", { className: "pb-6", children: [
      /* @__PURE__ */ jsx(
        ProductCategoryTabs,
        {
          selectedIndex: selectedTab,
          categories: category_tabs,
          onChange: (index) => handleTabChange(index, "category")
        }
      ),
      " "
    ] }),
    hasProducts && /* @__PURE__ */ jsx("div", { className: "mb-8 mt-8", children: /* @__PURE__ */ jsxs("h3", { className: "text-lg font-bold text-gray-900", children: [
      "There are no products to show",
      hasCollectionTabs || hasCategoryTabs ? ` in this ${hasCollectionTabs ? "collection" : "category"}.` : ""
    ] }) }),
    !hasProducts && /* @__PURE__ */ jsx(ProductCarousel, { products: filteredProducts })
  ] });
};
const ProductList = memo(({ className, heading, text, actions: actions2, ...props }) => {
  return /* @__PURE__ */ jsx("section", { className: clsx(`mkt-section relative overflow-x-hidden`, className), ...props, children: /* @__PURE__ */ jsx("div", { className: "mkt-section__inner relative z-[2]", children: /* @__PURE__ */ jsxs(Container, { children: [
    /* @__PURE__ */ jsxs("p", { className: "text-center mb-12", children: [
      /* @__PURE__ */ jsx("span", { className: "text-5xl font-title font-extrabold text-64px leading-48px uppercase", children: "Something" }),
      /* @__PURE__ */ jsx("span", { className: "text-6xl font-centuryBook italic text-64px leading-48px pl-2", children: "New?" })
    ] }),
    /* @__PURE__ */ jsx(ProductListBase, { ...props })
  ] }) }) });
});
const Grid = ({ className, ...props }) => /* @__PURE__ */ jsx("div", { className: clsx("grid grid-cols-12 gap-3 sm:gap-4 md:gap-6 lg:gap-8 xl:gap-10", className), ...props });
const GridColumn = ({ className, ...props }) => /* @__PURE__ */ jsx("div", { className: clsx("col-span-12", className), ...props });
const QuantitySelector = ({ className, variant, maxInventory = 10, onChange }) => {
  const formContext = useRemixFormContext();
  if (!formContext) {
    console.error("QuantitySelector must be used within a RemixFormProvider");
    return null;
  }
  const { control } = formContext;
  const variantInventory = (variant == null ? void 0 : variant.manage_inventory) && !variant.allow_backorder ? variant.inventory_quantity || 0 : maxInventory;
  const handleDecrement = (currentValue, onChange2) => {
    const newValue = Math.max(1, currentValue - 1);
    onChange2(newValue);
    onChange2 == null ? void 0 : onChange2(newValue);
  };
  const handleIncrement = (currentValue, onChange2) => {
    const newValue = Math.min(variantInventory, currentValue + 1);
    onChange2(newValue);
    onChange2 == null ? void 0 : onChange2(newValue);
  };
  const handleInputChange = (value, onChange2) => {
    const numValue = parseInt(value, 10) || 1;
    const clampedValue = Math.max(1, Math.min(variantInventory, numValue));
    onChange2(clampedValue);
    onChange2 == null ? void 0 : onChange2(clampedValue);
  };
  return /* @__PURE__ */ jsx(
    Controller,
    {
      name: "quantity",
      control,
      render: ({ field }) => /* @__PURE__ */ jsxs("div", { className: clsx("flex items-center border border-gray-300 rounded-full px-2", className), children: [
        /* @__PURE__ */ jsx("label", { htmlFor: "quantity", className: "sr-only", children: "Quantity" }),
        /* @__PURE__ */ jsx(
          "button",
          {
            type: "button",
            className: "bg-highlight flex items-center justify-center p-1 text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors duration-200 rounded-full",
            onClick: () => handleDecrement(field.value || 1, field.onChange),
            disabled: (field.value || 1) <= 1,
            children: /* @__PURE__ */ jsx(MinusIcon, { className: "h-4 w-4" })
          }
        ),
        /* @__PURE__ */ jsx(
          "input",
          {
            ...field,
            type: "text",
            inputMode: "numeric",
            id: "quantity",
            className: "w-12 text-center border-0 focus:ring-0 focus:outline-none text-base font-medium px-1 py-2",
            value: field.value || "1",
            onChange: (e) => handleInputChange(e.target.value, field.onChange),
            min: 1,
            max: variantInventory
          }
        ),
        /* @__PURE__ */ jsx(
          "button",
          {
            type: "button",
            className: "bg-highlight flex items-center justify-center p-1 text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors duration-200 rounded-full",
            onClick: () => handleIncrement(field.value || 1, field.onChange),
            disabled: (field.value || 1) >= variantInventory,
            children: /* @__PURE__ */ jsx(PlusIcon, { className: "h-4 w-4" })
          }
        )
      ] })
    }
  );
};
memo(({ galleryImages }) => {
  return /* @__PURE__ */ jsx(Fragment$1, { children: galleryImages.map((image, imageIndex) => /* @__PURE__ */ jsx(
    Tab,
    {
      className: "relative mb-0 mr-0 inline-block h-16 w-16 flex-none snap-start whitespace-nowrap rounded-lg overflow-hidden bg-white text-sm font-medium uppercase text-gray-900 last:mb-0 hover:bg-gray-50 focus:outline-none focus:ring-0 transition-all duration-200 lg:mb-3 lg:h-20 lg:w-20",
      children: ({ selected }) => /* @__PURE__ */ jsxs(Fragment$1, { children: [
        /* @__PURE__ */ jsx("span", { className: "sr-only", children: image.name }),
        /* @__PURE__ */ jsx("span", { className: "absolute inset-0 overflow-hidden rounded-lg", children: /* @__PURE__ */ jsx(
          Image,
          {
            src: image.url,
            alt: image.alt || "tab for image gallery",
            className: "h-full w-full object-cover object-center transition-transform duration-200 hover:scale-105"
          },
          image.id
        ) }),
        /* @__PURE__ */ jsx(
          "span",
          {
            className: clsx(
              "pointer-events-none absolute inset-0 rounded-lg border-2 transition-all duration-200",
              {
                "border-blue-500 shadow-lg": selected,
                "border-gray-200": !selected
              }
            ),
            "aria-hidden": "true"
          }
        ),
        selected && /* @__PURE__ */ jsx("span", { className: "absolute inset-0 rounded-lg bg-blue-500/10", "aria-hidden": "true" })
      ] })
    },
    image.id
  )) });
});
const ProductImageGallery = ({ product: product2, indexGallery }) => {
  const { images: productImages = [], thumbnail } = product2;
  const images = productImages ?? [];
  const [lightboxIndex, setLightboxIndex] = useState(-1);
  const [selectedIndex, setSelectedIndex] = useState(indexGallery || 0);
  const { scrollableDivRef } = useScrollArrows({
    buffer: 50,
    resetOnDepChange: [product2]
  });
  const gallery = (images == null ? void 0 : images.length) < 1 && thumbnail ? [
    {
      id: "thumbnail",
      name: `Thumbnail for ${product2.title}`,
      url: thumbnail,
      alt: product2.description || product2.title
    }
  ] : images;
  const nextTab = (e) => {
    e.preventDefault();
    setSelectedIndex((prev) => (prev + 1) % gallery.length);
  };
  const prevTab = (e) => {
    e.preventDefault();
    setSelectedIndex((prev) => (prev - 1 + gallery.length) % gallery.length);
  };
  useEffect(() => {
    setSelectedIndex(indexGallery || 0);
  }, [indexGallery]);
  return /* @__PURE__ */ jsxs(TabGroup, { as: "div", className: "flex flex-col gap-4 lg:flex-row lg:gap-6", selectedIndex, onChange: setSelectedIndex, children: [
    /* @__PURE__ */ jsx("h2", { className: "sr-only", children: "Images" }),
    gallery.length > 1 && /* @__PURE__ */ jsxs("div", { className: "absolute -bottom-8 flex justify-center w-full gap-4", children: [
      /* @__PURE__ */ jsx(
        TabList$1,
        {
          ref: scrollableDivRef,
          className: "flex flex-row gap-2 p-3 bg-[#D1D1D1] rounded-full",
          children: gallery.map((image, index) => /* @__PURE__ */ jsx(Tab, { className: "relative flex w-2 h-2 items-center justify-center cursor-pointer rounded-lg transition-all duration-200 focus:outline-none aria-selected:border-blue-500", children: ({ selected }) => /* @__PURE__ */ jsx(Fragment$1, { children: /* @__PURE__ */ jsx(
            "span",
            {
              className: clsx(`absolute h-2 w-2 rounded-full transition-colors duration-300 bg-white`, {
                "opacity-40": !selected
              })
            }
          ) }) }, image.id))
        }
      ),
      /* @__PURE__ */ jsxs("div", { className: "flex justify-between gap-2", children: [
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: prevTab,
            className: "w-8 h-8 py-1 bg-[#D1D1D1] rounded-full flex items-center justify-center focus:outline-none focus:ring-0 hover:bg-gray-300",
            children: /* @__PURE__ */ jsx(ChevronLeftIcon$1, { className: "h-5 w-5 text-white" })
          }
        ),
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: nextTab,
            className: "w-8 h-8 py-1 bg-[#D1D1D1] rounded-full flex items-center justify-center focus:outline-none focus:ring-0 hover:bg-gray-300",
            children: /* @__PURE__ */ jsx(ChevronRightIcon$1, { className: "h-5 w-5 text-white" })
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsx(TabPanels, { className: "flex-1", children: /* @__PURE__ */ jsx("div", { className: "relative aspect-square rounded-2xl overflow-hidden", children: gallery.length > 0 ? gallery.map((image, imageIndex) => /* @__PURE__ */ jsxs(
      TabPanel,
      {
        className: "group relative h-full w-full overflow-hidden cursor-pointer",
        onClick: () => setLightboxIndex(imageIndex),
        children: [
          /* @__PURE__ */ jsx(MorphingShape, { ...randomAssetMorphingShape(product2.subtitle), zoom: 0.75, classNameWrapper: "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 !h-auto" }),
          /* @__PURE__ */ jsx(
            Image,
            {
              style: {
                viewTransitionName: "product-thumbnail"
              },
              src: image.url,
              alt: image.alt || "selected image for product",
              className: "h-full w-full object-contain object-center transition-transform duration-300 group-hover:scale-105 -rotate-[14deg]"
            },
            image.id
          ),
          /* @__PURE__ */ jsx("div", { className: "absolute right-4 top-4 flex items-center justify-center rounded-xl bg-white/90 backdrop-blur-sm p-2.5 opacity-0 transition-all duration-300 shadow-lg group-hover:opacity-100 hover:scale-110", children: /* @__PURE__ */ jsx(MagnifyingGlassPlusIcon, { className: "h-5 w-5 text-gray-700" }) })
        ]
      },
      image.id
    )) : /* @__PURE__ */ jsx("div", { className: "flex h-full w-full items-center justify-center bg-gray-100 rounded-2xl", children: /* @__PURE__ */ jsx("span", { className: "text-gray-400", children: "No Image" }) }) }) }),
    /* @__PURE__ */ jsx(
      LightboxGallery,
      {
        images: gallery.map((image) => ({
          src: image.url,
          alt: image.alt || "Product image"
        })),
        lightBoxIndex: lightboxIndex,
        setLightBoxIndex: setLightboxIndex
      }
    )
  ] });
};
const ProductOptionSelectorRadio = ({
  option,
  onChange,
  value,
  currencyCode
}) => {
  const handleChange = (name, value2) => {
    if (onChange) onChange(name, value2);
  };
  const uniqueValues = option.values.filter(
    (optionValue, index, self) => self.findIndex((item) => item.value === optionValue.value) === index
  );
  const sortedValues = [...uniqueValues].sort((a, b) => {
    const aPrice = a.minPrice || a.exactPrice || 0;
    const bPrice = b.minPrice || b.exactPrice || 0;
    return aPrice - bPrice;
  });
  return /* @__PURE__ */ jsx(
    RadioGroup,
    {
      name: `options.${option.id}`,
      value,
      onChange: (changedValue) => handleChange(option.id, changedValue),
      children: /* @__PURE__ */ jsx("div", { className: "flex gap-2", children: sortedValues.map((optionValue, valueIndex) => {
        if (optionValue.minPrice !== void 0 && optionValue.maxPrice !== void 0) {
          if (optionValue.minPrice === optionValue.maxPrice) {
            formatPrice(optionValue.minPrice, { currency: currencyCode });
          } else {
            `${formatPrice(optionValue.minPrice, { currency: currencyCode })} – ${formatPrice(optionValue.maxPrice, { currency: currencyCode })}`;
          }
        } else if (optionValue.exactPrice !== void 0) {
          formatPrice(optionValue.exactPrice, { currency: currencyCode });
          if (optionValue.discountPercentage) {
            `${optionValue.discountPercentage}% off`;
          }
        }
        return /* @__PURE__ */ jsx(
          Radio,
          {
            value: optionValue.value,
            disabled: optionValue.disabled,
            className: ({ checked, disabled }) => clsx(
              "group",
              checked ? "ring-highlight ring-1 bg-highlight" : "bg-white border-black",
              "active:ring-highlight relative col-span-1 flex h-full  flex-col justify-between rounded-full border px-12 py-1 font-bold shadow-sm hover:bg-highlight/40 focus:outline-none",
              disabled ? "opacity-50" : ""
            ),
            children: ({ checked }) => /* @__PURE__ */ jsx(Label, { as: "div", className: "flex items-center w-full", children: /* @__PURE__ */ jsxs("div", { className: "flex-grow", children: [
              /* @__PURE__ */ jsx("span", { className: clsx("text-base", checked ? "text-primary-800" : "text-gray-900"), children: optionValue.value }),
              optionValue.disabled && /* @__PURE__ */ jsx("span", { className: "text-xs text-gray-500 ml-2", children: "(not available)" })
            ] }) })
          },
          valueIndex
        );
      }) })
    }
  );
};
const ProductOptionSelectorSelect = ({
  option,
  onChange,
  value,
  currencyCode
}) => {
  const { register } = useRemixFormContext();
  const filteredValues = option.values.filter(
    (productOptionValue, index, self) => self.findIndex((item) => item.value === productOptionValue.value) === index
  );
  const sortedValues = [...filteredValues].sort((a, b) => {
    const aPrice = a.minPrice ?? a.exactPrice ?? 0;
    const bPrice = b.minPrice ?? b.exactPrice ?? 0;
    return aPrice - bPrice;
  });
  const formattedOptions = sortedValues.map((optionValue) => {
    let label = optionValue.value;
    if (optionValue.minPrice !== void 0 && optionValue.maxPrice !== void 0) {
      if (optionValue.minPrice === optionValue.maxPrice) {
        label += ` - ${formatPrice(optionValue.minPrice, { currency: currencyCode })}`;
      } else {
        label += ` - ${formatPrice(optionValue.minPrice, { currency: currencyCode })} – ${formatPrice(optionValue.maxPrice, { currency: currencyCode })}`;
      }
    } else if (optionValue.exactPrice !== void 0) {
      label += ` - ${formatPrice(optionValue.exactPrice, { currency: currencyCode })}`;
      if (optionValue.discountPercentage) {
        label += ` (${optionValue.discountPercentage}% off)`;
      }
    }
    return {
      value: optionValue.value,
      label
    };
  });
  return /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-2", children: [
    /* @__PURE__ */ jsx("label", { htmlFor: option.id, className: "text-sm font-medium text-gray-700", children: option.title }),
    /* @__PURE__ */ jsx(
      "select",
      {
        ...register(`options.${option.id}`),
        id: option.id,
        className: "form-select",
        defaultValue: value,
        children: formattedOptions.map((optValue, valueIndex) => /* @__PURE__ */ jsx("option", { value: optValue.value, children: optValue.label || optValue.value }, valueIndex))
      }
    )
  ] });
};
const ProductPriceRange = ({ product: product2, currencyCode }) => {
  const sortedVariants = useMemo(() => sortProductVariantsByPrice(product2), [product2, currencyCode]);
  const minVariant = sortedVariants[0];
  const maxVariant = sortedVariants[sortedVariants.length - 1];
  const minPrice = useMemo(() => getVariantFinalPrice(minVariant), [sortedVariants]);
  const maxPrice = useMemo(() => getVariantFinalPrice(maxVariant), [sortedVariants]);
  const hasPriceRange = minPrice !== maxPrice;
  return /* @__PURE__ */ jsx(Fragment$1, { children: hasPriceRange ? /* @__PURE__ */ jsxs(Fragment$1, { children: [
    formatPrice(minPrice, { currency: currencyCode }),
    maxPrice && maxPrice > minPrice ? /* @__PURE__ */ jsxs(Fragment$1, { children: [
      "–",
      formatPrice(maxPrice, { currency: currencyCode })
    ] }) : ""
  ] }) : /* @__PURE__ */ jsx(ProductVariantPrice, { variant: minVariant, currencyCode }) });
};
const SimpleReviewForm = ({
  productId,
  onSubmitSuccess,
  onCancel
}) => {
  const [name, setName] = useState("");
  const [content, setContent] = useState("");
  const [stars, setStars] = useState(5);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const fetcher = useFetcher$1();
  const isSubmitting = fetcher.state !== "idle";
  useEffect(() => {
    var _a, _b, _c;
    if ((_a = fetcher.data) == null ? void 0 : _a.success) {
      setSuccess(true);
      setName("");
      setContent("");
      setStars(5);
      setError(null);
      const timer = setTimeout(() => {
        setSuccess(false);
        if (onSubmitSuccess) {
          onSubmitSuccess();
        }
      }, 2e3);
      return () => clearTimeout(timer);
    } else if ((_b = fetcher.data) == null ? void 0 : _b.error) {
      setError(fetcher.data.error);
    } else if ((_c = fetcher.data) == null ? void 0 : _c.errors) {
      const errorMessages = Object.entries(fetcher.data.errors).filter(([_, messages]) => messages && messages.length > 0).map(([field, messages]) => `${field}: ${(messages == null ? void 0 : messages[0]) || "Invalid"}`).join(", ");
      setError(errorMessages || "Validation failed");
    }
  }, [fetcher.data, onSubmitSuccess]);
  const handleSubmit = (e) => {
    e.preventDefault();
    setError(null);
    if (!name.trim()) {
      setError("Please enter your name");
      return;
    }
    if (!content.trim()) {
      setError("Please write a review");
      return;
    }
    if (content.length < 10) {
      setError("Review must be at least 10 characters");
      return;
    }
    if (stars < 1 || stars > 5) {
      setError("Please select a rating between 1 and 5");
      return;
    }
    const formData = new FormData();
    formData.append("product_id", productId);
    formData.append("name", name);
    formData.append("content", content);
    formData.append("stars", stars.toString());
    fetcher.submit(formData, {
      method: "POST",
      action: "/api/product-reviews/create"
    });
  };
  return /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, className: "space-y-6 bg-white p-6 rounded-lg border border-gray-200", children: [
    /* @__PURE__ */ jsx("h3", { className: "text-lg font-semibold text-gray-900", children: "Write a Review" }),
    success && /* @__PURE__ */ jsxs("div", { className: "bg-green-50 border border-green-200 rounded-md p-4 text-green-800", children: [
      /* @__PURE__ */ jsx("p", { className: "font-semibold", children: "Thank you!" }),
      /* @__PURE__ */ jsx("p", { className: "text-sm mt-1", children: "Your review has been submitted and is pending approval." })
    ] }),
    error && /* @__PURE__ */ jsxs("div", { className: "bg-red-50 border border-red-200 rounded-md p-4 text-red-800", children: [
      /* @__PURE__ */ jsx("p", { className: "font-semibold", children: "Error" }),
      /* @__PURE__ */ jsx("p", { className: "text-sm mt-1", children: error })
    ] }),
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsxs("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: [
        "Rating ",
        /* @__PURE__ */ jsx("span", { className: "text-red-500", children: "*" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsx(
          StarRating,
          {
            value: stars,
            onChange: (value) => setStars(value),
            readOnly: false
          }
        ),
        /* @__PURE__ */ jsx("span", { className: "text-sm text-gray-600 ml-2", children: stars === 0 ? "No rating" : `${stars} out of 5 stars` })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsxs("label", { htmlFor: "name", className: "block text-sm font-medium text-gray-700 mb-2", children: [
        "Your Name ",
        /* @__PURE__ */ jsx("span", { className: "text-red-500", children: "*" })
      ] }),
      /* @__PURE__ */ jsx(
        "input",
        {
          id: "name",
          type: "text",
          name: "name",
          value: name,
          onChange: (e) => setName(e.target.value),
          placeholder: "Enter your name",
          disabled: isSubmitting,
          maxLength: 255,
          className: "w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed",
          required: true
        }
      )
    ] }),
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsxs("label", { htmlFor: "content", className: "block text-sm font-medium text-gray-700 mb-2", children: [
        "Your Review ",
        /* @__PURE__ */ jsx("span", { className: "text-red-500", children: "*" })
      ] }),
      /* @__PURE__ */ jsx(
        "textarea",
        {
          id: "content",
          name: "content",
          value: content,
          onChange: (e) => setContent(e.target.value),
          placeholder: "Tell us what you think about this product...",
          disabled: isSubmitting,
          maxLength: 1e3,
          rows: 5,
          className: "w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed resize-none",
          required: true
        }
      ),
      /* @__PURE__ */ jsxs("div", { className: "text-xs text-gray-500 mt-1", children: [
        content.length,
        "/1000 characters"
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex gap-3 justify-between", children: [
      /* @__PURE__ */ jsx(
        Button,
        {
          type: "button",
          variant: "default",
          onClick: onCancel,
          disabled: isSubmitting,
          className: "flex-1",
          children: "Cancel"
        }
      ),
      /* @__PURE__ */ jsx(
        Button,
        {
          type: "submit",
          variant: "primary",
          disabled: isSubmitting,
          className: "flex-1",
          children: isSubmitting ? "Submitting..." : "Submit Review"
        }
      )
    ] })
  ] });
};
const ProductReviewList = ({
  productReviews
}) => {
  return /* @__PURE__ */ jsxs("div", { children: [
    productReviews && productReviews.length > 0 && /* @__PURE__ */ jsx("div", { className: "space-y-8", children: productReviews.map((review, reviewIndex) => {
      return /* @__PURE__ */ jsxs("div", { className: "py-8", children: [
        /* @__PURE__ */ jsxs("div", { className: " flex items-center justify-between", children: [
          /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsxs("svg", { width: "54", height: "53", viewBox: "0 0 54 53", fill: "none", xmlns: "http://www.w3.org/2000/svg", children: [
            /* @__PURE__ */ jsx("circle", { cx: "27.5", cy: "21.5", r: "11.5", fill: "#FFE977" }),
            /* @__PURE__ */ jsx("path", { d: "M34 39.6667C34 41.8758 29.8932 45 27.5 45C25.1068 45 21 41.8758 21 39.6667C21 37.4575 25.1068 37 27.5 37C29.8932 37 34 37.4575 34 39.6667Z", fill: "#FFE977" }),
            /* @__PURE__ */ jsx("path", { d: "M27 0.706055C41.5344 0.706055 53.2939 12.2666 53.2939 26.5C53.2939 40.7334 41.5344 52.2939 27 52.2939C12.4656 52.2939 0.706055 40.7334 0.706055 26.5C0.706055 12.2666 12.4656 0.706055 27 0.706055Z", stroke: "black", "stroke-width": "1.41144" })
          ] }) }),
          /* @__PURE__ */ jsx("h3", { className: "px-1.5 font-title font-extrabold text-[32px] leading-[42px] tracking-normal uppercase line-clamp-1 text-center", children: review.name ?? "Anonymous" }),
          /* @__PURE__ */ jsx("div", { className: "mt-1 flex items-center pb-1", children: /* @__PURE__ */ jsx(StarRating, { value: review.stars ?? 0, readOnly: true }) }),
          /* @__PURE__ */ jsxs("p", { className: "sr-only", children: [
            review.stars,
            " out of 5 stars"
          ] })
        ] }),
        /* @__PURE__ */ jsx(
          "div",
          {
            className: "mt-4 space-y-6 text-base text-gray-600",
            dangerouslySetInnerHTML: { __html: review.content }
          }
        )
      ] }, review.id);
    }) }),
    (!productReviews || productReviews.length === 0) && /* @__PURE__ */ jsx("div", { className: "mb-8 text-center py-8 text-gray-500", children: /* @__PURE__ */ jsx("p", { className: "text-lg", children: "No reviews yet. Be the first to review this product!" }) })
  ] });
};
const ProductReviewListWithPagination = ({
  context,
  paginationConfig,
  className,
  ...props
}) => /* @__PURE__ */ jsx(Fragment$1, { children: /* @__PURE__ */ jsxs("div", { className, children: [
  /* @__PURE__ */ jsx(ProductReviewList, { ...props }),
  paginationConfig && /* @__PURE__ */ jsx(PaginationWithContext, { context, paginationConfig, section: "reviews" })
] }) });
const ProductReviewSection = () => {
  const data2 = useRouteLoaderData("routes/products.$productHandle");
  if (!data2) return null;
  const { product: product2, productReviews } = data2;
  const [showForm, setShowForm] = useState(false);
  const handleReviewSubmitted = () => {
    setShowForm(false);
    window.location.reload();
  };
  return /* @__PURE__ */ jsxs(Fragment$1, { children: [
    /* @__PURE__ */ jsxs("p", { className: "text-center", children: [
      /* @__PURE__ */ jsx("span", { className: "text-5xl font-title font-extrabold text-64px leading-48px uppercase", children: "Customer" }),
      /* @__PURE__ */ jsx("span", { className: "text-6xl font-centuryBook italic text-64px leading-48px pl-2", children: "Review" })
    ] }),
    /* @__PURE__ */ jsx("section", { id: "reviews", className: "container mx-auto my-12 grid grid-cols-12 px-8", children: /* @__PURE__ */ jsx(
      ProductReviewListWithPagination,
      {
        className: "col-span-12",
        productId: product2.id,
        productReviews: productReviews.reviews,
        context: `products/${product2.handle}`,
        paginationConfig: {
          limit: productReviews.limit,
          offset: productReviews.offset,
          count: productReviews.count
        }
      }
    ) }),
    /* @__PURE__ */ jsxs("div", { children: [
      showForm && /* @__PURE__ */ jsx(
        SimpleReviewForm,
        {
          productId: product2.id,
          onSubmitSuccess: handleReviewSubmitted,
          onCancel: () => setShowForm(false)
        }
      ),
      !showForm && /* @__PURE__ */ jsx("div", { className: "my-8 text-center", children: /* @__PURE__ */ jsx(
        Button,
        {
          variant: "primary",
          size: "lg",
          onClick: () => setShowForm(true),
          children: /* @__PURE__ */ jsx("span", { className: "font-semibold text-lg", children: "Write a Review" })
        }
      ) })
    ] })
  ] });
};
const Collasape = ({
  title,
  children,
  initiallyOpen = false,
  className = ""
}) => {
  const [open, setOpen] = useState(initiallyOpen);
  const toggleCollasape = () => {
    setOpen((prev) => !prev);
  };
  return /* @__PURE__ */ jsxs("div", { className: clsx$1(
    `collasape-component`,
    className,
    {
      "bg-[radial-gradient(36.36%_53.14%_at_5.59%_100%,rgba(255,233,119,0.5)_0%,rgba(255,255,255,0.5)_100%)]": open
    }
  ), children: [
    /* @__PURE__ */ jsxs(
      "button",
      {
        type: "button",
        className: "collasape-header text-[24px] leading-[32px] tracking-normal uppercase flex items-center justify-between w-full text-left p-2 cursor-pointer bg-none border-none outline-none font-bold text-sm transition-all duration-300",
        "aria-expanded": open,
        onClick: toggleCollasape,
        children: [
          title,
          open ? /* @__PURE__ */ jsxs("svg", { width: "42", height: "42", viewBox: "0 0 42 42", fill: "none", xmlns: "http://www.w3.org/2000/svg", children: [
            /* @__PURE__ */ jsxs("g", { filter: "url(#filter0_d_276_82)", children: [
              /* @__PURE__ */ jsx("circle", { cx: "21", cy: "17", r: "13", transform: "rotate(-90 21 17)", fill: "#FFE977" }),
              /* @__PURE__ */ jsx("path", { d: "M21.7071 12.2929C21.3166 11.9024 20.6834 11.9024 20.2929 12.2929L13.9289 18.6569C13.5384 19.0474 13.5384 19.6805 13.9289 20.0711C14.3195 20.4616 14.9526 20.4616 15.3431 20.0711L21 14.4142L26.6569 20.0711C27.0474 20.4616 27.6805 20.4616 28.0711 20.0711C28.4616 19.6805 28.4616 19.0474 28.0711 18.6569L21.7071 12.2929ZM21 14L22 14L22 13L21 13L20 13L20 14L21 14Z", fill: "black" })
            ] }),
            /* @__PURE__ */ jsx("defs", { children: /* @__PURE__ */ jsxs("filter", { id: "filter0_d_276_82", x: "0", y: "0", width: "42", height: "42", filterUnits: "userSpaceOnUse", "color-interpolation-filters": "sRGB", children: [
              /* @__PURE__ */ jsx("feFlood", { "flood-opacity": "0", result: "BackgroundImageFix" }),
              /* @__PURE__ */ jsx("feColorMatrix", { in: "SourceAlpha", type: "matrix", values: "0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0", result: "hardAlpha" }),
              /* @__PURE__ */ jsx("feOffset", { dy: "4" }),
              /* @__PURE__ */ jsx("feGaussianBlur", { stdDeviation: "4" }),
              /* @__PURE__ */ jsx("feComposite", { in2: "hardAlpha", operator: "out" }),
              /* @__PURE__ */ jsx("feColorMatrix", { type: "matrix", values: "0 0 0 0 0.57005 0 0 0 0 0.509485 0 0 0 0 0.191522 0 0 0 1 0" }),
              /* @__PURE__ */ jsx("feBlend", { mode: "normal", in2: "BackgroundImageFix", result: "effect1_dropShadow_276_82" }),
              /* @__PURE__ */ jsx("feBlend", { mode: "normal", in: "SourceGraphic", in2: "effect1_dropShadow_276_82", result: "shape" })
            ] }) })
          ] }) : /* @__PURE__ */ jsxs("svg", { width: "42", height: "42", viewBox: "0 0 42 42", fill: "none", xmlns: "http://www.w3.org/2000/svg", children: [
            /* @__PURE__ */ jsxs("g", { filter: "url(#filter0_d_276_73)", children: [
              /* @__PURE__ */ jsx("circle", { cx: "21", cy: "17", r: "13", transform: "rotate(90 21 17)", fill: "black" }),
              /* @__PURE__ */ jsx("path", { d: "M20.2929 21.7071C20.6834 22.0976 21.3166 22.0976 21.7071 21.7071L28.0711 15.3431C28.4616 14.9526 28.4616 14.3195 28.0711 13.9289C27.6805 13.5384 27.0474 13.5384 26.6569 13.9289L21 19.5858L15.3431 13.9289C14.9526 13.5384 14.3195 13.5384 13.9289 13.9289C13.5384 14.3195 13.5384 14.9526 13.9289 15.3431L20.2929 21.7071ZM21 20L20 20L20 21L21 21L22 21L22 20L21 20Z", fill: "white" })
            ] }),
            /* @__PURE__ */ jsx("defs", { children: /* @__PURE__ */ jsxs("filter", { id: "filter0_d_276_73", x: "0", y: "0", width: "42", height: "42", filterUnits: "userSpaceOnUse", "color-interpolation-filters": "sRGB", children: [
              /* @__PURE__ */ jsx("feFlood", { "flood-opacity": "0", result: "BackgroundImageFix" }),
              /* @__PURE__ */ jsx("feColorMatrix", { in: "SourceAlpha", type: "matrix", values: "0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0", result: "hardAlpha" }),
              /* @__PURE__ */ jsx("feOffset", { dy: "4" }),
              /* @__PURE__ */ jsx("feGaussianBlur", { stdDeviation: "4" }),
              /* @__PURE__ */ jsx("feComposite", { in2: "hardAlpha", operator: "out" }),
              /* @__PURE__ */ jsx("feColorMatrix", { type: "matrix", values: "0 0 0 0 0.57005 0 0 0 0 0.509485 0 0 0 0 0.191522 0 0 0 1 0" }),
              /* @__PURE__ */ jsx("feBlend", { mode: "normal", in2: "BackgroundImageFix", result: "effect1_dropShadow_276_73" }),
              /* @__PURE__ */ jsx("feBlend", { mode: "normal", in: "SourceGraphic", in2: "effect1_dropShadow_276_73", result: "shape" })
            ] }) })
          ] })
        ]
      }
    ),
    /* @__PURE__ */ jsx(
      "div",
      {
        className: "collasape-content",
        style: {
          maxHeight: open ? "1000px" : "0px",
          overflow: "hidden",
          transition: "max-height 0.3s ease",
          padding: open ? "1rem" : "0 1rem"
        },
        "aria-hidden": !open,
        children: open && children
      }
    )
  ] });
};
const variantIsSoldOut = (variant) => {
  return !!((variant == null ? void 0 : variant.manage_inventory) && (variant == null ? void 0 : variant.inventory_quantity) < 1);
};
const ProductTemplate = ({ product: product2 }) => {
  var _a;
  const [indexGallery, setIndexGallery] = useState(0);
  const formRef = useRef(null);
  const addToCartFetcher = useFetcher({ key: FetcherKeys.cart.createLineItem });
  const { toggleCartDrawer } = useCart();
  const { region } = useRegion();
  const hasErrors = Object.keys(((_a = addToCartFetcher.data) == null ? void 0 : _a.errors) || {}).length > 0;
  const isAddingToCart = ["submitting", "loading"].includes(addToCartFetcher.state);
  const defaultValues = {
    productId: product2.id,
    quantity: "1",
    options: useMemo(() => {
      var _a2, _b;
      const firstVariant = (_a2 = product2.variants) == null ? void 0 : _a2[0];
      if (firstVariant && firstVariant.options) {
        return firstVariant.options.reduce(
          (acc, option) => {
            if (option.option_id && option.value) {
              acc[option.option_id] = option.value;
            }
            return acc;
          },
          {}
        );
      }
      return ((_b = product2.options) == null ? void 0 : _b.reduce(
        (acc, option) => {
          var _a3;
          if (!option.id || !((_a3 = option.values) == null ? void 0 : _a3.length)) return acc;
          acc[option.id] = option.values[0].value;
          return acc;
        },
        {}
      )) || {};
    }, [product2])
  };
  const form = useRemixForm({
    resolver: zodResolver(createLineItemSchema),
    defaultValues,
    fetcher: addToCartFetcher,
    submitConfig: {
      method: "post",
      action: "/api/cart/line-items/create",
      encType: "multipart/form-data"
    }
  });
  const currencyCode = region.currency_code;
  const [controlledOptions, setControlledOptions] = useState(defaultValues.options);
  const [isBuyingNow, setIsBuyingNow] = useState(false);
  const [customizationTitles, setCustomizationTitles] = useState([]);
  const selectedOptions = useMemo(
    () => {
      var _a2;
      return (_a2 = product2.options) == null ? void 0 : _a2.map(({ id }) => controlledOptions[id]);
    },
    [product2, controlledOptions]
  );
  const variantMatrix = useMemo(() => selectVariantMatrix(product2), [product2]);
  const selectedVariant = useMemo(() => {
    return selectVariantFromMatrixBySelectedOptions(variantMatrix, selectedOptions);
  }, [variantMatrix, selectedOptions]);
  const productSelectOptions = useMemo(
    () => {
      var _a2;
      return (_a2 = product2.options) == null ? void 0 : _a2.map((option, index) => {
        var _a3;
        if (index === 0) {
          const optionValuesWithPrices2 = getOptionValuesWithDiscountLabels(
            index,
            currencyCode,
            option.values || [],
            variantMatrix,
            selectedOptions
          );
          return {
            title: option.title,
            product_id: option.product_id,
            id: option.id,
            values: optionValuesWithPrices2
          };
        }
        const filteredOptionValues = getFilteredOptionValues(product2, controlledOptions, option.id);
        const availableOptionValues = (_a3 = option.values) == null ? void 0 : _a3.filter(
          (optionValue) => filteredOptionValues.some((filteredValue) => filteredValue.value === optionValue.value)
        );
        const optionValuesWithPrices = getOptionValuesWithDiscountLabels(
          index,
          currencyCode,
          availableOptionValues || [],
          variantMatrix,
          selectedOptions
        );
        return {
          title: option.title,
          product_id: option.product_id,
          id: option.id,
          values: optionValuesWithPrices
        };
      });
    },
    [product2, controlledOptions, currencyCode, variantMatrix, selectedOptions]
  );
  const productSoldOut = useProductInventory(product2).averageInventory === 0;
  const updateControlledOptions = (currentOptions, changedOptionId, newValue) => {
    var _a2;
    const newOptions = { ...currentOptions };
    newOptions[changedOptionId] = newValue;
    const allOptionIds = ((_a2 = product2.options) == null ? void 0 : _a2.map((option) => option.id)) || [];
    const changedOptionIndex = allOptionIds.indexOf(changedOptionId);
    const subsequentOptionIds = changedOptionIndex >= 0 ? allOptionIds.slice(changedOptionIndex + 1) : [];
    if (subsequentOptionIds.length > 0) {
      subsequentOptionIds.forEach((optionId) => {
        if (!optionId) return;
        const filteredValues = getFilteredOptionValues(product2, newOptions, optionId);
        if (filteredValues.length > 0) {
          newOptions[optionId] = filteredValues[0].value;
        } else {
          newOptions[optionId] = "";
        }
      });
    }
    return newOptions;
  };
  const handleOptionChangeBySelect = (e) => {
    const changedOptionId = e.target.name.replace("options.", "");
    const newValue = e.target.value;
    const newOptions = updateControlledOptions(controlledOptions, changedOptionId, newValue);
    setControlledOptions(newOptions);
    form.setValue("options", newOptions);
  };
  useEffect(() => {
    if (selectedVariant) {
      console.log("selectedVariant", selectedVariant);
      const index = selectedVariant.title === "small" ? 1 : 0;
      setIndexGallery(index);
    }
  }, [selectedVariant]);
  const handleOptionChangeByRadio = (name, value) => {
    const newOptions = updateControlledOptions(controlledOptions, name, value);
    setControlledOptions(newOptions);
    form.setValue("options", newOptions);
  };
  useEffect(() => {
    if (!isAddingToCart && !hasErrors) {
      if (formRef.current) {
        formRef.current.reset();
        const quantityInput = formRef.current.querySelector('input[name="quantity"]');
        if (quantityInput) {
          quantityInput.value = "1";
        }
        const productIdInput = formRef.current.querySelector('input[name="productId"]');
        if (productIdInput) {
          productIdInput.value = product2.id;
        }
      }
    }
  }, [isAddingToCart, hasErrors, product2.id]);
  useEffect(() => {
    if (Object.keys(controlledOptions).length === 0) {
      setControlledOptions(defaultValues.options);
    }
  }, [defaultValues.options, controlledOptions]);
  useEffect(() => {
    setControlledOptions(defaultValues.options);
  }, [defaultValues.options]);
  const soldOut = variantIsSoldOut(selectedVariant) || productSoldOut;
  const handleAddToCart = useCallback(() => {
    toggleCartDrawer(true);
  }, [toggleCartDrawer]);
  const handleBuyNow = useCallback(async () => {
    if (isBuyingNow) return;
    setIsBuyingNow(true);
    const formData = new FormData();
    formData.append("productId", product2.id);
    formData.append("quantity", form.getValues("quantity"));
    const options = form.getValues("options");
    Object.entries(options).forEach(([key, value]) => {
      formData.append(`options.${key}`, value);
    });
    try {
      const response = await fetch("/api/cart/line-items/create", {
        method: "POST",
        body: formData
      });
      if (response.ok) {
        window.location.href = "/checkout";
      } else {
        console.error("Failed to add item to cart");
        setIsBuyingNow(false);
      }
    } catch (error) {
      console.error("Error adding item to cart:", error);
      setIsBuyingNow(false);
    }
  }, [product2.id, form, isBuyingNow]);
  useEffect(() => {
    const titles = getCustomizationTitles(product2.title);
    if (titles.length > 1) {
      setCustomizationTitles(titles);
    } else {
      setCustomizationTitles([product2.title]);
    }
  }, [product2.title]);
  return /* @__PURE__ */ jsxs(Fragment$1, { children: [
    /* @__PURE__ */ jsx("section", { className: "pb-12 pt-12 min-h-screen", children: /* @__PURE__ */ jsx(RemixFormProvider, { ...form, children: /* @__PURE__ */ jsxs(
      addToCartFetcher.Form,
      {
        id: "addToCartForm",
        ref: formRef,
        method: "post",
        action: "/api/cart/line-items/create",
        onSubmit: handleAddToCart,
        children: [
          /* @__PURE__ */ jsx("input", { type: "hidden", name: "productId", value: product2.id }),
          /* @__PURE__ */ jsx(Container, { className: "px-0 sm:px-6 md:px-8", children: /* @__PURE__ */ jsxs(Grid, { className: "!gap-0 overflow-visible", children: [
            /* @__PURE__ */ jsxs(GridColumn, { className: "mb-8 md:col-span-6 sticky top-[144px] [height:min-content]", children: [
              /* @__PURE__ */ jsx("h2", { className: "xl:text-[100px] font-bold text-gray-900 leading-[5rem]", children: customizationTitles[0] }),
              /* @__PURE__ */ jsx(ProductImageGallery, { product: product2, indexGallery }, product2.id),
              /* @__PURE__ */ jsxs("div", { className: "flex gap-4 items-end justify-between", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-2", children: [
                  customizationTitles[1] && /* @__PURE__ */ jsx("h2", { className: "xl:text-[100px] font-bold text-gray-900", children: customizationTitles[1] }),
                  /* @__PURE__ */ jsx("p", { className: "text-gray-900 font-bold flex gap-3", children: /* @__PURE__ */ jsx("span", { className: "text-5xl", children: selectedVariant ? /* @__PURE__ */ jsx(ProductPrice, { product: product2, variant: selectedVariant, currencyCode }) : /* @__PURE__ */ jsx(ProductPriceRange, { product: product2, currencyCode }) }) })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-end gap-6", children: [
                  !soldOut && /* @__PURE__ */ jsx(QuantitySelector, { variant: selectedVariant }),
                  /* @__PURE__ */ jsx("div", { className: "flex-1", children: !soldOut ? /* @__PURE__ */ jsx(
                    SubmitButton,
                    {
                      variant: "ghost",
                      size: "image",
                      disabled: isAddingToCart || isBuyingNow,
                      className: "disabled:opacity-50 disabled:cursor-not-allowed",
                      children: /* @__PURE__ */ jsx("img", { src: "/assets/images/add-to-cart.svg", alt: "Add to cart", className: "w-auto h-[108px]" })
                    }
                  ) : /* @__PURE__ */ jsx(
                    SubmitButton,
                    {
                      disabled: true,
                      className: "pointer-events-none !h-12 w-full !text-base !font-bold opacity-50",
                      children: "Sold out"
                    }
                  ) })
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsx(GridColumn, { className: "flex flex-col md:col-span-6", children: /* @__PURE__ */ jsxs("div", { className: "h-fit", children: [
              /* @__PURE__ */ jsxs("div", { className: "px-0 sm:px-6 md:p-10 md:pt-0", children: [
                /* @__PURE__ */ jsx("div", { className: "flex items-center gap-4 py-2", children: /* @__PURE__ */ jsx("div", { className: "flex-1", children: !soldOut ? /* @__PURE__ */ jsx(
                  Button,
                  {
                    variant: "primary",
                    onClick: handleBuyNow,
                    disabled: isAddingToCart || isBuyingNow,
                    className: "!h-12 whitespace-nowrap !text-base !font-bold transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed",
                    children: isBuyingNow ? "Processing..." : "Buy Now"
                  }
                ) : /* @__PURE__ */ jsx(
                  Button,
                  {
                    disabled: true,
                    className: "pointer-events-none !h-12 !text-base !font-bold opacity-50 bg-gray-300 text-gray-500",
                    children: "Sold out"
                  }
                ) }) }),
                productSelectOptions && productSelectOptions.length > 5 && /* @__PURE__ */ jsxs("section", { "aria-labelledby": "product-options", className: "product-options", children: [
                  /* @__PURE__ */ jsx("h2", { id: "product-options", className: "sr-only", children: "Product options" }),
                  /* @__PURE__ */ jsx("div", { className: "space-y-4", children: productSelectOptions.map((option, optionIndex) => /* @__PURE__ */ jsx(
                    ProductOptionSelectorSelect,
                    {
                      option,
                      value: controlledOptions[option.id],
                      onChange: handleOptionChangeBySelect,
                      currencyCode
                    },
                    optionIndex
                  )) })
                ] }),
                productSelectOptions && productSelectOptions.length <= 5 && /* @__PURE__ */ jsxs("section", { "aria-labelledby": "product-options", className: "product-options my-6 grid gap-4", children: [
                  /* @__PURE__ */ jsx("h2", { id: "product-options", className: "sr-only", children: "Product options" }),
                  productSelectOptions.map((option, optionIndex) => /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx(
                    ProductOptionSelectorRadio,
                    {
                      option,
                      value: controlledOptions[option.id],
                      onChange: handleOptionChangeByRadio,
                      currencyCode
                    }
                  ) }, optionIndex))
                ] }),
                /* @__PURE__ */ jsx("div", { className: "my-2 flex flex-col gap-2", children: !!product2.description && /* @__PURE__ */ jsx("div", { className: "mt-4", children: /* @__PURE__ */ jsx("div", { className: "whitespace-pre-wrap text-base text-primary-800", children: product2.description }) }) })
              ] }),
              /* @__PURE__ */ jsx("div", { className: "container mx-auto grid grid-cols-12 px-8 gap-[20px]", children: /* @__PURE__ */ jsx("hr", { className: "col-span-8 border-t-[1px] border-primary" }) }),
              /* @__PURE__ */ jsxs("div", { className: "container mx-auto my-12 grid grid-cols-12 px-8 p-4 gap-[20px]", children: [
                /* @__PURE__ */ jsx(Collasape, { className: "col-span-12 p-4 rounded-[32px] shadow-[0px_4px_6px_0px_#00000040]", title: "INGREDIENTS", initiallyOpen: false, children: /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx("p", { children: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos." }) }) }),
                /* @__PURE__ */ jsx(Collasape, { className: "col-span-12 p-4 rounded-[32px] shadow-[0px_4px_6px_0px_#00000040]", title: "PRECAUTIONS OF USE", initiallyOpen: false, children: /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx("p", { children: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos." }) }) }),
                /* @__PURE__ */ jsx(Collasape, { className: "col-span-12 p-4 rounded-[32px] shadow-[0px_4px_6px_0px_#00000040]", title: "APPLICATION TIPS", initiallyOpen: false, children: /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx("p", { children: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos." }) }) })
              ] }),
              /* @__PURE__ */ jsx("div", { className: "container mx-auto grid grid-cols-12 px-8 gap-[20px]", children: /* @__PURE__ */ jsx("hr", { className: "col-span-8 border-t-[1px] border-primary" }) })
            ] }) })
          ] }) })
        ]
      }
    ) }) }),
    /* @__PURE__ */ jsx(Container, { children: /* @__PURE__ */ jsx(ProductReviewSection, {}) })
  ] });
};
const withPaginationParams = ({
  request,
  defaultPageSize = 10,
  prefix = ""
}) => {
  const url = new URL(request.url);
  const searchTermKey = `${prefix}term`;
  const pageSizeKey = `${prefix}pageSize`;
  const pageKey = `${prefix}page`;
  const searchTerm = url.searchParams.get(searchTermKey);
  const pageSize = url.searchParams.get(pageSizeKey);
  const page = url.searchParams.get(pageKey);
  const limit = pageSize ? parseInt(pageSize) : defaultPageSize;
  const offset = page ? (parseInt(page) - 1) * limit : 0;
  return { url, searchTerm, pageSize, page, limit, offset, searchParams: url.searchParams };
};
const loader$e = async (args) => {
  const {
    limit: reviewsLimit,
    offset: reviewsOffset
  } = withPaginationParams({
    request: args.request,
    defaultPageSize: 2
  });
  const {
    products
  } = await fetchProducts(args.request, {
    handle: args.params.productHandle,
    fields: "*categories"
  });
  if (!products.length) throw redirect("/404");
  const product2 = products[0];
  const productReviews = await fetchProductReviews(product2.id, {
    offset: reviewsOffset,
    limit: reviewsLimit
  });
  return {
    product: product2,
    productReviews
  };
};
const meta$2 = getMergedProductMeta;
const products_$productHandle = UNSAFE_withComponentProps(function ProductDetailRoute() {
  const {
    product: product2
  } = useLoaderData();
  return /* @__PURE__ */ jsxs(Fragment$1, {
    children: [/* @__PURE__ */ jsx(ProductTemplate, {
      product: product2
    }), /* @__PURE__ */ jsx(ProductList, {
      className: "!pb-[100px] xl:px-9",
      heading: "You may also like"
    })]
  });
});
const route17 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: products_$productHandle,
  loader: loader$e,
  meta: meta$2
}, Symbol.toStringTag, { value: "Module" }));
const loader$d = async ({
  request
}) => {
  const {
    products
  } = await sdk.store.product.list({
    limit: 1e3
  });
  const host = request.headers.get("host");
  const baseUrl = `https://${host}`;
  const urls = products.map(({
    handle,
    updated_at
  }) => ({
    loc: `${baseUrl}/products/${handle}`,
    lastmod: updated_at == null ? void 0 : updated_at.toString(),
    priority: 0.8,
    changefreq: "daily"
  }));
  const content = buildSitemapUrlSetXML(urls);
  return new Response(content, {
    status: 200,
    headers: {
      "Content-Type": "application/xml",
      "xml-version": "1.0",
      encoding: "UTF-8"
    }
  });
};
const route18 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  loader: loader$d
}, Symbol.toStringTag, { value: "Module" }));
const addressSchema$1 = z$1.object({
  firstName: z$1.string().min(1, "First name is required").optional(),
  lastName: z$1.string().min(1, "Last name is required").optional(),
  company: z$1.string().optional(),
  address1: z$1.string().min(1, "Address is required").optional(),
  address2: z$1.string().optional(),
  city: z$1.string().min(1, "City is required").optional(),
  province: z$1.string().min(1, "Province is required").optional(),
  countryCode: z$1.string().min(1, "Country is required"),
  postalCode: z$1.string().min(1, "Postal code is required"),
  phone: z$1.string().optional()
});
const completeCheckoutSchema = z$1.object({
  cartId: z$1.string(),
  providerId: z$1.string(),
  paymentMethodId: z$1.string(),
  sameAsShipping: z$1.boolean().optional(),
  billingAddress: z$1.any(),
  noRedirect: z$1.boolean().optional()
}).refine((data2) => data2.sameAsShipping ? z$1.any() : addressSchema$1.safeParse(data2.billingAddress).success, {
  message: "Valid billing address is required when creating a new address",
  path: ["root"]
});
async function action$2(actionArgs) {
  var _a, _b, _c, _d, _e;
  const {
    errors,
    data: data$1
  } = await getValidatedFormData(actionArgs.request, zodResolver(completeCheckoutSchema));
  if (errors) {
    return data({
      errors
    }, {
      status: 400
    });
  }
  let cart2 = await retrieveCart(actionArgs.request);
  const billingAddress = data$1.sameAsShipping ? cart2.shipping_address : addressToMedusaAddress(data$1.billingAddress);
  cart2 = (_a = await updateCart(actionArgs.request, {
    billing_address: addressPayload(billingAddress)
  })) == null ? void 0 : _a.cart;
  const activePaymentSession = (_c = (_b = cart2.payment_collection) == null ? void 0 : _b.payment_sessions) == null ? void 0 : _c.find((ps) => ps.status === "pending");
  if ((activePaymentSession == null ? void 0 : activePaymentSession.provider_id) !== data$1.providerId || !((_e = (_d = cart2.payment_collection) == null ? void 0 : _d.payment_sessions) == null ? void 0 : _e.length)) {
    await initiatePaymentSession(actionArgs.request, cart2, {
      provider_id: data$1.providerId,
      data: {
        payment_method: data$1.paymentMethodId
      }
    });
  }
  const isNewPaymentMethod = data$1.paymentMethodId === "new";
  if (!isNewPaymentMethod && data$1.providerId === "pp_stripe_stripe") {
    await initiatePaymentSession(actionArgs.request, cart2, {
      provider_id: data$1.providerId,
      data: {
        payment_method: data$1.paymentMethodId
      }
    });
  }
  if (!isNewPaymentMethod && data$1.providerId === "pp_paypal_paypal") {
    await initiatePaymentSession(actionArgs.request, cart2, {
      provider_id: data$1.providerId,
      data: {
        payment_method: data$1.paymentMethodId
      }
    });
  }
  const cartResponse = await placeOrder(actionArgs.request);
  if (cartResponse.type === "cart" || !cartResponse) {
    return data({
      errors: {
        root: {
          message: "Cart could not be completed. Please try again."
        }
      }
    }, {
      status: 400
    });
  }
  const headers = new Headers();
  await removeCartId(headers);
  const {
    order
  } = cartResponse;
  if (data$1.noRedirect) {
    return data({
      order
    }, {
      headers
    });
  }
  throw redirect(`/checkout/success?order_id=${order.id}`, {
    headers
  });
}
const route19 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  action: action$2,
  completeCheckoutSchema
}, Symbol.toStringTag, { value: "Module" }));
const addressSchema = z$1.object({
  firstName: z$1.string().optional(),
  lastName: z$1.string().optional(),
  company: z$1.string().optional(),
  address1: z$1.string().optional(),
  address2: z$1.string().optional(),
  city: z$1.string().optional(),
  province: z$1.string().optional(),
  countryCode: z$1.string().min(1, "Country is required"),
  postalCode: z$1.coerce.string().min(1, "Postal code is required"),
  phone: z$1.coerce.string().optional(),
  country: z$1.string().optional()
});
const expressCheckoutSchema = z$1.object({
  cartId: z$1.string(),
  email: z$1.string().email("Please enter a valid email").optional(),
  shippingAddress: addressSchema.optional().nullable(),
  billingAddress: addressSchema.optional().nullable(),
  complete: z$1.boolean().optional(),
  shippingOptions: z$1.array(z$1.string()).optional()
});
async function action$1(actionArgs) {
  const {
    errors,
    data: data2
  } = await getValidatedFormData(actionArgs.request, zodResolver(expressCheckoutSchema));
  if (errors) return Response.json({
    errors
  }, {
    status: 400
  });
  let cart2 = await retrieveCart(actionArgs.request);
  if (!cart2) return Response.json({
    errors: {
      root: {
        message: "Cart could not be retrieved. Please try again."
      }
    }
  }, {
    status: 400
  });
  if (data2.shippingAddress || data2.billingAddress || data2.email) {
    const {
      cart: updatedCart
    } = await updateCart(actionArgs.request, {
      email: data2.email ? data2.email : void 0,
      shipping_address: data2.shippingAddress ? addressToMedusaAddress(data2.shippingAddress) : void 0,
      billing_address: data2.billingAddress ? addressToMedusaAddress(data2.billingAddress) : void 0
    });
    cart2 = updatedCart;
  }
  if (data2.shippingOptions) {
    await Promise.all(data2.shippingOptions.map(async (id) => await setShippingMethod(actionArgs.request, {
      cartId: data2.cartId,
      shippingOptionId: id
    })));
    cart2 = await ensurePaypalPaymentSession(actionArgs.request, cart2);
  }
  console.log(data2, "data");
  if (data2.complete) {
    const cartResponse = await placeOrder(actionArgs.request);
    console.log(cartResponse, "cartResponse");
    if (cartResponse.type === "cart" || !cartResponse) {
      return Response.json({
        errors: {
          root: {
            message: "Cart could not be completed. Please try again."
          }
        }
      }, {
        status: 400
      });
    }
    const headers = new Headers();
    await removeCartId(headers);
    const {
      order
    } = cartResponse;
    return Response.json({
      order
    }, {
      headers
    });
  }
  cart2 = await ensurePaypalPaymentSession(actionArgs.request, cart2);
  const shippingOptions = await listCartShippingOptions(data2.cartId);
  return Response.json({
    cart: cart2,
    shippingOptions
  });
}
const route20 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  action: action$1,
  expressCheckoutSchema
}, Symbol.toStringTag, { value: "Module" }));
const pages = ["/", "/products"];
const loader$c = async ({
  request
}) => {
  const host = request.headers.get("host");
  const baseUrl = `https://${host}`;
  const urls = pages.map((handle) => ({
    loc: `${baseUrl}/${handle}`,
    priority: 0.8,
    changefreq: "daily"
  }));
  const content = buildSitemapUrlSetXML(urls);
  return new Response(content, {
    status: 200,
    headers: {
      "Content-Type": "application/xml",
      "xml-version": "1.0",
      encoding: "UTF-8"
    }
  });
};
const route21 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  loader: loader$c
}, Symbol.toStringTag, { value: "Module" }));
const loader$b = async ({
  request
}) => {
  const {
    collections
  } = await fetchCollections();
  if (!collections.length) throw redirect("/products");
  const collectionsWithProducts = await Promise.all(collections.map(async (collection) => {
    const {
      products,
      count,
      limit,
      offset
    } = await fetchProducts(request, {
      collection_id: collection.id
    });
    return {
      ...collection,
      products,
      count,
      limit,
      offset
    };
  }));
  return {
    collectionsWithProducts
  };
};
const collections__index = UNSAFE_withComponentProps(function ProductCollectionRoute2() {
  const data2 = useLoaderData();
  if (!data2) return null;
  const {
    collectionsWithProducts
  } = data2;
  return /* @__PURE__ */ jsxs(Container, {
    className: "pb-32",
    children: [/* @__PURE__ */ jsx("h1", {
      className: "relative text-center text-[100px] text-[#321D14] mt-24 after:content-[''] after:block after:w-full after:h-[1px] after:bg-[#000000] after:absolute after:bottom-[32px] after:left-0",
      children: /* @__PURE__ */ jsxs("span", {
        className: "inline-block justify-center bg-white z-10 relative px-16 text-center",
        children: [/* @__PURE__ */ jsx("span", {
          className: " font-centuryBook block leading-6",
          children: "All"
        }), /* @__PURE__ */ jsx("span", {
          className: "font-bold font-title uppercase",
          children: "Collections"
        })]
      })
    }), collectionsWithProducts.length > 1 && /* @__PURE__ */ jsx("div", {
      className: "flex flex-col w-full items-center gap-32 collections-index",
      children: collectionsWithProducts.map((collection) => /* @__PURE__ */ jsxs("div", {
        className: "flex flex-col gap-[34px] w-full collections-index_item",
        children: [/* @__PURE__ */ jsx("div", {
          className: "min-h-[54px] flex items-center",
          children: /* @__PURE__ */ jsx(NavLink, {
            to: `/collections/${collection.handle}`,
            className: "rounded-full bg-[#000] text-white uppercase py-2 px-4 text-lg font-body font-bold",
            children: collection.title
          }, collection.id)
        }), /* @__PURE__ */ jsx("div", {
          className: "flex flex-col gap-4 sm:flex-row",
          children: /* @__PURE__ */ jsx("div", {
            className: "flex-1",
            children: /* @__PURE__ */ jsx(ProductGrid, {
              products: collection.products
            })
          })
        })]
      }, collection.id))
    })]
  });
});
const route22 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: collections__index,
  loader: loader$b
}, Symbol.toStringTag, { value: "Module" }));
const listPosts = async function() {
  return cachified({
    key: "list-posts",
    cache: sdkCache,
    staleWhileRevalidate: MILLIS.ONE_HOUR,
    ttl: MILLIS.TEN_SECONDS,
    async getFreshValue() {
      return _listPosts();
    }
  });
};
const _listPosts = async function() {
  return sdk.client.fetch(`/store/blog/posts`, {
    query: {
      limit: 10,
      offset: 0
    }
  });
};
const getPostBySlug = async function(slug) {
  return sdk.client.fetch(`/store/blog/posts/${slug}`, {
    query: {
      limit: 1,
      offset: 0
    }
  });
};
const loader$a = async ({
  request,
  params
}) => {
  const slugHandle = params.slugHandle;
  const {
    post
  } = await getPostBySlug(slugHandle);
  const postData = (post == null ? void 0 : post.length) > 0 ? post[0] : null;
  return {
    post: postData
  };
};
const blogs_$slugHandle = UNSAFE_withComponentProps(function BlogsIndexRoute() {
  const {
    post
  } = useLoaderData();
  const [showBackToTop, setShowBackToTop] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 300);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };
  console.log(post);
  return /* @__PURE__ */ jsxs("section", {
    children: [/* @__PURE__ */ jsxs(Container, {
      className: "flex flex-col gap-12",
      children: [post && /* @__PURE__ */ jsxs(Fragment$1, {
        children: [/* @__PURE__ */ jsxs("div", {
          className: "flex flex-col gap-4",
          children: [/* @__PURE__ */ jsx("h1", {
            className: "text-[110px] font-bold leading-[114px] tracking-0% text-center",
            children: post.title
          }), /* @__PURE__ */ jsx("p", {
            className: "font-centuryBook italic text-[125px] leading-[114px] text-center",
            children: post.sub_title
          }), /* @__PURE__ */ jsx("p", {
            className: "text-lg font-montserrat font-normal text-[15px] leading-[26px] text-center max-w-3xl mx-auto",
            children: post.description
          })]
        }), /* @__PURE__ */ jsx("div", {
          className: "flex flex-col gap-12",
          children: /* @__PURE__ */ jsx("div", {
            dangerouslySetInnerHTML: {
              __html: post.content
            }
          })
        })]
      }), /* @__PURE__ */ jsxs("div", {
        className: "flex justify-center items-center relative mb-[100px]",
        children: [/* @__PURE__ */ jsx("img", {
          src: "/assets/images/blog-btn.webp",
          className: "max-w-[500px]",
          alt: "explore more thought"
        }), /* @__PURE__ */ jsx(Link, {
          to: "/blogs",
          className: "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 hover:text-white px-6 rounded-full border border-primary text-primary bg-outline-primary hover:bg-primary-800 focus:border-primary-500 py-2 whitespace-nowrap !font-bold transition-colors duration-200 justify-center items-center flex",
          children: "explore more thought"
        })]
      })]
    }), /* @__PURE__ */ jsx("button", {
      id: "back-to-top",
      onClick: scrollToTop,
      className: clsx("fixed bottom-8 right-8 z-50 transition-all duration-300 hover:scale-110 cursor-pointer", showBackToTop ? "opacity-100 visible" : "opacity-0 invisible"),
      "aria-label": "Back to top",
      children: /* @__PURE__ */ jsxs("svg", {
        width: "56",
        height: "56",
        viewBox: "0 0 56 56",
        fill: "none",
        xmlns: "http://www.w3.org/2000/svg",
        children: [/* @__PURE__ */ jsx("circle", {
          cx: "28",
          cy: "28",
          r: "28",
          transform: "matrix(1.19249e-08 -1 -1 -1.19249e-08 56 56)",
          fill: "black"
        }), /* @__PURE__ */ jsx("path", {
          d: "M26.5858 17.97C27.3668 17.189 28.6332 17.189 29.4142 17.97L42.1421 30.6979C42.9232 31.479 42.9232 32.7453 42.1421 33.5264C41.3611 34.3074 40.0948 34.3074 39.3137 33.5264L28 22.2127L16.6863 33.5264C15.9052 34.3074 14.6389 34.3074 13.8579 33.5264C13.0768 32.7453 13.0768 31.479 13.8579 30.6979L26.5858 17.97ZM28 21.5381L26 21.5381L26 19.3842L28 19.3842L30 19.3842L30 21.5381L28 21.5381Z",
          fill: "white"
        })]
      })
    })]
  });
});
const route23 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: blogs_$slugHandle,
  loader: loader$a
}, Symbol.toStringTag, { value: "Module" }));
const checkout_success = UNSAFE_withComponentProps(function CheckoutSuccessRoute() {
  return /* @__PURE__ */ jsxs(Fragment$1, {
    children: [/* @__PURE__ */ jsxs("div", {
      className: "bg-[url('/assets/images/checkout/success-bg.png')] bg-contain bg-center contact-success-message text-center mt-8",
      children: [/* @__PURE__ */ jsx("p", {
        className: "text-[150px] font-centuryBook italic",
        children: "Hurray!!!"
      }), /* @__PURE__ */ jsx("p", {
        className: "text-[110px] font-title font-bold",
        children: "WE GOT U ;3"
      }), /* @__PURE__ */ jsx("p", {
        className: "text-[30px] font-title font-light",
        children: "we’ll be delivering sweetness to u soon"
      })]
    }), /* @__PURE__ */ jsx(ProductList, {
      className: "!py-[100px] xl:px-9",
      heading: "You may also like"
    })]
  });
});
const route24 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: checkout_success
}, Symbol.toStringTag, { value: "Module" }));
const loader$9 = async ({
  request
}) => {
  return Response.json({
    status: "It's alive!!!"
  });
};
const route25 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  loader: loader$9
}, Symbol.toStringTag, { value: "Module" }));
const useCustomer = () => {
  const rootData = useRootLoaderData();
  return { customer: rootData == null ? void 0 : rootData.customer };
};
var CheckoutStep = /* @__PURE__ */ ((CheckoutStep2) => {
  CheckoutStep2["CONTACT_INFO"] = "contactInfo";
  CheckoutStep2["ACCOUNT_DETAILS"] = "accountDetails";
  CheckoutStep2["PAYMENT"] = "payment";
  CheckoutStep2["SUCCESS"] = "success";
  return CheckoutStep2;
})(CheckoutStep || {});
const useNextStep = (state) => {
  const { cart: cart2 } = state;
  const { customer } = useCustomer();
  const isLoggedIn = !!(customer == null ? void 0 : customer.id);
  const contactInfoComplete = useMemo(() => checkContactInfoComplete(cart2, customer), [cart2, customer]);
  const accountDetailsComplete = useMemo(() => checkAccountDetailsComplete(cart2), [cart2, isLoggedIn]);
  let nextStep = "accountDetails";
  if (contactInfoComplete) nextStep = "accountDetails";
  if (accountDetailsComplete) nextStep = "payment";
  return nextStep;
};
const CheckoutContext = createContext(null);
const actionHandlers = {
  setStep: (state, step) => {
    return { ...state, step };
  }
};
const reducer = createReducer({
  actionHandlers
});
const CheckoutProvider = ({ data: data2, ...props }) => {
  const initialStep = useNextStep({ ...data2 });
  const initialState = {
    step: initialStep,
    cart: null,
    shippingOptions: [],
    paymentProviders: [],
    activePaymentSession: null
  };
  const [state, dispatch] = useReducer(reducer, initialState);
  return /* @__PURE__ */ jsx(CheckoutContext.Provider, { value: { state: { ...state, ...data2 }, dispatch }, ...props });
};
const actions = ({ dispatch }) => ({
  setStep: (step) => dispatch({ name: "setStep", payload: step })
});
const useCheckout = () => {
  const context = useContext(CheckoutContext);
  const nextStep = useNextStep(context.state);
  const { state } = context;
  const fetchers = useFetchers();
  const cartMutationFetchers = fetchers.filter((f) => f.key.startsWith(FetcherCartKeyPrefix));
  if (!state.step) throw new Error("useCheckout must be used within a CheckoutProvider");
  return {
    ...state,
    ...actions(context),
    goToNextStep: () => context.dispatch({ name: "setStep", payload: nextStep }),
    isCartMutating: cartMutationFetchers.some((f) => ["loading", "submitting"].includes(f.state))
  };
};
const StyledTextField = ({ className, name, ...props }) => {
  return /* @__PURE__ */ jsx(
    TextField,
    {
      ...props,
      className: clsx(
        "[&_input]:!h-12 [&_input]:border-gray-200 [&_input]:!bg-white [&_input]:text-[16px] [&_input]:shadow-sm [&_input]:!ring-0",
        "[&_input:-webkit-autofill]:!transition-[background-color_5000s_ease-in-out_0s]",
        "[&_input:-webkit-autofill]:!shadow-[0_0_0_1000px_white_inset]",
        "[&_label]:text-[16px] [&_label]:text-gray-600",
        className
      ),
      name
    }
  );
};
const CheckoutSectionHeader = ({ completed, setStep, step, children }) => {
  return /* @__PURE__ */ jsxs("header", { className: "relative flex items-center justify-between", children: [
    /* @__PURE__ */ jsx("h2", { className: "text-2xl font-bold text-gray-900", children }),
    completed && /* @__PURE__ */ jsxs(Fragment$1, { children: [
      /* @__PURE__ */ jsx(Button, { className: "text-sm", variant: "link", onClick: () => setStep(step), children: "Edit" }),
      /* @__PURE__ */ jsx("span", { className: "absolute -left-10 mt-0.5 hidden h-6 w-6 items-center justify-center rounded-full bg-green-100 text-green-700 md:flex", children: /* @__PURE__ */ jsx(CheckIcon, { className: "h-4 w-4" }) })
    ] })
  ] });
};
const HiddenAddressGroup = ({ address, prefix }) => {
  return /* @__PURE__ */ jsx(Fragment$1, { children: Object.keys(address).map((key) => {
    const castedKey = key;
    if (address[castedKey] == null) return;
    return /* @__PURE__ */ jsx(
      TextField,
      {
        type: "hidden",
        name: `${prefix}.${key}`,
        value: address[castedKey] ?? ""
      },
      castedKey
    );
  }) });
};
const useEnv = () => {
  const data2 = useRootLoaderData();
  if (!(data2 == null ? void 0 : data2.env)) throw new Error("No env data found, this should be provided in the root loader");
  return { env: data2 == null ? void 0 : data2.env };
};
const MedusaStripeAddress = ({
  title,
  address,
  mode,
  allowedCountries = [],
  setAddress
}) => {
  var _a;
  const { env } = useEnv();
  const { cart: cart2 } = useCheckout();
  const { region } = useRegion();
  const handleChange = (event) => {
    var _a2, _b;
    const fullNameArray = ((_a2 = event.value.name) == null ? void 0 : _a2.split(" ")) || [];
    const firstName = fullNameArray.slice(0, -1).join(" ");
    const lastName = fullNameArray.slice(-1).join(" ");
    const useProvincePlaceHolder = event.complete && !event.value.address.state;
    setAddress({
      address: {
        firstName: event.value.firstName || firstName || "",
        lastName: event.value.lastName || lastName || "",
        address1: event.value.address.line1,
        address2: event.value.address.line2 ?? "",
        province: useProvincePlaceHolder ? "-" : event.value.address.state,
        city: event.value.address.city,
        countryCode: (_b = event.value.address.country) == null ? void 0 : _b.toLowerCase(),
        postalCode: event.value.address.postal_code,
        phone: event.value.phone ?? ""
      },
      completed: event.complete
    });
  };
  const stripePromise = useMemo(() => {
    return env.STRIPE_PUBLIC_KEY ? loadStripe(env.STRIPE_PUBLIC_KEY) : null;
  }, [env.STRIPE_PUBLIC_KEY]);
  if (!cart2) return null;
  return /* @__PURE__ */ jsxs("div", { children: [
    title && /* @__PURE__ */ jsx("h3", { className: "mt-6 text-sm", children: title }),
    /* @__PURE__ */ jsx(
      Elements,
      {
        stripe: stripePromise,
        options: {
          mode: "setup",
          currency: region.currency_code,
          appearance: {
            variables: {
              borderRadius: "6px",
              spacingUnit: "4.601px",
              fontSizeBase: "16px",
              colorText: "#374151",
              fontWeightNormal: "400",
              fontWeightBold: "700",
              fontSizeSm: "16px"
            },
            rules: {
              ".Input": {
                fontSize: "1rem",
                color: "#000000"
              },
              ".Input:focus": {
                boxShadow: "inset 0 0 0 1px rgba(210, 213, 218, 1)"
              },
              ".Label": {
                FontWeight: "700"
              }
            }
          }
        },
        children: /* @__PURE__ */ jsx(
          AddressElement,
          {
            options: {
              mode,
              allowedCountries,
              display: { name: "split" },
              fields: { phone: "always" },
              validation: { phone: { required: "always" } },
              defaultValues: {
                address: {
                  line1: address.address1,
                  line2: address.address2,
                  city: address.city,
                  state: address.province,
                  postal_code: address.postalCode,
                  country: ((_a = address.countryCode) == null ? void 0 : _a.toUpperCase()) || "us"
                },
                phone: address.phone,
                firstName: address.firstName,
                lastName: address.lastName
              }
            },
            onChange: handleChange
          }
        )
      }
    )
  ] });
};
const AddressDisplay = ({ title, address, countryOptions }) => {
  var _a;
  return /* @__PURE__ */ jsxs("span", { children: [
    title && /* @__PURE__ */ jsx("dt", { className: "mt-6 text-sm font-bold text-gray-700", children: title }),
    /* @__PURE__ */ jsxs("dd", { className: "mt-0.5", children: [
      (address == null ? void 0 : address.company) && /* @__PURE__ */ jsxs(Fragment$1, { children: [
        address == null ? void 0 : address.company,
        /* @__PURE__ */ jsx("br", {})
      ] }),
      address == null ? void 0 : address.address1,
      /* @__PURE__ */ jsx("br", {}),
      (address == null ? void 0 : address.address2) && /* @__PURE__ */ jsxs(Fragment$1, { children: [
        address == null ? void 0 : address.address2,
        /* @__PURE__ */ jsx("br", {})
      ] }),
      address == null ? void 0 : address.city,
      ", ",
      address == null ? void 0 : address.province,
      " ",
      address == null ? void 0 : address.postalCode,
      /* @__PURE__ */ jsx("br", {}),
      (address == null ? void 0 : address.countryCode) && /* @__PURE__ */ jsxs(Fragment$1, { children: [
        (_a = countryOptions.find(({ value }) => value === (address == null ? void 0 : address.countryCode))) == null ? void 0 : _a.label,
        /* @__PURE__ */ jsx("br", {})
      ] })
    ] })
  ] });
};
const selectInitialShippingAddress = (cart2, customer) => {
  var _a, _b, _c;
  if (cart2.shipping_address) return cart2.shipping_address;
  if (!customer || !((_a = customer == null ? void 0 : customer.addresses) == null ? void 0 : _a.length)) return null;
  const customerAddress = (customer == null ? void 0 : customer.default_shipping_address_id) ? (_b = customer.addresses) == null ? void 0 : _b.find((a) => a.id === (customer == null ? void 0 : customer.default_shipping_address_id)) : (_c = customer == null ? void 0 : customer.addresses) == null ? void 0 : _c[0];
  return customerAddress || null;
};
const NEW_SHIPPING_ADDRESS_ID = "new";
const CheckoutAccountDetails = () => {
  var _a, _b, _c;
  const checkoutAccountDetailsFormFetcher = useFetcher({ key: FetcherKeys.cart.accountDetails });
  const { customer } = useCustomer();
  const { regions } = useRegions();
  const { step, setStep, goToNextStep, cart: cart2, isCartMutating } = useCheckout();
  const isActiveStep = step === CheckoutStep.ACCOUNT_DETAILS;
  if (!cart2) return null;
  const allowedCountries = (regions ?? []).flatMap(
    (region) => region.countries.map((country) => country.iso_2)
  );
  const initialShippingAddress = selectInitialShippingAddress(cart2, customer);
  const isComplete = checkAccountDetailsComplete(cart2);
  const isSubmitting = ["submitting", "loading"].includes(checkoutAccountDetailsFormFetcher.state);
  const hasErrors = !!((_a = checkoutAccountDetailsFormFetcher.data) == null ? void 0 : _a.errors);
  const initialShippingAddressId = (initialShippingAddress == null ? void 0 : initialShippingAddress.id) ?? NEW_SHIPPING_ADDRESS_ID;
  const countryOptions = ((_c = (_b = cart2.region) == null ? void 0 : _b.countries) == null ? void 0 : _c.map((country) => ({
    value: country.iso_2,
    label: country.display_name
  }))) ?? [];
  const defaultValues = {
    cartId: cart2.id,
    email: (customer == null ? void 0 : customer.email) || cart2.email || "",
    customerId: customer == null ? void 0 : customer.id,
    allowSuggestions: true,
    shippingAddress: {
      ...medusaAddressToAddress(initialShippingAddress)
    },
    shippingAddressId: initialShippingAddressId
  };
  const form = useRemixForm({
    resolver: zodResolver(accountDetailsSchema),
    defaultValues,
    fetcher: checkoutAccountDetailsFormFetcher,
    submitConfig: {
      method: "post",
      action: "/api/checkout/account-details"
    }
  });
  const setShippingAddress = (address) => {
    form.setValue("shippingAddress.address1", address.address.address1 ?? "");
    form.setValue("shippingAddress.address2", address.address.address2 ?? "");
    form.setValue("shippingAddress.city", address.address.city ?? "");
    form.setValue("shippingAddress.province", address.address.province ?? "");
    form.setValue("shippingAddress.countryCode", address.address.countryCode ?? "");
    form.setValue("shippingAddress.postalCode", address.address.postalCode ?? "");
    form.setValue("shippingAddress.phone", address.address.phone ?? "");
    form.setValue("shippingAddress.firstName", address.address.firstName ?? "");
    form.setValue("shippingAddress.lastName", address.address.lastName ?? "");
    form.setValue("shippingAddress.company", address.address.company ?? "");
    form.setValue("shippingAddress.phone", address.address.phone ?? "");
  };
  const shippingAddress = form.watch("shippingAddress");
  useEffect(() => {
    if (isActiveStep && !isSubmitting && !hasErrors && isComplete) {
      form.reset();
      goToNextStep();
    }
  }, [isSubmitting, isComplete]);
  const handleCancel = () => {
    goToNextStep();
  };
  const showCompleted = isComplete && !isActiveStep;
  return /* @__PURE__ */ jsxs("div", { className: "checkout-account-details", children: [
    /* @__PURE__ */ jsx(CheckoutSectionHeader, { completed: showCompleted, setStep, step: CheckoutStep.ACCOUNT_DETAILS, children: "Account details" }),
    !isActiveStep && isComplete && /* @__PURE__ */ jsx(AddressDisplay, { title: "Shipping Address", address: shippingAddress, countryOptions }),
    isActiveStep && /* @__PURE__ */ jsxs(Fragment$1, { children: [
      (customer == null ? void 0 : customer.email) ? /* @__PURE__ */ jsx("p", { className: "mt-2 text-sm mb-2", children: "To get started, please select your shipping address." }) : /* @__PURE__ */ jsx("p", { className: "mt-2 text-sm mb-4", children: "To get started, enter your email address." }),
      /* @__PURE__ */ jsx(RemixFormProvider, { ...form, children: /* @__PURE__ */ jsxs(checkoutAccountDetailsFormFetcher.Form, { id: "checkout-account-details-form", onSubmit: form.handleSubmit, children: [
        /* @__PURE__ */ jsx(TextField, { type: "hidden", name: "cartId" }),
        /* @__PURE__ */ jsx(TextField, { type: "hidden", name: "customerId" }),
        /* @__PURE__ */ jsx(
          StyledTextField,
          {
            name: "email",
            type: "email",
            autoComplete: "email",
            placeholder: "Email address",
            label: "Email Address",
            className: "[&_input]:!ring-0 mb-2"
          }
        ),
        /* @__PURE__ */ jsx(HiddenAddressGroup, { address: shippingAddress, prefix: "shippingAddress" }),
        /* @__PURE__ */ jsx(StyledTextField, { type: "hidden", name: "shippingAddressId", value: initialShippingAddressId }),
        /* @__PURE__ */ jsx(
          MedusaStripeAddress,
          {
            mode: "shipping",
            address: shippingAddress,
            allowedCountries,
            setAddress: setShippingAddress
          }
        ),
        /* @__PURE__ */ jsx(FormError, {}),
        /* @__PURE__ */ jsxs(Actions, { children: [
          /* @__PURE__ */ jsx(SubmitButton, { disabled: isSubmitting || isCartMutating, children: isSubmitting ? "Saving..." : "Save and continue" }),
          isComplete && /* @__PURE__ */ jsx(Button, { disabled: isSubmitting, onClick: handleCancel, children: "Cancel edit" })
        ] })
      ] }) })
    ] })
  ] });
};
const StripeBadge = "/assets/StripeBadge-D70kF_jj.png";
const StripeSecurityImage = ({ className }) => {
  return /* @__PURE__ */ jsx("img", { className, width: 320, src: StripeBadge, alt: "stripe security badge" });
};
const ShippingOptionsRadioGroupOption = ({
  shippingOption,
  region,
  value
}) => {
  const isSelected = value === shippingOption.id;
  return /* @__PURE__ */ jsx("div", { className: "relative col-span-1", children: /* @__PURE__ */ jsx("label", { htmlFor: shippingOption.id, className: "", children: /* @__PURE__ */ jsxs(
    "div",
    {
      className: clsx(
        "group relative flex h-full flex-col justify-between rounded-lg border bg-white p-4 shadow-sm",
        "active:ring-primary-500 hover:border-gray-400 focus:outline-none active:ring-2",
        isSelected ? "border-transparent" : "border-gray-300"
      ),
      children: [
        /* @__PURE__ */ jsxs("div", { className: "flex justify-between gap-1", children: [
          /* @__PURE__ */ jsx("div", { className: "block text-sm font-bold text-gray-900", children: shippingOption.name }),
          /* @__PURE__ */ jsx(
            RadioGroupItem,
            {
              id: shippingOption.id,
              value: shippingOption.id,
              className: "text-primary-600 h-5 w-5 border-0",
              indicator: /* @__PURE__ */ jsx(CheckCircleIcon, { className: "text-primary-600 h-5 w-5", "aria-hidden": "true" })
            }
          )
        ] }),
        /* @__PURE__ */ jsx("div", { className: "mt-6 flex items-end justify-between text-sm text-gray-500", children: /* @__PURE__ */ jsx("div", { children: formatPrice(shippingOption.amount, { currency: region.currency_code }) }) }),
        /* @__PURE__ */ jsx(
          "div",
          {
            className: clsx(
              "pointer-events-none absolute -inset-px rounded-lg border-2 active:border",
              isSelected ? "border-primary-500" : "border-transparent"
            ),
            "aria-hidden": "true"
          }
        )
      ]
    }
  ) }) });
};
const ShippingOptionsRadioGroup = ({
  name,
  shippingOptions,
  region,
  value,
  onValueChange,
  disabled
}) => {
  const form = useRemixFormContext();
  const isSubmitting = form.formState.isSubmitting;
  const handleChange = async (newValue) => {
    if (isSubmitting) return;
    onValueChange == null ? void 0 : onValueChange(newValue);
    try {
      await form.handleSubmit();
    } catch (error) {
      console.error("Failed to submit shipping option:", error);
    }
  };
  if (!shippingOptions.length) {
    return /* @__PURE__ */ jsx("div", { children: "No shipping options available" });
  }
  return /* @__PURE__ */ jsx(
    RadioGroup$1,
    {
      name,
      value: value ?? "",
      onValueChange: handleChange,
      className: clsx$1("xs:grid-cols-2 my-6 grid grid-cols-1 gap-4", isSubmitting && "pointer-events-none"),
      disabled: isSubmitting || disabled,
      children: shippingOptions.map((shippingOption) => /* @__PURE__ */ jsx(ShippingOptionsRadioGroupOption, { shippingOption, region }, shippingOption.id))
    }
  );
};
const getShippingOptionsDefaultValues = (cart2, shippingOptionsByProfile) => {
  var _a;
  const values = ((_a = cart2.shipping_methods) == null ? void 0 : _a.map((sm) => sm.shipping_option_id)) ?? [];
  return Object.values(shippingOptionsByProfile).reduce((acc, shippingOptions) => {
    const match = shippingOptions.find((so) => values.includes(so.id));
    acc.push(match ? match.id : shippingOptions[0].id);
    return acc;
  }, []);
};
const getDefaultValues = (cart2, shippingOptionsByProfile) => ({
  cartId: cart2.id,
  shippingOptionIds: getShippingOptionsDefaultValues(cart2, shippingOptionsByProfile)
});
const CheckoutDeliveryMethod = () => {
  var _a, _b, _c;
  const fetcher = useFetcher();
  const { step, shippingOptions, setStep, goToNextStep, cart: cart2, isCartMutating } = useCheckout();
  const isActiveStep = step === CheckoutStep.PAYMENT;
  const isSubmitting = ["submitting", "loading"].includes(fetcher.state);
  if (!cart2) return null;
  const hasErrors = !!((_a = fetcher.data) == null ? void 0 : _a.errors);
  const hasCompletedAccountDetails = checkAccountDetailsComplete(cart2);
  const shippingOptionsByProfile = useMemo(() => getShippingOptionsByProfile(shippingOptions), [shippingOptions]);
  const isComplete = useMemo(() => checkDeliveryMethodComplete(cart2, shippingOptions), [cart2, shippingOptions]);
  const defaultValues = useMemo(
    () => getDefaultValues(cart2, shippingOptionsByProfile),
    [cart2, shippingOptionsByProfile]
  );
  const form = useRemixForm({
    resolver: zodResolver(shippingMethodsSchema),
    defaultValues,
    fetcher,
    submitConfig: {
      method: "post",
      action: "/api/checkout/shipping-methods"
    }
  });
  const values = form.watch("shippingOptionIds");
  useEffect(() => {
    var _a2;
    form.setValue("shippingOptionIds", ((_a2 = cart2.shipping_methods) == null ? void 0 : _a2.map((sm) => sm.shipping_option_id)) ?? []);
  }, [cart2.shipping_methods]);
  useEffect(() => {
    if (isActiveStep && !isSubmitting && !hasErrors && isComplete) goToNextStep();
  }, [isSubmitting, isComplete]);
  const showCompleted = !isActiveStep && hasCompletedAccountDetails;
  return /* @__PURE__ */ jsxs("div", { className: "checkout-delivery-method", children: [
    /* @__PURE__ */ jsx(CheckoutSectionHeader, { completed: showCompleted, setStep, step: CheckoutStep.PAYMENT, children: "Delivery & Payment" }),
    !isActiveStep && /* @__PURE__ */ jsxs(Fragment$1, { children: [
      ((_b = cart2.shipping_methods) == null ? void 0 : _b.length) === 0 && /* @__PURE__ */ jsx(StripeSecurityImage, { className: "mt-4" }),
      /* @__PURE__ */ jsx("dl", { children: (_c = cart2.shipping_methods) == null ? void 0 : _c.map((shippingMethod, shippingMethodIndex) => {
        var _a2;
        const { id, shipping_option_id, amount } = shippingMethod;
        const shipping_option = shippingOptions.find((so) => so.id === shipping_option_id);
        return /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsx("dt", { className: `${shippingMethodIndex > 0 ? "mt-6" : "mt-4"} text-sm font-bold text-gray-700`, children: "Delivery method for: All items" }),
          /* @__PURE__ */ jsxs("dd", { className: "mt-0.5", children: [
            shipping_option == null ? void 0 : shipping_option.name,
            " (",
            formatPrice(amount, {
              currency: (_a2 = cart2 == null ? void 0 : cart2.region) == null ? void 0 : _a2.currency_code
            }),
            ")"
          ] })
        ] }, id);
      }) })
    ] }),
    isActiveStep && /* @__PURE__ */ jsx(RemixFormProvider, { ...form, children: /* @__PURE__ */ jsxs(fetcher.Form, { children: [
      /* @__PURE__ */ jsx(TextField, { type: "hidden", name: "cartId", value: cart2.id }),
      Object.entries(shippingOptionsByProfile).map(
        ([profileId, shippingOptions2], shippingOptionProfileIndex) => {
          var _a2;
          if (shippingOptions2.length < 1) return null;
          return /* @__PURE__ */ jsxs(Fragment, { children: [
            shippingOptionProfileIndex > 0 && /* @__PURE__ */ jsx("hr", { className: "my-6" }),
            !!((_a2 = cart2 == null ? void 0 : cart2.shipping_methods) == null ? void 0 : _a2.length) && /* @__PURE__ */ jsx(Alert, { type: "info", className: "my-6", children: "Choose your delivery option" }),
            /* @__PURE__ */ jsx(
              ShippingOptionsRadioGroup,
              {
                disabled: isCartMutating,
                name: `shippingOptionIds.${shippingOptionProfileIndex}`,
                shippingOptions: shippingOptions2,
                region: cart2.region,
                value: (values == null ? void 0 : values[shippingOptionProfileIndex]) ?? null,
                onValueChange: (value) => form.setValue(`shippingOptionIds.${shippingOptionProfileIndex}`, value)
              }
            )
          ] }, profileId);
        }
      )
    ] }) })
  ] });
};
const expressCheckoutClient = {
  update: async (data2) => {
    const response = await fetch("/api/checkout/express", {
      method: "POST",
      body: convertToFormData(data2)
    });
    if (!response.ok) return [null, new Error("Failed to update shipping address")];
    return [await response.json(), null];
  }
};
function PaypalExpressCheckout({ cart: cart2 }) {
  const navigate = useNavigate();
  const { paymentProviders, step } = useCheckout();
  const [errorState, setErrorState] = useState(null);
  const [currentCart, setCurrentCart] = useState(cart2);
  const isActiveStep = step === CheckoutStep.PAYMENT;
  const isPaypalAvailable = useMemo(() => {
    return paymentProviders == null ? void 0 : paymentProviders.some((p) => {
      var _a;
      return (_a = p.id) == null ? void 0 : _a.includes("paypal");
    });
  }, [paymentProviders]);
  const initialOptions = useMemo(
    () => ({
      clientId: "AUvtGlVenK_bQoUrek0Nl43oRCDETrBjP2ZlhRQcdBuJp1Pt16gSaitZV3aXAhUFIIQBGY29PqKhncLq",
      components: "buttons",
      intent: "capture",
      currency: (currentCart.currency_code || "USD").toUpperCase()
    }),
    [currentCart.currency_code]
  );
  useEffect(() => {
    setCurrentCart(cart2);
  }, [cart2]);
  if (!currentCart || !isPaypalAvailable) return null;
  const styles = {
    borderRadius: 10
  };
  const handleCreateOrder = async () => {
    var _a, _b, _c;
    const [updatedCartRes, updateError] = await expressCheckoutClient.update({
      cartId: currentCart.id,
      complete: false
    });
    if (updateError) {
      setErrorState({ title: "Error updating account details", description: updateError.message });
      return "";
    }
    const updatedCart = updatedCartRes.cart;
    const paymentSession = (_b = (_a = updatedCart.payment_collection) == null ? void 0 : _a.payment_sessions) == null ? void 0 : _b[0];
    return ((_c = paymentSession == null ? void 0 : paymentSession.data) == null ? void 0 : _c.id) || "";
  };
  const handleApprove = async (_data, actions2) => {
    try {
      if (!(actions2 == null ? void 0 : actions2.order)) return;
      const [checkoutRes, checkoutError] = await expressCheckoutClient.update({
        cartId: currentCart.id,
        complete: true
      });
      if (checkoutError) {
        setErrorState({ title: "Payment failed", description: checkoutError.message });
        return;
      }
      const { order } = checkoutRes;
      if (!order) {
        setErrorState({ title: "Payment failed", description: "Error trying to complete checkout." });
        return;
      }
      navigate(`/checkout/success?order_id=${order.id}`);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Error trying to submit payment.";
      setErrorState({ title: "Payment failed", description: message });
    }
  };
  return /* @__PURE__ */ jsxs("div", { className: clsx("App", !isActiveStep && "hidden"), children: [
    errorState ? /* @__PURE__ */ jsx(Alert, { type: "error", title: errorState.title, className: "mt-4", children: errorState.description }) : null,
    /* @__PURE__ */ jsx("div", { className: "py-4 relative z-0", children: /* @__PURE__ */ jsx(PayPalScriptProvider, { options: initialOptions, children: /* @__PURE__ */ jsx(
      PayPalButtons,
      {
        style: styles,
        createOrder: handleCreateOrder,
        onApprove: handleApprove,
        onError: (err) => {
          const message = err instanceof Error ? err.message : "PayPal error";
          setErrorState({ title: "Payment failed", description: message });
        }
      }
    ) }) })
  ] });
}
const CheckoutFlow = () => {
  const { customer } = useCustomer();
  const { goToNextStep, cart: cart2 } = useCheckout();
  const isLoggedIn = !!(customer == null ? void 0 : customer.id);
  if (!cart2) return;
  useEffect(() => {
    if (isLoggedIn) goToNextStep();
    return () => goToNextStep();
  }, [isLoggedIn]);
  return /* @__PURE__ */ jsx(Fragment$1, { children: /* @__PURE__ */ jsxs("div", { className: "lg:min-h-[calc(100vh-320px)] lg:pl-8", children: [
    isLoggedIn && /* @__PURE__ */ jsxs(Alert, { type: "info", className: "mb-8", children: [
      "Checking out as:",
      " ",
      /* @__PURE__ */ jsxs("strong", { className: "font-bold", children: [
        customer.first_name,
        " ",
        customer.last_name,
        " (",
        customer.email,
        ")"
      ] })
    ] }),
    /* @__PURE__ */ jsx(CheckoutAccountDetails, {}),
    /* @__PURE__ */ jsx("hr", { className: "my-10" }),
    /* @__PURE__ */ jsx(CheckoutDeliveryMethod, {}),
    /* @__PURE__ */ jsx(PaypalExpressCheckout, { cart: cart2 })
  ] }) });
};
const LineItemQuantitySelect = ({
  formId,
  item,
  className,
  maxInventory = 10,
  ...props
}) => {
  const fetcher = useFetcher({ key: FetcherKeys.cart.updateLineItem });
  const isLoading = ["submitting", "loading"].includes(fetcher.state);
  const form = useRemixForm({
    resolver: zodResolver(updateLineItemSchema),
    defaultValues: {
      lineItemId: item.id,
      quantity: item.quantity.toString()
    },
    fetcher,
    submitConfig: {
      method: "post",
      action: "/api/cart/line-items/update"
    }
  });
  const handleChange = (quantity) => {
    fetcher.submit(
      {
        lineItemId: item.id,
        quantity
      },
      { method: "post", action: "/api/cart/line-items/update" }
    );
  };
  return /* @__PURE__ */ jsx(RemixFormProvider, { ...form, children: /* @__PURE__ */ jsx(
    fetcher.Form,
    {
      id: formId,
      className: clsx("line-item-quantity-select", className),
      ...props,
      onSubmit: form.handleSubmit,
      children: /* @__PURE__ */ jsx(
        QuantitySelector,
        {
          formId,
          className: clsx({
            "pointer-events-none opacity-50": isLoading
          }),
          variant: item.variant,
          onChange: handleChange
        }
      )
    }
  ) });
};
const CheckoutOrderSummaryItem = ({ item, name }) => {
  var _a, _b, _c;
  const { cart: cart2 } = useCheckout();
  const removeCartItem = useRemoveCartItem();
  const handleRemoveFromCart = () => removeCartItem.submit(item);
  const isRemovingFromCart = ["loading", "submitting"].includes(removeCartItem.state);
  if (!cart2) return null;
  return /* @__PURE__ */ jsxs("li", { className: "flex px-4 py-6 sm:px-6", children: [
    /* @__PURE__ */ jsx("div", { className: "flex-shrink-0", children: /* @__PURE__ */ jsx(
      Image,
      {
        src: ((_b = (_a = item.variant) == null ? void 0 : _a.product) == null ? void 0 : _b.thumbnail) || "",
        alt: item.product_title || "product thumbnail",
        className: "w-20 rounded-md"
      }
    ) }),
    /* @__PURE__ */ jsxs("div", { className: "ml-6 flex flex-1 flex-col", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex", children: [
        /* @__PURE__ */ jsxs("div", { className: "min-w-0 flex-1", children: [
          /* @__PURE__ */ jsx("h4", { className: "text-base", children: /* @__PURE__ */ jsx(Link, { to: `/products/${item.product_handle}`, className: "font-bold text-gray-700 hover:text-gray-800", children: item.product_title }) }),
          /* @__PURE__ */ jsx("p", { className: "mt-0.5 text-sm text-gray-500", children: item.variant_title })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "ml-4 flow-root flex-shrink-0", children: /* @__PURE__ */ jsx(Button, { variant: "link", onClick: handleRemoveFromCart, disabled: isRemovingFromCart, className: "text-sm", children: isRemovingFromCart ? "Removing" : "Remove" }) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex flex-1 items-end justify-between pt-2", children: [
        /* @__PURE__ */ jsx("div", { className: "mr-4", children: /* @__PURE__ */ jsx(LineItemQuantitySelect, { formId: `quantity-${name}-${item.id}`, item }) }),
        /* @__PURE__ */ jsx("p", { className: "mt-1 text-lg", children: /* @__PURE__ */ jsx("span", { className: "font-bold text-gray-900", children: formatPrice(item.unit_price, {
          currency: (_c = cart2.region) == null ? void 0 : _c.currency_code
        }) }) })
      ] })
    ] })
  ] });
};
const CheckoutOrderSummaryItems = ({ cart: cart2, name }) => {
  var _a;
  return /* @__PURE__ */ jsx("ul", { role: "list", className: "divide-y divide-gray-200", children: (_a = cart2.items) == null ? void 0 : _a.map((item) => /* @__PURE__ */ jsx(CheckoutOrderSummaryItem, { item, name }, item.id)) });
};
const RemovePromotionCodeButton = ({ cart: cart2, promotion }) => {
  const fetcher = useFetcher({ key: FetcherKeys.cart.removePromotionCode });
  if (["submitting", "loading"].includes(fetcher.state)) return null;
  return /* @__PURE__ */ jsxs(fetcher.Form, { method: "post", action: "/api/checkout/remove-discount-code", children: [
    /* @__PURE__ */ jsx("input", { type: "hidden", name: "cartId", value: cart2.id }),
    /* @__PURE__ */ jsx("input", { type: "hidden", name: "code", value: promotion.code }),
    /* @__PURE__ */ jsxs("button", { className: "focus:ring-primary-100 focus:border-primary-100 inline-flex h-8 items-center rounded-md border border-gray-300 bg-white px-2 text-xs font-bold text-gray-900 shadow-sm hover:bg-gray-100", children: [
      /* @__PURE__ */ jsx("span", { children: promotion.code }),
      /* @__PURE__ */ jsx("div", { className: "ml-[4px] inline-block text-gray-400", children: /* @__PURE__ */ jsx(XMarkIcon, { className: "inline-block h-4 w-4 leading-none" }) })
    ] })
  ] });
};
const CheckoutOrderSummaryDiscountCode = ({ cart: cart2 }) => {
  var _a, _b, _c;
  const formRef = useRef(null);
  const inputRef = useRef(null);
  const fetcher = useFetcher();
  const [isFormVisible, setIsFormVisible] = useState(!!cart2.promotions.length);
  const hasDiscounts = !!((_a = cart2.promotions) == null ? void 0 : _a.length);
  const hasErrors = Object.keys(((_b = fetcher.data) == null ? void 0 : _b.errors) || {}).length > 0;
  const isSubmitting = ["submitting", "loading"].includes(fetcher.state);
  const form = useRemixForm({
    resolver: zodResolver(discountCodeSchema),
    defaultValues: {
      cartId: cart2.id,
      code: ""
    },
    fetcher,
    submitConfig: {
      method: "post",
      action: "/api/checkout/discount-code"
    }
  });
  useEffect(() => {
    var _a2;
    if (!isSubmitting && !hasErrors) {
      form.reset();
      (_a2 = inputRef.current) == null ? void 0 : _a2.focus();
    }
  }, [isSubmitting, hasErrors]);
  const handleAddCodeClick = () => {
    setIsFormVisible(true);
    setTimeout(() => {
      var _a2;
      return (_a2 = inputRef.current) == null ? void 0 : _a2.focus();
    }, 0);
  };
  return /* @__PURE__ */ jsxs("div", { className: "mb-6", children: [
    !isFormVisible && /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx(ButtonLink, { size: "sm", onClick: handleAddCodeClick, children: "Add promo code" }) }),
    isFormVisible && /* @__PURE__ */ jsxs(Fragment$1, { children: [
      /* @__PURE__ */ jsx(RemixFormProvider, { ...form, children: /* @__PURE__ */ jsxs(fetcher.Form, { ref: formRef, onSubmit: form.handleSubmit, children: [
        /* @__PURE__ */ jsx("input", { type: "hidden", name: "cartId", value: cart2.id }),
        /* @__PURE__ */ jsxs("div", { className: "!my-0 !flex items-start gap-1", children: [
          /* @__PURE__ */ jsx(
            StyledTextField,
            {
              name: "code",
              className: "flex-grow",
              placeholder: "Discount code",
              "aria-label": "discount code"
            }
          ),
          /* @__PURE__ */ jsx(SubmitButton, { type: "submit", className: "flex-shrink-0 flex-grow-0", disabled: isSubmitting, children: isSubmitting ? "Applying..." : "Apply" })
        ] }),
        /* @__PURE__ */ jsx(FormError, {})
      ] }) }),
      hasDiscounts && /* @__PURE__ */ jsx("div", { className: "mt-2", children: (_c = cart2.promotions) == null ? void 0 : _c.map((promotion) => /* @__PURE__ */ jsx(RemovePromotionCodeButton, { cart: cart2, promotion }, promotion.id)) })
    ] })
  ] });
};
const CheckoutOrderSummaryTotalsItem = ({
  label,
  amount,
  className,
  region
}) => /* @__PURE__ */ jsxs("div", { className: clsx("flex items-center justify-between text-sm", className), children: [
  /* @__PURE__ */ jsx("dt", { children: label }),
  /* @__PURE__ */ jsx("dd", { className: "font-bold text-gray-900", children: formatPrice(amount || 0, { currency: region == null ? void 0 : region.currency_code }) })
] });
const CheckoutOrderSummaryTotals = ({ shippingOptions, cart: cart2 }) => {
  const shippingMethods = cart2.shipping_methods || [];
  const hasShippingMethod = shippingMethods.length > 0;
  const estimatedShipping = calculateEstimatedShipping(shippingOptions);
  const discountTotal = cart2.discount_total ?? 0;
  const shippingAmount = cart2.shipping_total ?? 0;
  const cartTotal = cart2.total ?? 0;
  const total = hasShippingMethod ? cartTotal : cartTotal + estimatedShipping;
  return /* @__PURE__ */ jsxs("div", { className: "border-t border-gray-200 px-4 py-6 sm:px-6", children: [
    /* @__PURE__ */ jsx(CheckoutOrderSummaryDiscountCode, { cart: cart2 }),
    /* @__PURE__ */ jsxs("dl", { className: "flex flex-col gap-2", children: [
      /* @__PURE__ */ jsx(CheckoutOrderSummaryTotalsItem, { label: "Subtotal", amount: cart2.item_subtotal, region: cart2.region }),
      discountTotal > 0 && /* @__PURE__ */ jsx(CheckoutOrderSummaryTotalsItem, { label: "Discount", amount: -discountTotal, region: cart2.region }),
      hasShippingMethod && /* @__PURE__ */ jsx(CheckoutOrderSummaryTotalsItem, { label: "Shipping", amount: shippingAmount, region: cart2.region }),
      !hasShippingMethod && /* @__PURE__ */ jsx(CheckoutOrderSummaryTotalsItem, { label: "Estimated Shipping", amount: estimatedShipping, region: cart2.region }),
      /* @__PURE__ */ jsx(CheckoutOrderSummaryTotalsItem, { label: "Taxes", amount: cart2.tax_total, region: cart2.region }),
      /* @__PURE__ */ jsx(
        CheckoutOrderSummaryTotalsItem,
        {
          label: "Total",
          amount: total,
          className: "border-t border-gray-200 pt-6 !text-xl",
          region: cart2.region
        }
      )
    ] })
  ] });
};
const CheckoutOrderSummary = ({ submitButton, name }) => {
  const { shippingOptions, cart: cart2 } = useCheckout();
  if (!cart2) return null;
  return /* @__PURE__ */ jsxs("div", { className: "my-0 rounded-lg border border-gray-200 bg-white shadow-sm", children: [
    /* @__PURE__ */ jsx("h3", { className: "sr-only", children: "Items in your cart" }),
    /* @__PURE__ */ jsx(CheckoutOrderSummaryItems, { cart: cart2, name }),
    /* @__PURE__ */ jsx(
      CheckoutOrderSummaryTotals,
      {
        cart: cart2,
        shippingOptions
      }
    ),
    submitButton && /* @__PURE__ */ jsx("div", { className: "border-t border-gray-200 p-4 sm:p-6", children: submitButton })
  ] });
};
const CheckoutSidebar = () => {
  const { step } = useCheckout();
  return /* @__PURE__ */ jsx(
    "div",
    {
      className: clsx("h-full", {
        "hidden lg:block": step === CheckoutStep.PAYMENT
      }),
      children: /* @__PURE__ */ jsx("div", { className: "sticky top-24", children: /* @__PURE__ */ jsx(CheckoutOrderSummary, { name: "sidebar" }) })
    }
  );
};
const Empty = ({ icon: Icon, title, description, action: action2 }) => /* @__PURE__ */ jsxs("div", { className: "py-16 text-center", children: [
  Icon && /* @__PURE__ */ jsx("div", { className: "inline-block text-gray-300", children: /* @__PURE__ */ jsx(Icon, { className: "h-10 w-10" }) }),
  /* @__PURE__ */ jsx("h2", { className: "mt-2 text-lg font-bold text-gray-900", children: title }),
  /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-gray-500", children: description }),
  action2 && /* @__PURE__ */ jsx("div", { className: "mt-6", children: action2 })
] });
const listCartPaymentProviders = async (regionId) => {
  return sdk.store.payment.listPaymentProviders({ region_id: regionId }).then(({ payment_providers }) => payment_providers).catch(() => []);
};
const SYSTEM_PROVIDER_ID = "pp_system_default";
const fetchShippingOptions = async (cartId) => {
  if (!cartId) return [];
  try {
    const {
      shipping_options
    } = await sdk.store.fulfillment.listCartOptions({
      cart_id: cartId
    });
    return shipping_options;
  } catch (e) {
    console.error(e);
    return [];
  }
};
const findCheapestShippingOption = (shippingOptions) => {
  return shippingOptions.reduce((cheapest, current) => {
    return cheapest.amount <= current.amount ? cheapest : current;
  }, shippingOptions[0]);
};
const ensureSelectedCartShippingMethod = async (request, cart2) => {
  var _a;
  const selectedShippingMethod = (_a = cart2.shipping_methods) == null ? void 0 : _a[0];
  if (selectedShippingMethod) return;
  const shippingOptions = await fetchShippingOptions(cart2.id);
  const cheapestShippingOption = findCheapestShippingOption(shippingOptions);
  if (cheapestShippingOption) {
    await setShippingMethod(request, {
      cartId: cart2.id,
      shippingOptionId: cheapestShippingOption.id
    });
  }
};
const ensureCartPaymentSessions = async (request, cart2) => {
  var _a, _b, _c;
  if (!cart2) throw new Error("Cart was not provided.");
  let activeSession = (_b = (_a = cart2.payment_collection) == null ? void 0 : _a.payment_sessions) == null ? void 0 : _b.find((session) => session.status === "pending");
  if (!activeSession) {
    const paymentProviders = await listCartPaymentProviders(cart2.region_id);
    if (!paymentProviders.length) return activeSession;
    const provider = paymentProviders.find((p) => p.id !== SYSTEM_PROVIDER_ID) || paymentProviders[0];
    const {
      payment_collection
    } = await initiatePaymentSession(request, cart2, {
      provider_id: provider.id
    });
    activeSession = (_c = payment_collection.payment_sessions) == null ? void 0 : _c.find((session) => session.status === "pending");
  }
  return activeSession;
};
const loader$8 = async ({
  request
}) => {
  const cartId = await getCartId(request.headers);
  if (!cartId) {
    return {
      cart: null,
      shippingOptions: [],
      paymentProviders: [],
      activePaymentSession: null
    };
  }
  const cart2 = await retrieveCart(request).catch((e) => null);
  if (!cart2) {
    throw redirect("/");
  }
  if (cart2.completed_at) {
    const headers = new Headers();
    await removeCartId(headers);
    throw redirect(`/`, {
      headers
    });
  }
  await ensureSelectedCartShippingMethod(request, cart2);
  const [shippingOptions, paymentProviders, activePaymentSession] = await Promise.all([await fetchShippingOptions(cartId), await listCartPaymentProviders(cart2.region_id), await ensureCartPaymentSessions(request, cart2)]);
  const updatedCart = await retrieveCart(request);
  return {
    cart: updatedCart,
    shippingOptions,
    paymentProviders,
    activePaymentSession
  };
};
const checkout__index = UNSAFE_withComponentProps(function CheckoutIndexRoute() {
  var _a;
  const {
    shippingOptions,
    paymentProviders,
    activePaymentSession,
    cart: cart2
  } = useLoaderData();
  if (!cart2 || !((_a = cart2.items) == null ? void 0 : _a.length)) return /* @__PURE__ */ jsx(Empty, {
    icon: ShoppingCartIcon$1,
    title: "No items in your cart.",
    description: "Add items to your cart",
    action: /* @__PURE__ */ jsx(Button, {
      variant: "primary",
      as: (buttonProps) => /* @__PURE__ */ jsx(Link, {
        to: "/products",
        ...buttonProps
      }),
      children: "Start shopping"
    })
  });
  return /* @__PURE__ */ jsx(CheckoutProvider, {
    data: {
      cart: cart2,
      activePaymentSession,
      shippingOptions,
      paymentProviders
    },
    children: /* @__PURE__ */ jsx("section", {
      children: /* @__PURE__ */ jsx("div", {
        className: "mx-auto max-w-2xl px-4 pb-8 pt-6 sm:px-6 sm:pb-16 sm:pt-8 lg:max-w-7xl lg:px-8 lg:pb-24 lg:pt-16",
        children: /* @__PURE__ */ jsxs("div", {
          className: "lg:grid lg:grid-cols-[4fr_3fr] lg:gap-x-12 xl:gap-x-16",
          children: [/* @__PURE__ */ jsx(CheckoutFlow, {}), /* @__PURE__ */ jsx(CheckoutSidebar, {})]
        })
      })
    })
  });
});
const route26 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: checkout__index,
  loader: loader$8
}, Symbol.toStringTag, { value: "Module" }));
const AllCollection = ({ className, isActive }) => {
  const handleMouseEnter = () => {
    if (!isActive) return;
    animate(".all-main-image", {
      opacity: [1, 0],
      width: "0%",
      ease: spring({
        bounce: 0.65,
        duration: 400
      })
    });
    animate(".all-second-image", {
      opacity: [0, 1],
      ease: spring({
        bounce: 0.65,
        duration: 400
      })
    });
    animate(".all-active-1", {
      opacity: [0, 1],
      skewX: "-4deg",
      x: "90%",
      y: "-90%",
      ease: spring({
        bounce: 0.65,
        duration: 400
      }),
      duration: 300,
      alternate: true
    });
    animate(".all-active-2", {
      opacity: [0, 1],
      skewX: "-4deg",
      rotate: "-138deg",
      x: "-38%",
      y: "-300px",
      ease: spring({
        bounce: 0.65,
        duration: 400
      }),
      duration: 300,
      alternate: true
    });
    animate(".all-active-3", {
      opacity: [0, 1],
      x: "70%",
      y: "0%",
      skewX: "-4deg",
      rotate: "16deg",
      ease: spring({
        bounce: 0.65,
        duration: 400
      }),
      duration: 300,
      alternate: true
    });
  };
  const handleMouseLeave = () => {
    if (!isActive) return;
    animate(".all-main-image", {
      opacity: [0, 1],
      width: "100%",
      ease: spring({
        bounce: 0.65,
        duration: 400
      })
    });
    animate(".all-second-image", {
      opacity: [1, 0],
      ease: spring({
        bounce: 0.65,
        duration: 400
      })
    });
    animate(".all-active-1", {
      opacity: [1, 0],
      x: "0%",
      y: "0%",
      ease: spring({
        bounce: 0.65,
        duration: 400
      })
    });
    animate(".all-active-2", {
      opacity: [1, 0],
      x: "0%",
      y: "0%",
      ease: spring({
        bounce: 0.65,
        duration: 400
      })
    });
    animate(".all-active-3", {
      opacity: [1, 0],
      x: "0%",
      y: "0%",
      ease: spring({
        bounce: 0.65,
        duration: 400
      })
    });
  };
  const navigate = useNavigate$1();
  const handleClick = () => {
    if (!isActive) return;
    navigate("/collections");
  };
  return /* @__PURE__ */ jsxs(
    "div",
    {
      onMouseEnter: handleMouseEnter,
      onMouseLeave: handleMouseLeave,
      onClick: handleClick,
      className: clsx("flex all-collection cursor-pointer overflow-hidden rounded-[30px] shadow-[1px_4px_10px_0px_rgba(83,39,39,0.39)] shadow-[3px_18px_18px_0px_rgba(83,39,39,0.34)] shadow-[6px_40px_24px_0px_rgba(83,39,39,0.20)] shadow-[12px_70px_28px_0px_rgba(83,39,39,0.06)] shadow-[18px_110px_31px_0px_rgba(83,39,39,0.01)] border-8 border-white ", className),
      to: "/collections",
      children: [
        /* @__PURE__ */ jsx("img", { src: "/assets/images/home/all-collection.gif", className: "scale-110 object-cover all-main-image", alt: "All Collection" }),
        /* @__PURE__ */ jsx("img", { src: "/assets/images/home/all-collection.webp", className: "scale-110 object-cover all-second-image opacity-0", alt: "All Collection Text" }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("div", { className: "absolute top-0 left-0 w-full opacity-0 all-active-1", children: /* @__PURE__ */ jsx("img", { src: "/assets/images/home/all.webp", className: "w-1/2 object-cover", alt: "All Collection Text" }) }),
          /* @__PURE__ */ jsx("div", { className: "absolute top-0 left-0 w-full opacity-0 all-active-2", children: /* @__PURE__ */ jsx("img", { src: "/assets/images/home/all2.webp", className: "w-1/2 object-cover", alt: "All Collection Text" }) }),
          /* @__PURE__ */ jsx("div", { className: "absolute top-0 left-0 w-full opacity-0 all-active-3", children: /* @__PURE__ */ jsx("img", { src: "/assets/images/home/all3.webp", className: "w-1/2 object-cover", alt: "All Collection Text" }) })
        ] })
      ]
    }
  );
};
const ThirstyCollection = ({ className, isActive }) => {
  const collectionItemRef = useRef(null);
  const hoverActiveRef = useRef(null);
  const handleMouseEnter = () => {
    if (!isActive) return;
    animate(".main-image", {
      opacity: [1, 0],
      width: "0%",
      ease: spring({
        bounce: 0.65,
        duration: 400
      }),
      duration: 300,
      alternate: true
    });
    animate(".second-image", {
      opacity: [0, 1],
      ease: spring({
        bounce: 0.65,
        duration: 400
      }),
      duration: 300,
      alternate: true
    });
    animate(".hover-active-1", {
      x: "-50%",
      y: "-20%",
      skewX: "-4deg",
      rotate: "-27deg",
      opacity: [0, 1],
      ease: spring({
        bounce: 0.65,
        duration: 400
      }),
      duration: 300,
      alternate: true
    });
    animate(".hover-active-2", {
      x: "40%",
      y: "80%",
      skewX: "-4deg",
      rotate: "43deg",
      opacity: [0, 1],
      ease: spring({
        bounce: 0.65,
        duration: 400
      }),
      duration: 300,
      alternate: true
    });
  };
  const handleMouseLeave = () => {
    if (!isActive) return;
    animate(".main-image", {
      opacity: [0, 1],
      width: "100%",
      ease: spring({
        bounce: 0.65,
        duration: 400
      }),
      duration: 300,
      alternate: true
    });
    animate(".second-image", {
      opacity: [1, 0],
      ease: spring({
        bounce: 0.65,
        duration: 400
      }),
      duration: 300,
      alternate: true
    });
    animate(".hover-active-1", {
      x: "0%",
      y: "0%",
      skewX: "0deg",
      rotate: "0deg",
      opacity: [1, 0],
      ease: spring({
        bounce: 0.65,
        duration: 400
      }),
      duration: 300,
      alternate: true
    });
    animate(".hover-active-2", {
      x: "0%",
      y: "0%",
      skewX: "0deg",
      rotate: "0deg",
      opacity: [1, 0],
      ease: spring({
        bounce: 0.65,
        duration: 400
      }),
      duration: 300,
      alternate: true
    });
  };
  const navigate = useNavigate();
  const handleClick = () => {
    if (!isActive) return;
    navigate("/collections/thirsty");
  };
  return /* @__PURE__ */ jsxs(
    "div",
    {
      ref: collectionItemRef,
      onMouseEnter: handleMouseEnter,
      onMouseLeave: handleMouseLeave,
      onClick: handleClick,
      className: clsx("collection-item  flex overflow-hidden rounded-[30px] shadow-[1px_4px_10px_0px_rgba(83,39,39,0.39)] shadow-[3px_18px_18px_0px_rgba(83,39,39,0.34)] shadow-[6px_40px_24px_0px_rgba(83,39,39,0.20)] shadow-[12px_70px_28px_0px_rgba(83,39,39,0.06)] shadow-[18px_110px_31px_0px_rgba(83,39,39,0.01)] border-8 border-white ", className),
      to: "/collections",
      children: [
        /* @__PURE__ */ jsx("img", { src: "/assets/images/home/thirsty-collection.gif", className: "scale-110 object-cover main-image", alt: "Thirsty Collection" }),
        /* @__PURE__ */ jsx("img", { src: "/assets/images/home/thirsty-collection.webp", className: "scale-110 object-cover second-image opacity-0", alt: "Thirsty Collection Text" }),
        /* @__PURE__ */ jsxs("div", { ref: hoverActiveRef, children: [
          /* @__PURE__ */ jsx("div", { className: "absolute top-0 left-0 w-full opacity-0 hover-active-1", children: /* @__PURE__ */ jsx("img", { src: "/assets/images/home/thirsty1.webp", className: "w-full h-full object-cover", alt: "Thirsty Collection Text" }) }),
          /* @__PURE__ */ jsx("div", { className: "absolute top-0 left-0 w-full opacity-0 hover-active-2", children: /* @__PURE__ */ jsx("img", { src: "/assets/images/home/thirsty2.webp", className: "w-full h-full object-cover", alt: "Thirsty Collection Text" }) })
        ] })
      ]
    }
  );
};
const IcyCollection = ({ className, isActive }) => {
  const collectionItemRef = useRef(null);
  const hoverActiveRef = useRef(null);
  const handleMouseEnter = () => {
    if (!isActive) return;
    animate(".icymain-image", {
      opacity: [1, 0],
      width: "0%",
      ease: spring({
        bounce: 0.65,
        duration: 400
      }),
      duration: 300,
      alternate: true
    });
    animate(".icy-second-image", {
      opacity: [0, 1],
      ease: spring({
        bounce: 0.65,
        duration: 400
      }),
      duration: 300,
      alternate: true
    });
    animate(".hover-active-icy-1", {
      x: "-50%",
      y: "50%",
      skewX: "-4deg",
      rotate: "-27deg",
      opacity: [0, 1],
      ease: spring({
        bounce: 0.65,
        duration: 400
      }),
      duration: 300,
      alternate: true
    });
    animate(".hover-active-icy-2", {
      x: "40%",
      y: "-20%",
      skewX: "-4deg",
      rotate: "43deg",
      opacity: [0, 1],
      ease: spring({
        bounce: 0.65,
        duration: 400
      }),
      duration: 300,
      alternate: true
    });
  };
  const handleMouseLeave = () => {
    if (!isActive) return;
    animate(".icymain-image", {
      opacity: [0, 1],
      width: "100%",
      ease: spring({
        bounce: 0.65,
        duration: 400
      }),
      duration: 300,
      alternate: true
    });
    animate(".icy-second-image", {
      opacity: [1, 0],
      ease: spring({
        bounce: 0.65,
        duration: 400
      }),
      duration: 300,
      alternate: true
    });
    animate(".hover-active-icy-1", {
      x: "0%",
      y: "0%",
      skewX: "0deg",
      rotate: "0deg",
      opacity: [1, 0],
      ease: spring({
        bounce: 0.65,
        duration: 400
      }),
      duration: 300,
      alternate: true
    });
    animate(".hover-active-icy-2", {
      x: "0%",
      y: "0%",
      skewX: "0deg",
      rotate: "0deg",
      opacity: [1, 0],
      ease: spring({
        bounce: 0.65,
        duration: 400
      }),
      duration: 300,
      alternate: true
    });
  };
  const navigate = useNavigate();
  const handleClick = () => {
    if (!isActive) return;
    navigate("/collections/icy");
  };
  return /* @__PURE__ */ jsxs(
    "div",
    {
      ref: collectionItemRef,
      onMouseEnter: handleMouseEnter,
      onMouseLeave: handleMouseLeave,
      onClick: handleClick,
      className: clsx("collection-item  flex overflow-hidden rounded-[30px] shadow-[1px_4px_10px_0px_rgba(83,39,39,0.39)] shadow-[3px_18px_18px_0px_rgba(83,39,39,0.34)] shadow-[6px_40px_24px_0px_rgba(83,39,39,0.20)] shadow-[12px_70px_28px_0px_rgba(83,39,39,0.06)] shadow-[18px_110px_31px_0px_rgba(83,39,39,0.01)] border-8 border-white ", className),
      to: "/collections",
      children: [
        /* @__PURE__ */ jsx("img", { src: "/assets/images/home/icy-collection.gif", className: "scale-110 object-cover icymain-image", alt: "Icy Collection" }),
        /* @__PURE__ */ jsx("img", { src: "/assets/images/home/icy-collection.webp", className: "scale-110 object-cover icy-second-image opacity-0", alt: "Icy Collection Text" }),
        /* @__PURE__ */ jsxs("div", { ref: hoverActiveRef, children: [
          /* @__PURE__ */ jsx("div", { className: "absolute top-0 left-0 w-full opacity-0 hover-active-icy-1", children: /* @__PURE__ */ jsx("img", { src: "/assets/images/home/icy1.webp", className: "w-full h-full object-cover", alt: "Icy Collection Text" }) }),
          /* @__PURE__ */ jsx("div", { className: "absolute top-0 left-0 w-full opacity-0 hover-active-icy-2", children: /* @__PURE__ */ jsx("img", { src: "/assets/images/home/icy2.webp", className: "w-full h-full object-cover", alt: "Icy Collection Text" }) })
        ] })
      ]
    }
  );
};
const ComingCollection = ({ className, isActive }) => {
  return /* @__PURE__ */ jsx("div", { className: clsx("flex overflow-hidden rounded-[30px] shadow-[1px_4px_10px_0px_rgba(83,39,39,0.39)] shadow-[3px_18px_18px_0px_rgba(83,39,39,0.34)] shadow-[6px_40px_24px_0px_rgba(83,39,39,0.20)] shadow-[12px_70px_28px_0px_rgba(83,39,39,0.06)] shadow-[18px_110px_31px_0px_rgba(83,39,39,0.01)] border-8 border-white ", className), to: "/collections", children: /* @__PURE__ */ jsx("img", { src: "/assets/images/home/coming-collection.gif", className: "scale-110 object-cover", alt: "Coming Collection" }) });
};
const initialCards$1 = [{
  id: 4,
  h1: "NEW MAGIC",
  title: "Coming <br /> soon...",
  subtitle: "Stay tuned",
  component: (isActive) => /* @__PURE__ */ jsx(ComingCollection, {
    isActive
  })
}, {
  id: 3,
  h1: "THIS IS OUR",
  title: "Icy",
  subtitle: "Brings you to a cozy café on a sun-drenched morning. The scent blends rich, freshly brewed coffee with a hint of creamy vanilla and warm spices.",
  component: (isActive) => /* @__PURE__ */ jsx(IcyCollection, {
    isActive
  })
}, {
  id: 2,
  h1: "THIS IS OUR",
  title: "Thirsty",
  subtitle: "Brings you to a cozy café on a sun-drenched morning. The scent blends rich, freshly brewed coffee with a hint of creamy vanilla and warm spices.",
  component: (isActive) => /* @__PURE__ */ jsx(ThirstyCollection, {
    isActive
  })
}, {
  id: 1,
  h1: "THIS IS",
  title: "All of Our",
  subtitle: "",
  component: (isActive) => /* @__PURE__ */ jsx(AllCollection, {
    isActive
  })
}];
const products__index = UNSAFE_withComponentProps(function HalfFanSlider() {
  const [cards, setCards] = useState(initialCards$1);
  const next = () => {
    handleClick(0);
  };
  const prev = () => {
    handleClick(0);
  };
  const handleClick = (clickedIndex) => {
    const clickedCard = cards[clickedIndex];
    const newCards = cards.filter((_, i) => i !== clickedIndex);
    setCards([...newCards, clickedCard]);
  };
  const activeCard = cards[cards.length - 1];
  const handleMouseEnter = (cardId) => {
    if (cardId !== activeCard.id) return;
    const collectionCardItem = document.querySelectorAll(".collection-card-item");
    const collectionCardTitle = document.querySelector("#collection-card-title");
    collectionCardTitle.style.opacity = "0.3";
    collectionCardItem.forEach((item) => {
      if (item.classList.contains("collection-card-active")) {
        item.style.opacity = "1";
        item.style.scale = "1.05";
      } else {
        item.style.opacity = "0.3";
      }
    });
  };
  const handleMouseLeave = (index) => {
    const collectionCardItem = document.querySelectorAll(".collection-card-item");
    const collectionCardTitle = document.querySelector("#collection-card-title");
    collectionCardTitle.style.opacity = "1";
    collectionCardItem.forEach((item) => {
      item.style.opacity = "1";
      item.style.scale = "1";
    });
  };
  return /* @__PURE__ */ jsxs("div", {
    className: "min-h-[max(calc(100vh-144px),_900px)] flex flex-col",
    children: [/* @__PURE__ */ jsxs(Container, {
      className: "flex items-center justify-between mt-16",
      children: [/* @__PURE__ */ jsx("button", {
        onClick: prev,
        className: "p-3 bg-yellow-300 rounded-full hover:scale-105 transition",
        children: /* @__PURE__ */ jsx(ChevronLeft, {})
      }), /* @__PURE__ */ jsx("div", {
        id: "collection-card-title",
        className: "flex items-center justify-center text-[110px] font-bold leading-[114px] text-center",
        children: activeCard.h1
      }), /* @__PURE__ */ jsx("button", {
        onClick: next,
        className: " p-3 bg-yellow-300 rounded-full hover:scale-105 transition",
        children: /* @__PURE__ */ jsx(ChevronRight, {})
      })]
    }), /* @__PURE__ */ jsxs("div", {
      className: "flex items-center justify-end bg-white px-10 flex-1",
      children: [/* @__PURE__ */ jsx("div", {
        className: "relative w-[535px] mr-10",
        children: cards.map((card, i) => {
          const rotate = (i - (cards.length - 1)) * 18;
          const x = (i - (cards.length - 1)) * 185;
          const y = i === cards.length - 1 ? 55 : Math.abs(i - (cards.length - 1)) * 80;
          const z2 = i * 10 - i;
          return /* @__PURE__ */ jsx(motion.div, {
            onClick: () => handleClick(i),
            onMouseEnter: () => handleMouseEnter(card.id),
            onMouseLeave: () => handleMouseLeave(card.id),
            className: clsx("absolute bottom-0 left-1/2 flex collection-card-item", {
              "w-[190px] h-[310px]": i === 0,
              "w-[200px] h-[320px]": i === 1,
              "w-[210px] h-[330px]": i === 2,
              "w-[280px] h-[400px]": i === 3,
              "collection-card-active": card.id === activeCard.id
            }),
            animate: {
              x,
              y,
              rotate,
              zIndex: z2,
              skewX: 4,
              skewY: 0
            },
            transition: {
              type: "spring",
              stiffness: 300,
              damping: 20
            },
            children: card.component(card.id === activeCard.id)
          }, card.id);
        })
      }), /* @__PURE__ */ jsx("div", {
        className: "flex flex-col justify-center h-full items-center w-[650px] top-[-100px] relative",
        children: /* @__PURE__ */ jsx(AnimatePresence, {
          mode: "wait",
          children: /* @__PURE__ */ jsxs(motion.div, {
            initial: {
              opacity: 0,
              y: 20
            },
            animate: {
              opacity: 1,
              y: 0
            },
            exit: {
              opacity: 0,
              y: -20
            },
            transition: {
              duration: 0.4
            },
            children: [activeCard.id === 1 && /* @__PURE__ */ jsx("div", {
              className: "flex justify-center mb-6",
              children: /* @__PURE__ */ jsx("svg", {
                width: "52",
                height: "50",
                viewBox: "0 0 52 50",
                fill: "none",
                xmlns: "http://www.w3.org/2000/svg",
                children: /* @__PURE__ */ jsx("path", {
                  d: "M19.8813 4.1458C21.6774 -1.38207 29.4979 -1.38206 31.294 4.1458L33.2211 10.0769C34.0244 12.5491 36.3281 14.2228 38.9275 14.2228H45.1638C50.9762 14.2228 53.3928 21.6605 48.6905 25.0769L43.6452 28.7425C41.5423 30.2704 40.6623 32.9786 41.4656 35.4508L43.3927 41.3819C45.1888 46.9097 38.8619 51.5065 34.1597 48.0901L29.1144 44.4244C27.0114 42.8966 24.1639 42.8966 22.0609 44.4244L17.0156 48.0901C12.3133 51.5065 5.98646 46.9097 7.78257 41.3819L9.70971 35.4508C10.513 32.9786 9.63301 30.2704 7.53008 28.7425L2.48477 25.0769C-2.21751 21.6605 0.199145 14.2228 6.01149 14.2228H12.2478C14.8472 14.2228 17.1509 12.5491 17.9542 10.0769L19.8813 4.1458Z",
                  fill: "#FFE977"
                })
              })
            }), /* @__PURE__ */ jsxs("div", {
              className: "flex items-center justify-center",
              children: [/* @__PURE__ */ jsx("h2", {
                className: "mb-2 font-centuryBook italic text-[125px] leading-[114px] text-center",
                dangerouslySetInnerHTML: {
                  __html: activeCard.title
                }
              }), activeCard.id !== 1 && activeCard.id !== 4 && /* @__PURE__ */ jsxs("div", {
                className: "relative h-20 w-20",
                children: [/* @__PURE__ */ jsx("img", {
                  className: "animate-rotate-bounce absolute top-0 left-0",
                  src: "/assets/images/home/cup.svg",
                  alt: "Cup"
                }), /* @__PURE__ */ jsx("img", {
                  className: "animate-rotate-bounce-reverse absolute top-0 left-0",
                  src: "/assets/images/home/cup-bg.svg",
                  alt: "Cup"
                })]
              })]
            }), activeCard.id !== 4 && /* @__PURE__ */ jsx("p", {
              className: clsx("font-title font-medium text-[75.37px] leading-[95.47px] text-center", {
                "text-[#FFE977]": activeCard.id === 1,
                "text-[#A2D4FD]": activeCard.id !== 1
              }),
              children: "collection"
            }), /* @__PURE__ */ jsx("p", {
              className: "font-montserrat font-regular text-[15px] leading-[26px] text-center text-[#000] max-w-[430px]",
              children: activeCard.subtitle
            })]
          }, activeCard.id)
        })
      })]
    })]
  });
});
const route27 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: products__index
}, Symbol.toStringTag, { value: "Module" }));
const loader$7 = async () => {
  return redirect(siteSettings.favicon, {
    status: 302
  });
};
const route28 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  loader: loader$7
}, Symbol.toStringTag, { value: "Module" }));
const loader$6 = async ({
  request
}) => {
  const host = request.headers.get("host");
  const baseUrl = `https://${host}`;
  const urls = [{
    loc: `${baseUrl}/sitemap-products.xml`
  }, {
    loc: `${baseUrl}/sitemap-collections.xml`
  }, {
    loc: `${baseUrl}/sitemap-pages.xml`
  }];
  const content = `
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(({
    loc
  }) => `<sitemap><loc>${loc}</loc></sitemap>`).join("\n")}
</sitemapindex>`;
  return new Response(content, {
    status: 200,
    headers: {
      "Content-Type": "application/xml",
      "xml-version": "1.0",
      encoding: "UTF-8"
    }
  });
};
const route29 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  loader: loader$6
}, Symbol.toStringTag, { value: "Module" }));
const getProductListData = async (request) => {
  const region = await getSelectedRegion(request.headers);
  const productsQuery = {
    limit: 10,
    offset: 0
  };
  const { products } = await fetchProducts(request, {
    ...productsQuery,
    region_id: region.id,
    fields: "id,title,handle,thumbnail,variants.*,variants.prices.*"
  });
  const collectionTabs = /* @__PURE__ */ new Map();
  const categoryTabs = /* @__PURE__ */ new Map();
  products.forEach((product2) => {
    var _a;
    (_a = product2 == null ? void 0 : product2.categories) == null ? void 0 : _a.forEach((category) => {
      categoryTabs.set(category.id, category);
    });
    if (product2.collection) {
      collectionTabs.set(product2.collection.id, product2.collection);
    }
  });
  return {
    products,
    collection_tabs: [...collectionTabs.values()],
    category_tabs: [...categoryTabs.values()]
  };
};
const productList = async ({
  request
}) => {
  const result = await getProductListData(request);
  return data(result, {});
};
const loaders = {
  productList
};
const loader$5 = async ({
  request
}) => {
  const url = new URL(request.url);
  const {
    subloader,
    data: data2
  } = buildObjectFromSearchParams(url.searchParams);
  const _loader = loaders[subloader];
  if (!_loader) throw new Error(`Action handler not found for "${subloader}" loader.`);
  JSON.parse(data2);
  return await _loader({
    request
  });
};
const route30 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  loader: loader$5
}, Symbol.toStringTag, { value: "Module" }));
const loader$4 = ({
  request
}) => {
  const host = request.headers.get("host");
  const baseUrl = `https://${host}`;
  const robotText = `
User-agent: *
Disallow: /orders
Disallow: /orders/
Disallow: /checkout
Disallow: /checkout/
Disallow: /preview/
Disallow: /api/
Disallow: /_auth/
Sitemap: ${baseUrl}/sitemap.xml
        `;
  return new Response(robotText, {
    status: 200,
    headers: {
      "Content-Type": "text/plain"
    }
  });
};
const route31 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  loader: loader$4
}, Symbol.toStringTag, { value: "Module" }));
const loader$3 = async ({
  request
}) => {
  const {
    limit: postsLimit,
    offset: postsOffset
  } = withPaginationParams({
    request,
    defaultPageSize: 2
  });
  const data2 = await listPosts();
  console.log(data2, "data loader");
  return {
    count: data2 == null ? void 0 : data2.length,
    limit: postsLimit,
    offset: postsOffset,
    posts: data2
  };
};
const blogs__index = UNSAFE_withComponentProps(function BlogsIndexRoute2() {
  const data2 = useLoaderData();
  console.log(data2);
  return /* @__PURE__ */ jsxs(Container, {
    className: "flex flex-col gap-12",
    children: [/* @__PURE__ */ jsxs("div", {
      className: "flex flex-col gap-4",
      children: [/* @__PURE__ */ jsx("h1", {
        className: "text-[110px] font-bold leading-[114px] tracking-0% text-center",
        children: "THIS IS OUR"
      }), /* @__PURE__ */ jsx("p", {
        className: "font-centuryBook italic text-[125px] leading-[114px] text-center",
        children: "Blogs"
      }), /* @__PURE__ */ jsx("p", {
        className: "text-lg font-montserrat font-normal text-[15px] leading-[26px] text-center max-w-3xl mx-auto",
        children: "Brings you to a cozy café on a sun-drenched morning. The scent blends rich, freshly brewed coffee with a hint of creamy vanilla and warm spices."
      })]
    }), /* @__PURE__ */ jsx("div", {
      className: "flex flex-col gap-12",
      children: data2.posts.map((post, index) => /* @__PURE__ */ jsxs("div", {
        className: clsx("flex gap-4", index % 2 === 0 ? "flex-row" : "flex-row-reverse"),
        children: [/* @__PURE__ */ jsx("div", {
          className: "w-[70%] h-full aspect-[2/1] overflow-hidden rounded-lg mb-4",
          children: /* @__PURE__ */ jsx("img", {
            src: post.thumbnail,
            alt: post.title,
            className: "w-full h-full object-cover"
          })
        }), /* @__PURE__ */ jsxs("div", {
          className: "w-[30%] flex flex-col gap-6 items-start justify-center",
          children: [/* @__PURE__ */ jsx("h3", {
            className: "font-alexandria font-extrabold text-[49.62px] leading-[54.27px] tracking-0%",
            children: post.title
          }), /* @__PURE__ */ jsx("div", {
            dangerouslySetInnerHTML: {
              __html: post.description
            }
          }), /* @__PURE__ */ jsx(Link, {
            to: `/blogs/${post.slug}`,
            className: "button--primary w-[155px] text-white bg-primary hover:bg-primary-800 focus:border-primary-500 !h-12 mt-4 whitespace-nowrap !text-base !font-bold transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed !rounded-2xl justify-center items-center flex",
            children: "Read More"
          })]
        })]
      }, post.id))
    })]
  });
});
const route32 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: blogs__index,
  loader: loader$3
}, Symbol.toStringTag, { value: "Module" }));
const initialCards = [{
  id: 4,
  h1: "NEW MAGIC",
  animate: {
    x: "90px",
    y: "280px",
    rotate: "35deg",
    zIndex: 0,
    skewX: -25,
    skewY: 10
  },
  title: "Coming",
  component: () => /* @__PURE__ */ jsx(ComingCollection, {
    isActive: false,
    className: "w-[230px] h-[380px] h-sm:w-[184px] h-sm:h-[304px]"
  })
}, {
  id: 3,
  h1: "THIS IS OUR",
  animate: {
    x: "100px",
    y: "155px",
    rotate: "10deg",
    zIndex: 0,
    skewX: -15,
    skewY: 0
  },
  title: "Icy",
  component: () => /* @__PURE__ */ jsx(IcyCollection, {
    isActive: false,
    className: "w-[230px] h-[380px] h-sm:w-[184px] h-sm:h-[304px]"
  })
}, {
  id: 2,
  h1: "THIS IS OUR",
  animate: {
    x: "-100px",
    y: "55px",
    rotate: "-10deg",
    zIndex: 0,
    skewX: 15,
    skewY: 0
  },
  title: "Thirsty",
  component: () => /* @__PURE__ */ jsx(ThirstyCollection, {
    isActive: false,
    className: "w-[200px] h-[330px] h-sm:w-[164px] h-sm:h-[270px]"
  })
}, {
  id: 1,
  h1: "THIS IS",
  animate: {
    x: 0,
    y: 0,
    rotate: "-10deg",
    zIndex: 0,
    skewX: 3,
    skewY: 0
  },
  title: "All",
  component: () => /* @__PURE__ */ jsx(AllCollection, {
    isActive: false,
    className: "w-[200px] h-[336px] h-sm:w-[164px] h-sm:h-[276px]"
  })
}];
const pickACard = UNSAFE_withComponentProps(function PickACard() {
  const navigate = useNavigate$1();
  const [cards, _] = useState(initialCards);
  const handleClick = () => {
    navigate("/products");
  };
  return /* @__PURE__ */ jsxs("div", {
    className: "min-h-screen ",
    children: [/* @__PURE__ */ jsx("div", {
      className: "z-10",
      children: /* @__PURE__ */ jsxs("div", {
        className: "flex flex-col items-center justify-center",
        children: [/* @__PURE__ */ jsx("h1", {
          className: "font-title text-[110px] font-bold",
          children: "THIS IS OUR"
        }), /* @__PURE__ */ jsx("p", {
          className: "font-centuryBook italic text-[125px] leading-[114px]",
          children: "Heart & Soul"
        })]
      })
    }), /* @__PURE__ */ jsxs("div", {
      className: "flex items-center justify-center bg-white px-10 flex-col h-[60vh] z-0",
      children: [/* @__PURE__ */ jsxs("div", {
        className: "relative w-full flex justify-between items-center",
        children: [/* @__PURE__ */ jsxs("p", {
          className: "font-title text-[194.91px] font-bold leading-[139px] text-[#F4C5D8] text-right",
          children: ["Pick ", /* @__PURE__ */ jsx("br", {}), " a"]
        }), /* @__PURE__ */ jsx("p", {
          className: "font-title text-[194.91px] font-bold leading-[139px] text-[#F4C5D8] text-left",
          children: "card"
        })]
      }), /* @__PURE__ */ jsx("div", {
        className: "relative left-[-10vw] top-[-100px]",
        children: cards.map((card, i) => {
          return /* @__PURE__ */ jsx(motion.div, {
            onClick: () => handleClick(),
            className: clsx("absolute bottom-0 left-1/2 -translate-x-1/2"),
            animate: card.animate,
            transition: {
              type: "spring",
              stiffness: 300,
              damping: 20
            },
            children: card.component()
          }, card.id);
        })
      })]
    })]
  });
});
const route33 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: pickACard
}, Symbol.toStringTag, { value: "Module" }));
const changeRegionSchema = z$1.object({
  regionId: z$1.string().min(1, "Region ID is required")
});
const action = async ({
  request
}) => {
  const {
    errors,
    data: formData
  } = await getValidatedFormData(request, zodResolver(changeRegionSchema));
  if (errors) {
    return data({
      errors
    }, {
      status: 400
    });
  }
  try {
    const {
      regionId
    } = formData;
    await retrieveRegion(regionId);
    const headers = new Headers();
    await setSelectedRegionId(headers, regionId);
    const cartId = await getCartId(request.headers);
    if (cartId) await updateCart(request, {
      region_id: regionId
    });
    return data({
      success: true
    }, {
      headers
    });
  } catch (error) {
    return data(error.response.data, {
      status: error.response.status
    });
  }
};
const route34 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  action,
  changeRegionSchema
}, Symbol.toStringTag, { value: "Module" }));
const ActionList = ({ actions: actions2, className }) => /* @__PURE__ */ jsx("div", { className: clsx("flex flex-wrap items-center gap-4 lg:gap-6", className), children: actions2.map(({ url, label, new_tab, style_variant }, index) => {
  if (!label) return null;
  return /* @__PURE__ */ jsx(
    Button,
    {
      variant: style_variant,
      as: (buttonProps) => /* @__PURE__ */ jsx(URLAwareNavLink, { url, newTab: new_tab, ...buttonProps, children: label })
    },
    index
  );
}) });
const Hero = ({ title, content, actions: actions2, image, className, backgroundClassName, actionsClassName }) => {
  return /* @__PURE__ */ jsxs(Fragment$1, { children: [
    (image == null ? void 0 : image.url) && /* @__PURE__ */ jsx("link", { rel: "preload", href: image == null ? void 0 : image.url, as: "image" }),
    /* @__PURE__ */ jsxs(Container, { className: clsx("flex flex-col justify-center items-center relative w-full", className), children: [
      /* @__PURE__ */ jsx(
        "div",
        {
          className: clsx(
            "mkt-section__background-overlay flex-1 z-0 bg-cover bg-no-repeat bg-center",
            backgroundClassName
          ),
          style: {
            backgroundImage: `url(${image == null ? void 0 : image.url})`
          }
        }
      ),
      /* @__PURE__ */ jsxs("div", { className: "overflow-hidden z-10 w-full text-white", children: [
        /* @__PURE__ */ jsxs("div", { className: "inline-grid gap-6 w-full", children: [
          title && /* @__PURE__ */ jsx("div", { className: "break-words", children: title }),
          typeof content === "string" ? /* @__PURE__ */ jsx("div", { className: "text-lg w-full", children: content }) : content
        ] }),
        !!(actions2 == null ? void 0 : actions2.length) && /* @__PURE__ */ jsx(ActionList, { actions: actions2, className: clsx("mt-8 lg:mt-10 flex-col", actionsClassName) })
      ] })
    ] })
  ] });
};
const getMergedPageMeta = mergeMeta(getParentMeta, getCommonMeta);
const locations = [{
  title: "Barrio South Lamar",
  addressLines: ["1105 S. Lamar Blvd", "Austin, TX 78704"],
  phone: "(512) 906-0010",
  hours: ["Open Daily — 7am to 7pm"],
  imageUrl: "/assets/images/location-1.png"
}, {
  title: "Barrio Sonterra",
  addressLines: ["700 E. Sonterra Blvd. Suite #1113", "San Antonio, TX 78258"],
  phone: "(210) 530-8740",
  hours: ["Mon thru Fri — 6am to 7pm", "Sat — 7am to 7pm", "Sun — 7am to 6pm"],
  imageUrl: "/assets/images/location-2.png"
}, {
  title: "Barrio Deep Ellum",
  addressLines: ["2369 Main Street", "Dallas, TX 75226"],
  phone: "(469) 248-3440",
  hours: ["Sun thru Thu — 7am to 7pm", "Fri thru Sat — 7am to 8pm"],
  imageUrl: "/assets/images/location-3.png"
}];
const loader$2 = async (args) => {
  return {};
};
const meta$1 = getMergedPageMeta;
const Location = ({
  title,
  addressLines,
  phone,
  hours,
  imageUrl
}) => {
  return /* @__PURE__ */ jsxs("div", {
    className: "grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-16 text-xl",
    children: [/* @__PURE__ */ jsx("div", {
      className: "w-full h-full flex items-center justify-center col-span-2",
      children: /* @__PURE__ */ jsx("div", {
        className: "bg-cover bg-no-repeat bg-center w-full rounded-3xl h-72",
        style: {
          backgroundImage: `url(${imageUrl})`
        }
      })
    }), /* @__PURE__ */ jsxs("div", {
      className: "flex flex-col gap-4 col-span-1 md:justify-center",
      children: [/* @__PURE__ */ jsx("h3", {
        className: "text-2xl font-bold",
        children: title
      }), /* @__PURE__ */ jsxs("div", {
        children: [addressLines.map((line) => /* @__PURE__ */ jsx("p", {
          children: line
        })), /* @__PURE__ */ jsxs("p", {
          children: ["p. ", phone]
        })]
      }), /* @__PURE__ */ jsxs("div", {
        children: [/* @__PURE__ */ jsx("h4", {
          className: "font-bold",
          children: "Hours"
        }), hours.map((hour) => /* @__PURE__ */ jsx("p", {
          children: hour
        }))]
      })]
    })]
  });
};
const aboutUs = UNSAFE_withComponentProps(function IndexRoute() {
  return /* @__PURE__ */ jsxs(Fragment$1, {
    children: [/* @__PURE__ */ jsx(Container, {
      className: "!px-0 py-0 sm:!p-16",
      children: /* @__PURE__ */ jsx(Hero, {
        className: "min-h-[400px] !max-w-full bg-accent-50 sm:rounded-3xl p-6 sm:p-10 md:p-[88px] md:px-[88px]",
        content: /* @__PURE__ */ jsxs("div", {
          className: "text-center w-full space-y-9",
          children: [/* @__PURE__ */ jsx("h4", {
            className: "text-lg md:text-2xl font-italiana tracking-wider",
            children: "ABOUT US"
          }), /* @__PURE__ */ jsx("h1", {
            className: "text-4xl md:text-8xl font-italiana tracking-wider [text-shadow:_1px_1px_2px_rgb(0_0_0_/_40%)]",
            children: "Our Story"
          }), /* @__PURE__ */ jsxs("p", {
            className: "mx-auto text-md md:text-2xl !leading-normal",
            children: ['At Barrio Coffee Roastery, we’re more than just a coffee business—we’re a community. Inspired by the essence of a "barrio," a close-knit neighborhood where people gather, share, and connect, we aim to bring that sense of belonging and warmth to every cup of coffee we roast. From the moment we started, our passion has been to create exceptional coffee that', " ", /* @__PURE__ */ jsx("span", {
              className: "font-bold",
              children: "brings people together, one sip at a time."
            })]
          })]
        }),
        actionsClassName: "!flex-row w-full justify-center !font-base",
        actions: [{
          label: "Shop Our Coffee",
          url: "/products"
        }, {
          label: "Join the Barrio Community",
          url: "#"
        }]
      })
    }), /* @__PURE__ */ jsxs(Container, {
      className: "pt-4 flex flex-col gap-16 py-0 sm:!px-16 pb-44",
      children: [/* @__PURE__ */ jsxs("div", {
        className: "font-italiana text-4xl break-words md:text-6xl lg:text-7xl",
        children: ["Find your people, find your ", /* @__PURE__ */ jsx("span", {
          className: "font-ballet text-[150%] leading-tight",
          children: "Barrio"
        })]
      }), locations.map((location) => /* @__PURE__ */ jsx(Location, {
        ...location
      }))]
    })]
  });
});
const route35 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: aboutUs,
  loader: loader$2,
  meta: meta$1
}, Symbol.toStringTag, { value: "Module" }));
const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
  message: z.string().min(10, "Message must be at least 10 characters")
});
function ContactForm({ onSubmitSuccess }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm({
    resolver: zodResolver(contactSchema)
  });
  const onSubmit = async (data2) => {
    setIsSubmitting(true);
    setError(null);
    try {
      await send(
        "service_a1uegfr",
        "template_kh8252q",
        {
          from_name: data2.name,
          from_email: data2.email,
          to_name: "Kira Parfum Team",
          message: data2.message
        },
        "PxWigR7xt2Jg86A-K"
      );
      reset();
      onSubmitSuccess();
    } catch (error2) {
      console.error("EmailJS error:", error2);
      setError("Failed to send message. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };
  return /* @__PURE__ */ jsxs("section", { className: "relative min-h-[1146px] overflow-hidden flex flex-col justify-center", children: [
    /* @__PURE__ */ jsx("div", { className: "w-[2000px] absolute inset-0 left-1/2 -translate-x-1/2", children: /* @__PURE__ */ jsx("img", { src: "/assets/images/contact.webp", alt: "Contact", className: "absolute top-0 left-0 w-[1700px] h-[1146px] object-cover z-0" }) }),
    /* @__PURE__ */ jsxs(Container, { children: [
      /* @__PURE__ */ jsx("div", { className: "contact-form-container relative", children: /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit(onSubmit), className: "space-y-6 z-10 relative max-w-[446px] mb-[100px] ml-auto mr-[170px]", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx(
            "input",
            {
              id: "name",
              type: "text",
              ...register("name"),
              className: "w-full px-3 py-2 border border-primary rounded-full focus:outline-none focus:ring-1 focus:ring-highlight focus:border-highlight placeholder:text-primary placeholder:text-sm placeholder:font-medium",
              placeholder: "Name"
            }
          ),
          errors.name && /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-red-600", children: errors.name.message })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx(
            "input",
            {
              id: "email",
              type: "email",
              ...register("email"),
              className: "w-full px-3 py-2 border border-primary rounded-full focus:outline-none focus:ring-1 focus:ring-highlight focus:border-highlight placeholder:text-primary placeholder:text-sm placeholder:font-medium",
              placeholder: "Email"
            }
          ),
          errors.email && /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-red-600", children: errors.email.message })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx(
            "textarea",
            {
              id: "message",
              rows: 5,
              ...register("message"),
              className: "w-full px-3 py-2 border border-primary rounded-[20px] focus:outline-none focus:ring-1 focus:ring-highlight focus:border-highlight placeholder:text-primary placeholder:text-sm placeholder:font-medium",
              placeholder: "Message"
            }
          ),
          errors.message && /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-red-600", children: errors.message.message })
        ] }),
        error && /* @__PURE__ */ jsx("div", { className: "bg-red-50 border border-red-200 rounded-md p-3", children: /* @__PURE__ */ jsx("p", { className: "text-sm text-red-600", children: error }) }),
        /* @__PURE__ */ jsx("div", { className: "flex justify-center", children: /* @__PURE__ */ jsx(
          "button",
          {
            type: "submit",
            disabled: isSubmitting,
            className: "mt-3 font-extrabold text-[16.93px] h-[48px] px-[40px] leading-none tracking-normal text-center font-montserrat bg-primary text-white py-2 px-4 rounded-full hover:bg-primary-700 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed transition-colors",
            children: isSubmitting ? /* @__PURE__ */ jsxs("span", { className: "flex items-center justify-center", children: [
              /* @__PURE__ */ jsxs(
                "svg",
                {
                  className: "animate-spin -ml-1 mr-2 h-4 w-4 text-white",
                  xmlns: "http://www.w3.org/2000/svg",
                  fill: "none",
                  viewBox: "0 0 24 24",
                  children: [
                    /* @__PURE__ */ jsx(
                      "circle",
                      {
                        className: "opacity-25",
                        cx: "12",
                        cy: "12",
                        r: "10",
                        stroke: "currentColor",
                        strokeWidth: "4"
                      }
                    ),
                    /* @__PURE__ */ jsx(
                      "path",
                      {
                        className: "opacity-75",
                        fill: "currentColor",
                        d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      }
                    )
                  ]
                }
              ),
              "Sending..."
            ] }) : "Send"
          }
        ) })
      ] }) }),
      /* @__PURE__ */ jsxs("p", { className: "font-title font-light text-[20px] leading-[30px] tracking-normal text-center text-primary absolute bottom-[150px] right-0 w-1/2 max-w-[720px] ml-auto mr-[170px]", children: [
        "We'll be happy to answer any questions you may have :) If you have a problem with your order, please give us your order number so that we can help you as quickly as possible!",
        /* @__PURE__ */ jsx("br", {}),
        "Our email: ",
        /* @__PURE__ */ jsx("a", { href: "mailto:bykiraperfume@gmail.com", className: "text-primary underline", children: "bykiraperfume@gmail.com" })
      ] })
    ] })
  ] });
}
function ContactSuccess() {
  return /* @__PURE__ */ jsxs(Fragment$1, { children: [
    /* @__PURE__ */ jsxs("div", { className: "contact-success-message text-center mt-8", children: [
      /* @__PURE__ */ jsx("p", { className: "text-[150px] font-centuryBook italic text-64px leading-48px pl-2", children: "Okay!!!" }),
      /* @__PURE__ */ jsx("p", { className: "text-[110px] font-title font-bold text-64px leading-48px pl-2", children: "WE GOT U ;3" }),
      /* @__PURE__ */ jsx("p", { className: "text-[30px] font-title font-light text-30px leading-30px pl-2", children: "we’ll be replying to u sooooon!!!" }),
      /* @__PURE__ */ jsx("p", { className: "text-[30px] font-title font-light text-30px leading-30px pl-2", children: "in the meantime....... " })
    ] }),
    /* @__PURE__ */ jsx(ProductList, { className: "!py-[100px] xl:px-9", heading: "You may also like" })
  ] });
}
const contact = UNSAFE_withComponentProps(function Contact() {
  const [success, setSuccess] = useState(false);
  return /* @__PURE__ */ jsx(Fragment$1, {
    children: success ? /* @__PURE__ */ jsx(ContactSuccess, {}) : /* @__PURE__ */ jsx(ContactForm, {
      onSubmitSuccess: () => setSuccess(true)
    })
  });
});
const route36 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: contact
}, Symbol.toStringTag, { value: "Module" }));
const MenuToggle = ({
  isOpen,
  onClick,
  className = ""
}) => {
  return /* @__PURE__ */ jsx(
    "button",
    {
      onClick,
      className: clsx(
        "inline-flex items-center justify-center w-[55px] h-[55px] rounded-full transition-all text-[#000000]",
        "duration-300 ease-in-out",
        {
          "bg-[#FDCEF8]": isOpen,
          "bg-[#FFFF00]": !isOpen
        },
        className
      ),
      "aria-label": isOpen ? "Close menu" : "Open menu",
      children: isOpen ? /* @__PURE__ */ jsx("img", { src: "/assets/images/icons/close.svg", alt: "Close" }) : /* @__PURE__ */ jsx("img", { src: "/assets/images/icons/menu.svg", alt: "Menu" })
    }
  );
};
function FancyText({ id, text, className }) {
  return /* @__PURE__ */ jsxs("p", { style: { display: "none" }, id, className: clsx("font-centuryBook font-bold uppercase", className), children: [
    /* @__PURE__ */ jsx("span", { className: "italic text-[150px]", children: text.slice(0, 1) }),
    /* @__PURE__ */ jsx("span", { className: "font-title text-[95px]", children: text.slice(1) })
  ] });
}
const MainMenu = () => {
  const [isHovering, setIsHovering] = useState(false);
  const categoryItems = [
    {
      id: "blog",
      label: "Blog",
      image: "/assets/images/menu/blog.webp",
      url: "/blogs",
      className: "max-w-[494px] left-0",
      imagePosition: { x: "5%" },
      position: {
        x: "100%",
        y: 0
      }
    },
    {
      id: "product",
      label: "Product",
      image: "/assets/images/menu/product.webp",
      url: "/pick-a-card",
      className: "max-w-[648px] left-[366px]",
      imagePosition: { x: "4%" },
      position: {
        x: "80%",
        y: 0
      }
    },
    {
      id: "story",
      label: "Story",
      image: "/assets/images/menu/story.webp",
      url: "/stories",
      className: "max-w-[446px] left-[864px]",
      imagePosition: { x: "4%" },
      position: {
        x: "-70%",
        y: 0
      }
    },
    {
      id: "contact",
      label: "Contact",
      image: "/assets/images/menu/contact.webp",
      url: "/contact",
      className: "w-[670px] right-0",
      imagePosition: { x: "-7%" },
      position: {
        x: "-90%",
        y: 0
      }
    }
  ];
  const handleMouseEnter = (item) => {
    var _a, _b, _c;
    const el = document.getElementById(`fancy-text-${item.id}`);
    if (!el) return;
    el.style.display = "block";
    const image = document.getElementById(`menu-image-${item.id}`);
    if (image) {
      image.style.zIndex = "2";
    }
    setIsHovering(true);
    const backdrop = document.querySelectorAll(".menu-background");
    backdrop.forEach((backdrop2) => {
      backdrop2.style.opacity = "1";
    });
    animate(`#fancy-text-${item.id}`, {
      opacity: [0, 1],
      ...((_a = item.position) == null ? void 0 : _a.y) ? { y: item.position.y } : {},
      ...((_b = item.position) == null ? void 0 : _b.x) ? { x: item.position.x } : {},
      ease: spring({
        bounce: 0.65,
        duration: 400
      })
    });
    animate(`#menu-image-${item.id}`, {
      x: (_c = item.imagePosition) == null ? void 0 : _c.x,
      scale: 1.1,
      ease: spring({
        bounce: 0.65,
        duration: 400
      })
    });
  };
  const handleMouseLeave = (item) => {
    animate(`#fancy-text-${item.id}`, {
      opacity: [1, 0],
      x: 0,
      y: 0,
      ease: spring({
        bounce: 0.65,
        duration: 400
      })
    });
    animate(`#menu-image-${item.id}`, {
      x: 0,
      y: 0,
      scale: 1,
      ease: spring({
        bounce: 0.65,
        duration: 400
      })
    });
    const backdrop = document.querySelectorAll(".menu-background");
    backdrop.forEach((backdrop2) => {
      backdrop2.style.opacity = "0";
    });
    const image = document.getElementById(`menu-image-${item.id}`);
    if (image) {
      image.style.zIndex = "-2";
    }
    setIsHovering(false);
  };
  return /* @__PURE__ */ jsx("div", { className: "absolute inset-0 z-[9999] bg-white ", children: /* @__PURE__ */ jsxs("div", { className: "h-full w-full", children: [
    /* @__PURE__ */ jsxs("div", { className: "absolute flex w-[1840px] h-[max(calc(100vh-300px),400px)] left-1/2 -translate-x-1/2 items-center", children: [
      /* @__PURE__ */ jsx("div", { className: "absolute bottom-0 left-0 w-full h-full bg-[#00000099] z-[-1] opacity-0 menu-background" }),
      categoryItems.map((item) => /* @__PURE__ */ jsx(
        Link$1,
        {
          to: item.url,
          className: clsx("aspect-square absolute", item.className),
          id: item.id,
          onMouseEnter: () => {
            handleMouseEnter(item);
          },
          onMouseLeave: () => {
            handleMouseLeave(item);
          },
          children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center justify-center", children: [
            /* @__PURE__ */ jsx("img", { id: `menu-image-${item.id}`, src: item.image, alt: item.label, className: "w-full h-full object-contain menu-image z-[-2]" }),
            /* @__PURE__ */ jsx(FancyText, { id: `fancy-text-${item.id}`, className: "text-center absolute text-white z-[9]", text: item.label })
          ] })
        },
        item.id
      ))
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "absolute bottom-0 left-0 w-full bg-[url('/assets/images/menu/background.webp')] bg-contain bg-repeat-x bg-bottom bg-center", children: [
      /* @__PURE__ */ jsx("div", { className: "absolute bottom-0 left-0 w-full h-full bg-[#00000099] z-[2] opacity-0 menu-background" }),
      /* @__PURE__ */ jsxs("p", { className: "absolute bottom-0 w-full text-center mb-[98px] z-[3]", children: [
        /* @__PURE__ */ jsx("span", { className: clsx("font-title font-bold text-[95px] uppercase z-[2] relative", isHovering && "text-white"), children: "This is" }),
        /* @__PURE__ */ jsx("span", { className: "font-centuryBook font-italic text-[200px] italic text-[#FFE977] -ml-[100px] z-[1]", children: "Our" })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "overflow-hidden h-[300px] relative", children: /* @__PURE__ */ jsx("img", { src: "/assets/images/menu/chair-bottom.webp", alt: "logo", className: "w-full h-full object-cover object-position-center" }) })
    ] })
  ] }) });
};
const stories = UNSAFE_withComponentProps(function Stories() {
  const menu = [{
    label: "STORY",
    id: "story"
  }, {
    label: "MISSION",
    id: "mission"
  }, {
    label: "PACKAGING",
    id: "packaging"
  }];
  const items = [{
    id: "item-story",
    alt: "Story",
    image: "/assets/images/stories/stories.webp",
    className: "w-full h-[85vh] object-contain",
    classNameWrapper: "items-end",
    background: "/assets/images/stories/background-story.webp",
    text: "Kira was born as a joyful sparkling fragrance, capturing the very essence of sunshine and laughter in every delicate spritz. Like a playful breeze on a warm day, our scents effortlessly invigorate the spirit, infusing the air with a sense of lightness and elegance.",
    classNameText: "font-montserrat font-medium text-[17.65px] leading-[28.24px] text-center w-[630px] px-5 py-2 rotate-[-6deg]",
    classNameTextWrapper: "left-[20%] top-[30vh]",
    items: [{
      src: "/assets/images/stories/items/story-1.webp",
      className: "top-1/2 -translate-y-1/2 left-0 h-[16vh] object-contain"
    }, {
      src: "/assets/images/stories/items/story-2.webp",
      className: "top-[30vh] left-[10%] h-[20vh] object-contain"
    }, {
      src: "/assets/images/stories/items/story-3.webp",
      className: "top-[25vh] right-[10%] h-[19vh] object-contain"
    }, {
      src: "/assets/images/stories/items/story-4.webp",
      className: "top-[75vh] right-[10%] h-[25vh] object-contain"
    }, {
      src: "/assets/images/stories/items/story-5.webp",
      className: "top-[65vh] right-[3%] h-[18vh] object-contain"
    }, {
      src: "/assets/images/stories/items/story-6.webp",
      className: "top-[55vh] right-[-5%] h-[20vh] object-contain"
    }]
  }, {
    id: "item-mission",
    alt: "Mission",
    image: "/assets/images/stories/mission.webp",
    className: "w-full h-[85vh] object-contain",
    classNameWrapper: "",
    background: "/assets/images/stories/background-mission.webp",
    text: "Kira was born as a joyful sparkling fragrance, capturing the very essence of sunshine and laughter in every delicate spritz. Like a playful breeze on a warm day, our scents effortlessly invigorate the spirit, infusing the air with a sense of lightness and elegance.",
    classNameText: "font-montserrat font-medium text-[17.65px] leading-[28.24px] text-center w-[630px] px-5 py-2 rotate-[3deg]",
    classNameTextWrapper: "left-[20%] bottom-[10vh]",
    items: [{
      src: "/assets/images/stories/items/mission-1.webp",
      className: "top-[55vh] left-0 h-[20vh] object-contain"
    }, {
      src: "/assets/images/stories/items/mission-2.webp",
      className: "top-[52vh] left-[10%] h-[12vh] object-contain"
    }, {
      src: "/assets/images/stories/items/mission-3.webp",
      className: "top-[45vh] left-[17%] h-[18vh] object-contain"
    }, {
      src: "/assets/images/stories/items/mission-4.webp",
      className: "top-[5vh] left-[28%] h-[20vh] object-contain"
    }, {
      src: "/assets/images/stories/items/mission-5.webp",
      className: "top-[55vh] right-[15%] h-[18vh] object-contain"
    }, {
      src: "/assets/images/stories/items/mission-6.webp",
      className: "top-[30vh] right-0 h-[18vh] object-contain"
    }]
  }, {
    id: "item-packaging",
    alt: "Packaging",
    image: "/assets/images/stories/packaging.webp",
    className: "w-full h-[80vh] object-contain",
    background: "/assets/images/stories/background-packaging.webp",
    classNameWrapper: "items-end",
    text: "One special aspect of Kira is that the packaging is entirely made of paper and sugarcane bagasse, implementing an extremely eco-friendly approach to recycling and resource conservation to protect the environment. Specifically, the packaging for the perfume bottles in the first collection will be a paper cup used for daily coffee, which you might typically toss away right after use. However, at Kira, this paper cup will preserve memories and lasting joy for the user, without the feeling of being wasteful.",
    classNameText: "font-montserrat font-medium text-[17.65px] leading-[28.24px] text-center w-[830px] text-white px-5 py-2 rotate-[-5deg]",
    classNameTextWrapper: "right-[12vh] top-[40vh]",
    items: [{
      src: "/assets/images/stories/items/pack-1.webp",
      className: "top-[60vh] left-[-10%] h-[20vh] object-contain"
    }, {
      src: "/assets/images/stories/items/pack-2.webp",
      className: "top-[68vh] left-[3%] h-[22vh] object-contain"
    }, {
      src: "/assets/images/stories/items/pack-3.webp",
      className: "top-[73vh] left-[17%] h-[16vh] object-contain"
    }, {
      src: "/assets/images/stories/items/pack-4.webp",
      className: "top-[68vh] left-[25%] h-[18vh] object-contain"
    }, {
      src: "/assets/images/stories/items/pack-5.webp",
      className: "top-[7vh] left-1/2 h-[18vh] object-contain"
    }, {
      src: "/assets/images/stories/items/pack-6.webp",
      className: "top-[33vh] right-[7%] h-[23vh] object-contain"
    }]
  }];
  const [isOpen, setIsOpen] = useState(false);
  const handleMenuToggle = () => {
    setIsOpen(!isOpen);
  };
  const handleItemClick = (id) => {
    const element = document.getElementById(`item-${id}`);
    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "center",
        inline: "center"
      });
    }
  };
  return /* @__PURE__ */ jsxs(motion$1.div, {
    className: "min-h-screen aspect-[1071/256] flex",
    style: {
      overflow: "hidden"
    },
    initial: {
      x: 0
    },
    animate: {
      x: 0
    },
    transition: {
      type: "spring",
      stiffness: 70,
      damping: 20
    },
    children: [isOpen && /* @__PURE__ */ jsx(MainMenu, {}), /* @__PURE__ */ jsxs("div", {
      className: "w-[15%] flex flex-col px-[45px] py-[32px]",
      children: [/* @__PURE__ */ jsxs("p", {
        className: "font-title font-bold text-8xl",
        children: [/* @__PURE__ */ jsx("span", {
          children: "THIS"
        }), " ", /* @__PURE__ */ jsx("br", {}), /* @__PURE__ */ jsxs("span", {
          className: "ml-[14px]",
          children: ["IS ", /* @__PURE__ */ jsx("span", {
            className: "font-centuryBook italic font-normal",
            children: "Our"
          })]
        })]
      }), /* @__PURE__ */ jsx("div", {
        className: "flex flex-col gap-8 h-full flex-1 justify-center",
        children: menu.map((item) => /* @__PURE__ */ jsx("span", {
          onClick: () => handleItemClick(item.id),
          className: "font-title font-bold text-[40px] rounded-full border border-black mx-6 py-2 text-center hover:bg-[#FFE977] hover:border-[#FFE977] transition-all duration-300 ease-in-out",
          children: item.label
        }, item.id))
      }), /* @__PURE__ */ jsx(MenuToggle, {
        isOpen,
        onClick: handleMenuToggle,
        className: "shadow-[0px_4px_10px_0px_#00000040] z-[10000]"
      })]
    }), /* @__PURE__ */ jsx("div", {
      className: "w-[85%] bg-white",
      children: /* @__PURE__ */ jsx("div", {
        className: "w-full h-full bg-cover bg-center overflow-hidden",
        children: /* @__PURE__ */ jsx(Grid, {
          className: "h-[100vh] bg-[url('/assets/images/stories/background.webp')] bg-cover bg-center",
          children: items.map((item) => /* @__PURE__ */ jsxs(GridColumn, {
            id: item.id,
            className: clsx("col-span-4 flex relative", item.classNameWrapper),
            children: [/* @__PURE__ */ jsxs("div", {
              className: "group",
              children: [/* @__PURE__ */ jsx("img", {
                src: item.image,
                alt: item.alt,
                className: clsx(item.className)
              }), /* @__PURE__ */ jsx("div", {
                className: clsx("w-full absolute opacity-0 group-hover:opacity-100 transition-all duration-300 ease-in-out", item.classNameTextWrapper),
                children: /* @__PURE__ */ jsx("p", {
                  className: clsx("m-6 text-center z-10 absolute bottom-0 bg-center bg-repeat border border-[#000000] rounded-xl shadow-[0px_4px_10px_0px_#00000040] p-5", item.classNameText, `bg-${item.id}`),
                  children: item.text
                })
              })]
            }), item.items.map((icon) => /* @__PURE__ */ jsx("img", {
              src: icon.src,
              alt: item.alt,
              className: clsx("absolute", icon.className)
            }))]
          }, item.alt))
        })
      })
    })]
  });
});
const route37 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: stories
}, Symbol.toStringTag, { value: "Module" }));
const LanguageSwitcher = () => {
  const { currentLanguage, changeLanguage } = useI18n();
  const toggleLanguage = () => {
    const nextLanguage = currentLanguage === "vi" ? "en" : "vi";
    changeLanguage(nextLanguage);
  };
  const displayText = currentLanguage === "vi" ? "E" : "V";
  return /* @__PURE__ */ jsx(
    "button",
    {
      onClick: toggleLanguage,
      className: clsx(
        "inline-flex items-center justify-center w-[55px] h-[55px] rounded-full font-black transition-all font-title text-4xl",
        "duration-300 ease-in-out",
        {
          "bg-[#FFFF00] text-[#000000]": currentLanguage === "en",
          "bg-[#000000] text-[#EC98BA]": currentLanguage === "vi"
        }
      ),
      "aria-label": `Switch to ${currentLanguage === "vi" ? "English" : "Vietnamese"}`,
      children: displayText
    }
  );
};
const ShopLink = ({ className }) => {
  const { t } = useI18n();
  return /* @__PURE__ */ jsx(Fragment$1, { children: /* @__PURE__ */ jsx("div", { className: clsx("flex items-center flex-col", className), children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-6", children: [
    /* @__PURE__ */ jsxs("div", { className: "relative h-20 w-20", children: [
      /* @__PURE__ */ jsx(
        "img",
        {
          className: "animate-rotate-bounce absolute top-0 left-0",
          src: "/assets/images/home/cup.svg",
          alt: "Cup"
        }
      ),
      /* @__PURE__ */ jsx(
        "img",
        {
          className: "animate-rotate-bounce-reverse absolute top-0 left-0",
          src: "/assets/images/home/cup-bg.svg",
          alt: "Cup"
        }
      )
    ] }),
    /* @__PURE__ */ jsx(
      Link,
      {
        to: "/collections",
        className: "text-4xl font-normal font-title text-white drop-shadow-4xl hover:font-black transition-all duration-300 ease-in-out hover:text-[#F4EB3C] hover:drop-shadow-none hover:rotate-bounce",
        children: t("shop")
      }
    )
  ] }) }) });
};
const Logo = memo(({
  className,
  fill = "#FFFFFF",
  onLetterClick,
  onMouseEnterLetter,
  onMouseLeaveLogo
}) => {
  const [hoveredLetter, setHoveredLetter] = useState(null);
  const handleMouseEnter = useCallback((letter) => {
    setHoveredLetter(letter);
    onMouseEnterLetter == null ? void 0 : onMouseEnterLetter(letter);
  }, [onMouseEnterLetter]);
  const handleMouseLeave = useCallback(() => {
    setHoveredLetter(null);
  }, []);
  const handleLetterClick = useCallback((letter) => {
    onLetterClick == null ? void 0 : onLetterClick(letter);
  }, [onLetterClick]);
  const handleLogoMouseLeave = useCallback(() => {
    onMouseLeaveLogo == null ? void 0 : onMouseLeaveLogo();
  }, [onMouseLeaveLogo]);
  const handleKClick = useCallback(() => handleLetterClick("K"), [handleLetterClick]);
  const handleIClick = useCallback(() => handleLetterClick("I"), [handleLetterClick]);
  const handleRClick = useCallback(() => handleLetterClick("R"), [handleLetterClick]);
  const handleAClick = useCallback(() => handleLetterClick("A"), [handleLetterClick]);
  const handleKMouseEnter = useCallback(() => handleMouseEnter("K"), [handleMouseEnter]);
  const handleIMouseEnter = useCallback(() => handleMouseEnter("I"), [handleMouseEnter]);
  const handleRMouseEnter = useCallback(() => handleMouseEnter("R"), [handleMouseEnter]);
  const handleAMouseEnter = useCallback(() => handleMouseEnter("A"), [handleMouseEnter]);
  return /* @__PURE__ */ jsx("div", { className, children: /* @__PURE__ */ jsxs(
    "div",
    {
      className: "title flex items-center gap-6 mix-blend-exclusion",
      onMouseLeave: handleLogoMouseLeave,
      children: [
        /* @__PURE__ */ jsx(
          "span",
          {
            className: " character-k transition-all duration-300 z-10",
            onClick: handleKClick,
            onMouseEnter: handleKMouseEnter,
            onMouseLeave: handleMouseLeave,
            children: /* @__PURE__ */ jsx(
              "svg",
              {
                pointerEvents: "none",
                width: "109",
                height: "108",
                viewBox: "0 0 109 108",
                fill: "none",
                xmlns: "http://www.w3.org/2000/svg",
                className: "character-k",
                children: /* @__PURE__ */ jsx(
                  "path",
                  {
                    pointerEvents: "none",
                    d: "M106.819 0H71.8792L31.1762 43.5259V0H0V108H31.1762V80.8966L41.8452 69.4914L72.3205 108H109L62.4823 47.8707L106.819 0Z",
                    fill,
                    className: "character-k"
                  }
                )
              }
            )
          }
        ),
        /* @__PURE__ */ jsx(
          "span",
          {
            className: ` character-i transition-all duration-300`,
            onClick: handleIClick,
            onMouseEnter: handleIMouseEnter,
            onMouseLeave: handleMouseLeave,
            children: /* @__PURE__ */ jsx(
              "svg",
              {
                pointerEvents: "none",
                width: "31",
                height: "108",
                viewBox: "0 0 31 108",
                fill: "none",
                xmlns: "http://www.w3.org/2000/svg",
                className: "character-i",
                children: /* @__PURE__ */ jsx(
                  "path",
                  {
                    pointerEvents: "none",
                    d: "M31 0H0V108H31V0Z",
                    fill,
                    className: "character-i"
                  }
                )
              }
            )
          }
        ),
        /* @__PURE__ */ jsx(
          "span",
          {
            className: ` character-r transition-all duration-300`,
            onClick: handleRClick,
            onMouseEnter: handleRMouseEnter,
            onMouseLeave: handleMouseLeave,
            children: /* @__PURE__ */ jsx(
              "svg",
              {
                pointerEvents: "none",
                width: "101",
                height: "109",
                viewBox: "0 0 101 109",
                fill: "none",
                xmlns: "http://www.w3.org/2000/svg",
                className: "character-r",
                children: /* @__PURE__ */ jsx(
                  "path",
                  {
                    pointerEvents: "none",
                    d: "M77.4655 74.7026C83.8057 71.5704 88.8153 67.2637 92.3898 61.8345C96.3296 55.8573 98.3387 48.6794 98.3387 40.4835C98.3387 32.1832 96.3296 24.9009 92.3898 18.8192C88.45 12.7375 82.7882 8.03927 75.5869 4.82878C68.4118 1.6183 59.7494 0 49.8608 0H0V109H31.6228V80.3405H47.4082L66.9507 109H100.739H100.843H101L100.843 108.765L77.4655 74.7026ZM61.8889 51.6027C58.8884 54.2651 54.218 55.6224 48.0083 55.6224H31.6228V25.1619H48.0083C54.1919 25.1619 58.8623 26.5192 61.8889 29.1815C64.8894 31.8439 66.4027 35.6286 66.4027 40.4574C66.4027 45.2079 64.8633 48.9665 61.8889 51.6027Z",
                    fill,
                    className: "character-r"
                  }
                )
              }
            )
          }
        ),
        /* @__PURE__ */ jsx(
          "span",
          {
            className: ` character-a transition-all duration-300`,
            onClick: handleAClick,
            onMouseEnter: handleAMouseEnter,
            onMouseLeave: handleMouseLeave,
            children: /* @__PURE__ */ jsx(
              "svg",
              {
                pointerEvents: "none",
                width: "107",
                height: "108",
                viewBox: "0 0 107 108",
                fill: "none",
                xmlns: "http://www.w3.org/2000/svg",
                className: "character-a",
                children: /* @__PURE__ */ jsx(
                  "path",
                  {
                    pointerEvents: "none",
                    d: "M107 108L68.0698 22.6034L78.0929 0H47.6359L0.361661 107.224L0.103332 107.793L1.49831 104.612L0 108H0.103332H0.258329H1.49831H32.0587L37.9227 93.3879L49.7801 63.8276L52.6475 57.3621L74.3472 108H107Z",
                    fill,
                    className: "character-a"
                  }
                )
              }
            )
          }
        )
      ]
    }
  ) });
});
const Description = ({ className, description }) => {
  const { t } = useI18n();
  return /* @__PURE__ */ jsx("div", { className, children: /* @__PURE__ */ jsx("div", { className: "z-[99] min-h-[180px]", children: /* @__PURE__ */ jsx("p", { className: "max-w-4xl text-center font-body font-normal text-[#000] text-lg text-shadow-[0px_4px_4px_0px_#00000040]", children: description || t("home.default.description") }) }) });
};
const Main = () => {
  return /* @__PURE__ */ jsx(Fragment$1, { children: /* @__PURE__ */ jsxs("div", { children: [
    /* @__PURE__ */ jsx(
      MorphingShape,
      {
        blur: 20,
        zoom: 0.6,
        id: "1",
        classNameWrapper: "items-center justify-center absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[70%] -rotate-[62deg]"
      }
    ),
    /* @__PURE__ */ jsx(
      MorphingShape,
      {
        blur: 40,
        zoom: 0.25,
        colorStart: "#FCF099",
        colorEnd: "#E5DC95",
        classNameWrapper: "items-center justify-center -rotate-[28deg]",
        className: "absolute top-[20%] left-[259px]",
        id: "3",
        offsetStart: 58,
        offsetEnd: 100
      }
    ),
    /* @__PURE__ */ jsx(
      MorphingShape,
      {
        blur: 58,
        zoom: 0.45,
        colorStart: "#F5DDDD",
        colorEnd: "#EC98BA",
        id: "2",
        classNameWrapper: "items-center justify-center -rotate-[42deg]",
        className: "absolute top-[154px] right-[15%]",
        offsetStart: 9,
        offsetEnd: 79
      }
    )
  ] }) });
};
const K = () => {
  const particles = [
    {
      id: "free",
      className: "w-[160px]",
      position: { x: "-504px", y: 0 },
      src: "assets/images/art/k/free.webp"
    },
    {
      id: "heart-1",
      className: "w-[230px]",
      position: { x: "-576px", y: "-100%", rotate: "-20deg" },
      src: "assets/images/art/k/heart.webp"
    },
    {
      id: "heart-2",
      className: "w-[107px]",
      position: { x: "360px", y: "51px", rotate: "100deg" },
      src: "assets/images/art/k/heart.webp"
    },
    {
      id: "heart-3",
      className: "w-[158px]",
      position: { x: "432px", y: "-102px", rotate: "145deg" },
      src: "assets/images/art/k/heart.webp"
    },
    {
      id: "kind",
      className: "w-[520px]",
      position: { x: "-100%", y: "-612px" },
      src: "assets/images/art/k/kind.webp"
    },
    {
      id: "rabbit-head",
      className: "w-[642px] bottom-0 h-sm:w-[542px]",
      position: { x: "-321px" },
      src: "assets/images/art/k/rabbit-head.webp"
    },
    {
      id: "not-tested",
      className: "w-[240px]",
      position: { x: "259px", y: "-358px" },
      src: "assets/images/art/k/not-tested.webp"
    },
    {
      id: "morphingshape",
      options: {
        zoom: 0.55,
        blur: 20,
        offsetStart: -100,
        offsetEnd: 180,
        colorStart: "#F5DDDD",
        colorEnd: "#EC98BA"
      },
      position: { x: "0", y: "-410px", rotate: "-50deg" }
    },
    {
      id: "morphingshape-2",
      options: {
        zoom: 0.25,
        blur: 20,
        offsetStart: 58,
        offsetEnd: 80,
        colorStart: "#F5DDDD",
        colorEnd: "#EC98BA"
      },
      position: { x: "-504px", y: "102px", rotate: "-50deg" }
    }
  ];
  useEffect(() => {
    particles.forEach((particle) => {
      animate(`#particle-${particle.id}`, {
        x: particle.position.x,
        y: particle.position.y,
        opacity: [0, 1],
        ease: spring({
          bounce: 0.65,
          duration: 400
        }),
        rotate: particle.position.rotate || 0,
        duration: 300,
        alternate: true
      });
    });
  }, []);
  return /* @__PURE__ */ jsx(Fragment$1, { children: particles.map((i, index) => {
    var _a, _b, _c, _d, _e, _f;
    return /* @__PURE__ */ jsx("div", { children: i.id.includes("morphingshape") ? /* @__PURE__ */ jsx("div", { id: `particle-${i.id}`, children: /* @__PURE__ */ jsx(
      MorphingShape,
      {
        blur: (_a = i.options) == null ? void 0 : _a.blur,
        zoom: (_b = i.options) == null ? void 0 : _b.zoom,
        id: `${i.id}`,
        colorStart: (_c = i.options) == null ? void 0 : _c.colorStart,
        colorEnd: (_d = i.options) == null ? void 0 : _d.colorEnd,
        offsetStart: (_e = i.options) == null ? void 0 : _e.offsetStart,
        offsetEnd: (_f = i.options) == null ? void 0 : _f.offsetEnd,
        classNameWrapper: "absolute"
      }
    ) }) : /* @__PURE__ */ jsx(
      "img",
      {
        src: i.src,
        id: `particle-${i.id}`,
        alt: `icon ${i.id}`,
        className: clsx(`particle opacity-0 absolute z-0`, i.className)
      }
    ) }, i.id);
  }) });
};
const I = () => {
  const particles = [
    {
      id: "tower",
      className: "w-[142px]",
      position: { x: "-547px", y: "-205px", rotate: "-22deg" },
      src: "assets/images/art/i/tower.webp"
    },
    {
      id: "imagineative",
      className: "w-[895px]",
      position: { x: "-547px", y: "-663px" },
      src: "assets/images/art/i/imagineative.webp"
    },
    {
      id: "statue",
      className: "w-[507px]",
      position: { x: "216px", y: "-563px", rotate: "22deg" },
      src: "assets/images/art/i/statue.webp"
    },
    {
      id: "camera",
      className: "w-[686px] bottom-0 h-sm:w-[556px]",
      position: { x: "-343px" },
      src: "assets/images/art/i/camera.webp"
    },
    {
      id: "morphingshape",
      options: {
        zoom: 0.4,
        blur: 40,
        offsetStart: 58,
        offsetEnd: 100,
        colorStart: "#FCF099",
        colorEnd: "#E5DC95"
      },
      position: { x: "144px", y: "-410px", rotate: "-50deg" }
    },
    {
      id: "morphingshape-2",
      options: {
        zoom: 0.25,
        blur: 20,
        offsetStart: 58,
        offsetEnd: 100,
        colorStart: "#FCF099",
        colorEnd: "#E5DC95"
      },
      position: { x: "-648px", y: "102px", rotate: "-50deg" }
    }
  ];
  useEffect(() => {
    particles.forEach((particle) => {
      animate(`#particle-${particle.id}`, {
        x: particle.position.x,
        y: particle.position.y,
        opacity: [0, 1],
        ease: spring({
          bounce: 0.65,
          duration: 400
        }),
        rotate: particle.position.rotate || 0,
        duration: 300,
        alternate: true
      });
    });
  }, []);
  return /* @__PURE__ */ jsx(Fragment$1, { children: particles.map((i, index) => {
    var _a, _b, _c, _d, _e, _f;
    return /* @__PURE__ */ jsx("div", { children: i.id.includes("morphingshape") ? /* @__PURE__ */ jsx("div", { id: `particle-${i.id}`, children: /* @__PURE__ */ jsx(
      MorphingShape,
      {
        blur: (_a = i.options) == null ? void 0 : _a.blur,
        zoom: (_b = i.options) == null ? void 0 : _b.zoom,
        id: `${i.id}`,
        colorStart: (_c = i.options) == null ? void 0 : _c.colorStart,
        colorEnd: (_d = i.options) == null ? void 0 : _d.colorEnd,
        offsetStart: (_e = i.options) == null ? void 0 : _e.offsetStart,
        offsetEnd: (_f = i.options) == null ? void 0 : _f.offsetEnd,
        classNameWrapper: "absolute"
      }
    ) }) : /* @__PURE__ */ jsx(
      "img",
      {
        src: i.src,
        id: `particle-${i.id}`,
        alt: `icon ${i.id}`,
        className: clsx(`particle opacity-0 absolute z-0`, i.className)
      }
    ) }, i.id);
  }) });
};
const R = () => {
  const mirrors = [
    {
      className: "left-[144px]",
      src: "assets/images/art/r/mirror.svg"
    },
    {
      className: "left-[403px]",
      src: "assets/images/art/r/mirror2.svg"
    },
    {
      className: "left-[432px]",
      src: "assets/images/art/r/mirror3.svg"
    },
    {
      className: "left-[1008px]",
      src: "assets/images/art/r/mirror4.svg"
    },
    {
      className: "left-[965px]",
      src: "assets/images/art/r/mirror5.svg"
    },
    {
      className: "left-[144px] bottom-[102px] blur-[10px]",
      src: "assets/images/art/r/mirror6.svg"
    },
    {
      className: "left-[1037px] ",
      src: "assets/images/art/r/mirror7.svg"
    }
  ];
  const particles = [
    {
      id: "rectangle",
      className: "w-[376px]",
      position: { x: "-576px", y: "-154px" },
      src: "assets/images/art/r/rectangle.webp"
    },
    {
      id: "radiant",
      className: "w-[696px]",
      position: { x: "-216px", y: "-714px" },
      src: "assets/images/art/r/radiant.webp"
    },
    {
      id: "earth",
      className: "w-[395px]",
      position: { x: "360px", y: "-358px" },
      src: "assets/images/art/r/earth.webp"
    },
    {
      id: "sun",
      className: "w-[636px] bottom-0 h-sm:w-[516px]",
      position: { x: "-318px" },
      src: "assets/images/art/r/sun.webp"
    }
  ];
  useEffect(() => {
    particles.forEach((particle) => {
      animate(`#particle-${particle.id}`, {
        x: particle.position.x,
        y: particle.position.y,
        opacity: [0, 1],
        ease: spring({
          bounce: 0.65,
          duration: 400
        }),
        rotate: particle.position.rotate || 0,
        duration: 300,
        alternate: true
      });
    });
  }, []);
  return /* @__PURE__ */ jsxs(Fragment$1, { children: [
    particles.map((i, index) => /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx(
      "img",
      {
        src: i.src,
        id: `particle-${i.id}`,
        alt: `icon ${i.id}`,
        className: clsx(`particle opacity-0 absolute z-0`, i.className)
      }
    ) }, i.id)),
    mirrors.map((mirror, index) => /* @__PURE__ */ jsx("div", { className: clsx(`absolute z-0`, mirror.className), children: /* @__PURE__ */ jsx("img", { src: mirror.src }) }, `mirror-${index}`))
  ] });
};
const A = () => {
  const particles = [
    {
      id: "headphone",
      className: "w-[544px]",
      position: { x: "158px", y: "-717px" },
      src: "assets/images/art/a/headphone.webp"
    },
    {
      id: "art",
      className: "w-[776px]",
      position: { x: "-432px", y: "-635px" },
      src: "assets/images/art/a/art.webp"
    },
    {
      id: "bg-2",
      className: "w-[670px] bottom-0 h-sm:w-[570px]",
      position: { x: "-130px" },
      src: "assets/images/art/a/bg-2.webp"
    },
    {
      id: "bg-1",
      className: "w-[540px] bottom-0 h-sm:w-[440px]",
      position: { x: "-400px" },
      src: "assets/images/art/a/bg-1.webp"
    },
    {
      id: "first",
      className: "w-[260px] bottom-0 h-sm:w-[160px]",
      position: { x: "-340px" },
      src: "assets/images/art/a/first.webp"
    },
    {
      id: "mid",
      className: "w-[240px] bottom-0 h-sm:w-[180px]",
      position: { x: "-120px" },
      src: "assets/images/art/a/mid.webp"
    },
    {
      id: "last",
      className: "w-[338px] bottom-0 h-sm:w-[238px]",
      position: { x: "100px" },
      src: "assets/images/art/a/last.webp"
    },
    {
      id: "cheat",
      className: "w-[316px] z-10",
      position: { x: "-710px", y: "-270px" },
      src: "assets/images/art/a/cheat.webp"
    },
    {
      id: "noise",
      className: "w-[376px]",
      position: { x: "-696px", y: "-300px" },
      src: "assets/images/art/a/noise.webp"
    }
  ];
  useEffect(() => {
    particles.forEach((particle) => {
      animate(`#particle-${particle.id}`, {
        x: particle.position.x,
        y: particle.position.y,
        opacity: [0, 1],
        ease: spring({
          bounce: 0.65,
          duration: 400
        }),
        rotate: particle.position.rotate || 0,
        duration: 300,
        alternate: true
      });
    });
  }, []);
  return /* @__PURE__ */ jsx(Fragment$1, { children: particles.map((i, index) => /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx(
    "img",
    {
      src: i.src,
      id: `particle-${i.id}`,
      alt: `icon ${i.id}`,
      className: clsx(`particle opacity-0 absolute z-0`, i.className)
    }
  ) }, i.id)) });
};
const loader$1 = async (_args) => {
  return {};
};
const meta = getMergedPageMeta;
memo(Logo);
function useClickOutside(callback, excludeRefs) {
  const ref = useRef(null);
  useEffect(() => {
    const handleClickOutside = (event) => {
      const target = event.target;
      console.log("handleClickOutside", ref.current);
      if (ref.current && !ref.current.contains(target)) {
        const isExcluded = excludeRefs == null ? void 0 : excludeRefs.some((excludeRef) => excludeRef.current && excludeRef.current.contains(target));
        if (!isExcluded) {
          callback();
        }
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [callback, excludeRefs]);
  return ref;
}
const _index = UNSAFE_withComponentProps(function IndexRoute2() {
  const [isOpen, setIsOpen] = useState(false);
  const [hoverActiveClass, setHoverActiveClass] = useState("");
  const [activeComponent, setActiveComponent] = useState("main");
  const menuRef = useRef(null);
  const logoRef = useRef(null);
  function debounce2(func, wait, immediate) {
    let timeout;
    return function(...args) {
      const context = this;
      if (timeout) clearTimeout(timeout);
      timeout = setTimeout(() => {
        timeout = null;
        func.apply(context, args);
      }, wait);
    };
  }
  const handleLetterClick = useCallback((letter) => {
    setActiveComponent(letter);
    setHoverActiveClass(`${letter.toLowerCase()}-hover`);
  }, []);
  const handleMouseEnterLetter = useCallback((letter) => {
    const debouncedFunction = debounce2(() => {
      if (letter !== activeComponent) {
        setActiveComponent(letter);
        setHoverActiveClass(`${letter.toLowerCase()}-hover`);
      }
    }, 500);
    debouncedFunction();
  }, [activeComponent]);
  const handleMouseLeaveLogo = useCallback(() => {
    const debouncedFunction = debounce2(() => {
      setActiveComponent("main");
      setHoverActiveClass("");
    }, 500);
    debouncedFunction();
  }, []);
  const handleMenuToggle = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);
  const handleClickOutside = useCallback(() => {
    console.log("handleClickOutside", isOpen, activeComponent);
    if (isOpen) {
      setIsOpen(false);
    }
    if (activeComponent !== "main") {
      setActiveComponent("main");
      setHoverActiveClass("");
    }
  }, [isOpen, activeComponent]);
  const containerRef = useClickOutside(handleClickOutside, [menuRef, logoRef]);
  const [descriptionClassName, setDescriptionClassName] = useState("z-10 mt-16");
  const [descriptionText, setDescriptionText] = useState("");
  const {
    t
  } = useI18n();
  useEffect(() => {
    switch (activeComponent) {
      case "K":
        setDescriptionClassName("max-w-3xl");
        setDescriptionText(t("home.k.description"));
        break;
      case "I":
        setDescriptionClassName("max-w-3xl");
        setDescriptionText(t("home.i.description"));
        break;
      case "R":
        setDescriptionClassName("max-w-[590px]");
        setDescriptionText(t("home.r.description"));
        break;
      case "A":
        setDescriptionClassName("max-w-3xl");
        setDescriptionText(t("home.a.description"));
        break;
      default:
        setDescriptionClassName("z-10 mt-16");
        setDescriptionText(t("home.default.description"));
        break;
    }
  }, [activeComponent]);
  return /* @__PURE__ */ jsxs("div", {
    ref: containerRef,
    className: "relative h-screen w-screen px-11 py-8 flex flex-col items-center justify-center overflow-hidden",
    children: [/* @__PURE__ */ jsxs("div", {
      className: "flex gap-11 justify-between absolute top-0 left-0 w-full px-11 pt-8",
      children: [/* @__PURE__ */ jsxs("p", {
        className: "font-title font-bold text-8xl uppercase",
        children: [/* @__PURE__ */ jsx("span", {
          children: "This"
        }), " ", /* @__PURE__ */ jsx("br", {}), /* @__PURE__ */ jsx("span", {
          className: "ml-[14px]",
          children: "is"
        })]
      }), activeComponent === "main" && /* @__PURE__ */ jsxs("div", {
        ref: menuRef,
        className: "flex flex-col gap-6",
        children: [/* @__PURE__ */ jsx(MenuToggle, {
          isOpen,
          onClick: handleMenuToggle,
          className: "shadow-[0px_4px_10px_0px_#00000040] z-[10000]"
        }), /* @__PURE__ */ jsx(LanguageSwitcher, {})]
      })]
    }), activeComponent === "main" && isOpen && /* @__PURE__ */ jsx(MainMenu, {}), /* @__PURE__ */ jsxs("div", {
      ref: logoRef,
      className: "flex relative flex-col items-center gap-3",
      children: [activeComponent !== "main" && /* @__PURE__ */ jsx("div", {
        className: "z-10 h-[80px]"
      }), activeComponent === "main" && /* @__PURE__ */ jsx(ShopLink, {
        className: "z-10"
      }), /* @__PURE__ */ jsx(Logo, {
        className: clsx("z-[999] mix-blend-exclusion", hoverActiveClass),
        onLetterClick: handleLetterClick,
        onMouseEnterLetter: handleMouseEnterLetter,
        onMouseLeaveLogo: handleMouseLeaveLogo
      }), /* @__PURE__ */ jsx(Description, {
        className: clsx("z-10 mt-8", descriptionClassName),
        description: descriptionText
      })]
    }), activeComponent === "main" && /* @__PURE__ */ jsx(Main, {}), activeComponent === "K" && /* @__PURE__ */ jsx(K, {}), activeComponent === "I" && /* @__PURE__ */ jsx(I, {}), activeComponent === "R" && /* @__PURE__ */ jsx(R, {}), activeComponent === "A" && /* @__PURE__ */ jsx(A, {}), /* @__PURE__ */ jsxs("div", {
      className: "flex gap-11 justify-between absolute bottom-0 left-0 w-full px-11",
      children: [/* @__PURE__ */ jsx("p", {
        className: "font-title font-medium text-[65px] uppercase",
        children: "Est."
      }), /* @__PURE__ */ jsx("p", {
        className: "font-title font-medium text-[65px] uppercase",
        children: "2025"
      })]
    })]
  });
});
const route38 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: _index,
  loader: loader$1,
  meta
}, Symbol.toStringTag, { value: "Module" }));
const loader = async () => {
  return redirect("/");
};
const route39 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  loader
}, Symbol.toStringTag, { value: "Module" }));
const serverManifest = { "entry": { "module": "/assets/entry.client-F_IQ7Iqb.js", "imports": ["/assets/chunk-OIYGIGL5-DwAmQ0ss.js", "/assets/index-BBGT89su.js"], "css": [] }, "routes": { "root": { "id": "root", "parentId": void 0, "path": "", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": true, "module": "/assets/root-C_rWKzU6.js", "imports": ["/assets/chunk-OIYGIGL5-DwAmQ0ss.js", "/assets/index-BBGT89su.js", "/assets/meta-DdeOJusI.js", "/assets/Button-CD5SaSlX.js", "/assets/ButtonLink-C2zR5Z3r.js", "/assets/IconButton-ChzBeAiO.js", "/assets/useCart-10B1hJzZ.js", "/assets/prices-CbSl8Vzg.js", "/assets/ShoppingCartIcon-CtqyQGRu.js", "/assets/clsx-B-dksMZM.js", "/assets/Image-LXxd3KYB.js", "/assets/use-is-mounted-CQV8HwfT.js", "/assets/description-D4E3d2vJ.js", "/assets/Container-CtiQtPRb.js", "/assets/URLAwareNavLink-Cl4ROVGQ.js", "/assets/context-CLTa6GoL.js"], "css": ["/assets/root-BlTJiIis.css"], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/[.well-known].apple-developer-merchantid-domain-association": { "id": "routes/[.well-known].apple-developer-merchantid-domain-association", "parentId": "root", "path": ".well-known/apple-developer-merchantid-domain-association", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/_.well-known_.apple-developer-merchantid-domain-association-l0sNRNKZ.js", "imports": [], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/api.checkout.remove-discount-code": { "id": "routes/api.checkout.remove-discount-code", "parentId": "root", "path": "api/checkout/remove-discount-code", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/api.checkout.remove-discount-code-l0sNRNKZ.js", "imports": [], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/api.checkout.shipping-methods": { "id": "routes/api.checkout.shipping-methods", "parentId": "root", "path": "api/checkout/shipping-methods", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/api.checkout.shipping-methods-l0sNRNKZ.js", "imports": [], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/collections.$collectionHandle": { "id": "routes/collections.$collectionHandle", "parentId": "root", "path": "collections/:collectionHandle", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/collections._collectionHandle-DNhrQhgo.js", "imports": ["/assets/chunk-OIYGIGL5-DwAmQ0ss.js", "/assets/Container-CtiQtPRb.js", "/assets/ProductListWithPagination-Cg2VFKl6.js", "/assets/MorphingShape-DHFRbU-J.js", "/assets/clsx-B-dksMZM.js", "/assets/pagination-with-context-7Mr3vTbJ.js", "/assets/ProductGrid-DQBEsWU0.js", "/assets/ProductListItem-C6i4RUqD.js", "/assets/prices-CbSl8Vzg.js", "/assets/Image-LXxd3KYB.js", "/assets/useCart-10B1hJzZ.js", "/assets/PlusIcon-Btf11K4w.js", "/assets/URLAwareNavLink-Cl4ROVGQ.js", "/assets/ArrowRightIcon-DL6FjWMM.js", "/assets/context-CLTa6GoL.js", "/assets/animation-BrpFQVme.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/api.checkout.account-details": { "id": "routes/api.checkout.account-details", "parentId": "root", "path": "api/checkout/account-details", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/api.checkout.account-details-l0sNRNKZ.js", "imports": [], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/api.checkout.billing-address": { "id": "routes/api.checkout.billing-address", "parentId": "root", "path": "api/checkout/billing-address", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/api.checkout.billing-address-l0sNRNKZ.js", "imports": [], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/api.newsletter-subscriptions": { "id": "routes/api.newsletter-subscriptions", "parentId": "root", "path": "api/newsletter-subscriptions", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/api.newsletter-subscriptions-l0sNRNKZ.js", "imports": [], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/api.cart.line-items.create": { "id": "routes/api.cart.line-items.create", "parentId": "root", "path": "api/cart/line-items/create", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/api.cart.line-items.create-l0sNRNKZ.js", "imports": [], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/api.cart.line-items.delete": { "id": "routes/api.cart.line-items.delete", "parentId": "root", "path": "api/cart/line-items/delete", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/api.cart.line-items.delete-l0sNRNKZ.js", "imports": [], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/api.cart.line-items.update": { "id": "routes/api.cart.line-items.update", "parentId": "root", "path": "api/cart/line-items/update", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/api.cart.line-items.update-l0sNRNKZ.js", "imports": [], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/api.checkout.discount-code": { "id": "routes/api.checkout.discount-code", "parentId": "root", "path": "api/checkout/discount-code", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/api.checkout.discount-code-l0sNRNKZ.js", "imports": [], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/api.product-reviews.create": { "id": "routes/api.product-reviews.create", "parentId": "root", "path": "api/product-reviews/create", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/api.product-reviews.create-l0sNRNKZ.js", "imports": [], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/categories.$categoryHandle": { "id": "routes/categories.$categoryHandle", "parentId": "root", "path": "categories/:categoryHandle", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/categories._categoryHandle-CLKOEF_h.js", "imports": ["/assets/chunk-OIYGIGL5-DwAmQ0ss.js", "/assets/Container-CtiQtPRb.js", "/assets/ProductListWithPagination-Cg2VFKl6.js", "/assets/clsx-B-dksMZM.js", "/assets/pagination-with-context-7Mr3vTbJ.js", "/assets/ProductGrid-DQBEsWU0.js", "/assets/ProductListItem-C6i4RUqD.js", "/assets/prices-CbSl8Vzg.js", "/assets/Image-LXxd3KYB.js", "/assets/useCart-10B1hJzZ.js", "/assets/MorphingShape-DHFRbU-J.js", "/assets/context-CLTa6GoL.js", "/assets/animation-BrpFQVme.js", "/assets/PlusIcon-Btf11K4w.js", "/assets/URLAwareNavLink-Cl4ROVGQ.js", "/assets/ArrowRightIcon-DL6FjWMM.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/[sitemap-collections.xml]": { "id": "routes/[sitemap-collections.xml]", "parentId": "root", "path": "sitemap-collections.xml", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/_sitemap-collections.xml_-l0sNRNKZ.js", "imports": [], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/api.checkout.contact-info": { "id": "routes/api.checkout.contact-info", "parentId": "root", "path": "api/checkout/contact-info", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/api.checkout.contact-info-l0sNRNKZ.js", "imports": [], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/orders_.$orderId.reviews": { "id": "routes/orders_.$orderId.reviews", "parentId": "root", "path": "orders/:orderId/reviews", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/orders_._orderId.reviews-CjuQTFxt.js", "imports": ["/assets/chunk-OIYGIGL5-DwAmQ0ss.js", "/assets/Button-CD5SaSlX.js", "/assets/ButtonLink-C2zR5Z3r.js", "/assets/Container-CtiQtPRb.js", "/assets/Image-LXxd3KYB.js", "/assets/clsx-B-dksMZM.js", "/assets/data-table-router-form-CkcVdATv.js", "/assets/zod-HdK7eP7T.js", "/assets/SubmitButton-CaoY3KQG.js", "/assets/LightboxGallery-Cg-dWoDB.js", "/assets/IconButton-ChzBeAiO.js", "/assets/useScrollArrows-JSuWOWwO.js", "/assets/createLucideIcon-B4KlhTzx.js", "/assets/index-BBGT89su.js", "/assets/ArrowRightIcon-DL6FjWMM.js"], "css": ["/assets/LightboxGallery-Dv3yAxos.css"], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/products.$productHandle": { "id": "routes/products.$productHandle", "parentId": "root", "path": "products/:productHandle", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/products._productHandle-IkzGtlB8.js", "imports": ["/assets/chunk-OIYGIGL5-DwAmQ0ss.js", "/assets/ProductList-BT6i_Sgg.js", "/assets/Button-CD5SaSlX.js", "/assets/Container-CtiQtPRb.js", "/assets/GridColumn-Cd3MEiz-.js", "/assets/SubmitButton-CaoY3KQG.js", "/assets/QuantitySelector-S6ImSQ9T.js", "/assets/Image-LXxd3KYB.js", "/assets/LightboxGallery-Cg-dWoDB.js", "/assets/useScrollArrows-JSuWOWwO.js", "/assets/clsx-B-dksMZM.js", "/assets/MorphingShape-DHFRbU-J.js", "/assets/ProductListItem-C6i4RUqD.js", "/assets/use-is-mounted-CQV8HwfT.js", "/assets/description-D4E3d2vJ.js", "/assets/index-BBGT89su.js", "/assets/prices-CbSl8Vzg.js", "/assets/pagination-with-context-7Mr3vTbJ.js", "/assets/useCart-10B1hJzZ.js", "/assets/zod-HdK7eP7T.js", "/assets/meta-DdeOJusI.js", "/assets/PlusIcon-Btf11K4w.js", "/assets/ArrowRightIcon-DL6FjWMM.js", "/assets/IconButton-ChzBeAiO.js", "/assets/context-CLTa6GoL.js", "/assets/animation-BrpFQVme.js"], "css": ["/assets/LightboxGallery-Dv3yAxos.css"], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/[sitemap-products.xml]": { "id": "routes/[sitemap-products.xml]", "parentId": "root", "path": "sitemap-products.xml", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/_sitemap-products.xml_-l0sNRNKZ.js", "imports": [], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/api.checkout.complete": { "id": "routes/api.checkout.complete", "parentId": "root", "path": "api/checkout/complete", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/api.checkout.complete-l0sNRNKZ.js", "imports": [], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/api.checkout.express": { "id": "routes/api.checkout.express", "parentId": "root", "path": "api/checkout/express", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/api.checkout.express-l0sNRNKZ.js", "imports": [], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/[sitemap-pages.xml]": { "id": "routes/[sitemap-pages.xml]", "parentId": "root", "path": "sitemap-pages.xml", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/_sitemap-pages.xml_-l0sNRNKZ.js", "imports": [], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/collections._index": { "id": "routes/collections._index", "parentId": "root", "path": "collections", "index": true, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/collections._index-CC6Ky0sP.js", "imports": ["/assets/chunk-OIYGIGL5-DwAmQ0ss.js", "/assets/Container-CtiQtPRb.js", "/assets/ProductGrid-DQBEsWU0.js", "/assets/clsx-B-dksMZM.js", "/assets/ProductListItem-C6i4RUqD.js", "/assets/prices-CbSl8Vzg.js", "/assets/Image-LXxd3KYB.js", "/assets/useCart-10B1hJzZ.js", "/assets/MorphingShape-DHFRbU-J.js", "/assets/context-CLTa6GoL.js", "/assets/animation-BrpFQVme.js", "/assets/PlusIcon-Btf11K4w.js", "/assets/URLAwareNavLink-Cl4ROVGQ.js", "/assets/ArrowRightIcon-DL6FjWMM.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/blogs.$slugHandle": { "id": "routes/blogs.$slugHandle", "parentId": "root", "path": "blogs/:slugHandle", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/blogs._slugHandle-ueKxsdq6.js", "imports": ["/assets/chunk-OIYGIGL5-DwAmQ0ss.js", "/assets/Container-CtiQtPRb.js", "/assets/clsx-B-dksMZM.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/checkout.success": { "id": "routes/checkout.success", "parentId": "root", "path": "checkout/success", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/checkout.success-BoVj4g8T.js", "imports": ["/assets/chunk-OIYGIGL5-DwAmQ0ss.js", "/assets/ProductList-BT6i_Sgg.js", "/assets/Container-CtiQtPRb.js", "/assets/clsx-B-dksMZM.js", "/assets/useScrollArrows-JSuWOWwO.js", "/assets/ArrowRightIcon-DL6FjWMM.js", "/assets/IconButton-ChzBeAiO.js", "/assets/Button-CD5SaSlX.js", "/assets/Image-LXxd3KYB.js", "/assets/ProductListItem-C6i4RUqD.js", "/assets/prices-CbSl8Vzg.js", "/assets/useCart-10B1hJzZ.js", "/assets/MorphingShape-DHFRbU-J.js", "/assets/context-CLTa6GoL.js", "/assets/animation-BrpFQVme.js", "/assets/PlusIcon-Btf11K4w.js", "/assets/use-is-mounted-CQV8HwfT.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/api.health.live": { "id": "routes/api.health.live", "parentId": "root", "path": "api/health/live", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/api.health.live-l0sNRNKZ.js", "imports": [], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/checkout._index": { "id": "routes/checkout._index", "parentId": "root", "path": "checkout", "index": true, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/checkout._index-C7j1O0zR.js", "imports": ["/assets/chunk-OIYGIGL5-DwAmQ0ss.js", "/assets/data-table-router-form-CkcVdATv.js", "/assets/prices-CbSl8Vzg.js", "/assets/Button-CD5SaSlX.js", "/assets/clsx-B-dksMZM.js", "/assets/ShoppingCartIcon-CtqyQGRu.js", "/assets/zod-HdK7eP7T.js", "/assets/SubmitButton-CaoY3KQG.js", "/assets/Image-LXxd3KYB.js", "/assets/QuantitySelector-S6ImSQ9T.js", "/assets/ButtonLink-C2zR5Z3r.js", "/assets/createLucideIcon-B4KlhTzx.js", "/assets/index-BBGT89su.js", "/assets/PlusIcon-Btf11K4w.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/products._index": { "id": "routes/products._index", "parentId": "root", "path": "products", "index": true, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/products._index-_29XUoEk.js", "imports": ["/assets/chunk-OIYGIGL5-DwAmQ0ss.js", "/assets/clsx-B-dksMZM.js", "/assets/Container-CtiQtPRb.js", "/assets/coming-collection-CQrIDzGa.js", "/assets/createLucideIcon-B4KlhTzx.js", "/assets/proxy-BCNpownP.js", "/assets/animation-BrpFQVme.js", "/assets/index-B3BSRMWe.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/[favicon.ico]": { "id": "routes/[favicon.ico]", "parentId": "root", "path": "favicon.ico", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/_favicon.ico_-l0sNRNKZ.js", "imports": [], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/[sitemap.xml]": { "id": "routes/[sitemap.xml]", "parentId": "root", "path": "sitemap.xml", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/_sitemap.xml_-l0sNRNKZ.js", "imports": [], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/api.page-data": { "id": "routes/api.page-data", "parentId": "root", "path": "api/page-data", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/api.page-data-l0sNRNKZ.js", "imports": [], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/[robots.txt]": { "id": "routes/[robots.txt]", "parentId": "root", "path": "robots.txt", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/_robots.txt_-l0sNRNKZ.js", "imports": [], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/blogs._index": { "id": "routes/blogs._index", "parentId": "root", "path": "blogs", "index": true, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/blogs._index-BzCp-ZrD.js", "imports": ["/assets/chunk-OIYGIGL5-DwAmQ0ss.js", "/assets/Container-CtiQtPRb.js", "/assets/clsx-B-dksMZM.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/pick-a-card": { "id": "routes/pick-a-card", "parentId": "root", "path": "pick-a-card", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/pick-a-card-BKOi4JzN.js", "imports": ["/assets/chunk-OIYGIGL5-DwAmQ0ss.js", "/assets/clsx-B-dksMZM.js", "/assets/coming-collection-CQrIDzGa.js", "/assets/proxy-BCNpownP.js", "/assets/animation-BrpFQVme.js", "/assets/index-B3BSRMWe.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/api.region": { "id": "routes/api.region", "parentId": "root", "path": "api/region", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/api.region-l0sNRNKZ.js", "imports": [], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/about-us": { "id": "routes/about-us", "parentId": "root", "path": "about-us", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/about-us-D_wOHGRp.js", "imports": ["/assets/chunk-OIYGIGL5-DwAmQ0ss.js", "/assets/Container-CtiQtPRb.js", "/assets/Button-CD5SaSlX.js", "/assets/URLAwareNavLink-Cl4ROVGQ.js", "/assets/clsx-B-dksMZM.js", "/assets/page-BN0zaAAq.js", "/assets/meta-DdeOJusI.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/contact": { "id": "routes/contact", "parentId": "root", "path": "contact", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/contact-BrMr5p_i.js", "imports": ["/assets/chunk-OIYGIGL5-DwAmQ0ss.js", "/assets/zod-HdK7eP7T.js", "/assets/Container-CtiQtPRb.js", "/assets/ProductList-BT6i_Sgg.js", "/assets/clsx-B-dksMZM.js", "/assets/useScrollArrows-JSuWOWwO.js", "/assets/ArrowRightIcon-DL6FjWMM.js", "/assets/IconButton-ChzBeAiO.js", "/assets/Button-CD5SaSlX.js", "/assets/Image-LXxd3KYB.js", "/assets/ProductListItem-C6i4RUqD.js", "/assets/prices-CbSl8Vzg.js", "/assets/useCart-10B1hJzZ.js", "/assets/MorphingShape-DHFRbU-J.js", "/assets/context-CLTa6GoL.js", "/assets/animation-BrpFQVme.js", "/assets/PlusIcon-Btf11K4w.js", "/assets/use-is-mounted-CQV8HwfT.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/stories": { "id": "routes/stories", "parentId": "root", "path": "stories", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/stories-nnJUsYel.js", "imports": ["/assets/chunk-OIYGIGL5-DwAmQ0ss.js", "/assets/GridColumn-Cd3MEiz-.js", "/assets/Main-5aV6qhdF.js", "/assets/clsx-B-dksMZM.js", "/assets/proxy-BCNpownP.js", "/assets/animation-BrpFQVme.js", "/assets/index-B3BSRMWe.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/_index": { "id": "routes/_index", "parentId": "root", "path": void 0, "index": true, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/_index-C_PzwQ5c.js", "imports": ["/assets/chunk-OIYGIGL5-DwAmQ0ss.js", "/assets/page-BN0zaAAq.js", "/assets/clsx-B-dksMZM.js", "/assets/MorphingShape-DHFRbU-J.js", "/assets/Main-5aV6qhdF.js", "/assets/animation-BrpFQVme.js", "/assets/index-B3BSRMWe.js", "/assets/meta-DdeOJusI.js", "/assets/context-CLTa6GoL.js"], "css": ["/assets/_index-CVDrmUgF.css"], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/$": { "id": "routes/$", "parentId": "root", "path": "*", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/_-l0sNRNKZ.js", "imports": [], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 } }, "url": "/assets/manifest-5920763d.js", "version": "5920763d", "sri": void 0 };
const assetsBuildDirectory = "build/client";
const basename = "/";
const future = { "v8_middleware": false, "unstable_optimizeDeps": false, "unstable_splitRouteModules": false, "unstable_subResourceIntegrity": false, "unstable_viteEnvironmentApi": false };
const ssr = true;
const isSpaMode = false;
const prerender = [];
const routeDiscovery = { "mode": "lazy", "manifestPath": "/__manifest" };
const publicPath = "/";
const entry = { module: entryServer };
const routes = {
  "root": {
    id: "root",
    parentId: void 0,
    path: "",
    index: void 0,
    caseSensitive: void 0,
    module: route0
  },
  "routes/[.well-known].apple-developer-merchantid-domain-association": {
    id: "routes/[.well-known].apple-developer-merchantid-domain-association",
    parentId: "root",
    path: ".well-known/apple-developer-merchantid-domain-association",
    index: void 0,
    caseSensitive: void 0,
    module: route1
  },
  "routes/api.checkout.remove-discount-code": {
    id: "routes/api.checkout.remove-discount-code",
    parentId: "root",
    path: "api/checkout/remove-discount-code",
    index: void 0,
    caseSensitive: void 0,
    module: route2
  },
  "routes/api.checkout.shipping-methods": {
    id: "routes/api.checkout.shipping-methods",
    parentId: "root",
    path: "api/checkout/shipping-methods",
    index: void 0,
    caseSensitive: void 0,
    module: route3
  },
  "routes/collections.$collectionHandle": {
    id: "routes/collections.$collectionHandle",
    parentId: "root",
    path: "collections/:collectionHandle",
    index: void 0,
    caseSensitive: void 0,
    module: route4
  },
  "routes/api.checkout.account-details": {
    id: "routes/api.checkout.account-details",
    parentId: "root",
    path: "api/checkout/account-details",
    index: void 0,
    caseSensitive: void 0,
    module: route5
  },
  "routes/api.checkout.billing-address": {
    id: "routes/api.checkout.billing-address",
    parentId: "root",
    path: "api/checkout/billing-address",
    index: void 0,
    caseSensitive: void 0,
    module: route6
  },
  "routes/api.newsletter-subscriptions": {
    id: "routes/api.newsletter-subscriptions",
    parentId: "root",
    path: "api/newsletter-subscriptions",
    index: void 0,
    caseSensitive: void 0,
    module: route7
  },
  "routes/api.cart.line-items.create": {
    id: "routes/api.cart.line-items.create",
    parentId: "root",
    path: "api/cart/line-items/create",
    index: void 0,
    caseSensitive: void 0,
    module: route8
  },
  "routes/api.cart.line-items.delete": {
    id: "routes/api.cart.line-items.delete",
    parentId: "root",
    path: "api/cart/line-items/delete",
    index: void 0,
    caseSensitive: void 0,
    module: route9
  },
  "routes/api.cart.line-items.update": {
    id: "routes/api.cart.line-items.update",
    parentId: "root",
    path: "api/cart/line-items/update",
    index: void 0,
    caseSensitive: void 0,
    module: route10
  },
  "routes/api.checkout.discount-code": {
    id: "routes/api.checkout.discount-code",
    parentId: "root",
    path: "api/checkout/discount-code",
    index: void 0,
    caseSensitive: void 0,
    module: route11
  },
  "routes/api.product-reviews.create": {
    id: "routes/api.product-reviews.create",
    parentId: "root",
    path: "api/product-reviews/create",
    index: void 0,
    caseSensitive: void 0,
    module: route12
  },
  "routes/categories.$categoryHandle": {
    id: "routes/categories.$categoryHandle",
    parentId: "root",
    path: "categories/:categoryHandle",
    index: void 0,
    caseSensitive: void 0,
    module: route13
  },
  "routes/[sitemap-collections.xml]": {
    id: "routes/[sitemap-collections.xml]",
    parentId: "root",
    path: "sitemap-collections.xml",
    index: void 0,
    caseSensitive: void 0,
    module: route14
  },
  "routes/api.checkout.contact-info": {
    id: "routes/api.checkout.contact-info",
    parentId: "root",
    path: "api/checkout/contact-info",
    index: void 0,
    caseSensitive: void 0,
    module: route15
  },
  "routes/orders_.$orderId.reviews": {
    id: "routes/orders_.$orderId.reviews",
    parentId: "root",
    path: "orders/:orderId/reviews",
    index: void 0,
    caseSensitive: void 0,
    module: route16
  },
  "routes/products.$productHandle": {
    id: "routes/products.$productHandle",
    parentId: "root",
    path: "products/:productHandle",
    index: void 0,
    caseSensitive: void 0,
    module: route17
  },
  "routes/[sitemap-products.xml]": {
    id: "routes/[sitemap-products.xml]",
    parentId: "root",
    path: "sitemap-products.xml",
    index: void 0,
    caseSensitive: void 0,
    module: route18
  },
  "routes/api.checkout.complete": {
    id: "routes/api.checkout.complete",
    parentId: "root",
    path: "api/checkout/complete",
    index: void 0,
    caseSensitive: void 0,
    module: route19
  },
  "routes/api.checkout.express": {
    id: "routes/api.checkout.express",
    parentId: "root",
    path: "api/checkout/express",
    index: void 0,
    caseSensitive: void 0,
    module: route20
  },
  "routes/[sitemap-pages.xml]": {
    id: "routes/[sitemap-pages.xml]",
    parentId: "root",
    path: "sitemap-pages.xml",
    index: void 0,
    caseSensitive: void 0,
    module: route21
  },
  "routes/collections._index": {
    id: "routes/collections._index",
    parentId: "root",
    path: "collections",
    index: true,
    caseSensitive: void 0,
    module: route22
  },
  "routes/blogs.$slugHandle": {
    id: "routes/blogs.$slugHandle",
    parentId: "root",
    path: "blogs/:slugHandle",
    index: void 0,
    caseSensitive: void 0,
    module: route23
  },
  "routes/checkout.success": {
    id: "routes/checkout.success",
    parentId: "root",
    path: "checkout/success",
    index: void 0,
    caseSensitive: void 0,
    module: route24
  },
  "routes/api.health.live": {
    id: "routes/api.health.live",
    parentId: "root",
    path: "api/health/live",
    index: void 0,
    caseSensitive: void 0,
    module: route25
  },
  "routes/checkout._index": {
    id: "routes/checkout._index",
    parentId: "root",
    path: "checkout",
    index: true,
    caseSensitive: void 0,
    module: route26
  },
  "routes/products._index": {
    id: "routes/products._index",
    parentId: "root",
    path: "products",
    index: true,
    caseSensitive: void 0,
    module: route27
  },
  "routes/[favicon.ico]": {
    id: "routes/[favicon.ico]",
    parentId: "root",
    path: "favicon.ico",
    index: void 0,
    caseSensitive: void 0,
    module: route28
  },
  "routes/[sitemap.xml]": {
    id: "routes/[sitemap.xml]",
    parentId: "root",
    path: "sitemap.xml",
    index: void 0,
    caseSensitive: void 0,
    module: route29
  },
  "routes/api.page-data": {
    id: "routes/api.page-data",
    parentId: "root",
    path: "api/page-data",
    index: void 0,
    caseSensitive: void 0,
    module: route30
  },
  "routes/[robots.txt]": {
    id: "routes/[robots.txt]",
    parentId: "root",
    path: "robots.txt",
    index: void 0,
    caseSensitive: void 0,
    module: route31
  },
  "routes/blogs._index": {
    id: "routes/blogs._index",
    parentId: "root",
    path: "blogs",
    index: true,
    caseSensitive: void 0,
    module: route32
  },
  "routes/pick-a-card": {
    id: "routes/pick-a-card",
    parentId: "root",
    path: "pick-a-card",
    index: void 0,
    caseSensitive: void 0,
    module: route33
  },
  "routes/api.region": {
    id: "routes/api.region",
    parentId: "root",
    path: "api/region",
    index: void 0,
    caseSensitive: void 0,
    module: route34
  },
  "routes/about-us": {
    id: "routes/about-us",
    parentId: "root",
    path: "about-us",
    index: void 0,
    caseSensitive: void 0,
    module: route35
  },
  "routes/contact": {
    id: "routes/contact",
    parentId: "root",
    path: "contact",
    index: void 0,
    caseSensitive: void 0,
    module: route36
  },
  "routes/stories": {
    id: "routes/stories",
    parentId: "root",
    path: "stories",
    index: void 0,
    caseSensitive: void 0,
    module: route37
  },
  "routes/_index": {
    id: "routes/_index",
    parentId: "root",
    path: void 0,
    index: true,
    caseSensitive: void 0,
    module: route38
  },
  "routes/$": {
    id: "routes/$",
    parentId: "root",
    path: "*",
    index: void 0,
    caseSensitive: void 0,
    module: route39
  }
};
export {
  serverManifest as assets,
  assetsBuildDirectory,
  basename,
  entry,
  future,
  isSpaMode,
  prerender,
  publicPath,
  routeDiscovery,
  routes,
  ssr
};
