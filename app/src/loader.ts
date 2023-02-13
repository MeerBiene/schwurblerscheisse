export default class Loader {
  html: string;
  target: any;
  old: null;
  constructor() {
    this.target = null;
    this.old = null;
    this.html = `<div class="loader">
    <div class="loader-inner">
      <div class="loader-line-wrap">
        <div class="loader-line"></div>
      </div>
      <div class="loader-line-wrap">
        <div class="loader-line"></div>
      </div>
      <div class="loader-line-wrap">
        <div class="loader-line"></div>
      </div>
      <div class="loader-line-wrap">
        <div class="loader-line"></div>
      </div>
      <div class="loader-line-wrap">
        <div class="loader-line"></div>
      </div>
    </div>
    </div>`;
  }
  startLoading(target: any) {
    this.target = target;
    this.old = target.innerHTML;
    this.target.innerHTML = this.html;
  }
  stopLoading() {
    this.target.innerHTML = this.old;
    this.clear();
  }
  clear() {
    this.target = null;
    this.old = null;
  }
}
