// ==UserScript==
// @name           googleplusplus_default_circle
// @author         Micah Wittman
// @namespace      http://wittman.org/projects/googleplusplus_default_circle
// @include        *plus.google.com*
// @description    Redirects from Stream view to a default circle
// @version        0.1.5
// ==/UserScript==


function defaultCircle(){
	var logging = false;

	function log(txt) {
	  if(logging) {
	    console.log(txt);
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
	function empty_star_inserts(that){
		var t = $(that);
		var circle_link = t;
		if(t.parent().find('.gpp__default_circle').length == 0){
			t.prepend(' <a style="font-size:9px;position:absolute;margin-left:-34px;" class="gpp__default_circle">☆</a>');
			var set_button = t.parent().find('.gpp__default_circle:first');
			set_button.click(function(){
				var t = $(this);
				circle_link_url = circle_link.attr('href');
				GM_setValue('gpp__default_circle_url', circle_link.attr('href'));
				window.location.href = circle_link_url;
				return false;
			})
			.hover(
				function(){
					$(this).empty().append('SET ★').css({'fontSize':'15px','color':'#DD4B39','marginLeft':'-70px'});
				},
				function(){
					$(this).empty().append('☆').css({'fontSize':'9px','color':'#36C','marginLeft':'-32px'});
				}
			);
		}
	}
	function main_loop(){

		var circle_links = $("#content .a-b-la-A a[href*='stream/']");
		var default_circle_url = GM_getValue('gpp__default_circle_url', '');
		
		//OFF <a href="/stream" target="_top" class="d-h a-b-h-Jb a-la-h a-la-aH ">Stream</a>
		//ON  <a href="/stream" target="_top" class="d-h a-b-h-Jb a-la-h a-la-aH  a-la-h-Pa">Stream</a>
		
		//Always add star to Stream 
		var stream =  $("#content .a-b-la-A a[href='/stream']:first");
		if(default_circle_url == '/stream'){
			if(stream.parent().find('.gpp__default_circle').length == 0){
				stream.before(' <a style="font-size:9px;position:absolute;margin-left:-4px;padding-top:7px" class="gpp__default_circle">★</a>');
			}
		}else{
			if(stream.parent().find('.gpp__default_circle').length == 0){
				stream.before(' <a style="font-size:9px;position:absolute;margin-left:-4px;padding-top:7px" class="gpp__default_circle">☆</a>');
				var set_button = stream.parent().find('.gpp__default_circle:first');
				set_button.click(function(){
					GM_setValue('gpp__default_circle_url', '/stream');
					window.location.href = '/stream';
					return false;
				})
				.hover(
					function(){
						$(this).empty().append('SET ★').css({'fontSize':'15px','color':'#DD4B39','marginLeft':'-40px','paddingTop':'2px'});
					},
					function(){
						$(this).empty().append('☆').css({'fontSize':'9px','color':'#36C','marginLeft':'-2px','paddingTop':'6px'});
					}
				);
			}
		}
		
		var stream_active =  $("#content .a-b-la-A a[href='/stream'].a-la-h-Pa:first");
		if( stream_active.length > 0 ){ 
			//Stream is current view
			if( circle_links.find('.gpp__default_circle').length == 0 ){
				if( default_circle_url != '' && default_circle_url != '/stream'){
					window.location.href = default_circle_url;
				}
				circle_links.each(function(){
					empty_star_inserts(this);
				});
			}
		}else{
			//Circle is current view
			if(default_circle_url != ''){
				circle_links.each(function(){
					var t = $(this);
					var circle_link = t;
					//Process Stream
					if(stream.parent().find('.gpp__default_circle').length == 0){
						stream.before(' <a style="font-size:9px;position:absolute;margin-left:-4px;padding-top:7px" class="gpp__default_circle">☆</a>');
						var set_button = stream.parent().find('.gpp__default_circle:first');
						set_button.click(function(){
							GM_setValue('gpp__default_circle_url', '/stream');
							window.location.href = '/stream';
							return false;
						})
						.hover(
							function(){
								$(this).empty().append('SET ★').css({'fontSize':'15px','color':'#DD4B39','marginLeft':'-136px','paddingTop':'2px'});
							},
							function(){
								$(this).empty().append('☆').css({'fontSize':'9px','color':'#36C','marginLeft':'-2px','paddingTop':'6px'});
							}
						);
					}
					//Process Circles
					if( default_circle_url == circle_link.attr('href') && t.find('.gpp__default_circle').length == 0 ){
						t.prepend(' <a style="font-size:9px;position:absolute;margin-left:-34px;" class="gpp__default_circle">★</a>');
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
								$(this).empty().append('UN-SET ☆').css({'fontSize':'15px','color':'#DD4B39','marginLeft':'-97px'});
							},
							function(){
								$(this).empty().append('★').css({'fontSize':'9px','color':'#36C','marginLeft':'-32px'});
							}
						);
					}else{
						empty_star_inserts(this);
					}
				});
			}
		}
		
	}
	
	/****** Start main_loop ******/
	setInterval(main_loop, 3000);
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
if(window.location.href.indexOf('/photos') == -1){ //Doesn't work on photos page right now.
	addJQuery(defaultCircle);
}