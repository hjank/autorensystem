

   $( document ).ready(function() {
		CKEDITOR.replace( 'cktexteditor' ), {
			enterMode: CKEDITOR.ENTER_BR,
			//removeButtons: 'Underline,Scayt,Link,Image,Maximize,Source,Anchor,Unlink,HorizontalRule,SpecialChar,Table,Styles,About'
			//config.enterMode = CKEDITOR.ENTER_BR;
			//toolbar : 'Basic'
			
		}
		CKEDITOR.config.enterMode = CKEDITOR.ENTER_BR;
		CKEDITOR.config.toolbar   = 'Authorsystem';
		//CKEDITOR.config.removeButtons = 'Underline,Scayt,Link,Image,Maximize,Source,Anchor,Unlink,HorizontalRule,SpecialChar,Table,Styles,About';
	/*	
		// Toolbar
		// http://ckeditor.com/tmp/4.5.0-beta/ckeditor/samples/toolbarconfigurator/index.html#basic
		CKEDITOR.editorConfig = function( config ) {
	config.toolbarGroups = [
		{ name: 'clipboard', groups: [ 'clipboard', 'undo' ] },
		{ name: 'editing', groups: [ 'find', 'selection', 'spellchecker', 'editing' ] },
		{ name: 'links', groups: [ 'links' ] },
		{ name: 'insert', groups: [ 'insert' ] },
		{ name: 'forms', groups: [ 'forms' ] },
		{ name: 'tools', groups: [ 'tools' ] },
		{ name: 'document', groups: [ 'mode', 'document', 'doctools' ] },
		{ name: 'others', groups: [ 'others' ] },
		'/',
		{ name: 'basicstyles', groups: [ 'basicstyles', 'cleanup' ] },
		{ name: 'paragraph', groups: [ 'list', 'indent', 'blocks', 'align', 'bidi', 'paragraph' ] },
		{ name: 'styles', groups: [ 'styles' ] },
		{ name: 'colors', groups: [ 'colors' ] },
		{ name: 'about', groups: [ 'about' ] }
	];

		config.removeButtons = 'Underline,Scayt,Link,Image,Maximize,Source,Anchor,Unlink,HorizontalRule,SpecialChar,Table,Styles,About';
		};
		
		*/
		/*$('#your_textarea').ckeditor({
			toolbar: 'Full',
			enterMode : CKEDITOR.ENTER_BR,
			shiftEnterMode: CKEDITOR.ENTER_P
			
			});
		*/
		
		for (var i in CKEDITOR.instances) {
			CKEDITOR.instances[i].on('change', function() { 
				console.log("veraendert");
				console.log(CKEDITOR.instances.cktexteditor.getData());
				$('#'+currentmarkedid).find('.textmediaoutput').html(CKEDITOR.instances.cktexteditor.getData());
				console.log($('#'+currentmarkedid).find('.textmediaoutput').html());
				updateHTML();
				//$('#'+currentmarkedid).find('.textmediaoutput').html(CKEDITOR.instances.cktexteditor.getData());
				//CKEDITOR.instances[i].updateElement() ;
			});  

             
        }
   });

   
   function texttoeditor() {
	   // TODO: kurzes "Flackern" -> in beiden Fleder wird jeweils kurz der Inhalt vom anderen angezeigt
	   // Ursache? Gefahr von Fehlern?
		CKEDITOR.instances.cktexteditor.setData($('#'+currentmarkedid).find('.textmediaoutput').html());
   }