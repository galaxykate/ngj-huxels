

MODES.tentacles = {
	start({p, tracker}) {
		SOUND.monsterAmbience.play()

		tracker.scale = 4
		this.monsterWidth = p.width*.3
		this.monsterCenter = new Vector2D(p.width*.5, p.height*.8)
		console.log("START TENTACLES")
		// SOUND.tetris1.play()

		this.particles = []

		this.trackables = tracker.faces.concat(tracker.hands)

		let count = 18


		for (var i = 0; i < count; i++) {
			let pt = new Vector2D(Math.random()*p.width, Math.random()*p.height)
			pt.v = new Vector2D(0, 0)
			pt.force = new Vector2D()
			pt.idNumber = i
			pt.thetaOffset = 0
			let pct = (i)/(count - 1) - .5

			pt.type = i%3 === 0?"face":"hand"
			pt.attachPoint = new Vector2D(pct*this.monsterWidth + p.width/2, p.height*.8)
			pt.attachPoint.thetaOffset = 0
			this.particles.push(pt)
		}


		this.trackables.forEach((ent,index) => {
			let ptIndex = count - index - 1
			this.particles[ptIndex].trackable = ent
			this.particles[ptIndex].type = ent.type
			console.log(this.particles[ptIndex].type)

		})

		setTimeout(() => {
			tracker.scale = 2
			app.debugOptions.mode = "tetris"
		}, 30000)
	},

	stop({}) {
		SOUND.monsterAmbience.stop()

		console.log("STOP TENTACLES")
		// SOUND.tetris1.stop()


	},

	update({p, tracker, huxels, time, particles, debugOptions}) {
		this.chomp = Math.abs(noise(time.t*.001))


		this.particles.forEach((pt,index) => {
			if (pt.trackable && pt.trackable.isActive) {
				// console.log("SEt to trackable", pt.trackable)
				pt.setTo(pt.trackable.center)
			}
			else {
	 			// pt.force.setToPolar(.0010, noise(time.t, pt.idNumber))
				pt.v.addMultiple(pt.force, time.dt)

				pt.addMultiple( pt.v, time.dt)
				pt.x = 400*noise(time.t*.0001 + pt.idNumber) + p.width/2
				pt.y = 200*noise(time.t*.0002 + pt.idNumber)  + 200

				pt.thetaOffset = noise(time.t*.001 + pt.idNumber)


			}

			pt.attachPoint.x = lerp(pt.attachPoint.x, pt.x, .1)
			pt.attachPoint.y = this.monsterCenter.y - this.monsterWidth*.23
			let w2 = this.monsterWidth*.4
			pt.attachPoint.x = Math.max(p.width/2-w2, Math.min(p.width/2 + w2, pt.attachPoint.x ))
		})



	},

	drawBackground({p, tracker, huxels, time, particles, debugOptions}) {
		p.background(250, 100, 40)
	},

	drawTentacle(p, pt, t) {
		let w = p.width*.02

		let handDir = undefined

		if (pt.trackable?.type === 'hand' && pt.trackable.isActive) {
			let pt0 = pt.trackable.landmarks[0]
			let pt1 = pt.trackable.landmarks[10]

			p.fill(320, 100, 50)
			// pt0.draw(p, 10)
			// pt1.draw(p, 10)
			handDir = pt0.getAngleTo(pt1)
		}


		// p.line(...pt, ...pt.attachPoint)

		let theta = pt.getAngleTo(pt.attachPoint)


		let theta0 = theta + Math.PI/2
		let theta1 = theta - Math.PI/2

		let theta3 = 1*noise(t*.0003, pt.idNumber) + theta
		let theta4 = 1*noise(t*.0003 + 100, pt.idNumber) + theta + Math.PI

		if (handDir) {

			theta3 = handDir + Math.PI
			theta0 = handDir - Math.PI/2
		}

		let d = pt.getDistanceTo(pt.attachPoint)

		let r0 = w*.5
		let r1 = w*1.2

		let p0a = pt.createPolarOffset(r0, theta0)
		let p0b = pt.createPolarOffset(r0, theta1)
		let p1a = pt.attachPoint.createPolarOffset(r1, theta0)
		let p1b = pt.attachPoint.createPolarOffset(r1, theta1)

		// p.strokeWeight(1)
		// p.stroke(100)
		p.noStroke()
		p.fill(...COLOR.monsterCyan)
		p.beginShape()

		p.vertex(...p0a)
		p.vertex(...p0b)




		let r2 = d*.4
		Vector2D.polarOffsetBezierVertex(p, p0b, r2, theta3, p1b, r2, theta4)

		p.vertex(...p1b)
		p.vertex(...p1a)
		Vector2D.polarOffsetBezierVertex(p, p1a, r2, theta4, p0a, r2, theta3)





		// pt.attachPoint.polarOffsetVertex(p, r0, dir - Math.PI/2)
		// pt.attachPoint.polarOffsetVertex(p, r0, dir + Math.PI/2)


		p.endShape(p.CLOSE)

		// console.log(dir)

		// p.text("type:" + pt.type, ...pt)

		p.noStroke()
		if (pt.trackable.type === "hand") {

			p.fill(100)
			p.circle(...pt, w*1)
			p.fill(...COLOR.monsterCyan)
			p.circle(...pt, w*.8)

			p.stroke(...COLOR.monsterCyan)
			p.strokeWeight(10)

			let fing = new Vector2D()
			pt.trackable.fingers.forEach((finger,index) => {
				fing.setToLerp(pt, finger.joints[3], .2 + .2*noise(index, t*.001))
				p.line(...pt, ...fing)
			})


		}
		else if (pt.trackable.type === "face") {
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

	drawBody({p, time}) {
		let w = p.width
		p.push()


		let rx = this.monsterWidth*.7
		let ry = this.monsterWidth*.2


		// Body
		p.noStroke()

		p.push()
		p.translate(...this.monsterCenter)

		p.fill(...COLOR.monsterCyan)
		p.ellipse(0, 0, this.monsterWidth*2, w*.2)

		p.fill(0)
		p.ellipse(0, 0, rx*2, ry*2)



		let count = 40
		p.fill(100)

		let noiseScale = .1
		for (var i = 0; i < count; i++) {
			let pct0 = i/count
			let pct1 = (i + 1)/count
			let theta0 = Math.PI*2*pct0 + noiseScale*noise(pct0*100)
			let theta1 = Math.PI*2*pct1 + noiseScale*noise(pct1*100)

			let x0 = rx*Math.cos(theta0)
			let y0 = ry*Math.sin(theta0)
			let x1 = rx*Math.cos(theta1)
			let y1 = ry*Math.sin(theta1)

			let point = new Vector2D(lerp(x0, x1, .5), lerp(y0, y1, .5) - w*(.04 - .03*noise(i)))

			point.mult(this.chomp)
			p.triangle(x0, y0, x1, y1, ...point)
		}
		p.pop()

	},

	draw({p, tracker, huxels, time, particles, debugOptions}) {
		let w = p.width
		// this.particles.forEach(pt => {
		// 	pt.draw(p, 10)
		// })

		this.drawBody({p,time})

		this.particles.forEach(pt => {
			if (pt.trackable?.isActive)
				this.drawTentacle(p, pt, time.t)
		})


		// this.trackables.forEach(ent => {
		// 	if (ent.isActive) {
		// 		p.stroke(320, 100, 50)
		// 		p.noFill()
		// 		p.rect(ent.x, ent.y, ent.w, ent.h)
		// 	}
		// })

		// console.log(this.particles)

	}



}