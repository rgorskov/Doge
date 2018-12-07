

$(document).ready(function(){
	
	$('.carousel').carousel({
		interval: 3000
	});

	loadPage();

	$('#form-post').submit(addButtonHandler);

	$('#btn-delete-all').click(clearAll);
	
	

	/* валидация */
	var allInputs = $('form input[type="text"], input[type="password"], input[type="email"], textarea');

	allInputs.focusout(function(e){
		var validDiv = $('<div />', {
							class: 'valid-feedback',
							text: 'Looks good!'
							});
		var invalidDiv = $('<div />', {
							class: 'invalid-feedback',
							text: "That's not what i want"
							});

		if(!$(this).val()){
			$(this).toggleClass('is-valid', false);
			$(this).toggleClass('is-invalid', true);
			$(this).parent().append(invalidDiv);
			$(this).parent().children().remove(validDiv);
		}else{
			$(this).toggleClass('is-valid', true);
			$(this).toggleClass('is-invalid', false);
			$(this).parent().append(validDiv);
			$(this).parent().children().remove(invalidDiv);
		}

	});

	allInputs.focusin(function(e){
		$(this).toggleClass('is-valid', false);
		$(this).toggleClass('is-invalid', false);
		$(this).parent().children('.valid-feedback').remove();
		$(this).parent().children('.invalid-feedback').remove();
	})
});

function loadPage(){
	for(key in localStorage) {
		if(typeof localStorage[key] === 'string') {
			//console.log(localStorage[key]);
			var data = readFromLS(key);
			addPost(key, data, 0);
		}
	}
}

function clearAll(){
	for(key in localStorage) {
		if(typeof localStorage[key] === 'string') {
			//console.log(localStorage[key]);
			var post = $('#accordion-'+key);
			deletePost(key, post);
		}
	}
}

function addPost(key, data/*, dataJSON*/, timer){
	//var data = JSON.parse(dataJSON);

	var postContainer = $('#postContainer');

	var postDiv = $('<div />', {
		class: 'card mb-4 w-100',
		id: 'accordion-'+key,
		style: 'display: none'
	});
	postDiv.prependTo(postContainer);

	var postBody = $('<div />', {
		class: 'card-body'
	});
	postBody.appendTo(postDiv);

	var buttonsDiv = $('<div />', {
		class: "d-flex justify-content-between"
	}); // добавляем в конец postBody

	var buttonCollapse = $('<button />', {
		class: "btn btn-outline-primary",
		id: 'button-collapse-' + key,
		'data-toggle': 'collapse',
		'data-target': '#collapse-' + key,
		'aria-expanded': 'false',
		'aria-controls': 'collapse-' + key,
		text: 'Collapse'
	});
	buttonCollapse.appendTo(buttonsDiv);

	var buttonDelete = $('<button />', {
		class: 'btn btn-outline-danger',
		text: 'Delete',
		click: function(){
			deletePost(key, postDiv);
		}
	})
	buttonDelete.appendTo(buttonsDiv);

	for(item in data){
		//console.log(item, data[item]);
		switch (item){
			case "post-image":
			{
				$('<img>', {
					class: 'card-img-top',
					src: data[item],
					alt: 'Post image'
				}).prependTo(postDiv);
				break;
			};
			case "post-title":
			{
				$('<h5 />', {
					class: 'card-title',
					text: data[item]
				}).appendTo(postBody);
				break;
			};
			case 'post-description':
			{
				$('<p />', {
					class: 'card-text',
					text: data[item]
				}).appendTo(postBody);

				$('<small />', {
					class: 'text-muted',
					text: makeDate(key)
				}).appendTo(
				$('<p />', {
					class: 'card-text d-flex justify-content-end'
				}).appendTo(postBody)
				);

				$('<hr>').appendTo(postBody);
				break;
			};
			case 'post-text':
			{
				$('<div />', {
					class: 'collapse card-text px-3 pb-3 text-muted',
					id: 'collapse-' + key,
					'aria-labelledby': buttonCollapse.attr('id'),
					'data-parent': '#' + postDiv.attr('id'),
					text: data[item]
				}).appendTo(postBody);
				break;
			};
			default:
			{
				$('<p />', {
					class: 'text-danger w-100',
					text: 'Error to load '+ item
				}).appendTo(postBody);
			};

		}

	}

	buttonsDiv.appendTo(postBody);
	
	addToLS(key, data);

	postDiv.show(timer);
}

function deletePost(key, post){
	post.hide(300, function(){
		post.remove();
		deleteFromLS(key);
	});
	
}

function addButtonHandler(e){
	e.preventDefault();

	var formData = $(this).serializeArray();
	var dataArray = {};
	for(item in formData){
		dataArray[formData[item]['name']] = formData[item]['value']
	}

	var dateKey = +(new Date());

	//addToLS(dateKey, formData);
	//addToLS(dateKey, dataArray);

	addPost(dateKey, dataArray, 500);

	$("#addPostModal").modal('hide');
}

function addToLS(key, data){

	localStorage.setItem(key, JSON.stringify(data));
}

function readFromLS(key){
	var dataJSON = localStorage.getItem(key);
	return JSON.parse(dataJSON);
}

function deleteFromLS(key){
	localStorage.removeItem(key);
}

function makeDate(key){
	
	var date = new Date(+key);
	var dateStr = 'Added ' +
	date.getDate() + '-' +
	(date.getMonth()+1) + '-' +
	date.getFullYear() + ' at ' +
	date.getHours() + ':' +
	date.getMinutes() + ':' +
	date.getSeconds();
	return dateStr;
}