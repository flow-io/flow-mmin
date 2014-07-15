(function() {
    'use strict';

// REQUIRED MODULES //

var // through module 
through = require( 'through' );

// FUNCTIONS //

// **getBuffer(W)**
// create buffer array, size W, to hold section of stream to operate on
// pre-initialize elements to zero

    function getBuffer(W) {
	var buffer = new Array(W);
	for (var i = 0; i < W; i++) buffer[i] = 0;
	return buffer;
    } //end getBuffer

// **onData(W)**
// calculates moving min, invoked on receiving new data

    function onData(W) {
	var buffer = getBuffer(W), 
	full = false, dropVal, N = 0,
	min; //could initialize min to highest allowed int, or set equal to first data entry 

	// **onData(newVal)** (within onData(W))
	// calculates sum of values in moving window (buffer array)

	return function onData(newVal) {
	    // Initial filling of buffer array (continue until W elements filled)
	    if (!full) {
		buffer[N] = newVal; //set array element N to new data value

		N += 1; //increment N

		if (N===W) { //stop once W elements added to buffer, find initial min
		    full = true;

		    min = buffer[0]; //initialize min with first data entry
		    for(var i=1; i<N; i++){ //find min in initial buffer
			if (buffer[i] < min) {
			    min = buffer[i];
			}
		    }
		    this.queue(min); // 
		}
		return;
	    } // buffer array width W filled

	    // Update buffer: drop old value, add new
	    dropVal = buffer.shift(); //drop current first element, label
	    buffer.push(newVal); // add element containing newVal to end of array

            // Find new min	   
	    if (newVal <= min) {min = newVal;} // true for dropVal==min and dropVal>min
	    if (dropVal == min && newVal > min){ //clueless - re-search buffer
		min = buffer[0]; //reset min to first value in current window
		for (var j=1; j<W; j++) { //compare to rest of window
		    if (buffer[j] < min) {min = buffer[j];}
		}
	    }
	    //if (dropVal > min && newVal > min) {min = min;} // not needed
            // 6 combos

	    //alt version
            /*if (newVal <= min) { //even if old min was dropped, newVal must be lowest in buffer
		min = newVal;
	    } else if (dropVal > min && newVal > min) { // old min ! dropped or replaced so still valid
		min = min;
	    } else {
		for (j=0; j<W; j++) {
		    if (buffer[j] < min) min = buffer[j]; //re-search buffer as not enough info
		}
	    }*/

	    // Queue value
	    this.queue(min);

	};//end onData(newVal) function
    }//end onData(W) function

// STREAM //

// **Stream()**
// Stream constructor

    function Stream() {
	this._window = 5; //default window size
	return this;
    } //end Stream() function


// **METHOD** window(value)
// Set window size if value provided. Return window size if not provided.
    Stream.prototype.window = function(value) {
	if (!arguments.length) {
	    return this._window;
	}
	if(typeof value !== 'number' || value !== value) {
	    throw new Error('window()::invalid input argument. Window must be numeric.');
	}
	this._window = value;
	return this;
    }; // end METHOD window()

// **METHOD** stream()
// Returns a through stream for calc the moving min.
    Stream.prototype.stream = function(){
	return through(onData(this._window));
    }; // end METHOD stream()

// **EXPORTS**

    module.exports = function createStream() {
	return new Stream();
    };

})();