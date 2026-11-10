/* Contact form.
   With a Web3Forms access key in data-access-key, notes are sent straight to
   hello@scottchanatry.com. Without one, the visitor's email app opens with
   the note filled in. */

const form = document.getElementById("contactForm");

if (form) {
  const status = form.querySelector(".form-status");
  const button = form.querySelector("button[type=submit]");
  const TO = "hello@scottchanatry.com";

  form.addEventListener("submit", async e => {
    e.preventDefault();
    if (!form.reportValidity()) return;

    const data = new FormData(form);
    if (data.get("botcheck")) return;            // bots tick hidden boxes
    const name = data.get("name").trim();
    const email = data.get("email").trim();
    const message = data.get("message").trim();
    const key = (form.dataset.accessKey || "").trim();

    if (!key) {
      const body = `${message}\n\n— ${name} (${email})`;
      location.href = `mailto:${TO}?subject=${encodeURIComponent("Hello from " + name)}` +
                      `&body=${encodeURIComponent(body)}`;
      status.textContent = "Your email app should open with your note ready to send.";
      return;
    }

    button.disabled = true;
    status.textContent = "Sending…";
    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          access_key: key,
          subject: `New note from ${name} via scottchanatry.com`,
          from_name: "scottchanatry.com",
          name, email, message, replyto: email
        })
      });
      const out = await res.json();
      if (!out.success) throw new Error(out.message || "send failed");
      form.reset();
      status.textContent = "Thanks — your note is on its way.";
    } catch {
      status.textContent = `That didn’t go through. Please email ${TO} directly.`;
    } finally {
      button.disabled = false;
    }
  });
}
