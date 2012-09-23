/**
 * 
 */
$(function(){
	Music.share.build($('.share'), 'qzone,qqweibo,weibo,renren'.split(','));
	Music.popup.init();
})
