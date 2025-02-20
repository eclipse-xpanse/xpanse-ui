const scriptFilename = "OidcTrustedDomains.js";
const acceptAnyDomainToken = "*";
const TOKEN = {
  REFRESH_TOKEN: "REFRESH_TOKEN_SECURED_BY_OIDC_SERVICE_WORKER",
  ACCESS_TOKEN: "ACCESS_TOKEN_SECURED_BY_OIDC_SERVICE_WORKER",
  NONCE_TOKEN: "NONCE_SECURED_BY_OIDC_SERVICE_WORKER",
  CODE_VERIFIER: "CODE_VERIFIER_SECURED_BY_OIDC_SERVICE_WORKER"
};
const TokenRenewMode = {
  access_token_or_id_token_invalid: "access_token_or_id_token_invalid",
  access_token_invalid: "access_token_invalid",
  id_token_invalid: "id_token_invalid"
};
const openidWellknownUrlEndWith = "/.well-known/openid-configuration";
function strToUint8(str) {
  return new TextEncoder().encode(str);
}
function binToUrlBase64(bin) {
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+/g, "");
}
function utf8ToBinaryString(str) {
  const escstr = encodeURIComponent(str);
  return escstr.replace(/%([0-9A-F]{2})/g, function(match, p1) {
    return String.fromCharCode(parseInt(p1, 16));
  });
}
const uint8ToUrlBase64 = (uint8) => {
  let bin = "";
  uint8.forEach(function(code) {
    bin += String.fromCharCode(code);
  });
  return binToUrlBase64(bin);
};
function strToUrlBase64(str) {
  return binToUrlBase64(utf8ToBinaryString(str));
}
const defaultDemonstratingProofOfPossessionConfiguration = {
  importKeyAlgorithm: {
    name: "ECDSA",
    namedCurve: "P-256",
    hash: { name: "ES256" }
  },
  signAlgorithm: { name: "ECDSA", hash: { name: "SHA-256" } },
  generateKeyAlgorithm: {
    name: "ECDSA",
    namedCurve: "P-256"
  },
  digestAlgorithm: { name: "SHA-256" },
  jwtHeaderAlgorithm: "ES256"
};
const sign = (w) => async (jwk, headers, claims, demonstratingProofOfPossessionConfiguration, jwtHeaderType = "dpop+jwt") => {
  jwk = Object.assign({}, jwk);
  headers.typ = jwtHeaderType;
  headers.alg = demonstratingProofOfPossessionConfiguration.jwtHeaderAlgorithm;
  switch (headers.alg) {
    case "ES256":
      headers.jwk = { kty: jwk.kty, crv: jwk.crv, x: jwk.x, y: jwk.y };
      break;
    case "RS256":
      headers.jwk = { kty: jwk.kty, n: jwk.n, e: jwk.e, kid: headers.kid };
      break;
    default:
      throw new Error("Unknown or not implemented JWS algorithm");
  }
  const jws = {
    // @ts-ignore
    // JWT "headers" really means JWS "protected headers"
    protected: strToUrlBase64(JSON.stringify(headers)),
    // @ts-ignore
    // JWT "claims" are really a JSON-defined JWS "payload"
    payload: strToUrlBase64(JSON.stringify(claims))
  };
  const keyType = demonstratingProofOfPossessionConfiguration.importKeyAlgorithm;
  const exportable = true;
  const privileges = ["sign"];
  const privateKey = await w.crypto.subtle.importKey("jwk", jwk, keyType, exportable, privileges);
  const data = strToUint8(`${jws.protected}.${jws.payload}`);
  const signatureType = demonstratingProofOfPossessionConfiguration.signAlgorithm;
  const signature = await w.crypto.subtle.sign(signatureType, privateKey, data);
  jws.signature = uint8ToUrlBase64(new Uint8Array(signature));
  return `${jws.protected}.${jws.payload}.${jws.signature}`;
};
const JWT = { sign };
const generate = (w) => async (generateKeyAlgorithm) => {
  const keyType = generateKeyAlgorithm;
  const exportable = true;
  const privileges = ["sign", "verify"];
  const key = await w.crypto.subtle.generateKey(keyType, exportable, privileges);
  return await w.crypto.subtle.exportKey("jwk", key.privateKey);
};
const neuter = (jwk) => {
  const copy = Object.assign({}, jwk);
  delete copy.d;
  copy.key_ops = ["verify"];
  return copy;
};
const EC = {
  generate,
  neuter
};
const thumbprint = (w) => async (jwk, digestAlgorithm) => {
  let sortedPub;
  switch (jwk.kty) {
    case "EC":
      sortedPub = '{"crv":"CRV","kty":"EC","x":"X","y":"Y"}'.replace("CRV", jwk.crv).replace("X", jwk.x).replace("Y", jwk.y);
      break;
    case "RSA":
      sortedPub = '{"e":"E","kty":"RSA","n":"N"}'.replace("E", jwk.e).replace("N", jwk.n);
      break;
    default:
      throw new Error("Unknown or not implemented JWK type");
  }
  const hash = await w.crypto.subtle.digest(digestAlgorithm, strToUint8(sortedPub));
  return uint8ToUrlBase64(new Uint8Array(hash));
};
const JWK = { thumbprint };
const generateJwkAsync = (w) => async (generateKeyAlgorithm) => {
  const jwk = await EC.generate(w)(generateKeyAlgorithm);
  return jwk;
};
const generateJwtDemonstratingProofOfPossessionAsync = (w) => (demonstratingProofOfPossessionConfiguration) => async (jwk, method = "POST", url, extrasClaims = {}) => {
  const claims = {
    // https://www.rfc-editor.org/rfc/rfc9449.html#name-concept
    jti: btoa(guid()),
    htm: method,
    htu: url,
    iat: Math.round(Date.now() / 1e3),
    ...extrasClaims
  };
  const kid = await JWK.thumbprint(w)(
    jwk,
    demonstratingProofOfPossessionConfiguration.digestAlgorithm
  );
  const jwt = await JWT.sign(w)(
    jwk,
    { kid },
    claims,
    demonstratingProofOfPossessionConfiguration
  );
  return jwt;
};
const guid = () => {
  const guidHolder = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx";
  const hex = "0123456789abcdef";
  let r = 0;
  let guidResponse = "";
  for (let i = 0; i < 36; i++) {
    if (guidHolder[i] !== "-" && guidHolder[i] !== "4") {
      r = Math.random() * 16 | 0;
    }
    if (guidHolder[i] === "x") {
      guidResponse += hex[r];
    } else if (guidHolder[i] === "y") {
      r &= 3;
      r |= 8;
      guidResponse += hex[r];
    } else {
      guidResponse += guidHolder[i];
    }
  }
  return guidResponse;
};
function textEncodeLite(str) {
  const buf = new ArrayBuffer(str.length);
  const bufView = new Uint8Array(buf);
  for (let i = 0; i < str.length; i++) {
    bufView[i] = str.charCodeAt(i);
  }
  return bufView;
}
function base64urlOfHashOfASCIIEncodingAsync(code) {
  return new Promise((resolve, reject) => {
    crypto.subtle.digest("SHA-256", textEncodeLite(code)).then(
      (buffer) => {
        return resolve(uint8ToUrlBase64(new Uint8Array(buffer)));
      },
      (error) => reject(error)
    );
  });
}
const isDpop = (trustedDomain) => {
  if (Array.isArray(trustedDomain)) {
    return false;
  }
  return trustedDomain.demonstratingProofOfPossession ?? false;
};
const getDpopConfiguration = (trustedDomain) => {
  if (!isDpop(trustedDomain)) {
    return null;
  }
  if (Array.isArray(trustedDomain)) {
    return null;
  }
  return trustedDomain.demonstratingProofOfPossessionConfiguration ?? defaultDemonstratingProofOfPossessionConfiguration;
};
const getDpopOnlyWhenDpopHeaderPresent = (trustedDomain) => {
  if (!isDpop(trustedDomain)) {
    return null;
  }
  if (Array.isArray(trustedDomain)) {
    return null;
  }
  return trustedDomain.demonstratingProofOfPossessionOnlyWhenDpopHeaderPresent ?? true;
};
function normalizeUrl(url) {
  try {
    return new URL(url).toString();
  } catch (error) {
    console.error(`Failed to normalize url: ${url}`, error);
    return url;
  }
}
function checkDomain(domains, endpoint) {
  if (!endpoint) {
    return;
  }
  const domain = domains.find((domain2) => {
    var _a;
    let testable;
    if (typeof domain2 === "string") {
      testable = new RegExp(`^${domain2}`);
    } else {
      testable = domain2;
    }
    return (_a = testable.test) == null ? void 0 : _a.call(testable, endpoint);
  });
  if (!domain) {
    throw new Error(
      "Domain " + endpoint + " is not trusted, please add domain in " + scriptFilename
    );
  }
}
const getDomains = (trustedDomain, type) => {
  if (Array.isArray(trustedDomain)) {
    return trustedDomain;
  }
  return trustedDomain[`${type}Domains`] ?? trustedDomain.domains ?? [];
};
const getCurrentDatabaseDomain = (database2, url, trustedDomains2) => {
  var _a;
  if (url.endsWith(openidWellknownUrlEndWith)) {
    return null;
  }
  for (const [key, currentDatabase] of Object.entries(database2)) {
    const oidcServerConfiguration = currentDatabase.oidcServerConfiguration;
    if (!oidcServerConfiguration) {
      continue;
    }
    if (oidcServerConfiguration.tokenEndpoint && url === normalizeUrl(oidcServerConfiguration.tokenEndpoint)) {
      continue;
    }
    if (oidcServerConfiguration.revocationEndpoint && url === normalizeUrl(oidcServerConfiguration.revocationEndpoint)) {
      continue;
    }
    const trustedDomain = trustedDomains2 == null ? [] : trustedDomains2[key];
    const domains = getDomains(trustedDomain, "accessToken");
    const domainsToSendTokens = oidcServerConfiguration.userInfoEndpoint ? [normalizeUrl(oidcServerConfiguration.userInfoEndpoint), ...domains] : [...domains];
    let hasToSendToken = false;
    if (domainsToSendTokens.find((f) => f === acceptAnyDomainToken)) {
      hasToSendToken = true;
    } else {
      for (let i = 0; i < domainsToSendTokens.length; i++) {
        let domain = domainsToSendTokens[i];
        if (typeof domain === "string") {
          domain = new RegExp(`^${domain}`);
        }
        if ((_a = domain.test) == null ? void 0 : _a.call(domain, url)) {
          hasToSendToken = true;
          break;
        }
      }
    }
    if (hasToSendToken) {
      if (!currentDatabase.tokens) {
        return null;
      }
      return currentDatabase;
    }
  }
  return null;
};
function serializeHeaders(headers) {
  const headersObj = {};
  for (const key of headers.keys()) {
    if (headers.has(key)) {
      headersObj[key] = headers.get(key);
    }
  }
  return headersObj;
}
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
function countLetter(str, find) {
  return str.split(find).length - 1;
}
const parseJwt = (payload) => {
  return JSON.parse(b64DecodeUnicode(payload.replaceAll(/-/g, "+").replaceAll(/_/g, "/")));
};
function b64DecodeUnicode(str) {
  return decodeURIComponent(
    Array.prototype.map.call(atob(str), (c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2)).join("")
  );
}
function computeTimeLeft(refreshTimeBeforeTokensExpirationInSecond, expiresAt) {
  const currentTimeUnixSecond = (/* @__PURE__ */ new Date()).getTime() / 1e3;
  return Math.round(expiresAt - refreshTimeBeforeTokensExpirationInSecond - currentTimeUnixSecond);
}
function isTokensValid(tokens) {
  if (!tokens) {
    return false;
  }
  return computeTimeLeft(0, tokens.expiresAt) > 0;
}
const extractTokenPayload = (token) => {
  try {
    if (!token) {
      return null;
    }
    if (countLetter(token, ".") === 2) {
      return parseJwt(token.split(".")[1]);
    } else {
      return null;
    }
  } catch (e) {
    console.warn(e);
  }
  return null;
};
const isTokensOidcValid = (tokens, nonce, oidcServerConfiguration) => {
  if (tokens.idTokenPayload) {
    const idTokenPayload = tokens.idTokenPayload;
    if (idTokenPayload && oidcServerConfiguration.issuer !== idTokenPayload.iss) {
      return {
        isValid: false,
        reason: `Issuer does not match (oidcServerConfiguration issuer) ${oidcServerConfiguration.issuer} !== (idTokenPayload issuer) ${idTokenPayload.iss}`
      };
    }
    const currentTimeUnixSecond = (/* @__PURE__ */ new Date()).getTime() / 1e3;
    if (idTokenPayload && idTokenPayload.exp && idTokenPayload.exp < currentTimeUnixSecond) {
      return {
        isValid: false,
        reason: `Token expired at (idTokenPayload exp) ${idTokenPayload.exp} < (currentTimeUnixSecond) ${currentTimeUnixSecond}`
      };
    }
    const timeInSevenDays = 60 * 60 * 24 * 7;
    if (idTokenPayload && idTokenPayload.iat && idTokenPayload.iat + timeInSevenDays < currentTimeUnixSecond) {
      return {
        isValid: false,
        reason: `Token is used from too long time (idTokenPayload iat + timeInSevenDays) ${idTokenPayload.iat + timeInSevenDays} < (currentTimeUnixSecond) ${currentTimeUnixSecond}`
      };
    }
    if (idTokenPayload && nonce && idTokenPayload.nonce && idTokenPayload.nonce !== nonce) {
      return {
        isValid: false,
        reason: `Nonce does not match (nonce) ${nonce} !== (idTokenPayload nonce) ${idTokenPayload.nonce}`
      };
    }
  }
  return { isValid: true, reason: "" };
};
function extractedIssueAt(tokens, accessTokenPayload, _idTokenPayload) {
  if (!tokens.issued_at) {
    if (accessTokenPayload && accessTokenPayload.iat) {
      return accessTokenPayload.iat;
    } else if (_idTokenPayload && _idTokenPayload.iat) {
      return _idTokenPayload.iat;
    } else {
      const currentTimeUnixSecond = (/* @__PURE__ */ new Date()).getTime() / 1e3;
      return currentTimeUnixSecond;
    }
  } else if (typeof tokens.issued_at == "string") {
    return parseInt(tokens.issued_at, 10);
  }
  return tokens.issued_at;
}
function _hideTokens(tokens, currentDatabaseElement, configurationName, currentTabId) {
  var _a;
  if (!tokens.issued_at) {
    const currentTimeUnixSecond = (/* @__PURE__ */ new Date()).getTime() / 1e3;
    tokens.issued_at = currentTimeUnixSecond;
  } else if (typeof tokens.issued_at == "string") {
    tokens.issued_at = parseInt(tokens.issued_at, 10);
  }
  const accessTokenPayload = extractTokenPayload(tokens.access_token);
  const secureTokens = {
    ...tokens,
    accessTokenPayload
  };
  if (currentDatabaseElement.hideAccessToken) {
    secureTokens.access_token = TOKEN.ACCESS_TOKEN + "_" + configurationName + "_" + currentTabId;
  }
  tokens.accessTokenPayload = accessTokenPayload;
  const oldTokens = currentDatabaseElement.tokens;
  let id_token;
  if (oldTokens != null && "id_token" in oldTokens && !("id_token" in tokens)) {
    id_token = oldTokens.id_token;
  } else {
    id_token = tokens.id_token;
  }
  tokens.id_token = id_token;
  let _idTokenPayload = null;
  if (id_token) {
    _idTokenPayload = extractTokenPayload(id_token);
    tokens.idTokenPayload = _idTokenPayload != null ? { ..._idTokenPayload } : null;
    if (_idTokenPayload && _idTokenPayload.nonce && currentDatabaseElement.nonce != null) {
      const keyNonce = TOKEN.NONCE_TOKEN + "_" + currentDatabaseElement.configurationName + "_" + currentTabId;
      _idTokenPayload.nonce = keyNonce;
    }
    secureTokens.idTokenPayload = _idTokenPayload;
  }
  if (tokens.refresh_token) {
    secureTokens.refresh_token = TOKEN.REFRESH_TOKEN + "_" + configurationName + "_" + currentTabId;
  }
  tokens.issued_at = extractedIssueAt(tokens, accessTokenPayload, _idTokenPayload);
  const expireIn = typeof tokens.expires_in == "string" ? parseInt(tokens.expires_in, 10) : tokens.expires_in;
  const idTokenExpiresAt = _idTokenPayload && _idTokenPayload.exp ? _idTokenPayload.exp : Number.MAX_VALUE;
  const accessTokenExpiresAt = accessTokenPayload && accessTokenPayload.exp ? accessTokenPayload.exp : tokens.issued_at + expireIn;
  let expiresAt;
  const tokenRenewMode = currentDatabaseElement.oidcConfiguration.token_renew_mode;
  if (tokenRenewMode === TokenRenewMode.access_token_invalid) {
    expiresAt = accessTokenExpiresAt;
  } else if (tokenRenewMode === TokenRenewMode.id_token_invalid) {
    expiresAt = idTokenExpiresAt;
  } else {
    expiresAt = idTokenExpiresAt < accessTokenExpiresAt ? idTokenExpiresAt : accessTokenExpiresAt;
  }
  secureTokens.expiresAt = expiresAt;
  tokens.expiresAt = expiresAt;
  const nonce = currentDatabaseElement.nonce[currentTabId] ? (_a = currentDatabaseElement.nonce[currentTabId]) == null ? void 0 : _a.nonce : null;
  const { isValid, reason } = isTokensOidcValid(
    tokens,
    nonce,
    currentDatabaseElement.oidcServerConfiguration
  );
  if (!isValid) {
    throw Error(`Tokens are not OpenID valid, reason: ${reason}`);
  }
  if (oldTokens != null && "refresh_token" in oldTokens && !("refresh_token" in tokens)) {
    const refreshToken = oldTokens.refresh_token;
    currentDatabaseElement.tokens = {
      ...tokens,
      refresh_token: refreshToken
    };
  } else {
    currentDatabaseElement.tokens = tokens;
  }
  currentDatabaseElement.status = "LOGGED_IN";
  return secureTokens;
}
const demonstratingProofOfPossessionNonceResponseHeader = "DPoP-Nonce";
function hideTokens(currentDatabaseElement, currentTabId) {
  const configurationName = currentDatabaseElement.configurationName;
  return (response) => {
    if (response.status !== 200) {
      return response;
    }
    const newHeaders = new Headers(response.headers);
    if (response.headers.has(demonstratingProofOfPossessionNonceResponseHeader)) {
      currentDatabaseElement.demonstratingProofOfPossessionNonce = response.headers.get(
        demonstratingProofOfPossessionNonceResponseHeader
      );
      newHeaders.delete(demonstratingProofOfPossessionNonceResponseHeader);
    }
    return response.json().then((tokens) => {
      const secureTokens = _hideTokens(
        tokens,
        currentDatabaseElement,
        configurationName,
        currentTabId
      );
      const body = JSON.stringify(secureTokens);
      return new Response(body, {
        status: response.status,
        statusText: response.statusText,
        headers: newHeaders
      });
    });
  };
}
const getMatchingOidcConfigurations = (database2, url) => {
  return Object.values(database2).filter((config) => {
    const { oidcServerConfiguration } = config || {};
    const { tokenEndpoint, revocationEndpoint } = oidcServerConfiguration || {};
    const normalizedUrl = normalizeUrl(url);
    return tokenEndpoint && normalizedUrl.startsWith(normalizeUrl(tokenEndpoint)) || revocationEndpoint && normalizedUrl.startsWith(normalizeUrl(revocationEndpoint));
  });
};
function replaceCodeVerifier(codeVerifier, newCodeVerifier) {
  const regex = /code_verifier=[A-Za-z0-9_-]+/i;
  return codeVerifier.replace(regex, `code_verifier=${newCodeVerifier}`);
}
const extractConfigurationNameFromCodeVerifier = (chaine) => {
  const regex = /CODE_VERIFIER_SECURED_BY_OIDC_SERVICE_WORKER_([^&\s]+)_([^&\s]+)/;
  const result = chaine.match(regex);
  if (result && result.length > 2) {
    return [result[1], result[2]];
  } else {
    return null;
  }
};
const version = "7.25.3";
if (typeof trustedTypes !== "undefined" && typeof trustedTypes.createPolicy == "function") {
  trustedTypes.createPolicy("default", {
    createScriptURL: function(url) {
      if (url == scriptFilename) {
        return url;
      } else {
        throw new Error("Untrusted script URL blocked: " + url);
      }
    }
  });
}
const _self = self;
_self.importScripts(scriptFilename);
const id = Math.round((/* @__PURE__ */ new Date()).getTime() / 1e3).toString();
const keepAliveJsonFilename = "OidcKeepAliveServiceWorker.json";
const handleInstall = (event) => {
  console.log("[OidcServiceWorker] service worker installed " + id);
  event.waitUntil(_self.skipWaiting());
};
const handleActivate = (event) => {
  console.log("[OidcServiceWorker] service worker activated " + id);
  event.waitUntil(_self.clients.claim());
};
const database = {};
const keepAliveAsync = async (event) => {
  const originalRequest = event.request;
  const isFromVanilla = originalRequest.headers.has("oidc-vanilla");
  const init = { status: 200, statusText: "oidc-service-worker" };
  const response = new Response("{}", init);
  if (!isFromVanilla) {
    const originalRequestUrl = new URL(originalRequest.url);
    const minSleepSeconds = Number(originalRequestUrl.searchParams.get("minSleepSeconds")) || 240;
    for (let i = 0; i < minSleepSeconds; i++) {
      await sleep(1e3 + Math.floor(Math.random() * 1e3));
      const cache = await caches.open("oidc_dummy_cache");
      await cache.put(event.request, response.clone());
    }
  }
  return response;
};
async function generateDpopAsync(originalRequest, currentDatabase, url, extrasClaims = {}) {
  const headersExtras = serializeHeaders(originalRequest.headers);
  if ((currentDatabase == null ? void 0 : currentDatabase.demonstratingProofOfPossessionConfiguration) && currentDatabase.demonstratingProofOfPossessionJwkJson && (!currentDatabase.demonstratingProofOfPossessionOnlyWhenDpopHeaderPresent || currentDatabase.demonstratingProofOfPossessionOnlyWhenDpopHeaderPresent && headersExtras["dpop"])) {
    const dpopConfiguration = currentDatabase.demonstratingProofOfPossessionConfiguration;
    const jwk = currentDatabase.demonstratingProofOfPossessionJwkJson;
    const method = originalRequest.method;
    const dpop = await generateJwtDemonstratingProofOfPossessionAsync(self)(dpopConfiguration)(
      jwk,
      method,
      url,
      extrasClaims
    );
    headersExtras["dpop"] = dpop;
    if (currentDatabase.demonstratingProofOfPossessionNonce != null) {
      headersExtras["nonce"] = currentDatabase.demonstratingProofOfPossessionNonce;
    }
  }
  return headersExtras;
}
const handleFetch = async (event) => {
  var _a;
  const originalRequest = event.request;
  const url = normalizeUrl(originalRequest.url);
  if (url.includes(keepAliveJsonFilename)) {
    event.respondWith(keepAliveAsync(event));
    return;
  }
  const currentDatabaseForRequestAccessToken = getCurrentDatabaseDomain(
    database,
    url,
    trustedDomains
  );
  if ((_a = currentDatabaseForRequestAccessToken == null ? void 0 : currentDatabaseForRequestAccessToken.tokens) == null ? void 0 : _a.access_token) {
    while (currentDatabaseForRequestAccessToken.tokens && !isTokensValid(currentDatabaseForRequestAccessToken.tokens)) {
      await sleep(200);
    }
    let requestMode = originalRequest.mode;
    if (originalRequest.mode !== "navigate" && currentDatabaseForRequestAccessToken.convertAllRequestsToCorsExceptNavigate) {
      requestMode = "cors";
    }
    let headers;
    if (originalRequest.mode == "navigate" && !currentDatabaseForRequestAccessToken.setAccessTokenToNavigateRequests) {
      headers = {
        ...serializeHeaders(originalRequest.headers)
      };
    } else {
      const authorization = originalRequest.headers.get("authorization");
      let authenticationMode = "Bearer";
      if (authorization) {
        authenticationMode = authorization.split(" ")[0];
      }
      if (authenticationMode.toLowerCase() == "dpop") {
        const claimsExtras = {
          ath: await base64urlOfHashOfASCIIEncodingAsync(
            currentDatabaseForRequestAccessToken.tokens.access_token
          )
        };
        const dpopHeaders = await generateDpopAsync(
          originalRequest,
          currentDatabaseForRequestAccessToken,
          url,
          claimsExtras
        );
        headers = {
          ...dpopHeaders,
          authorization: authenticationMode + " " + currentDatabaseForRequestAccessToken.tokens.access_token
        };
      } else {
        headers = {
          ...serializeHeaders(originalRequest.headers),
          authorization: authenticationMode + " " + currentDatabaseForRequestAccessToken.tokens.access_token
        };
      }
    }
    let init;
    if (originalRequest.mode === "navigate") {
      init = {
        headers
      };
    } else {
      init = {
        headers,
        mode: requestMode
      };
    }
    const newRequest = new Request(originalRequest, init);
    event.respondWith(fetch(newRequest));
    return;
  }
  if (event.request.method !== "POST") {
    return;
  }
  let currentDatabase = null;
  let currentTabId = null;
  const currentDatabases = getMatchingOidcConfigurations(database, url);
  const numberDatabase = currentDatabases.length;
  if (numberDatabase > 0) {
    const maPromesse = new Promise((resolve, reject) => {
      const clonedRequest = originalRequest.clone();
      const response = clonedRequest.text().then(async (actualBody) => {
        var _a2;
        if (actualBody.includes(TOKEN.REFRESH_TOKEN) || actualBody.includes(TOKEN.ACCESS_TOKEN)) {
          let headers = serializeHeaders(originalRequest.headers);
          let newBody = actualBody;
          for (let i = 0; i < numberDatabase; i++) {
            const currentDb = currentDatabases[i];
            const currentDbTabs = currentDb.tabIds;
            if ((currentDb == null ? void 0 : currentDb.tokens) != null) {
              const claimsExtras = {
                ath: await base64urlOfHashOfASCIIEncodingAsync(currentDb.tokens.access_token)
              };
              headers = await generateDpopAsync(originalRequest, currentDb, url, claimsExtras);
              for (let j = 0; j < currentDbTabs.length; j++) {
                const keyRefreshToken = TOKEN.REFRESH_TOKEN + "_" + currentDb.configurationName + "_" + currentDbTabs[j];
                if (actualBody.includes(keyRefreshToken)) {
                  newBody = newBody.replace(
                    keyRefreshToken,
                    encodeURIComponent(currentDb.tokens.refresh_token)
                  );
                  currentDatabase = currentDb;
                  currentTabId = currentDbTabs[j];
                  break;
                }
                const keyAccessToken = TOKEN.ACCESS_TOKEN + "_" + currentDb.configurationName + "_" + currentDbTabs[j];
                if (actualBody.includes(keyAccessToken)) {
                  newBody = newBody.replace(
                    keyAccessToken,
                    encodeURIComponent(currentDb.tokens.access_token)
                  );
                  currentDatabase = currentDb;
                  currentTabId = currentDbTabs[j];
                  break;
                }
              }
              if (currentTabId) {
                break;
              }
            }
          }
          const fetchPromise = fetch(originalRequest, {
            body: newBody,
            method: clonedRequest.method,
            headers: {
              ...headers
            },
            mode: clonedRequest.mode,
            cache: clonedRequest.cache,
            redirect: clonedRequest.redirect,
            referrer: clonedRequest.referrer,
            credentials: clonedRequest.credentials,
            integrity: clonedRequest.integrity
          });
          if (((_a2 = currentDatabase == null ? void 0 : currentDatabase.oidcServerConfiguration) == null ? void 0 : _a2.revocationEndpoint) && url.startsWith(normalizeUrl(currentDatabase.oidcServerConfiguration.revocationEndpoint))) {
            return fetchPromise.then(async (response2) => {
              const text = await response2.text();
              return new Response(text, response2);
            });
          }
          return fetchPromise.then(
            hideTokens(currentDatabase, currentTabId)
          );
        } else if (actualBody.includes("code_verifier=") && extractConfigurationNameFromCodeVerifier(actualBody) != null) {
          const [currentLoginCallbackConfigurationName, currentLoginCallbackTabId] = extractConfigurationNameFromCodeVerifier(actualBody) ?? [];
          currentDatabase = database[currentLoginCallbackConfigurationName];
          let newBody = actualBody;
          const codeVerifier = currentDatabase.codeVerifier[currentLoginCallbackTabId];
          if (codeVerifier != null) {
            newBody = replaceCodeVerifier(newBody, codeVerifier);
          }
          const headersExtras = await generateDpopAsync(originalRequest, currentDatabase, url);
          return fetch(originalRequest, {
            body: newBody,
            method: clonedRequest.method,
            headers: {
              ...headersExtras
            },
            mode: clonedRequest.mode,
            cache: clonedRequest.cache,
            redirect: clonedRequest.redirect,
            referrer: clonedRequest.referrer,
            credentials: clonedRequest.credentials,
            integrity: clonedRequest.integrity
          }).then(hideTokens(currentDatabase, currentLoginCallbackTabId));
        }
        return fetch(originalRequest, {
          body: actualBody,
          method: clonedRequest.method,
          headers: {
            ...serializeHeaders(originalRequest.headers)
          },
          mode: clonedRequest.mode,
          cache: clonedRequest.cache,
          redirect: clonedRequest.redirect,
          referrer: clonedRequest.referrer,
          credentials: clonedRequest.credentials,
          integrity: clonedRequest.integrity
        });
      });
      response.then((r) => {
        resolve(r);
      }).catch((err) => {
        reject(err);
      });
    });
    event.respondWith(maPromesse);
  }
};
const handleMessage = async (event) => {
  var _a;
  const port = event.ports[0];
  const data = event.data;
  if (event.data.type === "claim") {
    _self.clients.claim().then(() => port.postMessage({}));
    return;
  }
  const configurationName = data.configurationName;
  let currentDatabase = database[configurationName];
  if (trustedDomains == null) {
    trustedDomains = {};
  }
  if (!currentDatabase) {
    const trustedDomain = trustedDomains[configurationName];
    const showAccessToken = Array.isArray(trustedDomain) ? false : trustedDomain.showAccessToken;
    const doNotSetAccessTokenToNavigateRequests = Array.isArray(trustedDomain) ? true : trustedDomain.setAccessTokenToNavigateRequests;
    const convertAllRequestsToCorsExceptNavigate = Array.isArray(trustedDomain) ? false : trustedDomain.convertAllRequestsToCorsExceptNavigate;
    const allowMultiTabLogin = Array.isArray(trustedDomain) ? false : trustedDomain.allowMultiTabLogin;
    database[configurationName] = {
      tokens: null,
      tabIds: [],
      state: {},
      codeVerifier: {},
      oidcServerConfiguration: null,
      oidcConfiguration: void 0,
      nonce: {},
      status: null,
      configurationName,
      hideAccessToken: !showAccessToken,
      setAccessTokenToNavigateRequests: doNotSetAccessTokenToNavigateRequests ?? true,
      convertAllRequestsToCorsExceptNavigate: convertAllRequestsToCorsExceptNavigate ?? false,
      demonstratingProofOfPossessionNonce: null,
      demonstratingProofOfPossessionJwkJson: null,
      demonstratingProofOfPossessionConfiguration: null,
      demonstratingProofOfPossessionOnlyWhenDpopHeaderPresent: false,
      allowMultiTabLogin: allowMultiTabLogin ?? false
    };
    currentDatabase = database[configurationName];
    if (!trustedDomains[configurationName]) {
      trustedDomains[configurationName] = [];
    }
  }
  const tabId = currentDatabase.allowMultiTabLogin ? data.tabId : "default";
  switch (data.type) {
    case "clear":
      currentDatabase.tokens = null;
      currentDatabase.tabIds = currentDatabase.tabIds.filter((id2) => id2 !== tabId);
      delete currentDatabase.state[tabId];
      delete currentDatabase.codeVerifier[tabId];
      delete currentDatabase.nonce[tabId];
      currentDatabase.demonstratingProofOfPossessionNonce = null;
      currentDatabase.demonstratingProofOfPossessionJwkJson = null;
      currentDatabase.demonstratingProofOfPossessionConfiguration = null;
      currentDatabase.demonstratingProofOfPossessionOnlyWhenDpopHeaderPresent = false;
      currentDatabase.status = data.data.status;
      port.postMessage({ configurationName });
      return;
    case "init": {
      const oidcServerConfiguration = data.data.oidcServerConfiguration;
      const trustedDomain = trustedDomains[configurationName];
      const domains = getDomains(trustedDomain, "oidc");
      if (!domains.some((domain) => domain === acceptAnyDomainToken)) {
        [
          oidcServerConfiguration.tokenEndpoint,
          oidcServerConfiguration.revocationEndpoint,
          oidcServerConfiguration.userInfoEndpoint,
          oidcServerConfiguration.issuer
        ].forEach((url) => {
          checkDomain(domains, url);
        });
      }
      currentDatabase.oidcServerConfiguration = oidcServerConfiguration;
      currentDatabase.oidcConfiguration = data.data.oidcConfiguration;
      if (!currentDatabase.tabIds.includes(tabId)) {
        currentDatabase.tabIds.push(tabId);
      }
      if (currentDatabase.demonstratingProofOfPossessionConfiguration == null) {
        const demonstratingProofOfPossessionConfiguration = getDpopConfiguration(
          trustedDomains[configurationName]
        );
        if (demonstratingProofOfPossessionConfiguration != null) {
          if (currentDatabase.oidcConfiguration.demonstrating_proof_of_possession) {
            console.warn(
              "In service worker, demonstrating_proof_of_possession must be configured from trustedDomains file"
            );
          }
          currentDatabase.demonstratingProofOfPossessionConfiguration = demonstratingProofOfPossessionConfiguration;
          currentDatabase.demonstratingProofOfPossessionJwkJson = await generateJwkAsync(self)(
            demonstratingProofOfPossessionConfiguration.generateKeyAlgorithm
          );
          currentDatabase.demonstratingProofOfPossessionOnlyWhenDpopHeaderPresent = getDpopOnlyWhenDpopHeaderPresent(trustedDomains[configurationName]) ?? false;
        }
      }
      if (!currentDatabase.tokens) {
        port.postMessage({
          tokens: null,
          status: currentDatabase.status,
          configurationName,
          version
        });
      } else {
        const tokens = {
          ...currentDatabase.tokens
        };
        if (currentDatabase.hideAccessToken) {
          tokens.access_token = TOKEN.ACCESS_TOKEN + "_" + configurationName + "_" + tabId;
        }
        if (tokens.refresh_token) {
          tokens.refresh_token = TOKEN.REFRESH_TOKEN + "_" + configurationName + "_" + tabId;
        }
        if (((_a = tokens == null ? void 0 : tokens.idTokenPayload) == null ? void 0 : _a.nonce) && currentDatabase.nonce != null) {
          tokens.idTokenPayload.nonce = TOKEN.NONCE_TOKEN + "_" + configurationName + "_" + tabId;
        }
        port.postMessage({
          tokens,
          status: currentDatabase.status,
          configurationName,
          version
        });
      }
      return;
    }
    case "setDemonstratingProofOfPossessionNonce": {
      currentDatabase.demonstratingProofOfPossessionNonce = data.data.demonstratingProofOfPossessionNonce;
      port.postMessage({ configurationName });
      return;
    }
    case "getDemonstratingProofOfPossessionNonce": {
      const demonstratingProofOfPossessionNonce = currentDatabase.demonstratingProofOfPossessionNonce;
      port.postMessage({
        configurationName,
        demonstratingProofOfPossessionNonce
      });
      return;
    }
    case "setState": {
      currentDatabase.state[tabId] = data.data.state;
      port.postMessage({ configurationName });
      return;
    }
    case "getState": {
      const state = currentDatabase.state[tabId];
      port.postMessage({ configurationName, state });
      return;
    }
    case "setCodeVerifier": {
      currentDatabase.codeVerifier[tabId] = data.data.codeVerifier;
      port.postMessage({ configurationName });
      return;
    }
    case "getCodeVerifier": {
      port.postMessage({
        configurationName,
        codeVerifier: currentDatabase.codeVerifier != null ? TOKEN.CODE_VERIFIER + "_" + configurationName + "_" + tabId : null
      });
      return;
    }
    case "setSessionState": {
      currentDatabase.sessionState = data.data.sessionState;
      port.postMessage({ configurationName });
      return;
    }
    case "getSessionState": {
      const sessionState = currentDatabase.sessionState;
      port.postMessage({ configurationName, sessionState });
      return;
    }
    case "setNonce": {
      const nonce = data.data.nonce;
      if (nonce) {
        currentDatabase.nonce[tabId] = nonce;
      }
      port.postMessage({ configurationName });
      return;
    }
    case "getNonce": {
      const keyNonce = TOKEN.NONCE_TOKEN + "_" + configurationName + "_" + tabId;
      const nonce = currentDatabase.nonce ? keyNonce : null;
      port.postMessage({ configurationName, nonce });
      return;
    }
    default: {
      return;
    }
  }
};
_self.addEventListener("install", handleInstall);
_self.addEventListener("activate", handleActivate);
_self.addEventListener("fetch", handleFetch);
_self.addEventListener("message", handleMessage);
//# sourceMappingURL=OidcServiceWorker.js.map
