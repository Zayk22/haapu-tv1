export default function FAQPage() {
  const faqs = [
    {
      q: "What is Haapu TV?",
      a: "Haapu TV is a free, community-supported, family-friendly streaming platform offering exceptional movies, TV shows, and documentaries for all ages.\n\nIn the future, Haapu TV will also offer Haapu Original productions, with content selected and refined by Covenant Members to inspire, uplift, and unite audiences through meaningful storytelling."
    },
    {
      q: "How much does Haapu TV cost?",
      a: "Haapu TV is completely free to watch. No payment or credit card is required.\n\nYou can support the platform by:\n• Becoming a Covenant Member\n• Investing in Haapu TV\n• Using the 'Pay As You Like' option\n\nWhile all content will eventually become free for everyone, Covenant Members receive early access to new movies and TV shows during an exclusive release window."
    },
    {
      q: "How is Haapu TV able to offer free streaming?",
      a: "Haapu TV is funded through:\n• Covenant Members\n• Pay As You Like contributions\n• Sponsorships\n\nThis support allows Haapu TV to continue providing inspiring, family-friendly entertainment at no cost to viewers."
    },
    {
      q: "What can I watch on Haapu TV?",
      a: "Haapu TV offers:\n• Movies\n• TV Series\n• Documentaries\n• Original productions\n• Comedy shows\n• Live music events\n\nNew content is added regularly. Covenant Members also have the opportunity to influence which films and shows are added to the platform."
    },
    {
      q: "What is Covenant Membership?",
      a: "Covenant Membership is a way to support Haapu TV while gaining exclusive benefits. Members get early access to new content and help shape what's added to the platform."
    },
    {
      q: "How do I become a Covenant Member?",
      a: "You can sign up through the Haapu TV website. Details will be announced soon."
    },
    {
      q: "Can I watch Haapu TV outside Nigeria?",
      a: "Yes, Haapu TV is available globally. Content is accessible anywhere with an internet connection."
    },
    {
      q: "What devices are supported?",
      a: "Haapu TV works on all modern browsers, smartphones, tablets, and smart TVs. A full list of supported devices is available on our Supported Devices page."
    },
    {
      q: "How can I submit my film to Haapu TV?",
      a: "For content submissions, please contact us through the website with details about your film or show."
    },
    {
      q: "How do I contact support?",
      a: "Visit our Contact Us page for support inquiries, partnership opportunities, or general questions."
    }
  ];

  return (
    <main className="min-h-screen pt-24">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-12">
        <h1 className="font-display text-display text-white">FAQ</h1>
        <p className="mt-2 text-body-lg text-matte-500">
          Frequently asked questions about Haapu TV.
        </p>

        <div className="mt-8 space-y-6">
          {faqs.map((faq, index) => (
            <div key={index} className="border-b border-matte-800 pb-6 last:border-0">
              <h3 className="font-semibold text-white">{faq.q}</h3>
              <p className="mt-1 whitespace-pre-line text-matte-400">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}