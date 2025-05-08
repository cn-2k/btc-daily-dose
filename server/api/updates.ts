// server/api/updates.ts
import { setResponseHeader, defineEventHandler, createEventStream } from 'h3'
import type { EventStream } from 'h3'
import { addLogListener } from '../utils/logger'

let clients: EventStream[] = [] // Array to store connected SSE clients

export default defineEventHandler((event) => {
  // Set the headers for SSE
  setResponseHeader(event, 'Content-Type', 'text/event-stream')
  setResponseHeader(event, 'Cache-Control', 'no-cache')
  setResponseHeader(event, 'Connection', 'keep-alive')

  const stream = createEventStream(event)

  // Send an initial connection message
  // stream.push(`data: Initial connection established @ ${new Date().toLocaleTimeString()}\n\n`)

  // Add the client to the list of connected clients
  clients.push(stream)

  // Set up a listener for new log messages
  const unsubscribe = addLogListener((message) => {
    stream.push(`${message}\n\n`)
  })

  // Handle client disconnection
  stream.onClosed(() => {
    unsubscribe() // Remove the log listener
    clients = clients.filter(client => client !== stream) // Remove the client
  })

  return stream.send()
})
