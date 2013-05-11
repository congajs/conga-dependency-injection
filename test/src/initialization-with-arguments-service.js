var InitializationWithArgumentsService = function(a,b){
  this.a = a;
  this.b = b;
  this.isInitialized = false;
};

InitializationWithArgumentsService.prototype.isInitialized = null;

InitializationWithArgumentsService.prototype.init = function(cb){

  var that = this;
  
  this.isAInitialized = this.a.isInitialized;
  this.isBInitialized = this.b.isInitialized;
  
  // do a fake async
  setTimeout(function(){
  
    that.isInitialized = true;
    cb();
    
  }, 1);
};

module.exports = InitializationWithArgumentsService;