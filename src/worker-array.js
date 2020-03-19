import WorkerArray from './workerArray.worker'
import Worker from './delegate.worker'

export default class WorkerArrayController {
  constructor({ data, handleResults, arraySize }) {
    this.workerArray = new WorkerArray()
    let i = 1
    this.webWorkers = {}
    while (i <= arraySize) {
      const workerName = `ww${i}`
      this.webWorkers[workerName] = new Worker()

      /* Creates a MessageChannel for each worker and passes that channel's 
       ports to both workerArray dispatcher and the worker so 
       they can communicate with each other */
      const channel = new MessageChannel()
      this.workerArray.postMessage({ workerName }, [channel.port1])
      this.webWorkers[workerName].postMessage({ data }, [channel.port2])
      i++
    }

    this.workerArray.onmessage = handleResults
  }

  search = searchTerm => {
    this.workerArray.postMessage({ searchTerm })
  }

  terminate() {
    this.workerArray.terminate()
    for (const workerName in this.webWorkers) {
      this.webWorkers[workerName].terminate()
    }
  }
}
