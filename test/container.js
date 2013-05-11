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

var Container = require('../lib/container');
var Tag = require('../lib/tag');

// test services
var SimpleService = require('./src/simple-service');

// Container methods
describe('Container methods:', function() {
  
  var container = new Container();
  
  // set invalid service
  it('should throw an error when setting an invalid service', function(){
    (function() {
      container.set('my.service', 'invalid service');
    }).should.throwError('Container.set requires a function or object for: my.service.');
  });

  // add invalid Tag
  it('should throw an error when adding an invalid Tag', function(){
    (function() {
      container.addTag('my.tag', 'invalid tag');
    }).should.throwError('Invalid tag passed to Container.addTag: my.tag.');
  });
  
  // set valid service
  if('should set and get a valid service', function(){
    var service = new SimpleService();
    container.set('my.service', service);
    container.has('my.service').should.eql(true);
    container.get('my.service').should.eql(service);
  });
  
  // set valid parameter
  if('should set and get a valid parameter', function(){
    container.setParameter('my.parameter', 'my parameter');
    container.hasParameter('my.parameter').should.eql(true);
    container.getParameter('my.parameter').should.eql('my parameter');
  });  
});