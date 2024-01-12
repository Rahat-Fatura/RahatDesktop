$(document).ready(() => {
  $('#activateBtn').click(() => {
    $('#activateBtn').addClass('disabled');
    $('#activateBtn').html("<i class='fa fa-spinner fa-spin'></i> Activating...");
    $.ajax({
      url: '/activate',
      type: 'POST',
      data: {
        key: $('#apikey').val(),
      },
      success: (data) => {
        $('#activateBtn').html("<i class='fa fa-check'></i> Activated!");
        setTimeout(() => {
          // window.location.href = "http://localhost:3000";
        }, 1000);
      },
      error: (err) => {
        console.log(err);
        $('#activateBtn').removeClass('disabled');
        $('#activateBtn').html("<i class='fa fa-check'></i> Activate");
        $('#apikey').val('');
        $('#apikey').focus();
        $('#error').html(err.responseJSON.message);
      },
    });
  });
});
