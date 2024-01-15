$(document).ready(function () {
  const wizardModern = document.querySelector('.wizard-modern-example'),
    wizardModernBtnNextList = [].slice.call(wizardModern.querySelectorAll('.btn-next')),
    wizardModernBtnPrevList = [].slice.call(wizardModern.querySelectorAll('.btn-prev')),
    wizardModernBtnSubmit = wizardModern.querySelector('.btn-submit');
  if (typeof wizardModern !== undefined && wizardModern !== null) {
    const modernStepper = new Stepper(wizardModern, {
      linear: false,
    });
    if (wizardModernBtnNextList) {
      wizardModernBtnNextList.forEach((wizardModernBtnNext) => {
        wizardModernBtnNext.addEventListener('click', (event) => {
          modernStepper.next();
        });
      });
    }
    if (wizardModernBtnPrevList) {
      wizardModernBtnPrevList.forEach((wizardModernBtnPrev) => {
        wizardModernBtnPrev.addEventListener('click', (event) => {
          modernStepper.previous();
        });
      });
    }
    if (wizardModernBtnSubmit) {
      wizardModernBtnSubmit.addEventListener('click', (event) => {
        $('.wizard-modern-example').block({
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
        let variables = {};
        $('[id^=params-input-]').map(function () {
          variables[this.id.replace('params-input-', '')] = $(this).val();
        });
        let data = {
          mssqlString: $('#mssql-connection-string').val(),
          erpAppId: $('#erp-app').val(),
          variables,
        };
        $.ajax({
          url: '/activate/setup',
          type: 'POST',
          data,
          success: function (data) {
            $('.wizard-modern-example').unblock();
            if (data.success) {
              Swal.fire({
                icon: 'success',
                title: 'Başarılı!',
                text: 'Kurulum başarılı. Uygulamayı kapatılacaktır. Lütfen yeniden açınız!',
                confirmButtonText: 'Tamam',
              }).then((result) => {
                ipc.send('quit');
              });
            }
          },
          error: function (err) {
            $('.wizard-modern-example').unblock();
            Swal.fire({
              icon: 'error',
              title: 'Hata!',
              text: err.responseJSON.message,
              confirmButtonText: 'Tamam',
            });
          },
        });
      });
    }
  }

  $('#check-mssql-connection-string').click((e) => {
    e.preventDefault();
    const mssqlString = $('#mssql-connection-string').val();
    $.ajax({
      url: '/activate/check/mssql',
      type: 'POST',
      data: { mssqlString },
      success: function (data) {
        if (data.success) {
          $('#mssql-connection-string').removeClass('is-invalid');
          $('#mssql-connection-string').addClass('is-valid');
          $('#mssql-connection-string-feedback').addClass('valid-feedback');
          $('#mssql-connection-string-feedback').removeClass('invalid-feedback');
          $('#mssql-connection-string-feedback').html('Bağlantı başarılı.');
        }
      },
      error: function (err) {
        $('#mssql-connection-string').removeClass('is-valid');
        $('#mssql-connection-string').addClass('is-invalid');
        $('#mssql-connection-string-feedback').addClass('invalid-feedback');
        $('#mssql-connection-string-feedback').removeClass('valid-feedback');
        $('#mssql-connection-string-feedback').html(`Bağlantı başarısız! ${err.responseJSON.message}`);
      },
    });
  });

  $('#erp-app')
    .select2({
      placeholder: 'ERP Uygulaması Seçiniz',
      allowClear: true,
    })
    .on('select2:select', function (e) {
      const data = e.params.data;
      $.ajax({
        type: 'get',
        url: `/activate/erp-apps/${data.id}`,
        success: function (response) {
          if (response.length === 0)
            return $('#app-variables-inputs').html(`
            <div class="alert alert-success d-flex align-items-center" role="alert">
              <span class="alert-icon text-success me-2">
                <i class="ti ti-check ti-xs"></i>
              </span>
              Seçili ERP için girilmesi gereken bir parametre bulunmamaktadır. İşleminizi tamamlayabilirsiniz.
            </div>`);
          else {
            let inputs = '';
            response.forEach((variable) => {
              inputs += `
            <div class="col-md-6">
                <label class="form-label" for="params-input-${variable}">${variable}</label>
                <input type="text" id="params-input-${variable}" name="params-input-${variable}" class="form-control">
            </div>
            `;
            });
            $('#app-variables-inputs').html(`<div class="row">${inputs}</div>`);
          }
        },
        error: function (err) {
          $('#app-variables-inputs').html(`
          <div class="alert alert-info d-flex align-items-center btn-prev" role="alert">
              <span class="alert-icon text-info me-2">
                  <i class="ti ti-arrow-left"></i>
              </span>
              Lütfen ERP uygulaması seçiniz...
          </div>`);
        },
      });
    })
    .on('select2:unselect', function (e) {
      $('#app-variables-inputs').html(`
          <div class="alert alert-info d-flex align-items-center btn-prev" role="alert">
              <span class="alert-icon text-info me-2">
                  <i class="ti ti-arrow-left"></i>
              </span>
              Lütfen ERP uygulaması seçiniz...
          </div>`);
    });

  $.ajax({
    type: 'get',
    url: '/activate/erp-apps',
    success: function (response) {
      response.forEach((template) => {
        let option = new Option(`${template.app.name} - ${template.app.code}`, template.id, false, false);
        $('#erp-app').append(option);
      });
    },
  });
});
