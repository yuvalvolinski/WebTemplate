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

  let obj = await response.json();
  let data = obj.data ?? null;
  return data;
};

export const cookies = {
  /**
   * @param {string} name 
   * @returns {string | null}
  */
  get: function (name) {
    let cookieStrs = document.cookie.split("; ");

    for (let cookieStr of cookieStrs) {
      let parts = cookieStr.split("=");

      if (parts[0] == name) {
        return parts[1];
      }
    }

    return null;
  },

  /**
   * @param {string} name 
   * @param {string} value 
   */
  set: function (name, value) {
    document.cookie = `${name}=${value}`;
  },

  /**
   * @param {string} name 
   */
  remove: function (name) {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC;`;
  }
};

export const query = Object.fromEntries(new URLSearchParams(location.search).entries());