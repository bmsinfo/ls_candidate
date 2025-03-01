

const isAvatarSpeaking = false;
const triggerCustomEvent = (eventName, detail) => {
  console.log('### trgigger ###');
  const event = new CustomEvent(eventName, { detail });
  window.dispatchEvent(event);
};

function vh_sceneLoaded() {
  console.log('##### --------- scene loaded ---------- ####');
  // window.setStatus(0, 0, 0, 0); //interrupt mode off (enabling queue)
  window?.setStatus(1, 0, 0, 0); // interrupt mode on
  window.dispatchEvent(new Event('isAvatarSceneLoaded'));
}

function vh_aiResponse(response) {
  console.log('### AI response ###', response);
}

function vh_audioProgress(percentPlayed, portal) {
  console.log('### audio progress ###', { percentPlayed, portal });
}

function vh_talkStarted(portal) {
  console.log('### talk started ###', { portal });
}

function vh_talkEnded(portal) {
  console.log('### talk ended ###', { portal });
}
function vh_audioStarted() {
  console.log('### audio  started ####');
  window.isAvatarSpeaking = true;
  // TODO: here we are going to dispatch an event to the parent window
  // to show the avatar is speaking

  triggerCustomEvent('isAvatarSpeaking', { isAvatarSpeaking: 'SPEAKING' });


}

async function vh_audioEnded() {
 
  window.isAvatarSpeaking = false;
  triggerCustomEvent('isAvatarSpeaking', { isAvatarSpeaking: 'NOT_SPEAKING' });
  // trigger to hide the avatar and show answer box
  // window.dispatchEvent(new Event('handleAvatar'));
 
  // trigger to resolve the promise when 'speak' is called
  window.dispatchEvent(new Event('audioEnded'));
  
}




