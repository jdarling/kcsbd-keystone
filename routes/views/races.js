var keystone = require('keystone'),
			moment = require('moment');

var Races = keystone.list('Race');

exports = module.exports = function(req, res) {

	var view = new keystone.View(req, res),
		locals = res.locals;

	locals.section = 'races';

	view.query('races.upcoming',
		Races.model.find()
			.where('date').gte(moment().startOf('day').toDate())
			.where('state', 'published')
			.sort('+date')
		);

	view.query('races.past',
		Races.model.find()
			.where('date').lt(moment().subtract('days', 1).endOf('day').toDate())
			.where('state', 'published')
			.sort('-date')
		);

/*
	view.query('races.upcoming',
		Races.model.find()
			.where('date').gte(moment().startOf('day').toDate())
			.where('state', 'published')
			.sort('-date')
	, 'talks[who]');

	view.query('races.past',
		Races.model.find()
			.where('date').lt(moment().subtract('days', 1).endOf('day').toDate())
			.where('state', 'published')
			.sort('-date')
	, 'talks[who]');
*/
	view.render('races');

}
