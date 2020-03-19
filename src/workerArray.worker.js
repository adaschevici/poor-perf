const ports = {}
let cache = {}
let queue

function initiatePort(workerName, port) {
  ports[workerName] = port
  const webWorker = ports[workerName]
  webWorker.inUse = false
  webWorker.onmessage = function handleResults(e) {
    const { searchTerm, searchResults } = e.data
    const message = { searchTerm, searchResults }

    /* If all workers happen to be inUse, the message gets saved to the
    the queue and passed to the first worker that finishes */
    if (queue) {
      webWorker.postMessage(queue)
      webWorker.inUse = true
      queue = null
    } else {
      webWorker.inUse = false
    }

    cache[searchTerm] = message
    self.postMessage(message)
  }
}

function dispatchSearchRequest(searchTerm) {
  const cachedResult = cache[searchTerm]
  if (cachedResult) {
    self.postMessage(cachedResult)
    return
  }
  const message = searchTerm

  for (const workerName in ports) {
    console.log(workerName)
    console.log(ports)
    const webWorker = ports[workerName]
    if (!webWorker.inUse) {
      console.log('Posting search message to worker')
      webWorker.postMessage(message)
      webWorker.inUse = true
      return
    }
  }
  queue = message
}

self.onmessage = function(e) {
  const { workerName, searchTerm } = e.data

  if (workerName) {
    initiatePort(workerName, e.ports[0])
  } else if (searchTerm) {
    dispatchSearchRequest(searchTerm)
  }
}
