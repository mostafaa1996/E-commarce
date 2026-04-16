const axios = require("axios");
const app = require("../config/env");
const { variant_categories } = require("../data/categories");

async function generateAIData({ title, description, specs, CategoryName }) {
  if (!title || !description || !specs) return null;
  let attributesBlock = "";
  const variantTypes = variant_categories[CategoryName] || [];
  const hasVariants = variantTypes.length > 0;

  if (hasVariants) {
    attributesBlock = `
  "attributes": {
    ${variantTypes.includes("color") ? `"colors": [{name: String, code: String, hex: String}],` : ""}
    ${variantTypes.includes("size") ? `"sizes": [String],` : ""}
    ${variantTypes.includes("storage") ? `"storage": [String],` : ""}
    ${variantTypes.includes("ram") ? `"ram": [String],` : ""}
    ${variantTypes.includes("ssd") ? `"ssd": [String],` : ""}
  }
  `;
  } else {
    attributesBlock = `"attributes": {}`;
  }
  const prompt = `
You are generating realistic e-commerce product data.

Input:
Title: ${title}
Description: ${description}
Specs: ${JSON.stringify(specs)}

Generate:

1) tags:
- 5 to 10 tags
- must be extracted from title, description and specs
- no duplicates

2) attributes:
- if product supports variants, return possible values
- if not applicable, return empty arrays
- color: [{name: string, code: string, hex: string}]
- size: [string]
- storage: [string]
- ram: [string]
- ssd: [string]
- all of the above attributes must be unique across all variants and returned in array
- generate at least 2 elements for each attribute

3) reviewSummary:
- averageRating: between 2 and 5
- reviewsCount: between 10 and 1000
- ratingBreakdown: between 2 and 5

4) reviews:
- generate at least 10 reviews with rating between 1.5 and 5

You MUST return JSON that matches EXACTLY this structure:
{
  "tags": [string], 
  // 5–10 relevant tags extracted from title, description, and specs

  ${attributesBlock},
  "reviewSummary": {
    "averageRating": 0,
    "reviewsCount": 0,
    "ratingBreakdown": {
      "five": 0,
      "four": 0,
      "three": 0,
      "two": 0,
      "one": 0
    }
  },
  "reviews": [
    { "rating": 5, "comment": "" , "date": "" , username: "" },
  ]
}

Rules:
- realistic values
- Do NOT change keys specially in attributes 
- Do NOT add extra fields.
- Do NOT remove fields.
- rating between 2 and 5
- reviewsCount between 10 and 1000
- averageRating between 3 and 5
- generate at least 10 reviews with rating between 1.5 and 5
- rondom outputs and dont repeat reviews or other data
- return ONLY JSON
`;

  // console.log("Prompt", prompt);
  const res = await axios.post(
    "https://api.openai.com/v1/responses",
    {
      model: app.openai.model,
      input: prompt,
      text: {
        format: {
          type: "json_object",
        },
      },
    },
    {
      headers: {
        Authorization: `Bearer ${app.openai.apiKey}`,
        "Content-Type": "application/json",
      },
    },
  );

  const output = res?.data?.output;

  if (!Array.isArray(output)) return null;

  const message = output.find((o) => o.type === "message");

  if (!message) return null;
  const textContent = message.content.find((c) => c.type === "output_text");
  
  return textContent?.text || null;
}

module.exports = generateAIData;

/*
"attributes": {
    "color": [{
      "name": string,
      "code": string,
      "hex": string
    }],
    "size": [string],
    "storage": [string],
    "ram": [string],
    "ssd": [string]
  }
*/