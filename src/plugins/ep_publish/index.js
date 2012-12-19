var settings = require("./settings.json");
var eejs = require(settings.pathToEtherpad + 'node/eejs/');
var hasPadAccess = require(settings.pathToEtherpad + "node/padaccess");
var epSettings = require(settings.pathToEtherpad + 'node/utils/Settings');
var exporthtml = require(settings.pathToEtherpad + 'node/utils/ExportHtml');
var padManager = require(settings.pathToEtherpad + 'node/db/PadManager');
var xmlrpc = require('xmlrpc');


exports.eejsBlock_editbarMenuRight = function (hook_name, args, cb) {
  args.content = args.content + eejs.require("ep_publish/templates/editbarButtons.ejs");
  return cb();
}

exports.handleMessage = function (hook, context, cb ) {
	if (context.message.type != undefined && context.message.type == "COLLABROOM" &&
		context.message.data != undefined && context.message.data.type == "CLIENT_MESSAGE" &&
		context.message.data.payload.type != undefined && context.message.data.payload.type == "PUBLISH") {

		var publishTo = settings.publishTo[0];

		console.warn(publishTo.host);

		var client = xmlrpc.createClient({
			'host': publishTo.host,
			'port': publishTo.port,
			'path': publishTo.path
		  }, false)

		padManager.getPad(context.message.data.payload.padId, function (err, pad) {
			if(err) return;

			exporthtml.getPadHTML(pad,
				context.message.data.payload.revisionNum, function(err, html) {

				if (!err) {

					// FIXME: insecure for now, add access check ASAP
					// hasPadAccess(req, res, function() {

					// Sends a method call to the XML-RPC server
					client.methodCall('wp.newPost', [ 0, publishTo.user, publishTo.pass, {
							'post_status': publishTo.status,
							'post_title': 'this is a test',
							'post_content': html
						}], function (error, value) {
							if (error) {
								console.error("Publish failed!");
							}
							else {
								console.warn('Attempted to publish, response was: ' + value);
							}
						});

					// TODO: Round-trip to the server for client feedback
				}
				else {
					console.error("Couldn't get HTML to publish.");
				}
			});

		});

		cb(null);
	}
	else {
		cb();
	}
}
