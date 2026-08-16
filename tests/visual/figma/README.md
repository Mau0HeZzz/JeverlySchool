# Figma mobile spacing references

Export every mobile page frame from Figma as PNG at 1x without a device frame.
Keep the original frame size. PNG files are used to verify local margins, paddings,
and gaps; full-page height, content count, and pixel-by-pixel similarity are ignored.

Required files:

- `home.png`
- `about.png`
- `professors.png`
- `catalog.png`
- `course.png`
- `calendar.png`
- `blog.png`
- `workspace.png`
- `404.png`

These images and spacing assertions are test fixtures and must be committed. Generated
Playwright JSON attachments and reports are written outside this directory and ignored.

Run the spacing audit with `npm run audit:mobile`. Viewport widths are declared in
`tests/mobile-pages.js`; transparent pixels around an exported frame do not affect them.
