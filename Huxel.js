Vue.component("huxel", {
	template: `<div class="huxel">

	</div>`
})

class Huxel {
	constructor(x,y) {
		this.x = x
		this.y = y
		
	}

	get p0() {
		return [this.x*app.hWidth,this.y*app.hHeight]
	}

	draw({p}) {
		p.stroke(320, 100, 50)
		p.noFill()
		p.rect(...this.p0, app.hWidth, app.hHeight)
	}

	// What is it in Vue?
}