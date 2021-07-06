import { createNodeRedisClient, WrappedNodeRedisClient } from 'handy-redis'
export let client: WrappedNodeRedisClient
;(async function () {
  client = createNodeRedisClient()
})()
