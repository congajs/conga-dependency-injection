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
  var __parameters = {};
  
  /**
   * Array of registered service instances
   * 
   * @var {Object}
   */
  var __services = {};
  
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
  var __tags = {};

  /**
   * Get a service object by it's id
   * 
   * @param id
   * @returns
   */
  this.get = function(id){
    if(id in __services){
      return __services[id];
    }
  };
  
  /**
   * Set a service object
   * 
   * @param {String} id
   * @param {Object} obj
   */
  this.set = function(id, obj){
    if((typeof obj !== 'object') && (typeof object !== 'function')){
      throw new Error('Container.set requires a function or object for: ' + id + '.');
    }
    __services[id] = obj;
  };
  
  /**
   * Check if the service exists
   * 
   * @param {String} id
   * @returns {Boolean}
   */
  this.has = function(id){
    return !(typeof __services[id] === 'undefined');
  };
  
  /**
   * Set all the parameters at once
   * 
   * @param {Object} p
   * @returns {void}
   */
  this.setParameters = function(parameters){
    __parameters = parameters;
  };
  
  /**
   * Get all of the parameters
   * 
   * @returns {Array}
   */
  this.getParameters = function(){
    return __parameters;
  };
  
  /**
   * Get a parameter by it's name
   * 
   * @param {String} name
   * @return {mixed}
   */
  this.getParameter = function(name){
    return __parameters[name];
  };
  
  /**
   * Set a parameter
   * 
   * @param {String} name
   * @param {mixed} value
   */
  this.setParameter = function(name, value){
    __parameters[name] = value;
  };
  
  /**
   * Check if given parameter exists
   * 
   * @param {String} name
   * @returns {Boolean}
   */
  this.hasParameter = function(name){
    return typeof __parameters[name] !== 'undefined';
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
    
    if(typeof __tags[name] === 'undefined'){
      __tags[name] = [];
    }
    __tags[name].push(tag);
  };
  
  /**
   * Get all of the tags with the given name
   * 
   * @param name
   * @returns {Array}
   */
  this.getTagsByName = function(name){
    return __tags[name];
  };
};

module.exports = Container;