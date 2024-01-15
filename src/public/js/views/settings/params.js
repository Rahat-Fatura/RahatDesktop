$(document).ready(function () {
  $('.content-wrapper').block({
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
      opacity: 0.9,
    },
  });
  $.ajax({
    url: '/settings/config/company',
    type: 'GET',
    success: function (data) {
      $('.content-wrapper').unblock();
      $('#company_config').val(JSON.stringify(data, null, 2));
    },
    error: function (err) {
      $('.content-wrapper').unblock();
      console.log(err);
      Swal.fire({
        icon: 'error',
        title: 'Parametreler servisten alınamadı!',
        text: `${err.responseJSON.message}`,
      });
    },
  });
  $('#save').on('click', function () {
    $('.content-wrapper').block({
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
        opacity: 0.9,
      },
    });
    $.ajax({
      url: '/settings/config/company',
      type: 'POST',
      data: {
        companyConfig: JSON.parse($('#company_config').val()),
      },
      success: function (data) {
        $('.content-wrapper').unblock();
        Swal.fire({
          icon: 'success',
          title: 'Parametreler kaydedildi!',
        });
      },
      error: function (err) {
        $('.content-wrapper').unblock();
        console.log(err);
        Swal.fire({
          icon: 'error',
          title: 'Sorgular kaydedilemedi!',
          text: `${err.responseJSON.message}`,
        });
      },
    });
  });
});
