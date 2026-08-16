import { expect, test } from "@playwright/test";
import { writeFile } from "node:fs/promises";

const figmaSections = [
  { selector: ".hero", y: 0, height: 784 },
  { selector: [".cards", ".path"], y: 824, height: 1174 },
  { selector: ".talent", y: 2038, height: 1240 },
  { selector: ".counters", y: 3318, height: 473 },
  { selector: ".results", y: 3831, height: 1323 },
  { selector: ".students", y: 5194, height: 1089 },
  { selector: ".experts", y: 6323, height: 1583 },
  { selector: [".home-professors", ".home-figure"], y: 7946, height: 1827 },
  { selector: ".formats", y: 9813, height: 885 },
  { selector: ".approach", y: 10738, height: 719 },
  { selector: ".partners", y: 11497, height: 1063 },
  { selector: ".faq", y: 12600, height: 549 },
  { selector: ".parallax-bg", y: 13189, height: 920 },
  { selector: ".footer", y: 14109, height: 1520 },
];

const figmaElements = [
  { selector: ".hero__image", x: 8, y: 8, width: 344, height: 280 },
  { selector: ".hero__cardwrapper", x: 8, y: 296, width: 344, height: 488 },
  { selector: ".hero__crystal", x: 100, y: 544, width: 150, height: 120 },
  { selector: ".hero__button", x: 24, y: 724, width: 312, height: 44 },
  { selector: ".talent__title", x: 24, y: 70, width: 312, height: 75 },
  { selector: ".talent__image", x: 8, y: 187, width: 344, height: 708 },
  { selector: ".counters__container", x: 24, y: 60, width: 312, height: 353 },
  { selector: ".results__title", x: 24, y: 20, width: 312, height: 72 },
  { selector: ".results__body", x: 24, y: 152, width: 312, height: 710 },
  { selector: ".results__image", x: 8, y: 922, width: 344, height: 299 },
  { selector: ".slide-students__title", x: 24, y: 159, width: 312, height: 72 },
  { selector: ".experts__item", x: 16, y: 209, width: 328, height: 412 },
  { selector: ".experts__image", x: 24, y: 217, width: 312, height: 200 },
  { selector: ".home-professors__title", x: 24, y: 80, width: 312, height: 75 },
  { selector: ".home-professors__body", x: 0, y: 292, width: 360, height: 935 },
  { selector: ".home-professors__item", x: 24, y: 292, width: 312, height: 412 },
  { selector: ".formats__title", x: 28, y: 60, width: 304, height: 87 },
  { selector: ".formats__item", x: 8, y: 207, width: 344, height: 212 },
  { selector: ".approach__title", x: 28, y: 80, width: 295, height: 48 },
  { selector: ".partners__main", x: 8, y: 300, width: 344, height: 420 },
  { selector: ".faq__head", x: 28, y: 60, width: 304, height: 50 },
  { selector: ".prefooter__body", x: 16, width: 328 },
];

test("main page matches the 360 px Figma frame geometry", async ({ page }, testInfo) => {
  await page.goto("/pages/home.html", { waitUntil: "domcontentloaded" });
  await page.addStyleTag({
    content: "::-webkit-scrollbar { display: none !important; } html { scrollbar-width: none !important; }",
  });

  await page.evaluate(async () => {
    for (let y = 0; y < document.documentElement.scrollHeight; y += 700) {
      window.scrollTo(0, y);
      await new Promise((resolve) => setTimeout(resolve, 60));
    }

    await Promise.all(
      [...document.images].map((image) => image.decode().catch(() => undefined)),
    );

    window.scrollTo(0, 0);
    await new Promise((resolve) => setTimeout(resolve, 1_200));
  });

  const geometry = await page.evaluate(
    ({ sections, elements }) => {
      const rounded = (value) => Math.round(value * 100) / 100;

      return {
        viewportWidth: document.documentElement.clientWidth,
        pageHeight: document.documentElement.scrollHeight,
        sections: sections.map(({ selector }) => {
          const selectors = Array.isArray(selector) ? selector : [selector];
          const nodes = selectors.map((item) => document.querySelector(item));
          const firstRect = nodes[0].getBoundingClientRect();
          const lastRect = nodes.at(-1).getBoundingClientRect();

          return {
            selector: selectors.join(" + "),
            y: rounded(firstRect.top + window.scrollY),
            height: rounded(lastRect.bottom - firstRect.top),
          };
        }),
        elements: elements.map(({ selector }) => {
          const node = document.querySelector(selector);
          const rect = node.getBoundingClientRect();
          const sectionRect = node.closest("section, footer").getBoundingClientRect();

          return {
            selector,
            x: rounded(rect.x),
            y: rounded(rect.y - sectionRect.y),
            width: rounded(rect.width),
            height: rounded(rect.height),
          };
        }),
      };
    },
    { sections: figmaSections, elements: figmaElements },
  );

  const mismatches = [];

  if (geometry.viewportWidth !== 360) {
    mismatches.push({ selector: "viewport", property: "width", figma: 360, current: geometry.viewportWidth });
  }

  if (Math.abs(geometry.pageHeight - 15_629) > 1) {
    mismatches.push({ selector: "page", property: "height", figma: 15_629, current: geometry.pageHeight });
  }

  figmaSections.forEach((expected, index) => {
    const actual = geometry.sections[index];

    ["y", "height"].forEach((property) => {
      if (Math.abs(actual[property] - expected[property]) > 1) {
        mismatches.push({
          selector: actual.selector,
          property,
          figma: expected[property],
          current: actual[property],
        });
      }
    });
  });

  figmaElements.forEach((expected, index) => {
    const actual = geometry.elements[index];

    ["x", "y", "width", "height"].forEach((property) => {
      if (
        expected[property] !== undefined &&
        Math.abs(actual[property] - expected[property]) > 1
      ) {
        mismatches.push({
          selector: actual.selector,
          property,
          figma: expected[property],
          current: actual[property],
        });
      }
    });
  });

  const geometryPath = testInfo.outputPath("home-mobile-geometry.json");

  await writeFile(
    geometryPath,
    JSON.stringify({ geometry, mismatches }, null, 2),
  );
  await testInfo.attach("home-mobile-geometry.json", {
    path: geometryPath,
    contentType: "application/json",
  });

  const mismatchSummary = mismatches
    .slice(0, 12)
    .map(
      ({ selector, property, figma, current }) =>
        `${selector} ${property}: Figma ${figma}, current ${current}`,
    )
    .join("\n");

  expect(
    mismatches.length,
    `${mismatches.length} geometry mismatches\n${mismatchSummary}`,
  ).toBe(0);
});
