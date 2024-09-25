import {Audio, AudioLoader} from 'three';

export default class SoundEffect {
	constructor(listener, path, volume) {
		this.sound = new Audio(listener);
	
		let audioLoader = new AudioLoader();
		audioLoader.load(path, (buffer) => {
			this.sound.setBuffer(buffer);
			this.sound.setLoop(false);
			this.sound.setVolume(volume);
		});
	}
	play() {
		this.sound.play();
	}
	stop() {
		this.sound.stop();
	}

}