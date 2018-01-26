function Utlity() {
  this.random = (from, to) => {
    if (!to) {
      to = from
      from = 0
    }
    return Math.random() * (from - to) + to
  }

  this.int = (decimal) => {
    return Math.floor(decimal)
  }

  this.randomTween = (from, to) => {
    return this.int(this.random(from, to))
  }
}

if (typeof module === "object")
  module.exports = Utlity