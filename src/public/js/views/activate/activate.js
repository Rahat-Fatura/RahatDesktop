$(document).ready(() => {
  $('#activateBtn').click(() => {
    $('#activateBtn').addClass('disabled');
    $('#activateBtn').html("<i class='fa fa-spinner fa-spin me-3'></i> Kontrol ediliyor...");
    $.ajax({
      url: '/activate',
      type: 'POST',
      data: {
        key: $('#apikey').val(),
      },
      success: (data) => {
        console.log(data);
        $('#activateBtn').removeClass('disabled');
        $('#activateBtn').html('Aktive Et');
        Swal.fire({
          title: 'Başarılı!',
          text: `Aktivasyon başarılı. ${
            data.isActivated
              ? 'Uygulamayı kapatılacaktır. Lütfen yeniden açınız!'
              : 'Devam etmek için devam et butonuna tıklayın.'
          }`,
          icon: 'success',
          confirmButtonText: 'Devam et',
        }).then(() => {
          if (data.isActivated) {
            ipc.send('quit');
          } else window.location.href = '/activate/setup';
        });
      },
      error: (err) => {
        console.log(err);
        Swal.fire({
          title: 'Hata!',
          text: 'Key bilginiz geçersiz. Detay: ' + err.responseJSON.message,
          icon: 'error',
          confirmButtonText: 'Tekrar dene',
        }).then(() => {
          $('#activateBtn').removeClass('disabled');
          $('#activateBtn').html('Aktive Et');
          $('#apikey').focus();
        });
      },
    });
  });
});
