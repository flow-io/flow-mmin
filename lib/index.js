/**
*
*     STREAM: moving minimum
*
*
*     DESCRIPTION:
*        - Finds the minimum value in a window of chosen size moving through a numeric data stream
*
*
*     NOTES:
*
*
*     TODO:
*
*
*     HISTORY:
*        - 2014/07/15: Created. [RJSmith]
*
*     DEPENDENCIES:
*        [1] through
*
*     LICENSE:
*        MIT
*
*     COPYRIGHT (C) 2014.
*
*
*     AUTHOR:
*        Rebekah Smith
*
*/

(function() {
    'use strict';

// **MODULES** //

var // through module 
    through = require( 'through' );

// **FUNCTIONS** //

    /**
     * FUNCTION: getBuffer(W)
     * Returns a buffer array, each element pre-initialised to 0
     * 
     * @private
     * @param {number} W - buffer size
     * @returns {array} buffer
     */
    function getBuffer(W) {
	var buffer = new Array(W);
	for (var i = 0; i < W; i++) buffer[i] = 0;
	return buffer;
    } //end FUNCTION getBuffer


    /**
     * FUNCTION: onData(W)
     * Invoked upon receiving new data
     * Returns a callback which calculates a moving minimum
     *
     * @private
     * @param {number} W - window size
     * @returns {function} callback
     */
    function onData(W) {
	var buffer = getBuffer(W), 
	full = false, 
	dropVal,    // value leaving the buffer window
	N = 0,      // buffer element
	min = Number.POSITIVE_INFINITY;   // min value inbuffer window 
                    // initialise > any potential array value

	/**
	 * FUNCTION: onData(newVal)
	 * data event handler. Calculates the moving minimum.
	 *
	 * @private
	 * @param {number} newVal - new streamed data value
	 */
	return function onData(newVal) {
	    // Fill buffer of size W, find initial min
	    if (!full) {
		buffer[N] = newVal; // set array element N to new data value
		if (buffer[N] < min) {min = buffer[N];}
		N++;             // increment N

		if (N===W) {        // check if buffer contains W elements
		    full = true;

                    // old method to find min in first full buffer
		    /*min = buffer[0]; //initialize min with first data entry
		    for(var i=1; i<N; i++){ //find min in initial buffer
			if (buffer[i] < min) {
			    min = buffer[i];
			}
		    }*/
		    this.queue(min); // add initial min to output
		}
		return;
	    } // buffer array width W filled

	    // Update window buffer: drop old value, add new
	    dropVal = buffer.shift(); 
	    buffer.push(newVal); 

            // Find min in new window buffer
	      // true for dropVal===min and dropVal>min	   
	    if (newVal < min) {min = newVal;}
	      // no info - research buffer
	    if (dropVal === min && newVal > min){
		min = buffer[0];           // reset min to first buffer element
		for (var j=1; j<W; j++) {  //compare to rest of window buffer
		    if (buffer[j] < min) {min = buffer[j];}
		}
	    }
	    //if (dropVal > min && newVal > min){min = min;} // no change
	    //if (newVal===min){min = min;} // no change (true for dropVal>=min)

	    // Queue value
	    this.queue(min);

	}; //end FUNCTION onData(newVal)
    } //end FUNCTION onData(W)


    // **STREAM** //

    /**
     * FUNCTION: Stream()
     * Stream constructor
     *
     * @returns {object} Stream instance
     */
    function Stream() {
	this._window = 5; //default window size
	return this;
    } //end Stream() function


    /**
     * METHOD: window(value)
     * Set/get window size.
     *
     * @param {number} value - window size
     * @returns {object|number} instance object or window size
     */
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


    /**
     * METHOD: stream()
     * Returns a through stream for the moving min
     */
    Stream.prototype.stream = function(){
	return through(onData(this._window));
    }; // end METHOD stream()

    // **EXPORTS**

    module.exports = function createStream() {
	return new Stream();
    };

})();