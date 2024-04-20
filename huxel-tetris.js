/**
 *
 **/

MODES.tetris = {
	state: {
		rows: 20,
		cols: 10,
		board: []
	},

	setupBoard() {
		let {rows, cols} = this.state
		this.state.board = [...new Array(rows).keys()].map(() => [...new Array(cols).keys()].map(() => false))
	},

	start({}) {

	},

	stop({}) {

	},

	update({p, tracker, huxels, time, particles, debugOptions}) {
		if (Math.random() > .9) {
			let x = randInt(0, 10)
			let y = randInt(0, 10)
			huxels.push(new Huxel(x, y))
			console.log(this.state.board)
			this.state.board[y][x] = true;
		}

	},

	drawBackground({p, tracker, huxels, time, particles, debugOptions}) {
		p.background(50, 100, 90)
	},

	draw(app) {
		let {p, tracker, huxels, time, particles, debugOptions} = app;
		// p.fill(300, 80, 50)
		p.circle(0, 0, 500)

		tracker.drawCapture(p, 0, 0, 1.5);
		this.drawGameArea(app, {x: 500, y: 0, w: 100, h: 200})
	},

	drawGameArea({p, tracker, huxels, time, particles, debugOptions}, {x, y, w, h}) {
		p.push();
		p.translate(x, y);
		p.fill(0, 0, 0);
		p.rect(0, 0, w, h);
		huxelSize = [w / this.state.cols, h / this.state.rows];

		this.state.board.forEach((row, i) => {
			row.forEach((cell, j) => {
				if (cell) {
					p.fill(0, 0, 100)
					p.rect(j, i, ...huxelSize);
				}
			})
		})
		p.pop()
	}
}