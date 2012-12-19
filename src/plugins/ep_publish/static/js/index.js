var $, jQuery;

var $ = require('ep_etherpad-lite/static/js/rjquery').$;

// Bind the event handler to the toolbar buttons
var postAceInit = function(hook, context){
  var pb = $('#publish');
  pb.on('click', function(){
    /*
    var value = $(this).val();
    var intValue = parseInt(value,10);
    if(!_.isNaN(intValue)){
      context.ace.callWithAce(function(ace){
        ace.ace_doInsertHeading(intValue);
      },'insertheading' , true);
      pb.val("dummy");
    */
    pad.sendClientMessage({
      type : "PUBLISH",
      padId : pad.getPadId(),
      revisionNum : pad.getCollabRevisionNumber()
    });
  });
};

// Export all hooks
exports.postAceInit = postAceInit;