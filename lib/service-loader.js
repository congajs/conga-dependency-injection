/*
 * This file is part of the conga-dependency-injection module.
 *
 * (c) Marc Roulias <marc@lampjunkie.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

/**
 * A simple object loader for the ContainerBuilder
 * 
 * This service loader is initialized with an array
 * of file paths to look in.
 * 
 * @author Marc Roulias <marc@lampjunkie.com>
 */
var ServiceLoader = function(paths){
  
  /**
   * An array of directory paths to look in
   * 
   * @var {Array}
   */
   var __paths = paths;
   
   /**
    * ================================================================
    * Public methods
    * ================================================================
    */
   
   /**
    * Load an object and return it in the callback
    * 
    * @param path
    */
   this.load = function(path){
     
     // try loading from the given paths
     for(var i=0, j=__paths.length; i<j; i++){
       try {
         return require(__paths[i] + '/' + path);
       } catch(err){}
     }
     
     // try a normal module
     try {
       return require(path);
     } catch(error){
       throw new Error('Could not load: ' + ' from any of the available paths.');
     }
   };
};

module.exports = ServiceLoader;