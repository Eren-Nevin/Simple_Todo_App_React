// const serverAddress = "http://localhost:9999";
const serverAddress = "https://dinkedpawn.com:9999";

let _pendingTransactions = [];
// let _currentItemList = [];

async function _getDataFromServer() {
  return fetch(`${serverAddress}/api/get_items`);
}

async function _sendTransactionsToServer(transactions) {
  const data = JSON.stringify(transactions);
  await fetch(`${serverAddress}/api/send_transactions`, {
    method: "POST",
    mode: "no-cors",
    headers: {
      "Content-Type": "application/json",
    },
    body: data,
  });
}

async function fetchFromServer() {
  const data = await _getDataFromServer();
  return await data.json();
}

async function syncToServer() {
    await _sendTransactionsToServer(_pendingTransactions)
    _pendingTransactions = [];
}


async function addItem(item) {
  let transaction = {
    transaction_id: Date.now(),
    transaction_type: "Add",
    item_id: item.id,
    title: item.title,
    details: item.details,
    important: item.important,
    timestamp: item.timestamp,
      arb_order: item.arb_order,
  };
  _pendingTransactions.push(transaction);
}

async function changeItem(item) {
  let transaction = {
    transaction_id: Date.now(),
    transaction_type: "Modify",
    item_id: item.id,
    title: item.title,
    details: item.details,
    important: item.important,
    timestamp: item.timestamp,
      arb_order: item.arb_order,
  };
  _pendingTransactions.push(transaction);
}

async function removeItem(item) {
  let transaction = {
    transaction_id: Date.now(),
    transaction_type: "Remove",
    item_id: item.id,
    title: item.title,
    details: item.details,
    important: item.important,
    timestamp: item.timestamp,
      arb_order: item.arb_order,
  };
  _pendingTransactions.push(transaction);
}

// async function sendItemsToServer(items) {
//   const data = JSON.stringify(items);
//   await fetch(`${serverAddress}/api/send_items`, {
//     method: "POST",
//       mode: 'no-cors',
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: data,
//   });
// }

export { fetchFromServer, syncToServer, addItem, changeItem, removeItem };
