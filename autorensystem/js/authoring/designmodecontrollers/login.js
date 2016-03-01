$( document ).ready(function() {
    $( "#login-btn" ).on( "click", function() {
		var username 		= $('#username-input').val();
		var password 		= $('#password-input').val();
		// TODO: validation
        $.post("http://localhost:3000/login", {username: username,password:password}, function(data){       
			if(data!='NO') {
               $('#username-dropdown').text(username);
            } else {
				alert("Login war nicht erfolgreich");
			}
        });
		closeModalWindow($("#modal-login"));
		
		
	});
	
	
	$( "#register-btn" ).on( "click", function() {
		var username 		= $('#username-register-input').val();
		var password 	= $('#password-register-input').val();
		alert(username + ' ' + password);
		// TODO: validation
        $.post("http://localhost:3000/register", {username: username,password:password}, function(data){       
            if(data==='done') {
               alert('done');
            }
        });
		closeModalWindow($("#modal-register"));
		
	});
	
	
    // set the trigger for the register modal window
    // $("#hrefRegist").on("click", showModalWindow($("#modal-register")));
});
