class statusCellRenderer {
  eGui;
  init(params) {
    this.eGui = document.createElement('span');
    switch (params.value) {
      case 'active':
        this.eGui.className = 'badge bg-success';
        this.eGui.innerHTML = 'Aktif';
        break;
      case 'passive':
        this.eGui.className = 'badge bg-danger';
        this.eGui.innerHTML = 'Pasif';
        break;
      default:
        this.eGui.className = 'badge bg-warning';
        this.eGui.innerHTML = 'Beklemede';
        break;
    }
  }

  getGui() {
    return this.eGui;
  }

  refresh(params) {
    return false;
  }
}
