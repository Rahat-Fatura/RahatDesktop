$(document).ready(function () {
  new Cleave('#phone', {
    phone: true,
    phoneRegionCode: 'TR',
  });
  $('#taxnumber').inputmask({ mask: '9999999999[9]', jitMasking: true });
});
