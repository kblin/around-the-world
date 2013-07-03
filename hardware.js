var bone = require("./fakebonescript");

var destinations = {
    'Paris' : { pin: 'P8_11', leds: 3, active: false },
    'Venice' : { pin: 'P8_12', leds: 4, active: false },
    'Suez' : { pin: 'P8_14', leds: 5, active: false }
};

var clear_pin = 'P8_13';

var states = {};

function signal(pin) {
    bone.digitalWrite(pin, 1);
    setTimeout(function() {
        bone.digitalWrite(pin, 0);
    }, 1);
}

function clear() {
    signal(clear_pin);
    for (var i in destinations) {
        destinations[i].active = false;
    }
}

function init() {
    for(var i in destinations) {
        console.log("Setting up " + i);
        var pin = destinations[i].pin;
        states[pin] = 0;
        bone.pinMode(pin, 'out');
        bone.digitalWrite(pin, states[pin]);
    }
    bone.pinMode(clear_pin, 'out');
    clear();
}

function travel(destination, delay, callback) {
    var dest = destinations[destination];
    var leds_left = dest.leds;
    var shiftOnce = function() {
        if (leds_left <= 0) {
            dest.active = true;
            if (callback) {
                callback();
            }
            return;
        }
        signal(dest.pin);
        leds_left -= 1;
        setTimeout(shiftOnce, delay);
    };
    setTimeout(shiftOnce, delay);
}

function getDestinations() {
    var dests = [];
    for (var i in destinations) {
        dests.push({'name': i, 'active': destinations[i].active});
    }
    return dests;
}

exports.clear = clear;
exports.init = init;
exports.travel = travel;
exports.getDestinations = getDestinations;
