import type { LoaderFunctionArgs } from "react-router";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const baseUrl =
    process.env.INTERNAL_MEDUSA_API_URL ||
    process.env.PUBLIC_MEDUSA_API_URL ||
    "http://localhost:7901";
  const publishableKey = process.env.MEDUSA_PUBLISHABLE_KEY || "";

  try {
    const res = await fetch(`${baseUrl}/store/popups`, {
      headers: {
        "x-publishable-api-key": publishableKey,
      },
    });

    if (!res.ok) {
      return Response.json({ popups: [] });
    }

    const json = await res.json();
    return Response.json({ popups: json.popups || [] });
  } catch (err) {
    console.error("Failed to fetch popups from Medusa:", err);
    return Response.json({ popups: [] });
  }
};
