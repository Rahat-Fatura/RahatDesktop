$(document).ready(function () {
  $('#autolaunch-checkbox').change(function () {
    if (this.checked) {
      $.ajax({
        url: '/auto-launch/activate',
        type: 'POST',
        success: function (data) {
          if (data.success) {
            Swal.fire({
              icon: 'success',
              title: 'Başarılı',
              text: 'Otomatik başlatma aktif edildi.',
            });
          }
        },
        error: function (err) {
          Swal.fire({
            icon: 'error',
            title: 'Hata',
            text: 'Otomatik başlatma aktif edilemedi.' + err,
          });
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
            Swal.fire({
              icon: 'success',
              title: 'Başarılı',
              text: 'Otomatik başlatma kaldırıldı.',
            });
          }
        },
        error: function (err) {
          Swal.fire({
            icon: 'error',
            title: 'Hata',
            text: 'Otomatik başlatma kaldırılamadı.' + err,
          });
          console.log(err);
          $('#autolaunch-checkbox').prop('checked', true);
        },
      });
    }
  });
  $('#open-log-folder').click(function () {
    ipc.send('open-logfile');
  });
});
