/** 
 * Assets go here
 * 
 **/

let IMAGE_ASSET_FILES = {
	"deer": "clipart2598461.png",
    //
    "bird_head": "bird_head.png",
    "bird_body": "bird_body.png",
    "leaf": "leaf.png",
    "jungle_bg": "jungle_background.png",
    "laser": "02_laser_impact.png",
    "musical_note1": "musical_note1.png",
    "musical_note2": "musical_note2.png"
}

let SOUND_ASSET_FILES = {
	"tetris1": "MUS_Tetris_Level1.wav",
    "stick_dance": "S_Stick_DanceLoop.wav"
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