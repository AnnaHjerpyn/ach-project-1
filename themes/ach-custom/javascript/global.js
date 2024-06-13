(function ($) {
    $(function () {
        AOS.init();

        var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
        var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
            return new bootstrap.Tooltip(tooltipTriggerEl)
        })

        $('[data-fade-open]').click(function (e) {
            var selector = $(this).data('fade-open');
            if (!selector)
                return;

            var target = $(selector);
            if (!target)
                return;

            target.fadeIn(this);
            target.attr('aria-expanded', 'true');
        });

        $('[data-fade-close]').click(function (e) {
            var selector = $(this).data('fade-close');
            if (!selector)
                return;

            var target = $(selector);
            if (!target)
                return;

            target.fadeOut(this);
            target.attr('aria-expanded', 'false');
        });

        $('[data-equal-height-row]').each(function (i, e) {
            let maxHeight = 0;
            let children = $(this).children();

            if (!children)
                return;

            for(let i = 0; i <= children.length; i++) {
                if (children.eq(i).height() > maxHeight) {
                    maxHeight = children.eq(i).height();
                }
            }

            for(let i = 0; i <= children.length; i++) {
                children.eq(i).height(maxHeight);
            }
        });
    });
})(jQuery);
