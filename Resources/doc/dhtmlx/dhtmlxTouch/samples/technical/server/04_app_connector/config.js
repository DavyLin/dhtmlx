//template for user profile
var profile_html = dhx.Template('\
	<div class="user_profile">\
		<div class="label">Name:</div><div class="value">#name#</div>\
		<div class="label">Sex:</div><div class="value">#sex#</div>\
		<div class="label">Age:</div><div class="value">#age#</div>\
		<div class="label">City:</div><div class="value">#city#</div>\
		<div class="label">Phone:</div><div class="value">#phone#</div>\
		<div class="label">Group:</div><div class="value">#group#</div>\
		<div class="label">Driver license:</div><div class="value">#driver_license#</div>\
	</div>');
	
function profile_template(obj) {
	var data = dhx.copy(obj);
	
	if (obj.sex){
		data.sex = obj.sex[0].toUpperCase() + obj.sex.substr(1);
		data.group = ({
			'elementary':'Elementary',
			'preintermediate':'Pre-Intermediate',
			'intermediate':'Intermediate',
			'upperintermediate':'Upper Intermediate',
			'advanced':'Advanced'
		})[obj.group];
		if (obj.driver_license == "1" || obj.driver_license == "true")
			data.driver_license = "Yes";
		else
			data.driver_license = "No";
	}
	
	return profile_html(data);
}

/*! edit form config */
var user_edit = { view:"form", id:"user_edit", elements:[
	{ view:"text", label: 'Name', value: '',id:'name'},
	{ view:"counter", id: 'age', label: 'Age', step: 1, inputWidth: 20, value: '25', labelWidth: 150, position: 'label-left', labelAlign: 'left', min: '0', max: '125', sameLine: true},
	{ view:"text", label: 'City', value: '',id:'city'},
	{ view:"radio", id:'sex', position: 'label-left', labelWidth: 230, labelAlign: 'left',  value: 'male', sameLine: true, options:[
		{ label: 'Male', value: 'male' },
		{ label: 'Female', value: 'female' }
	]},

	{ view:"richselect", id: 'group', label: 'Group', value: 'preintermediate', data: [
		{ id: 'elementary', value: 'Elementary' },
		{ id: 'preintermediate', value: 'Pre-Intermediate' },
		{ id: 'intermediate', value: 'Intermediate' },
		{ id: 'upperintermediate', value: 'Upper Intermediate' },
		{ id: 'advanced', value: 'Advanced' }
	]},
	{ view:"text", label: 'Phone', value: '',id:'phone'},
	{ view:"checkbox", label:"Driver license", labelWidth: 230, position: "label-left", labelAlign: "left", sameLine: true, id:'driver_license'},
	{ view:"button", type:"form", id: 'save', label: 'Save', width: 120, click: 'edit_save'},
	{ view:"button", type:"form", id: 'cancel', label: 'Cancel', width: 120, click: 'edit_cancel', sameLine:true }
]};

/*! add/edit/delete toolbar */
var user_toolbar = {
	id: 'main_toolbar',
	view: 'toolbar',
	type: 'MainBar',
	elements: [
		{ view:"icon", icon: 'delete', align: 'right', click: 'delete_user',id:'delete_user'},
		{ view:"icon", icon: 'edit', align: 'right', click: 'edit_user', id:'edit_user'},
		{ view:"icon", icon: 'add', align: 'right', click: 'new_user', id:'new_user'}
	]
};

/*! users list config */
var user_list = {
	view: 'layout',
	id: 'users_list_cont',
	rows: [{
		id: 'filter_toolbar', view: 'toolbar', type: 'MainBar', elements: [
			{ id: 'users_filter', view:"text", label: 'Filter by', value: '', onclick: "users_filter" }
		]
	},
	{ id: 'users_list', view: 'list', width:320, url: 'server/data.php', datatype: 'json', type: 'default', template: "#name#", select: true, click: 'load_details' }
]};


//config for big screen
var pad_config = {
	view: 'layout',
	type: 'wide',
	cols: [
		user_list, {
		view: 'layout',
		rows: [
			user_toolbar,
			{
			view:"multiview", cells:[
				{ id:"user_view", view:"template", template: profile_template },
				user_edit
			]}
		]
	}
]};


//config for small screen
var phone_config = {
	view: 'multiview',
	cells: [
		user_list,
		{ id: "user_view_cont", view: "layout", rows: [
			user_toolbar,
			{ id:"user_view", view:"template", template: profile_template },
			{
				id: 'back_toolbar',
				view: 'toolbar',
				type: 'SubBar',
				elements: [
					{ view:"button", label: 'Back', align: 'right', click: 'users_list', id:'back'}
				]
			}
		]},
		user_edit
	]
};