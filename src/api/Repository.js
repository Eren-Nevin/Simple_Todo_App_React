import { io } from "socket.io-client";
import * as Rx from "rxjs";
import { Transaction, Item } from "./Model.js";

class Repository {
  socket;
  isConnected;
  _currentTransactions = [];
  _pendingTransactions = [];
  // _serverAddress = "https://dinkedpawn.com:9999";
  _serverAddress = "http://localhost:9999";
  _itemAddedInRepositoryStream = new Rx.Subject();
  _itemRemovedInRepositoryStream = new Rx.Subject();
  _itemChangedInRepositoryStream = new Rx.Subject();

  _resetStream = new Rx.Subject();

  _inboundTransactionStream = new Rx.Subject();

  constructor(userToken) {
    this.createSocketIO(userToken);
  }

  // let _currentItemList = [];
  //

  start() {
    // this.createSocketIO();
    //
    this._addWebSocketOnEventsListeners();
    this._addWebsocketOnConnectListener();
    this._addWebSocketOnDisconnectListener();

    this._startListeningOnInputTransactions();
    this.connectWebSocket();
  }

    destructor(){
        this.socket.disconnect()
    }
  // These are listened by the viewModel to know when an item is
  // added/removed/changed.
  getItemAddedStream() {
    return this._itemAddedInRepositoryStream;
  }

  getItemChangedStream() {
    return this._itemChangedInRepositoryStream;
  }

  getItemRemovedStream() {
    return this._itemRemovedInRepositoryStream;
  }

  getResetStream() {
    return this._resetStream;
  }

  // These are called by the viewModel when client is adding/removing/changing
  // items.
  addItem(item) {
    console.log(item.title);
    this._inboundTransactionStream.next(
      new Transaction(Date.now(), "Add", item)
    );
  }

  changeItem(item) {
    this._inboundTransactionStream.next(
      new Transaction(Date.now(), "Modify", item)
    );
  }

  removeItem(item) {
    this._inboundTransactionStream.next(
      new Transaction(Date.now(), "Remove", item)
    );
  }

  _startListeningOnInputTransactions() {
    this._inboundTransactionStream.subscribe({
      next: (transaction) => {
        console.log(transaction.type);
        // We always add the transaction to current trasnaction. This doens't
        // pose any further problems in sync since server doesn't echo the
        // transaction to ourself later (no echo).
        this._currentTransactions.push(transaction);

        // If we're connected, send the transaction immediately, otherwise add it
        // to the pending transactions that would be sent to server when
        // connection is established.
        if (this.isConnected) {
          //TODO: Implement cases where there is connection but no
          //acknowledgement.
          this.socket.emit(
            "send_transaction_to_server",
            JSON.stringify(transaction),
            (data) => {
              console.log("Acknowledged");
            }
          );
        } else {
          this._pendingTransactions.push(transaction);
        }

        //TODO: Cancel Pending Emits On Disconnect

        // Add transaction to streams that would be consumed by viewModel and
        // widgets down the line.
        this._pushTransactionIntoStreams(transaction);
      },
    });
  }

  createSocketIO(userToken) {
    this.socket = io(`${this._serverAddress}/socket.io?token=${userToken}`, {
      transports: ["websocket"],
      autoConnect: false,
    });
  }

  connectWebSocket() {
    this.socket.connect();
  }

  //TODO: Make this useful for authenticating on the server.
  _addWebsocketOnConnectListener() {
    this.socket.on("connect", () => {
      console.log("Connected To Websocket");
      this.isConnected = true;

      // When client connects, it first ends all of its pending transactions to
      // server (as a single message payload) then it waits for server for an
      // acknowledgement has the whole currect trasnactions timeline which the
      // client uses to initialize itself.
      //
      //
      // socket
      //     .emitWithAck('client_connect_sync', json.encode(_pendingTransactions),
      //         ack: (List<dynamic> data) {
      // print(data.runtimeType);
      // List<Transaction> transactionList =
      //     data.map((e) => rawTransactionConvertor(e)).toList();
      // _initializeItemList(transactionList);
      // });
      // });
      this.socket.emit(
        "client_connect_sync",
        JSON.stringify(this._pendingTransactions),
        (data) => {
          console.log(`Current List is 
                    ${data.map((e) => e["title"])}`);
          let transactionList = data.map((e) =>
            this._rawTransactionDeserializer(e)
          );
          console.log(transactionList);
          this._initializeItemList(transactionList);
        }
      );
    });
  }

  _addWebSocketOnDisconnectListener() {
    this.socket.on("disconnect", () => {
      console.log("Disconnected From Websocket");
      this.isConnected = false;
    });
  }

  _addWebSocketOnEventsListeners() {
    // This is called when server pushes a normal (not out of order) transaction to client.
    console.log("Listening to server sent transactions");
    this.socket.on("send_transaction_to_client", (rawTransaction) => {
      console.log("Received $rawTransaction");
      let transaction = this._rawTransactionDeserializer(rawTransaction);

      // Its a normal transaction. We just need to add it to the current
      // ones.
      // Even though we don't echo the sent transaction back to the sender we
      // need to still check for an echoed transaction like we did in _fetch().
      // This is an added measure to make sure no duplicate transaction ends up
      // in the app.

      if (!this._currentTransactions.includes(transaction)) {
        this._currentTransactions.push(transaction);
        this._pushTransactionIntoStreams(transaction);
      }
    });

    this.socket.on("send_reset_transactions_to_client", (rawTransactions) => {
      // This happens when server detects that one of the clients tried to
      // push a transaction to server that would change the transaction
      // history. In this situation it pushes all (or a reduced) of newly
      // updated transactions in one go to client. The clients are supposed to
      // reset all their own data (e.g. items) and reinitiate with the
      // provided transactions.
      // Note that this doens't get triggered for the out of sync client
      // itself, but for other clients currently connected.
      // print(rawTransactions.runtimeType);
      console.log("Received Reset Transactions $rawTransactions");
      let transactionList = rawTransactions.map((e) =>
        this._rawTransactionDeserializer(e)
      );
      // print(transactionList.runtimeType);
      //TODO: Why this syntactic gymanstic is needed here?
      let myTransactionList = [...transactionList];
      this._initializeItemList(myTransactionList);
    });
  }

  _initializeItemList(transactionList) {
    this._pendingTransactions = [];
    // TODO: Hacky Way To Reset ShoppingItems;
    //console.log("Removing All Items In Current Transaction List");
    //for (var transaction in this._currentTransactions) {
    //  this._itemRemovedInRepositoryStream.push(transaction.item);
    //  //TODO: Does it need the delay hack?
    //}

    this._currentTransactions = [...transactionList];
    this._resetStream.next(this._getItemsFromTransactions(transactionList));
    //  // console.log(`Current Transaction List is ${
    //  //   this._currentTransactions[0].id
    //  // }`);

    //console.log("Initializing Items Into Current Transaction List");

    //for (var transaction of this._currentTransactions) {
    //  // Transaction transaction = rawTransactionConvertor(e);

    //    console.log(`Pushin ${transaction}`);
    //  // this._pushTransactionIntoStreams(transaction);
    //  //TODO: Do we need the hack in js too?
    //    // await new Promise(r => setTimeout(r, 1000));
    //  // await Future.delayed(Duration(microseconds: 1));
    //}
  }

  _getItemsFromTransactions(transactionList) {
    let result = [];
    for (var transaction of transactionList) {
      const transactionItemId = transaction.item.id;
      switch (transaction.type) {
        case "Add":
          result.unshift(transaction.item);
          break;
        case "Modify":
          result[result.findIndex((e) => e.id === transactionItemId)] =
            transaction.item;
          break;
        case "Remove":
          result.splice(
            result.findIndex((e) => e.id === transactionItemId),
            1
          );
          break;
        default:
          throw Error("Invalid transaction type");
      }
    }
    return result;
  }

  _rawTransactionDeserializer(rawTransaction) {
    let result = new Transaction();
    result.type = rawTransaction["transaction_type"];
    result.id = rawTransaction["transaction_id"];
    result.item = new Item(
      rawTransaction["item_id"],
      rawTransaction["arb_order"],
      rawTransaction["title"],
      rawTransaction["details"],
      rawTransaction["timestamp"],
      rawTransaction["important"]
    );
    return result;
  }

  async _deserializeTransactions(rawData) {
    let rawResult = await rawData.json();
    let result = rawResult
      .map((rawTransaction) => this._rawTransactionDeserializer(rawTransaction))
      .toList();
    return result;
  }

  _pushTransactionIntoStreams(transaction) {
    console.log(transaction);
    switch (transaction.type) {
      case "Add":
        console.log(`The ${transaction.item.title} is Added By Repository`);
        this._itemAddedInRepositoryStream.next(transaction.item);
        // console.log("Repository Added ${transaction.item.title} From Fetch");
        break;
      case "Modify":
        console.log(`The ${transaction.item.title} is Changed By Repository`);
        this._itemChangedInRepositoryStream.next(transaction.item);
        break;
      case "Remove":
        console.log(`The ${transaction.item.title} is Removed By Repository`);
        this._itemRemovedInRepositoryStream.next(transaction.item);
        break;
      default:
        throw Error("Invalid transaction type");
    }
  }
  // async _getDataFromServer() {
  //   return fetch(`${serverAddress}/api/get_items`);
  // }

  // async _sendTransactionsToServer(transactions) {
  //   const data = JSON.stringify(transactions);
  //   await fetch(`${serverAddress}/api/send_transactions`, {
  //     method: "POST",
  //     mode: "no-cors",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //     body: data,
  //   });
  // }

  // async fetchFromServer() {
  //   const data = await _getDataFromServer();
  //   return await data.json();
  // }

  // async syncToServer() {
  //     await _sendTransactionsToServer(_pendingTransactions)
  //     _pendingTransactions = [];
  // }

  // async addItem(item) {
  //   let transaction = {
  //     transaction_id: Date.now(),
  //     transaction_type: "Add",
  //     item_id: item.id,
  //     title: item.title,
  //     details: item.details,
  //     important: item.important,
  //     timestamp: item.timestamp,
  //       arb_order: item.arb_order,
  //   };
  //   _pendingTransactions.push(transaction);
  // }

  // async changeItem(item) {
  //   let transaction = {
  //     transaction_id: Date.now(),
  //     transaction_type: "Modify",
  //     item_id: item.id,
  //     title: item.title,
  //     details: item.details,
  //     important: item.important,
  //     timestamp: item.timestamp,
  //       arb_order: item.arb_order,
  // };
  // _pendingTransactions.push(transaction);
  // }

  // async removeItem(item) {
  // let transaction = {
  //   transaction_id: Date.now(),
  //   transaction_type: "Remove",
  //   item_id: item.id,
  //   title: item.title,
  //   details: item.details,
  //   important: item.important,
  //   timestamp: item.timestamp,
  //     arb_order: item.arb_order,
  // };
  // _pendingTransactions.push(transaction);
  // }
}
export { Repository };
