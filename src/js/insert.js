(function(){
	var musicList = [],
	sName = "chrome_music_count",
	defaultFn = function(bd){
		bd.style.width = this.width;
		bd.style.height = this.height;
		bd.style.overflow = 'hidden';
	},
	imglog = function(){
		var iframe = document.createElement('iframe');
		iframe.style.display = 'none';
		iframe.onload = function(){
			iframe && document.body.removeChild(iframe);
			iframe = null;
		};
		iframe.src = "http://goo.gl/Lh0P9";
		document.body.appendChild(iframe);
	},
	$ = function(el){
		return typeof el == 'string' ? document.getElementById(el) : el;
	},
	removeChild = function(el){
		el = $(el);
		if(el && el.parentNode){
			el.parentNode.removeChild(el);
		}
	},
	repaintFn = {
		'kuwo':function(bd){
			bd.style.paddingTop = 0;
		},
		'renren':function(){
			var removeEles = ['.header','.footer'].join(',');
			var els = [].slice.call(document.querySelectorAll(removeEles));
			els.forEach(function(el){
				removeChild(el);
			});
			var el = $('radioBox');
			el.style.paddingTop = '0';
			el.style.margin = 'auto';
			el.style.width = 'auto';
			el.style.height = 'auto';
			el.style.background = 'none';
			var el = document.querySelector('.radio');
			el.style.margin = 'auto';
			var el = document.getElementById('radioBody');
			el.style.width = 'auto';
		},
		"baidu":function(bd){
			var width = this.width, height = this.height, timer = 0, flag = false;
			window.addEventListener('load',function(){
				timer = setInterval(function(){
					if(flag){
						clearInterval(timer);
						return true;
					}
					flag = true;
					var pg = $('pg');
					pg.style.width = width;
					removeChild('girl');
					var p2 = document.querySelector('#top .p2');
					p2.style.width = '160px';
					var p4 = document.querySelector('#top .p4');
					p4.style.width = 'auto';
					window.resizeTo(width, height);
				}, 10);
			});
		},
		"yishouge":function(bd){
			removeChild('header');
			removeChild('footer');
			$('ysg-player').style.margin = 'auto';
		}
	};
	chrome.extension.sendRequest({music:'get'}, function(response) {
		musicList = response;
		//alert(JSON.stringify(musicList))
		for(var name in response){
			var url = response[name].url;
			if(url && location.href.indexOf(url) === 0){
				var repaint = repaintFn[name];
				if(name !== 'ting' && location.href.indexOf('#welefen') > -1){
					defaultFn && defaultFn.call(response[name], document.body);
					repaint && repaint.call(response[name], document.body);
				}
				//重新设置localStorage
				chrome.extension.sendRequest({setItem:'1'}, function(response) { });
				//添加统计
				window.addEventListener("load", function(){
					setTimeout(function(){
						imglog();
					}, 3000);
				});
				break;
			}
		}
	});
	chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
		if(request.close == 1){
			for(var name in musicList){
				var url = musicList[name].url;
				if(url && location.href.indexOf(url) === 0){
					window.open('', '_self', ''); //chrome下通过这种方式可以关闭不能关闭的窗口
					window.close();
					return true;
				}
			}
		}
	});
})();
