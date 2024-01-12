$(document).ready(function () {
  new Cleave('#modalCompanyPhone', {
    phone: true,
    phoneRegionCode: 'TR',
  });
  $('#modalCompanyTaxNumber').inputmask({ mask: '9999999999[9]', jitMasking: true });

  $(document).ready(function () {
    const formAuthentication = document.querySelector('#addNewCompanyForm');
    const fv = FormValidation.formValidation(formAuthentication, {
      fields: {
        modalCompanyName: {
          validators: {
            notEmpty: {
              message: 'Lütfen firma ünvanınızı giriniz',
            },
          },
        },
        modalCompanyTaxNumber: {
          validators: {
            notEmpty: {
              message: 'Lütfen firma Vergi/TC Kimlik numarasını giriniz',
            },
            stringLength: {
              min: 10,
              max: 11,
              message: 'Vergi/TC Kimlik numarası 10 veya 11 haneli olmalıdır',
            },
          },
        },
        modalCompanyAddress: {
          validators: {
            notEmpty: {
              message: 'Lütfen firma adresini giriniz',
            },
          },
        },
        modalCompanyCity: {
          validators: {
            notEmpty: {
              message: 'Lütfen firma ilini giriniz',
            },
          },
        },
        modalCompanyCountry: {
          validators: {
            notEmpty: {
              message: 'Lütfen firma ülkesini giriniz',
            },
          },
        },
      },
      plugins: {
        trigger: new FormValidation.plugins.Trigger(),
        bootstrap5: new FormValidation.plugins.Bootstrap5({
          // Use this for enabling/changing valid/invalid class
          // eleInvalidClass: '',
          eleValidClass: '',
          rowSelector: '.col-12',
        }),
        submitButton: new FormValidation.plugins.SubmitButton(),
        // Submit the form when all fields are valid
        // defaultSubmit: new FormValidation.plugins.DefaultSubmit(),
        autoFocus: new FormValidation.plugins.AutoFocus(),
      },
    }).on('core.form.valid', function () {
      $('#errorAlert').slideUp();
      $('#addNewCompany').block({
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
        name: $('#modalCompanyName').val(),
        tax_number: $('#modalCompanyTaxNumber').val(),
        tax_office: $('#modalCompanyTaxOffice').val(),
        address: $('#modalCompanyAddress').val(),
        city: $('#modalCompanyCity').val(),
        country: $('#modalCompanyCountry').val(),
        email: $('#modalCompanyMail').val(),
        phone: $('#modalCompanyPhone').val(),
      };
      $.ajax({
        url: '/api/companies/create',
        type: 'POST',
        data: JSON.stringify(body),
        headers: {
          'Content-Type': 'application/json',
        },
        success: function (result) {
          $('#addNewCompany').unblock();
          Swal.fire({
            title: 'Başarılı!',
            text: 'Kayıt işleminiz başarıyla tamamlandı',
            icon: 'success',
            showConfirmButton: false,
            timer: 2500,
          }).then(function () {
            window.location.reload();
          });
        },
        error: function (xhr, status, error) {
          $('#addNewCompany').unblock();
          Swal.fire({
            title: 'Hata!',
            text: xhr.responseJSON.message,
            icon: 'error',
          });
        },
      });
    });
  });
});
