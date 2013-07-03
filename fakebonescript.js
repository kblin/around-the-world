function pinMode(pin, mode) {
    console.log("Set pin '" + pin + "' to mode '" + mode + "'");
}

function digitalWrite(pin, value) {
    console.log("Write '" + value + "' to pin '" + pin + "'");
}

exports.pinMode = pinMode;
exports.digitalWrite = digitalWrite;
