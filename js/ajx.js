if ( !window.jQuery ) { alert("jQuery is required for Ajaxy to run."); throw new Error("Ajaxy requires jQuery!"); }

jQuery.ajaxy = (function(){
    
    var settings = {
    
            base: '',
            homepage: '',
            anchorFilter: function() {
                return !/.(pdf|jpe?g|gif|png|bmp|tif|txt|swf|htm)$/.test(this.href);
            },
            update: ['#wrapper','title'],
            
            updateHandler: {
                '#wrapper': function(newContent) {
                    jQuery(this).animate({
                        height: "hide",
                        opacity: 0
                    }, function(){
												jQuery(this).html(newContent).animate({
                            height: "show",
                            opacity: 1
                        });
												
												// Document.ready statements
												
												onPageLoad();
												
                    });
                }
            }
						,
            
            //initialStyles: "h1{visibility:hidden;} #content{height:0;opacity:0;overflow:hidden;}",
						initialStyles: "",
            
            loader: {
                
                css: {
                    position: 'absolute',
                    background: '#FFF url(img/ldr.gif) no-repeat center',
                    MozBorderRadius: 4,
                    WebkitBorderRadius: 4,
                    padding: '5px',
                    fontSize: '.8em',
                    opacity: 0,
                    top: jQuery('#menu').offset().top,
                    right: 15,
                    height: 16,
                    width: 16
                },
                html: "",
                attr: {},
                init: function(loader){
                    loader.appendTo('#wrapper');
                    jQuery(document).ready(function(){
                        loader.css({
                            top: jQuery('#menu').position().top + 7
                        });
                    });
                },
                show: function(loader, href){
                    
                    loader.stop(true).animate({
                        opacity: 1
                    });                  
                },
                hide: function(loader){
                    
                    loader.animate({
                        opacity: 0
                    });
                    
                }
                
            },
            
            errorHandler: function( XHR ) {
                if (XHR.status === 404) {
                   // $('#wrapper').html('<p><strong>404 Page Not Found</strong></p>');
									 alert('\nLa informaci\u00F3n que solicitas no est\u00E1 disponible por el momento.\n');
                    settings.loader.hide( ajaxy.loader );
                }
            },
            
            autoInit: true,
            cache: false
            
        },
        
        run = false,
        
        HEAD = jQuery('head')[0],
        BODY = document.body,
        
        util = {
            isExternal: function(url) {
                return !RegExp('^' + location.href.match(/.+?\/(?=[^\/])/)[0] + location.hostname).test(url);
            },
            hash: {
                bind: function(newHashFn) {
                    jQuery.historyInit( newHashFn );
                },
                load: function(h){
                    return jQuery.historyLoad(h);
                }
            }
        };
        
    function log(a) {
        arguments[0] = '[AJAXY] ' + a;
        return window.console && console.log && console.log.apply( console, arguments );
    }
    
    jQuery.extend({historyCurrentHash:undefined,historyCallback:undefined,historyIframeSrc:undefined,historyNeedIframe:jQuery.browser.msie&&(jQuery.browser.version<8||document.documentMode<8),historyInit:function(e,d){jQuery.historyCallback=e;if(d){jQuery.historyIframeSrc=d}var c=location.hash.replace(/\?.*$/,"");jQuery.historyCurrentHash=c;if(jQuery.historyNeedIframe){if(jQuery.historyCurrentHash==""){jQuery.historyCurrentHash="#"}jQuery("body").prepend('<iframe id="jQuery_history" style="display: none;" src="javascript:false;"></iframe>');var a=jQuery("#jQuery_history")[0];var b=a.contentWindow.document;b.open();b.close();b.location.hash=c}else{if(jQuery.browser.safari){jQuery.historyBackStack=[];jQuery.historyBackStack.length=history.length;jQuery.historyForwardStack=[];jQuery.lastHistoryLength=history.length;jQuery.isFirst=true}}if(c){jQuery.historyCallback(c.replace(/^#/,""))}setInterval(jQuery.historyCheck,100)},historyAddHistory:function(a){jQuery.historyBackStack.push(a);jQuery.historyForwardStack.length=0;this.isFirst=true},historyCheck:function(){if(jQuery.historyNeedIframe){var a=jQuery("#jQuery_history")[0];var d=a.contentDocument||a.contentWindow.document;var f=d.location.hash.replace(/\?.*$/,"");if(f!=jQuery.historyCurrentHash){location.hash=f;jQuery.historyCurrentHash=f;jQuery.historyCallback(f.replace(/^#/,""))}}else{if(jQuery.browser.safari){if(jQuery.lastHistoryLength==history.length&&jQuery.historyBackStack.length>jQuery.lastHistoryLength){jQuery.historyBackStack.shift()}if(!jQuery.dontCheck){var b=history.length-jQuery.historyBackStack.length;jQuery.lastHistoryLength=history.length;if(b){jQuery.isFirst=false;if(b<0){for(var c=0;c<Math.abs(b);c++){jQuery.historyForwardStack.unshift(jQuery.historyBackStack.pop())}}else{for(var c=0;c<b;c++){jQuery.historyBackStack.push(jQuery.historyForwardStack.shift())}}var e=jQuery.historyBackStack[jQuery.historyBackStack.length-1];if(e!=undefined){jQuery.historyCurrentHash=location.hash.replace(/\?.*$/,"");jQuery.historyCallback(e)}}else{if(jQuery.historyBackStack[jQuery.historyBackStack.length-1]==undefined&&!jQuery.isFirst){if(location.hash){var f=location.hash;jQuery.historyCallback(location.hash.replace(/^#/,""))}else{var f="";jQuery.historyCallback("")}jQuery.isFirst=true}}}}else{var f=location.hash.replace(/\?.*$/,"");if(f!=jQuery.historyCurrentHash){jQuery.historyCurrentHash=f;jQuery.historyCallback(f.replace(/^#/,""))}}}},historyLoad:function(d){var e;d=decodeURIComponent(d.replace(/\?.*$/,""));if(jQuery.browser.safari){e=d}else{e="#"+d;location.hash=e}jQuery.historyCurrentHash=e;if(jQuery.historyNeedIframe){var a=jQuery("#jQuery_history")[0];var c=a.contentWindow.document;c.open();c.close();c.location.hash=e;jQuery.lastHistoryLength=history.length;jQuery.historyCallback(d)}else{if(jQuery.browser.safari){jQuery.dontCheck=true;this.historyAddHistory(d);var b=function(){jQuery.dontCheck=false};window.setTimeout(b,200);jQuery.historyCallback(d);location.hash=e}else{jQuery.historyCallback(d)}}}});
        
    function load(href) {
        
        log("Load called: ", href);
        
        if (ajaxy.requestInProgress) {
            return;
        }
                
        if (!ajaxy.loader) {
            ajaxy.loader = jQuery('<div/>');
            ajaxy.loader
                .css(settings.loader.css)
                .html(settings.loader.html)
                .attr(settings.loader.attr)
                .appendTo(BODY);
            settings.loader.init(ajaxy.loader);
        }
        
        settings.loader.show( ajaxy.loader, href );
        
        ajaxy.requestInProgress = true;
        
        var requestPath = /\//.test(href) ? href.replace(/\/[^\/]+$/, '/') : '';
        
        // absolute URLs
        href = href.replace( window.location.href.replace(/(:\/\/.+?\/).+/, '$1') + settings.base, '' );
        // based-relative URLs
        href = href.replace( settings.base, '' );
    
        jQuery.ajax({
        
            url: href,
            cache: settings.cache,
            type: 'GET',
        
            complete: function(response, status) {
                
                log("XHR: " + status);
            
                if ( status !== "success" && status !== "notmodified" ) {
                    return;
                }
                
                ajaxy.requestInProgress = false;
                
                var responseText = response.responseText
                                    .replace(/<!DOCTYPE.+?>/,'')
                                    .replace(/<(\/?)(body|head|html|title)(?=.*?>)/g, '<$1ajaxy$2')
                                    .replace(/<script(.|\s)*?\/script>/g, "")
                                    .replace(/((?:href|src|action)\s*=\s*)('|")((?:\S|\\\2)+?)(\2|\s)/g,
                                        // Correct relative URLs, by prepending the current path.
                                        function($0,$1,$2,URL,$4){
                                            if ( !/^https?:\/\/|^\//.test(URL) ) {
                                                return $1 + $2 + requestPath + URL + $4;
                                            }
                                            return $0;
                                        }
                                    ),
                    
                    specialHTML = (function(){
                    
                        var elMatches = responseText.match(/<ajaxy(body|head|html).*?>/ig), 
                            out = {};
                            
                        if (elMatches) {
                            jQuery.each(elMatches, function(i, match){
                                out[match.match(/<(.+?)(>|\s)/)[1].toLowerCase()] = match.replace(/^<ajaxy/g,'<');
                            });
                        }
                        
                        return out;
                        
                    })(),
                    
                    domResponse = $('<div/>').append(responseText);
                
                domResponse.children().each(function(){
                    if ( /^(meta|style|link)$/i.test(this.nodeName) ) {
                        jQuery(this).appendTo(HEAD);
                    }
                    if ( /^(script)$/i.test(this.nodeName) ) {
                        jQuery(this).remove();
                    }
                });
                
                settings.update = jQuery(
                    settings.update[0].nodeName || (settings.update instanceof jQuery) || jQuery.isArray(settings.update) ? settings.update : [settings.update]
                );
                
                settings.update.each(function(i, item){
                    
                    log("Updating item: ", item);
                
                    var $item = jQuery(item),
                        clone = $item.clone(true),
                        
                        selector = $item.selector.replace(/(^|\s)(body|html|head)$/, '$1ajaxy$2');
                    
                    if ( selector === 'title' ) {
                        // De-entitify title, before setting
                        document.title = jQuery('<div/>').append((responseText.match(/<ajaxytitle>(.+?)<\/ajaxytitle>/i)||['',''])[1]).text();
                        return true;
                    }
                    
                    $item.each(function(i){
                    
                        var replacement = domResponse.find(selector).eq(i);
                            
                        if (!replacement[0]) {return true;}
                        
                        if ( /^ajaxy/i.test(replacement[0].nodeName) ) {
                            replacement = jQuery(specialHTML[replacement[0].nodeName.toLowerCase()]).append(replacement[0].childNodes);
                        }
                        
                        if (settings.updateHandler && settings.updateHandler[selector]) {
                            settings.updateHandler[selector].call( this, replacement.html(), replacement );
                        } else {
                            jQuery(this).replaceWith( replacement );
                        }
                        
                    });
                    
                    return true;
                    
                });
                
                settings.loader.hide( ajaxy.loader, href );
                
                // Hide initialHidden elems
                if (ajaxy.headStyle) {
                    ajaxy.headStyle.remove();
                }
                
            },
            error: function() {
                ajaxy.requestInProgress = false;
                if (ajaxy.headStyle) {
                    ajaxy.headStyle.remove();
                }
                return settings.errorHandler.apply(this, arguments);
            }
        });
        
    }
    
    function redirectToHomePage() {
        var loc = window.location;
        /* Users landing on a.html will be redirected to
         * homepage.html#a.html ... */
        
        var fullPath = settings.base + settings.homepage;
        
        if (loc.pathname !== fullPath && loc.pathname.indexOf(settings.base) === 0) {
            var curPage = loc.pathname.replace(settings.base, '');
            if (curPage) {
                window.location = settings.base + settings.homepage + '#' + curPage;
            }
        }
    }
    
    function ajaxy(ops) {
    
        if (!run){
            redirectToHomePage();
        }
        
        if (settings.initialStyles && window.location.hash) {
            ajaxy.headStyle = ajaxy.headStyle || jQuery('<style type="text/css">' + settings.initialStyles + '</style>').appendTo('head');
        }
        
        /* Wait for body to be ready */
        if (!document.body) {
            var interval = setInterval(function(){
                if (document.body) {
                    BODY = document.body;
                    clearInterval(interval);
                    ajaxy(ops);
                }
            }, 20);
            return;
        }
        
        if (run) {
            return;
        } else {
            run = true;
        }
        
        util.hash.bind(load, settings.base);
        
        jQuery.extend( settings, ops );
        
        jQuery('a').live('click', function(e){
            
            var href = this.href,
                matches = jQuery.isFunction(settings.anchorFilter) ? settings.anchorFilter.call(this) : jQuery(this).is(settings.anchorFilter);
                
            if ( !util.isExternal(href) && matches && e.button === 0 ) {
                
                log("Matching anchor clicked: ", this.pathname);
            
                e.preventDefault();
                
                util.hash.load(
                    this.pathname
                        .replace(/^[^\/]/, '/$&')
                        .replace(settings.base, '')
                );
                
                return false;
                
            }
            
        });
        
    }
    
    if (settings.autoInit) {
        ajaxy();
    }
    
    ajaxy.load = load;
    ajaxy.settings = settings;
    
    return ajaxy;
    
})();