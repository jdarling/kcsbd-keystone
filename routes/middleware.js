var Middleware = module.exports = {}
			querystring = require('querystring'),
			_ = require('underscore');

/**
	Initialises the standard view locals
*/

Middleware.initLocals = function(req, res, next) {

	var locals = res.locals;

/*
	locals.navLinks = [
		{ label: 'Home',      key: 'home',      href: '/',          layout: 'left' },
		{ label: 'Races',   key: 'meetups',   href: '/meetups',   layout: 'left' },
		{ label: 'Members',   key: 'members',   href: '/members',   layout: 'left' },
		{ label: 'Links',     key: 'links',     href: '/links',     layout: 'left' },
		{ label: 'Blog',      key: 'blog',      href: '/blog',      layout: 'right' },
		{ label: 'About',     key: 'about',     href: '/about',     layout: 'right' },
		{ label: 'Mentoring', key: 'mentoring', href: '/mentoring', layout: 'right' }
	];
	locals.user = req.user;
*/
	locals.navLinks = [
		{ label: 'Home', key: 'home', href: '/' },
		{ label: 'Races', key: 'races', href: '/races' },
		{ label: 'Blog', key: 'blog', href: '/blog' },
		{ label: 'Gallery', key: 'gallery', href: '/gallery' },
		{ label: 'Links', key: 'links', href: '/links' },
		{ label: 'Members', key: 'members', href: '/members' },
		{ label: 'Contact', key: 'contact', href: '/contact' }
	];

	locals.user = req.user;

	locals.qs_set = qs_set(req, res);

	next();

};

/**
	Inits the error handler functions into `req`
*/

Middleware.initErrorHandlers = function(req, res, next) {

	res.err = function(err, title, message) {
		res.status(500).render('errors/500', {
			err: err,
			errorTitle: title,
			errorMsg: message
		});
	}

	res.notfound = function(title, message) {
		res.status(404).render('errors/404', {
			errorTitle: title,
			errorMsg: message
		});
	}

	next();

};

/**
	Returns a closure that can be used within views to change a parameter in the query string
	while preserving the rest.
*/

var qs_set = Middleware.qs_set = function(req, res) {

	return function qs_set(obj) {

		var params = _.clone(req.query);

		for (var i in obj) {
			if (obj[i] === undefined || obj[i] === null) {
				delete params[i];
			} else if (obj.hasOwnProperty(i)) {
				params[i] = obj[i];
			}
		}

		var qs = querystring.stringify(params);

		return req.path + (qs ? '?' + qs : '');

	}

}

/**
	Prevents people from accessing protected pages when they're not signed in
 */

Middleware.requireUser = function(req, res, next) {
	return next();

	if (!req.user) {
		req.flash('error', 'Please sign in to access this page.');
		res.redirect('/signin');
	} else {
		next();
	}

}