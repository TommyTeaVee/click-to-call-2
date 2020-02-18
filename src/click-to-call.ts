import registerCustomElement from 'preact-custom-element'
import { ClickToCall } from './preact'

interface CustomWindow extends Window {
  c2c: C2C
}

declare const window: CustomWindow

interface C2CConfig {
  [key: string]: string | undefined
}

interface C2C {
  init: (config: C2CConfig) => void
}

window.c2c = (function(document): C2C {
  const REQUIRED_PARAMS = ['uri', 'user', 'password', 'socket', 'callto']
  const currentScript = document.currentScript

  const isMobile = (): boolean => /Mobi|Android/i.test(navigator.userAgent)
  const isWebRTCSupported = (): boolean =>
    ['RTCPeerConnection', 'webkitRTCPeerConnection', 'mozRTCPeerConnection', 'RTCIceGatherer'].some(
      item => item in window
    )

  function render(config: C2CConfig): void {
    if (!isWebRTCSupported() || isMobile() || typeof config !== 'object') {
      return console.error(
        '[C2C] WebRTC is not supported in your browser or you are using a mobile version of browser'
      )
    }

    // Skip rendering if button is already attached
    if (document.querySelector('x-clicktocall')) return

    // Check dataset contains all required params
    if (REQUIRED_PARAMS.every(key => config[key] !== undefined)) {
      registerCustomElement(ClickToCall, 'x-clicktocall')
      const ctc = document.createElement('x-clicktocall')
      Object.entries(config).forEach(([key, value]) => value && ctc.setAttribute(key, value))
      document.body.appendChild(ctc)
    } else {
      console.log(
        `[C2C] You need to provide all required parameters: ${REQUIRED_PARAMS.join(
          ','
        )}. Add data attributes to script or use c2c.init() function.`
      )
    }
  }

  if (currentScript && currentScript.dataset) {
    if (Object.keys(currentScript.dataset).length) {
      // Try to render button with provided data attributes
      render(currentScript.dataset)
    }
  }

  return {
    init: (config: C2CConfig): void => render(config)
  }
})(document)
