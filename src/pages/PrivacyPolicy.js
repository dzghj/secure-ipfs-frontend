import React from "react";
import { Link } from "react-router-dom";

const LAST_UPDATED = "October 13, 2026";

function Section({ title, children }) {
  return (
    <section className="mb-8">
      <h2 className="text-lg font-semibold text-white mb-3">{title}</h2>
      <div className="text-gray-400 text-sm leading-relaxed space-y-3">{children}</div>
    </section>
  );
}

export default function PrivacyPolicy() {
  return (
    <div className="w-full max-w-3xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold text-white mb-2">Privacy Policy</h1>
      <p className="text-gray-500 text-sm mb-10">Last updated: {LAST_UPDATED}</p>

      <Section title="1. Who we are">
        <p>
          ShadowVault is a product of SealKeep Technology Inc. ("SealKeep", "we", "us"). This
          policy explains what we collect, how we use it, and who can access it.
        </p>
      </Section>

      <Section title="2. Information we collect">
        <p>
          <strong className="text-gray-300">Account information:</strong> your email address and
          phone number (used to send login verification codes and account notices), and a hashed
          — never plaintext — copy of your password.
        </p>
        <p>
          <strong className="text-gray-300">Your files:</strong> the documents you upload, and the
          category/folder names you give them. Files are encrypted before being stored (see
          Section 4).
        </p>
        <p>
          <strong className="text-gray-300">Legacy Contact information:</strong> the name, email,
          phone, and access level of anyone you designate as a Legacy Contact.
        </p>
        <p>
          <strong className="text-gray-300">Access logs:</strong> a record of actions like uploads,
          views, downloads, and deletions, including a timestamp and the acting account — kept for
          security and support purposes.
        </p>
      </Section>

      <Section title="3. How your files are actually protected">
        <p>
          Each file is encrypted with AES-256-GCM using its own random key before it's stored. This
          is <strong className="text-gray-300">not a zero-knowledge system</strong>: SealKeep can
          decrypt your own files on your behalf (for example, when you click "View"), and will do
          the same for a Legacy Contact once access has been released to them. We do not have a
          standing practice of accessing your files outside of those actions you or your Legacy
          Contacts take.
        </p>
        <p>
          Each file's cryptographic hash — not the file, and not its contents — is separately
          submitted to OpenTimestamps and anchored to the Bitcoin blockchain, so its existence and
          integrity at a point in time can be independently verified later.
        </p>
      </Section>

      <Section title="4. Who can access your information">
        <p>
          You; any Legacy Contact you've designated, once access has been released to them under
          your Continuity Check-In settings; and SealKeep personnel, on a limited basis, to operate
          the Service, respond to support requests, or comply with a legal obligation.
        </p>
      </Section>

      <Section title="5. Third parties we rely on">
        <p>
          We use third-party providers to operate the Service: a hosting/database provider, Resend
          (email delivery), Twilio (SMS delivery), and the public OpenTimestamps calendar servers
          (receive only a file's hash, never its content). Each handles only what's needed to
          provide its specific function.
        </p>
      </Section>

      <Section title="6. Data retention and deletion">
        <p>
          Deleting a file is permanent: its encryption key is destroyed immediately and cannot be
          recovered by you or by us. There is no trash, backup, or undo. Deleting your account
          removes your account information; you should delete any files you want gone first.
        </p>
      </Section>

      <Section title="7. Your choices">
        <p>
          You can view, update, or delete your files and account information at any time from
          within the app. If you need help with a request you can't complete yourself, contact us
          through the 24/7 support chat.
        </p>
      </Section>

      <Section title="8. Security">
        <p>
          We use encryption, access controls, and two-factor login verification to help protect
          your account and documents. No system is perfectly secure, and we can't guarantee
          absolute security.
        </p>
      </Section>

      <Section title="9. Changes to this policy">
        <p>
          We may update this policy from time to time. We'll change the "Last updated" date above
          when we do.
        </p>
      </Section>

      <Section title="10. Contact">
        <p>
          Questions about this policy can be sent through the 24/7 support chat in the app, or to
          the contact address on file for SealKeep Technology Inc.
        </p>
      </Section>

      <div className="mt-12 text-center">
        <Link to="/" className="text-primary hover:text-primary-dark transition text-sm">
          ← Back to ShadowVault
        </Link>
      </div>
    </div>
  );
}
