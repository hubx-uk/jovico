// app/main/terms/page.tsx
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Terms of Service" };

export default function TermsPage() {
  return (
    <>
      <section className="pt-32 pb-12 bg-slate-950">
        <div className="jv-container max-w-3xl">
          <h1 className="text-4xl font-extrabold text-white mb-3">Terms of Service</h1>
          <p className="text-slate-400">Last updated: November 2024</p>
        </div>
      </section>
      <section className="jv-section bg-white">
        <div className="jv-container max-w-3xl prose prose-slate max-w-none">
          <h2>1. Acceptance of Terms</h2>
          <p>By using the Jovico Bikes website or purchasing from us, you agree to these Terms of Service. If you do not agree, please do not use our services.</p>

          <h2>2. Products and Pricing</h2>
          <p>All prices are listed in Nigerian Naira (₦). We reserve the right to change prices at any time. Product availability is subject to stock levels. Images are for illustration purposes; actual product appearance may vary slightly.</p>

          <h2>3. Orders and Payment</h2>
          <p>Orders are confirmed upon receipt of full payment. We accept bank transfer, POS payment at our showroom, and online card payment. Jovico Bikes reserves the right to cancel orders due to pricing errors or fraud detection.</p>

          <h2>4. Warranty</h2>
          <p>All Jovico bikes come with a 12-month warranty covering manufacturing defects in the frame, motor, and battery. The warranty does not cover damage from accidents, misuse, or normal wear and tear.</p>

          <h2>5. Returns and Refunds</h2>
          <p>Bikes may be returned within 7 days of purchase if they have a manufacturing defect. Items must be in original condition. Accessories may be returned within 14 days if unused and in original packaging. Refunds are processed within 5-10 business days.</p>

          <h2>6. Service Terms</h2>
          <p>Service bookings must be cancelled at least 24 hours in advance. Jovico Bikes is not liable for pre-existing damage found during servicing. A diagnostic fee applies if you choose not to proceed with recommended repairs.</p>

          <h2>7. Limitation of Liability</h2>
          <p>Jovico Bikes is not liable for any indirect, incidental, or consequential damages arising from the use of our products or services beyond the purchase price of the relevant product.</p>

          <h2>8. Governing Law</h2>
          <p>These terms are governed by the laws of the Federal Republic of Nigeria. Disputes shall be resolved in the courts of Lagos State.</p>

          <h2>9. Contact</h2>
          <p>For any questions about these terms, contact us at <a href="mailto:hello@jovicobikes.com">hello@jovicobikes.com</a>.</p>
        </div>
      </section>
    </>
  );
}
