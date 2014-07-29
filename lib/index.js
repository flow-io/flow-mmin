/**
*
*     STREAM: moving minimum
*
*
*     DESCRIPTION:
*        - Transform stream factory to find sliding-window minimum values (moving min) over a numeric data stream.
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
*        [1] through2
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

    var through2 = require( 'through2' );

    // FUNCTIONS //

    /**
    * FUNCTION: getBuffer(W)
    *   Returns a buffer array pre-initialized to 0.
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
    *   Returns a callback which calculates a moving minimum.
    *
    * @private
    * @param {Number} W - window size
    * @returns {Function} callback
    */
    function onData(W) {
        var buffer = getBuffer(W),
            full = false,
            dropVal,
            N = 0,
            min = Number.POSITIVE_INFINITY;

        // Initialize min to be > any potential array value.

        /**
        * FUNCTION: onData(newVal, encoding, clbk)
        *   Data event handler. Calculates the moving minimum.
        *
        * @private
        * @param {Number} newVal - streamed data value
        * @param {String} encoding
        * @param {Function} clbk - callback to invoke after finding a min value. Function accepts two arguments: [ error, chunk ].
        */
        return function onData(newVal,  encoding, clbk) {
            // Fill buffer of size W and find initial min:
            if (!full) {
                buffer[N] = newVal;
                if (buffer[N] < min) {
                    min = buffer[N];
                }
                N++;

                if (N===W) {
                    full = true;
                    this.push(min);
                }
                clbk();
                return;
            }

            // Update buffer: (drop old value, add new)
            dropVal = buffer.shift();
            buffer.push(newVal);

            // Find the min...

            // Case 1:      
            if (newVal < min) {
                min = newVal;
            }
            // Case 2:
            if (dropVal === min && newVal > min){
                min = buffer[0];
                for (var j=1; j<W; j++) {
                    if (buffer[j] < min) {
                        min = buffer[j];
                    }
                }
            }
            clbk(null, min);
        }; // end FUNCTION onData()
    } // end FUNCTION onData()


    // STREAM //

    /**
    * FUNCTION: Stream()
    *  Stream constructor.
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
    *   Window size setter/getter. If a value is provided, sets the window size. If no value is provided, returns the window size.
    *
    * @param {Number} value - window size
    * @returns {Stream|Number} stream instance or window size
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
    *   Returns a through stream which finds the sliding-window minimum.
    *
    * @returns {object} through stream
    */
    Stream.prototype.stream = function(){
        return through2({'objectMode': true}, onData(this._window));
    }; // end METHOD stream()

    // EXPORTS //

    module.exports = function createStream() {
        return new Stream();
    };

})();