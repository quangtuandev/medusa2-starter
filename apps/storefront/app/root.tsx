import { getCommonMeta, mergeMeta } from "@libs/util/meta";
import { getRootLoader } from "@libs/util/server/root.server";
import { useRef } from "react";
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  ShouldRevalidateFunction,
  useLocation,
  useLoaderData,
  useRouteError,
} from "react-router";
import { MetaFunction } from "react-router";
import { Page } from "./components/layout/Page";
import { RootProviders } from "./providers/root-providers";

import "@app/styles/global.css";
import "./i18n/config"; // Initialize i18n
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { useRootLoaderData } from "./hooks/useRootLoaderData";
import { useI18n } from "./hooks/useI18n";

export const getRootMeta: MetaFunction = ({ data }) => {
  const title = "Kira Parfum";
  const description =
    "Kira Parfum is a luxury fragrance brand that offers a range of high-quality fragrances for men and women.";
  const ogTitle = title;
  const ogDescription = description;
  const ogImage = "";
  const ogImageAlt = !!ogImage ? `${ogTitle} logo` : undefined;

  return [
    { title },
    { name: "description", content: description },
    { property: "og:title", content: ogTitle },
    { property: "og:description", content: ogDescription },
    { property: "og:image", content: ogImage },
    { property: "og:image:alt", content: ogImageAlt },
  ];
};

export const meta: MetaFunction<typeof loader> = mergeMeta(
  getCommonMeta,
  getRootMeta
);

export const loader = getRootLoader;

export const shouldRevalidate: ShouldRevalidateFunction = ({
  actionResult,
  currentParams,
  currentUrl,
  defaultShouldRevalidate,
  formAction,
  formData,
  formEncType,
  formMethod,
  nextParams,
  nextUrl,
}) => {
  if (nextUrl.pathname.startsWith("/checkout/success")) return true;
  if (!formMethod || formMethod === "GET") return false;

  return defaultShouldRevalidate;
};

function App() {
  const headRef = useRef<HTMLHeadElement>(null);
  const data = useRootLoaderData();
  const location = useLocation();
  const { currentLanguage } = useI18n();

  const { env = {}, siteDetails, requestOrigin } = data || {};
  const configuredUrl = siteDetails?.settings?.storefront_url;
  let canonicalUrl: string | undefined;

  try {
    const originUrl = new URL((configuredUrl || requestOrigin || '').trim());
    if (originUrl.protocol === 'http:' || originUrl.protocol === 'https:') {
      canonicalUrl = new URL(location.pathname, originUrl.origin).toString();
    }
  } catch {
    canonicalUrl = undefined;
  }

  return (
    <RootProviders>
      <html lang={currentLanguage} className="min-h-screen">
        <head ref={headRef}>
          <meta charSet="UTF-8" />
          <Meta />
          {canonicalUrl ? <link rel="canonical" href={canonicalUrl} /> : null}

          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link
            rel="preconnect"
            href="https://fonts.gstatic.com"
            crossOrigin="anonymous"
          />
          <link
            href="https://fonts.googleapis.com/css2?family=Alexandria:wght@100..900&display=swap"
            rel="stylesheet"
          />
          <link
            href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap"
            rel="stylesheet"
          />

          <Links />
          {siteDetails?.settings?.description && (
            <meta
              name="description"
              content={siteDetails.settings.description}
            />
          )}

          {/* Meta Pixel Code */}
          <script
            dangerouslySetInnerHTML={{
              __html: `!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '1477300931172169');
fbq('track', 'PageView');`,
            }}
          />
          <noscript>
            <img
              height="1"
              width="1"
              style={{ display: "none" }}
              src="https://www.facebook.com/tr?id=1477300931172169&ev=PageView&noscript=1"
              alt=""
            />
          </noscript>
          {/* End Meta Pixel Code */}
        </head>
        <body className="min-h-screen">
          <Page>
            <Outlet />
          </Page>
          <script
            dangerouslySetInnerHTML={{
              __html: `window.ENV = ${JSON.stringify(env)}`,
            }}
          />
          <ScrollRestoration />
          <Scripts />
        </body>
      </html>
    </RootProviders>
  );
}

export default App;

export function ErrorBoundary() {
  const error = useRouteError();

  console.error("error boundary error", error);

  return (
    <html>
      <head>
        <title>Oh no!</title>
        <Meta />
        <Links />
      </head>
      <body>
        <Scripts />
      </body>
    </html>
  );
}
