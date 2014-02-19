var keystone = require('keystone'),
	async = require('async'),
	Types = keystone.Field.Types
	;

var Enquiry = new keystone.List('Enquiry', {
	nocreate: true
});

Enquiry.schema.methods.notifyAdmins = function(callback){
	var enquiry = this;
	var sendEmail = function(err, results){
		if(err){
			return callback(err);
		}
		async.each(results.admins, function(admin, done){
			new keystone.Email('new-enquiry').send({
				admin: admin.name.first || admin.name.full,
				author: results.author ? results.author.name.full : 'Somebody',
				enquiry: enquiry,
				keystoneURL: 'http://kcsbd.org/keystone/enquiries/' + enquiry.id,
				subject: 'New Enquiry on KCSBD.org'
			}, {
				to: admin,
				from: {
					name: 'KCSBD.org',
					email: 'contact@kcsbd.org'
				}
			}, done);
		}, function(err, info){
			if(err){
				console.log(err);
			}
			if(callback){
				callback(err, info);
			}
		});
	};
	async.parallel({
		admins: function(next){
			keystone.list('User').model.find().where('board.member', true).exec(next);
		}
	}, sendEmail);
};

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
