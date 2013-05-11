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

var loader = new Loader([__dirname + '/src']);

// configure builder with simple config
var builder = new ContainerBuilder(loader);
var config = JSON.parse(fs.readFileSync(__dirname + '/config/dependency.json', 'utf-8'));

builder.build(config, function(container){

  describe('ContainerBuilder: Dependency Order:', function() {
    
    it('has valid services', function(done){
      container.has('service.a').should.eql(true);
      container.has('service.b').should.eql(true);
      container.has('service.c').should.eql(true);
      container.has('service.d').should.eql(true);
      done();
    });

    it('services are all initialized', function(done){
      container.get('service.a').isInitialized.should.eql(true);
      container.get('service.b').isInitialized.should.eql(true);
      container.get('service.c').isInitialized.should.eql(true);
      container.get('service.d').isInitialized.should.eql(true);      
      done();
    });

    it('services initialized in correct order', function(done){
      container.get('service.c').isAInitialized.should.eql(true);
      container.get('service.c').isBInitialized.should.eql(true);
      container.get('service.d').isAInitialized.should.eql(true);
      container.get('service.d').isBInitialized.should.eql(true);
      done();
    });

  });
});