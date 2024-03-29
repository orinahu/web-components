class Modal extends HTMLElement {
  constructor() {
    super();
    this.isOpen = false;
    this.attachShadow({ mode: "open" });
    this.shadowRoot.innerHTML = `
          <style>
            #backdrop {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0,0,0,0.75);
                z-index: 10;
                opacity: 0;
                pointer-events: none;
            }

            :host([opened]) #backdrop,
            :host([opened]) #modal {
              opacity: 1;
              pointer-events: all;
            }

            :host([opened]) #modal {
              top: 15vh;
            }
            
          
            #modal {
                position: fixed;
                top: 10vh;
                left: 25%;
                width: 50%;
                z-index: 100;
                background: white;
                border-radius: 5px;
                box-shadow: 0 2px 8px rgba(0,0,0,0.26);
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                opacity: 0;
                pointer-events: none;
                transition: all 0.3s ease-out;
            }

            #actions {
                border-top: 1px solid #ccc;
                padding: 1rem;
                display: flex;
                justify-content: flex-end;
                align-items: center;
            }

            #actions button {
                margin: 0 0.5rem;
            }

            header {
               padding: 0.5rem;
               border-bottom: 1px solid #ccc;
            }

            slot[name="title"] {
                font-size: 1rem;
                margin: 0;
            }

            #main {
                padding: 0.5rem;
            }

          </style>


          <div id="backdrop"></div>
          <div id="modal">
            <header>
              <slot name="title">Header</slot>
            </header>
            <section id="main">
              <slot></slot>
            </section>
            <section id="actions">
              <button id="cancel-btn">Cancel</button>
              <button id="confirm-btn">Action</button>
            <section>
          </div>
        `;

    // const slots = this.shadowRoot.querySelectorAll("slot");
    // slots[1].addEventListener("slotchange", (event) => {
    //   console.dir(slots[1].assignedNodes());
    // });

    const backdrop = this.shadowRoot.querySelector("#backdrop");
    const cancelButton = this.shadowRoot.querySelector("#cancel-btn");
    const confirmButton = this.shadowRoot.querySelector("#confirm-btn");

    this.backdrop = backdrop.addEventListener("click", this._cancel);
    this.cancelButton = cancelButton.addEventListener("click", this._cancel);
    this.confirmButton = confirmButton.addEventListener("click", this._confirm);
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (this.hasAttribute("opened")) {
      this.isOpen = true;
    } else {
      this.isOpen = false;
    }
  }

  static get observedAttributes() {
    return ["text"];
  }

  disconnectedCallback() {
    this.backdrop.removeEventListener("click", this._cancel);
    this.cancelButton.removeEventListener("click", this._cancel);
    this.confirmButton.removeEventListener("click", this._confirm);
  }

  open() {
    this.setAttribute("opened", "");
    this.isOpen = true;
  }

  hide() {
    if (this.hasAttribute("opened")) {
      this.removeAttribute("opened");
    }
    this.isOpen = false;
  }

  _cancel = (event) => {
    this.hide();
    const cancelEvent = new Event("cancel", { bubbles: true, composed: true });
    event.target.dispatchEvent(cancelEvent);
  };

  _confirm = () => {
    this.hide();
    const confirmEvent = new Event("confirm");
    this.dispatchEvent(confirmEvent);
  };
}

customElements.define("uc-modal", Modal);
