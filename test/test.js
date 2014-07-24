
// **MODULES** //

var chai = require('chai'),        // Expectation library
    utils = require('./utils'),    // Test utilities
    mStream = require('./../lib'); // Module to be tested

// **VARIABLES** //

var expect = chai.expect,
    assert = chai.assert;

// **TESTS** //

describe('mmin', function tests() {
    'use strict';

    // Test 1
    it('should export a factory function', function test() {
	expect(mStream).to.be.a('function');
    });

    // Test 2
    it('should provide a method to get the window size', function test() {
	var tStream = mStream();
	expect(tStream.window()).to.be.a('number'); //why not mStream.window()
    });

    // Test 3
    it('should provide a method to set the window size', function test() {
	var tStream = mStream();
	tStream.window(42);
	assert.strictEqual(tStream.window(),42);
    });

    // Test 4
    it('should not allow a non-numeric window size', function test() {
	var tStream = mStream();

	expect( badValue('5') ).to.throw(Error); // q
	expect( badValue([]) ).to.throw(Error); 
	expect( badValue({}) ).to.throw(Error); 
	expect( badValue(null) ).to.throw(Error); 
	expect( badValue(undefined) ).to.throw(Error); 
	expect( badValue(NaN) ).to.throw(Error); 
	expect( badValue(false) ).to.throw(Error);

	function badValue(value) {
	    return function() {
		tStream.window(value);
	    };
	} 
    }); //end non-numeric window

    // Test 5
    it('should find the min value of the data in the window', function test(done) {
	var data, expected, tStream, WINDOW = 5;

	// Simulate some data
	// simulation contains all dropVal/newVal vs min combos
	data = [2,8,2,13,41,7,9,7,12,24,7,10,4,4,3];
	// Expected values of rolling min in window
	expected = [2,2,2,7,7,7,7,7,4,4,3];

	// Create a new min stream
	tStream = mStream()
	    .window(WINDOW)
	    .stream();
	// Mock reading from the stream
	utils.readStream(tStream,onRead);
	// Mock piping a data to the stream
	utils.writeStream(data,tStream);

	return;

	/**
	 * FUNCTION: onRead(error, actual)
	 * Read event handler. Checks for errors. Compares streamed and expected data.
	 */
	function onRead(error,actual) {
	    expect(error).to.not.exist;

	    assert.lengthOf(actual,data.length-WINDOW+1);
	    assert.closeTo( actual[0], expected[0], 0.001);
	    assert.closeTo( actual[1], expected[1], 0.001);
	    assert.closeTo( actual[2], expected[2], 0.001);
	    assert.closeTo( actual[3], expected[3], 0.001);
	    assert.closeTo( actual[4], expected[4], 0.001);
	    assert.closeTo( actual[5], expected[5], 0.001);
	    assert.closeTo( actual[6], expected[6], 0.001);
	    assert.closeTo( actual[7], expected[7], 0.001);
	    assert.closeTo( actual[8], expected[8], 0.001);
	    assert.closeTo( actual[9], expected[9], 0.001);
	    assert.closeTo( actual[10], expected[10], 0.001);

	    done();

	} //end FUNCTION onRead()
    });

    // Test 6
    it('should calc min of piped data in arb window size', function test(done) {

	var data, expected, tStream, WINDOW = 3;

	// Simulate some data, test all dropVal/newVal combinations
	data = [2,8,2,13,41,7,9,7,12,24,7,10,4,4,3];
	// Expected values of rolling min in window
	expected = [2,2,2,7,7,7,7,7,7,7,4,4,3];

	// Create a new min stream
	tStream = mStream()
	    .window(WINDOW)
	    .stream();
	// Mock reading from the stream
	utils.readStream(tStream,onRead);
	// Mock piping a data to the stream
	utils.writeStream(data,tStream);

	return;

	/**
	 * FUNCTION: onRead(error, actual)
	 * Read event handler. Check for errors. Compare streamed and expected data.
	 */
	function onRead(error,actual) {
	    expect(error).to.not.exist;

	    assert.lengthOf(actual,data.length-WINDOW+1);
	    assert.closeTo( actual[0], expected[0], 0.001);
	    assert.closeTo( actual[1], expected[1], 0.001);
	    assert.closeTo( actual[2], expected[2], 0.001);
	    assert.closeTo( actual[3], expected[3], 0.001);
	    assert.closeTo( actual[4], expected[4], 0.001);
	    assert.closeTo( actual[5], expected[5], 0.001);
	    assert.closeTo( actual[6], expected[6], 0.001);
	    assert.closeTo( actual[7], expected[7], 0.001);
	    assert.closeTo( actual[8], expected[8], 0.001);
	    assert.closeTo( actual[9], expected[9], 0.001);
	    assert.closeTo( actual[10], expected[10], 0.001);
	    assert.closeTo( actual[11], expected[11], 0.001);
	    assert.closeTo( actual[12], expected[12], 0.001);

	    done();
	} //end FUNCTION onRead()
    }); 

      }); //end description of tests

