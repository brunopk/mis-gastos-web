import { clientsClaim } from 'workbox-core'
import { precacheAndRoute } from 'workbox-precaching'

// sw.ts runs in a service worker context, not a browser window — override TS's default typing of `self`
declare let self: ServiceWorkerGlobalScope

clientsClaim()
precacheAndRoute(self.__WB_MANIFEST)
