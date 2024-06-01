

const lblPending = document.querySelector('#lbl-pending');
const deskHeader = document.querySelector('h1');
const noMoreAlert = document.querySelector('.alert');

const searchParams  = new URLSearchParams( window.location.search );

if ( !searchParams.has('escritorio') ) {
  window.location = 'index.html';
  throw new Error('escritorio is not available');
}

const deskNumber  = searchParams.get('escritorio');

deskHeader.innerText = deskNumber;

loadInitCount();
async function loadInitCount() {
  const pending = await fetch('/api/ticket/pending').then(resp => resp.json());
  checkTicketCount( pending?.tickets?.length );
}

function checkTicketCount( currentCount = 0 ) {
  if ( currentCount === 0 ) {
    noMoreAlert.classList.remove('d-none')
  } else {
    noMoreAlert.classList.add('d-none')
  }
  lblPending.innerHTML  = currentCount;
}


function connectToWebSockets() {

  const socket = new WebSocket('ws://localhost:3000/ws');

  socket.onmessage = (event) => {
    console.log(event.data);
    if (!event.data) return;
    const data = JSON.parse(event.data);
    if ( data.type !== 'on-ticket-count-change' ) return;
    checkTicketCount( data.payload );
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