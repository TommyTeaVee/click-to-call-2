import registerCustomElement from 'preact-custom-element'
import { ClickToCall } from './preact'

// Browser IIFE
;(function(document): void {
  const currentScript = document.currentScript

  const isMobile = (): boolean => /Mobi|Android/i.test(navigator.userAgent)
  const isWebRTCSupported = (): boolean =>
    ['RTCPeerConnection', 'webkitRTCPeerConnection', 'mozRTCPeerConnection', 'RTCIceGatherer'].some(
      item => item in window
    )

  if (!isWebRTCSupported() || isMobile()) {
    return console.error(
      '[C2C] WebRTC is not supported in your browser or you are using a mobile version of browser'
    )
  }

  // Skip rendering if button is already attached
  if (!document.querySelector('x-clicktocall')) {
    registerCustomElement(ClickToCall, 'x-clicktocall')
    const ctc = document.createElement('x-clicktocall')

    if (currentScript && currentScript.dataset) {
      const attributes = Object.entries(currentScript.dataset)

      if (attributes.length) {
        attributes.forEach(([key, value]) => value && ctc.setAttribute(key, value))
      }
    }

    document.body.appendChild(ctc)
  }
})(document)
