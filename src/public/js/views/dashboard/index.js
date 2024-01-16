$(document).ready(function () {
  $('#activate-auto-launch').click(function () {
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
          $('#activate-auto-launch').hide();
          $('#active-badge').show();
          $('#deactivate-auto-launch').show();
          $('#passive-badge').hide();
        }
      },
      error: function (err) {
        Swal.fire({
          icon: 'error',
          title: 'Hata',
          text: 'Otomatik başlatma aktif edilemedi.' + err,
        });
        console.log(err);
      },
    });
  });
  $('#deactivate-auto-launch').click(function () {
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
          $('#deactivate-auto-launch').hide();
          $('#passive-badge').show();
          $('#activate-auto-launch').show();
          $('#active-badge').hide();
        }
      },
      error: function (err) {
        Swal.fire({
          icon: 'error',
          title: 'Hata',
          text: 'Otomatik başlatma kaldırılamadı.' + err,
        });
        console.log(err);
      },
    });
  });
  $('#logfile').click(function () {
    ipc.send('open-logfile');
  });
});
