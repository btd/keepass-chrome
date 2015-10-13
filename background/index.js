chrome.runtime.onConnect.addListener(function(port) {
  port.onMessage.addListener(msg => {
    console.log(msg)
    switch(msg.type) {
      case 'save session':
        sessionStorage.setItem(msg.key, JSON.stringify(msg.data));
        break;
      case 'load session':
        let res = sessionStorage.getItem(msg.key);

        let msg = { id: msg.id, type: msg.type, result: res && JSON.parse(res) }
        console.log(msg)
        port.postMessage(msg);
        break;
    }
  })
  port.onDisconnect.addListener(function(msg) {
  });
});
