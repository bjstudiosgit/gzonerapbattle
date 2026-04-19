import { motion } from "motion/react";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen pt-32 pb-24 bg-zinc-950 text-zinc-300 selection:bg-brand selection:text-black">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl md:text-6xl font-display uppercase text-white mb-8 border-l-8 border-brand pl-6">
            Privacy <span className="text-brand">Policy</span>
          </h1>
          
          <div className="prose prose-invert prose-orange max-w-none space-y-8 text-zinc-400 leading-relaxed">
            <section>
              <h2 className="text-2xl font-display uppercase text-white mb-4">Introduction</h2>
              <p className="mb-6">
                The Gzone Rap Battle (referred to in this policy as “The Gzone,” “we,” or “us”) is committed to respecting and protecting your privacy. This Privacy Policy describes the personal data we collect through our website at gzonerapbattle.co.uk and any related services (together, the “Site”), how we use and share that data, and the rights you have.
              </p>
              <p>
                Our Site promotes UK rap talent and includes features such as MC applications, chat rooms, newsletter sign‑ups and links to ticket and merchandise providers. We process personal data in accordance with the UK General Data Protection Regulation (UK GDPR) and the Data Protection Act 2018. Guidance from the UK Information Commissioner’s Office (ICO) stresses that privacy notices must explain what data is collected, why it is collected, the lawful basis for processing, with whom it is shared, how long it is kept, and how individuals can exercise their rights.
              </p>
              <p className="mt-4 text-sm">
                We do not knowingly collect data from children under 13. If you are under 13, please do not submit any information to us.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-display uppercase text-white mb-4">Who We Are</h2>
              <p className="mb-4">
                The Site is operated by BJStudios, on behalf of The Gzone Rap Battle League and Ginja Entertainment, in association with Peacock Gymnasium.
              </p>
              <p>
                For any data-protection or privacy queries, please complete the Contact Us form on the Site. BJStudios is responsible for all data protection matters relating to this Site.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-display uppercase text-white mb-4">What Personal Data We Collect</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse border border-white/10 rounded-xl overflow-hidden">
                  <thead>
                    <tr className="bg-zinc-900">
                      <th className="p-4 border border-white/10 text-brand uppercase text-xs tracking-widest">Category</th>
                      <th className="p-4 border border-white/10 text-brand uppercase text-xs tracking-widest">Examples</th>
                      <th className="p-4 border border-white/10 text-brand uppercase text-xs tracking-widest">Why we collect it</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="p-4 border border-white/10 font-bold text-white">Identity and contact data</td>
                      <td className="p-4 border border-white/10 text-sm">Name, email address, phone number, city, social media handles, audition video link and short message provided through our MC application form; user name entered to join our chat room; email addresses submitted when you join our mailing list.</td>
                      <td className="p-4 border border-white/10 text-sm">To review MC applications, contact applicants, manage chat participation, send newsletters or event updates, and otherwise communicate with you.</td>
                    </tr>
                    <tr className="bg-white/5">
                      <td className="p-4 border border-white/10 font-bold text-white">Technical data</td>
                      <td className="p-4 border border-white/10 text-sm">Internet Protocol (IP) addresses, device and browser information, cookies and similar technologies.</td>
                      <td className="p-4 border border-white/10 text-sm">For security, analytics and to help the Site function properly and provide a better experience.</td>
                    </tr>
                    <tr>
                      <td className="p-4 border border-white/10 font-bold text-white">Transactional and marketing data</td>
                      <td className="p-4 border border-white/10 text-sm">Purchase details from ticket and merchandise providers, your marketing preferences and any communications you send to us.</td>
                      <td className="p-4 border border-white/10 text-sm">To fulfil orders, manage payments, comply with accounting obligations, and send marketing or service updates.</td>
                    </tr>
                    <tr className="bg-white/5">
                      <td className="p-4 border border-white/10 font-bold text-white">User‑generated content</td>
                      <td className="p-4 border border-white/10 text-sm">Videos or links that you submit when applying to be an MC, comments or chat messages.</td>
                      <td className="p-4 border border-white/10 text-sm">To evaluate applications, host content in our league, and moderate community discussions.</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-display uppercase text-white mb-4">How We Use Your Data and Our Lawful Bases</h2>
              <p className="mb-6">UK GDPR requires that we have a lawful basis for each purpose for which we process your personal data. The table below summarises the purposes and bases.</p>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse border border-white/10 rounded-xl overflow-hidden">
                  <thead>
                    <tr className="bg-zinc-900">
                      <th className="p-4 border border-white/10 text-brand uppercase text-xs tracking-widest">Purpose</th>
                      <th className="p-4 border border-white/10 text-brand uppercase text-xs tracking-widest">Activities</th>
                      <th className="p-4 border border-white/10 text-brand uppercase text-xs tracking-widest">Lawful basis</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="p-4 border border-white/10 font-bold text-white">Reviewing MC applications</td>
                      <td className="p-4 border border-white/10 text-sm">Process identity, contact and user‑generated data to evaluate applications, communicate with applicants, schedule battles and manage the league.</td>
                      <td className="p-4 border border-white/10 text-sm">Legitimate interests in running our MC competition; contract with applicants once accepted.</td>
                    </tr>
                    <tr className="bg-white/5">
                      <td className="p-4 border border-white/10 font-bold text-white">Operating chat rooms</td>
                      <td className="p-4 border border-white/10 text-sm">Use the name you provide to display you in chat and moderate content.</td>
                      <td className="p-4 border border-white/10 text-sm">Legitimate interests in providing interactive services.</td>
                    </tr>
                    <tr>
                      <td className="p-4 border border-white/10 font-bold text-white">Marketing communications</td>
                      <td className="p-4 border border-white/10 text-sm">Use contact data to send news, merchandise information, and event announcements.</td>
                      <td className="p-4 border border-white/10 text-sm">Consent – we only send marketing messages if you have opted in.</td>
                    </tr>
                    <tr className="bg-white/5">
                      <td className="p-4 border border-white/10 font-bold text-white">Events and merchandise</td>
                      <td className="p-4 border border-white/10 text-sm">Process order details to deliver event tickets and merchandise.</td>
                      <td className="p-4 border border-white/10 text-sm">Contract – to fulfil your purchase.</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-display uppercase text-white mb-4">Cookies and Analytics</h2>
              <p>
                We use cookies and similar technologies to operate our website, remember your preferences, measure usage and improve performance. In particular, we use Google Analytics to collect and analyse information about how visitors use the Site. This service uses cookies and similar technologies and may also collect information about the use of other websites, apps and online services.
              </p>
              <p className="mt-4">
                We also embed videos from YouTube, which is owned by Google; YouTube collects watch and search history, IP address, geolocation and device identifiers and sets cookies. Embedding videos may therefore share your data with YouTube, so we list Google as a third‑party service provider in this notice. Where possible we use YouTube’s privacy‑enhanced mode and block video playback until you provide cookie consent.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-display uppercase text-white mb-4">Sharing Your Data</h2>
              <p>We never sell your personal data. We may share it with:</p>
              <ul className="list-disc pl-6 space-y-4">
                <li>
                  <strong>Service providers:</strong> Companies that help us run the Site. These include:
                  <ul className="list-circle pl-6 mt-2 space-y-1 text-sm">
                    <li><strong>123 Reg:</strong> Domain management and DNS services.</li>
                    <li><strong>Vercel:</strong> Website hosting and deployment.</li>
                    <li><strong>Supabase:</strong> Database and authentication platform.</li>
                    <li><strong>Google Analytics:</strong> Traffic and trend analysis.</li>
                    <li><strong>YouTube (Google):</strong> Video hosting and embedded content.</li>
                  </ul>
                </li>
                <li><strong>Third‑party platforms for transactions:</strong> Ticket sales via Eventbrite and merchandise via our payment providers.</li>
                <li><strong>Social media platforms:</strong> If you choose to share links or sign in via third‑party services.</li>
                <li><strong>Professional advisers and legal authorities:</strong> Where required to comply with legal obligations.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-display uppercase text-white mb-4">Retention of Data</h2>
              <p>We only retain personal data for as long as necessary to fulfil the purposes described in this policy. In general:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>MC application data is kept while we assess your application and during your time on our roster.</li>
                <li>Chat names and messages are retained as needed for moderation.</li>
                <li>Mailing list data is kept until you unsubscribe.</li>
                <li>Order information is retained for the period required by tax or accounting laws (usually six years).</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-display uppercase text-white mb-4">Security Measures</h2>
              <p>
                We have implemented appropriate technical and organisational measures to protect personal data. These include risk assessment, access controls, encryption, secure hosting, and staff training. We use HTTPS to encrypt communications to and from the Site. While we work hard to protect your data, no internet‑based system can be completely secure.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-display uppercase text-white mb-4">Your Rights</h2>
              <p>Under UK GDPR you have the following rights:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Right to be informed about how we use your data.</li>
                <li>Right of access to your personal data.</li>
                <li>Right to rectification of inaccurate data.</li>
                <li>Right to erasure (“right to be forgotten”).</li>
                <li>Right to restrict or object to processing.</li>
                <li>Right to data portability.</li>
              </ul>
              <p className="mt-4">
                To exercise any of these rights, please contact us. You also have the right to lodge a complaint with the Information Commissioner’s Office (ICO) at <a href="https://ico.org.uk" target="_blank" rel="noopener noreferrer" className="text-brand hover:underline">ico.org.uk</a>.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-display uppercase text-white mb-4">Contact Us</h2>
              <p>
                If you have any questions about this Privacy Policy or wish to exercise your rights, please complete our contact form on the Site. We monitor submissions regularly and will respond to your request within one month, as required by data‑protection law.
              </p>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
