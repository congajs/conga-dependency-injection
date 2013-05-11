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

var ioc = require('../index');

var ContainerBuilder = ioc.ContainerBuilder;
var Loader = ioc.ServiceLoader;
var SimpleService = require('./src/simple-service');

var loader = new Loader([__dirname + '/src']);

// simple service
describe('ContainerBuilder: Simple Service:', function() {
  
  it('returns a valid service', function(done){
    
    // configure builder with simple config
    var builder = new ContainerBuilder(loader);
    var config = JSON.parse(fs.readFileSync(__dirname + '/config/simple.json', 'utf-8'));
    
    builder.build(config, function(container){
      container.has('simple.service').should.eql(true);
      done();
    });
  });
});

// service with simple arguments
describe('ContainerBuilder: Simple Argument Service:', function() {
  
  it('returns a valid service', function(done){
    
    // configure builder with simple config
    var builder = new ContainerBuilder(loader);
    var config = JSON.parse(fs.readFileSync(__dirname + '/config/simple-arguments.json', 'utf-8'));
    
    builder.build(config, function(container){

      container.has('simple.arguments.service').should.eql(true);
      container.get('simple.arguments.service').should.have.property('one', 'one');
      container.get('simple.arguments.service').should.have.property('two', 2);
      container.get('simple.arguments.service').should.have.property('three', true);
      
      done();
    });
  });
});

// service with complex arguments
describe('ContainerBuilder: Complex Argument Service:', function() {
  
  it('returns a valid service', function(done){
    
    // configure builder with simple config
    var builder = new ContainerBuilder(loader);
    var config = JSON.parse(fs.readFileSync(__dirname + '/config/complex-arguments.json', 'utf-8'));
    
    builder.build(config, function(container){

      // make sure services exist
      container.has('simple.service.one').should.eql(true);
      container.has('simple.service.two').should.eql(true);
      container.has('complex.argument.service').should.eql(true);
      
      // make sure arguments are set
      container.get('complex.argument.service').should.have.property('one');
      container.get('complex.argument.service').should.have.property('two');
      
      // make sure arguments are valid instances
      container.get('complex.argument.service').one.should.be.an.instanceOf(SimpleService);   
      container.get('complex.argument.service').two.should.be.an.instanceOf(SimpleService);

      done();
    });
  });
});

// tagged service
describe('ContainerBuilder: Tagged services:', function() {
  
  it('returns a valid tag', function(done){
    
    // configure builder with simple config
    var builder = new ContainerBuilder(loader);
    var config = JSON.parse(fs.readFileSync(__dirname + '/config/tags.json', 'utf-8'));
    
    builder.build(config, function(container){

      container.getTagsByName('my.tag')[0].getServiceId().should.eql('simple.service.one');
      done();
    });
  });
});

// initialization service
describe('ContainerBuilder: Initialization services:', function() {
  
  it('returns a valid service that is initialized', function(done){
    
    // configure builder with simple config
    var builder = new ContainerBuilder(loader);
    var config = JSON.parse(fs.readFileSync(__dirname + '/config/initialization.json', 'utf-8'));
    
    builder.build(config, function(container){

      // make sure services exist
      container.has('initialization.service.one').should.eql(true);
      container.has('initialization.service.two').should.eql(true);
      
      container.get('initialization.service.one').isInitialized.should.eql(true);
      container.get('initialization.service.two').isInitialized.should.eql(true);      
      done();
    });
  });
});

// module service
describe('ContainerBuilder: Module service:', function() {
  
  it('returns a valid module', function(done){
    
    // configure builder with simple config
    var builder = new ContainerBuilder(loader);
    var config = JSON.parse(fs.readFileSync(__dirname + '/config/module.json', 'utf-8'));
    
    builder.build(config, function(container){

      // make sure services exist
      container.has('fs.service').should.eql(true);
      container.get('fs.service').should.have.property('rename');
      
      done();
    });
  });
});

//module service
describe('ContainerBuilder: Setter service:', function() {
  
  it('run call methods and set values', function(done){
    
    // configure builder with simple config
    var builder = new ContainerBuilder(loader);
    var config = JSON.parse(fs.readFileSync(__dirname + '/config/calls.json', 'utf-8'));
    
    builder.build(config, function(container){

      // make sure services exist
      container.has('setter.service').should.eql(true);
      container.get('setter.service').should.have.property('foo', 'bar');
      container.get('setter.service').should.have.property('something', 'else');      
      done();
    });
  });
});