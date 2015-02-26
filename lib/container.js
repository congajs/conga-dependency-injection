/*
 * This file is part of the conga-dependency-injection module.
 *
 * (c) Marc Roulias <marc@lampjunkie.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

var Tag = require('./tag');

/**
 * The dependency injection container
 * 
 * This object holds on to service object references
 * and parameters which are key => value pairs
 * 
 * @author Marc Roulias <marc@lampjunkie.com>
 */
var Container = function(){
  
  /**
   * Hash of registered parameters
   * 
   * @var {Object}
   */
  this.__parameters = {};
  
  /**
   * Array of registered service instances
   * 
   * @var {Object}
   */
  this.__services = {};
  
  /**
   * Hash of Tags
   * 
   * Format:
   * {
   *   my_tag_name: [
   *     tag1,
   *     tag2,
   *     ...
   *   ]
   * }
   * 
   * @var {Object}
   */
  this.__tags = {};

  /**
  * Scope of the service. Currently:
  * global - service is a singleton.
  * request - service instance lives for the duration of a request.
  */
  this.__scope = {};

  /**
   * Get a service object by it's id
   * 
   * @param id
   * @returns
   */
  this.get = function(id){
    if(id in this.__services){
      return this.__services[id];
    }
  };
  
  /**
   * Set a service object
   * 
   * @param {String} id
   * @param {Object} obj
   */
  this.set = function(id, obj){
    if((typeof obj !== 'object') && (typeof obj !== 'function')){
      throw new Error('Container.set requires a function or object for: ' + id + '.');
    }
    this.__services[id] = obj;
  };
  
  /**
   * Check if the service exists
   * 
   * @param {String} id
   * @returns {Boolean}
   */
  this.has = function(id){
    return !(typeof this.__services[id] === 'undefined');
  };

  /**
   * Get all of the registered services
   * 
   * @return {Array}
   */
  this.getServices = function(){
    return this.__services;
  };
  
  /**
   * Set all the parameters at once
   * 
   * @param {Object} p
   * @returns {void}
   */
  this.setParameters = function(parameters){
    this.__parameters = parameters;
  };
  
  /**
   * Get all of the parameters
   * 
   * @returns {Array}
   */
  this.getParameters = function(){
    return this.__parameters;
  };
  
  /**
   * Get a parameter by it's name
   * 
   * @param {String} name
   * @return {mixed}
   */
  this.getParameter = function(name){
    return this.__parameters[name];
  };
  
  /**
   * Set a parameter
   * 
   * @param {String} name
   * @param {mixed} value
   */
  this.setParameter = function(name, value){
    this.__parameters[name] = value;
  };
  
  /**
   * Check if given parameter exists
   * 
   * @param {String} name
   * @returns {Boolean}
   */
  this.hasParameter = function(name){
    return typeof this.__parameters[name] !== 'undefined';
  };

  /**
   * Set the scope of the service
   * @param {String} id of the service
   * @param {String} scope
   */
  this.setScope = function(id, scope){
      this.__scope[id] = scope;
  };

  /**
   * Get the scope for a service
   * @param {String} id of the service
   * @returns {String}
   */
  this.getScope = function(id){
      var scope = 'global';
      if (typeof this.__scope[id] !== 'undefined'){
          scope = this.__scope[id];
      }
      return scope;
  };

  /**
   * Add a new Tag
   * 
   * @param {String} name
   * @param {Tag} tag
   * @returns {void}
   */
  this.addTag = function(name, tag){
    if(!(tag instanceof Tag)){
      throw new Error('Invalid tag passed to Container.addTag: ' + name + '.');
    }
    
    if(typeof this.__tags[name] === 'undefined'){
      this.__tags[name] = [];
    }
    this.__tags[name].push(tag);
  };
  
  /**
   * Get all of the tags with the given name
   * 
   * @param name
   * @returns {Array}
   */
  this.getTagsByName = function(name){
    return this.__tags[name];
  };

  /**
   * Create an instance and populate with the existing data
   * @param container
   * @returns {Container}
   */
   this.copy = function() {
    var obj = new Container();
    obj.__tags = this.__tags;
    obj.__parameters = this.__parameters;
    obj.__services = this.__services;
    obj.__scope = this.__scope;
    return obj;
  };
};

module.exports = Container;