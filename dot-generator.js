function DotGenerator(fromX, fromY, toX, toY) {
  this.initial_set = []
  // this.target_set = []
  this.current_set = []
  this.areaSet = []
  this.vector = []

  // which frame is now
  this.frame_count = 0
  // in which frame reset vector
  this.reset = 90
  // 移动区间半径
  this.area = 20

  // judge if the target dot coordinate is being overlaped
  // with existed dots
  function overlap(coord, coordSet, spaceX, spaceY) {
    // central dot overlap judgement
    let add1 = 130 <= (coord.x - 20) && 190 >= (coord.x - 20)
    let add2 = 130 <= (coord.x + 20) && 190 >= (coord.x + 20)
    let add3 = 130 <= (coord.y - 20) && 190 >= (coord.y - 20)
    let add4 = 130 <= (coord.y + 20) && 190 >= (coord.y + 20)

    if ((add1 && add3) || (add2 && add4) || (add1 && add4) || (add2 && add3))
      return true

    for (let item in coordSet) {
      let overlapX = coordSet[item].x >= (coord.x - spaceX) && coordSet[item].x <= (coord.x + spaceX)
      let overlapY = coordSet[item].y >= (coord.y - spaceY) && coordSet[item].y <= (coord.y + spaceY)

      if (overlapX && overlapY)
        // if there is overlap
        return true
    }
    // if no overlap
    return false
  }

  // generate dot
  this.genDotAxis = (dot_num, spaceX, spaceY) => {

    let utiliy = new Utlity()

    for (let i = 0; i < dot_num; i++) {
      let x = utiliy.int(utiliy.random(fromX, toX))
      let y = utiliy.int(utiliy.random(fromY, toY))

      while (overlap({
          x,
          y
        }, this.initial_set, spaceX, spaceY)) {
        x = utiliy.int(utiliy.random(fromX, toX))
        y = utiliy.int(utiliy.random(fromY, toY))
      }

      this.initial_set.push({
        x,
        y
      })
    }

    // this.initial_set.push({x: 160, y: 160})

    this.current_set = this.initial_set

    return this
  }

  // return generated dots
  this.getInitDotSet = () => {
    return this.initial_set
  }

  // return current dot set
  this.getCurrentDotSet = () => {
    return this.current_set
  }

  // vector generator
  this.genVector = (length) => {
    let utiliy = new Utlity()
    let vector = []

    let increment = [0, 0.1, 0.2, 0.3]

    let direction = [-1, 1]

    for (let i = 0; i < length; i++) {
      let x = increment[utiliy.randomTween(4)]
      let y = increment[utiliy.randomTween(4)]
      let dX = direction[utiliy.randomTween(2)]
      let dY = direction[utiliy.randomTween(2)]
      vector.push({
        increment: {
          x,
          y
        },
        direction: {
          x: dX,
          y: dY
        }
      })
    }
    this.vector = vector
  }

  // 初始化 生成初始点集 目标点集
  this.init = (dot_num, spaceX, spaceY) => {
    this.dot_num = dot_num
    this.genDotAxis(dot_num, spaceX, spaceY)

    this.genVector(dot_num)

    // 移动区间集合
    let areaSet = this.initial_set.map(item => {
      return {
        fromX: item.x - this.area,
        toX: item.x + this.area,
        fromY: item.y - this.area,
        toY: item.y + this.area
      }
    })

    this.areaSet = areaSet
  }

  let drawLine = dot_set => {
    dot_set.map((dot, key) => {
      for (let others = key + 1; others < dot_set.length; others++) {
        push()
        noFill()
        stroke(225, 225, 225)
        line(dot.x, dot.y, dot_set[others].x, dot_set[others].y)
        pop()
      }
    })
  }

  // static dot generator
  let drawDot = (radius, speed, dotGenerator) => {
    let result = []
    let _this = dotGenerator

    _this.current_set.map((initial_dot, key) => {
      let vector = _this.vector[key]
      let plusX = speed * vector.increment.x * vector.direction.x
      let plusY = speed * vector.increment.y * vector.direction.y
      push()
      fill(225, 225, 225)
      noStroke()
      ellipse(initial_dot.x + plusX, initial_dot.y + plusY, radius, radius)
      pop()
      result.push({
        x: initial_dot.x + plusX,
        y: initial_dot.y + plusY
      })
    })

    _this.current_set = result
  }

  // animate dot generator
  this.drawAnimDot = (radius) => {
    // radius 点半径
    if (this.frame_count !== 90) {
      // drawBorder(this)
      drawDot(radius, 1, this)
      // insert special dot
      // drawLine(this.current_set.concat({ x: 160, y: 160 }))
      drawLine(this.current_set)
      borderCheck(this)

    } else {
      this.genVector(this.dot_num)
      this.frame_count = 0
      // drawBorder(this)
      drawDot(radius, 1, this)
      // insert special dot here
      // drawLine(this.current_set.concat({ x: 160, y: 160 }))
      drawLine(this.current_set)
    }

    this.frame_count++
  }

  function drawBorder(dotGenerator) {
    let _this = dotGenerator
    _this.areaSet.map(item => {
      push()
      noFill()
      stroke("red")
      rect(item.fromX, item.fromY, item.toX, item.toY)
      pop()
    })

    push()
    noFill()
    stroke("blue")
    rect(130, 130, 190, 190)
    pop()
  }

  // 边界值判定
  // 传入当前点集坐标
  function borderCheck(dotGenerator) {
    let _this = dotGenerator
    let collideType = ["top", "right", "bottom", "left"]
    let fixDirect = [-1, -1, 1, 1]

    _this.current_set.map((item, key) => {
      // check top
      if (item.y <= _this.areaSet[key].fromY) {
        // console.info(item.y, _this.vector[key].direction.y)
        // console.info("top")
        _this.vector[key].direction.y = 1
      }
      // check right
      if (item.x >= _this.areaSet[key].toX) {
        // console.info(item.x, _this.vector[key].direction.x)
        // console.info("----------------")
        _this.vector[key].direction.x = -1
      }
      // check bottom
      if (item.y >= _this.areaSet[key].toY) {
        // console.info(item.y, _this.vector[key].direction.y)
        // console.info("----------------")
        _this.vector[key].direction.y = -1
      }
      // check left
      if (item.x <= _this.areaSet[key].fromX) {
        // console.info(item.x, _this.vector[key].direction.x)
        // console.info("----------------")
        _this.vector[key].direction.x = 1
      }
    })
  }
}

if (typeof module === "object")
  module.exports = DotGenerator