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

    return NextResponse.json({ message: 'Database seeded successfully!' });
  } catch (error) {
    console.error('Seed error:', error);
    return NextResponse.json({ error: 'Seeding failed' }, { status: 500 });
  }
}
