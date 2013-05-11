/*
 * This file is part of the conga-dependency-injection module.
 *
 * (c) Marc Roulias <marc@lampjunkie.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

var fs = require('fs');
var should = require('should');

var Tag = require('../lib/tag');

// Tag instantiation
describe('Tag instance instatiation:', function() {
  
  // no id
  it('should throw an error without a service id', function(){
    (function() {
      return new Tag();
    }).should.throwError('Tag requires a valid service id.');
  });
  
  // no config
  it('should throw an error without a config object', function(){
    (function() {
      return new Tag('my.id');
    }).should.throwError('Tag requires a config object.');
  });

});

// Tag instance methods
describe('Tag instance methods:', function() {
  
  var config = {
    name: 'my.tag',
    parameters: {
      a: 'a',
      b: 'b'
    }  
  };
  
  var tag = new Tag('my.service.id', config);
  
  // service id
  it('should return a service id', function(){
    tag.getServiceId().should.eql('my.service.id');
  });
  
  // parameters
  it('should return valid parameters', function(){
    tag.getParameters().should.eql({ a : 'a', b : 'b'});
  });
});