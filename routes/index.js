var _ = require('underscore'),
	keystone = require('keystone'),
	middleware = require('./middleware'),
	importRoutes = keystone.importer(__dirname);

function restrictToAdmins(req, res, next) {
	if (req.user && req.user.isAdmin) {
		next();
	} else {
		res.redirect('/signin');
	}
}

keystone.pre('routes', middleware.requireUser);
keystone.pre('routes', middleware.initErrorHandlers);
keystone.pre('routes', middleware.initLocals);

/*
keystone.pre('routes', function(req, res, next) {

	res.locals.navLinks = [
		{ label: 'Home', key: 'home', href: '/' },
		{ label: 'Blog', key: 'blog', href: '/blog' },
		{ label: 'Gallery', key: 'gallery', href: '/gallery' },
		{ label: 'Links', key: 'links', href: '/links' },
		{ label: 'Contact', key: 'contact', href: '/contact' }
	];

	res.locals.user = req.user;

	next();

});
*/
keystone.pre('render', function(req, res, next) {

	var flashMessages = {
		info: req.flash('info'),
		success: req.flash('success'),
		warning: req.flash('warning'),
		error: req.flash('error')
	};

	res.locals.messages = _.any(flashMessages, function(msgs) { return msgs.length }) ? flashMessages : false;

	next();

});

keystone.set('404', function(req, res, next) {
	res.status(404).render('errors/404');
});

// Load Routes
var routes = {
	//api: importRoutes('./api'),
	download: importRoutes('./download'),
	views: importRoutes('./views'),
	authentication: importRoutes('./authentication')
};

exports = module.exports = function(app) {

	// Views
	app.get('/', routes.views.index);
	app.get('/blog/:category?', routes.views.blog);
	app.all('/blog/post/:post', routes.views.post);
	app.get('/gallery', routes.views.gallery);
	app.all('/contact', routes.views.contact);
	app.all('/races', routes.views.races);

	app.get('/links', routes.views.links);
	app.get('/links/:tag?', routes.views.links);
	app.all('/links/link/:link', routes.views.link);

	app.get('/members/:filter(mentors|board)?', routes.views.members);
	app.get('/members/organisations', routes.views.organisations);

	// Downloads
	app.get('/download/users', routes.download.users);

	// Session
	app.all('/:mode(signin|join|attend)', routes.views.signin);
	app.get('/signout', routes.views.signout);
	app.all('/forgot-password', routes.views['forgot-password']);
	app.all('/reset-password/:key', routes.views['reset-password']);

	// Authentication
	app.get('/authentication/github', routes.authentication.github);
	app.get('/authentication/twitter', routes.authentication.twitter);
	app.get('/authentication/facebook', routes.authentication.facebook);

	// User
	app.all('/me*', middleware.requireUser);
	app.all('/me', routes.views.me);
	app.all('/me/create/post', routes.views.createPost);
	app.all('/me/create/link', routes.views.createLink);
/*
*/
	// API
	//app.all('/api*', keystone.initAPI);

}
