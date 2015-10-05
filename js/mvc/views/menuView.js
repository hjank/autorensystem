$(function() {

    $('#cssmenu li.has-sub>a').on('click', function(){
		$(this).removeAttr('href');
		var element = $(this).parent('li');
		if (element.hasClass('open')) {
			element.removeClass('open');
			element.find('li').removeClass('open');
			element.find('ul').slideUp();
		}
		else {
			element.addClass('open');
			element.children('ul').slideDown();
			element.siblings('li').children('ul').slideUp();
			element.siblings('li').removeClass('open');
			element.siblings('li').find('li').removeClass('open');
			element.siblings('li').find('ul').slideUp();
		}
	});

	$('#cssmenu>ul>li.has-sub>a').append('<span class="holder"></span>');

	(function getColor() {
		var r, g, b;
		var textColor = $('#cssmenu').css('color');
		textColor = textColor.slice(4);
		r = textColor.slice(0, textColor.indexOf(','));
		textColor = textColor.slice(textColor.indexOf(' ') + 1);
		g = textColor.slice(0, textColor.indexOf(','));
		textColor = textColor.slice(textColor.indexOf(' ') + 1);
		b = textColor.slice(0, textColor.indexOf(')'));
		var l = rgbToHsl(r, g, b);
		if (l > 0.7) {
			//$('#cssmenu>ul>li>a').css('text-shadow', '0 1px 1px rgba(0, 0, 0, .35)');
			$('#cssmenu>ul>li>a>span').css('border-color', 'rgba(0, 0, 0, .35)');
		}
		else
		{
			//$('#cssmenu>ul>li>a').css('text-shadow', '0 1px 0 rgba(255, 255, 255, .35)');
			$('#cssmenu>ul>li>a>span').css('border-color', 'rgba(255, 255, 255, .35)');
		}
	})();

	function rgbToHsl(r, g, b) {
	    r /= 255, g /= 255, b /= 255;
	    var max = Math.max(r, g, b), min = Math.min(r, g, b);
	    var h, s, l = (max + min) / 2;

	    if(max == min){
	        h = s = 0;
	    }
	    else {
	        var d = max - min;
	        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
	        switch(max){
	            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
	            case g: h = (b - r) / d + 2; break;
	            case b: h = (r - g) / d + 4; break;
	        }
	        h /= 6;
	    }
	    return l;
	}

});


function changeScenarioNameInMenu(oldName, newName) {
	$("#menuScenarios").children("li").children("a").children("span.title").each(function() {
		if ( $(this)[0].innerHTML == oldName ) {
			$(this).html(newName);
		}
	});
}


function addUnitToMenu(nameCurrentScenario) {
	var liCurrentScenario;

	// find correct scenario in menu
	$("span.title").each(function() {
		if ($(this)[0].innerText == nameCurrentScenario) {
			liCurrentScenario = $(this);
		}
	});

	// build DOM for menu bar
	var ulCurrentScenario;
	var liNewUnit = $("<li>").addClass("last");
	var aNewUnit = $("<a>").attr("href", "#");
	var spanNewUnit = $("<span>");
	liCurrentScenario = liCurrentScenario.parent("a").parent("li");

	// necessary if the running scenario has a unit already
	if (liCurrentScenario.hasClass("has-sub")) {

		// get unit list
		ulCurrentScenario = liCurrentScenario.children("ul");

		// add unit in menu bar
		spanNewUnit[0].innerText = this.value;
		aNewUnit.append(spanNewUnit);
		liNewUnit.append(aNewUnit);
		ulCurrentScenario.append(liNewUnit);
	}

	// necessary if the running scenario has no units
	if (liCurrentScenario.hasClass("last")) {

		// create list DOM
		ulCurrentScenario = $("<ul>").attr("style", "display:none");

		// editing scenario DOM
		liCurrentScenario.removeClass("last");
		liCurrentScenario.addClass("active");
		liCurrentScenario.addClass("has-sub");

		// append content name on DOM
		spanNewUnit[0].innerText = this.value;
		aNewUnit.append(spanNewUnit);
		liNewUnit.append(aNewUnit);
		ulCurrentScenario.append(liNewUnit);
		liCurrentScenario.append(ulCurrentScenario);

		// append a holder to toggle the menu bar
		liCurrentScenario.children("a").append('<span class="holder"></span>');

		// get the functionalities into the menu bar
		liCurrentScenario.children("a").click(function() {
			$(this).removeAttr('href');
			var element = $(this).parent('li');

			if (element.hasClass('open')) {
				element.removeClass('open');
				element.find('li').removeClass('open');
				element.find('ul').slideUp();
			}
			else {
				element.addClass('open');
				element.children('ul').slideDown();
				element.siblings('li').children('ul').slideUp();
				element.siblings('li').removeClass('open');
				element.siblings('li').find('li').removeClass('open');
				element.siblings('li').find('ul').slideUp();
			}
		});
	}
}