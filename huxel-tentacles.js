

MODES.tentacles = {
	start({p, tracker}) {

		this.monsterWidth = p.width*.3
		console.log("START TENTACLES")
		// SOUND.tetris1.play()

		this.particles = []
		let count = 10
		for (var i = 0; i < count; i++) {
			let pt = new Vector2D(Math.random()*p.width, Math.random()*p.height)
			pt.v = new Vector2D(0, 0)
			pt.force = new Vector2D()
			pt.idNumber = i
			let pct = (i)/(count - 1) - .5

			pt.type = i%3 === 0?"face":"hand"
			pt.attachPoint = new Vector2D(pct*this.monsterWidth + p.width/2, p.height*.8)
			this.particles.push(pt)
		}

		
	},

	stop({}) {
		console.log("STOP TENTACLES")
		// SOUND.tetris1.stop()


	},

	update({p, tracker, huxels, time, particles, debugOptions}) {
		this.particles.forEach((pt,index) => {
			// pt.force.setToPolar(.0010, noise(time.t, pt.idNumber))
			pt.v.addMultiple(pt.force, time.dt)

			pt.addMultiple( pt.v, time.dt)
			pt.x = 400*noise(time.t*.0001 + pt.idNumber) + p.width/2
			pt.y = 200*noise(time.t*.0002 + pt.idNumber)  + 200
			
		})


	},

	drawBackground({p, tracker, huxels, time, particles, debugOptions}) {
		p.background(250, 100, 40)
	},

	drawTentacle(p, pt, t) {
		let w = p.width*.02

		p.stroke(100)
		p.strokeWeight(5)
		p.line(...pt, ...pt.attachPoint)

		// p.text("type:" + pt.type, ...pt)

		p.noStroke()
		if (pt.type === "hand") {
			p.fill(100)
			p.circle(...pt, w*1)
			p.fill(...COLOR.monsterCyan)
			p.circle(...pt, w*.8)
		}
		else if (pt.type === "face") {
			let theta = 20*noise(pt.idNumber, t*.0003)
			p.noStroke()
			p.fill(100)

			p.push()
			p.translate(pt.x, pt.y)
			
			p.circle(0,0, w*3)


			let r = w*.2
			p.fill(0)
			p.circle(Math.cos(theta), r*Math.sin(theta), w*2)

			p.fill(100, 100, 100, .5)
			p.circle(-w*.6, -w*.4, w*.7)
			
			p.pop()

		}
	},

	draw({p, tracker, huxels, time, particles, debugOptions}) {
		let w = p.width 
		this.particles.forEach(pt => {
			pt.draw(p, 10)
		})

		p.push()

		p.fill(...COLOR.monsterCyan)

		p.translate(w/2, p.height*.8)
		p.ellipse(0, 0, this.monsterWidth*2, w*.2)
		p.pop()

		this.particles.forEach(pt => this.drawTentacle(p, pt, time.t))

		
		
		// console.log(this.particles)

	},
	
}