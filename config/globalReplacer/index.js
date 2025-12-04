import fs from "fs";
import * as prettier from "prettier";

const readCSSFileCallback = async (err, data, filePath) => {
  return new Promise(resolve => {
    if (err||!filePath) return resolve();
    
    let answer = data;
    answer = answer.replaceAll('url(/', 'url(../');
    answer = answer.replaceAll(`url('/`, `url('../`);
    answer = answer.replaceAll(`url("/`, `url("../`);

    fs.writeFile(filePath, answer, () => {
      console.log(`${filePath} is transformed`);
      resolve();
    });
  })
}

const readHTMLFileCallback = async (err, data, filePath) => {
  return new Promise(async (resolve) => {
    if (err||!filePath) return resolve();
    
    let answer = data;
    answer = answer.replaceAll('type="module"', '');
    answer = answer.replaceAll('crossorigin', '');
    answer = answer.replaceAll(`<script`, `<script defer`);

    answer = await prettier.format(answer, {
      parser: 'html',
    })

    fs.writeFile(filePath, answer, () => {
      console.log(`${filePath} is transformed`);
      resolve();
    });
  })
}

const readJSFileCallback = async (err, data, filePath) => {
  return new Promise(async (resolve) => {
    if (err||!filePath) return resolve();
    
    let answer = data;
    const importPatterns = [
      // import { ... } from '...';
      /import\s*\{[^}]*\}\s*from\s*['"][^'"]*['"]\s*;/g,
      // import x from '...';
      /import\s+[^{\s][^;]*?\s+from\s*['"][^'"]*['"]\s*;/g,
      // import * as x from '...';
      /import\s*\*\s*as\s+[^;]*?\s+from\s*['"][^'"]*['"]\s*;/g,
      // import '...';
      /import\s*['"][^'"]*['"]\s*;/g,
      // import('...') (динамический импорт)
      /import\s*\(['"][^'"]*['"]\)[^;]*;/g,
      // Многострочные импорты
      /import\s*\{[\s\S]*?\}\s*from\s*['"][\s\S]*?['"]\s*;/g,
    ];
    for (const pattern of importPatterns) {
      answer = answer.replace(pattern, '');
    }
    
    const exportPatterns = [
      // export { a, b, c };
      /export\s*\{[^}]*}\s*;?\s*$/g,
      // export default something;
      /export\s+default\s+.*;?\s*$/g,
      // export const/let/var/function/class
      /export\s+(?:const|let|var|function|class|async\s+function)\s+[\w\s,={}()[\]'";]*;?\s*$/g,
      // export * from '...';
      /export\s*\*\s*from\s*['"][^'"]*['"]\s*;?\s*$/g,
      // export { a } from '...';
      /export\s*\{[^}]*\}\s*from\s*['"][^'"]*['"]\s*;?\s*$/g,
    ];
    for (const pattern of exportPatterns) {
      answer = answer.replace(pattern, '');
    }
    
    // answer = answer.replace(importRegex, '// Импорт удален');

    fs.writeFile(filePath, answer, () => {
      console.log(`${filePath} is transformed`);
      resolve();
    });
    resolve();
  })
}

async function globalReplacer() {
  const cssDir = './dist/css';
  const cssComponentsDir = './dist/css/components';

  const jsDir = './dist/js';
  const jsComponentsDir = './dist/js/components';

  const pagesDir = './dist/pages';
  
  const cssFiles = fs.readdirSync(cssDir);
  const cssComponentsFiles = fs.readdirSync(cssComponentsDir);

  const jsFiles = fs.readdirSync(jsDir);
  const jsComponentsFiles = fs.readdirSync(jsComponentsDir);

  const pagesFiles = fs.readdirSync(pagesDir);
  
  for (let index = 0; index < cssFiles.length; index++) {
    const fileName = cssFiles[index];
    if (!fileName.endsWith('.css')) continue;

    const filePath = `${cssDir}/${fileName}`

    await fs.readFile(filePath, 'utf8', async (err, data) => {
      await readCSSFileCallback(err, data, filePath)
    });
  }
  for (let index = 0; index < cssComponentsFiles.length; index++) {
    const fileName = cssComponentsFiles[index];
    if (!fileName.endsWith('.css')) continue;

    const filePath = `${cssComponentsDir}/${fileName}`

    await fs.readFile(filePath, 'utf8', async (err, data) => {
      await readCSSFileCallback(err, data, filePath)
    });
  }

  for (let index = 0; index < pagesFiles.length; index++) {
    const fileName = pagesFiles[index];
    if (!fileName.endsWith('.html')) continue;
    const filePath = `${pagesDir}/${fileName}`;

    await fs.readFile(filePath, 'utf8', async (err, data) => {
      await readHTMLFileCallback(err, data, filePath)
    });
  }

  for (let index = 0; index < jsFiles.length; index++) {
    const fileName = jsFiles[index];
    if (!fileName.endsWith('.js')) continue;
    const filePath = `${jsDir}/${fileName}`;

    await fs.readFile(filePath, 'utf8', async (err, data) => {
      await readJSFileCallback(err, data, filePath)
    });
  }
  for (let index = 0; index < jsComponentsFiles.length; index++) {
    const fileName = jsComponentsFiles[index];
    if (!fileName.endsWith('.js')) continue;
    const filePath = `${jsComponentsDir}/${fileName}`;

    await fs.readFile(filePath, 'utf8', async (err, data) => {
      await readJSFileCallback(err, data, filePath)
    });
  }
}

globalReplacer()