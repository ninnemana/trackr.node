window.addEventListener("load", function load(e){
	$(document).on('click','a.delete',function(e){
		e.preventDefault();

		var path = $(this).attr('href'),
			element = $(this).closest('tr');
		if(confirm('Are you sure you want to remove this user?')){
			$.ajax({
				url: path,
				type: 'GET',
				dataType: 'html',
				beforeSend: function(){
					$(element).find('td').animate({ opacity: '0.2' });
				},success: function(data, textStatus, xhr){
					$(element).fadeOut(300,function(){
						$(element).remove();
					});
				},error: function(xhr, textStatus, errorThrown){
					showAlert('error', 'Delete ' + $(element).find('td:first').text(), 'We failed to delete this record: ' + errorThrown);
					$(element).find('td').animate({ opacity: '1.0' });
				}
			})
		}

		return false;
	})
});