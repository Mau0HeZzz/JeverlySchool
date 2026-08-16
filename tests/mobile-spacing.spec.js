import { expect, test } from "@playwright/test";
import { writeFile } from "node:fs/promises";
import { mobilePages } from "./mobile-pages.js";

const spacingChecks = {
  home: [
    { selector: ".hero__image", property: "leftInset", figma: 8 },
    { selector: ".hero__image", property: "rightInset", figma: 8 },
    { selector: ".hero__cardwrapper", property: "leftInset", figma: 8 },
    { selector: ".hero__cardwrapper", property: "rightInset", figma: 8 },
    {
      selector: ".hero__cardwrapper",
      from: ".hero__image",
      property: "gap",
      figma: 8,
    },
    { selector: ".hero__button", property: "leftInset", figma: 24 },
    { selector: ".hero__button", property: "rightInset", figma: 24 },
    { selector: ".talent__title", property: "leftInset", figma: 24 },
    { selector: ".talent__title", property: "rightInset", figma: 24 },
    { selector: ".talent__title", property: "sectionTop", figma: 70 },
    {
      selector: ".talent__image",
      from: ".talent__title",
      property: "gap",
      figma: 42,
    },
    { selector: ".talent__image", property: "leftInset", figma: 8 },
    { selector: ".talent__image", property: "rightInset", figma: 8 },
    { selector: ".talent__content", property: "leftInset", figma: 8 },
    { selector: ".talent__content", property: "rightInset", figma: 8 },
    {
      selector: ".counters__container",
      property: "paddingLeft",
      figma: 8,
    },
    {
      selector: ".counters__container",
      property: "paddingRight",
      figma: 8,
    },
    {
      selector: ".counters__container",
      property: "sectionTop",
      figma: 60,
    },
    { selector: ".results__title", property: "leftInset", figma: 24 },
    { selector: ".results__title", property: "rightInset", figma: 24 },
    { selector: ".results__title", property: "sectionTop", figma: 20 },
    { selector: ".results__body", property: "leftInset", figma: 24 },
    { selector: ".results__body", property: "rightInset", figma: 24 },
    {
      selector: ".results__body",
      from: ".results__title",
      property: "gap",
      figma: 60,
    },
    { selector: ".results__image", property: "leftInset", figma: 8 },
    { selector: ".results__image", property: "rightInset", figma: 8 },
    {
      selector: ".results__image",
      from: ".results__body",
      property: "gap",
      figma: 60,
    },
    { selector: ".experts__item", property: "leftInset", figma: 16 },
    { selector: ".experts__item", property: "rightInset", figma: 16 },
    {
      selector: ".experts__image",
      property: "parentLeftInset",
      figma: 8,
    },
    {
      selector: ".experts__image",
      property: "parentRightInset",
      figma: 8,
    },
    {
      selector: ".home-professors__title",
      property: "leftInset",
      figma: 24,
    },
    {
      selector: ".home-professors__body",
      property: "leftInset",
      figma: 8,
    },
    {
      selector: ".home-professors__body",
      property: "rightInset",
      figma: 8,
    },
    { selector: ".formats__title", property: "leftInset", figma: 28 },
    { selector: ".formats__title", property: "rightInset", figma: 28 },
    { selector: ".formats__title", property: "sectionTop", figma: 60 },
    { selector: ".formats__item", property: "leftInset", figma: 8 },
    { selector: ".formats__item", property: "rightInset", figma: 8 },
    {
      selector: ".formats__item",
      from: ".formats__title",
      property: "gap",
      figma: 60,
    },
    { selector: ".approach__title", property: "leftInset", figma: 28 },
    { selector: ".approach__title", property: "sectionTop", figma: 80 },
    { selector: ".faq__head", property: "leftInset", figma: 28 },
    { selector: ".faq__head", property: "rightInset", figma: 28 },
    { selector: ".faq__head", property: "sectionTop", figma: 60 },
    { selector: ".faq__content", property: "leftInset", figma: 28 },
    { selector: ".faq__content", property: "rightInset", figma: 28 },
    { selector: ".prefooter__body", property: "leftInset", figma: 16 },
    { selector: ".prefooter__body", property: "rightInset", figma: 16 },
    { selector: ".prefooter__head", property: "leftInset", figma: 40 },
    { selector: ".prefooter__head", property: "rightInset", figma: 40 },
  ],
  about: [
    { selector: ".tech-cards__head", property: "leftInset", figma: 8 },
    { selector: ".tech-cards__head", property: "rightInset", figma: 8 },
    { selector: ".tech-cards__title", property: "leftInset", figma: 24 },
    { selector: ".tech-cards__body", property: "leftInset", figma: 8 },
    { selector: ".tech-cards__body", property: "rightInset", figma: 8 },
    { selector: ".recognize__title", property: "leftInset", figma: 24 },
    { selector: ".recognize__title", property: "rightInset", figma: 24 },
    { selector: ".recognize__body", property: "leftInset", figma: 8 },
    { selector: ".recognize__body", property: "rightInset", figma: 8 },
    {
      selector: ".masters-reviews__container",
      property: "paddingLeft",
      figma: 8,
    },
    {
      selector: ".masters-reviews__container",
      property: "paddingRight",
      figma: 8,
    },
    { selector: ".prefooter__body", property: "leftInset", figma: 16 },
    { selector: ".prefooter__body", property: "rightInset", figma: 16 },
  ],
  professors: [
    {
      selector: ".slider-professors__container",
      property: "paddingLeft",
      figma: 8,
    },
    {
      selector: ".slider-professors__container",
      property: "paddingRight",
      figma: 8,
    },
    {
      selector: ".slider-professors__title",
      property: "leftInset",
      figma: 24,
    },
    {
      selector: ".slider-professors__title",
      property: "rightInset",
      figma: 24,
    },
    {
      selector: ".slider-professors__subtitle",
      property: "leftInset",
      figma: 24,
    },
    {
      selector: ".slider-professors__slide",
      property: "leftInset",
      figma: 24,
    },
    {
      selector: ".slider-professors__slide",
      property: "rightInset",
      figma: 24,
    },
    { selector: ".prefooter__body", property: "leftInset", figma: 16 },
    { selector: ".prefooter__body", property: "rightInset", figma: 16 },
  ],
  catalog: [
    { selector: ".navhero__wrapper", property: "leftInset", figma: 8 },
    { selector: ".navhero__wrapper", property: "rightInset", figma: 8 },
    { selector: ".navhero__title", property: "leftInset", figma: 24 },
    { selector: ".courses__head", property: "leftInset", figma: 24 },
    { selector: ".courses__head", property: "rightInset", figma: 24 },
    { selector: ".courses__item", property: "leftInset", figma: 24 },
    { selector: ".courses__item", property: "rightInset", figma: 24 },
    { selector: ".prefooter__body", property: "leftInset", figma: 16 },
    { selector: ".prefooter__body", property: "rightInset", figma: 16 },
  ],
  course: [
    { selector: ".course__title", property: "leftInset", figma: 28 },
    { selector: ".course__title", property: "rightInset", figma: 28 },
    {
      selector: ".course__head > .parallax-bg",
      property: "leftInset",
      figma: 8,
    },
    {
      selector: ".course__head > .parallax-bg",
      property: "rightInset",
      figma: 8,
    },
    { selector: ".works-course__title", property: "leftInset", figma: 28 },
    { selector: ".works-course__arrows", property: "rightInset", figma: 28 },
    {
      selector: ".works-course__slide.is-visible",
      property: "leftInset",
      figma: 24,
    },
    { selector: ".faq__head", property: "leftInset", figma: 28 },
    { selector: ".faq__head", property: "rightInset", figma: 28 },
    { selector: ".faq__head", property: "sectionTop", figma: 50 },
    { selector: ".faq__content", property: "leftInset", figma: 28 },
    { selector: ".faq__content", property: "rightInset", figma: 28 },
    { selector: ".prefooter__body", property: "leftInset", figma: 16 },
    { selector: ".prefooter__body", property: "rightInset", figma: 16 },
  ],
  calendar: [
    { selector: ".schedule__container", property: "paddingLeft", figma: 8 },
    { selector: ".schedule__container", property: "paddingRight", figma: 8 },
    { selector: ".schedule__title", property: "leftInset", figma: 24 },
    {
      selector: ".filters-schedule__head",
      property: "leftInset",
      figma: 24,
    },
    {
      selector: ".filters-schedule__head",
      property: "rightInset",
      figma: 24,
    },
    {
      selector: ".filters-schedule__body",
      property: "leftInset",
      figma: 24,
    },
    {
      selector: ".filters-schedule__body",
      property: "rightInset",
      figma: 24,
    },
    { selector: ".mhz-calendar__head", property: "leftInset", figma: 24 },
    { selector: ".mhz-calendar__head", property: "rightInset", figma: 24 },
    {
      selector: ".mhz-calendar__events",
      property: "leftInset",
      figma: 24,
    },
    {
      selector: ".mhz-calendar__events",
      property: "rightInset",
      figma: 24,
    },
    { selector: ".prefooter__body", property: "leftInset", figma: 16 },
    { selector: ".prefooter__body", property: "rightInset", figma: 16 },
  ],
  blog: [
    { selector: ".navhero__wrapper", property: "leftInset", figma: 8 },
    { selector: ".navhero__wrapper", property: "rightInset", figma: 8 },
    { selector: ".navhero__title", property: "leftInset", figma: 28 },
    { selector: ".blog__container", property: "paddingLeft", figma: 24 },
    { selector: ".blog__container", property: "paddingRight", figma: 24 },
  ],
  workspace: [
    {
      selector: ".hero-workspace__title",
      property: "contentLeftInset",
      figma: 24,
    },
    {
      selector: ".hero-workspace__image",
      property: "leftInset",
      figma: 8,
    },
    {
      selector: ".hero-workspace__image",
      property: "rightInset",
      figma: 8,
    },
    {
      selector: ".variants-workspace__title",
      property: "leftInset",
      figma: 28,
    },
    {
      selector: ".variants-workspace__title",
      property: "rightInset",
      figma: 28,
    },
    {
      selector: ".variants-workspace__body",
      property: "leftInset",
      figma: 8,
    },
    {
      selector: ".variants-workspace__body",
      property: "rightInset",
      figma: 8,
    },
    {
      selector: ".sertificate-workspace__title",
      property: "leftInset",
      figma: 24,
    },
    {
      selector: ".sertificate-workspace__title",
      property: "rightInset",
      figma: 24,
    },
    {
      selector: ".sertificate-workspace__body",
      property: "leftInset",
      figma: 8,
    },
    {
      selector: ".sertificate-workspace__body",
      property: "rightInset",
      figma: 8,
    },
    { selector: ".prefooter__body", property: "leftInset", figma: 16 },
    { selector: ".prefooter__body", property: "rightInset", figma: 16 },
  ],
  404: [
    {
      selector: ".parallax-bg__container",
      property: "paddingLeft",
      figma: 8,
    },
    {
      selector: ".parallax-bg__container",
      property: "paddingRight",
      figma: 8,
    },
  ],
};

const round = (value) => Math.round(value * 100) / 100;

for (const mobilePage of mobilePages) {
  const pageSections = {};

  for (const check of spacingChecks[mobilePage.name]) {
    let sectionName = check.selector.slice(1).split("__")[0];

    if (
      mobilePage.name === "calendar" &&
      ["filters-schedule", "mhz-calendar"].includes(sectionName)
    ) {
      sectionName = "schedule";
    }

    pageSections[sectionName] ??= [];
    pageSections[sectionName].push(check);
  }

  for (const [sectionName, checks] of Object.entries(pageSections)) {
    test(`${mobilePage.name} ${sectionName} spacing matches Figma`, async ({
      page,
    }, testInfo) => {
      await page.setViewportSize({
        width: mobilePage.viewportWidth,
        height: 900,
      });
      await page.goto(mobilePage.path, { waitUntil: "domcontentloaded" });
      await page.evaluate(() => document.fonts.ready);

      const measurements = await page.evaluate((pageChecks) => {
        const numberFromStyle = (node, property) =>
          Number.parseFloat(getComputedStyle(node)[property]);

        return pageChecks.map((check) => {
          const node = document.querySelector(check.selector);

          if (!node) {
            return { ...check, current: null };
          }

          const rect = node.getBoundingClientRect();
          const parentRect = node.parentElement.getBoundingClientRect();
          const sectionRect = node
            .closest("section, footer")
            ?.getBoundingClientRect();
          let current;

          switch (check.property) {
            case "leftInset":
              current = rect.left;
              break;
            case "rightInset":
              current = innerWidth - rect.right;
              break;
            case "contentLeftInset":
              current = rect.left + numberFromStyle(node, "paddingLeft");
              break;
            case "parentLeftInset":
              current = rect.left - parentRect.left;
              break;
            case "parentRightInset":
              current = parentRect.right - rect.right;
              break;
            case "sectionTop":
              current = rect.top - sectionRect.top;
              break;
            case "gap": {
              const fromRect = document
                .querySelector(check.from)
                .getBoundingClientRect();
              current = rect.top - fromRect.bottom;
              break;
            }
            case "paddingLeft":
            case "paddingRight":
              current = numberFromStyle(node, check.property);
              break;
          }

          return { ...check, current };
        });
      }, checks);
      const report = measurements.map((measurement) => ({
        ...measurement,
        current:
          measurement.current === null ? null : round(measurement.current),
        difference:
          measurement.current === null
            ? null
            : round(measurement.current - measurement.figma),
      }));
      const mismatches = report.filter(
        ({ current, difference }) =>
          current === null || Math.abs(difference) > 1,
      );
      const reportPath = testInfo.outputPath(
        `${mobilePage.name}-${sectionName}-spacing.json`,
      );

      await writeFile(reportPath, JSON.stringify(report, null, 2));
      await testInfo.attach(`${mobilePage.name}-${sectionName}-spacing.json`, {
        path: reportPath,
        contentType: "application/json",
      });

      expect(
        mismatches,
        mismatches
          .map(
            ({ selector, property, figma, current, difference }) =>
              `${selector} ${property}: Figma ${figma}, current ${current}, difference ${difference}`,
          )
          .join("\n"),
      ).toEqual([]);
    });
  }
}
