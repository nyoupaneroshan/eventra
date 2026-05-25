import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST() {
  try {
    // Seed Hero Slides
    const existingSlides = await db.heroSlide.count();
    if (existingSlides === 0) {
      await db.heroSlide.createMany({
        data: [
          { title: 'We Plan, You Celebrate', subtitle: 'Professional event planning services in Nepal for weddings, corporate events, and private parties.', image: '/hero1.png', order: 0 },
          { title: 'Crafting Unforgettable Moments', subtitle: 'From concept to execution, we handle every detail so you can focus on what matters most — celebrating.', image: '/hero2.png', order: 1 },
          { title: 'Your Vision, Our Expertise', subtitle: 'Turning your ideas into extraordinary experiences with creativity, precision, and passion.', image: '/hero3.png', order: 2 },
        ],
      });
    }

    // Seed About Content
    const existingAbout = await db.aboutContent.count();
    if (existingAbout === 0) {
      await db.aboutContent.create({
        data: {
          sectionTitle: 'Passionate Event Planners Based in Butwal',
          subtitle: 'We are a dedicated team of event enthusiasts committed to making every celebration smooth, beautiful, memorable, and stress-free.',
          description: 'At Eventra, we believe that every celebration deserves to be extraordinary. Based in the heart of Butwal, our passionate team has been transforming ordinary spaces into breathtaking experiences. Whether it is an intimate wedding, a grand corporate gala, or a joyful private party, we pour our hearts into every detail.|||Our approach is simple yet thorough — we listen to your vision, understand your style, and bring it to life with precision and creativity. From venue selection and decoration to catering coordination and on-site management, we handle it all so you can focus on what truly matters: celebrating with the people you love.',
          features: JSON.stringify([
            { icon: 'Heart', title: 'Attention to Detail', description: 'Every element is carefully considered, from table settings to lighting, ensuring nothing is overlooked.' },
            { icon: 'Palette', title: 'Creative Design', description: 'We bring fresh, innovative ideas to every event, crafting unique themes and atmospheres that leave lasting impressions.' },
            { icon: 'MapPin', title: 'Venue Selection', description: 'Access to the finest venues in and around Butwal, handpicked to match your event style and guest count perfectly.' },
            { icon: 'Sparkles', title: 'Full Coordination', description: 'From decoration to catering, we manage every vendor and detail so you can relax and enjoy your celebration.' },
          ]),
          image1: '/about1.png',
          image2: '/about2.png',
          image3: '/about3.png',
        },
      });
    }

    // Seed Services
    const existingServices = await db.service.count();
    if (existingServices === 0) {
      await db.service.createMany({
        data: [
          {
            title: 'Wedding Planning',
            description: 'Your dream wedding deserves nothing but perfection. Our team specializes in creating magical wedding experiences that reflect your unique love story, from intimate ceremonies to grand celebrations.',
            icon: 'Heart',
            image: '/wedding.png',
            features: JSON.stringify(['Venue selection & booking', 'Decoration & theme setup', 'Catering coordination', 'Full event management', 'Photography coordination', 'Guest management']),
            order: 0,
          },
          {
            title: 'Corporate Events',
            description: 'Elevate your brand with professionally organized corporate events. We handle every detail from technical setup to guest experience, ensuring your business events leave a lasting impression on attendees.',
            icon: 'Building2',
            image: '/corporate.png',
            features: JSON.stringify(['Conferences & seminars', 'Product launches', 'Team building events', 'Award ceremonies', 'Brand activations', 'Corporate galas']),
            order: 1,
          },
          {
            title: 'Private Parties',
            description: "Celebrate life's special moments with style and joy. Whether it is a milestone birthday, an engagement celebration, or an anniversary party, we create festive atmospheres that bring people together.",
            icon: 'PartyPopper',
            image: '/party.png',
            features: JSON.stringify(['Birthday celebrations', 'Engagement parties', 'Anniversary events', 'Baby showers', 'Festival gatherings', 'Theme parties']),
            order: 2,
          },
        ],
      });
    }

    // Seed Portfolio Items
    const existingPortfolio = await db.portfolioItem.count();
    if (existingPortfolio === 0) {
      await db.portfolioItem.createMany({
        data: [
          { title: 'Traditional Wedding Celebration', category: 'Wedding', image: '/portfolio1.png', description: 'Luxury wedding ceremony with traditional decorations', order: 0 },
          { title: 'Product Launch Gala', category: 'Corporate', image: '/portfolio2.png', description: 'Corporate product launch event', order: 1 },
          { title: 'Engagement Celebration', category: 'Party', image: '/portfolio3.png', description: 'Elegant engagement party', order: 2 },
          { title: 'Garden Wedding Reception', category: 'Wedding', image: '/portfolio4.png', description: 'Beautiful garden wedding reception', order: 3 },
          { title: 'Team Building Event', category: 'Corporate', image: '/portfolio5.png', description: 'Corporate team building event', order: 4 },
          { title: 'Golden Anniversary Party', category: 'Party', image: '/portfolio6.png', description: 'Grand anniversary celebration', order: 5 },
          { title: 'Sunset Wedding Ceremony', category: 'Wedding', image: '/wedding.png', description: 'Outdoor wedding ceremony', order: 6 },
          { title: 'Annual Business Conference', category: 'Corporate', image: '/corporate.png', description: 'Business conference event', order: 7 },
          { title: 'Milestone Birthday Bash', category: 'Party', image: '/party.png', description: 'Birthday celebration party', order: 8 },
        ],
      });
    }

    // Seed Testimonials
    const existingTestimonials = await db.testimonial.count();
    if (existingTestimonials === 0) {
      await db.testimonial.createMany({
        data: [
          { name: 'Srijana Sharma', role: 'Bride, Wedding Client', text: 'Eventra made our wedding day absolutely perfect. From the stunning floral arrangements to the seamless coordination, every detail was handled with care and professionalism. We could truly enjoy our special day without any stress. The team went above and beyond to make our vision come to life, and the results exceeded our expectations in every way.', rating: 5, initials: 'SS', order: 0 },
          { name: 'Rajesh Poudel', role: 'CEO, TechVenture Pvt. Ltd.', text: 'We hired Eventra for our annual corporate conference, and they delivered an outstanding experience. The stage design, audiovisual setup, and guest management were flawless. Our attendees were impressed, and we have already booked them for next year. Their attention to detail and professional approach sets them apart from other event planners we have worked with.', rating: 5, initials: 'RP', order: 1 },
          { name: 'Anita Gurung', role: 'Birthday Celebration Client', text: "I wanted a special 30th birthday celebration, and Eventra created a magical evening that I will never forget. The decorations, the music, the cake setup — everything was coordinated beautifully. My friends are still talking about how amazing the party was. The team was responsive, creative, and truly understood the vibe I was going for.", rating: 5, initials: 'AG', order: 2 },
          { name: 'Bikash Thapa', role: 'Engagement Party Client', text: 'Our engagement party was everything we dreamed of and more. The Eventra team took our vague ideas and transformed them into a stunning celebration. The venue decoration was elegant, the lighting was perfect, and the flow of the evening was seamless. They even helped us with last-minute changes without any hassle. Highly recommended for any special occasion!', rating: 5, initials: 'BT', order: 3 },
        ],
      });
    }

    // Seed Pricing Packages
    const existingPricing = await db.pricingPackage.count();
    if (existingPricing === 0) {
      await db.pricingPackage.createMany({
        data: [
          {
            name: 'Basic',
            price: 'NPR 25,000',
            description: 'Perfect for small gatherings and intimate celebrations with essential planning services.',
            features: JSON.stringify(['Venue selection assistance', 'Basic decoration setup', 'Event day coordination', 'Vendor recommendations', 'Up to 50 guests', '1 planning consultation']),
            notIncluded: JSON.stringify(['Custom theme design', 'Catering management', 'Photography coordination']),
            popular: false,
            color: 'gold',
            order: 0,
          },
          {
            name: 'Standard',
            price: 'NPR 55,000',
            description: 'Ideal for medium-sized events with enhanced styling, catering, and full-day coordination.',
            features: JSON.stringify(['Venue selection & booking', 'Custom theme & decoration', 'Catering coordination', 'Full event day management', 'Photography arrangement', 'Up to 150 guests', '3 planning consultations', 'Sound & lighting setup']),
            notIncluded: JSON.stringify(['Premium entertainment', 'VIP guest management']),
            popular: true,
            color: 'rose',
            order: 1,
          },
          {
            name: 'Premium',
            price: 'NPR 95,000',
            description: 'The ultimate package for grand celebrations. Everything is handled with luxury and precision.',
            features: JSON.stringify(['Premium venue selection', 'Luxury theme & decoration', 'Full catering management', 'Multi-day event coordination', 'Photography & videography', 'Unlimited guests', 'Unlimited consultations', 'Premium sound & lighting', 'Entertainment arrangement', 'VIP guest management', 'After-party coordination']),
            notIncluded: JSON.stringify([]),
            popular: false,
            color: 'gold',
            order: 2,
          },
        ],
      });
    }

    // Seed Contact Info
    const existingContact = await db.contactInfo.count();
    if (existingContact === 0) {
      await db.contactInfo.create({
        data: {
          phone: '+977 98XXXXXXXX',
          email: 'hello@eventra.com.np',
          address: 'Butwal, Rupandehi, Nepal',
          whatsapp: '97798XXXXXXXX',
          viber: '97798XXXXXXXX',
          workingHours: 'Sun - Fri: 10 AM - 6 PM',
        },
      });
    }

    // Seed Site Settings
    const existingSettings = await db.siteSetting.count();
    if (existingSettings === 0) {
      await db.siteSetting.createMany({
        data: [
          { key: 'brandName', value: 'Eventra' },
          { key: 'tagline', value: 'We Plan, You Celebrate' },
        ],
      });
    }

    // Seed Admin User
    const existingUsers = await db.adminUser.count();
    if (existingUsers === 0) {
      await db.adminUser.create({
        data: { name: 'Admin', email: 'admin@eventra.com', password: 'admin123', role: 'admin', active: true },
      });
    }

    // Seed Blog Posts
    const existingPosts = await db.blogPost.count();
    if (existingPosts === 0) {
      await db.blogPost.createMany({
        data: [
          { title: '10 Tips for Planning Your Dream Wedding in Nepal', slug: 'tips-planning-dream-wedding-nepal', excerpt: 'Discover essential tips for creating the perfect wedding celebration in Nepal, from venue selection to cultural traditions.', content: 'Planning a wedding in Nepal is a beautiful journey that blends rich cultural traditions with modern celebrations. Whether you are envisioning an intimate ceremony or a grand gala, these ten tips will help you create the wedding of your dreams.\n\n1. Start Early\nBegin planning at least 6-12 months in advance. Popular venues and vendors book up quickly, especially during the wedding season (October through February in Nepal). Early planning gives you the best selection and often better pricing.\n\n2. Set a Realistic Budget\nDetermine your budget early and allocate funds across categories: venue, catering, decoration, photography, attire, and entertainment. Always reserve 10-15% of your budget as a contingency fund for unexpected expenses.\n\n3. Choose the Right Season\nNepal\'s wedding season typically runs from October to February when the weather is pleasant. Monsoon season (June-September) can present challenges for outdoor events. Consider the season when selecting your venue and date.\n\n4. Embrace Cultural Traditions\nNepali weddings are rich with meaningful traditions. Incorporate elements like the Henna ceremony, Swayambar, and reception rituals that honor both families\' heritage while making the celebration uniquely yours.\n\n5. Hire a Professional Planner\nA professional event planner like Eventra can save you time, stress, and often money. We have established relationships with vendors, understand local logistics, and can handle the countless details that make a wedding flawless.\n\n6. Select Your Venue Wisely\nNepal offers stunning venue options from garden settings with mountain views to elegant hotel ballrooms. Consider guest count, accessibility, parking, and weather backup plans when choosing your venue.\n\n7. Invest in Quality Photography\nYour wedding photos will be treasured for a lifetime. Invest in a professional photographer who understands Nepali wedding traditions and can capture both the grand moments and intimate details of your celebration.\n\n8. Plan Your Menu Thoughtfully\nFood is central to any Nepali celebration. Work with your caterer to create a menu that honors traditional flavors while accommodating dietary preferences of all your guests.\n\n9. Create a Realistic Timeline\nBuild a detailed timeline for the wedding day and share it with all vendors and key participants. Include buffer time between events to account for the natural flow of ceremonies and celebrations.\n\n10. Enjoy the Process\nAmidst all the planning, remember that your wedding is a celebration of love. Take moments to enjoy the journey, lean on your planner for support, and trust that everything will come together beautifully on your special day.', image: '/wedding.png', category: 'Wedding', tags: '["wedding","nepal","planning","tips"]', author: 'Eventra Team', published: true, metaTitle: '10 Tips for Planning Your Dream Wedding in Nepal', metaDesc: 'Essential tips for creating the perfect wedding celebration in Nepal, from venue selection to cultural traditions.' },
          { title: 'Corporate Event Planning: A Complete Guide for Businesses', slug: 'corporate-event-planning-guide', excerpt: 'Learn how to plan impactful corporate events that impress clients and motivate teams, from conferences to team-building retreats.', content: 'Corporate events are powerful tools for building brand awareness, strengthening team bonds, and impressing clients. Whether you are organizing a conference, product launch, or team-building retreat, this guide will help you plan events that deliver real business results.\n\nWhy Corporate Events Matter\nCorporate events serve multiple strategic purposes. They provide face-to-face interaction in an increasingly digital world, create memorable brand experiences, and offer opportunities for networking that virtual meetings simply cannot replicate. A well-executed corporate event can generate leads, boost employee morale, and position your company as an industry leader.\n\nTypes of Corporate Events\nConferences and seminars bring together industry professionals for knowledge sharing and networking. Product launches create buzz and media attention around new offerings. Team-building events strengthen interpersonal relationships and improve collaboration. Award ceremonies recognize achievements and motivate performance. Holiday parties boost morale and show appreciation for your team.\n\nPlanning Framework\nStart by defining clear objectives. What do you want attendees to think, feel, or do after the event? Set measurable goals whether that is number of leads generated, attendee satisfaction scores, or social media engagement metrics.\n\nBudget allocation should follow the 40-30-20-10 rule: 40% for venue and catering, 30% for production and AV, 20% for marketing and materials, and 10% for contingencies.\n\nSelecting the right venue is crucial. Consider accessibility for attendees, capacity, technical capabilities, and ambiance. The venue sets the tone for your entire event.\n\nEngagement Strategies\nInteractive elements keep attendees engaged and create memorable experiences. Consider live polling, Q&A sessions, hands-on workshops, and networking activities. Post-event surveys help you measure success and improve future events.\n\nWorking with Eventra\nOur team specializes in corporate event planning across Nepal. We handle everything from venue sourcing and vendor management to on-site coordination and post-event analysis, so you can focus on your business objectives while we ensure every detail is perfect.', image: '/corporate.png', category: 'Corporate', tags: '["corporate","business","events","planning"]', author: 'Eventra Team', published: true, metaTitle: 'Corporate Event Planning Guide | Eventra', metaDesc: 'Complete guide to planning impactful corporate events that impress clients and motivate teams.' },
          { title: 'How to Throw an Unforgettable Birthday Party', slug: 'unforgettable-birthday-party-tips', excerpt: 'From intimate gatherings to grand celebrations, learn how to plan a birthday party that your guests will talk about for years.', content: 'Birthday celebrations are milestones that deserve to be memorable. Whether you are planning a child\'s first birthday, a milestone 30th celebration, or a surprise party for a loved one, these strategies will help you create an event that leaves lasting impressions.\n\nChoose a Theme That Tells a Story\nA great theme transforms an ordinary party into an immersive experience. Instead of generic decorations, think about what makes the birthday person unique. Are they a travel enthusiast? Create a "Around the World" theme with food and decor from different countries. A music lover? Design a festival-inspired celebration with live performances.\n\nThe Venue Makes the Difference\nYour venue sets the foundation for the entire experience. Consider rooftop spaces for panoramic views, garden venues for a natural backdrop, or restaurant private rooms for intimate gatherings. The right venue eliminates the need for excessive decoration and creates an instant atmosphere.\n\nFood and Drinks as Experience\nMove beyond basic catering. Create interactive food stations where guests can customize their dishes. Set up a signature cocktail bar with drinks named after the birthday person. Consider a dessert table that doubles as a visual centerpiece.\n\nEntertainment That Engages\nGreat entertainment keeps energy high and creates shared memories. Live bands, photo booths with props, lawn games for outdoor venues, or even a surprise performance can elevate the celebration from ordinary to extraordinary.\n\nThe Personal Touch\nSmall personal details make the biggest impact. A slideshow of memories, handwritten notes from guests, a time capsule activity, or a custom playlist of meaningful songs all add layers of sentiment that generic parties lack.\n\nPlanning with Eventra\nLet us handle the logistics while you focus on celebrating. Our birthday planning service covers everything from concept development and venue selection to decoration, catering coordination, and on-site management. We ensure every detail aligns with your vision and budget.', image: '/party.png', category: 'Party', tags: '["birthday","party","celebration","tips"]', author: 'Eventra Team', published: true, metaTitle: 'How to Throw an Unforgettable Birthday Party | Eventra', metaDesc: 'Tips for planning birthday celebrations that leave lasting impressions, from themes to entertainment.' },
        ],
      });
    }

    // Seed Legal Pages
    const existingLegal = await db.legalPage.count();
    if (existingLegal === 0) {
      await db.legalPage.createMany({
        data: [
          { title: 'Privacy Policy', slug: 'privacy-policy', type: 'privacy', content: 'Last Updated: May 2026\n\nAt Eventra, we are committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or use our services.\n\nInformation We Collect\nWe may collect information that you voluntarily provide to us when you fill out inquiry forms, subscribe to our newsletter, or communicate with us. This includes your name, email address, phone number, event type, and event date.\n\nWe also automatically collect certain information when you visit our website, including your IP address, browser type, operating system, referring URLs, and information about how you interact with our website.\n\nHow We Use Your Information\nWe use the information we collect to respond to your inquiries, provide our event planning services, send you updates about our services, improve our website and services, and comply with legal obligations.\n\nInformation Sharing\nWe do not sell, trade, or rent your personal information to third parties. We may share your information with trusted service providers who assist us in operating our website and conducting our business, subject to confidentiality agreements.\n\nData Security\nWe implement appropriate technical and organizational measures to protect your personal information. However, no method of transmission over the Internet is 100% secure, and we cannot guarantee absolute security.\n\nYour Rights\nYou may access, update, or delete your personal information by contacting us. You may also opt out of receiving promotional communications from us.\n\nContact Us\nIf you have questions about this Privacy Policy, please contact us at hello@eventra.com.np.', metaTitle: 'Privacy Policy | Eventra', metaDesc: 'Learn how Eventra collects, uses, and protects your personal information.' },
          { title: 'Terms and Conditions', slug: 'terms-and-conditions', type: 'terms', content: 'Last Updated: May 2026\n\nWelcome to Eventra. By accessing and using our website and services, you agree to be bound by these Terms and Conditions.\n\nServices\nEventra provides event planning and management services including but not limited to wedding planning, corporate event organization, and private party coordination. All services are subject to availability and separate service agreements.\n\nBookings and Payments\nA booking is confirmed only upon receipt of the required deposit. Full payment terms will be outlined in your individual service agreement. Cancellation policies vary by service type and will be detailed in your booking confirmation.\n\nIntellectual Property\nAll content on this website, including text, graphics, logos, images, and software, is the property of Eventra and is protected by copyright laws. You may not reproduce, distribute, or modify any content without our written permission.\n\nLimitation of Liability\nEventra shall not be liable for any indirect, incidental, special, or consequential damages arising from the use of our services. Our total liability shall not exceed the amount paid by you for the specific service giving rise to the claim.\n\nThird-Party Services\nWe work with third-party vendors including caterers, photographers, and venues. While we carefully select our partners, we are not responsible for the performance or quality of third-party services.\n\nChanges to Terms\nWe reserve the right to modify these terms at any time. Changes will be effective upon posting to the website. Your continued use of our services after changes constitutes acceptance of the modified terms.\n\nContact\nFor questions about these Terms, contact us at hello@eventra.com.np.', metaTitle: 'Terms and Conditions | Eventra', metaDesc: 'Terms and conditions for using Eventra event planning services.' },
          { title: 'Cookie Policy', slug: 'cookie-policy', type: 'cookie', content: 'Last Updated: May 2026\n\nThis Cookie Policy explains how Eventra uses cookies and similar technologies when you visit our website.\n\nWhat Are Cookies\nCookies are small text files placed on your device when you visit a website. They help the website remember your preferences, understand how you use the site, and improve your browsing experience.\n\nHow We Use Cookies\nWe use essential cookies that are necessary for the website to function properly, including session management and security features. We also use analytics cookies to understand how visitors interact with our website, helping us improve our services and content.\n\nYour Choices\nYou can control and manage cookies through your browser settings. Most browsers allow you to block or delete cookies. However, blocking essential cookies may affect the functionality of our website.\n\nThird-Party Cookies\nSome third-party services we use may place their own cookies on your device. These are subject to the respective third-party privacy policies.\n\nUpdates\nWe may update this Cookie Policy from time to time. Any changes will be posted on this page with an updated revision date.\n\nContact\nFor questions about our use of cookies, contact us at hello@eventra.com.np.', metaTitle: 'Cookie Policy | Eventra', metaDesc: 'Learn how Eventra uses cookies and similar technologies on our website.' },
          { title: 'Refund Policy', slug: 'refund-policy', type: 'refund', content: 'Last Updated: May 2026\n\nAt Eventra, we strive to provide excellent event planning services. This Refund Policy outlines the terms under which refunds may be issued.\n\nDeposit Payments\nInitial deposits are non-refundable as they cover consultation time, venue booking fees, and initial planning costs. Deposits secure your date and begin the planning process.\n\nService Cancellations\nIf you cancel your event more than 60 days before the scheduled date, you may receive a refund of payments made beyond the deposit, minus any non-recoverable costs already incurred. Cancellations within 60 days of the event are subject to a more limited refund based on recoverable expenses.\n\nService Modifications\nIf you wish to modify your event rather than cancel, we will work with you to adjust the scope and budget. Price adjustments will be made based on the revised service agreement.\n\nEventra-Initiated Cancellations\nIn the rare event that we must cancel services due to unforeseen circumstances, you will receive a full refund of all payments made, including the deposit.\n\nForce Majeure\nEvents cancelled due to force majeure circumstances (natural disasters, pandemics, government restrictions) will be handled on a case-by-case basis. We will work with you to reschedule or provide the best possible resolution.\n\nRefund Processing\nApproved refunds will be processed within 14 business days using the original payment method. Processing times may vary depending on your financial institution.\n\nContact\nFor refund requests or questions, contact us at hello@eventra.com.np or call us at +977 98XXXXXXXX.', metaTitle: 'Refund Policy | Eventra', metaDesc: 'Understand Eventra refund terms for event planning services.' },
        ],
      });
    }

    // Seed FAQs
    const existingFAQs = await db.fAQ.count();
    if (existingFAQs === 0) {
      await db.fAQ.createMany({
        data: [
          { question: 'What types of events does Eventra plan?', answer: 'We specialize in three main categories: Wedding Planning (ceremonies, receptions, and all wedding-related events), Corporate Events (conferences, product launches, team-building retreats, and award ceremonies), and Private Parties (birthday celebrations, engagement parties, anniversaries, baby showers, and theme parties). We also offer custom event planning for unique occasions.', category: 'Services', order: 0, active: true },
          { question: 'How far in advance should I book?', answer: 'For weddings, we recommend booking at least 6-12 months in advance to secure your preferred venue and vendors. Corporate events typically need 3-6 months of lead time. For private parties, 2-3 months is usually sufficient, though more time allows for better vendor selection and potentially lower costs. Popular dates fill up quickly, so earlier is always better.', category: 'Booking', order: 1, active: true },
          { question: 'What is included in your event planning packages?', answer: 'Our packages vary by tier. The Basic package includes venue selection assistance, basic decoration, and event-day coordination. The Standard package adds custom theme design, catering coordination, photography arrangement, and full-day management. The Premium package includes everything plus luxury venue selection, multi-day coordination, premium entertainment, VIP guest management, and after-party coordination. All packages include planning consultations.', category: 'Pricing', order: 2, active: true },
          { question: 'Can I customize a package to fit my needs?', answer: 'Absolutely! While our standard packages cover common event needs, we understand that every event is unique. We offer custom quotes tailored to your specific requirements, budget, and vision. Contact us to discuss your event, and we will create a personalized package that includes exactly what you need.', category: 'Pricing', order: 3, active: true },
          { question: 'Do you work with specific venues or can I choose my own?', answer: 'We have partnerships with the finest venues in and around Butwal, but you are not limited to our partner network. If you have a specific venue in mind, we are happy to work with them. Our team will handle all venue coordination, logistics, and setup regardless of your choice.', category: 'Services', order: 4, active: true },
          { question: 'What areas do you serve?', answer: 'We are based in Butwal, Rupandehi, and primarily serve the Lumbini Province region. However, we also plan events in Kathmandu, Pokhara, Chitwan, and other major cities across Nepal. For destination events outside our primary area, additional travel and logistics fees may apply. Contact us to discuss your specific location.', category: 'General', order: 5, active: true },
          { question: 'How do I make a payment?', answer: 'We accept multiple payment methods including bank transfer, eSewa, Khalti, and cash. A deposit is required to confirm your booking, with the balance due according to the payment schedule outlined in your service agreement. We will provide detailed payment instructions upon booking confirmation.', category: 'Booking', order: 6, active: true },
          { question: 'What happens if I need to cancel or reschedule?', answer: 'We understand that plans can change. Cancellation and rescheduling policies are outlined in your service agreement. Generally, cancellations more than 60 days before the event may receive a partial refund (excluding the non-refundable deposit). Rescheduling is often possible depending on venue and vendor availability. We will work with you to find the best solution.', category: 'Booking', order: 7, active: true },
        ],
      });
    }

    return NextResponse.json({ message: 'Database seeded successfully!' });
  } catch (error) {
    console.error('Seed error:', error);
    return NextResponse.json({ error: 'Seeding failed' }, { status: 500 });
  }
}
