// ==UserScript==
// @name           googleplusplus_default_circle
// @author         Micah Wittman
// @namespace      http://wittman.org/projects/googleplusplus_default_circle
// @include        *plus.google.com*
// @description    Redirects from Stream view to a default circle
// @version        0.2.6
// ==/UserScript==


function defaultCircle(){
	var logging = false;

	function log(txt) {
	  if(logging) {
	    console.log(txt);
	  }
	}

	function re_map(mappings){
		if(mappings == null)
			return false; //Scripts without a default (bundled) mapping resource
		var m = mappings;
		SEL = {
			'post' : "[id^='update-']", //"[id^='update-']"
			'posts' : m['XVDd7kiawTA9Z68I'], //".tn"
			'comments_wrap' : m['nqBp6N6dKqueig2R'], //".Ij"
			'comment_editor_cancel' : "[id*='.cancel']", //[id*='.cancel']
			'plust1_and_comments_link_wrap' : m['YAnwDHrlMoy67el9'], //".Bl"
			'old_comment_count_span' : m['9Iug6cv5o3NgTEEv'], //".Gw"
			'recent_comments_wrap' : m['CgYb1dbCZGVfpUAj'], //'.mf'
			'circle_links_wrap' : '#content ' + m['tZ7bxNTZEoVrcPyj'] + ' + div', //"#content .a-ud-B + div"		
			'circle_links' : "#content " + m['NCQTv2BvLd3MFT9q'].replace(':hover','') + " a[href*='stream/']", //"#content .a-ob-j-X a[href*='stream/']"
			'stream_link' : "#content " + m['XLINtDfuUFUIgeVl'] + " + a[href='/stream']:first", //"#content .a-ob-Fd a[href='/stream']:first"
			'stream_link_active' : "#content " + m['XLINtDfuUFUIgeVl'] + " + a[href='/stream']" + m['oL8HuLz0SCCVwtPK'] + ":first", //"#content .a-f-ob-B a[href='/stream'].a-ob-j-ia:first"
			'user_link' : m['tuVm7xq63YKbjl9u'] + ' a:first', //'.Nw a:first'
			'share_link' : m['xG7OYDQoYoP4QS0R'] + ' a:first', //'.gx a:first'
			'permalink_wrap' : m['tuVm7xq63YKbjl9u'], //'.Nw',
			'img_divs' :  "#content " + m['rWCWLOSJ4yQRU41j'] + "[data-content-url]", //#contentPane .F-y-Ia[data-content-url]
			'search_input_classes' : m['ikY6QG1yVApfM0ib'].replace('.','') + ' ' + m['9WbMI68ODRm5sxgV'].replace('.','') + ' ' + m['QvnLjkPdyzwsVmEq'].replace('.',''), //'a-pu-z a-x-z Ka-z-Ka'
			'___' : ''
		};
	}

	function set_selector_mappings(){
		
		/*** Scripts without a default (bundled) mapping resource ***/
		var default_selector_map = {
			'mapping date right' : '0000-00-00.000',
			'mappings' : null
			};
		/***********************************************************/
		
		var mappings = {};
		try{
			//console.log(SEL);
			/*stor_del('GPlus CSS Map');
			stor_del('Last Got GPlus CSS Map Date');
			stor_del('GPlus CSS Map Date');
			return;*/

			//var now = new Date("August 25, 2011 22:27:00"); //new Date();
			var now = new Date();

			var stored_mappings;
			var stored_last_check_for_map_update;
			var stored_map_date;

			//Check for resume flag
			var uncheckable_dom_litmus_location = false;
			var path = window.location.pathname;
			if( path !=  '/' && path.indexOf('/stream/') == -1 && path.indexOf('/posts') == -1 ){
				uncheckable_dom_litmus_location = true;
			}

			//Set mappings if first time upon page load
			if( !SET_SELECTOR_MAPPINGS_DONE_ONCE ){
				stored_mappings = $.parseJSON(stor_get('GPlus CSS Map', null));
				stored_last_check_for_map_update = stor_get('Last Got GPlus CSS Map Date', 0);
				stored_map_date = stor_get('GPlus CSS Map Date', '');

				//User stored mapping if newer than default mappings
				if((stored_last_check_for_map_update != 0) && (stored_mappings) && (stored_map_date > default_selector_map['mapping date right'])){
					mappings = stored_mappings; //local storage copy of map
					default_selector_map['mapping date right'] = stored_map_date; //Scripts without a default (bundled) mapping resource
				}else{
					mappings = default_selector_map.mappings; //included default map file
				}

				//console.log('mappings_before_remap:');
				//console.log(default_selector_map.mappings);
				re_map(mappings);
				//console.log(SEL);
			}else{
				SET_SELECTOR_MAPPINGS_DONE_ONCE = true; //done once, set flag
			}

			//Check if resume mode is needed
			if(uncheckable_dom_litmus_location){
				RESUME_MAP_CHECK_UPON_ROOT_PATH = true; //flag to re-run when at root URL
				return;
			}

			RESUME_MAP_CHECK_UPON_ROOT_PATH = false; //unset flag

			//Check remote mappings in case of update
			var timediff = now.getTime() - stored_last_check_for_map_update;
			//console.log('timediff:');
			//console.log(timediff/60*1000*60);
			//console.log('stored_last:');
			//console.log(stored_last_check_for_map_update);
			//console.log('stored_map:');
			//console.log(stored_map_date + ' and ' + stored_map_date);
			//console.log('stored_last:' + stored_last_check_for_map_update); console.log('timediff:' + (timediff > 30*60*1000)); console.log('force:' + SET_SELECTOR_MAPPINGS_FORCED);
			if((default_selector_map.mappings == null) || (stored_last_check_for_map_update == 0) || (timediff > 30*60*1000) || (SET_SELECTOR_MAPPINGS_FORCED)){ /* 30*60*1000 = 0.5 hour interval*/
				SET_SELECTOR_MAPPINGS_FORCED = false; //unset flag
				//console.log('past interval');
				$.get('http://goldenview.wittman.org/map/current_gplus_mappings_timestamp.txt', function(data){
					//console.log(data);
					var remote_date = data;
					if((remote_date.length > 8 && remote_date.length < 16 && remote_date[0] == 2) && (remote_date > default_selector_map['mapping date right'])){ //2010-01-01.123
						$.getJSON('http://goldenview.wittman.org/map/current_gplus_mappings.json', function(data){
							//console.log('ajax map pull:'); console.log(data);
							var date_right = typeof data['mapping date right'] == 'undefined' ? default_selector_map['mapping date right'] : data['mapping date right'];	
							var mappings_length = Object.keys(data.mappings).length;
							//console.log('date_right, default_date');
							//console.log(date_right); console.log(default_selector_map['mapping date right']);
							if(date_right > default_selector_map['mapping date right'] && mappings_length > 999 && (!$(SEL.posts).length || !$(SEL.comments_wrap).length || !$(SEL.circle_links).length)){
								mappings = data.mappings;
								re_map(mappings);
								stor_set('GPlus CSS Map', JSON.stringify(mappings));
								stor_set('GPlus CSS Map Date', date_right);
								//console.log('update local from remote');
								//console.log(mappings);
							}
						});
					}
				});
				stor_set('Last Got GPlus CSS Map Date', now.getTime());
				//console.log('stored:'+now.getTime());
			}
			//console.log(mappings);
		}catch(e){
			SET_SELECTOR_MAPPINGS_DONE_ONCE = true; //done once, set flag
			////mappings = default_selector_map.mappings; //If all else fails, use included default map file
			////re_map(mappings);
			//console.log('exception caught, using default');
			//console.log('Remote map not pulled yet.')
			//console.log(e.message);
			//console.log(mappings);
		}
	}
	
	function setItem(key, value) {
		try{
			log("Inside setItem: " + key + ":" + value);
			window.localStorage.removeItem(key);
			window.localStorage.setItem(key, value);
		}catch(e){
			log("Error inside setItem");
			log(e);
		}
		log("Return from setItem" + key + ":" +  value);
	}

	function getItem(key){
		var v;
		log('Get Item: ' + key);
		try{
			v = window.localStorage.getItem(key);
		}catch(e){
			log("Error inside getItem() for key: " + key);
			log(e);
			v = null;
		}
		log("Returning value: " + v);
		return v;
	}
	function removeItem(key) {
		try{
			log("Inside removetItem: " + key);
			window.localStorage.removeItem(key);
		}catch(e){
			log("Error inside removeItem");
			log(e);
		}
		log("Return from removeItem" + key);
	}
	function clearStorage(){
		log('about to clear local storage');
		window.localStorage.clear();
		log('cleared');
	}
	function GM_removeItem(name){
		removeItem(name);
	}
	function GM_setValue(name, value){
		setItem(name, value);
	}

	function GM_getValue(name, oDefault){
		var v = getItem(name);
		if(v == null){
			return oDefault;
		}else{
			return v;
		}
	}
	function set_item(key, value) {
		try{
			window.localStorage.removeItem(key);
			window.localStorage.setItem(key, value);
		}catch(e){
			log(e);
		}
	}

	function get_item(key){
		var v;
		try{
			v = window.localStorage.getItem(key);
		}catch(e){
			log(e);
			v = null;
		}
		return v;
	}
	function del_item(key) {
		try{
			window.localStorage.removeItem(key);
		}catch(e){
			log(e);
		}
		log("Return from removeItem" + key);
	}
	function stor_clear(){
		log('about to clear local storage');
		window.localStorage.clear();
		log('cleared');
	}
	function stor_del(name){
		del_item(name);
	}
	function stor_set(name, value){
		set_item(name, value);
	}
	function stor_get(name, dfault){
		var v = get_item(name);
		if(v == null){
			return dfault;
		}else{
			return v;
		}
	}
	
	var SEL = {};
	var RESUME_MAP_CHECK_UPON_ROOT_PATH = false;
	var SET_SELECTOR_MAPPINGS_DONE_ONCE = false;
	var SET_SELECTOR_MAPPINGS_FORCED = false;
	var SET_SELECTOR_MAPPINGS_FORCED_ONCE = false;

	set_selector_mappings();

	function empty_star_inserts(that){
		var t = $(that);
		var circle_link = t;
		if(t.parent().find('.gpp__default_circle').length == 0){
			t.prepend(' <a style="font-size:9px;position:absolute;margin-left:-34px;" class="gpp__default_circle">' + STAR_OUTLINE + '</a>');
			var set_button = t.parent().find('.gpp__default_circle:first');
			set_button.click(function(){
				var t = $(this);
				circle_link_url = circle_link.attr('href');
				GM_setValue('gpp__default_circle_url', circle_link.attr('href'));
				allow_stream = false;
				window.location.href = circle_link_url;
				return false;
			})
			.hover(
				function(){
					$(this).empty().append('SET ' + STAR_HOVER_SOLID).css({'fontSize':'15px','color':'#DD4B39','marginLeft':'-70px'});
				},
				function(){
					$(this).empty().append(STAR_OUTLINE).css({'fontSize':'9px','color':'#36C','marginLeft':'-32px'});
				}
			);
		}
	}
	function img_star(base64){
		return '<img alt="*" src="' + 'data:image/png;base64,' + base64 + '">';
	}
	function add_css(){
		$('head').append('<style>'
			+ 'a.gpp__default_circle { text-decoration:none; }'
			+ 'a.gpp__default_circle img { border:none; }'
		+'</style>'
		);
	}
	function process_circles(t, default_circle_url, circle_link){
		//Process Circles
		if( default_circle_url == circle_link.attr('href') && t.find('.gpp__default_circle').length == 0 ){
			t.prepend(' <a style="font-size:9px;position:absolute;margin-left:-34px;" class="gpp__default_circle">' + STAR_SOLID + '</a>');
			var set_button = t.parent().find('.gpp__default_circle:first');
			set_button.click(function(){
				var t = $(this);
				circle_link_url = circle_link.attr('href');
				GM_removeItem('gpp__default_circle_url');
				window.location.href = './';
				return false;
			})
			.hover(
				function(){
					$(this).empty().append('UN-SET ' + STAR_HOVER_OUTLINE).css({'fontSize':'15px','color':'#DD4B39','marginLeft':'-97px'});
				},
				function(){
					$(this).empty().append(STAR_SOLID).css({'fontSize':'9px','color':'#36C','marginLeft':'-32px'});
				}
			);
		}else{
			empty_star_inserts(t);
		}
	}
	function main_loop(){
		//var circle_links_container = $("#content .a-b-la-A :first"); OLD
		//var circle_links_container = $("#content .a-b-sb-z:first"); //OLD
		//var circle_links_container = $("#content .a-c-mb-S:first"); //OLD
		//var circle_links_container = $("#content .a-e-nb-B:first"); //OLD
        var circle_links_container = $(SEL.circle_links_wrap); //NEW

		//var circle_links = $("#content .a-b-sb-z a[href*='stream/']"); //OLD
		//var circle_links = $("#content .a-mb-k-da a[href*='stream/']"); //OLD
		//var circle_links = $("#content .a-nb-j-T a[href*='stream/']"); //OLD
        var circle_links = $(SEL.circle_links); //NEW
		
		var default_circle_url = GM_getValue('gpp__default_circle_url', '');
		
		circle_links_container.css('margin-left','8px');
				
		//OFF <a href="/stream" target="_top" class="d-h a-b-h-Jb a-la-h a-la-aH ">Stream</a>
		//ON  <a href="/stream" target="_top" class="d-h a-b-h-Jb a-la-h a-la-aH  a-la-h-Pa">Stream</a>
		
		//Always add star to Stream 
		//var stream =  $("#content .a-c-mb-S a[href='/stream']:first"); //OLD
		//var stream =  $("#content .a-e-nb-B a[href='/stream']:first"); //OLD
        var stream =  $(SEL.stream_link); //NEW
		if(default_circle_url == '/stream'){
			if(stream.parent().find('.gpp__default_circle').length == 0){
				stream.before(' <a style="font-size:9px;position:absolute;margin-left:-4px;padding-top:7px" class="gpp__default_circle">' + STAR_SOLID + '</a>');
				var set_button = stream.parent().find('.gpp__default_circle:first');
				set_button.click(function(){
					GM_removeItem('gpp__default_circle_url');
					window.location.href = '/stream';
					return false;
				})
				.hover(
					function(){
						$(this).empty().append('UN-SET ' + STAR_HOVER_OUTLINE).css({'fontSize':'15px','color':'#DD4B39','marginLeft':'-66px','paddingTop':'3px'});
					},
					function(){
						$(this).empty().append(STAR_SOLID).css({'fontSize':'9px','color':'#36C','marginLeft':'-2px','paddingTop':'6px'});
					}
				);
			}
		}else{
			if(stream.parent().find('.gpp__default_circle').length == 0){
				stream.before(' <a style="font-size:9px;position:absolute;margin-left:-4px;padding-top:7px" class="gpp__default_circle">' + STAR_OUTLINE + '</a>');
				var set_button = stream.parent().find('.gpp__default_circle:first');
				set_button.click(function(){
					GM_setValue('gpp__default_circle_url', '/stream');
					window.location.href = '/stream';
					return false;
				})
				.hover(
					function(){
						//$(this).empty().append('SET ' + STAR_HOVER_SOLID).css({'fontSize':'15px','color':'#DD4B39','marginLeft':'-40px','paddingTop':'2px'});
						$(this).empty().append('SET ' + STAR_HOVER_SOLID).css({'fontSize':'15px','color':'#DD4B39','marginLeft':'-38px','paddingTop':'3px'});
					},
					function(){
						$(this).empty().append(STAR_OUTLINE).css({'fontSize':'9px','color':'#36C','marginLeft':'-2px','paddingTop':'6px'});
					}
				);
				stream.click(function(){
					allow_stream = true;
				});
				
			}
		}
		
		//var stream_active =  $("#content .a-b-la-A a[href='/stream'].a-la-h-Pa:first"); OLD 
		//var stream_active =  $("#content .a-b-sb-z a[href='/stream'].a-sb-k-Ea:first"); //OLD
		//var stream_active =  $("#content .a-c-mb-C a[href='/stream'].a-mb-k-ua:first"); //OLD
		//var stream_active =  $("#content .a-e-nb-B a[href='/stream'].a-nb-j-ma:first"); //OLD
        var stream_active =  $(SEL.stream_link_active); //NEW
		

		if( stream_active.length > 0 ){ 
			//Stream is current view
			if( circle_links.find('.gpp__default_circle').length == 0 ){
				circle_links.each(function(){
					var t = $(this);
					var circle_link = t;
					if(allow_stream){
						process_circles(t, default_circle_url, circle_link);
					}else{
						empty_star_inserts(this);
					}
				});
				if( default_circle_url != '' && default_circle_url != '/stream'){
					if( !allow_stream ){
						window.location.href = default_circle_url;
					}else{
						allow_stream = false;
					}
				}
			}
		}else{
			//Circle is current view
			circle_links.each(function(){
				var t = $(this);
				var circle_link = t;
				//Process Stream
				if(stream.parent().find('.gpp__default_circle').length == 0){
					stream.before(' <a style="font-size:9px;position:absolute;margin-left:-4px;padding-top:7px" class="gpp__default_circle">' + STAR_OUTLINE + '</a>');
					var set_button = stream.parent().find('.gpp__default_circle:first');
					set_button.click(function(){
						GM_setValue('gpp__default_circle_url', '/stream');
						window.location.href = '/stream';
						return false;
					})
					.hover(
						function(){
							//$(this).empty().append('SET Ã¢Ëœâ€¦').css({'fontSize':'15px','color':'#DD4B39','marginLeft':'-136px','paddingTop':'2px'});
							$(this).empty().append('SET ' + STAR_HOVER_SOLID).css({'fontSize':'15px','color':'#DD4B39','marginLeft':'-136px','paddingTop':'2px'});
						},
						function(){
							//$(this).empty().append('Ã¢Ëœâ€ ').css({'fontSize':'9px','color':'#36C','marginLeft':'-2px','paddingTop':'6px'});
							$(this).empty().append(STAR_OUTLINE).css({'fontSize':'9px','color':'#36C','marginLeft':'-2px','paddingTop':'6px'});
						}
					);
				}
				//Process Circles
				process_circles(t, default_circle_url, circle_link);
			});
		}
	}
	var allow_stream = false;

	var STAR_SOLID = img_star('iVBORw0KGgoAAAANSUhEUgAAAAkAAAAJCAYAAADgkQYQAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAHFJREFUeNpiYEADDnkn56OLMaIpUABS94FY8cAk8wcwcSY0TQFoNMQkqPEJDLjBAkaoNSBF87EoSARau4ARyT0NQKoeSUEjUEEDupv80UzxR3E41FcGIPuBukGmLwDxoeJwkwKg9ieCOFA6EeZLgAADAL1nIQU/3xDFAAAAAElFTkSuQmCC');
	var STAR_OUTLINE = img_star('iVBORw0KGgoAAAANSUhEUgAAAAkAAAAJCAYAAADgkQYQAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAI1JREFUeNpiYEADDnkn56OLMaIpUABS94FY8cAk8wcwcSY0TQFAfABKI0yCGu8AxBuA+CMQLwDiBCDmh9IbmIDGJgIZjTCFUGsWQPmFIHlGJPc0AKkHUOtAChSAChrQ3eQPkoA6XB/KRzgc6isDIJYHYkEgFgDxoeIMLFDFCVD7J0D5iUAFB6HiDQABBgDbKimYpe8i7gAAAABJRU5ErkJggg==');
	var STAR_HOVER_SOLID = img_star('iVBORw0KGgoAAAANSUhEUgAAAA8AAAAPCAYAAAA71pVKAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJ bWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdp bj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6 eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYwIDYxLjEz NDc3NywgMjAxMC8wMi8xMi0xNzozMjowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJo dHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlw dGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAv IiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RS ZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpD cmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNSBNYWNpbnRvc2giIHhtcE1NOkluc3RhbmNl SUQ9InhtcC5paWQ6M0E0QTAxMjlBRUI3MTFFMEE0N0REQTQ5Qzc5NjMxNjEiIHhtcE1NOkRvY3Vt ZW50SUQ9InhtcC5kaWQ6M0E0QTAxMkFBRUI3MTFFMEE0N0REQTQ5Qzc5NjMxNjEiPiA8eG1wTU06 RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpGRjBDNjMzRUFFQjIxMUUwQTQ3 RERBNDlDNzk2MzE2MSIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDozQTRBMDEyOEFFQjcxMUUw QTQ3RERBNDlDNzk2MzE2MSIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1w bWV0YT4gPD94cGFja2V0IGVuZD0iciI/PqDC6ZsAAAGUSURBVHjalJNLSAJRFIb/O5QmWkZgZWZB 6zYtpE37Fm3cBe2ixyJ6LIQ2Ua0KgoJ2QYto1TKoXRG5ShC0MlolSGC+ylFnfGCannRmfBBO4IE7 M9xzvvv/98y9ICKoDT4Ypv/yHNSCovSxf4KkKJJaiSpcCHpQ5J3IRYtoGxbcd5Ung+j1twmX48Tf P0mf+Qc3UirWW8I/sUfkEtV6qqxzi9xXa+vs/WiO4u4UuL5uUD4DpjOA+DBkKUWQ9YDr1ct5LQOl 0uiwbYAR5Sl8sYvIletvu6U9N96N0M1sw2KfrMLy6pmXS/LvHaNcU1PAapoxBWYDMDkOMGIbkybq sNSnjJ/edpaQDZVl7UpO5hi4oWkMb67CZDaylg3jDFZ0ahsW64oVB0xnhUbP1LtdSvggBEqK3ea/ w1AKXCOXJHVY9DpRJrlBXVMOjB6ewTBhUcQ/kX4NqcHflHDeSFZNa+cYX7dDY+yHeeUUgwuzUkXW 6YHQfGBqN6Qkesm3uEVCvEC1EAShPviAi57nlykWEeo37VeAAQDHjvlsiBkeUwAAAABJRU5ErkJg gg==');
	var STAR_HOVER_OUTLINE = img_star('iVBORw0KGgoAAAANSUhEUgAAAA8AAAAPCAYAAAA71pVKAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJ bWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdp bj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6 eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYwIDYxLjEz NDc3NywgMjAxMC8wMi8xMi0xNzozMjowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJo dHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlw dGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAv IiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RS ZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpD cmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNSBNYWNpbnRvc2giIHhtcE1NOkluc3RhbmNl SUQ9InhtcC5paWQ6M0E0QTAxMkRBRUI3MTFFMEE0N0REQTQ5Qzc5NjMxNjEiIHhtcE1NOkRvY3Vt ZW50SUQ9InhtcC5kaWQ6M0E0QTAxMkVBRUI3MTFFMEE0N0REQTQ5Qzc5NjMxNjEiPiA8eG1wTU06 RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDozQTRBMDEyQkFFQjcxMUUwQTQ3 RERBNDlDNzk2MzE2MSIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDozQTRBMDEyQ0FFQjcxMUUw QTQ3RERBNDlDNzk2MzE2MSIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1w bWV0YT4gPD94cGFja2V0IGVuZD0iciI/PiFjuWsAAAHHSURBVHjalJJfSFNhGMafs5lTC6ZJFF5I dNFVd3qVKREDkSDv8sIpQXXlhREoWN4aESjeikg3u1CKLmQwEvGqP4pTmW1YoLTNcG5ubTub5+g5 Z3s6O8nqiEfYBy/fn+f9fd/7PnwCSVgNJZtntfOSYKXbLEnGuT06CUVfVQwrv1YhxT9C3FNRMZxd XjTm1MqPCmGmmPDto2lwAIcflqBZlH4mrMW+4khpwdXbXXCo75GxKL0qMtHL5MouSq7bLjpBSdTf IWq6xmEXnMLlzmaGn91DWD+163pRyhqg485IKU/mnmeQ/oft3PFtUJVlHmcy1FSWBqge6fs0NTnH uPeVkfd99jOLhngS+dA813QhOLPAAk/AcuQZnXpKf899xoKJsob/k4pSmKFHHQx6Nkzw/ls3/e43 lA7Nl5oME2qv4UItUN9609hL0Zhxf31bJ4SGRjjqznG7kPYjJ7pw5YaCn6+7uTXUg8DYO9ivu+A4 0D9MitZwbtULaiFs9T2AaHfj1swcnDYPAv0vcFyMIbm5e+o/lHuQuf38ruFm5MuOqbf0p2njfH14 zmRmOaEgrjHw5CWzSeWU039D+x3gt8cDFPP/4D8CDADOgV5B+CQR3QAAAABJRU5ErkJggg==');

	
	/****** Execute before main_loop ******/
	add_css();
	
	/****** Start main_loop ******/
	setInterval(main_loop, 2000);
}


/****** Load jQuery then callback upon load function ******/
function addJQuery(callback){
	var script = document.createElement("script");
	script.setAttribute("src", protocol + "ajax.googleapis.com/ajax/libs/jquery/1.6.1/jquery.min.js");
	script.addEventListener('load', function() {
		var script = document.createElement("script");
		script.textContent = "(" + callback.toString() + ")();";
		document.body.appendChild(script);
	}, false);
	document.body.appendChild(script);
}

/****** Call Load jQuery + callback function ******/
var protocol = window.location.protocol + '//';
addJQuery(defaultCircle);