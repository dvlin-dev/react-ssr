export const getEndTemplate = ({ state, dehydratedState }: any) => {
  return `</div>
  <div id="modal_root"></div>
  <textarea
    id="data-context"
    style='display:none'
    readonly
  >${JSON.stringify(state)}</textarea>

  <textarea
    id="data-dehydrated"
    style='display:none'
    readonly
  >${JSON.stringify(dehydratedState)}</textarea>
</body>
</html>`
}

export const getStartTemplate = ({
  assetsCSS,
  assetsJS,
  helmetContext,
}: any) => {
  const helmet = helmetContext.helmet
  return `
  <html lang="zh-cn">
  <head>
    <meta charSet="utf-8" />
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1, user-scalable=no, maximum-scale=1, minimum-scale=1"
    />
    <meta httpEquiv="X-UA-Compatible" content="ie=edge" />
    <link rel="shortcut icon" href="/public/favicon.ico" />
    ${assetsCSS.reduce(
      (acc: string, css: any) =>
        acc +
        ` <link
    rel="preload"
    href=${Object.values(css)[0] as string}
    as="style"
    data-tag="css-preload"
  />`,
      "",
    )}

    ${assetsJS.reduce(
      (acc: string, js: any) =>
        acc +
        ` <link
    rel="prefetch"
    href=${Object.values(js)[0] as string}
    as="script"
    data-tag="js-prefetch"
  />`,
      "",
    )}

   
    ${assetsCSS.reduce(
      (acc: string, css: any) =>
        acc +
        ` <link
        rel="stylesheet"
    href=${Object.values(css)[0] as string}
    data-tag="css-real"
  />`,
      "",
    )}
  

    ${helmet.title.toString()}
    ${helmet.meta.toString()}
    ${helmet.link.toString()} 

  </head>
  <body>
    <noscript><b>Enable JavaScript to run this app.</b></noscript>

   <div id="root">`
}
