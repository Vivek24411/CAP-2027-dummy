// Opens Gmail's compose window (in the browser) with the address already filled in.
// Visitors who aren't signed in to Gmail are asked to sign in first.
export function gmailComposeUrl(email: string) {
  return `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(email)}`;
}

// "+91 9777160704" → "tel:+919777160704"
export function telHref(phone: string) {
  return `tel:${phone.replace(/[^\d+]/g, "")}`;
}
