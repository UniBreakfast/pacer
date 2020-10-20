const style = document.createElement('style')

style.innerHTML = /* css */ `

  .Toaster-glass {
    z-index: 999;
    pointer-events: none;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
  }

  .Toaster-toast {
    pointer-events: all;
    background: #ddd;
    position: absolute;
    padding: 7px 18px;
    transition: .5s;
    max-width: var(--width);
    box-sizing: border-box;
    animation: toast-fly-in .5s ease-out;
    --offset: 5px;
  }

  .fleeing {
    animation: toast-fly-out .8s ease-in;
  }

  .placed.fleeing {
    animation: placed-toast-fly-out .8s ease-in;
  }

  .toast-close {
    position: absolute;
    background: none;
    border: none;
    font-size: 20px;
    height: 10px;
    padding: 0;
    cursor: pointer;
    outline: none;
    line-height: 0;
    overflow: hidden;
    --offset: 3px;
    top: var(--offset);
    left: var(--offset);
    right: var(--offset);
    bottom: var(--offset);
  }

  .toast-close:hover, .toast-close:focus {
    color: red;
  }

  @keyframes toast-fly-in {
    from { transform: var(--translate-in) }
  }

  @keyframes toast-fly-out {
    to { transform: var(--translate-out) }
  }

  @keyframes placed-toast-fly-out {
    to { transform: var(--placed-translate-out) }
  }
`

document.head.append(style)
