import * as _repository from './Repository.js' ;

async function getItems(){
    return await _repository.fetchFromServer()
}

async function syncItems(){
    await _repository.syncToServer()
    const newItems = await getItems()
    return newItems
}

function _addItem(item) {
    _repository.addItem(item)
}
function _changeItem(item) {
    _repository.changeItem(item)
}
function _removeItem(item) {
    _repository.removeItem(item)
}
function removeItem(item) {
    _removeItem(item)
}
function toggleStarItem(item) {
    item.important = !item.important
    item.timestamp = Date.now()
    _changeItem(item)
}
function addNewItem(title, details, important) {
   let item = {
       id: Date.now(),
       title: title,
       details: details,
       important: important,
       timestamp: Date.now(),
       arb_order: 0,
   }

    _addItem(item)
}

export { getItems, syncItems, addNewItem, toggleStarItem, removeItem };
