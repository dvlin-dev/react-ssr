# React SSR 原理

## 同构

同构简单来说就是，一份 react 在服务端和客服端都跑一遍，跑两次的原因是，服务端渲染出来的 HTML ，丢失了 react 代码中的绑定事件，需要在客服端 hydrate 一下，事件才能绑定上。

在服务端将 HTML 整体分为三部分，分别为 Head、content、store,Head 部分为 css、js 和 seo 相关字段，content 为 react 代码，store 为注水部分。

通过 renderToPipeableStream（18之前可以通过 renderToString或renderToNodeStream） 将 react 以 stream 的形式，放在 Head 和 store 中间传输。

值得一提的是 React 18 为 SSR 提供了更高效的性能：

1、流式 HTML 响应。流式 HTML 响应可以让服务端尽快的产出 HTML 给客户端，加快了服务端的响应，让页面尽快的展现给用户。

2、选择性的 hyration。选择性的 hyration 可让应用在 HTML 和 JavaScript 代码的其余部分完全下载之前尽早开始为页面 hydrate。它还优先为用户正在与之交互的部分 hydrate，从而产生即时补水的错觉。如此种种都可以加快页面可交互时间。

这些功能解决了 React 中 SSR 的三个长期存在的问题：

1、不需要等待所有的数据在服务器上加载后再发送 HTML。相反，一旦有足够的数据来显示页面，就可以开始发送 HTML，其余的 HTML 在准备好后再进行流式传输。

2、不需要等待所有的 JavaScript 加载来开始 hydration。相反，可以使用结合服务器渲染的代码拆分。服务器 HTML 将被保留，React 将在相关代码加载时对其进行 hydration。

3、不需要等待所有的组件被 hydrated 后才开始可以与页面互动。相反，可以依靠选择性的 hyration，来优先考虑用户正在与之互动的组件，并尽早对它们进行 hydration。


```js
伪代码

服务端
const stream = new Writable({
  write(chunk, _encoding, cb) {
    ctx.res.write(chunk, cb)
  },
  final() {
    ctx.res.end(getEndTemplate({ state, dehydratedState }))
    resolve('ctx.resolve')
  },
})
const { pipe } = renderToPipeableStream(reactNode, {
  bootstrapScripts: [mainJs],
  onShellReady() {
    // The content above all Suspense boundaries is ready.
    // If something errored before we started streaming, we set the error code appropriately.
    ctx.res.setHeader('Content-type', 'text/html')
    ctx.status = didError ? 500 : 200
    if (staticContext.NOT_FOUND) {
      ctx.status = 404
    }

    ctx.res.write(getStartTemplate({ assetsJS, assetsCSS, helmetContext }))

    pipe(stream)
  },
  onShellError() {
    // Something errored before we could complete the shell so we emit an alternative shell.
    ctx.status = 500
    ctx.res.end('server error')
  },
  onError(err) {
    didError = true
  },

客户端

hydrateRoot(
  document.getElementById("root")!,
  <App
    store={store}
    isServer={false}
    preloadedState={payloadData}
    dehydratedState={dehydratedState ?? undefined}
    helmetContext={{}}
  />,
)

```

## 路由

实际上服务端渲染只有第一个进去的页面才是服务端渲染，在页面中的路由跳转属于客户端的路由跳转。

使用 react-router 的 API matchRoutes 和 服务端的 ctx.request.path `const matchedRoutes = matchRoutes(routes, ctx.request.path)` 匹配出当前的路由，可以做一些处理，例如异步数据处理，若匹配不到，可以在服务端跳转到 NotFound 页面

## redux（注水、脱水）

在请求一些状态时，我们往往会将一些状态存储到 redux 这样的全局状态管理库中，在服务端和客服端前后执行两次的时候，状态会出现’抖动‘的情况，因为当你在服务器请求数据保存到 redux 之后，客服端初始化 redux 时，这时还为初始化状态。我们可以用注水、脱水两个过程解决这个问题。

注水：在服务端请求数据并保存到 redux 中后，并将状态写到 TextArea 中，将其 `dispaly: none`。
脱水，在客户端初始化 redux 时，将 TextArea 中的 redux 数据取出来，作为 redux 的初始化数据。

## 异步数据的服务端渲染!

我们通常会在组件初始化后去请求一个方法来获取当前一些状态信息。那么在一份代码执行两次的时候，就会造成一个方法请求了两次，还可能会有数据闪烁的情况出现，这时候我们可以在组件上挂载一个 `lodaData` 方法,同时将方法写在路由属性上，在服务端匹配到当前路由时，即可拿到当前组件的 loadData 方法，

1、这时，可在服务端请求后，将状态同步到 rudex 中，这时在客户端在`脱水`后可以做一些判断，如果数据已经有了，就不再请求了。

2、也可在 `lodaData` 使用 react-query 的 prefetch, 实现 Render-as-you-fetch 

## 路由的按需渲染

如何实现支持 SSR 的页面级 dynamic import

React 18 中 React.lazy 可以实现 dynamic import，结合 Suspense，就是 React 原生级别的支持 SSR 的 dynamic import。

## SEO

使用 react-helmet

# 开发

## SSR development

- npm run dev:client
- npm run dev:server
- npm run dev:start

## CSR development

- npm run dev:csr

## production

- npm run build

# TODO

写个带注释的分支，配置 eslint prettier stylint husky
