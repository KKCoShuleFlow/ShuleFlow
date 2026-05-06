export class Memory {
  constructor() {
    this.history = []
    this.limit = 50
  }

  save(snapshot) {
    this.history.push(snapshot)

    if (this.history.length > this.limit) {
      this.history.shift()
    }
  }

  getHistory() {
    return this.history
  }
}