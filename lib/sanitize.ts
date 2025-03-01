import sanitizeHtml from 'sanitize-html';

// Default configuration for sanitization
const defaultOptions: sanitizeHtml.IOptions = {
  allowedTags: [
    'h1',
    'h2',
    'h3',
    'h4',
    'h5',
    'h6',
    'p',
    'br',
    'ul',
    'ol',
    'li',
    'b',
    'i',
    'strong',
    'em',
    'a',
    'pre',
    'code',
    'span',
  ],
  allowedAttributes: {
    a: ['href', 'target', 'rel'],
    code: ['class'],
    span: ['class'],
    p: ['style'],
  },
  allowedIframeHostnames: [],
  selfClosing: ['br'],
  allowProtocolRelative: false,
  allowedClasses: {
    '*': ['sanitize-html-ul', 'sanitize-html-ol', 'sanitize-html-link'],
  },
  transformTags: {
    ul: sanitizeHtml.simpleTransform('ul', { class: 'sanitize-html-ul' }),
    ol: sanitizeHtml.simpleTransform('ol', { class: 'sanitize-html-ol' }),
    a: sanitizeHtml.simpleTransform('a', { class: 'sanitize-html-link' }),
  },
};

export function sanitize(
  dirty: string,
  options?: sanitizeHtml.IOptions,
): string {
  const mergedOptions = {
    ...defaultOptions,
    ...options,
  };

  return sanitizeHtml(dirty, mergedOptions);
}

// Get only the text content from HTML
export function sanitizeToText(dirty: string): string {
  return sanitizeHtml(dirty, {
    ...defaultOptions,
    allowedTags: [], // Remove all HTML tags
    allowedAttributes: {}, // Remove all attributes
  });
}

// Example usage with custom options
export function sanitizeWithCustomOptions(
  dirty: string,
  customOptions: Partial<sanitizeHtml.IOptions>,
): string {
  return sanitize(dirty, {
    ...defaultOptions,
    ...customOptions,
  });
}
