// npm install axios cheerio
import fs from "fs";
import path from "path";
import axios from "axios";
import * as cheerio from "cheerio";

async function fetchModels() {
  const { data: html } = await axios.get("https://ollama.com/library");
  const $ = cheerio.load(html);

  const MODELS: Record<string, string[]> = {};

  // Each <li x-test-model> is one model
  $("li[x-test-model]").each((_, li) => {
    const $li = $(li);
    // slug from the title attribute on the model-title container
    const slug = $li.find("[x-test-model-title]").attr("title")?.trim();

    if (!slug) {
      return;
    }

    // try to get all size tags first
    const sizes = $li
      .find("[x-test-size]")
      .map((_, el) => $(el).text().trim())
      .get();

    // if no sizes, fallback to capabilities
    const entries =
      sizes.length > 0
        ? sizes
        : $li
            .find("[x-test-capability]")
            .map((_, el) => $(el).text().trim())
            .get();

    MODELS[slug] = entries;
  });

  return MODELS;
}

(async () => {
  const models = await fetchModels();
  const content =
    "export const MODELS = " +
    JSON.stringify(models, null, 2) +
    ";\n\n" +
    "export const RECOMMENDED_MODELS = Object.entries(MODELS)\n" +
    "  .map(([name, variants]) => variants.map((variant) => " +
    "`${name}:${variant}`" +
    "))\n" +
    "  .flat();\n";

  const targetPath = path.join(process.cwd(), "src", "constants", "models.ts");
  fs.writeFileSync(targetPath, content);

  console.log(`✅ Models updated at ${targetPath}`);
})();
