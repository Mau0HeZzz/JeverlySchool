export async function htmlReplacer(replaces) {
  let config;

  const transformIndexHtml = (html, id) => {
    // if (id.fileName) {
    //   console.log(id.fileName);
    // } else {
    // }
    if (typeof id === 'string') {
      console.log(id);
      if (id.endsWith('.scss')) {
        console.log(html);
      }
    } else {

    }


    let answer = html;
    for (let index = 0; index < replaces.length; index++) {
      const replace = replaces[index];
      answer = answer.replaceAll(replace.entry, replace.replace);
    }
    return answer;
  }

  return {
    name: 'htmlReplacer',
    enforce: 'post',
    configResolved(resolvedConfig) {
        config = resolvedConfig;
    },
    transform(source, id) {
        return { code: transformIndexHtml(source, id), map: undefined };
    },
    transformIndexHtml,
  }
}