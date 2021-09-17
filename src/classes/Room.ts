class Room {
  private roomId;
  private roomTitle;
  private namespace;
  private privateRoom;
  private history;

  constructor(roomId, roomTitle, namespace, privateRoom = false) {
    this.roomId = roomId;
    this.roomTitle = roomTitle;
    this.namespace = namespace;
    this.privateRoom = privateRoom;
    this.history = [];
  }

  addmessage(message) {
    this.history.push(message);
  }

  clearHistory() {
    this.history = [];
  }
}

export default Room;
