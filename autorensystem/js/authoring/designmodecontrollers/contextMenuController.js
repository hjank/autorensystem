var contextmenusourcetemp;




$( document ).ready(function() {
	var celloption = { 
			onShow: setcontextsourceid,
			onContextMenu: BeforeContextMenu,
			width: 150, items: [
			
			]
	};
	/*var celloption = { 
			onShow: setcontextsourceid,
			onContextMenu: BeforeContextMenu,
			width: 150, items: [
			{ text: "Item One", icon: "sample-css/wi0126-16.gif", alias: "1-1", action: menuAction },
			{ text: "Item Two", icon: "sample-css/ac0036-16.gif", alias: "1-2", action: menuAction },
			//this is normal menu item, menuAction will be called if this item is clicked on 
			{ text: "Item Three", icon: "sample-css/ei0021-16.gif", alias: "1-3", action: menuAction },
			//this is a split line
			{ type: "splitLine" },
			//this is a parent item, which has some sub-menu items
			{ text: "Group One", icon: "sample-css/wi0009-16.gif", alias: "1-4", type: "group", width: 170, items: [
			 { text: "Group Three", icon: "sample-css/wi0054-16.gif", alias: "2-2", type: "group", width: 190, items: [
			  { text: "Group3 Item One", icon: "sample-css/wi0062-16.gif", alias: "3-1", action: menuAction },
			  { text: "Group3 Item Tow", icon: "sample-css/wi0063-16.gif", alias: "3-2", action: menuAction }
			 ]
			 },
			 { text: "Group Two Item1", icon: "sample-css/wi0096-16.gif", alias: "2-1", action: menuAction },
			 { text: "Group Two Item1", icon: "sample-css/wi0111-16.gif", alias: "2-3", action: menuAction },
			 { text: "Group Two Item1", icon: "sample-css/wi0122-16.gif", alias: "2-4", action: menuAction }
			]
			},
			{ type: "splitLine" },
			{ text: "Item Four", icon: "sample-css/wi0124-16.gif", alias: "1-5", action: menuAction },
			{ text: "Group Three", icon: "sample-css/wi0062-16.gif", alias: "1-6", type: "group", width: 180, items: [
			 { text: "Item One", icon: "sample-css/wi0096-16.gif", alias: "4-1", action: menuAction },
			 { text: "Item Two", icon: "sample-css/wi0122-16.gif", alias: "4-2", action: menuAction }
			]
			}
			]
	};
	*/
	$(".gridelement").contextmenu(celloption); 

});


function BeforeContextMenu() {
    return this.id;
}

		
function menuAction() {
    //alert(this.data.alias);
	alert(contextmenusourcetemp);
}

function setcontextsourceid(menu) {
	contextmenusourcetemp  = this.id;
}
