var keystone = require('keystone'),
	Types = keystone.Field.Types;

/**
	Races
	=====
 */

var RaceComment = new keystone.List('RaceComment', {
	label: 'Comments',
	singular: 'Comment'
});

RaceComment.add({
	author: { type: Types.Relationship, initial: true, ref: 'User', index: true },
	Race: { type: Types.Relationship, initial: true, ref: 'Race', index: true },
	commentState: { type: Types.Select, options: ['published', 'draft', 'archived'], default: 'published', index: true },
	publishedOn: { type: Types.Date, default: Date.now, noedit: true, index: true }
});

RaceComment.add('Content', {
	content: { type: Types.Html, wysiwyg: true, height: 300 }
});





/**
	Methods
	=======
*/

RaceComment.schema.pre('save', function(next) {

	this.wasNew = this.isNew;

	if (!this.isModified('publishedOn') && this.isModified('commentState') && this.commentState == 'published') {
		this.publishedOn = new Date();
	}

	next();

});

RaceComment.schema.post('save', function() {

	if (!this.wasNew) {
		return;
	}

	if (this.author) {
		keystone.list('User').model.findById(this.author).exec(function(err, user) {
			return user && user.wasActive().save();
		});
	}

});


/**
	Registration
	============
*/

RaceComment.addPattern('standard meta');
RaceComment.defaultColumns = 'author, Race, publishedOn, commentState';
RaceComment.register();


