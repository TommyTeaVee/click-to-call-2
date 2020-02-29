import registerCustomElement from 'preact-custom-element'
import { ClickToCall } from './preact'

import { C2C, C2CConfig } from './types'

window.c2c = (function(document): C2C {
  const REQUIRED_PARAMS = ['uri', 'user', 'password', 'socket', 'callto']

  const isMobile = (): boolean => /Mobi|Android/i.test(navigator.userAgent)
  const isWebRTCSupported = (): boolean =>
    ['RTCPeerConnection', 'webkitRTCPeerConnection', 'mozRTCPeerConnection', 'RTCIceGatherer'].some(
      item => item in window
    )

  function render(config: C2CConfig): void {
    if (!isWebRTCSupported() || isMobile() || typeof config !== 'object') {
      return console.error(
        '[C2C] WebRTC is not supported in your browser or you are using a mobile version of browser.'
      )
    }

    // Skip rendering if button is already attached
    if (document.querySelector('x-clicktocall')) {
      return console.log('[C2C] Skipping rendering c2c button. Button is already rendered.')
    }

    // Check dataset contains all required params
    if (REQUIRED_PARAMS.every(key => key in config)) {
      window.c2c._config = config
      registerCustomElement(ClickToCall, 'x-clicktocall')

      const c2cElement = document.createElement('x-clicktocall')
      document.body.appendChild(c2cElement)
    } else {
      console.log(
        `[C2C] You need to provide all required parameters: ${REQUIRED_PARAMS.join(
          ','
        )}. Add data attributes to script or use c2c.init() function.`
      )
    }
  }

  return {
    init: (config: C2CConfig): void => {
      if (document.readyState === 'complete') {
        render(config)
      } else {
        document.addEventListener('DOMContentLoaded', () => render(config))
      }
    }
  }
})(document)
