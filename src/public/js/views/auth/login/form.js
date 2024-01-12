$(document).ready(function () {
  const formAuthentication = document.querySelector('#loginForm');
  const fv = FormValidation.formValidation(formAuthentication, {
    fields: {
      email: {
        validators: {
          notEmpty: {
            message: 'Lütfen e-posta adresinizi giriniz',
          },
          emailAddress: {
            message: 'Lütfen geçerli bir e-posta adresi giriniz',
          },
        },
      },
      password: {
        validators: {
          notEmpty: {
            message: 'Lütfen şifrenizi giriniz',
          },
        },
      },
    },
    plugins: {
      trigger: new FormValidation.plugins.Trigger(),
      bootstrap5: new FormValidation.plugins.Bootstrap5({
        eleValidClass: '',
        rowSelector: '.mb-3',
      }),
      submitButton: new FormValidation.plugins.SubmitButton(),
      autoFocus: new FormValidation.plugins.AutoFocus(),
    },
    init: (instance) => {
      instance.on('plugins.message.placed', function (e) {
        if (e.element.parentElement.classList.contains('input-group')) {
          e.element.parentElement.insertAdjacentElement('afterend', e.messageElement);
        }
      });
    },
  }).on('core.form.valid', function () {
    $('#errorAlert').slideUp();
    $('#loginCard').block({
      message: `<div class="sk-wave sk-primary mx-auto">
          <div class="sk-rect sk-wave-rect">
          </div> <div class="sk-rect sk-wave-rect">
          </div> <div class="sk-rect sk-wave-rect">
          </div> <div class="sk-rect sk-wave-rect"></div>
          <div class="sk-rect sk-wave-rect"></div>
        </div>`,
      css: {
        backgroundColor: 'transparent',
        border: '0',
      },
      overlayCSS: {
        backgroundColor: '#fff',
        opacity: 0.8,
      },
    });
    const body = {
      email: $('#email').val(),
      password: $('#password').val(),
    };
    $.ajax({
      url: '/api/auth/login',
      type: 'POST',
      data: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
      },
      success: function (result) {
        window.location.href = '/';
      },
      error: function (xhr, status, error) {
        $('#loginCard').unblock();
        $('#errorDetail').text(xhr.responseJSON.message);
        $('#errorAlert').slideDown();
      },
    });
  });
});
