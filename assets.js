/**
 * Assets go here
 *
 **/

let COLOR = {

	monsterCyan: [190, 100, 60]
}

let IMAGE_ASSET_FILES = {
	"deer": "clipart2598461.png",
	"tetrisBackground": "tetris_human_backdrop.jpg"
}

let SOUND_ASSET_FILES = {
	"tetris1": "MUS_Tetris_Level1.wav",
}

let IMAGE = {}
let SOUND = {}

function loadImageAssets(p) {
	Object.keys(IMAGE_ASSET_FILES).forEach(key => {
		IMAGE[key] = p.loadImage("ImageAssets/" + IMAGE_ASSET_FILES[key])
	})
}

function loadSoundAssets(p) {
	Object.keys(SOUND_ASSET_FILES).forEach(key => {
		SOUND[key] = p.loadSound("SoundAssets/" + SOUND_ASSET_FILES[key])
	})
}