import registerCustomElement from 'preact-custom-element'
import { ClickToCall } from './preact'

interface CustomWindow extends Window {
  c2c: object
}

declare const window: CustomWindow

interface C2CConfig {
  [key: string]: string | undefined
}

window.c2c = (function(document): object {
  const requiredParams = ['uri', 'user', 'password', 'socket', 'callto']
  const currentScript = document.currentScript

  function attach(dataset: C2CConfig): void {
    // Skip rendering if button is already attached
    if (document.querySelector('x-clicktocall')) return

    if (!dataset || dataset.constructor.name !== 'Object') return

    // Check dataset contains all required params
    if (requiredParams.every(key => dataset[key] !== undefined)) {
      registerCustomElement(ClickToCall, 'x-clicktocall')
      const ctc = document.createElement('x-clicktocall')
      Object.entries(dataset).forEach(([key, value]) => value && ctc.setAttribute(key, value))
      document.body.appendChild(ctc)
    } else {
      console.log(
        `[C2C] You need to provide all required parameters: ${requiredParams.join(
          ','
        )}. Add data attributes to script or use c2c.init() function.`
      )
    }
  }

  if (currentScript !== null && currentScript.dataset) {
    if (Object.keys(currentScript.dataset).length) {
      // Try to attach with provided data attributes
      attach(currentScript.dataset)
    }
  }

  return {
    init: (config: C2CConfig): void => attach(config)
  }
})(document)
