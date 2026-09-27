export const fetchSliderCards = async function (): Promise<any[]> {
  const baseUrl =
    process.env.INTERNAL_MEDUSA_API_URL ||
    process.env.PUBLIC_MEDUSA_API_URL ||
    "http://localhost:7901";
  const publishableKey = process.env.MEDUSA_PUBLISHABLE_KEY || "";

  try {
    const res = await fetch(`${baseUrl}/store/slider-cards`, {
      headers: {
        "x-publishable-api-key": publishableKey,
      },
    });
    if (res.ok) {
      const data = await res.json();
      return data.slider_cards || [];
    }
    console.error("Failed to fetch slider cards, status:", res.status);
  } catch (error) {
    console.error("Error fetching slider cards from backend:", error);
  }
  return [];
};
