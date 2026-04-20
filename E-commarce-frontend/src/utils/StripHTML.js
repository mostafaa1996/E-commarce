export function extractProductDescription(raw = "") {
  const text = raw
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;|&amp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  const startMatch =
    text.match(/Product Description\s*Description\s*/i) ||
    text.match(/Product Description\s*/i) ||
    text.match(/Description\s*/i);

  if (!startMatch) {
    return {
      intro: text,
      bullets: [],
    };
  }

  const startIndex = startMatch.index + startMatch[0].length;
  let cleaned = text.slice(startIndex).trim();

  const endMarkers = [
    /Contact Us/i,
    /People Who Viewed/i,
    /If you have some inquires/i,
    /Thank you/i,
    /Package includes/i,
  ];

  let endIndex = cleaned.length;
  for (const marker of endMarkers) {
    const match = cleaned.match(marker);
    if (match && match.index < endIndex) {
      endIndex = match.index;
    }
  }

  cleaned = cleaned.slice(0, endIndex).trim();

  const featuresMatch = cleaned.match(/Features\s*[-:]\s*(.*)/i);

  if (!featuresMatch) {
    return {
      intro: cleaned,
      bullets: [],
    };
  }

  const intro = cleaned.slice(0, featuresMatch.index).trim();
  const featuresText = featuresMatch[1].trim();

  const bullets = featuresText
    .split(/\s*-\s*/g)
    .map((item) => item.trim())
    .filter(Boolean);

  return { intro, bullets };
}