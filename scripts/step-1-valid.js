$(document).ready(function() {




    function showDetail(elem) {
      var selected = elem.find('option:selected').attr('data-valid');
      var boatCount = elem.closest('.form__row').find('[data-valid="boat-count"]').closest('.form__input-wrp');
      if (selected === 'boat') {
        boatCount.show();
      } else {
        boatCount.hide();

      }

    }


    function checkComplet(elem) {
        if (elem.val() !== '') {
            elem.addClass('form__input--completed');
        } else {
            elem.removeClass('form__input--completed');
        }
    }



    function checkDuration() {
            var val1 = $('[data-valid=date]:first').val();
            var val2 = $('[data-valid=date]:last').val();

            if (val1 && val2) {
                var match1 = /(\d+)\.(\d+)\.(\d+)/.exec(val1);
                var match2 = /(\d+)\.(\d+)\.(\d+)/.exec(val2);
                var date1 = new Date(match1[3], match1[2] - 1, match1[1]);
                var date2 = new Date(match2[3], match2[2] - 1, match2[1]);
                var interval = date2.getTime() - date1.getTime();
                var duration = Math.ceil(interval / (1000 * 3600 * 24));
                if (duration > 30) {
                    $('[data-valid=date-note]').fadeIn();
                } else {
                    $('[data-valid=date-note]').fadeOut();
                }
            } else {
                $('[data-valid=date-note]').fadeOut();
            }
    }

    $('[data-valid=type-transport]').each(function(){
      showDetail($(this));
      $(this).change(function(){
        console.log('yes');
        showDetail($(this));
      })
    })

    if ($('[data-valid=date]').length) {

        jQuery(function($) {
            $.datepicker.regional['ru'] = {
                closeText: 'Закрыть',
                prevText: '&#x3c;',
                nextText: '&#x3e;',
                currentText: 'Сегодня',
                monthNames: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
                    'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
                ],
                monthNamesShort: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
                    'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
                ],
                dayNames: ['воскресенье', 'понедельник', 'вторник', 'среда', 'четверг', 'пятница', 'суббота'],
                dayNamesShort: ['вск', 'пнд', 'втр', 'срд', 'чтв', 'птн', 'сбт'],
                dayNamesMin: ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
                weekHeader: 'Нед',
                dateFormat: 'dd.mm.yy',
                firstDay: 1,
                isRTL: false,
                showMonthAfterYear: false,
                yearSuffix: ''
            };
            $.datepicker.setDefaults($.datepicker.regional['ru']);
        });

        $('[data-valid=date]').datepicker({
            onSelect: function(date) {
                var self = $(this);

                setTimeout(function() {
                    checkComplet(self);
                    checkDuration();
                }, 100)
            }
        });
        //show/hide date note
    }

    $('[data-valid=date]').change(function(){
      var self = $(this);
      setTimeout(function() {
          checkDuration();
      }, 100)

    });
    //запрет отправки если не выбран маршрут
    $('.common-btn__submit').click(function(evt) {
        var checkedMarshr = 0;
        $('.checkbox__input').each(function() {
            if ($(this).prop('checked')) {
                checkedMarshr++;
            }
        })
        if (checkedMarshr === 0) {
            evt.preventDefault();
            var self = $(this);
            self.addClass('common-btn__submit--error');
            self.closest('.common-btn__wrapper').find('.note--submit').show(100);
            setTimeout(function() {
                self.removeClass('common-btn__submit--error');
                self.closest('.common-btn__wrapper').find('.note--submit').hide(100);
            }, 3000)
        }
    })
})
