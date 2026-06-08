exports.handler = async function (event) {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: "Use POST." }),
    };
  }

  const apiBase = process.env.BRIDGE_API_BASE;
  const datasetId = process.env.BRIDGE_DEFAULT_DATASET_ID;
  const token = process.env.BRIDGE_SERVER_TOKEN;

  if (!token) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Missing BRIDGE_SERVER_TOKEN" }),
    };
  }

  const body = JSON.parse(event.body || "{}");
  const top = body.top || 10;
  const select = Array.isArray(body.select) ? body.select.join(",") : body.select;

  const params = new URLSearchParams();
  params.set("$top", String(top));
  if (select) params.set("$select", select);

  const url = `${apiBase}/${datasetId}/Property?${params.toString()}`;

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
  });

  const data = await response.text();

  return {
    statusCode: response.status,
    headers: { "Content-Type": "application/json" },
    body: data,
  };
};
