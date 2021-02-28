(function() {
    var quoteIndex = 0;

    function getEmail() {
        var prefix = 'carlwin+',
            suffix = '3aair@gmail.com';
        return prefix + suffix;
    }

    function rotateQuote() {
        var el = $('.quote'),
            len = el.length;
        $(el[quoteIndex])
            .css({position: 'absolute'})
            .fadeOut(400);
        quoteIndex = (quoteIndex + 1) % len;
        $(el[quoteIndex])
            .css({position: 'initial'})
            .fadeIn(400);
        $('#testimonials').readmore({
            speed: 100,
            moreLink: '<a href="#">Read More</a>',
            lessLink: '<a href="#">Read Less</a>',
            collapsedHeight: 80
        });
    }

    function showContactAlert(context) {
        var el = $('#contact-alert-tmpl').clone(),
            html = el.html().replace('\\1', context.msg);
        if (context.error) {
            el.addClass('alert-danger');
        }
        else {
            el.addClass('alert-success');
        }
        el.removeClass('hide');
        el.html(html);
        el.show();
        $('#contact-alert-container').append(el);
    }

    function validateContactForm(form) {
        var name = $('#contact-name').val(),
            phone = $('#contact-phone').val(),
            email = $('#contact-email').val(),
            message = $('#contact-message').val();

        if (!name || !phone || !email || !message) {
            showContactAlert({
                msg: 'Please fill out all of the form fields below.',
                error: true,
            });
            return false;
        }

        if (!/^[0-9()-]+$/.test(phone)) {
            showContactAlert({
                msg: 'Please enter a valid phone number.',
                error: true,
            });
            return false;
        }

        if (!/^[^@]+@[^@]+\.[^@]+$/.test(email)) {
            showContactAlert({
                msg: 'Please enter a valid email address.',
                error: true,
            });
            return false;
        }

        return true;
    }

    $('#contact-send').click(function() {
        var urlBase = '//formspree.io/',
            contactForm = $('#contact-form'),
            email = getEmail();

        if (!validateContactForm(contactForm)) {
            return;
        }

        $.ajax({
            url: urlBase + email,
            method: 'POST',
            dataType: 'json',
            processData: true,
            data: contactForm.serializeArray(),
            success: function(result) {
                showContactAlert({
                    msg: 'Your message has been sent. ' +
                        'We will contact you soon.',
                    error: false
                });
            },
            error: function() {
                showContactAlert({
                    msg: 'An unexpected error has occurred. ' +
                        'Please call or try again in a few minutes.',
                    error: true
                });
            }
        });
    });

    window.onload = function() {
        setInterval(rotateQuote, 10000);
    };
}());
