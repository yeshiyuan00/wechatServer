import isomorphicFetch from 'isomorphic-fetch';
import URI from 'urijs';

// Remember to set SERVER_URL for deployment.
const SERVER_URL = process.env.IS_BROWSER ? '/admin/v1/admin' :
  'http://we.yeshiyuan.com';

function handelError(init, data) {
  return data.error || data;
}

function ensureAbsoluteUrl(input, stripPrefix) {
  if (typeof input !== 'string') return input;
  if (URI(input).is('absolute') || stripPrefix) return input;
  return URI(SERVER_URL + input).normalize().toString();
}

// Wrapper over isomorphicFetch making relative urls absolute. We don't want
// hardcode fetch urls since they are different when app is deployed or not.
export default async function fetch(input, init, stripPrefix) {
  input = ensureAbsoluteUrl(input, stripPrefix);
  console.log(input);
  try {
    const response = await isomorphicFetch(input, init);
    const contentType = response.headers.get('content-type') || '';
    if (contentType.indexOf('text/csv') > -1 || contentType.indexOf('excel') > -1) return response;
    if (response.status === 204) return response;
    if (response.status === 500 || response.status === 502) {
      throw handelError(init, {error: response.statusText});
    }
    const data = await response.json();
    if (data && data.error_code) {
      throw handelError(init, data);
    }
    return data;
  } catch (error) {
    throw error;
  }
}
