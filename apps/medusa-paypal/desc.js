import fetch from "node-fetch";              // npm install node-fetch
import { parseStringPromise } from "xml2js"; // npm install xml2js

const VCB_API =
  "https://portal.vietcombank.com.vn/Usercontrols/TVPortal.TyGia/pXML.aspx?b=10";

// Lấy dữ liệu XML từ Vietcombank → chuyển sang JSON
async function getVcbRates() {
  const res = await fetch(VCB_API);
  if (!res.ok) throw new Error("Failed to fetch VCB API");

  const xml = await res.text();
  const json = await parseStringPromise(xml, { explicitArray: false });
console.log(JSON.stringify(json, null, 2), 'json');
  return json;
}

// Lấy tỉ giá USD (Sell)
function getUsdSellRate(data) {
  const list = data.ExrateList.Exrate;
  const arr = Array.isArray(list) ? list : [list];

  const usd = arr.find((x) => x.$.CurrencyCode === "USD");
  if (!usd) throw new Error("USD rate not found");

  // Remove commas & convert to number
  const sellRate = parseFloat(usd.$.Sell.replace(/,/g, ""));

  return sellRate; // VND per 1 USD
}

// Convert VND → USD
async function convertVndToUsd(amountVnd) {
  const data = await getVcbRates();
  const sellRate = getUsdSellRate(data);

  const usd = amountVnd / sellRate;
  return usd;
}

// Example:
(async () => {
  const amount = 26412; // 1 triệu VND
  const usd = await convertVndToUsd(amount);
  console.log(`${amount} VND ≈ ${usd.toFixed(2)} USD`);
})();
