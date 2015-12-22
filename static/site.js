(function() {
    var quoteIndex = 0,
        location = null;

    function getEmail(location) {
        var prefix = 'carlwin+',
            suffix = '3aair@gmail.com';
        if (location === 'GA') {
            prefix = 'dalenorris';
        }
        return prefix + suffix;
    }

    function updateLocation(result) {
        var phone = '251-626-5588',
            state = result.region_code,
            phoneHtml,
            msg = $('#phone-alert').html();

        if (/AL|GA|FL|MS/.test(state)) {
            if (state === 'GA') {
                phone = '706-845-0070';
                location = 'GA';
            }
            else {
                location = 'AL';
            }
            phoneHtml = '<a href="tel:+1' + phone.replace(/\-/g, '') + '">' +
                phone + '</a>';
            msg = msg.replace(/\\1/g, result.city + ', ' + state)
                .replace(/\\2/g, phoneHtml);

            $('#phone-alert').html(msg);
            $('#phone-alert').css({
                'visibility': 'visible',
                'opacity': 0
            });
            $('#phone-alert').animate({'opacity': 1}, 500);
        }
        else {
            geoipFallback();
        }
    };

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

    function geoipFallback() {
        var fallbackHtml;
        if ($('#phone-alert').css('visibility') === 'hidden') {
            fallbackHtml = $('#phone-alert-fail').html();
            $('#phone-alert').html(fallbackHtml);
            $('#phone-alert').css({
                'visibility': 'visible',
                'opacity': 0
            });
            $('#phone-alert').animate({'opacity': 1}, 500);

            // Add the location dropdown to the contact form
            $('#location-container').removeClass('hide');
        }
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
            email = getEmail(location || $('#location-dropdown').val());

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
        $.ajax({
            url: '//freegeoip.net/json/',
            type: 'POST',
            dataType: 'jsonp',
            success: function(result) {
                updateLocation(result);
            },
            error: function() {
                geoipFallback();
            }
        });
        setInterval(rotateQuote, 10000);
    };

    // In case of adblock (error callback never called),
    // we need to manually invoke the fallback method.
    setTimeout(geoipFallback, 3000);
}());
