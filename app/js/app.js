'use strict';

(function($){
	var now = 1,last =0;
	const towards = {up:1,down:2};
	var isAnimating = false;

  document.addEventListener("touchmove",function(e){e.preventDefault();},false);

  $(document).swipeUp(function(){
		if (isAnimating) return;
		last = now;
		if (last != 9 && last != 3) {
				now = last+1; pageMove(towards.up);
		}
	})

	$(document).swipeDown(function(){
		if (isAnimating) return;
		last = now;
		if (last != 1) { now = last-1; pageMove(towards.down);}
	})

	$("#btn1").click(function(e){
		e.preventDefault();
		var age1=parseInt($('.input-1').val()),
				age2=parseInt($('.input-2').val());
		if(!(age1 > 10 && age1 < 80) || !(age2 > 10 && age2 < 80)){
			return window.alert("请输入正确年龄！");
		}
		var differ = Math.abs(age1-age2),
				$differfinger = $(".finger > div").empty();
		for(var i =differ; i > 0;i--)
			$('<span>'+ i +'</span>').appendTo($differfinger);
		if(differ >= 18){
			now = 5; pageMove(towards.up);
		}
		else{
			now = 4; pageMove(towards.up);
		}
		$('.page-3').addClass('hide');
	});

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
