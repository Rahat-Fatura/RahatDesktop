$(document).ready(function () {
  const formAuthentication = document.querySelector('#forgotPasswordForm');
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
    $('#forgotPasswordCard').block({
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
    };
    $.ajax({
      url: '/api/auth/forgot-password',
      type: 'POST',
      data: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
      },
      success: function (result) {
        $('#forgotPasswordCard').unblock();
        Swal.fire({
          icon: 'success',
          title: 'Başarılı!',
          text: 'Şifre sıfırlama bağlantısı e-posta adresinize gönderildi',
          showConfirmButton: false,
          timer: 3000,
        }).then((result) => {
          window.location.href = '/auth/login';
        });
      },
      error: function (xhr, status, error) {
        $('#forgotPasswordCard').unblock();
        $('#errorDetail').text(xhr.responseJSON.message);
        $('#errorAlert').slideDown();
      },
    });
  });
});
