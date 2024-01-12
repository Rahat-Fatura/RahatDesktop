const urlParams = new URLSearchParams(window.location.search);
const token = urlParams.get('token');

if (!token) {
  window.location.href = '/auth/login';
} else {
  $.ajax({
    url: '/api/auth/reset-password/verify?token=' + token,
    method: 'GET',
    error: function (err) {
      if (err.responseJSON.message === 'jwt expired') {
        Swal.fire({
          title: 'Süreniz doldu',
          text: 'Şifre sıfırlama süreniz doldu. Lütfen tekrar şifre sıfırlama talebinde bulunun.',
          icon: 'error',
          confirmButtonText: 'Yeni Talep Oluştur',
        }).then((result) => {
          window.location.href = '/auth/forgot-password';
        });
      } else {
        Swal.fire({
          title: 'Geçersiz talep',
          text: 'Şifre sıfırlama talebiniz geçersiz. Lütfen tekrar şifre sıfırlama talebinde bulunun.',
          icon: 'error',
          confirmButtonText: 'Yeni Talep Oluştur',
        }).then((result) => {
          window.location.href = '/auth/forgot-password';
        });
      }
    },
  });
}
