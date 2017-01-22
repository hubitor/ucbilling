var PlansService = require('../services/plans');

var methods = {
	
	getPlans: function(req, res, next){
		var params = req.body;
		PlansService.get({ currency: req.decoded.currency, _state: '1' }, '-updatedAt -createdAt -_state', function (err, result){
			if(err) {
				return res.json({
					success: false,
					message: err
				});
			}
			res.json({
				success: true,
				result: result
			});
		});
	}

};

module.exports = methods;
