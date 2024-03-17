chrome.commands.onCommand.addListener(command => {
  console.log('got command:', command)
  if (command === "copy_epoch_time") {
    console.log('copy_epoch_time rcvd') // chrome://extensions > Epoch Time Copier > click service worker link to see console log output
    chrome.tabs.query({active: true, currentWindow: true}, tabs => {
      const tab = tabs[0] // this is always the active tab
      chrome.scripting.executeScript({
        target: {tabId: tab.id},
        function: copyEpochTimeToClipboard
      })
    })    
  }
})

// Epoch time is one way to say it, another way to say it is unix time. I like epoch for some reason, sounds important.
function copyEpochTimeToClipboard() {
  const epochTime = Math.floor(Date.now() / 1000).toString()
  navigator.clipboard.writeText(epochTime) // the actual copying
    .then(() => { 
      console.log('Copied epoch time to clipboard: ', epochTime)
      // A little subtle time limited notification to let the user know the time was copied
      const notification = document.createElement('div')
      notification.textContent = `copied ${epochTime}`
      notification.style = 'position: fixed; top: 10px; right: 10px; font-size: 12px; background-color: black; color: white; padding: 8px; z-index: 777; transition: opacity 2s ease;'
      document.body.appendChild(notification)
      // fade
      setTimeout(() => {
        notification.style.opacity = '0'
        // rm elem after transition
        setTimeout(() => notification.remove(), 2000)
      }, 2000)
    })
    .catch(err => console.error('Failed to copy epoch time: ', err))
}
