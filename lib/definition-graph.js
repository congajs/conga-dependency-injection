/*
 * This file is part of the conga-dependency-injection module.
 *
 * (c) Marc Roulias <marc@lampjunkie.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

var Definition = require('./definition');

/**
 * The object builds a Directed Acylic Graph of Definitions
 * and provides methods to perform operations on the graph
 * 
 * @author Marc Roulias <marc@lampjunkie.com>
 */
var DefinitionGraph = function(){
  
  /**
   * The hash of Definitions
   * 
   * Format:
   *   {
   *     definition_id : Definition,
   *     ...
   *   }
   * 
   * @var {Object}
   */
  var __definitions = {};
  
  /**
   * The matrix of graph edges
   * 
   * @var {Array}
   */
  var __matrix = [];

  /**
   * ================================================================
   * Public methods
   * ================================================================
   */
  
  /**
   * Add a Definition
   * 
   * @param {Definition} definition
   * @returns {void}
   */
  this.addDefinition = function(definition){
    if(!(definition instanceof Definition)){
      throw new Error('Invalid definition given');
    }
    __definitions[definition.getId()] = definition;
  },
  
  /**
   * Return the current Definitions sorted by dependency order
   * 
   * @returns {Array}
   */
  this.getSortedDefinitions = function(){
    
    // build the matrix from current definitions
    __buildMatrix();

    // array of sorted ids
    var ids = [];
    
    // set of nodes without incoming edges
    var empty = __findNodesWithoutEdges();

    // remove empty definitions from graph
    for(var i in empty){
      delete __matrix[empty[i]];
    }

    while(empty.length > 0){
      var t = empty.shift();
      ids.push(t);
      
      for(var i in __matrix){

        delete __matrix[i][t];
        var sum = 0;
        for(var j in __matrix[i]){
          sum += __matrix[i][j];
        }

        if(sum == 0){
          empty.push(i);
          delete __matrix[i];
        };
      };
    }

    // build return array
    var definitions = [];
    
    for(var i in ids){
      definitions.push(__definitions[ids[i]]);
    }
    
    return definitions;
  };
  
  /**
   * ================================================================
   * Private methods
   * ================================================================
   */
  
  /**
   * Get all of the definition ids that don't have dependencies
   * 
   * @returns {Array}
   */
  __findNodesWithoutEdges = function(){
    var nodes = [];
    
    for(var i in __matrix){
      var sum = 0;
      for(var j in __matrix[i]){
        sum += __matrix[i][j];
      }
      if(sum == 0){
        nodes.push(i);
      };
    }
    
    return nodes;
  };

  /**
   * Build the matrix
   * 
   * @returns {void}
   */
  __buildMatrix = function(){
    __matrix = {};
    for(var i in __definitions){
      __matrix[i] = {};
      for(var j in __definitions){
        __matrix[i][j] = 0;
      };
    }
    __plotEdges();
  };
  
  /**
   * Plot the definition edges in the graph
   * 
   * @returns {void}
   */
  __plotEdges = function(){
    for(var i in __definitions){
      var dependencies = __definitions[i].getDependencyIds();
      for(var j in dependencies){
        __matrix[i][dependencies[j]] = 1;
      }
    }
  };
};

module.exports = DefinitionGraph;