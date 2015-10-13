export default function click(el) {
  var evObj = document.createEvent('Events');
  evObj.initEvent('click', true, false);
  el.dispatchEvent(evObj);
}
