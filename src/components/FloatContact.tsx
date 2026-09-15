const PHONE = '123456789'

export function FloatContact() {
  return (
    <div className="float-contact" role="group" aria-label="Quick contact">
      <a
        className="float-contact-btn float-contact-btn--whatsapp"
        href={`https://wa.me/${PHONE}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        title="WhatsApp"
        data-cursor="hover"
      >
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path
            fill="currentColor"
            d="M12.04 2C6.58 2 2.15 6.4 2.15 11.83c0 1.74.46 3.45 1.33 4.95L2 22l5.37-1.4a10.02 10.02 0 0 0 4.67 1.16h.01c5.46 0 9.89-4.4 9.89-9.83C21.94 6.4 17.5 2 12.04 2Zm5.83 14.05c-.25.7-1.45 1.28-2.02 1.36-.52.07-1.18.1-1.9-.12-.44-.13-.99-.32-1.71-.63-3.01-1.3-4.97-4.33-5.12-4.53-.15-.2-1.25-1.66-1.25-3.17 0-1.5.79-2.24 1.07-2.55.28-.3.61-.38.82-.38h.59c.19 0 .44-.07.69.53.25.61.85 2.1.93 2.25.07.15.12.33.02.53-.1.2-.15.33-.3.5-.15.18-.31.4-.45.53-.15.15-.3.31-.13.61.17.3.76 1.25 1.63 2.03 1.12 1 2.07 1.31 2.36 1.46.3.15.47.12.64-.07.17-.2.73-.85.93-1.14.2-.3.39-.24.66-.15.27.1 1.71.8 2 .95.3.15.5.22.57.35.08.12.08.71-.17 1.41Z"
          />
        </svg>
      </a>

      <a
        className="float-contact-btn float-contact-btn--call"
        href={`tel:${PHONE}`}
        aria-label="Call 123456789"
        title="Call"
        data-cursor="hover"
      >
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path
            fill="currentColor"
            d="M7.2 3.4c.4-.4 1.1-.5 1.6-.2l2.3 1.4c.5.3.8.9.7 1.5l-.4 2.1c-.1.4.1.8.4 1.1l2.3 2.3c.3.3.7.5 1.1.4l2.1-.4c.6-.1 1.2.2 1.5.7l1.4 2.3c.3.5.2 1.2-.2 1.6l-1.3 1.3c-.4.4-1 .7-1.6.7-3.7-.2-7.2-2-9.8-4.6S3.8 8.9 3.6 5.2c0-.6.3-1.2.7-1.6L7.2 3.4Z"
          />
        </svg>
      </a>
    </div>
  )
}
