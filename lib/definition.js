/*
 * This file is part of the conga-dependency-injection module.
 *
 * (c) Marc Roulias <marc@lampjunkie.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

/**
 * This class holds all of the information
 * about a service definition
 * 
 * @author Marc Roulias <marc@lampjunkie.com>
 */
var Definition = function(config){
  
  /**
   * The config object for the Definition
   * 
   * @var {Object}
   */
  var __config = config;
  
  // make sure that there's a config object
  if(typeof __config === 'undefined'){
    throw new Error('Definition requires a config object.');
  }
  
  // validate the id
  if(typeof __config.id !== 'string' || __config.id === '' || __config.id === null){
    throw new Error('Definition config must have an "id" property.');
  }
  
  // validate the constructor
  if(typeof __config.constructor !== 'string' || __config.constructor === '' || __config.constructor === null){
    throw new Error('Definition config must have a "constructor" property.');
  }
  
  /**
   * ================================================================
   * Public methods
   * ================================================================
   */
  
  /**
   * Get the Definition's service id
   * 
   * @returns {String}
   */
  this.getId = function(){
    return __config.id;
  };
    
  /**
   * Get the associated class
   * 
   * @returns {String}
   */
  this.getConstructor = function(){
    return __config.constructor;
  };
    
  /**
   * Get the arguments
   * 
   * @returns {Array}
   */
  this.getArguments = function(){
    return __config.arguments;
  };
    
  /**
   * Check if there are arguments
   * 
   * @returns {Boolean}
   */
  this.hasArguments = function(){
    return (__config.arguments instanceof Array && __config.arguments.length > 0);
  };
    
  /**
   * Check if there are method calls
   * 
   * @returns {Boolean}
   */
  this.hasCalls = function(){
    return (__config.calls instanceof Array && __config.calls.length > 0);
  };
    
  /**
   * Get the method calls
   * 
   * @returns {Array}
   */
  this.getCalls = function(){
    return __config.calls;
  };
    
  /**
   * Check if there are tags
   * 
   * @returns {Boolean}
   */
  this.hasTags = function(){
    return (__config.tags instanceof Array && __config.tags.length > 0);      
  };
    
  /**
   * Get the tags
   * 
   * @returns {Array}
   */
  this.getTags = function(){
    return __config.tags;
  };

  /**
   * Checks for the existence of scope defintion.
   */
  this.hasScope = function(){

    return (typeof __config.scope != 'undefined');
  };

  /**
   * returns the service scope defintion
   * @returns {*}
   */
  this.getScope = function(){
    return __config.scope;
  };

  /**
   * Check if there is an initialization
   * 
   * @returns {Boolean}
   */
  this.hasInitialization = function(){
    return (typeof __config.initialization != 'undefined');
  };
    
  /**
   * Get the initialization config
   * 
   * @returns {Object}
   */
  this.getInitialization = function(){
    return __config.initialization;
  };
    
  /**
   * Get an array of dependency definition ids
   * 
   * @returns {Array}
   */
  this.getDependencyIds = function(){
    var ids = [];
    
    // arguments
    for(var i in __config.arguments){
      if(typeof __config.arguments[i] === 'string' && __config.arguments[i][0] === '@'){
        ids.push(__config.arguments[i].substr(1, __config.arguments[i].length));
      }
    }
    
    // calls
    for(var i in __config.calls){
      if(typeof __config.calls[i].arguments !== 'undefined'){
        for(var j in __config.calls[i].arguments){
          if(typeof __config.calls[i].arguments[j] === 'string' && __config.calls[i].arguments[j][0] === '@'){
            ids.push(__config.calls[i].arguments[j].substr(1, __config.calls[i].arguments[j].length));
          }
        }
      }
    }
    
    return ids;
  };
};

module.exports = Definition;