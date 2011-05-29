$.extend(  $.mobile , {
	getSlidePanels: function() {
		return $(':jqmData(role="slide_panel") > div');
	},
	getNextSlidePanel: function(reference) {
		var panels=$.mobile.getSlidePanels();
		var ret = null;
		for(var i=0; i < panels.length; i++) {
			var el = panels[i];
			if(el == reference && i < (panels.length - 1) )
				ret = panels[i+1];
		}
		return ret;
	},
	getPrevSlidePanel: function(reference) {
		var panels=$.mobile.getSlidePanels();
		var ret = null;
		for(var i=0; i < panels.length; i++) {
			var el = panels[i];
			if(el == reference && i > 0 )
				ret = panels[i-1];
		}
		return ret;
	},
	changeSlidePanelItem: function(from, to, reverse) {
		if(!from || !to)
			return false;

		var from = $(from), to = $(to);
		
		// hide the A panel
		from.addClass("slide out "+ ( reverse ? "reverse" : "" ));
		from.animationComplete( function() {
			from.addClass('hidden');
			
			// show the B panel
			to.removeClass("hidden")
				.addClass($.mobile.activePageClass)
				.addClass("slide in " + ( reverse ? "reverse" : "" ));
			to.animationComplete( function() {
				to.removeClass("out in reverse slide reverse");
				from.removeClass("out in reverse slide reverse");
				from.removeClass( $.mobile.activePageClass);
			})
		});
	}
});

$(':jqmData(role="page")').ready( function() {
	var panels = $(":jqmData(role='slide_panel')");
	panels.addClass('slide-panel');
});
$.mobile.getSlidePanels().live('swipeleft', function(event) {
	var from = event.target;
	from = $(from).parents(":jqmData(role='slide_panel')>div")[0];
	var to = $.mobile.getNextSlidePanel(from);
	$.mobile.changeSlidePanelItem(from, to);
});
$.mobile.getSlidePanels().live('swiperight', function() {
	var from = event.target;
	from = $(from).parents(":jqmData(role='slide_panel')>div")[0];
	var to = $.mobile.getPrevSlidePanel(from);
	$.mobile.changeSlidePanelItem(from, to, true);
});