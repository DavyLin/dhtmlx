var default_user = {
	name: 'New user',
	age: '25',
	group: 'preintermediate',
	city: '',
	phone: '',
	sex: 'male',
	driver_license: 0
};

function after_init(){
	// attach filter event
	var toolbar = $$('filter_toolbar');
	dhx.extend(toolbar, dhx.KeyEvents);
	toolbar.attachEvent("onTimedKeyPress", users_filter);

	// event for user selection
	$$('users_list').attachEvent("onAfterSelect", load_details);
}


//adding a new user
function new_user() {
	// new user data
	var data = dhx.copy(default_user);
	
	//sending request to server
	dhx.ajax().post("server/data.php?action=insert", data, function(response){
		// processing answer from server
		var response_data = response.split("\n");
		if (response_data[0] === "true") {
			data.id = response_data[1]; //set new id, from database
			$$("users_list").add(data);
			$$("users_list").select(data.id);
			edit_user();
		} else
			dhx.alert({
				title: "Add new user",
				message: "Some problem occurs during adding"
			});
	});
}


//filter function for combo
function users_filter() {
	var mask = $$('filter_toolbar').getValues()['users_filter'];
	$$('users_list').filter('#name#', mask);
}

// open user edit tab
function edit_user() {
	var id = $$("users_list").getSelected();
	if (!id) return;
	//load data in form	
	$$("user_edit").setValues($$("users_list").item(id));
	// show form
	$$("user_edit").show();
}

// delete user
function delete_user() {
	var id = $$("users_list").getSelected();
	if (!id) return;
	
	dhx.confirm({
		title: "Delete",
		message: "Are you sure you want to delete selected user?",
		callback: delete_user_for_sure,
		details:id
	});
}
function delete_user_for_sure(confirm, details){
	if (confirm) {
		dhx.ajax().post(
			"server/data.php?action=delete", 
			{ id: details }, 
			function(response) {
				if (response == "true") {
					$$("users_list").remove(details);
					$$("user_edit").clear();
					$$("user_view").parse({});
					$$(window.after_action_view).show();
				} else {
					dhx.alert({
						title: "Delete user",
						message: "Some problem occurs during deleting"
					});
				}
			}
		);
	}
}

/*! close user editor without saving
 **/
function edit_cancel() {
	$$(window.details_view).show();
	$$("user_edit").clear();
}

//necessary for mobile version only
function users_list(){
	$$(window.after_action_view).show();
}

/*! function is calld by onAfterSelect event
 *	if load user details to profile
 **/
function load_details(id) {
	// close editor when selected user is changed
	edit_cancel();
	var data = $$('users_list').item(id);
	$$('user_view').parse(data, "json");
}

/*! save changes from user edit form and close editor
 **/
function edit_save() {
	var id = $$("users_list").getSelected();
	// saving old data and addition updates
	// important for case when not all item properties are loaded in edit form
	// and for saving selection
	var form_data = $$("user_edit").getValues();
	var list_data = $$("users_list").item(id);
	dhx.extend(list_data, form_data, true);

	// send update request to server
	dhx.ajax().post("server/data.php?action=update", list_data, function(response) {
		// process response
		if (response != "false") {
			// updates were saved on server, apply it on client side
			$$("users_list").render();
			$$('user_view').parse(list_data, "json");
			// close editor
			edit_cancel();
		} else {
			// error occurs. show warning
			dhx.alert({
				title: "Update",
				message: "Some error occurs during saving"
			});
		}
	});
}


