
/* Cargar lista de amigos (seguiendo) y la conversación con el primero */
document.getElementById('chat-modal').addEventListener('show.bs.modal', function() {
  const chatFriendsContainer = this.querySelector('.chat-friends');
  const sendButton =  document.getElementById('send-message');

  fetch(`http://localhost:8080/users/${currentSession().userId}/following`, {
    method: 'GET',
    headers: {
      'Content-Type' : 'application/json',
      'Authorization': currentSession().authToken
    }
  })
  .then((res) => res.json())
  .then((followings) => {
    chatFriendsContainer.innerHTML = `
      ${ followings.map((following, i) => (
      `
        <a data-user="${following.followedUser.userId}" onclick="loadConversation('${following.followedUser.userId}')" class="list-group-item list-group-item-action d-flex ${i === 0 ? 'active' : ''}" aria-current="true">
          <div class="chat-friend-image">
            <img src="${following.followedUser.profilePicture}" class="w-100">
          </div>
          <div class="chat-friend-name ps-3">
            <span>${following.followedUser.name}</span>
          </div>
        </a>
      `
  )).join('') }
    `;
    const firstUserFollowed = followings.length > 0 ? followings[0].followedUser.userId : 0;

    if (firstUserFollowed !== 0) {
      sendButton.onclick = sendMessage(firstUserFollowed);
    }

    loadConversation(firstUserFollowed);

    [...chatFriendsContainer.querySelectorAll('a')].forEach((friendBtn) => {
      friendBtn.addEventListener('click', function() {
        chatFriendsContainer.querySelector('a.active').classList.remove('active');
        this.classList.add('active');
        sendButton.onclick = sendMessage(this.dataset.user);
      });
    })
  })
  .catch((err) => console.log(err));

})

/** Carga conversación del usuario actual con algún otro usuario seguido */
function loadConversation(followedUserId) {
  const chatArea = document.querySelector('#chat-modal .chat-area');
  const userId = currentSession().userId;

  fetch(`http://localhost:8080/chats/user/${userId}/with/${followedUserId}`, {
    method: 'GET',
    headers: {
      'Content-Type' : 'application/json',
      'Authorization': currentSession().authToken
    }
  })
  .then(res => res.json())
  .then((conversation) => {
    chatArea.innerHTML = `
    ${ conversation.map((message) => message.user.userId === userId ? (
      `
      <div class="row mb-2">
        <div class="col-8 ms-auto text-end">
          ${message.message}
        </div>
      </div>
      `
    ) : (
      `
        <div class="row mb-2">
          <div class="col-8 me-auto">
            ${message.message}
          </div>
        </div>
      `
    )
  ).join('') }
    `
  })
  .catch(err => console.log(err))
  .finally(() => (chatArea.scrollTop = chatArea.scrollHeight));
}

function sendMessage(sendTo) {
  return function() {
    const msgInput = document.querySelector('#chat-modal .chat-text input');
    /* validate msgInput */
    if (!validateMessage(msgInput.value.trim())) {
      return;
    }

    fetch(`http://localhost:8080/chats`, {
      method: 'POST',
      headers: {
        'Content-Type' : 'application/json',
        'Authorization': currentSession().authToken
      },
      body: JSON.stringify({
        user: {
          userId: currentSession().userId
        },
        followedUser: {
          userId: sendTo
        },
        message: msgInput.value,
        seen: 0
      })
    })
    .then(res => res.json())
    .then(data => {
      msgInput.value = '';
      loadConversation(sendTo);
    })
    .catch(err => console.log(err))
    
  };
}