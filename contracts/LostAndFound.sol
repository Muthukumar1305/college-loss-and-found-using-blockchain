// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract LostAndFound {
    enum ItemStatus { Found, Claimed, Returned }

    struct Item {
        uint256 id;
        string itemHash; // IPFS hash or metadata hash
        ItemStatus status;
        address recorder;
    }

    mapping(uint256 => Item) public items;
    uint256 public itemCount;

    event ItemRegistered(uint256 id, string itemHash, address recorder);
    event StatusUpdated(uint256 id, ItemStatus status);

    function registerItem(string memory _itemHash) public returns (uint256) {
        itemCount++;
        items[itemCount] = Item(
            itemCount,
            _itemHash,
            ItemStatus.Found,
            msg.sender
        );
        
        emit ItemRegistered(itemCount, _itemHash, msg.sender);
        return itemCount;
    }

    function updateStatus(uint256 _id, ItemStatus _status) public {
        require(_id > 0 && _id <= itemCount, "Item does not exist");
        items[_id].status = _status;
        
        emit StatusUpdated(_id, _status);
    }

    function getItem(uint256 _id) public view returns (uint256, string memory, ItemStatus, address) {
        Item memory item = items[_id];
        return (item.id, item.itemHash, item.status, item.recorder);
    }
}