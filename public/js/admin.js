window.addEventListener("load",function load(e){
	var alert_tmpl 	= 	'<div class="alert {{ type }}">';
	alert_tmpl 		+=	'<button class="close" data-dismiss="alert">x</button>';
	alert_tmpl 		+= 	'<strong>{{ title }}</strong><p> {{ msg }} </p>';
	alert_tmpl 		+=	'</div>';
	showAlert = function(type, title, msg){
		var alert_type;
		switch(type){
			case 'error':
				alert_type = 'alert-error';
				break;
			case 'success':
				alert_type= 'alert-success';
				break;
			case 'info':
				alert_type: 'alert-info';
				break;
			default:
				alert_type: '';
				break; 
		}
		var data = {
			type: alert_type,
			title: title,
			msg: msg
		};
		console.log(data);
		var html = Mustache.to_html(alert_tmpl, data);
		$('div.alert-area').html(html);
	}
});