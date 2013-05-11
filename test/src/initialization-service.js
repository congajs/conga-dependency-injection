var InitializationService = function(){
  this.isInitialized = false;
};

InitializationService.prototype.isInitialized = null;

InitializationService.prototype.init = function(cb){

  var that = this;
  
  // do a fake async
  setTimeout(function(){
  
    that.isInitialized = true;
    cb();
    
  }, 1);
};

module.exports = InitializationService;