// server/utils/logger.ts
// Centralized logging system for Nuxt 3 server

// Store for all log messages
let logMessages: string[] = []
let logListeners: ((message: string) => void)[] = []

// Function to add a log message and notify all listeners
export function serverLog(message: string) {
  const formattedMessage = `${message}`

  console.log(formattedMessage) // Keep standard console logging
  logMessages.push(formattedMessage) // Store message

  // Notify all listeners
  logListeners.forEach(listener => listener(formattedMessage))

  // Keep log history manageable (optional)
  if (logMessages.length > 100) {
    logMessages = logMessages.slice(-100)
  }
}

// Add a listener function that will be called for each new log
export function addLogListener(listener: (message: string) => void) {
  logListeners.push(listener)
  return () => {
    // Return unsubscribe function
    logListeners = logListeners.filter(l => l !== listener)
  }
}

// Get all historical logs
export function getLogHistory(): string[] {
  return [...logMessages]
}
