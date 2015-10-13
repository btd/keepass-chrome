export default function copy(text) {
  function removeFake() {
    document.body.removeEventListener('click', removeFake);

    if (fakeElem) {
        document.body.removeChild(fakeElem);
        fakeElem = null;
    }
  }
  document.body.addEventListener('click', removeFake);

  var fakeElem = document.createElement('textarea');
  fakeElem.style.position = 'absolute';
  fakeElem.style.left = '-9999px';
  fakeElem.style.top = document.body.scrollTop + 'px';
  fakeElem.setAttribute('readonly', '');
  fakeElem.value = text;

  document.body.appendChild(fakeElem);

  fakeElem.select();

  let succeeded = false;

  try {
      succeeded = document.execCommand('copy');
  } catch (err) {
      succeeded = false;
  }

  removeFake();

  return succeeded;
}
