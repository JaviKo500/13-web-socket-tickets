

const lblPending = document.querySelector('#lbl-pending');

loadInitCount();
async function loadInitCount() {
  const pending = await fetch('/api/ticket/pending').then(resp => resp.json());
  lblPending.innerHTML = pending?.tickets?.length || 0;
}


function connectToWebSockets() {

  const socket = new WebSocket('ws://localhost:3000/ws');

  socket.onmessage = (event) => {
    console.log(event.data);
    if (!event.data) return;
    const data = JSON.parse(event.data);
    if ( data.type !== 'on-ticket-count-change' ) return;
    lblPending.innerHTML = data.payload || 0
  };

  socket.onclose = (event) => {
    console.log('Connection closed');
    setTimeout(() => {
      console.log('retrying to connect');
      connectToWebSockets();
    }, 1500);

  };

  socket.onopen = (event) => {
    console.log('Connected');
  };

}

connectToWebSockets();