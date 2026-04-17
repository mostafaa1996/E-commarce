function stripHtml(html = '') {
  return String(html)
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function truncate(text = '', max = 160) {
  if (!text) return '';
  return text.length <= max ? text : text.slice(0, max - 1).trim() + '…';
}

module.exports = { stripHtml, truncate };
