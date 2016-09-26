import URI from 'urijs';
import fetch from './fetch';

let ie;
if (process.env.IS_BROWSER) {
  ie = require('component-ie');
}

const defaultOptions = {
  credentials: 'same-origin',
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }
};

const defaultQuery = {};

const post = (path, body, options = {}) => {
  path = URI(path).query(defaultQuery).toString();
  if (options.query || ie) {
    if (ie) {
      options.query = options.query || {};
      options.query._now = Date.now().toString();
    }
    path = URI(path).query({...options.query, ...defaultQuery}).toString();
    delete (options.query);
  }
  return fetch(path, {
    ...defaultOptions,
    ...options,
    ...{
      method: 'POST',
      body: JSON.stringify(body)
    }
  });
};

const get = (path, options = {}, stripPrefix) => {
  path = URI(path).query(defaultQuery).toString();
  if (options.query || ie) {
    if (ie) {
      options.query = options.query || {};
      options.query._now = Date.now().toString();
    }
    path = URI(path).query({...options.query, ...defaultQuery}).toString();
    delete (options.query);
  }
  return fetch(path, {
    ...defaultOptions,
    ...options,
    ...{
      method: 'GET'
    }
  }, stripPrefix);
};

const put = (path, body, options = {}) => {
  path = URI(path).query(defaultQuery).toString();
  if (options.query || ie) {
    if (ie) {
      options.query = options.query || {};
      options.query._now = Date.now().toString();
    }
    path = URI(path).query({...options.query, ...defaultQuery}).toString();
    delete (options.query);
  }
  return fetch(path, {
    ...defaultOptions,
    ...options,
    ...{
      method: 'PUT',
      body: JSON.stringify(body)
    }
  });
};

const del = (path, body, options = {}) => {
  path = URI(path).query(defaultQuery).toString();
  return fetch(path, {
    ...defaultOptions,
    ...options,
    ...{
      method: 'DELETE',
      body: JSON.stringify(body)
    }
  });
};

const patch = (path, body, options = {}) => {
  path = URI(path).query(defaultQuery).toString();
  return fetch(path, {
    ...defaultOptions,
    ...options,
    ...{
      method: 'PATCH',
      body: JSON.stringify(body)
    }
  });
};

export {post, get, put, del, patch};
