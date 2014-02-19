// Load .env for development environments
require('dotenv')().load();

var keystone = require('keystone');

/**
 * Application Initialisation
 */

keystone.init({

	'name': 'KCSBD',
	'brand': 'Soap Box',

	'favicon': 'public/favicon.ico',
	'less': 'public',
	'static': 'public',

	'views': 'templates/views',
	'view engine': 'jade',

	'emails': process.env.EMAILS||'templates/emails',

	'auto update': true,
	'mongo': process.env.MONGO_URI || process.env.MONGOLAB_URI || 'mongodb://localhost/keystone-demo',

	'session': true,
	'auth': true,
	'user model': 'User',
	'cookie secret': process.env.COOKIE_SECRET || 'demo',

	'ga property': process.env.GA_PROPERTY,
	'ga domain': process.env.GA_DOMAIN,

	'chartbeat property': process.env.CHARTBEAT_PROPERTY,
	'chartbeat domain': process.env.CHARTBEAT_DOMAIN
});

keystone.Email.defaults.templateEngine = require('handlebars');
keystone.Email.defaults.templateExt = 'handlebars';

require('./models');

keystone.set('locals', {
	_: require('underscore'),
	env: keystone.get('env'),
	utils: keystone.utils,
	editable: keystone.content.editable,
	ga_property: keystone.get('ga property'),
	ga_domain: keystone.get('ga domain'),
	chartbeat_property: keystone.get('chartbeat property'),
	chartbeat_domain: keystone.get('chartbeat domain')
});

if(process.env.EMBEDLY_KEY){
	keystone.set('embedly api key', process.env.EMBEDLY_KEY);
}

keystone.set('routes', require('./routes'));

keystone.set('nav', {
	'posts': ['posts', 'post-comments', 'post-categories'],
	'galleries': 'galleries',
	'enquiries': 'enquiries',
	'races': ['races', 'race-comments', 'race-types'],
	'users': 'users'
});

keystone.start();
