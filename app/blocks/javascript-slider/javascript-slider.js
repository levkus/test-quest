import $ from 'jquery';

export default function jsSlider($container, $pointer, $ghost, $selectors, $pointerValue) {
	let sliderWidth = $container.width();
	let offsetLeft = $container.offset().left;
	let offsetRight = offsetLeft + sliderWidth;
	let percent = sliderWidth / 100;
	let selectedPercent;

	// Вычисляем текущий процент и записываем его в selectedPercent
	function getPercent() {
		selectedPercent = Math.max(0, Math.min(($pointer.offset().left - offsetLeft + $pointer.width() / 2) / percent, 100)).toFixed(1);
		console.log('JS Skill: ' + selectedPercent + '%');
		$pointerValue.html(selectedPercent + '%');
		return selectedPercent;
	}

	// Ставим pointer в начальное положение через атрибут data-percent
	function init() {
		const value = Math.max(0, Math.min($pointer.attr('data-percent'), 100));
		$pointer.animate({left: value * percent}, 0, getPercent);
	}

	// Обновляем переменные при изменении размера окна и ставим pointer
	// в нужное положение в соответствии с обновлениями
	$(window).resize( () => {
		sliderWidth = $container.width();
		offsetLeft = $container.offset().left;
		offsetRight = offsetLeft + sliderWidth;
		percent = sliderWidth / 100;
		$pointer.css({left: (percent * selectedPercent)});
	});

	// Обрабатываем события мыши
	function handleMouse() {
		$container.on('mouseenter mouseleave mousemove click', e => {
			const x = Math.min(Math.max(e.pageX, offsetLeft), offsetRight);
			const pointerLeft = x - offsetLeft;
			switch (e.type) {
				case 'mouseenter':
					$ghost.css('opacity', 0.5);
					$pointerValue.css('opacity', 0.8);
					break;
				case 'mouseleave':
					$ghost.css('opacity', 0);
					$pointerValue.css('opacity', 0);
					break;
				case 'mousemove':
					$ghost.css({left: pointerLeft});
					break;
				case 'click':
					$pointer.animate({left: pointerLeft}, 150, getPercent);
					break;
			}
		});
	}

	// Обарабатываем нажатие на селекторы через атрибут data-percent
	function handleSelectors() {
		$selectors.on('click', function () {
			const value = Math.max(0, Math.min($(this).attr('data-percent'), 100));
			$pointer.animate({left: value * percent}, 150, getPercent);
		});
	}

	// Выносим getPercent наружу, вызывать через jsSlider.getPercent();
	jsSlider.getPercent = getPercent;

	init();
	handleMouse();
	handleSelectors();
}
