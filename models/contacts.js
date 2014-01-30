var keystone = require('keystone'),
	Types = keystone.Field.Types;

var Enquiry = new keystone.List('Contact', {
	map: { name: 'name' }
});

Enquiry.add({
	name: { type: Types.Name, required: true },
	email: { type: Types.Email },
	altEmail: { type: Types.Email },
	phone: {
		type: { type: String },
		number: { type: String },
	},
	altPhone: {
		type: { type: String },
		number: { type: String },
	},
	raceCity: { type: String, default: 'Kansas City' },
	interests: {
		aa: { type: Boolean, label: 'All American Races' },
		ndr: { type: Boolean, label: 'NDR Races' },
		novice: { type: Boolean, label: 'Novice' },
		stock: { type: Boolean, label: 'Stock' },
		super: { type: Boolean, label: 'Super Stock' },
		masters: { type: Boolean, label: 'Masters' },
	},
	notes: { type: Types.Textarea },
	timestamp: { type: Date, default: Date.now, noedit: true }
});

Enquiry.addPattern('standard meta');
Enquiry.defaultSort = 'name';
Enquiry.defaultColumns = 'name, email, phone, timestamp';
Enquiry.register();
