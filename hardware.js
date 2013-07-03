var bone = require("./fakebonescript");

var destinations = {
    'Paris' : 'P8_11'
};

var states = {};

function init() {
    for(var i in destinations) {
        console.log("Setting up " + i);
        var pin = destinations[i];
        states[pin] = 0;
        bone.pinMode(pin, 'out');
        bone.digitalWrite(pin, states[pin]);
    }
}

init();
