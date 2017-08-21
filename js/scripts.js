$(function() {
	$(window).scroll(function () {
		if ($(this).scrollTop() > 50) {
			$('.navbar').addClass('scrolled')
		}
		if ($(this).scrollTop() < 50) {
			$('.navbar').removeClass('scrolled')
		}
	});
});

