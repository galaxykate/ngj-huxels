MODES.bee = {
	bees: [],
	flowers: [],
	hives: [
		{
			x: 0,
			color: [0, 100, 50],
			pollen: 0
		},
		{
			x: 512,
			color: [180, 100, 50],
			pollen: 0
		}
	],
	hiveRect: {y: 0, width: 128, height: 256},

	start({p, tracker, huxels, time, particles, debugOptions}) {
		let beeMax = []
		tracker.hands.forEach(hand => {
			this.bees.push(0)
			beeMax.push(500)
		})
		tracker.faces.forEach(face => {
			this.flowers.push(Array.from(beeMax))
		})
	},

	stop({p, tracker, huxels, time, particles, debugOptions}) {
	},

	update({p, tracker, huxels, time, particles, debugOptions}) {
		tracker.hands.forEach((hand, index) => {
			if (hand.isActive) {
				let position = hand.center
				let foundFlower = false
				for (let index2 = 0; index2 < tracker.faces.length; index2++) {
					let face = tracker.faces[index2]
					if (face.isActive && Vector2D.distance(position, face.nose) < 64) {
						let pollen = Math.min(time.dt, 500 - this.bees[index], this.flowers[index2][index])
						this.bees[index] += pollen
						this.flowers[index2][index] -= pollen
						foundFlower = true
						break
					}
				}
				if (!foundFlower) {
					this.hives.forEach(hive => {
						if (position.x >= hive.x && position.x <= hive.x + this.hiveRect.width && position.y >= this.hiveRect.y && position.y <= this.hiveRect.y + this.hiveRect.height) {
							if (this.bees[index] >= time.dt) {
								hive.pollen += time.dt
								this.bees[index] -= time.dt
							} else {
								hive.pollen += this.bees[index]
								this.bees[index] = 0
							}
						}
					})
				}
			}
		})
	},

	drawBackground({p, tracker, huxels, time, particles, debugOptions}) {
		// p.background(50, 100, 90)
	},

	draw({p, tracker, huxels, time, particles, debugOptions}) {
		p.textSize(64)
		this.hives.forEach(hive => {
			p.fill(...hive.color)
			p.rect(hive.x, this.hiveRect.y, this.hiveRect.width, this.hiveRect.height)
		})
		p.fill(0, 0, 0)
		tracker.faces.forEach(face => {
			if (face.isActive) {
				p.text("🌻", ...face.nose)
			}
		})
		tracker.hands.forEach((hand, index) => {
			if (hand.isActive) {
				p.text("🐝", ...hand.center)
				p.text(this.bees[index], ...hand.center)
			}
		})
		this.hives.forEach(hive => {
			p.text(hive.pollen, hive.x, this.hiveRect.y + 64)
		})
	},
}
