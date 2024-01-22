$(document).ready(function () {
  toastr.options = {
    closeButton: true,
    progressBar: true,
    positionClass: 'toast-bottom-full-width',
  };
  $('#nbs-einvoice-serie').inputmask({ mask: 'AAA' });
  $('#nbs-earchive-serie').inputmask({ mask: 'AAA' });
  $('#nbs-edespatch-serie').inputmask({ mask: 'AAA' });

  $('#autolaunch-checkbox').change(function () {
    if (this.checked) {
      $.ajax({
        url: '/auto-launch/activate',
        type: 'POST',
        success: function (data) {
          if (data.success) {
            toastr.success('Otomatik başlatma <b>aktif</b> edildi.');
          }
        },
        error: function (err) {
          toastr.error('Otomatik başlatma aktif <b>edilemedi</b>.' + JSON.stringify(err.responseJSON));
          console.log(err);
          $('#autolaunch-checkbox').prop('checked', false);
        },
      });
    } else {
      $.ajax({
        url: '/auto-launch/deactivate',
        type: 'POST',
        success: function (data) {
          if (data.success) {
            toastr.success('Otomatik başlatma <b>kaldırıldı</b>.');
          }
        },
        error: function (err) {
          toastr.error('Otomatik başlatma <b>kaldırılamadı</b>.' + JSON.stringify(err.responseJSON));
          console.log(err);
          $('#autolaunch-checkbox').prop('checked', true);
        },
      });
    }
  });
  $('#cron-checkbox').change(function () {
    if (this.checked) {
      $.ajax({
        url: '/cron/activate',
        type: 'POST',
        success: function (data) {
          if (data.success) {
            Swal.fire({
              icon: 'success',
              title: 'Başarılı',
              text: 'Düzenli veritabanı sorgusu aktif edildi. Uygulamayı yeniden başlatınız.',
            });
          }
        },
        error: function (err) {
          Swal.fire({
            icon: 'error',
            title: 'Hata',
            text: 'Düzenli veritabanı sorgusu aktif edilemedi.' + err,
          });
          console.log(err);
          $('#cron-checkbox').prop('checked', false);
        },
      });
    } else {
      $.ajax({
        url: '/cron/deactivate',
        type: 'POST',
        success: function (data) {
          if (data.success) {
            Swal.fire({
              icon: 'success',
              title: 'Başarılı',
              text: 'Düzenli veritabanı sorgusu kaldırıldı. Uygulamayı yeniden başlatınız.',
            });
          }
        },
        error: function (err) {
          Swal.fire({
            icon: 'error',
            title: 'Hata',
            text: 'Düzenli veritabanı sorgusu kaldırılamadı.' + err,
          });
          console.log(err);
          $('#cron-checkbox').prop('checked', true);
        },
      });
    }
  });
  $('#rmq-checkbox').change(function () {
    if (this.checked) {
      $.ajax({
        url: '/rmq/activate',
        type: 'POST',
        success: function (data) {
          if (data.success) {
            Swal.fire({
              icon: 'success',
              title: 'Başarılı',
              text: 'Uzak sistem dinleme aktif edildi. Uygulamayı yeniden başlatınız.',
            });
          }
        },
        error: function (err) {
          Swal.fire({
            icon: 'error',
            title: 'Hata',
            text: 'Uzak sistem dinleme aktif edilemedi.' + err,
          });
          console.log(err);
          $('#rmq-checkbox').prop('checked', false);
        },
      });
    } else {
      $.ajax({
        url: '/rmq/deactivate',
        type: 'POST',
        success: function (data) {
          if (data.success) {
            Swal.fire({
              icon: 'success',
              title: 'Başarılı',
              text: 'Uzak sistem dinleme kaldırıldı. Uygulamayı yeniden başlatınız.',
            });
          }
        },
        error: function (err) {
          Swal.fire({
            icon: 'error',
            title: 'Hata',
            text: 'Uzak sistem dinleme kaldırılamadı.' + err,
          });
          console.log(err);
          $('#rmq-checkbox').prop('checked', true);
        },
      });
    }
  });
  $('#numberBeforeSend-checkbox').change(function () {
    if (this.checked) {
      $.ajax({
        url: '/settings/general.nbs/activate',
        type: 'PUT',
        success: function (data) {
          if (data.success) {
            toastr.success('Gönderimden önce numaralama <b>aktif</b> edildi.');
            $('#nbs-invoices-settings').slideDown(250);
          }
        },
        error: function (err) {
          toastr.error('Gönderimden önce numaralama aktif <b>edilemedi</b>.' + JSON.stringify(err.responseJSON));
          $('#nbs-invoices-settings').slideUp(250);
          console.log(err);
          $('#numberBeforeSend-checkbox').prop('checked', false);
        },
      });
    } else {
      $.ajax({
        url: '/settings/general.nbs/deactivate',
        type: 'PUT',
        success: function (data) {
          if (data.success) {
            toastr.success('Gönderimden önce numaralama <b>kaldırıldı</b>.');
            $('#nbs-invoices-settings').slideUp(250);
          }
        },
        error: function (err) {
          toastr.error('Gönderimden önce numaralama <b>kaldırılamadı</b>.' + JSON.stringify(err.responseJSON));
          $('#nbs-invoices-settings').slideDown(250);
          console.log(err);
          $('#numberBeforeSend-checkbox').prop('checked', true);
        },
      });
    }
  });
  $('#nbs-einvoice-checkbox').change(function () {
    if (this.checked) {
      $.ajax({
        url: '/settings/document.nbs/einvoice/activate',
        type: 'PUT',
        success: function (data) {
          if (data.success) {
            toastr.success('e-Fatura gönderimden önce numaralama <b>aktif</b> edildi.');
            $('#nbs-einvoice-serie-div').slideDown(250);
          }
        },
        error: function (err) {
          toastr.error('e-Fatura gönderimden önce numaralama aktif <b>edilemedi</b>.' + JSON.stringify(err.responseJSON));
          $('#nbs-einvoice-serie-div').slideUp(250);
          console.log(err);
          $('#nbs-einvoice-checkbox').prop('checked', false);
        },
      });
    } else {
      $.ajax({
        url: '/settings/document.nbs/einvoice/deactivate',
        type: 'PUT',
        success: function (data) {
          if (data.success) {
            toastr.success('e-Fatura gönderimden önce numaralama <b>kaldırıldı</b>.');
            $('#nbs-einvoice-serie-div').slideUp(250);
          }
        },
        error: function (err) {
          toastr.error('e-Fatura gönderimden önce numaralama <b>kaldırılamadı</b>.' + JSON.stringify(err.responseJSON));
          $('#nbs-einvoice-serie-div').slideDown(250);
          console.log(err);
          $('#nbs-einvoice-checkbox').prop('checked', true);
        },
      });
    }
  });
  $('#nbs-earchive-checkbox').change(function () {
    if (this.checked) {
      $.ajax({
        url: '/settings/document.nbs/earchive/activate',
        type: 'PUT',
        success: function (data) {
          if (data.success) {
            toastr.success('e-Arşiv gönderimden önce numaralama <b>aktif</b> edildi.');
            $('#nbs-earchive-serie-div').slideDown(250);
          }
        },
        error: function (err) {
          toastr.error('e-Arşiv gönderimden önce numaralama aktif <b>edilemedi</b>.' + JSON.stringify(err.responseJSON));
          $('#nbs-earchive-serie-div').slideUp(250);
          console.log(err);
          $('#nbs-earchive-checkbox').prop('checked', false);
        },
      });
    } else {
      $.ajax({
        url: '/settings/document.nbs/earchive/deactivate',
        type: 'PUT',
        success: function (data) {
          if (data.success) {
            toastr.success('e-Arşiv gönderimden önce numaralama <b>kaldırıldı</b>.');
            $('#nbs-earchive-serie-div').slideUp(250);
          }
        },
        error: function (err) {
          toastr.error('e-Arşiv gönderimden önce numaralama <b>kaldırılamadı</b>.' + JSON.stringify(err.responseJSON));
          $('#nbs-earchive-serie-div').slideDown(250);
          console.log(err);
          $('#nbs-earchive-checkbox').prop('checked', true);
        },
      });
    }
  });
  $('#nbs-einvoice-serie').on('focusout', function () {
    if (!$('#nbs-einvoice-serie').inputmask('isComplete')) {
      return;
    }
    $.ajax({
      url: '/settings/document.nbs/document/serie',
      type: 'PUT',
      data: { docType: 'einvoice', serie: $('#nbs-einvoice-serie').val() },
      success: function (data) {
        if (data.success) {
          toastr.success('e-Fatura numaralama serisi <b>güncellendi</b>.');
        }
      },
      error: function (err) {
        toastr.error('e-Fatura numaralama serisi <b>güncellenemedi</b>.' + JSON.stringify(err.responseJSON));
        console.log(err);
      },
    });
  });
  $('#nbs-earchive-serie').on('focusout', function () {
    if (!$('#nbs-earchive-serie').inputmask('isComplete')) {
      return;
    }
    $.ajax({
      url: '/settings/document.nbs/document/serie',
      type: 'PUT',
      data: { docType: 'earchive', serie: $('#nbs-earchive-serie').val() },
      success: function (data) {
        if (data.success) {
          toastr.success('e-Arşiv numaralama serisi <b>güncellendi</b>.');
        }
      },
      error: function (err) {
        toastr.error('e-Arşiv numaralama serisi <b>güncellenemedi</b>.' + JSON.stringify(err.responseJSON));
        console.log(err);
      },
    });
  });
  $('#open-log-folder').click(function () {
    ipc.send('open-logfile');
  });
  $('#version').text('v' + ipc.sendSync('get-version'));
  $('#check-for-updates').click(function () {
    $('#updater-logs-div').slideDown(250);
    ipc.send('check-for-updates');
  });
  ipc.on('updater-message', (event, text) => {
    const data = JSON.parse(text);
    switch (data.status) {
      case 'checking-for-update':
        $('#updater-logs').append(`<li class="list-group-item list-group-timeline-primary">${data.message}</li>`);
        break;
      case 'update-available':
        $('#updater-logs').append(
          `<li class="list-group-item list-group-timeline-success">${data.message} - Bulunan versiyon: <b>${data.info.version}</b></li>`,
        );
        break;
      case 'update-not-available':
        $('#updater-logs').append(`<li class="list-group-item list-group-timeline-danger">${data.message}</li>`);
        break;
      case 'error':
        $('#updater-logs').append(
          `<li class="list-group-item list-group-timeline-danger">${data.message} - Hata: <b>${data.err}</b></li>`,
        );
        break;
      case 'download-progress':
        if ($('#download-progress-bar').length === 0) {
          $('#updater-logs').append(
            ` <li class="list-group-item list-group-timeline-success demo-vertical-spacing demo-only-element">
                  <div class="progress">
                      <div id="download-progress-bar" class="progress-bar progress-bar-striped progress-bar-animated bg-success" role="progressbar" style="width: 0%" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div>
                  </div>
                  <p>İndirme: <span id="download-progress-percent">0</span> || Hız: <span id="download-progress-speed">0</span> || Durum: <span id="download-progress-transferred">0</span> / <span id="download-progress-total">0</span> </p>
              </li>`,
                );
        }
        $('#download-progress-bar').css('width', `${data.data.percent}%`);
        $('#download-progress-bar').attr('aria-valuenow', data.data.percent);
        $('#download-progress-percent').text(data.data.percent);
        $('#download-progress-speed').text(data.data.bytesPerSecond);
        $('#download-progress-transferred').text(data.data.transferred);
        $('#download-progress-total').text(data.data.total);
        break;
      case 'update-downloaded':
        Swal.fire({
          icon: 'success',
          title: 'Başarılı',
          text: 'Güncelleme indirildi. Uygulamayı yeniden başlatınız.',
        });
        break;
    }
  });
});
