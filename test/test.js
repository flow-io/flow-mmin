
// MODULES //

var chai = require('chai'),         // Expectation library
    utils = require('./utils'),     // Test utilities
    minStream = require('./../lib');  // Module to be tested

// VARIABLES //

var expect = chai.expect,
    assert = chai.assert;

// TESTS //

describe('moving-min', function tests() {
    'use strict';

    // Test 1
    it('should export a factory function', function test() {
		expect(minStream).to.be.a('function');
    });

    // Test 2
    it('should provide a method to set/get the window size', function test() {
		var tStream = minStream();
		expect(tStream.window).to.be.a('function');
    });

    // Test 3
    it('should provide a method to set the window size', function test() {
		var tStream = minStream();
		tStream.window(42);
		assert.strictEqual(tStream.window(),42);
    });

    // Test 4
    it('should not allow a non-numeric window size', function test() {
		var tStream = minStream();

		expect( badValue('5') ).to.throw(Error);
		expect( badValue([]) ).to.throw(Error);
		expect( badValue({}) ).to.throw(Error);
		expect( badValue(null) ).to.throw(Error);
		expect( badValue(undefined) ).to.throw(Error);
		expect( badValue(NaN) ).to.throw(Error);
		expect( badValue(false) ).to.throw(Error);
		expect( badValue(function(){}) ).to.throw(Error);

		function badValue(value) {
			return function() {
				tStream.window(value);
			};
		}
    }); //end non-numeric window

    // Test 5
    it('should find the min value of the data in the window', function test(done) {
		var data, expected, tStream, WINDOW = 5;

		// Simulate some data (simulation contains all dropVal/newVal Vs min combinations):
		data = [2,8,2,13,41,7,9,7,12,24,7,10,4,4,3];

		// Expected values of min in moving window:
		expected = [2,2,2,7,7,7,7,7,4,4,3];

		// Create a new moving min stream:
		tStream = minStream()
			.window(WINDOW)
			.stream();

		// Mock reading from the stream:
		utils.readStream(tStream,onRead);

		// Mock piping a data to the stream:
		utils.writeStream(data,tStream);

		return;

		/**
		* FUNCTION: onRead(error, actual)
		* Read event handler. Checks for errors. Compares streamed and expected data.
		*/
		function onRead(error,actual) {
			expect(error).to.not.exist;

			assert.lengthOf(actual,data.length-WINDOW+1);

			for (var i = 0; i < expected.length; i++ ) {
				assert.strictEqual( actual[i], expected[i] );
			}
			done();
		} //end FUNCTION onRead()
    });

    // Test 6
    it('should find the min value of piped data in an arbitrary window size', function test(done) {

		var data, expected, tStream, WINDOW = 3;

		// Simulate some data:
		data = [2,8,2,13,41,7,9,7,12,24,7,10,4,4,3];

		// Expected values of min in moving window:
		expected = [2,2,2,7,7,7,7,7,7,7,4,4,3];

		// Create a new moving min stream:
		tStream = minStream()
			.window(WINDOW)
			.stream();

		// Mock reading from the stream:
		utils.readStream(tStream,onRead);

		// Mock piping a data to the stream:
		utils.writeStream(data,tStream);

		return;

		/**
		* FUNCTION: onRead(error, actual)
		* Read event handler. Check for errors. Compare streamed and expected data.
		*/
		function onRead(error,actual) {
			expect(error).to.not.exist;

			assert.lengthOf(actual,data.length-WINDOW+1);

			for (var i = 0 ; i < expected.length; i++ ) {
				assert.strictEqual( actual[i], expected[i]);
			}
			done();
		} //end FUNCTION onRead()
    });

}); //end description of tests

