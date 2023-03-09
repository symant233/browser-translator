import browser from 'webextension-polyfill'

browser.runtime.onMessage.addListener(function (request) {
    if (typeof chrome !== 'undefined') {
        if (request.type === 'speak') {
            chrome.tts.speak(request.text, {
                onEvent: function (event) {
                    if (
                        event.type === 'end' ||
                        event.type === 'interrupted' ||
                        event.type === 'cancelled' ||
                        event.type === 'error'
                    ) {
                        browser.runtime.sendMessage({ type: 'speakDone' })
                    }
                },
            })
        } else if (request.type === 'stopSpeaking') {
            chrome.tts.stop()
        }
    }
})

chrome.contextMenus.create(
    {
        id: 'open-translator',
        type: 'normal',
        title: 'OpenAI Translator',
        contexts: ['page'],
    },
    () => {
        chrome.runtime.lastError
    }
)
chrome.contextMenus.onClicked.addListener(function (info, tab) {
    if (tab?.id) {
        chrome.tabs.sendMessage(tab.id, {
            type: 'open-translator',
            info,
            tab,
        })
    }
})
