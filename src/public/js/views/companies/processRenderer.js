class processCellRenderer {
  eGui;
  init(params) {
    this.eGui = document.createElement('div');
    this.eGui.innerHTML = `
    <div class="btn-group ms-1" role="group">
      <button type="button" onclick="route('/companies/${params.data.id}/dashboard')" class="btn btn-sm btn-icon btn-label-${
        params.data.status === 'active' ? 'success' : 'secondary'
      } waves-effect" ${params.data.status != 'active' ? 'disabled' : ''}>
        <i class="fa-solid fa-play"></i>
      </button>
      <button type="button" class="btn btn-sm btn-icon btn-label-info waves-effect">
        <i class="fa-solid fa-sliders"></i>
      </button>
    </div>`;
  }

  getGui() {
    return this.eGui;
  }

  refresh(params) {
    return false;
  }
}
