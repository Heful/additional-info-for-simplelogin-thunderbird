(async () => {
  let tabs = await messenger.tabs.query({ active: true, currentWindow: true });

  let message = await messenger.messageDisplay.getDisplayedMessage(tabs[0].id);
  let full = await messenger.messages.getFull(message.id);

  if (!full.headers.hasOwnProperty("x-simplelogin-type") || full.headers["x-simplelogin-type"][0] !== "Forward") {
    document.querySelector("body").classList.add("not-forwarded");
  } else {
    let from = full.headers.hasOwnProperty("x-simplelogin-envelope-from") && Array.isArray(full.headers["x-simplelogin-envelope-from"]) ? full.headers["x-simplelogin-envelope-from"][0] : "unknown";
    let to = full.headers.hasOwnProperty("x-simplelogin-envelope-to") && Array.isArray(full.headers["x-simplelogin-envelope-to"]) ? full.headers["x-simplelogin-envelope-to"][0] : "unknown";
    let deliveredTo = full.headers.hasOwnProperty("x-envelope-to") && Array.isArray(full.headers["x-envelope-to"]) ? full.headers["x-envelope-to"][0] : "unknown";
    let unsubscribeHref = (full.headers.hasOwnProperty('list-unsubscribe') && Array.isArray(full.headers['list-unsubscribe']) && full.headers['list-unsubscribe'][0])
      ? full.headers['list-unsubscribe'][0].replace(/^<(.*)>$/, '$1')
      : "#";

    document.querySelector("#from").textContent = from;
    document.querySelector("#to").textContent = to;
    document.querySelector("#deliveredTo").textContent = deliveredTo.replace(/[<>]/g, '');
    document.querySelector("#unsubscribe").href = unsubscribeHref + "&body=Send this e-mail to disable the alias <" + to + ">";
  }
})();