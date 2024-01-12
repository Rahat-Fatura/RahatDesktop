$(document).ready(function () {
  const formAuthentication = document.querySelector('#resetPasswordForm');
  const fv = FormValidation.formValidation(formAuthentication, {
    fields: {
      password: {
        validators: {
          notEmpty: {
            message: 'Lütfen şifrenizi giriniz',
          },
        },
      },
      'confirm-password': {
        validators: {
          notEmpty: {
            message: 'Lütfen şifrenizi tekrar giriniz',
          },
          identical: {
            compare: function () {
              return formAuthentication.querySelector('[name="password"]').value;
            },
            message: 'Şifreleriniz eşleşmiyor',
          },
          stringLength: {
            min: 8,
            message: 'Şifreniz en az 8 karakterden oluşmalıdır',
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
      passwordStrength: new FormValidation.plugins.PasswordStrength({
        field: 'password',
        minimalScore: 3,
        onValidated: function (valid, message, score) {
          switch (score) {
            case 0:
              $('#password-bar')
                .removeClass('bg-success')
                .addClass('bg-danger')
                .width(`${randomNumber(0, 25)}%`);
              break;
            case 1:
              $('#password-bar').removeClass('bg-success').addClass('bg-danger').width(`25%`);
              break;
            case 2:
              $('#password-bar').removeClass('bg-success').addClass('bg-danger').width(`50%`);
              break;
            case 3:
              $('#password-bar').removeClass('bg-danger').addClass('bg-success').width(`75%`);
              break;
            case 4:
              $('#password-bar').removeClass('bg-danger').addClass('bg-success').width(`100%`);
              break;
            default:
              break;
          }
        },
      }),
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
    $('#resetPasswordCard').block({
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
      password: $('#password').val(),
      confirm_password: $('#confirm-password').val(),
    };
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    $.ajax({
      url: `/api/auth/reset-password?token=${token}`,
      type: 'POST',
      data: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
      },
      success: function (result) {
        console.log(result);
        $('#resetPasswordCard').unblock();
        Swal.fire({
          icon: 'success',
          title: 'Başarılı',
          text: 'Şifreniz başarıyla değiştirildi',
          showConfirmButton: false,
          timer: 2500,
        }).then((result) => {
          window.location.href = '/auth/login';
        });
      },
      error: function (xhr, status, error) {
        $('#resetPasswordCard').unblock();
        $('#errorDetail').text(xhr.responseJSON.message);
        $('#errorAlert').slideDown();
      },
    });
  });

  const randomNumber = function (min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  };
});
