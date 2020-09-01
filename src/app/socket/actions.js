export function ActionCheckReloadTime({ ReloadTime }) {
  if(this.ReloadTime === null) {
    this.ReloadTime = ReloadTime;
    return;
  }

  if(this.ReloadTime < ReloadTime) {
    window.location.reload();
  }
}
