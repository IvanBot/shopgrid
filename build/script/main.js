(function () {

	var DOM = {
		tabs       : "#tabs",
		tab        : ".tab",
		tab_slider : ".tab_slider img"
	};

	var	tabs           = [];
		last_width     = 0;

		offset         = 40;
		outset         = -370;
		set            = 1;

	var img_target;
	var	new_index;
	var _content;
	var	main_index;
	var	target_index;
	var sl_width;
	var slide_time = 300;
	var slide_phase = 0;
	var _content_prefix = "#tab_content-";
	var tab_active = ".tab-active";
	var tabs_content_active = "tabs_content-active";
	var direction;
	var pos_end = 0;
	var pos_start = 0;

	var slider = "#sec-tab_slider";
	var img = "#sec-tab_slide-";
	var img_width = 243;
	var img_id;
	var imgs = [];
	var new_img;

	/**
	  * @ Установка стартового расположение табов
	  * @ Формирование коллекции уникальных значений для
	  *   каждого таба [ DOM элемент, порядковый номер,
	  *   ширина ]
	  * @ Запуск смещения табов при клике на одного из них
	  *
	  */

	$(DOM.tab).each(function(index){

		var $this = $(this);
		var width = $this.width();

		if ( index == 0 ) {
			set = outset - width; }
			else if ( index == 1 ) {
				main_index = index;
				_content = _content_prefix + main_index;
				$(_content).addClass(tabs_content_active);
				set = 0;
				$(this).addClass("tab-active"); }
				else  {
					set = set + last_width + offset; }

		last_width = width;
		$(this).css('left' , set + 'px');

		tabs.push({
			element:  $this,
			index:    index,
			width:    width
		});

		$(this).on('click', _move.bind(this, index) );
	});

	/**
	  * @ Установка стартового расположение скринов
	  * @ Формирование коллекции уникальных значений для
	  *   каждого скрина [ DOM элемент, порядковый номер,
	  *   ширина ]
	  *
	  */


	genSlide();
	function genSlide() {

		$(slider).css("left", -img_width);
		var set = 0;

		$(DOM.tab_slider).each(function(index) {

			var $this = $(this);

			imgs.push({
				element:  $this,
				index:    index,
			});

			// if (index == 4) {
			// 	set = 0 - img_width;
			// }

			// else if (index == 3) {
			// 	set = 0 - img_width*2;
			// }

			$this.css('left', set + 'px');
			set = set + img_width;


			// if ( index == 0 ) {
			// 	set = - img_width; }
			// 	else if ( index == 1 ) {
			// 		set = 0; }
			// 		else if ( index == 2 ) {
			// 			set = img_width; }


			// last_width = sl_width;

			// drawImg(argument);

			// if (index == 0) {
			// 	sl_set = -last_width;
			// 	$this.css('left' , sl_set + 'px');
			// }

			// else if (index == imgs.length - 1) {
			// 	sl_set = -last_width*2;
			// 	$this.css('left' , sl_set + 'px');
			// }

			// else {
			// 	sl_set = last_width + sl_set;
			// 	$this.css('left' , sl_set + 'px');
			// }
		});
	}

	// function drawImg(main_index) {

	// 	for (var i=0; i<imgs.length; i++) {
	// 		imgs[i].element.css("opacity", 0);
	// 	}

	// 	var imgM = img +  main_index;
	// 	var imgL = img + (main_index + 1);
	// 	var imgR = img + (main_index - 1);

	// 	$(imgL).css("opacity", 1);
	// 	$(imgR).css("opacity", 1);
	// 	$(imgM).css("opacity", 1);





		// if (index == 0) {
		// 	sl_set = -last_width;
		// 	$this.css('left' , sl_set + 'px');
		// }

		// else if (index == imgs.length - 1) {
		// 	sl_set = -last_width*2;
		// 	$this.css('left' , sl_set + 'px');
		// }

		// else {
		// 	sl_set = last_width + sl_set;
		// 	$this.css('left' , sl_set + 'px');
		// }
	// }

	/**
	  * @ Получаем из CSS значение позиции таба:
	  *   положительное, отрицательное или равно нулю
	  *
	  */

	function getPosition(index) {
		var str = tabs[index].element.css("left");
		var a   = parseInt(str.replace("px", ""));
		return a;
	}

	/**
	  * @ Определяем направление смещения на основе
	  *   расположения выбранного таба
	  * @ Запускаем функцию смещения табов и скринов
	  *
	  */

	function _move(index) {

		target_index = index;

		// var str = tabs[index].element.css("left");
		// var a   = parseInt(str.replace("px", ""));
		// console.log(a);

		var a = getPosition(index);

		if (a > 0) {
			direction = -1; }
			else if (a < 0) {
				direction     = 1;
				main_index = index }
				else if (a == 0) {
					direction = 0; }

		// console.log(_content);
		// $(_content).removeClass(tabs_content_active);
		_moveToDirection(direction, index);

	}

	/**
	  * @ Механика перемещения табов...
	  *
	  */

	// main_item = 3
	// loop
	// main_item = 4
	// loop
	// main_item = 0
	// target    = 0
	// done

	// var _content = _content_prefix + (tab_current+1);
	// $(_content).addClass(tabs_content_active);

	function _moveToDirection(direction, index) {


		if (direction == 0) return false;

		var str        = $(slider).css("left");
		var slider_pos = parseInt(str.replace("px", ""));



		draw(direction);

		function draw(direction) {
		var img_pos;
		// console.log(slider_pos);

		// drawImg(main_index);
		$(_content).removeClass(tabs_content_active);


			var next_pos_x = 0;
			var current_pos_x = next_pos_x;

			// перебор элементов из DOM
			for (var i=0; i<tabs.length; i++) {

				// 1: main_index из DOM 0 [1] 2 3 4
				// 2:
				// изминение положения относительно current_i
				var element_index = main_index + i;

				//
				element_index = limit(element_index);
				img_id = img + element_index;


				// изминение индекса DOM элемента при итерации
				var tab = tabs[element_index];
				tab.element.removeClass("tab-active");

				// определение позиции при итерации
				if (direction < 0) {


					if(i==0) {

						slider_pos = slider_pos - img_width;
						current_pos_x = outset - tab.width;


					}

					else if (i == tabs.length-2) {
						var str        = $(img_id).css("left");
						var pos_end    = parseInt(str.replace("px", ""));

						current_pos_x = next_pos_x;
						next_pos_x = current_pos_x + tab.width + offset;
					}

					else if (i == tabs.length-1) {

						current_pos_x = next_pos_x;
						next_pos_x = current_pos_x + tab.width + offset;
						// var end = img_width * (tabs.length - 1);
						// pos_end = pos_end + img_width;
						img_pos = pos_end + img_width;
						new_img = img_id;
						// console.log(img_pos);

					}

					else {// inbetweens
						current_pos_x = next_pos_x;
						next_pos_x = current_pos_x + tab.width + offset;
						// img_pos = img_pos + img_width;
						// slider_pos = slider_pos + img_width;
					}


				}

				else if (direction > 0) {


					if (i == tabs.length - 1) {
						slider_pos = slider_pos + img_width;
						current_pos_x = outset - tab.width;

						var str       = $(img_id).css("left");
						var pos_start = parseInt(str.replace("px", ""));

						// pos_start = pos_start - img_width*4;
						img_pos = pos_start - img_width * tabs.length;

						// next_pos_x = current_pos_x + tab.width + offset;
						// last_width = tab.width;
					}

					else if (i==0) {
						// img_pos = 0;
						current_pos_x = next_pos_x;
						next_pos_x = current_pos_x + tab.width + offset;
					}

					// if(i == tab.length - 1) {
					// 	current_pos_x = outset;
					// }

					else {// inbetweens
						current_pos_x = next_pos_x;
						next_pos_x = current_pos_x + tab.width + offset;
						// img_pos = img_pos + img_width;
						// slider_pos = slider_pos + img_width;
					}

				}

				// console.log("element_index:",tab.index,"\ncurrent_pos_x:", current_pos_x)

				// function disable() {
				// }

				// setTimeout(disable, 100);

				tab.element.animate(
					{ left: current_pos_x },
				// 	{ complete: function () {
				// 		if (getPosition(index) == 0) {
				// 			return false;
				// 		}

				// 		else {
				// 			_moveToDirection(direction, index);
				// 		}
				// 	}
				// },
					{duration: 1000});
				console.log("Смещение пункта меню")


				// console.log(img_pos);
				// console.log(img_id);

				// if(img_pos != 0) {

				// 	$(img_id).css("z-index", 1);
				// }

				// else if (img_pos == 0 ) {
				// 	$(img_id).css("z-index", 10);
				// }


			}

				$(slider).animate(
					{ left: slider_pos},
					{ duration: 1000 });

				console.log("Смещение блока с экранами")

				// $(new_img).css("left", img_pos);
				// console.log("Смещение последнего экрана в конец списка \nчерез .css(left, img_pos)");

				$(new_img).animate(
					{ left: img_pos},
					{ duration: 1000 },
					{ complete: function() {

						if (main_index == target_index) {
						// return true;
						// console.log("main_index",main_index, "\ntarget_index",target_index)
						}

						else {
							main_index = limit(main_index + 1);
							if(main_index == target_index) {
								// _content = _content_prefix + main_index;
								// console.log(_content);
								// $(_content).addClass(tabs_content_active);
								// console.log("main_index",main_index, "\ntarget_index",target_index)
								// return true;
							}
							else {
								// console.log("main_index",main_index, "\ntarget_index",target_index)
								draw(direction);
								main_index = limit(main_index + 1);
								// _content = _content_prefix + main_index;
								// $(_content).addClass(tabs_content_active);


								if (main_index == target_index) {
								// console.log("main_index",main_index, "\ntarget_index",target_index)
								// _content = _content_prefix + target_index;
								// $(_content).addClass(tabs_content_active);

								}
								else {
									draw(direction);
									main_index = limit(main_index + 1);
								}
							}
						}
					}
				} );
				console.log("Смещение последнего экрана в конец списка /nчерез animation");

		}

		// function test_animation() {
		// 	if (main_index == target_index) {
		// 		// return true;
		// 		// console.log("main_index",main_index, "\ntarget_index",target_index)
		// 	}

		// 	else {
		// 		main_index = limit(main_index + 1);
		// 		if(main_index == target_index) {
		// 			// _content = _content_prefix + main_index;
		// 			// console.log(_content);
		// 			// $(_content).addClass(tabs_content_active);
		// 			// console.log("main_index",main_index, "\ntarget_index",target_index)
		// 			// return true;
		// 		}
		// 		else {
		// 			// console.log("main_index",main_index, "\ntarget_index",target_index)
		// 			draw(direction);
		// 			main_index = limit(main_index + 1);
		// 			// _content = _content_prefix + main_index;
		// 			// $(_content).addClass(tabs_content_active);


		// 			if (main_index == target_index) {
		// 			// console.log("main_index",main_index, "\ntarget_index",target_index)
		// 			// _content = _content_prefix + target_index;
		// 			// $(_content).addClass(tabs_content_active);

		// 			}
		// 			else {
		// 				draw(direction);
		// 				main_index = limit(main_index + 1);
		// 			}
		// 		}
		// 	}
		// }


		// img_target = img + main_index;
		// $(img_target).css("left", "243px");



		_content = _content_prefix + main_index;
		$(_content).addClass(tabs_content_active);

		// target_index = index;
		tabs[target_index].element.addClass("tab-active");

		// _content = _content_prefix + target_index;
		// $(_content).addClass(tabs_content_active);


		function limit(element_index) {

			//
			if (element_index<0) element_index = tabs.length + element_index;

			// для левых
			else if(element_index >= tabs.length) element_index = element_index - tabs.length;

			return element_index;
		}
	}

	var start_x;
	slide();

	function slide() {

		Events('#sec-tab_slider_area', 'down', startSlide);
		var ghosty = $("<div class='ghosty' style='background:rgba(255,0,0,0); width:100%; height: 100%; position:fixed; display:none; top:0; left: 0;'></div>");

		function startSlide(evt) {

			var x = evt.clientX;
			start_x = x;
			console.log(start_x);

			$(document.body).append(ghosty);

			ghosty.css('display','block');
			Events('.ghosty', 'move', moveSlide);
			Events('.ghosty', 'up', stopSlide);
		}

		function moveSlide(evt) {

			var x = evt.clientX;

			if(evt.touches){
				x = evt.touches[0].clientX;
			}

			x -= start_x;

			if ( x <= -img_width ) {
				x = -img_width;
			}
			else if ( x >= img_width ) {
				x = img_width;
			}

			$(".tab_slider").css('left', x+'px');
		}

		function stopSlide(evt) {
			//console.log('up');
			ghosty.css('display', 'none');
			removeEvents('.ghosty', 'move',moveSlide);
			removeEvents('.ghosty', 'up', stopSlide);

			x = parseInt($(".tab_slider").css('left'));
		}
	};

	getSlider();

	function getSlider() {

		var ghost = $("<div class='ghost' style='background:rgba(255,0,0,0); width:100%; height: 100%; position:fixed; display:none; top:0; left: 0;'></div>");
		$(document.body).append(ghost);

		var items = 0;
		var slider = $(".partners_section").width();


		$(".partners_slider .partners_logo").each(function(index){
			// console.log($(this).width());
			items+= $(this).width();
		});

		var offset = items - slider;

		// console.log(slider, items);

		function start(e) {

			var target = e.currentTarget.id;
			var direction;

			if (target == "arrow_left") {
				direction = -1;
				$(".partners_slider").animate(
					{ left:  "-" + offset + "px"},
					{ duration: 500 });
			}


			else if (target == "arrow_right") {
				direction = 1;
				$(".partners_slider").animate(
				{ left:  0 + "px"},
				{ duration: 500 });
			}
		}


		$("#arrow_left").on('mouseover', start);
		$("#arrow_right").on('mouseover', start);


		// touches
		var x;

		Events(".partners_section", 'down', startDrag);

		function startDrag(evt) {

			ghost.css('display','block');

			Events('.ghost', 'move', Drag);
			Events('.ghost', 'up', stopDrag);

			if(evt.touches){
				prev_x = evt.touches[0].clientX;
			}
		}

		function Drag(evt){

			evt.preventDefault();

			x = parseInt($(".partners_slider").css("left"), 10);
			var speed = evt.movementX;

			if(evt.touches){
				var tch = evt.touches[0];
				var cx = tch.clientX;
				speed = cx - prev_x;
				prev_x = cx;
			}
			x += speed;
			$(".partners_slider").css("left", x+"px");
		}

		function stopDrag() {
			removeEvents(".ghost", 'move', Drag);
			removeEvents(".ghost", 'up', stopDrag);

			if (x > 0) {
				$(".partners_slider").animate(
				{ left:  0 + "px"},
				{ duration: 200 });
			}

			else if (x < -offset) {
				$(".partners_slider").animate(
					{ left:  "-" + offset + "px"},
					{ duration: 200 });
			}

			ghost.css('display','none');
		}


	}

	function Events(element, event, func){

		var element = document.querySelector(element);


		switch(event){
		case "down":
			element.addEventListener("mousedown", func);
			element.addEventListener("touchstart", func);
			break;
		case "move":
			element.addEventListener("mousemove", func);
			element.addEventListener("touchmove", func);
			break;
		case "up":
			element.addEventListener("mouseup", func);
			element.addEventListener("touchend", func);
			element.addEventListener("touchcancel", func);
			break;
	}


	};

	function removeEvents(element, event, func){

		var element = document.querySelector(element);

		switch(event){
		case "down":
			element.removeEventListener("mousedown", func);
			element.removeEventListener("touchstart", func);
			break;
		case "move":
			element.removeEventListener("mousemove", func);
			element.removeEventListener("touchmove", func);
			break;
		case "up":
			element.removeEventListener("mouseup", func);
			element.removeEventListener("touchend", func);
			element.removeEventListener("touchcancel", func);
			break;
		};
	};


})();
