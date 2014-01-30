var keystone = require('keystone'),
	Types = keystone.Field.Types;

var Race = new keystone.List('Race', {
	map: { name: 'title' },
	autokey: { path: 'slug', from: 'title', unique: true }
});

Race.add({
	title: { type: String, required: true, index: true },
	type: { type: Types.Relationship, ref: 'RaceTypes', many: true },
	state: { type: Types.Select, options: 'draft, published, archived', default: 'draft', index: true },
	date: { type: Types.Date, required: true, initial: true, index: true },
	time: { type: String, required: true, initial: true, width: 'short', default: '6pm - 9pm', note: 'e.g. 6pm - 9pm' },
	place: { type: String, required: true, initial: true, width: 'medium', default: '4600 Eastern Avenue, Kansas City MO 64129', note: '4600 Eastern Avenue, Kansas City MO 64129' },
	description: { type: Types.Html, wysiwyg: true },
	author: { type: Types.Relationship, ref: 'User', index: true },
	publishedDate: { type: Types.Date, index: true },
	image: { type: Types.CloudinaryImage },
});

Race.schema.virtual('content.full').get(function() {
	return this.content.extended || this.content.brief;
});

/**
	Relationships
	=============
*/

Race.relationship({ path: 'comments', ref: 'RaceComment', refPath: 'comment' });

Race.addPattern('standard meta');
Race.defaultColumns = 'title, state|20%, type|20%, date|20%, publishedDate|20%';
Race.register();
