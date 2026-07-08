export default function ContactPage() {
  return (
    <main className="min-h-screen pt-24">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-12">
        <h1 className="font-display text-display text-white">Contact Us</h1>
        <p className="mt-2 text-body-lg text-matte-500">
          We'd love to hear from you.
        </p>

        <div className="mt-8 grid gap-8 md:grid-cols-2">
          <div>
            <h3 className="font-semibold text-white">General Enquiries</h3>
            <p className="mt-1 text-matte-400">info@haapu.tv</p>
          </div>
          <div>
            <h3 className="font-semibold text-white">Partnerships & Licensing</h3>
            <p className="mt-1 text-matte-400">partnerships@haapu.tv</p>
          </div>
          <div>
            <h3 className="font-semibold text-white">Support</h3>
            <p className="mt-1 text-matte-400">support@haapu.tv</p>
          </div>
          <div>
            <h3 className="font-semibold text-white">Social Media</h3>
            <div className="mt-1 flex gap-4 text-matte-400">
              <a href="#" className="hover:text-white">Instagram</a>
              <a href="#" className="hover:text-white">Facebook</a>
              <a href="#" className="hover:text-white">X</a>
              <a href="#" className="hover:text-white">TikTok</a>
            </div>
          </div>
        </div>

        <div className="mt-12 rounded-xl border border-matte-800 bg-matte-900 p-6">
          <h3 className="font-semibold text-white">Send us a message</h3>
          <p className="mt-1 text-sm text-matte-400">We'll get back to you within 24 hours.</p>
          {/* Form fields: Name, Email, Subject, Message, Send button */}
        </div>
      </div>
    </main>
  );
}