

const lblPending = document.querySelector('#lbl-pending');
const deskHeader = document.querySelector('h1');
const noMoreAlert = document.querySelector('.alert');
const btnDraw = document.querySelector('#btn-draw');
const btnDone = document.querySelector('#btn-done');

const currentTicketLbl = document.querySelector('small');
const searchParams = new URLSearchParams(window.location.search);

let workingTicket = null;
if (!searchParams.has('escritorio')) {
  window.location = 'index.html';
  throw new Error('escritorio is not available');
}

const deskNumber = searchParams.get('escritorio');

deskHeader.innerText = deskNumber;

loadInitCount();
async function loadInitCount() {
  const pending = await fetch('/api/ticket/pending').then(resp => resp.json());
  checkTicketCount(pending?.tickets?.length);
}

function checkTicketCount(currentCount = 0) {
  if (currentCount === 0) {
    noMoreAlert.classList.remove('d-none')
  } else {
    noMoreAlert.classList.add('d-none')
  }
  lblPending.innerHTML = currentCount;
}


async function getTicket() {
  await finishTicket();
  const { status, ticket, message } = await fetch(`/api/ticket/draw/${deskNumber}`).then(resp => resp.json());
  workingTicket = ticket;

  if (status === 'error') {
    workingTicket = null;
    currentTicketLbl.innerHTML = message;
    return;
  }

  workingTicket = ticket;
  currentTicketLbl.innerHTML = ticket.number;
}

async function finishTicket() {
  if (!workingTicket) return;
  const { status, message } = await fetch(
    `/api/ticket/done/${workingTicket.id}`, {
    method: 'PUT'
  }).then(resp => resp.json());


  if (status === 'error') {
    workingTicket = null;
    currentTicketLbl.innerHTML = message;
    return;
  }
  currentTicketLbl.innerHTML = 'Nadie';
  workingTicket = null;
}

function connectToWebSockets() {

  const socket = new WebSocket('ws://localhost:3000/ws');

  socket.onmessage = (event) => {
    if (!event.data) return;
    const data = JSON.parse(event.data);
    if (data.type !== 'on-ticket-count-change') return;
    checkTicketCount(data.payload);
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

btnDraw.addEventListener('click', getTicket);
btnDone.addEventListener('click', finishTicket);