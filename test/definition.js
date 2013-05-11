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

var Definition = require('../lib/definition');

// Definition instantiation
describe('Definition instance instatiation:', function() {
  
  // no config
  it('should throw an error without a config object', function(){
    (function() {
      return new Definition();
    }).should.throwError('Definition requires a config object.');
  });
  
  // no id config
  it('should throw an error without an id config property', function(){
    (function() {
      return new Definition({ constructor : 'foo'});
    }).should.throwError('Definition config must have an "id" property.');
  });
  
  // invalid id config
  it('should throw an error with an invalid id config property', function(){
    (function() {
      return new Definition({ id : 123, constructor : 'foo'});
    }).should.throwError('Definition config must have an "id" property.');
  });
  
  // no constructor config
  it('should throw an error without a constructor config property', function(){
    (function() {
      return new Definition({ id : 'my.id' });
    }).should.throwError('Definition config must have a "constructor" property.');
  });  

  // invalid constructor config
  it('should throw an error with an invalid constructor config property', function(){
    (function() {
      return new Definition({ id : 'my.id', constructor : {} });
    }).should.throwError('Definition config must have a "constructor" property.');
  });  
});

// Definition methods
describe('Definition instance methods:', function() {
  
  var config = {
    id: 'my.id',
    constructor: 'my.constructor',
    arguments: ['@service.a', '@service.b'],
    calls: [{ method : 'setServiceC', arguments : ['@service.c'] }],
    tags: [{}],
    initialization: {}
  };
  
  var definition = new Definition(config);
  
  // id
  it('should return an id', function(){
    definition.getId().should.eql('my.id');
  });
  
  // constructor
  it('should return a constructor', function(){
    definition.getConstructor().should.eql('my.constructor');
  });
  
  // arguments
  it('should have arguments', function(){
    definition.hasArguments().should.eql(true);
  });
  
  // valid arguments
  it('should return valid arguments', function(){
    definition.getArguments().should.eql(['@service.a', '@service.b']);
  });
  
  // calls
  it('should have calls', function(){
    definition.hasCalls().should.eql(true);
  });
  
  // valid calls
  it('should return valid calls', function(){
    definition.getCalls().should.eql([{ method : 'setServiceC', arguments : ['@service.c'] }]);
  });
  
  // tags
  it('should have tags', function(){
    definition.hasTags().should.eql(true);
  });
  
  // valid tags
  it('should return valid tags', function(){
    definition.getTags().should.eql([{}]);
  });
  
  // initialization
  it('should have initialization', function(){
    definition.hasInitialization().should.eql(true);
  });
  
  // valid initialization
  it('should return valid initialization', function(){
    definition.getInitialization().should.eql({});
  });
  
  // dependency ids
  it('should return valid dependency ids', function(){
    definition.getDependencyIds().should.eql(['service.a', 'service.b', 'service.c']);
  });
  
});