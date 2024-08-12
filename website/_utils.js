/**
 * @param {string} path
 * @param {any} body
 * @returns {any}
 */
export async function send(path, body) {
  let response = await fetch(
    `/${path}`,
    {
      method: "POST",
      body: JSON.stringify(body),
      headers: {
        "X-Is-Custom": "true"
      }
    }
  );

  try {
    let obj = await response.json();
    let data = obj.data ?? null;
    return data;
  }
  catch {
    return null;
  }
};

export const query = Object.fromEntries(new URLSearchParams(location.search).entries());