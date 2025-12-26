const createDOMPurify = require('dompurify');
const { JSDOM } = require('jsdom');

const window = new JSDOM('').window;
const DOMPurify = createDOMPurify(window);

const sanitizeConfig = {
  ALLOWED_TAGS: [
    'b', 'i', 'em', 'strong', 'p', 'br', 'ul', 'ol', 'li',
    'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    'blockquote', 'a', 'img'
  ],
  ALLOWED_ATTR: ['href', 'src', 'alt', 'title', 'target'],
  ALLOWED_URI_REGEXP: /^(?:(?:(?:f|ht)tps?|mailto|tel|callto|cid|xmpp|xxx):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i
};

function sanitizeHtml(dirty) {
  return DOMPurify.sanitize(dirty, sanitizeConfig);
}

function sanitizeObject(obj) {
  if (typeof obj !== 'object' || obj === null) {
    return obj;
  }

  return Object.keys(obj).reduce((cleaned, key) => {
    const value = obj[key];
    
    if (typeof value === 'string') {
      cleaned[key] = sanitizeHtml(value);
    } else if (Array.isArray(value)) {
      cleaned[key] = value.map(item => 
        typeof item === 'string' ? sanitizeHtml(item) : sanitizeObject(item)
      );
    } else if (typeof value === 'object') {
      cleaned[key] = sanitizeObject(value);
    } else {
      cleaned[key] = value;
    }
    
    return cleaned;
  }, {});
}

module.exports = {
  sanitizeHtml,
  sanitizeObject
};