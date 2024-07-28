// Use this file to test any type. Remember to run "npm run start" from the terminal before
function test() {
	gui.play_flipbook(); //After building this should throw Expected 2-4 arguments, but got 0 error
	gui.set_adjust_mode(gui.get_node(""), gui.ADJUST_FIT); //After building this should not throw
}
