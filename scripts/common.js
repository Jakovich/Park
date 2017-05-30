$(document).ready(function() {

    $('[data-tabcontent=reservation]').hide();
    $('[data-tablink]').click(function(evt) {
        if ($(this).hasClass('tab-nav__link')) {
          evt.preventDefault();
          $(this).closest('[data-tabgroup]').find('[data-tablink]').removeClass('tab-nav__link--active');
          $(this).addClass('tab-nav__link--active');
        }
        $(this).closest('[data-tabgroup]').find('[data-tabcontent]').hide();
        $('[data-tabcontent="' + this.dataset.tablink + '"]').show();
    })


    $('input[data-tablink]').each(function(){
      if (!$(this).prop( "checked" )) {
        $('[data-tabcontent="' + this.dataset.tablink + '"]').hide();
      }
    })

    //проверка на наличие данных после загрузки

    $('.form__input').each(function(){
      checkComplet($(this));
    })


    $('.form__input').focus(function(){
      $(this).addClass('form__input--completed');
    })


    $('.form__input').blur(function(){
      var self = $(this);
      setTimeout(function(){
        checkComplet(self);
      },100)

    })

    function checkComplet(elem) {
        if(elem.val() !== '') {
          elem.addClass('form__input--completed');
        } else {
          elem.removeClass('form__input--completed');
        }
      }



    //show/hide popup-visitor//show/hide popup
    function getScrollbarWidth() {
        var block = $('<div>').css({
                'height': '50px',
                'width': '50px'
            }),
            indicator = $('<div>').css({
                'height': '200px'
            });

        $('body').append(block.append(indicator));
        var w1 = $('div', block).innerWidth();
        block.css('overflow-y', 'scroll');
        var w2 = $('div', block).innerWidth();
        $(block).remove();
        return (w1 - w2);
    }

    var scrollWidth = getScrollbarWidth() + 'px';

    function showPopup() {
        $('.popup-visitor__wrp').fadeIn();

        $('body').css({
            'overflow': 'hidden',
            'padding-right': scrollWidth
        });
    }

    $('.popup-visitor').on('click', function(evt) {
        evt.stopPropagation();
    });



    function hidePopup() {

        $('.popup-visitor__wrp').fadeOut(function(){
          $('body').css({
              'overflow': 'auto',
              'padding-right': 0
          });
        });
    }

    $('[data-modal=visitor]').on('click', function(evt) {
        evt.preventDefault();
        evt.stopPropagation();
        showPopup();
    });

    $('.table--visitor tbody tr').on('click', function(evt) {
        evt.stopPropagation();
        showPopup();
    });

    $('[data-action=close]').on('click', function(evt) {
        evt.preventDefault();
        hidePopup();
    });

    $('.popup-visitor__wrp').on('click', function() {
        hidePopup();
    });

})
