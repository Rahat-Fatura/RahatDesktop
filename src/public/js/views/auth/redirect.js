const acc_key = Cookies.get('acc_key');
if (acc_key) {
  $.blockUI({
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
      opacity: 1,
    },
  });
  $.ajax({
    url: '/api/auth/verify',
    type: 'GET',
    success: function (result) {
      if (result.verified) {
        window.location.href = '/';
      } else {
        Cookies.remove('acc_key');
        $.unblockUI();
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      Cookies.remove('acc_key');
      $.unblockUI();
    },
  });
}
