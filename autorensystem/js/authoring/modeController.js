var designmodeCurrentscenarioname; 
var designmodeCurrentunitname;
var designmode = false;

// Editormode: Modus zur Erstellung Lerneinheiten Festlegung der Eigenschaften und der Beziehungen Lerneinheiten (Julius, Helena)
// Designmode: Modus zur Erstellung der Oberflaeche (Tom)

$(function() {
	$( "#menuScenarios" ).on( "click", function() {
		if (designmode) {
			changeToEditorMode();
			designmode = false;
			$('#firstTab').trigger('click'); 
		}
	});
});

 /* $(document).on("dblclick", ".w", function (){
     alert('clicked2');
 }

   $(document).on("click", "#tomtest", function (){
     alert('clicked3');
 }
*/
function changeToDesignMode() {
	// container
	$('#stm').hide();
	$('#navbar-middle-little').hide();
	$('#gridcontainer').show();
	
	// properties
	/*
	$('.tab-Container').hide();
	$('.tabDetails').hide();
	$('#tabUnitLabel').hide();
	$('#designmodeProperties').show();
	*/
	
	$('#navadd').hide();
	
	$('#lname').html(designmodeCurrentunitname);
	// lerneinheit laden
}


function changeToEditorMode() {
	// container
	$('#stm').show();
	$('#navbar-middle-little').show();
	$('#gridcontainer').hide();
	$('#divisionmarker').hide();
	$('#sizemarker').hide();
	
	// properties
	/*$('.tab-Container').show();
	$('.tabDetails').show();
	$('#tabUnitLabel').show();
	$('designmodeProperties').hide();
	*/
	$('#navadd').show();
	$('#lname').html(designmodeCurrentscenarioname);
	
}




/* doubleclick

gib die element-id weiter
lade das grid / wenn nicht vorhanden erstelle neues
	-> Ajax-Anfrage 
öffne design-mode

Frage: werden die design-inhalte zu beginn alle geladen oder erst  wenn sie aufgerufen werden (Eher 2.)

Müssen Videos wirklich vollständig geladen werden, oder reicht ein Screenshot?




Medienelement hinzufügen:
- Liste/Array erstellen mit medienelementen? -> Temporäre Liste
- Hinzufügen zu den Kontextinfos direkt beim Hinzufügen des Elements oder erst beim Speichern (eher 2.)

*/ 