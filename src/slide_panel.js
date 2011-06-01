var SlidePanel = function() {
};

SlidePanel.prototype = {
	el : null,
	indicator_type : null,

	getActivePanel : function() {
		return this.el.children('div.' + $.mobile.activePageClass);
	},

	getNextPanel : function(ref) {
		if (!ref)
			ref = this.getActivePanel();
		var panels = this.el.children('div');
		var ret = null;
		for ( var i = 0; i < panels.length; i++) {
			var el = panels[i];
			if ($.inArray(el, ref) > -1 && i < (panels.length - 1)) {
				ret = panels[i + 1];
			}
		}
		return ret;
	},

	getPrevPanel : function(ref) {
		if (!ref)
			ref = this.getActivePanel();
		var panels = this.el.children('div');
		var ret = null;
		for ( var i = 0; i < panels.length; i++) {
			var el = panels[i];
			if ($.inArray(el, ref) > -1 && i > 0) {
				ret = panels[i - 1];
			}
		}
		return ret;
	},
	activatePanel : function(target) {
		var $this = this;
		var from = this.getActivePanel();
		target = $(target);
		if (!target.length)
			return;

		reverse = false;
		var panels = this.el.children('div');
		var from_idx = $.inArray(from[0], panels)
		var to_idx = $.inArray(target[0], panels)

		if (from_idx > to_idx)
			reverse = true;

		// hide the A panel
		from.addClass("slide out " + (reverse ? "reverse" : ""));
		from.animationComplete(function() {
			from.addClass('hidden');

			// show the B panel
			target.removeClass("hidden").addClass($.mobile.activePageClass)
					.addClass("slide in " + (reverse ? "reverse" : ""));
			target.animationComplete(function() {
				target.removeClass("out in reverse slide reverse");
				from.removeClass("out in reverse slide reverse");
				from.removeClass($.mobile.activePageClass);
				$this.activateIndicator();
			})
		});

	},

	createIndicatorElement : function() {
		if (!this.indicator_type || this.indicator_type == 'none')
			return;

		var ol = document.createElement('ol');
		var len = this.el.children('div').length;

		$(ol).addClass('slide-panel-indicator');
		for ( var i = 0; i < len; i++) {
			var li = document.createElement('li');
			$(li).addClass(this.indicator_type);
			if (i == 0)
				$(li).addClass('active');
			li.appendChild(document.createTextNode(i + 1));
			$(ol).append(li);
		}
		this.el.append(ol);
	},

	activateIndicator : function() {
		var indicators = this.el.find('.slide-panel-indicator');
		var panel = this.getActivePanel();
		var panels = this.el.children('div');
		var num = $.inArray(panel[0], panels)
		indicators.children('li').removeClass('active');
		var i = indicators.children('li').get(num);
		$(i).addClass('active');
	},

	initialize : function(el) {
		this.el = $(el);
		this.el.addClass('slide-panel');

		this.el.children('div').addClass('hidden');
		this.el.children('div:first-child').removeClass('hidden').addClass(
				$.mobile.activePageClass);

		var indicator = this.el.attr('data-' + $.mobile.ns + 'indicator');
		if (!indicator)
			indicator = 'circle';
		this.indicator_type = indicator;
		this.createIndicatorElement();

		SlidePanel.instances.push(this);
	}
};

/**
 * SlidePanel static methods
 */
$.extend(SlidePanel, {
	instances : $([]),

	getInstanceByEl : function(el) {
		var instance = null
		SlidePanel.instances.each(function(k, v) {
			if(v.el[0] == el[0]){
				instance = v;
			}
		});
		return instance;
	},

	buildFromHTML : function() {
		var slide_panels = [];
		var panels = $(":jqmData(role='slide_panel')");
		panels.each(function(k, v) {
			var slide_panel = new SlidePanel();
			slide_panel.initialize(v);
			slide_panels.push(slide_panel);
		});
		
		SlidePanel.createHandlers();
		return slide_panels;
	},
	
	createHandlers : function() {

		$(':jqmData(role="slide_panel") > div').bind('swipeleft', function() {
			var from = event.target;
			var instance = SlidePanel.getInstanceByEl($(from));
			if (!instance) {
				from = $(from).parents(":jqmData(role='slide_panel')");
				instance = SlidePanel.getInstanceByEl($(from));
			}
			instance.activatePanel(instance.getNextPanel());
		});
		$(':jqmData(role="slide_panel") > div').bind('swiperight', function() {
			var from = event.target;
			var instance = SlidePanel.getInstanceByEl($(from));
			if (!instance) {
				from = $(from).parents(":jqmData(role='slide_panel')");
				instance = SlidePanel.getInstanceByEl($(from));
			}
			instance.activatePanel(instance.getPrevPanel());
		});
	}
});

$(':jqmData(role="page")').ready(function() {
	SlidePanel.buildFromHTML();
});