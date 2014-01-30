var keystone = require('keystone'),
		moment = require('moment'),
	async = require('async');

var Link = keystone.list('Link');

exports = module.exports = function(req, res) {

	var view = new keystone.View(req, res),
		locals = res.locals;
	locals.moment = moment;

	// Init locals
	locals.section = 'links';
	locals.current = {
		sort: req.query.sort||'name',
		sortOn: 'label'
	};
	switch((req.query.sort||'').toLowerCase()){
		case('updated'):
			locals.current.sortOn =  '-changedOn';
			break;
		default:
			locals.current.sortOn =  'label';
	}
	locals.filters = {
		tag: req.params.tag
	};
	locals.data = {
		links: [],
		tags: []
	};

	// Load all categories
	view.on('init', function(next) {

		keystone.list('LinkTag').model.find().sort('label').exec(function(err, results) {

			if (err || !results.length) {
				return next(err);
			}

			locals.data.tags = results;

			// Load the counts for each category
			async.each(locals.data.tags, function(tag, next) {

				keystone.list('Link').model.count().where('tag').in([tag.id]).exec(function(err, count) {
					tag.linkCount = count;
					next(err);
				});

			}, function(err) {
				next(err);
			});

		});

	});

	// Load the current category filter
	view.on('init', function(next) {

		if (req.params.tag) {
			keystone.list('LinkTag').model.findOne({ key: locals.filters.tag }).exec(function(err, result) {
				locals.data.tag = result;
				next(err);
			});
		} else {
			next();
		}

	});

	view.on('render', function(next) {

		//var q = keystone.list('Link').model.find().where('state', 'published').sort('-publishedDate').populate('author tags');
		var q = keystone.list('Link').model.find().where('state', 'published').sort(locals.current.sortOn).populate('author tags');

		if (locals.data.tag) {
			q.where('tags').in([locals.data.tag]);
		}

		//q.sort(locals.current.sortOn);

		q.exec(function(err, results) {
			if (err) return res.err(err);
			locals.data.links = results;
			next();
		});

	});

	// Render the view
	view.render('links');

}
