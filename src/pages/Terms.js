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

export default function Terms() {
  return (
    <div className="w-full max-w-3xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold text-white mb-2">Terms of Service</h1>
      <p className="text-gray-500 text-sm mb-10">Last updated: {LAST_UPDATED}</p>

      <Section title="1. Who we are">
        <p>
          ShadowVault is a product of SealKeep Technology Inc. ("SealKeep", "we", "us"). These
          Terms govern your use of ShadowVault (the "Service"). By creating an account you agree
          to these Terms.
        </p>
      </Section>

      <Section title="2. What the Service does">
        <p>
          ShadowVault lets you upload documents, which are encrypted and stored, and lets you
          designate "Legacy Contacts" who can be granted access to some or all of your documents
          if you stop checking in for a period of time you choose (the "Continuity Check-In").
        </p>
        <p>
          Each uploaded file's cryptographic hash is submitted to OpenTimestamps, which anchors it
          to the Bitcoin blockchain. This lets anyone later verify that a specific file existed and
          was unaltered as of a specific time — only the hash is submitted, never the file itself
          or its contents.
        </p>
      </Section>

      <Section title="3. Your account">
        <p>
          You must provide an accurate email address and phone number to register. You're
          responsible for keeping your login credentials and verification codes confidential, and
          for all activity under your account. Tell us immediately if you suspect unauthorized
          access.
        </p>
      </Section>

      <Section title="4. Legacy Contacts and the Continuity Check-In">
        <p>
          You control who your Legacy Contacts are and what they can access (all documents, or
          only specific categories). If you don't log in within your chosen check-in interval,
          access is released to your Legacy Contacts automatically, at the access level you
          assigned — this is not reversible once triggered, and there is no separate approval step
          beyond the interval you set. You are solely responsible for choosing an interval and
          Legacy Contacts appropriate to your situation.
        </p>
      </Section>

      <Section title="5. Acceptable use">
        <p>
          You agree not to use the Service to store or share content you don't have the legal right
          to store, to attempt to disrupt or gain unauthorized access to the Service, or to use the
          Service in a way that violates applicable law.
        </p>
      </Section>

      <Section title="6. Deletion is permanent">
        <p>
          Deleting a file is final. Once deleted, there is no trash, backup, or recovery path — the
          file's encryption key is destroyed and cannot be recovered by you, by us, or by anyone
          else. Delete only what you're certain you no longer need.
        </p>
      </Section>

      <Section title="7. Service availability">
        <p>
          We aim to keep the Service available but don't guarantee uninterrupted access. The
          Service is provided "as is" and "as available," without warranties of any kind, to the
          fullest extent permitted by law.
        </p>
      </Section>

      <Section title="8. Limitation of liability">
        <p>
          To the fullest extent permitted by law, SealKeep Technology Inc. is not liable for
          indirect, incidental, or consequential damages arising from your use of the Service,
          including loss of access to documents due to a missed check-in, account compromise, or
          deletion.
        </p>
      </Section>

      <Section title="9. Changes to these Terms">
        <p>
          We may update these Terms from time to time. Continued use of the Service after a change
          takes effect means you accept the updated Terms.
        </p>
      </Section>

      <Section title="10. Contact">
        <p>
          Questions about these Terms can be sent through the 24/7 support chat in the app, or to
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
