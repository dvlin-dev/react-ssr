import React from "react"

import { hydrateRoot, createRoot } from "react-dom/client"

import App from "../App"
import getReduxStore from "../store"

console.info("process.env.SSR", process.env.SSR)


if (process.env.SSR === "true") {
  let payloadData = {}
  let dehydratedState = null
  try {
    const context: HTMLTextAreaElement | null = document.getElementById(
      "data-context",
    ) as HTMLTextAreaElement
    const dehydrated: HTMLTextAreaElement | null = document.getElementById(
      "data-dehydrated",
    ) as HTMLTextAreaElement
    payloadData = JSON.parse(context?.value?.trim?.() ? context?.value : "{}")
    dehydratedState = JSON.parse(dehydrated?.value?.trim?.() ? dehydrated?.value : "{}")
  } catch (e) {
    console.log(e)
  }

  const store = getReduxStore(payloadData)
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
} else {
  const store = getReduxStore({})
  createRoot(document.getElementById("root")!).render(
    <App
      store={store}
      isServer={false}
      preloadedState={{}}
      helmetContext={{}}
    />,
  )
}
