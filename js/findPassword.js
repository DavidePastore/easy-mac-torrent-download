const FIRST_STEP_REGEX = /const urlstrings = atob\('(.*)'\)/;
const SECOND_STEP_REGEX = /,'value','(.*)'\];/;
const LOADING_SPINNER = '<span class="spinner-border spinner-border-sm"></span> Loading...';

$(function() {

    new ClipboardJS('#copy-button');
    let $password = $("#password");

    function showErrorAlert() {
        $("#error-alert").show();
    }

    function loadPasswordError() {
        console.log('Error retrieving the password');
        showErrorAlert();
        hideLoaderForSearchButton();
    }

    function loadPassword(passwordUrl) {
        console.log('URL from which retrieving the password:', passwordUrl);

        $.get( CORS_PROXY + passwordUrl, function(data) {
            // Find the first password URL
            let matches = FIRST_STEP_REGEX.exec(data);
            if (!matches || matches.length < 2) {
                console.log('Cannot match the first RegEx', matches);
                return loadPasswordError();
            }
            let newUrl = atob(matches[1]);
            console.log('First found URL', newUrl);

            // Access to the new URL
            $.get( CORS_PROXY + newUrl, function(data) {
                // Find the password here
                let matches = SECOND_STEP_REGEX.exec(data);

                if (!matches || matches.length < 2) {
                    console.log('Cannot match the second RegEx', matches);
                    return loadPasswordError();
                }

                let $passwd = atob(matches[1]);

                let clazz = 'is-invalid';
                if ($passwd.length > 0) {
                    let password = $passwd;

                    if (password) {
                        clazz = 'is-valid';
                        console.log('The password is: ' + password);
                        $password.val(password);
                    } else {
                        showErrorAlert();
                    }
                } else {
                    showErrorAlert();
                }

                $password.addClass(clazz);
                hideLoaderForSearchButton();
            });
        }).fail(function(error) {
            console.log(error);
            loadPasswordError();
        });
    }

    // Form submit handler
    $("#findPasswordForm").submit(function( event ) {
        event.preventDefault();
        console.log( "Handler for .submit() called." );
        $("#error-alert").hide();
        $("#password")
            .removeClass('is-valid is-invalid')
            .val('');
        showLoaderForSearchButton();

        let passwordUrl = $("#passwordUrl").val();
        loadPassword(passwordUrl);
    });
});