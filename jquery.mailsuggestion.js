/*!
 * jQuery Mail Suggestion Plugin v0.1
 * Authors: Gokhan Songul <gkhn.songul@gmail.com>
 *
 * Date: 2013-5-23
 */

(function($) {

    'use strict';

    /**
     * @constructor
     */
    $.fn.suggestMail = function(domains) {

        /**
         *
         * @type {jQueryObject}
         */
        var $el = $(this);


        var $selectedItem = null;

        var text = null;

        /**
         * it suggests a mail list related email field text.
         * @param {jQueryObject} $el
         */
        var suggest = function($el){
            text = $el.val();
            if(text.length > 2 && text.indexOf('@') > 0){
                var prefix = text.split('@')[0];
                var suffix = text.split('@')[1];
                if(suffix != ''){
                    var markup = '';
                    var arr = [];
                    $.grep(domains, function(n, i){
                        if(n.indexOf(suffix) == 0) {
                            n = prefix + '@' + n;
                            markup += renderItem(n);
                            return arr.push(n);
                        }
                    });
                    var $container = createContainer(markup);
                    checkCurrentMailIsExist();
                    if(markup){
                        $container.show();
                    }
                    else {
                        $container.html('').hide();
                    }
                }
                else {
                    $selectedItem = null;
                    $('.ui-suggest-container').html('').hide();
                }
            }
        };


        /**
         * it renders suggested email item element.
         * @param {String=} text is suggested email item.
         * @return {String}
         */
        var renderItem = function(text){
            return '<div class="ui-suggest-item">' + text + '</div>';
        };


        /**
         * it creates a container for suggested mail item elements.
         * @param {String=} innerHTML is markup for container.
         * @return {jQueryObject} container for suggested mail item elements.
         */
        var createContainer = function(innerHTML){
            var $container = $('.ui-suggest-container').length ? $('.ui-suggest-container') : $('<div>').addClass('ui-suggest-container');
            $container.html(innerHTML);
            appendContainer($container);
            return $container;
        };


        /**
         * it calculates container offsets and appends to body.
         * @param {jQueryObject} $container
         */
        var appendContainer = function($container){
            var offset = $el.offset();
            var width = $el.outerWidth() - 2;
            var left =  offset['left'];
            var top =  offset['top'] + $el.outerHeight();
            $container.css({'width': width,'top': top,'left': left}).appendTo('body');
        };


        /**
         * email field element key events bindings.
         */
        $el.keydown(function(e){
            var btn = e.which;
            if(btn == 9 || btn == 38 || btn == 39 || btn == 40 || btn == 13){
                findSelection(btn);
            }
            else {
                setTimeout(function(){
                    suggest($el, btn);
                }, 100)
            }
        });


        /**
         * suggested items mouseenter and mouseleave events bindings.
         */
        $('.ui-suggest-item').live({
            'mouseenter': function(){
                $(this).addClass('state-hover');
            },
            'mouseleave': function(){
                $(this).removeClass('state-hover');
            }
        });


        /**
         * suggested items click events bindings.
         */
        $('.ui-suggest-item').live('click', function(){
            $selectedItem = $(this);
            setMail(true);
        });


        /**
         * it sets email field value. if hideFlag is true suggested container elements will be hidden.
         * @param {boolean=} hideFlag
         * @param {String=} value
         */
        var setMail = function(hideFlag, value){
            value = value || $selectedItem.text();
            $el.val(value);
            if(hideFlag){
                $('.ui-suggest-container').hide();
            }
        };


        /**
         * it checks currentmail address is exist in suggested container child elements.
         * @return {Boolean}
         */
        var checkCurrentMailIsExist = function(){
            if($selectedItem){
                var $container =  $('.ui-suggest-container');
                var $items = $container.find('div');
                var currentMail = $selectedItem.text();
                var isExistFlag = false;

                $items.each(function(){
                    if(currentMail == $(this).text()){
                        isExistFlag = true;
                        $selectedItem = $(this);
                        $selectedItem.addClass('state-hover');
                    }
                });
                return isExistFlag;
            }
        };


        /**
         * it finds selected item and change selected item by key events.
         * @param {Number} btn for keyCode
         */
        var findSelection = function(btn){
            var currentMailIsExist = checkCurrentMailIsExist();
            var $container =  $('.ui-suggest-container');
            var $suggestedItems = $('.ui-suggest-item');
            if(currentMailIsExist){
                if($container.is(':hidden')){
                    $container.show();
                    $selectedItem.addClass('state-hover');
                }
            }
            else {
                $selectedItem = null;
            }
            if($selectedItem){
                $selectedItem.removeClass('state-hover');
                if(btn == 38){
                    var $prevItem = $selectedItem.prev().length ? $selectedItem.prev() : null;
                    if($prevItem){
                        $selectedItem = $prevItem;
                    }
                    else {
                        $selectedItem = null;
                        setMail(false, text);
                        return;
                    }
                }
                else if(btn == 39 || btn == 9) {
                    setMail(true);
                }
                else if (btn == 40){
                    $selectedItem = $selectedItem.next().length ? $selectedItem.next() : $selectedItem;
                    setMail();
                }
                else if($selectedItem){
                    setMail(true);
                }
            }
            else if($suggestedItems.length){
                if (btn == 38){
                    $suggestedItems.last();
                }
                else if(btn == 40){
                    $selectedItem = $suggestedItems.first();
                }
                else if (btn == 9) {
                    $('.ui-suggest-container').hide();
                }
            }
            if($selectedItem){
                $selectedItem.addClass('state-hover');
            }
        };
    };

})(jQuery);