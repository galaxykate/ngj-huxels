MODES.fish = {
	start({}) {
		console.log("START FISH")
	},

	stop({}) {
		console.log("STOP FISH")
	},

	update({p, tracker, huxels, time, particles, debugOptions}) {
		if (Math.random() > .9) {
			let x = randInt(0, 10)
			let y = randInt(0, 10)
			huxels.push(new Huxel(x, y))
		}

	},

	drawBackground({p, tracker, huxels, time, particles, debugOptions}) {
		p.background(50, 100, 90)
	},

	draw({p, tracker, huxels, time, particles, debugOptions}) {
		
          tracker.faces.forEach((f,index) => {
            p.image(f.thumbnail, 100*index, 0)
          })

          tracker.hands.forEach((h,index) => {
            let faceIndex = 0
            let face = tracker.faces[faceIndex]
            // console.log(index, face)
            h.fingers.forEach(f => {
                p.push()
              p.translate(...f.tip) 
              p.image(face.thumbnail, 0, 0)
              p.pop()
            })
            
          
          })


	},
	
}