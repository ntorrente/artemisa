function loadFriends(loadUserLists) {
	$.ajax({
		type : "GET",
		url : "/users/" + app.model.loggedUser.id + "/friends",
		success : function(ajaxresult) {
			$("#listUsers").empty();
			if (loadUserLists) {
				$("#myLists").empty();
			}
			var row = null;
			row = $("#rowTemplateUsersActive").html().replace("{{USER}}", "Mis Listas");
			row = row.replace("{{USER_ID}}", app.model.loggedUser.id);
			$("#myLists").append(row);
			for ( var k in ajaxresult) {
				app.model.users[ajaxresult[k].id] = ajaxresult[k];
				row = $("#rowTemplateUsers").html().replace("{{USER}}", ajaxresult[k].username);
				row = row.replace("{{USER_ID}}", ajaxresult[k].id);
				$("#listFriends").append(row);
			}
			$('#listFriends a, #myLists a').click(loadLists);
			if (loadUserLists) {
				loadListsFrom(app.model.loggedUser.id, true);
			}
		}
	});
}

function loadLists() {
	var userId = $(this).attr('id');
	$("#listFriends a").removeClass('active');
	$("#myLists a").removeClass('active');
	$(this).addClass('active');
	loadListsFrom(userId, false);
};

function loadListsFrom(userId, loadItemsList) {
	app.model.userSelected = app.model.users[userId];
	app.model.selectedList = null;
	$("#listOfList").empty();
	if (app.model.loggedUser.id == userId) {
		$("#labelPanelLists").text("Mis listas");
	} else {
		$("#labelPanelLists").text("Listas de " + app.model.userSelected.username);
	}
	$.ajax({
		type : "GET",
		url : "/users/" + app.model.userSelected.id + "/lists/",
		success : function(ajaxresult) {
			showLists(app.model.userSelected, ajaxresult, loadItemsList);
		},
		error : function(jqXHR, textStatus, errorThrown) {
			if (jqXHR.status != 404) {
				alert('Error al cargar la listas.');
			}
		}
	});
}

function showLists(user, ajaxresult, loadItemsList) {
	var listId = 0;
	var row = null;
	$("#listOfList").empty();
	user.lists = {};
	for ( var k in ajaxresult) {
		if (loadItemsList && listId == 0) {
			listId = ajaxresult[k].id;
			row = $("#rowTemplateListsActive").html().replace("{{LIST}}", ajaxresult[k].name).replace("{{ID_LIST}}", ajaxresult[k].id);
		} else {
			row = $("#rowTemplateLists").html().replace("{{LIST}}", ajaxresult[k].name).replace("{{ID_LIST}}", ajaxresult[k].id);
		}
		user.lists[ajaxresult[k].id] = ajaxresult[k];
		$("#listOfList").append(row);
	}
	$('#listOfList a').click(loadItems);
	if (loadItemsList && ajaxresult.length > 0) {
		showItemsFrom(listId);
	} else {
		$("#listOfItems").empty();
		$('#labelPanelItems').text("Items de la lista...");
	}
}

function loadItems() {
	$("#listOfList a").removeClass('active');
	$(this).addClass('active');
	var userId = $(this).attr('id');
	showItemsFrom(userId);
}

function showItemsFrom(listId) {
	app.model.selectedList = app.model.userSelected.lists[listId];
	app.model.selectedItem = null;
	var list = app.model.userSelected.lists[listId];
	$('#labelPanelItems').text("Items de la lista " + list.name);
	$("#listOfItems").empty();
	var items = list.items;
	list.items = {}; // para usar como mapa por id en lugar de lista
	for ( var k in items) {
		row = $("#rowTemplateItems").html().replace("{{VOTES}}", items[k].votes).replace("{{ITEM}}", items[k].label).replace("{{ID_ITEM}}", items[k].id);
		$("#listOfItems").append(row);
		list.items[items[k].id] = items[k];
	}
	$('#listOfItems a').click(selectItem);
	$('#votar_Item').prop('disabled', false);
}

function loadlist(listId) {
	$.ajax({
		type : "GET",
		url : "/users/" + app.model.userSelected.id + "/lists/" + app.model.selectedList.id,
		success : function(ajaxresult) {
			app.model.userSelected.lists[listId] = ajaxresult;
			showItemsFrom(listId);
		},
		error : function(jqXHR, textStatus, errorThrown) {
			alert('Error al cargar la lista.');
		}
	});
}

function selectItem() {
	$("#listOfItems a").removeClass('active');
	$(this).addClass('active');
	var itemId = $(this).attr('id');
	app.model.selectedItem = app.model.selectedList.items[itemId];
	var voters = app.model.selectedItem.voters;
	var voted = false;
	for ( var v in voters) {
		if (voters[v] == app.model.loggedUser.id) {
			$('#votar_Item').prop('disabled', true);
			voted = true;
			break;
		}
	}
	if (!voted) {
		$('#votar_Item').prop('disabled', false);
	}
}

function login(id, name, access_token) {
	var userjson = {};
	userjson['id'] = id;
	userjson['username'] = name;
	userjson['lists'] = [];
	$.ajax({
		url : "/users",
		type : "POST",
		data : JSON.stringify(userjson),
		headers : {
			"accessToken" : access_token
		},
		contentType : 'application/json',
		success : function(data, textStatus, jqXHR) {
			app.model.loggedUser = data;
			app.model.users = {};
			app.model.users[data.id] = data;
			loadFriends(true);
		},
		error : function(jqXHR, textStatus, errorThrown) {
			alert('Error al crear el usuario.');
		}
	});
}

$('#AgregarLista').on('click', function() {
	if ($('#lista_nombre').val() == "") {
		$('#ingreseLista').slideDown("slow");
	} else {
		$('#ingreseLista').slideUp("fast");
		var userjson = {};
		userjson['name'] = $('#lista_nombre').val();
		userjson['items'] = [];
		$.ajax({
			url : "/users/" + app.model.userSelected.id + "/lists",
			type : "POST",
			data : JSON.stringify(userjson),
			contentType : 'application/json',
			success : function(data, textStatus, jqXHR) {
				$('#publicar_Muro').slideDown("fast");
				$('#AgregarLista').hide("");
				$('#listaExito').slideDown("fast");
				$('#lista_nombre').hide("");
				loadListsFrom(app.model.userSelected.id, false);
			},
			error : function(jqXHR, textStatus, errorThrown) {
				$('#lista_nombre').val("");
				$('#alertRepetido').slideDown("slow");
				$('#lista').modal('hide');
			}
		});
	}
});

function refreshListModal() {
	$('#lista_nombre').val("");
	$('#publicar_Muro').hide("");
	$('#AgregarLista').show("");
	$('#listaExito').hide("");
	$('#lista_nombre').show("");
	$('#ingreseLista').hide("");
}

$('#lista').on('show.bs.modal', function() {
	refreshListModal();
});

$('#addItemLaunch').on('click', function() {
	if (app.model.selectedList) {
		$('#item').modal({
			show : true
		});
	} else {
		$('#noListSelectedModal').modal({
			show : true
		});
	}
});

$('#AgregarItem').on('click', function() {
	if ($('#item-label').val() == "") {
		$('#ingreseItem').slideDown("slow");
	} else {
		var userjson = {};
		userjson['label'] = $('#item-label').val();
		$.ajax({
			url : "/users/" + app.model.userSelected.id + "/lists/" + app.model.selectedList.id + "/items",
			type : "POST",
			data : JSON.stringify(userjson),
			contentType : 'application/json',
			success : function(data, textStatus, jqXHR) {
				loadlist(app.model.selectedList.id);
				$('#item').modal('hide');
			},
			error : function(jqXHR, textStatus, errorThrown) {
				$('#alertRepetido').slideDown("slow");
				$('#item').modal('hide');
			}
		});
	}
});


$('#item').on('show.bs.modal', function() {
	$('#ingreseItem').hide("");
	$('#item-label').val("");
});

$('#eliminar_Lista').on('click', function() {
	if (app.model.selectedList) {
		$.ajax({
			url : "/users/" + app.model.userSelected.id + "/lists/" + app.model.selectedList.id, // 12341 lista harcodeada 
			type : "DELETE",
			success : function(data, textStatus, jqXHR) {
				delete app.model.userSelected.lists[app.model.selectedList.id];
				app.model.selectedList = null;
				showLists(app.model.userSelected, app.model.userSelected.lists, false);
			},
			error : function(jqXHR, textStatus, errorThrown) {
				alert('Error al agregar lista.');
			}
		});
	} else {
		$('#noListSelectedModal').modal({
			show : true
		});
	}
});

$('#eliminar_Item').on('click', function() {
	if (app.model.selectedItem) {
		$.ajax({
			url : "/users/" + app.model.userSelected.id + "/lists/" + app.model.selectedList.id + "/items/" + app.model.selectedItem.id,
			type : "DELETE",
			success : function(data, textStatus, jqXHR) {
				delete app.model.selectedList.items[app.model.selectedItem.id];
				app.model.selectedItem = null;
				showItemsFrom(app.model.selectedList.id);
			},
			error : function(jqXHR, textStatus, errorThrown) {
				alert('Error al borrar item.');
			}
		});
	} else {
		$('#noItemSelectedModal').modal({
			show : true
		});
	}
});

$('#votar_Item').on('click', function(e) {
	if (app.model.selectedItem) {
		$.ajax({
			url : "/users/" + app.model.userSelected.id + "/lists/" + app.model.selectedList.id + "/items/" + app.model.selectedItem.id + "/vote",
			type : "PUT",
			success : function(data, textStatus, jqXHR) {
				app.model.selectedItem.votes++;
				app.model.selectedItem.voters.push(app.model.loggedUser.id);
				showItemsFrom(app.model.selectedList.id);
			},
			error : function(jqXHR, textStatus, errorThrown) {
				alert('Error al votar item.');
			}
		});
	} else {
		$('#noItemSelectedModal').modal({
			show : true
		});
	}
});

$(".modal").on('shown.bs.modal', function() {
	$(this).find("[autofocus]:first").focus();
});

$('#publicar_Muro').on('click', function() {
	publishToWall();
});

$('#botonMuro').on('click', function() {
	$('#alertMuro').slideUp("slow");
});

$('#botonRepetido').on('click', function() {
	$('#alertRepetido').slideUp("slow");
});