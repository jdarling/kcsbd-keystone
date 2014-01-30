var keystone = require('keystone'),
	Types = keystone.Field.Types;

var Enquiry = new keystone.List('Enquiry', {
	nocreate: true
});

Enquiry.add({
	name: { type: Types.Name, required: true },
	email: { type: Types.Email, required: true },
	phone: { type: String },
	enquiryType: { type: Types.Select, options: [
		{ value: 'forsale', label: "Cars for sale/purchase" },
		{ value: 'general', label: "General Inquiry" },
		{ value: 'started', label: "Getting Started" },
		{ value: 'inspections', label: "Inspections" },
		{ value: 'promotions', label: "Promotions Opportunities" },
		{ value: 'racedates', label: "Race Dates" },
		{ value: 'superkids', label: "Super Kids" },
		{ value: 'volunteer', label: "Volunteer Opportunities" },
	], required: true },
	message: { type: Types.Textarea, required: true },
	timestamp: { type: Date, default: Date.now, noedit: true }
});

Enquiry.addPattern('standard meta');
Enquiry.defaultSort = '-timestamp';
Enquiry.defaultColumns = 'name, email, enquiryType, timestamp';
Enquiry.register();
