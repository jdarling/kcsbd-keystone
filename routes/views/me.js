var keystone = require('keystone'),
			moment = require('moment');

exports = module.exports = function(req, res) {

	var view = new keystone.View(req, res),
		locals = res.locals;

	locals.section = 'me';

	view.on('post', { action: 'profile.top' }, function(next) {

		req.user.getUpdateHandler(req).process(req.body, {
			fields: 'name,email,twitter,website,github',
			flashErrors: true
		}, function(err) {

			if (err) {
				return next();
			}

			req.flash('success', 'Your changes have been saved.');
			return next();

		});

	});

	view.on('post', { action: 'profile.bottom' }, function(next) {

		req.user.getUpdateHandler(req).process(req.body, {
			fields: 'isPublic,bio,photo,mentoring.available,mentoring.stock,mentoring.super,mentoring.masters',
			flashErrors: true
		}, function(err) {

			if (err) {
				return next();
			}

			req.flash('success', 'Your changes have been saved.');
			return next();

		});

	});

	view.on('post', { action: 'profile.password' }, function(next) {

		if (!req.body.password || !req.body.password_confirm) {
			req.flash('error', 'Please enter a password.');
			return next();
		}

		req.user.getUpdateHandler(req).process(req.body, {
			fields: 'password',
			flashErrors: true
		}, function(err) {

			if (err) {
				return next();
			}

			req.flash('success', 'Your changes have been saved.');
			return next();

		});

	});

	view.on('render', function(next) {

		if (locals.meetups && locals.meetups.next) {
			RSVP.model.findOne().where('meetup', locals.meetups.next.id).where('who', req.user.id).exec(function(err, rsvp) {
				locals.meetups.nextRSVP = rsvp;
				next(err);
			});
		} else {
			next();
		}

	});

	view.render('me');

}
