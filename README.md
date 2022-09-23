# React SSR 原理

## 同构

同构简单来说就是，一份 react 在服务端和客服端都跑一遍，跑两次的原因是，服务端渲染出来的 HTML ，丢失了 react 代码中的绑定事件，需要在客服端 hydrate 一下，事件才能绑定上。

## 路由

实际上服务端渲染只有第一个进去的页面才是服务端渲染，在页面中的路由跳转属于客户端的路由跳转。

使用 react-router 的 API matchRoutes 和 服务端的 ctx.request.path `const matchedRoutes = matchRoutes(routes, ctx.request.path)` 匹配出当前的路由，可以做一些处理，例如异步数据处理，若匹配不到，可以在服务端跳转到 NotFound 页面

## redux（注水、脱水）

在请求一些状态时，我们往往会将一些状态存储到 redux 这样的全局状态管理库中，在服务端和客服端前后执行两次的时候，状态会出现’抖动‘的情况，因为当你在服务器请求数据保存到 redux 之后，客服端初始化 redux 时，这时还为初始化状态。我们可以用注水、脱水两个过程解决这个问题。

注水：在服务端请求数据并保存到 redux 中后，并将状态写到 TextArea 中，将其 `dispaly: none`。
脱水，在客户端初始化 redux 时，将 TextArea 中的 redux 数据取出来，作为 redux 的初始化数据。

## 异步数据的服务端渲染!

我们通常会在组件初始化后去请求一个方法来获取当前一些状态信息。那么在一份代码执行两次的时候，就会造成一个方法请求了两次，还可能会有数据闪烁的情况出现，这时候我们可以在组件上挂载一个 _lodaData_ 方法,同时将方法写在路由属性上，在服务端匹配到当前路由时，即可拿到当前组件的 loadData 方法，

1、这时，可在服务端请求后，将状态同步到 rudex 中，这时在客户端在`脱水`后可以做一些判断，如果数据已经有了，就不再请求了。

2、也可在_lodaData_ 使用 react-query 的 prefetch //TODO: 

## node 中间层

## SEO

react-helmet

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
