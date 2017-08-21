(function($) {

// Configure Sammy
  var app = $.sammy('#app', function() {
    this.use('Template');


    this.before('#/', function() {
      $('#collapseNav').attr('class', 'collapse  fadeOutRight  animated');
      $('.nav-toggle').attr('class', 'collapsed');
      $('body').attr('class', 'home');
    });

    this.before('#/approach/', function() {
      $('#collapseNav').attr('class', 'collapse  fadeOutRight  animated');
      $('.nav-toggle').attr('class', 'collapsed');
      $('body').attr('class', 'approach');
    });

    this.before('#/project/tft/', function() {
      $('#collapseNav').attr('class', 'collapse  fadeOutRight  animated');
      $('.nav-toggle').attr('class', 'collapsed');
      $('body').attr('class', 'project-tft');
    });

     this.before('.*', function() {
         var hash = document.location.hash;
         $("nav").find("a").removeClass("current");
         $("nav").find("a[href='"+hash+"']").addClass("current");
    });

    this.get('#/', function(context) {
      	context.app.swap('');
        context.render('templates/home.template', {})
               .appendTo(context.$element());
    });


    this.get('#/project/tft/', function(context) {
        var str=location.href.toLowerCase();
        context.app.swap('');
        context.render('templates/projects/tft.template', {})
               .appendTo(context.$element());
    });
    
    this.get('#/approach/', function(context) {
        var str=location.href.toLowerCase();
        context.app.swap('');
        context.render('templates/approach.template', {})
               .appendTo(context.$element());
    });


  });

  $(function() {
    app.run('#/');
  });

// Configure Interactions

$(function() {
  $(window).scroll(function () {
    if ($(this).scrollTop() > 50) {
      $('.navbar').addClass('scrolled')
    }
    if ($(this).scrollTop() < 50) {
      $('.navbar').removeClass('scrolled')
    }
  });


  $('.collapse').on('show.bs.collapse', function (e) {
  	$('#collapseNav').attr('class', 'collapse show  fadeInRight  animated');
  })
  $('.collapse').on('hide.bs.collapse', function (e) {
  	$('#collapseNav').attr('class', 'collapse  fadeOutRight  animated');
  })


  $(function () {
    $('[data-toggle="popover"]').popover()
  })

});


// Configure Waypoints.js

var inview = new Waypoint.Inview({
  element: $('.lazy'),
  enter: function(direction) {
    $(this).attr('class', 'fadeInRight  animated');
  },
  exit: function(direction) {
   $(this).attr('class', 'fadeOutRight  animated');
  }
})


})(jQuery);