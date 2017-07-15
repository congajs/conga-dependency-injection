/*
 * This file is part of the conga-dependency-injection module.
 *
 * (c) Marc Roulias <marc@lampjunkie.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

var Container = require('./container');
var Definition = require('./definition');
var DefinitionGraph = require('./definition-graph');
var Tag = require('./tag');

/**
 * This constructor builds a Container from a given config object
 *
 * @author Marc Roulias <marc@lampjunkie.com>
 *
 * @param {Loader} loader
 */
var ContainerBuilder = function(serviceLoader){

  /**
   * Get reference to ourself
   *
   * @var {ContainerBuilder}
   */
  var __that = this;

  /**
   * The service loader implementation
   *
   * @var {ServiceLoader}
   */
  var __serviceLoader = serviceLoader;

  /**
   * The Container being built
   *
   * @var {Container}
   */
  var __container;

  /**
   * The current config object
   *
   * @var {Object}
   */
  var __config;

  /**
   * The hash of all service definitions
   *
   * @var {Object}
   */
  var __definitions = {};

  /**
   * Hash of all the loaded and instantiated services
   *
   * @var {Object}
   */
  var __loadedServices = {};

  /**
   * Cached array of definitions that need to be initialized
   *
   * @var {Array}
   */
  var __definitionsToInitialize = [];

  /**
   * ================================================================
   * Public methods
   * ================================================================
   */

  /**
   * Build a new Container from the given config object
   * and return it in the given callback function
   *
   * @param {Object} c
   * @param {Function} cb
   */
  this.build = function(config, cb){

    // validate the service loader
    validateServiceLoader(__serviceLoader);

    // set the local variables
    __config = config;
    __container = new Container();

    // set everything up
    setupParameters();
    fixConfigParameters();
    createDefinitions();

    // load all of the services
    loadServices();

    // run all initialization
    initializeServices(function(){
      cb(__container);
    });
  };

  /**
   * Initialize a service
   *
   * @todo - right now this method is public so that it can
   *         be bound to this context in the .bind() call
   *         within initializeServices
   *
   * @param {Definition} definition
   * @param cb
   * @returns {void}
   */
  this.initializeServiceFromDefinition = function(definition, cb){
    var service = __loadedServices[definition.getId()];
    var method = definition.getInitialization().method;

    if(definition.getInitialization().hasCallback){
      service[method].call(service, cb);
    } else {
      service[method].call(service);
      cb();
    }
  };

  /**
   * ================================================================
   * Private methods
   * ================================================================
   */

  /**
   * Initialize all services
   *
   * @todo - this is very rudimentary for now, this will eventually
   *         need to check the initialization dependencies using
   *         a directed graph to make sure that services are
   *         initialized in the correct order
   *
   * @param {Function} cb
   */
  initializeServices = function(cb){

    var definitionsToInit = getDefinitionsToInitializeInOrder();

    // run callback if there's nothing to do
    if(definitionsToInit.length == 0){
      cb();
      return;
    }

    // get reference to initialization method
    var initializeServiceFromDefinition = __that.initializeServiceFromDefinition.bind(__that);

    // function to walk through each definiton and run callbacks
    var walk = function(index, cb){

      // reached end of array, so run original callback
      if(index >= definitionsToInit.length){
        cb();
        return;
      }

      // get the definition
      var definition = definitionsToInit[index];

      // initialize the definition
      initializeServiceFromDefinition(definition, function(){

        // go to next definition with next callback
        walk(index+1, cb);
      });
    };

    // start walking!!!
    walk(0, cb);
  };

  /**
   * Get an array of Definitions sorted in the correct
   * initialization order
   *
   * @returns {Array}
   */
  getDefinitionsToInitializeInOrder = function(){

    var graph = new DefinitionGraph();

    for(var i in __definitionsToInitialize){
      graph.addDefinition(__definitionsToInitialize[i]);
    }

    return graph.getSortedDefinitions();
  };

  /**
   * Load all of the services
   *
   * @param {Function} cb
   */
  loadServices = function(){

     // store container onto itself
    __container.set('service_container', __container);
    __loadedServices['service_container'] = __container;

    for(var i in __definitions){
      if(typeof __loadedServices[i] === 'undefined'){
        loadServiceFromDefinition(__definitions[i]);
      }
    }
  };

  /**
   * Load a service from a Definition (and set to Container)
   *
   * @param {Defintion} definition
   */
  loadServiceFromDefinition = function(definition){

    // load the file
    var O;

    if (definition.isFunction()) {
        O = __serviceLoader.load(definition.getFunction());
    } else {
        O = __serviceLoader.load(definition.getConstructor());
    }

    // create default args
    var args = [];

    // check if there are any arguments
    if(definition.hasArguments()){
      var defArgs = definition.getArguments();
      for(var i=0, j=defArgs.length; i<j; i++){
        var a = defArgs[i];
        if(typeof a == 'string' && a[0] == '@'){
          args.push(getOrLoadService(a.replace('@', '')));
        } else {
          args.push(a);
        };
      };
    };

    // check if there are any tags
    if(definition.hasTags()){
      var tags = definition.getTags();
      for(var i=0, j=tags.length; i<j; i++){
        __container.addTag(tags[i].name, new Tag(definition.getId(), tags[i]));
      };
    }

    // instantiate the object
    var obj;

    if(!definition.isFunction()){
        obj = instantiateObject(O, args, definition);
    } else {
        obj = O;
    }

    // check if there are any method calls
    if(definition.hasCalls()){
      var calls = definition.getCalls();
      for(var i=0, j=calls.length; i<j; i++){
        var method = calls[i].method;
        var callArgs = [];
        for(var x=0, y=calls[i].arguments.length; x<y; x++){
          if(typeof calls[i].arguments[x] == 'string' && calls[i].arguments[x][0] == '@'){
            callArgs.push(getOrLoadService(calls[i].arguments[x].replace('@', '')));
          } else {
            callArgs.push(calls[i].arguments[x]);
          };
        }
        obj[method].apply(obj, callArgs);
      };
    }

    // Check for service scope
    if (definition.hasScope()){
        __container.setScope(definition.getId(), definition.getScope());
    }

    // add the service to the container and cache it in the "loaded" hash
    __container.set(definition.getId(), obj);
    __loadedServices[definition.getId()] = obj;

    return obj;
  };

  /**
   * Load and instantiate an object from a module
   *
   * @param {String}     O
   * @param {Array}      args
   * @return {Mixed}
   */
  instantiateObject = function(O, args){

    if(typeof O === 'function'){
      if(args instanceof Array){
        args.unshift(O);
      }
      return new (O.bind.apply(O, args))();
    } else {
      return O;
    }
  };

  /**
   * Get a loaded service or create a new one and return it
   *
   * @param {String} id
   */
  getOrLoadService = function(id, cb){
    if(typeof __loadedServices[id] !== 'undefined'){
      return __loadedServices[id];
    }
    return loadServiceFromDefinition(__definitions[id], cb);
  };

  /**
   * Copy all of the parameters from the config to the container
   *
   * @returns {void}
   */
  setupParameters = function(){
    __container.setParameters(__config.parameters);
  };

  /**
   * Create a hash of Definitions from the config
   *
   * @returns {void}
   */
  createDefinitions = function(){

    // make sure our hashes start of empty
    __definitions = {};
    __definitionsToInitialize = [];

    for(var i=0, j=__config.services.length; i<j; i++){
      var serviceConfig = __config.services[i];
      var definition = new Definition(serviceConfig);
      __definitions[serviceConfig.id] = definition;

      // cache the definition if it needs to be initialized later on
      if(definition.hasInitialization()){
        __definitionsToInitialize.push(definition);
      }
    }

    // Attach definitions to global container for access elsewhere
    // in the framework (e.g. scoping).
    __container.__definitions = __definitions;
  };

  /**
   * Fix all the parameters in the services
   *
   * This finds all %my.parameter% type placeholders
   * and replaces them with the actual values
   *
   * @returns {void}
   */
  fixConfigParameters = function(){
    var configString = JSON.stringify(__config);

    // loop through and replace all parameters
    for(var i in __config.parameters){
      var regex = new RegExp("%" + i + "%", "g");
      configString = configString.replace(regex, __config.parameters[i]);
    }

    __config = JSON.parse(configString);
  };

  /**
   * Make sure the the give service loader implements
   * the load() method and return it
   *
   * @var {ServiceLoader}
   * @returns {ServiceLoader}
   */
  validateServiceLoader = function(serviceLoader){
    if(typeof serviceLoader.load === 'undefined'){
      throw new Error('Service loader must have a load() method.');
    }
    return serviceLoader;
  };
};

module.exports = ContainerBuilder;
