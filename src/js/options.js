/**
 * 
 */
$(function(){
	Music.options.init();
	Music.share.build($('.share'), null, 8);
	$('button.save').click(function(){
		Music.options.save();
	})
})
