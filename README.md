# conga-dependency-injection [![Build Status](https://secure.travis-ci.org/congajs/conga-dependency-injection.png)](http://travis-ci.org/congajs/conga-dependency-injection)

## Overview



## Installation

    > npm install conga-dependency-injection

## Usage

### Configuration Example

    var config = {
      
      // set up some parameters
      "parameters" : [
          "my.service.constructor" : "path/to/some/service/file",
          "fs.service.constructor" : "fs"
      ],
      
      // set up services
      "services" : [
          {
              "id" : "fs.service",
              "constructor" : "%fs.service.constructor%"
          },
          {
              "id" : "my.service",
              "constructor" : "%my.service.constructor%",
              "arguments" : ["@fs.service"]
          }
      ]
    };

### Creating a container

    // require the module
    var di = require('conga-dependency-injection');
    
    // create a service loader
    var loader = new di.ServiceLoader();
    
    // create a container builder with the loader
    var builder = new di.ContainerBuilder(loader);
    
    // build the container and retrieve it an a callback
    builder.build(config, function(container){
    	var service = container.get('my.service');
    });