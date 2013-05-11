var SetterService = function(){

};

SetterService.prototype = {
  
  setFoo: function(val){
    this.foo = val;
  },
  
  setSomething: function(val){
    this.something = val;
  }
};

module.exports = SetterService;