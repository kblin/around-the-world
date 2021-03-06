var bone = require("./fakebonescript");

var destinations = {
    'Paris' : { pin: 'P8_11', leds: 2, active: false },
    'Venice' : { pin: 'P8_11', leds: 3, active: false },
    'Suez' : { pin: 'P8_11', leds: 8, active: false },
    'P_Fx_Fg' : { pin: 'P8_11', leds: 5, active: false },
    'Fogg_Bisland' : { pin: 'P8_11', leds: 3, active: false },
    'Bombay' : { pin: 'P8_11', leds: 3, active: false },
    'Train_stop' : { pin: 'P8_11', leds: 4, active: false },
    'Aouda' : { pin: 'P8_11', leds: 2, active: false },
    'Calcotta' : { pin: 'P8_11', leds: 2, active: false },
    'HongKong' : { pin: 'P8_11', leds: 14, active: false },
    'Carnatic' : { pin: 'P8_11', leds: 4, active: false },
    'Yokohama' : { pin: 'P8_11', leds: 2, active: false },
    'GenGrantStop1' : { pin: 'P8_11', leds: 4, active: false },
    'Aoudas_story' : { pin: 'P8_11', leds: 8, active: false }, /* to Yokohama */
    'MarieCeleste' : { pin: 'P8_11', leds: 4, active: false },
    'Nautilus' : { pin: 'P8_11', leds: 1, active: false },
    'SanFrancisco' : { pin: 'P8_11', leds: 3, active: false },
    'Bridge' : { pin: 'P8_11', leds: 4, active: false },
    'Duel' : { pin: 'P8_11', leds: 2, active: false },
    'NewYork' : { pin: 'P8_11', leds: 7, active: false },
    'Mutiny' : { pin: 'P8_11', leds: 3, active: false },
    'Fix_Figgs' : { pin: 'P8_11', leds: 2, active: false },
    'Upcoming_storm' : { pin: 'P8_11', leds: 2, active: false },
    'Out_of_coal' : { pin: 'P8_11', leds: 2, active: false },
    'Burn1' : { pin: 'P8_11', leds: 2, active: false },
    'Burn2' : { pin: 'P8_11', leds: 2, active: false },
    'Burn3' : { pin: 'P8_11', leds: 2, active: false },
    'Liverpool' : { pin: 'P8_11', leds: 2, active: false },
    'London' : { pin: 'P8_11', leds: 1, active: false }
};

var clear_pin = 'P8_13';

var states = {};
var leds = 0;
var offset = 0;

function signal(pin) {
    bone.digitalWrite(pin, 1);
    setTimeout(function() {
        bone.digitalWrite(pin, 0);
    }, 1);
}

function clear(callback) {
    bone.digitalWrite(clear_pin, 0);
    setTimeout(function() {
        bone.digitalWrite(clear_pin, 1);
        if (callback) {
            callback();
        }
    }, 1);
    for (var i in destinations) {
        destinations[i].active = false;
    }
    leds = 0;
    offset = 0;
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
    bone.pinMode('USR0', 'out');
    bone.pinMode('USR1', 'out');
    bone.pinMode('USR2', 'out');
    bone.pinMode('USR3', 'out');
    bone.digitalWrite('USR0', 0);
    bone.digitalWrite('USR1', 0);
    bone.digitalWrite('USR2', 0);
    bone.digitalWrite('USR3', 0);
}

function travel(destination, delay, callback) {
    var dest = destinations[destination];
    var leds_left = dest.leds - offset;
    offset -= dest.leds;
    offset = Math.max(0, offset);
    var shiftOnce = function() {
        if (leds_left <= 0) {
            dest.active = true;
            if (callback) {
                callback();
            }
            return;
        }
        signal(dest.pin);
        leds++;
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

function next() {
    signal('P8_11');
    return ++leds;
}

function delay() {
    offset += 1;
    return offset;
}

function getOffset() {
    return offset;
}

exports.clear = clear;
exports.init = init;
exports.travel = travel;
exports.getDestinations = getDestinations;
exports.next = next;
exports.delay = delay;
exports.getOffset = getOffset;
