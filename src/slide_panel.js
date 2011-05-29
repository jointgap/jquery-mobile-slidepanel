$.extend(  $.mobile , {
	createIndicatorElement: function(sel, indicator_class) {
		if(!indicator_class) indicator_class = "circle";
		var panel = $(sel);
		var ol = document.createElement('ol');
		var len = $(panel).children('div').length;

		$(ol).addClass('slide-panel-indicator');
		for(var i=0; i < len; i++) {
			var li = document.createElement('li');
			$(li).addClass(indicator_class);
			if(i == 0) $(li).addClass('active');
			li.appendChild(document.createTextNode(i + 1));
			$(ol).append(li);
		}
		$(panel).append(ol);
	},
	activateIndicator: function(panel) {
		var parent = $(panel).parents(":jqmData(role='slide_panel')");
		var indicator = parent.find('.slide-panel-indicator');
		var num = parent.children().index($(panel));
		indicator.children('li').removeClass('active');
		var i = indicator.children('li').get(num);
		$(i).addClass('active');
	},
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

		$.mobile.activateIndicator(to);

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
/**
 * Adding the classes to the elements withe the slide panel data roles
 */
$(':jqmData(role="page")').ready( function() {
	var panels = $(":jqmData(role='slide_panel')");
	panels.addClass('slide-panel');
	var indicator = panels.attr('data-' + $.mobile.ns + 'indicator');
	if(indicator == 'none') return;
	$.mobile.createIndicatorElement(panels, indicator);
});
/**
 * Swipe callbacks
 */
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