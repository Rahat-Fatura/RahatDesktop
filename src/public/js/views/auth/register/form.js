$(document).ready(function () {
  const formAuthentication = document.querySelector('#registerForm');
  const fv = FormValidation.formValidation(formAuthentication, {
    fields: {
      name: {
        validators: {
          notEmpty: {
            message: 'Lütfen adınızı giriniz',
          },
        },
      },
      phone: {
        validators: {
          notEmpty: {
            message: 'Lütfen telefon numaranızı giriniz',
          },
        },
      },
      taxnumber: {
        validators: {
          notEmpty: {
            message: 'Lütfen Vergi/TC Kimlik numaranızı giriniz',
          },
          stringLength: {
            min: 10,
            max: 11,
            message: 'Vergi/TC Kimlik numaranız 10 veya 11 haneli olmalıdır',
          },
        },
      },
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
      'terms-conditions': {
        validators: {
          notEmpty: {
            message: 'Lütfen kullanım koşullarını kabul ediniz',
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
    $('#registerCard').block({
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
      name: $('#name').val(),
      phone: $('#phone').val(),
      tax_number: $('#taxnumber').val(),
      email: $('#email').val(),
      password: $('#password').val(),
      confirm_password: $('#confirm-password').val(),
    };
    $.ajax({
      url: '/api/auth/register',
      type: 'POST',
      data: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
      },
      success: function (result) {
        $('#registerCard').unblock();
        Swal.fire({
          title: 'Başarılı!',
          text: 'Kayıt işleminiz başarıyla tamamlandı',
          icon: 'success',
          showConfirmButton: false,
          timer: 2500,
        }).then((result) => {
          window.location.href = '/';
        });
      },
      error: function (xhr, status, error) {
        $('#registerCard').unblock();
        $('#errorDetail').text(xhr.responseJSON.message);
        $('#errorAlert').slideDown();
      },
    });
  });

  const randomNumber = function (min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  };
});
