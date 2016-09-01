'use strict';

(function () {
  var DOM = {
    tabs: '#tabs',
    tab: '.tab',
    tab_slider: '.tab_slider img'
  }

  var	tabs = [];
  var last_width = 0;

  var offset         = 40;
  var outset         = -370;
  var set            = 1;

  var complete = true;
	var img_target;
	var	new_index;
	var _content;

  // начало отсчёта для изминения позиций табов
	var	main_index = 1;

	var	target_index;
	var sl_width;
	var slide_time = 300;
	var slide_phase = 0;
	var _content_prefix = '#tab_content-';
	var tab_active = '.tab-active';
	var tabs_content_active = 'tabs_content-active';
	var direction;
	var pos_end = 0;
	var pos_start = 0;

	var slider = '#sec-tab_slider';
	var img = '#sec-tab_slide-';
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
				_content = _content_prefix + main_index;
				$(_content).addClass(tabs_content_active);
				set = 0;
				$(this).addClass('tab-active'); }
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

		$(slider).css('left', -img_width);
		var set = 0;

		$(DOM.tab_slider).each(function(index) {

			var $this = $(this);

			imgs.push({
				element:  $this,
				index:    index,
			});

			$this.css('left', set + 'px');
			set = set + img_width;

		});
	}

	/**
	  * @ Получаем из CSS значение позиции таба:
	  *   положительное, отрицательное или равно нулю
	  *
	  */

	function getPosition(index) {
		var str = tabs[index].element.css('left');
		var a   = parseInt(str.replace('px', ''));
		return a;
	}

	/**
	  * @ Определяем направление смещения на основе
	  *   расположения выбранного таба
	  * @ Запускаем функцию смещения табов и скринов
	  *
	  */

	function _move(index) {

    if (complete == false) return false;

		target_index = index;
		var a = getPosition(index);

		if (a > 0) {
			direction = -1; }
			else if (a < 0) {
				direction     = 1; }

        // не круто
				// main_index = index
				else if (a == 0) {
					direction = 0; }

		_moveToDirection(direction, index);

	}

	/**
	  * @ Механика перемещения табов...
	  *
	  */

	function _moveToDirection(direction, index) {


		if (direction == 0) return false;

		var str        = $(slider).css('left');
		var slider_pos = parseInt(str.replace('px', ''));



		draw(direction);

		function draw(direction) {

      console.log('draw start!');
      complete = false;

      if (direction > 0) {
        main_index = limit(main_index - direction);
      }


      $(_content).removeClass(tabs_content_active);
      var img_pos;
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
				tab.element.removeClass('tab-active');

				// определение позиции при итерации
				if (direction < 0) {

          console.log('Отрисовал!');
					if(i==0) {
						slider_pos = slider_pos - img_width;
						current_pos_x = outset - tab.width;
					}

					else if (i == tabs.length-2) {
						var str        = $(img_id).css('left');
						var pos_end    = parseInt(str.replace('px', ''));

						current_pos_x = next_pos_x;
						next_pos_x = current_pos_x + tab.width + offset;
					}

					else if (i == tabs.length-1) {

						current_pos_x = next_pos_x;
						next_pos_x = current_pos_x + tab.width + offset;
						img_pos = pos_end + img_width;
						new_img = img_id;

					}

					else {// inbetweens
						current_pos_x = next_pos_x;
						next_pos_x = current_pos_x + tab.width + offset;
					}


				}

				else if (direction > 0) {

          console.log('Отрисовал!');
          console.log('element_index:', element_index);

					if (i == tabs.length - 1) {
						slider_pos = slider_pos + img_width;
						current_pos_x = outset - tab.width;

						var str       = $(img_id).css('left');
						var pos_start = parseInt(str.replace('px', ''));
						img_pos = pos_start - img_width * tabs.length;
					}

          // нет первого элемента
					else {
						current_pos_x = next_pos_x;
						next_pos_x = current_pos_x + tab.width + offset;
					}

				}

        console.log('current_pos_x:', current_pos_x)
				tab.element.animate(
					{ left: current_pos_x },
					{ duration: 200 });
			}

      if (direction < 0) {
        main_index = limit(main_index - direction);
      }

				$(slider).animate(
					{ left: slider_pos},
					{ duration: 200 ,
            complete: function() {

              switch (main_index) {
                case target_index:
                  complete = true;
                  console.log(main_index, target_index);
                  break;

                default:
                  console.log('main_index:', main_index, '\ntarget_index:', target_index, '\nDRAWING AGAIN!!111')
                  draw(direction);
              }
            }
          });

				$(new_img).css( "left", img_pos );

        console.log('target_index:' ,target_index);
        _content = _content_prefix + main_index;
        $(_content).addClass(tabs_content_active);
        tabs[target_index].element.addClass('tab-active');
		}

  	function limit(element_index) {
    	if (element_index<0) element_index = tabs.length + element_index;
      else if(element_index >= tabs.length) element_index = element_index - tabs.length;
      return element_index;
  	}
	}

	var start_x;
	slide();

	function slide() {

		Events('#sec-tab_slider_area', 'down', startSlide);
		var ghosty = $('<div class="ghosty" style="background:rgba(255,0,0,0); width:100%; height: 100%; position:fixed; display:none; top:0; left: 0;"></div>');

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

			$('.tab_slider').css('left', x+'px');
		}

		function stopSlide(evt) {
			//console.log('up');
			ghosty.css('display', 'none');
			removeEvents('.ghosty', 'move',moveSlide);
			removeEvents('.ghosty', 'up', stopSlide);

			x = parseInt($('.tab_slider').css('left'));
		}
	};

	getSlider();

	function getSlider() {

		var ghost = $('<div class="ghost" style="background:rgba(255,0,0,0); width:100%; height: 100%; position:fixed; display:none; top:0; left: 0;"></div>');
		$(document.body).append(ghost);

		var items = 0;
		var slider = $('.partners_section').width();


		$('.partners_slider .partners_logo').each(function(index){
			// console.log($(this).width());
			items+= $(this).width();
		});

		var offset = items - slider;

		// console.log(slider, items);

		function start(e) {

			var target = e.currentTarget.id;
			var direction;

			if (target == 'arrow_left') {
				direction = -1;
				$('.partners_slider').animate(
					{ left:  '-' + offset + 'px'},
					{ duration: 500 });
			}


			else if (target == 'arrow_right') {
				direction = 1;
				$('.partners_slider').animate(
				{ left:  0 + 'px'},
				{ duration: 500 });
			}
		}


		$('#arrow_left').on('mouseover', start);
		$('#arrow_right').on('mouseover', start);


		// touches
		var x;

		Events('.partners_section', 'down', startDrag);

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

			x = parseInt($('.partners_slider').css('left'), 10);
			var speed = evt.movementX;

			if(evt.touches){
				var tch = evt.touches[0];
				var cx = tch.clientX;
				speed = cx - prev_x;
				prev_x = cx;
			}
			x += speed;
			$('.partners_slider').css('left', x+'px');
		}

		function stopDrag() {
			removeEvents('.ghost', 'move', Drag);
			removeEvents('.ghost', 'up', stopDrag);

			if (x > 0) {
				$('.partners_slider').animate(
				{ left:  0 + 'px'},
				{ duration: 200 });
			}

			else if (x < -offset) {
				$('.partners_slider').animate(
					{ left:  '-' + offset + 'px'},
					{ duration: 200 });
			}

			ghost.css('display','none');
		}


	}

	function Events(element, event, func){

		var element = document.querySelector(element);


		switch(event){
		case 'down':
			element.addEventListener('mousedown', func);
			element.addEventListener('touchstart', func);
			break;
		case 'move':
			element.addEventListener('mousemove', func);
			element.addEventListener('touchmove', func);
			break;
		case 'up':
			element.addEventListener('mouseup', func);
			element.addEventListener('touchend', func);
			element.addEventListener('touchcancel', func);
			break;
	}


	};

	function removeEvents(element, event, func){

		var element = document.querySelector(element);

		switch(event){
		case 'down':
			element.removeEventListener('mousedown', func);
			element.removeEventListener('touchstart', func);
			break;
		case 'move':
			element.removeEventListener('mousemove', func);
			element.removeEventListener('touchmove', func);
			break;
		case 'up':
			element.removeEventListener('mouseup', func);
			element.removeEventListener('touchend', func);
			element.removeEventListener('touchcancel', func);
			break;
		};
	};


})();
