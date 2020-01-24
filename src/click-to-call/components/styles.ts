import { injectGlobal, css, keyframes } from 'emotion'

import icomoonTtf from '../icomoon/fonts/icomoon.ttf'
import icomoonWoff from '../icomoon/fonts/icomoon.woff'
import icomoonSvg from '../icomoon/fonts/icomoon.svg'

const BUTTON_DIAMETER = '65px'

injectGlobal`
  @font-face {
  font-family: 'icomoon';
  src:
  url('${icomoonTtf}') format('truetype'),
    url('${icomoonWoff}') format('woff'),
    url('${icomoonSvg}') format('svg');
  font-weight: normal;
  font-style: normal;
  font-display: block;
}

.icon {
  /* use !important to prevent issues with browser extensions that change fonts */
  font-family: 'icomoon' !important;
  speak: none;
  font-style: normal;
  font-weight: normal;
  font-variant: normal;
  text-transform: none;
  line-height: 1;
  
  /* Enable Ligatures ================ */
  letter-spacing: 0;
  -webkit-font-feature-settings: "liga";
  -moz-font-feature-settings: "liga=1";
  -moz-font-feature-settings: "liga";
  -ms-font-feature-settings: "liga" 1;
  font-feature-settings: "liga";
  -webkit-font-variant-ligatures: discretionary-ligatures;
  font-variant-ligatures: discretionary-ligatures;

  /* Better Font Rendering =========== */
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.iconphone-call:before {
  content: "\e900";
}
.iconphone-missed:before {
  content: "\e901";
}
`

const bounceAnimation = keyframes`
  from, 20%, 53%, 80%, to {
    transform: translate3d(0,0,0);
  }
  40%, 43% {
    transform: translate3d(0, -30px, 0);
  }
  70% {
    transform: translate3d(0, -15px, 0);
  }
  90% {
    transform: translate3d(0,-4px,0);
  }
`

const waveAnimation = keyframes`
{
  0% {
    transform: scale(1);
    opacity: 1;
  }
  100% {
    transform: scale(1.3);
    opacity: 0;
  }
}
`

const spinAnimation = keyframes`
    0% {
        -webkit-transform: rotate(-1turn);
        transform: rotate(-1turn)
    }
    to {
        -webkit-transform: rotate(0);
        transform: rotate(0)
    }
`

const shakeAnimation = keyframes`
  10%, 90% {
    transform: translate3d(-1px, 0, 0);
  }
  
  20%, 80% {
    transform: translate3d(2px, 0, 0);
  }

  30%, 50%, 70% {
    transform: translate3d(-4px, 0, 0);
  }

  40%, 60% {
    transform: translate3d(4px, 0, 0);
  }
}
`

const callButtonStyles = {
  createCallButtonClass: (color: string, position: string): string => css`
    position: fixed;
    display: flex;
    align-items: center;
    justify-content: center;
    height: ${BUTTON_DIAMETER};
    width: ${BUTTON_DIAMETER};
    bottom: 50px;
    ${position === 'left' ? 'left: 50px;' : 'right: 50px;'}
    border-radius: 50%;
    background-color: ${color};
    box-shadow: 0 1px 10px 3px rgba(0, 0, 0, 0.1);
    transition: all 0.2s ease-in-out;
    animation: ${bounceAnimation} 1s ease-in,
      ${shakeAnimation} 0.82s cubic-bezier(0.36, 0.07, 0.19, 0.97) 1.5s alternate;
    transform: translate3d(0, 0, 0);
    backface-visibility: hidden;
    perspective: 1000px;
    cursor: pointer;
    z-index: 999;

    &:hover {
      box-shadow: 0 0px 6px 3px rgba(0, 0, 0, 0.2);
    }
    & > .icon {
      z-index: 2;
      font-size: 1.5rem;
      color: #fff;
    }

    & > .answered-wave {
      position: absolute;
      background-color: #f65b5f;
      height: ${BUTTON_DIAMETER};
      width: ${BUTTON_DIAMETER};
      top: 0;
      left: 0;
      z-index: 1;
      border-radius: 100%;
      animation: ${waveAnimation} 3s ease-in-out infinite;
    }

    /* States */
    &.disabled {
      pointer-events: none;
      opacity: 0.4;
    }
    &.hangup {
      background-color: #f65b5f;
    }
    &.ringing {
      &::after {
        content: '';
        position: absolute;
        height: ${BUTTON_DIAMETER};
        width: ${BUTTON_DIAMETER};
        border-radius: 100%;
        border: 3px solid red;
        border-top: 3px solid white;
        animation: ${spinAnimation} 1.5s linear infinite;
      }
    }
    &.ended {
      pointer-events: none;
      opacity: 0.4;
      background-color: #f65b5f;
    }

    & > .speech-buble {
      position: absolute;
      z-index: 3;
      bottom: calc(100% + 12px);
      ${position === 'left' ? 'left: calc(50% - 30px);' : 'right: calc(50% - 30px);'}
      background-color: #fff;
      margin: 0;
      padding: 1rem;
      border-radius: 1rem;
      font-family: inherit;
      font-size: 1rem;
      box-shadow: 0 0.125rem 0.5rem rgba(0, 0, 0, 0.3), 0 0.0625rem 0.125rem rgba(0, 0, 0, 0.2);
      white-space: nowrap;

      &::before {
        content: '';
        position: absolute;
        height: 0;
        width: 0;
        border: 10px solid transparent;
        border-top-color: #fff;
        border-bottom: 0;
        ${position === 'left' ? 'left: 20px;' : 'right: 20px;'}
        bottom: 0px;
        transform: translateY(90%);
        filter: drop-shadow(0 0.125rem 0.0625rem rgba(0, 0, 0, 0.2));
      }
    }
  `
}

export { callButtonStyles }
