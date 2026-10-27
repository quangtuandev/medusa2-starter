import type { ActionFunctionArgs } from "react-router";

export const action = async ({ request }: ActionFunctionArgs) => {
  if (request.method !== "POST") {
    return Response.json(
      { success: false, message: "Method not allowed" },
      { status: 405 }
    );
  }

  const baseUrl =
    process.env.INTERNAL_MEDUSA_API_URL ||
    process.env.PUBLIC_MEDUSA_API_URL ||
    "http://localhost:7901";
  const publishableKey = process.env.MEDUSA_PUBLISHABLE_KEY || "";

  let body: { name?: string; email?: string; message?: string };
  const contentType = request.headers.get("content-type") || "";

  if (contentType.includes("application/json")) {
    body = await request.json();
  } else {
    const formData = await request.formData();
    body = {
      name: formData.get("name")?.toString() || "",
      email: formData.get("email")?.toString() || "",
      message: formData.get("message")?.toString() || "",
    };
  }

  try {
    const res = await fetch(`${baseUrl}/store/contact`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(publishableKey ? { "x-publishable-api-key": publishableKey } : {}),
      },
      body: JSON.stringify(body),
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      return Response.json(
        {
          success: false,
          message: data.message || "Không thể gửi tin nhắn liên hệ",
          errors: data.errors,
        },
        { status: res.status }
      );
    }

    return Response.json(data, { status: 200 });
  } catch (err: any) {
    console.error("Failed to forward contact request to Medusa:", err);
    return Response.json(
      {
        success: false,
        message: err.message || "Lỗi kết nối máy chủ khi gửi liên hệ",
      },
      { status: 500 }
    );
  }
};
