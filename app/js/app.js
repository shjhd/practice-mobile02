'use strict';

(function($){
	var now = 1,last =0;
	const towards = {up:1,down:2};
	var isAnimating = false;

  document.addEventListener("touchmove",function(e){e.preventDefault();},false);

  $(document).swipeUp(function(){
		if (isAnimating) return;
		last = now;
		if (last != 2) { now = last+1; pageMove(towards.up);}
	})

	$(document).swipeDown(function(){
		if (isAnimating) return;
		last = now;
		if (last!=1) { now = last-1; pageMove(towards.down);}
	})

function pageMove(tw){
	var lastPage = ".page-"+last,
		nowPage = ".page-"+now;
	var outClass,inClass;

	switch(tw) {
		case towards.up:
			outClass = 'animated slideOutUp';
			inClass = 'animated fadeInUp';
			break;
		case towards.down:
			outClass = 'animated slideOutDown';
			inClass = 'animated fadeInDown';
			break;
	}
	isAnimating = true;
	$(nowPage).removeClass("hide");
	$(lastPage).addClass(outClass);
	$(nowPage).addClass(inClass);


	setTimeout(function(){
		$(lastPage).removeClass(outClass);
		$(lastPage).addClass("hide");

		$(nowPage).removeClass(inClass);

		isAnimating = false;
	},600);
}
})(Zepto);
