"use client";

import { useState } from "react";

export function ContactForm({
  successMessage = "Thanks — your note is saved. I'll get back to you soon.",
  errorMessage = "Could not save your message. Please try again or email me directly.",
}: {
  successMessage?: string;
  errorMessage?: string;
}) {
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  if (sent) {
    return (
      <p className="success" role="status">
        {successMessage}
      </p>
    );
  }

  return (
    <form
      className="form"
      onSubmit={(event) => {
        event.preventDefault();
        try {
          setError("");
          setSent(true);
        } catch {
          setError(errorMessage);
        }
      }}
    >
      {error && <p className="admin-error">{error}</p>}
      <label>
        Name
        <input name="name" required placeholder="Your name" />
      </label>
      <label>
        Email
        <input name="email" type="email" required placeholder="you@company.com" />
      </label>
      <label>
        What do you need?
        <select name="need" defaultValue="Unity development">
          <option>Unity development</option>
          <option>Unreal Engine</option>
          <option>AI / ML / computer vision</option>
          <option>XR — AR / VR</option>
          <option>3D visualization</option>
          <option>Not sure yet</option>
        </select>
      </label>
      <label>
        Project note
        <textarea
          name="note"
          rows={5}
          required
          placeholder="Timeline, platform, references, and where it will ship."
        />
      </label>
      <button className="pill solid" type="submit">
        Send note
      </button>
    </form>
  );
}
