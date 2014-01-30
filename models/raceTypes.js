var keystone = require('keystone'),
	Types = keystone.Field.Types;

var RaceType = new keystone.List('RaceTypes', {
	autokey: { from: 'name', path: 'key' }
});

RaceType.add({
	name: { type: String, required: true }
});

RaceType.relationship({ ref: 'Race', path: 'type' });

RaceType.addPattern('standard meta');
RaceType.register();
