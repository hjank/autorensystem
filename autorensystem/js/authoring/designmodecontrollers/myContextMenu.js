function initcontextmenu() {
	/*$('.mediaelement').on('contextmenu', function (e) {
			 $('.contextmenu').hide();
			 $('#contextmenumediacontainer').show();
			 $('#contextmenumedia').show();
			 $('#contextmenumedia').position({
                  my: 'left top',
                  at: 'e.left e.top',
				  of: e
              });
			  contextmenumediasource = $(this).attr('id');
              //alert('Rechtsklick erkannt');
			  //showcontextmenu($('#contextmenumedia').attr('id');
			 // hidecontextmenus
			  //$('#contextmenumedia').hide();
            
              return false;
        });  
		
	*/
	
	$('.gridelement').on('contextmenu', function (e) {
			/* $('.contextmenu').hide();
			 $('#contextmenugridcontainer').show();
			 $('#contextmenugrid').show();
			 $('#contextmenugrid').position({
                  my: 'left top',
                  at: 'e.left e.top',
				  of: e
              });

			  contextmenugridsource = $(this).attr('id');
              //alert('Rechtsklick erkannt');
			  
              $('#contextmenugrid').show();
			  $('#contextmenugrid').html('');
			  var neighbors = getmyneighbors($(this));
			  var thisgridelement = $(this);
			  directionoutput = '';
			  $(neighbors).each( function() {
				directionoutput = directiontranslatorakkusativ(getneighboringdirection($(this),thisgridelement));	
				var linktext = '<li onclick="deletegridelement(\''+$(thisgridelement).attr('id')+'\', \''+ $(this).attr('id') +'\')">L&ouml;sche zugunsten des ' +directionoutput+' Elements</li>';
				console.log(linktext);
				$('#contextmenugrid').append(linktext);
			  });
			  $('#contextmenugrid').append('<li onclick="spaltengleichmaessigverteilen()">Spalte gleichm&auml;&szlig;ig verteilen</li>');
			  $( '#contextmenugrid' ).unbind();
			 // $( '#contextmenugrid' ).menu();
			  */
			  $('.mycontextmenu').remove();
			  //contextmenugridsource = 
			  var gridmenutext=creategridelementcontextmenu($(this),e);
			  console.log(gridmenutext);
			  $('body').append(gridmenutext);
			  $('#divisionmarker').hide();
              return false;
			  
    });
}


	function creategridelementcontextmenu(thisgridelement,e) {
		var neighbors = getmyneighbors(thisgridelement);
		var thisid = thisgridelement.attr('id');
		var out='<div id="contextmenugridcontainer" class="mycontextmenu" style="left:'+e.pageX+'px;top:'+e.pageY+'px"><ul>';
		$(neighbors).each( function() {
			directionoutput = directiontranslatorakkusativ(getneighboringdirection($(this),thisgridelement));	
			out=out+'<li onclick="deletegridelement(\''+$(thisgridelement).attr('id')+'\', \''+ $(this).attr('id') +'\')">L&ouml;sche zugunsten des ' +directionoutput+' Elements</li>';
		});
		out = out+'<li onclick="spaltengleichmaessigverteilen(\''+thisid+'\')">Spalte gleichm&auml;&szlig;ig verteilen</li>';
		out=out+'</ul></div>';
		return out;
	}
	
	
	function hidecontextmenus() {
		$('.contextmenu').hide();
		//alert("hidecontextmenu");
	}
	
	
	function showcontextmenu(thiscontextmenu) {
		hidecontextmenus();
		thiscontextmenu.show();
	}
	
	
	function hidecontextmenus() {
		$('.contextmenu').hide();
		$('.mycontextmenu').hide();
	}
	
	
	
	
function insidecontextmenu(e) {
	if (!(typeof e === "undefined")) {
		return insidecontextmenu(e.pageX, e.pageY);
	} else {
		console.log("achtung undefined");
		return false;
	}
}

function insidecontextmenu(mx, my) {
	if (!(typeof e === "undefined")) {
		console.log("Test: " +  mx + ' ' + my );
		var gridtop 	= $('.mycontextmenu').offset().top;
		var gridbottom 	= $('.mycontextmenu').offset().top  + $('.mycontextmenu').height();
		var gridleft 	= $('.mycontextmenu').offset().left;
		var gridright 	= $('.mycontextmenu').offset().left + $('.mycontextmenu').width();
		return ((mx>gridleft && mx<gridright) && (my>gridtop && my<gridbottom));	
	} else {
		console.log("achtung undefined");
		return false;
	}
}