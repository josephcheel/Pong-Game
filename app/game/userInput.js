
export const keys = {
	a: {
	  pressed: false,
	},
	d: {
	  pressed: false,
	},
	arrowup: {
	  pressed: false,
	},
	arrowdown: {
	  pressed: false,
	},
	s: {
	  pressed: false,
	},
	w: {
	  pressed: false,
	},
	shift: {
	  pressed: false,
	},
};
  
export function userInput() {
	document.addEventListener('keydown', (event) => {
	
	switch (event.key) {
		case 's':
			keys.s.pressed = true;
			break;
		case 'S':
			keys.s.pressed = true;
			break; 
		case 'w':
			keys.w.pressed = true;
			break;
		case 'W':
			keys.w.pressed = true;
			break ;
		case 'ArrowUp':
			keys.arrowup.pressed = true;
			break;
		case 'ArrowDown':
			keys.arrowdown.pressed = true;
			break;
		default:
			break;
	}
  });

	document.addEventListener('keyup', (event) => {
	switch (event.key) {
		case 's':
			keys.s.pressed = false;
			break;
		case 'S':
			keys.s.pressed = false;
			break;
		case 'w':
			keys.w.pressed = false;
			break;
		case 'W':
			keys.w.pressed = false;
			break;
		case 'ArrowUp':
			keys.arrowup.pressed = false;
			break;
		case 'ArrowDown':
			keys.arrowdown.pressed = false;
			break;
		default:
	  		break;
	}
  });
}