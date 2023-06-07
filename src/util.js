
export function setCookie(name, value, days, doc) {
  var expires = "";
  if (days) {
    var date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    expires = "; expires=" + date.toUTCString();
  }
  doc = doc || document;
  doc.cookie = name + "=" + encodeURIComponent(value) + expires + "; path=/";
}

export function getCookie(name, doc) {
  doc = doc || document;
  var nameEQ = name + "=";
  var ca = doc.cookie.split(';');
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) === ' ') {
      c = c.substring(1, c.length);
    }
    if (c.indexOf(nameEQ) === 0) {
      return decodeURIComponent(c.substring(nameEQ.length, c.length));
    }
  }
  return null;
}
