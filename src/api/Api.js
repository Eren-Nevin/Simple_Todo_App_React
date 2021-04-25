const serverAddress = "http://localhost:9999";

async function _getDataFromServer() {
  return fetch(`${serverAddress}/api/get_items`);
}

async function getItemsFromServer() {
  const data = await _getDataFromServer();
  return await data.json();
}

async function sendItemsToServer(items) {
  const data = JSON.stringify(items);
  await fetch(`${serverAddress}/api/send_items`, {
    method: "POST",
      mode: 'no-cors',
    headers: {
      "Content-Type": "application/json",
    },
    body: data,
  });
}

export { getItemsFromServer, sendItemsToServer };
