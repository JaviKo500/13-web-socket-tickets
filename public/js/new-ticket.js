

const lbNewTicket = document.getElementById('lbl-new-ticket');
const btnAddTicket = document.getElementById('btn-add-ticket');

getLastNumber();
async function getLastNumber() {
   const resp = await fetch('http://localhost:3000/api/ticket/last', {
      method: 'GET',
   });
   const { lastTicketNumber = 0 } = await resp.json();
   if (!lbNewTicket) return;
   lbNewTicket.innerHTML = lastTicketNumber;
}


btnAddTicket.addEventListener('click', async ( event ) => {
   const resp = await fetch('http://localhost:3000/api/ticket/', {
      method: 'POST',
   });
   const { ticket = {} } = await resp.json();
   lbNewTicket.innerHTML = ticket?.number ?? 0;
});
