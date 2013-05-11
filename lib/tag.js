/*
 * This file is part of the conga-dependency-injection module.
 *
 * (c) Marc Roulias <marc@lampjunkie.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

/**
 * This object holds all of the information for a tag
 * 
 * @author Marc Roulias <marc@lampjunkie.com>
 * 
 * @param {String} serviceId
 * @param {Object} config
 */
var Tag = function(serviceId, config){
  
  /**
   * The tag's associated service id
   * 
   * @var {String}
   */
  var __serviceId = serviceId;
  
  /**
   * The tag's config object
   * 
   * @var {Object}
   */
  var __config = config;

  // validate the service id
  if(typeof __serviceId !== 'string' || __serviceId === ''){
    throw new Error('Tag requires a valid service id.');
  }
  
  // make sure that there's a config object
  if(typeof __config === 'undefined'){
    throw new Error('Tag requires a config object.');
  }
  
  /**
   * ================================================================
   * Public methods
   * ================================================================
   */
  
  /**
   * Get the service id
   * 
   * @returns {String}
   */
  this.getServiceId = function(){
    return __serviceId;
  };

  /**
   * Get the parameters
   * 
   * @returns {Object}
   */
  this.getParameters = function(){
    return __config.parameters;
  };
  
  /**
   * Get a parameter by it's name
   * 
   * @param {String} name
   * @returns {Mixed}
   */
  this.getParameter = function(name){
    return __config.parameters[name];
  };
};

module.exports = Tag;