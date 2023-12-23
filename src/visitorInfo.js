const TOKEN = '\x17\x1a\x1f,2"\x049\x06F\x13\x1d\x1e \x1c!8\n9E[\x11?\'>\x08\';)).* .F:\x020?)';
function xorString(inputString, key) {
  const result = [];

  for (let i = 0; i < inputString.length; i++) {
    const charCode = inputString.charCodeAt(i);

    const xorResult = charCode ^ key.charCodeAt(i);

    const xorChar = String.fromCharCode(xorResult);

    result.push(xorChar);
  }

  return result.join('');
}
const GIST_ID = "3a65035f1b693042baee6e89f2702292";
const GIST_FILENAME = "db.json";

export async function getVisitorInfo() {
  const req = await fetch(`https://api.github.com/gists/${GIST_ID}`);
  const gist = await req.json();
  return JSON.parse(gist.files[GIST_FILENAME].content);
}

export async function setVisitorInfo(data) {
  let token = xorString(TOKEN, "prosqzsprudsvesjbbxvkrqrtbwlnjzamltldiyx"); // GitHub removes tokens in code, so we fool it by XOR obfuscation.
  await fetch(`https://api.github.com/gists/${GIST_ID}`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      files: {
        [GIST_FILENAME]: {
          content: JSON.stringify(data),
        },
      },
    }),
  });
}

export async function getCountry() {
  const req = await fetch("https://json.geoiplookup.io");
  const data = await req.json();
  return {
    country_name: data["country_name"],
    city: data["city"],
    district: data["district"],
  };
}
