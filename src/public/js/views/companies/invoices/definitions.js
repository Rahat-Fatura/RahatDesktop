let start_date, end_date;
$(document).ready(function () {
  let today = new Date();
  let ldate = new Date(today.getFullYear(), today.getMonth(), 0);
  let fdate = new Date(today.getFullYear(), today.getMonth() - 1, 1);
  start_date = $('#start-date').flatpickr({
    locale: 'tr',
    defaultDate: fdate,
    dateFormat: 'd.m.Y',
    enableTime: false,
  });
  end_date = $('#end-date').flatpickr({
    locale: 'tr',
    defaultDate: ldate,
    dateFormat: 'd.m.Y',
    enableTime: false,
  });

  $('#previous-month').click((e) => {
    const fdate_value = start_date.selectedDates[0];
    let nw_sd, new_ed;
    nw_sd = new Date(fdate_value.getFullYear(), fdate_value.getMonth() - 1, 1);
    new_ed = new Date(fdate_value.getFullYear(), fdate_value.getMonth(), 0);
    start_date.setDate(nw_sd);
    end_date.setDate(new_ed);
    $('#search').trigger('click');
  });
  $('#next-month').click((e) => {
    const ldate_value = end_date.selectedDates[0];
    let nw_sd, new_ed;
    nw_sd = new Date(ldate_value.getFullYear(), ldate_value.getMonth() + 1, 1);
    new_ed = new Date(ldate_value.getFullYear(), ldate_value.getMonth() + 2, 0);
    start_date.setDate(nw_sd);
    end_date.setDate(new_ed);
    $('#search').trigger('click');
  });
});
