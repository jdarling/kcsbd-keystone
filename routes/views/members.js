var keystone = require('keystone');

var User = keystone.list('User');

exports = module.exports = function(req, res) {

	var view = new keystone.View(req, res),
		locals = res.locals;

	locals.section = 'members';

	var membersQuery = User.model.find()
		.sort('name')
		.where('isPublic', true)
		.populate('organisation');

	if (req.params.filter == 'mentors') {
		membersQuery.where('mentoring.available', true);
	}
	if (req.params.filter == 'board') {
		membersQuery.where('board.member', true);
	}

	view.query('members', membersQuery);//, 'posts talks[meetup]');

	if (req.params.filter == 'mentors') {
		view.render('mentors');
	} else if (req.params.filter == 'board') {
		view.render('board');
	} else {
		view.render('members');
	}
}
