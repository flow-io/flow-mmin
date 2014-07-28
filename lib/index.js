/**
*
*     STREAM: moving minimum
*
*
*     DESCRIPTION:
*        - Transform stream which finds the minimum value in a sliding-window (moving-min) in a numeric data stream.
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
*     COPYRIGHT (C) 2014. Rebekah Smith.
*
*
*     AUTHOR:
*        Rebekah Smith. rebekahjs17@gmail.com. 2014.
*
*/

(function() {
    'use strict';

    // MODULES //

    var through = require( 'through' );

    // FUNCTIONS //

    /**
     * FUNCTION: getBuffer(W)
     * Returns a buffer array, each element pre-initialised to 0
     * 
     * @private
     * @param {Number} W - buffer size
     * @returns {Array} buffer
     */
    function getBuffer(W) {
	var buffer = new Array(W);
	for (var i = 0; i < W; i++) {
	    buffer[i] = 0;
	}
	return buffer;
    } // end FUNCTION getBuffer()


    /**
     * FUNCTION: onData(W)
     * Returns a callback which calculates a moving minimum.
     * Invoked upon receiving new data.
     *
     * @private
     * @param {Number} W - window size
     * @returns {Function} callback
     */
    function onData(W) {
	var buffer = getBuffer(W), 
	full = false, 
	dropVal,      // value leaving the buffer window
	N = 0,        // buffer element
	min = Number.POSITIVE_INFINITY;   // min value in buffer window 
        // initialise min to be > any potential array value

	/**
	 * FUNCTION: onData(newVal)
	 * Data event handler. Calculates the moving minimum.
	 *
	 * @private
	 * @param {number} newVal - new streamed data value
	 */
	return function onData(newVal) {
	    // Fill buffer of size W, find initial min
	    if (!full) {
		buffer[N] = newVal; 
		if (buffer[N] < min) {min = buffer[N];}
		N++;

		if (N===W) {
		    full = true;
		    this.queue(min);
		}
		return;
	    } // buffer array width W filled, first min found

	    // Update buffer: (drop old value, add new)
	    dropVal = buffer.shift(); 
	    buffer.push(newVal); 

            // Find moving min	       
	    if (newVal < min) {min = newVal;} // (dropVal===min and dropVal>min)
	    if (dropVal === min && newVal > min){
		min = buffer[0];           
		for (var j=1; j<W; j++) {
		    if (buffer[j] < min) {min = buffer[j];}
		}
	    }
	    //if (dropVal > min && newVal > min) // no change
	    //if (newVal===min) // no change (dropVal===min and dropVal>min)

	    // Queue current min
	    this.queue(min);

	}; // end FUNCTION onData(newVal)
    } // end FUNCTION onData(W)


    // STREAM //

    /**
     * FUNCTION: Stream()
     * Stream constructor
     *
     * @constructor
     * @returns {Stream} Stream instance
     */
    function Stream() {
	this._window = 5; //default window size
	return this;
    } // end FUNCTION Stream()


    /**
     * METHOD: window(value)
     * Window size setter/getter. If a value is provided, sets the window size. If no value is provided, returns the window size.
     *
     * @param {Number} value - window size
     * @returns {Stream|number} stream instance or window size
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
     * Returns a through stream which finds the sliding-window minimum.
     *
     * @returns {object} through stream
     */
    Stream.prototype.stream = function(){
	return through(onData(this._window));
    }; // end METHOD stream()

    // EXPORTS //

    module.exports = function createStream() {
	return new Stream();
    };

})();