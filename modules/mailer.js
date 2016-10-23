var config = require('../env/index');
var fs = require('fs');
var path = require('path');
var hbs = require('hbs');
var source = fs.readFileSync(path.resolve('views/email_template.html')).toString();
var translations = require('../translations/mailer.json');
var templateStr;
var logger = require('./logger').mailer;
var debug = require('debug')('billing');
var mailer = require('sendgrid')(config.sendgridApiKey);

function getBody(params, callback) {
	fs.readFile(path.resolve('views/partials/'+params.lang+'/'+params.template+'.html'), function (err, data){
		if(err) return callback(err);
		hbs.registerPartial('message', data.toString());
		templateStr = renderTemplate(source, params);
		callback(null, templateStr);
	});
}

function renderTemplate(source, data){
	var template = hbs.compile(source);
	var output = template(data);
	return output;
}

module.exports = {
	send: function(params, callback) {
		getBody(params, function(err, template) {
			if(err) return callback(err);

			var request = mailer.emptyRequest();
			request.body = {
				"from": {
					"email": params.from.address,
					"name": params.from.name
				},
				"content": [{
					"type": "text/html",
					"value": template
				}],
				"personalizations": [{
					"to": [{
						"email": params.to
					}],
					"subject": params.subject
				}]
			};
			request.method = 'POST';
			request.path = '/v3/mail/send';
			mailer.API(request, function (err, result) {
				if(err) {
					logger.error(err);
					return callback(err);
				}
				logger.info('Mail send', params);
				callback(null, result.body);
			});
		});
	}
};