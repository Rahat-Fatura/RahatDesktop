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
  $('#open-log-folder').click(function () {
    ipc.send('open-logfile');
  });
});
