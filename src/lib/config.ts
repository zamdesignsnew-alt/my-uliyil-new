export const site = {
  name: 'My Uliyil',
  tagline: 'Our Place. Our People. Our Future.',
  slogan: "Together, Let's Build a Better Ward.",
  sloganMl: 'ഒരുമിച്ച്, മികച്ചൊരു വാർഡ് കെട്ടിപ്പടുക്കാം.',
  location: 'Uliyil, Iritty Municipality, Kannur, Kerala, India',
  wardNumber: '19',
  councillor: {
    name: 'Shabna Teacher',
    nameMl: 'ശബ്ന ടീച്ചർ',
    role: 'Ward Councillor, Uliyil, Iritty Municipality',
    roleMl: 'വാർഡ് കൗൺസിലർ, ഉളിയിൽ, ഇരിട്ടി നഗരസഭ',
    phone: '9497530282',
    email: 'councillorshabna@gmail.com',
    facebook: 'https://www.facebook.com/share/1AADvc8ALG/',
    instagram: 'https://www.instagram.com/shabnacouncillor/',
    portrait: '/images/shabna-teacher.jpg',
    archPortrait: '/images/shabna-teacher-arch.jpg',
    welcome:
      'Welcome to My Uliyil, a shared space for our community. This platform brings together local services, important announcements, development updates, and the voices of our residents. Together, we can make Uliyil more connected, accessible, and better for everyone.',
    welcomeMl:
      'മൈ ഉളിയിലിലേക്ക് സ്വാഗതം. നമ്മുടെ സമൂഹത്തിനായുള്ള ഒരു കൂട്ടായ ഇടമാണിത്. പ്രാദേശിക സേവനങ്ങളും പ്രധാന അറിയിപ്പുകളും വികസന വിവരങ്ങളും നാട്ടുകാരുടെ ശബ്ദവും ഈ വേദിയിൽ ഒന്നിക്കുന്നു. ഒരുമിച്ച് ഉളിയിലിനെ കൂടുതൽ ബന്ധമുള്ളതും എല്ലാവർക്കും പ്രയോജനകരവുമായ സ്ഥലമാക്കാം.'
  },
  imagery: {
    hero: 'https://images.pexels.com/photos/14844302/pexels-photo-14844302.jpeg?auto=compress&cs=tinysrgb&w=2000',
    landscape: 'https://images.pexels.com/photos/770635/pexels-photo-770635.jpeg?auto=compress&cs=tinysrgb&w=1400',
    hills: 'https://images.pexels.com/photos/7322041/pexels-photo-7322041.jpeg?auto=compress&cs=tinysrgb&w=1400',
    community: '/images/community.jpg'
  },
  googleIdeaFormUrl: '',
  facebookPageId: '',
  facebookAccessTokenEnv: 'META_PAGE_ACCESS_TOKEN',
  mapUrl: 'https://www.openstreetmap.org/search?query=Uliyil%2C%20Iritty%2C%20Kerala',
  institutions: [] as { name: string; category: string; locality: string }[],
  projects: [] as { title: string; status: string }[],
  announcements: [] as { title: string; date: string }[],
  emergencyContacts: [
    {
      name: 'India emergency response',
      nameMl: 'ദേശീയ അടിയന്തര സഹായം',
      number: '112',
      scope: 'National emergency helpline',
      scopeMl: 'ദേശീയ എമർജൻസി ഹെൽപ്പ്‌ലൈൻ'
    },
    {
      name: 'Ambulance',
      nameMl: 'ആംബുലൻസ് സേവനം',
      number: '108',
      scope: 'Kerala emergency ambulance service',
      scopeMl: 'കേരള എമർജൻസി ആംബുലൻസ് സർവീസ്'
    },
    {
      name: 'Fire & rescue',
      nameMl: 'ഫയർ & റെസ്ക്യൂ',
      number: '101',
      scope: 'India fire emergency helpline',
      scopeMl: 'അഗ്നിശമന രക്ഷാ സേവനം'
    }
  ]
};

export const categories = [
  'Grocery stores', 'Bakeries & restaurants', 'Medical shops', 'Hardware stores', 'Electrical shops',
  'Mobile shops', 'Tailoring & textiles', 'Printing & design', 'Beauty salons', 'Repair shops',
  'Other local businesses', 'Auto-rickshaw drivers', 'Taxi drivers', 'Car rental', 'Other transport',
  'Electricians', 'Plumbers', 'Mechanics', 'Painters', 'Carpenters', 'Appliance repair',
  'Construction workers', 'Cleaning services', 'Hospitals', 'Clinics', 'Pharmacies',
  'Ambulance providers', 'Other health services', 'Schools', 'Tuition centres', 'Training centres',
  'Libraries', 'Educational services', 'Freelancers', 'Startups', 'Home-based businesses',
  'Local professionals', 'Other services'
];

export const categoryMl: Record<string, string> = {
  'Grocery stores': 'പലചരക്ക് കടകൾ',
  'Bakeries & restaurants': 'ബേക്കറി & ഹോട്ടലുകൾ',
  'Medical shops': 'മെഡിക്കൽ ഷോപ്പുകൾ',
  'Hardware stores': 'ഹാർഡ്‌വെയർ കടകൾ',
  'Electrical shops': 'ഇലക്ട്രിക്കൽ കടകൾ',
  'Mobile shops': 'മൊബൈൽ ഷോപ്പുകൾ',
  'Tailoring & textiles': 'തയ്യൽ & തുണിക്കടകൾ',
  'Printing & design': 'പ്രിന്റിംഗ് & ഡിസൈൻ',
  'Beauty salons': 'ബ്യൂട്ടി സലൂണുകൾ',
  'Repair shops': 'റിപ്പയർ ഷോപ്പുകൾ',
  'Other local businesses': 'മറ്റു പ്രാദേശിക ബിസിനസ്സുകൾ',
  'Auto-rickshaw drivers': 'ഓട്ടോറിക്ഷ ഡ്രൈവർമാർ',
  'Taxi drivers': 'ടാക്സി ഡ്രൈവർമാർ',
  'Car rental': 'കാർ റെന്റൽ',
  'Other transport': 'മറ്റു യാത്രാ സൗകര്യങ്ങൾ',
  Electricians: 'ഇലക്ട്രീഷ്യൻമാർ',
  Plumbers: 'പ്ലംബർമാർ',
  Mechanics: 'മെക്കാനിക്കുകൾ',
  Painters: 'പെയിന്റർമാർ',
  Carpenters: 'ആശാരിമാർ',
  'Appliance repair': 'ഉപകരണ റിപ്പയറിംഗ്',
  'Construction workers': 'നിർമ്മാണ തൊഴിലാളികൾ',
  'Cleaning services': 'ക്ലീനിംഗ് സർവീസുകൾ',
  Hospitals: 'ആശുപത്രികൾ',
  Clinics: 'ക്ലിനിക്കുകൾ',
  Pharmacies: 'ഫാർമസികൾ',
  'Ambulance providers': 'ആംബുലൻസ് സേവനങ്ങൾ',
  'Other health services': 'മറ്റു ആരോഗ്യ സേവനങ്ങൾ',
  Schools: 'സ്കൂളുകൾ',
  'Tuition centres': 'ട്യൂഷൻ സെന്ററുകൾ',
  'Training centres': 'പരിശീലന കേന്ദ്രങ്ങൾ',
  Libraries: 'വായനശാലകൾ / ലൈബ്രറികൾ',
  'Educational services': 'വിദ്യാഭ്യാസ സേവനങ്ങൾ',
  Freelancers: 'ഫ്രീലാൻസർമാർ',
  Startups: 'സ്റ്റാർട്ടപ്പുകൾ',
  'Home-based businesses': 'ഗാർഹിക സംരംഭങ്ങൾ',
  'Local professionals': 'പ്രാദേശിക പ്രൊഫഷണലുകൾ',
  'Other services': 'മറ്റു സേവനങ്ങൾ'
};

export const professionalCategories = [
  'Medical & Health',
  'Engineering & Tech',
  'Legal & Finance',
  'Education & Research',
  'Architecture & Design',
  'Government & Public Service',
  'Media & Creative',
  'Other Specialists'
];

export const professionalCategoryMl: Record<string, string> = {
  'Medical & Health': 'ആരോഗ്യ രംഗം',
  'Engineering & Tech': 'എഞ്ചിനീയറിംഗ് & ഐടി',
  'Legal & Finance': 'നിയമം & സാമ്പത്തിക രംഗം',
  'Education & Research': 'വിദ്യാഭ്യാസം & ഗവേഷണം',
  'Architecture & Design': 'ആർക്കിടെക്ചർ & ഡിസൈൻ',
  'Government & Public Service': 'സർക്കാർ & പൊതുസേവനം',
  'Media & Creative': 'മീഡിയ & ക്രിയേറ്റീവ്',
  'Other Specialists': 'മറ്റു വിദഗ്ധർ'
};

export const nearestTowns = ['Iritty', 'Uliyil', 'Keezhur', 'Mattannur', 'Peravoor', 'Other Nearby'];

export const nearestCategories = [
  'Supermarket & Hypermarket',
  'Textiles & Fashion',
  'Jewellery',
  'Hospitals & Clinics',
  'Pharmacy & Opticals',
  'Electronics & Appliances',
  'Furniture & Home',
  'Fuel & Automobile',
  'Banks & Finance',
  'Restaurants & Bakeries',
  'Other Shops'
];

export const serviceGuides = [
  {
    name: 'Welfare pensions',
    nameMl: 'ക്ഷേമ പെൻഷനുകൾ',
    icon: 'heart',
    description: 'Guidance on available social security pension schemes.',
    descriptionMl: 'ലഭ്യമായ സാമൂഹ്യ സുരക്ഷാ പെൻഷൻ പദ്ധതികളെക്കുറിച്ചുള്ള മാർഗ്ഗനിർദ്ദേശങ്ങൾ.',
    url: 'https://welfarepension.lsgkerala.gov.in/'
  },
  {
    name: 'LIFE Mission housing',
    nameMl: 'ലൈഫ് മിഷൻ ഭവന പദ്ധതി',
    icon: 'home',
    description: 'Housing support information and programme updates.',
    descriptionMl: 'ഭവന സഹായ വിവരങ്ങളും പദ്ധതി അപ്‌ഡേറ്റുകളും.',
    url: 'https://lifemission.kerala.gov.in/'
  },
  {
    name: 'Ration cards',
    nameMl: 'റേഷൻ കാർഡ് സേവനങ്ങൾ',
    icon: 'credit',
    description: 'Find ration card services and application information.',
    descriptionMl: 'റേഷൻ കാർഡ് സേവനങ്ങളും അപേക്ഷാ വിവരങ്ങളും കണ്ടെത്തുക.',
    url: 'https://civilsupplieskerala.gov.in/'
  },
  {
    name: 'Certificates',
    nameMl: 'സർട്ടിഫിക്കറ്റുകൾ (ഇ-ഡിസ്ട്രിക്റ്റ്)',
    icon: 'file',
    description: 'Income, residence, birth and death certificate services.',
    descriptionMl: 'വരുമാന, താമസ, ജനന, മരണ സർട്ടിഫിക്കറ്റ് സേവനങ്ങൾ.',
    url: 'https://edistrict.kerala.gov.in/'
  },
  {
    name: 'Scholarships',
    nameMl: 'സ്കോളർഷിപ്പുകൾ',
    icon: 'book',
    description: 'Discover education assistance through official portals.',
    descriptionMl: 'ഔദ്യോഗിക പോർട്ടലുകൾ വഴി വിദ്യാഭ്യാസ സഹായങ്ങൾ അറിയുക.',
    url: 'https://scholarships.gov.in/'
  },
  {
    name: 'Health assistance',
    nameMl: 'ആരോഗ്യ സഹായ പദ്ധതികൾ',
    icon: 'plus',
    description: 'Explore health coverage and assistance programmes.',
    descriptionMl: 'ആരോഗ്യ ഇൻഷുറൻസും ചികിത്സാ സഹായ പദ്ധതികളും പരിശോധിക്കുക.',
    url: 'https://sha.kerala.gov.in/'
  },
  {
    name: 'Senior citizen services',
    nameMl: 'മുതിർന്ന പൗരന്മാർക്കുള്ള സേവനങ്ങൾ',
    icon: 'users',
    description: 'Information on services for older residents.',
    descriptionMl: 'മുതിർന്ന പൗരന്മാർക്കായുള്ള വിവിധ ക്ഷേമ സേവന വിവരങ്ങൾ.',
    url: 'https://socialjustice.kerala.gov.in/'
  },
  {
    name: 'Women & child welfare',
    nameMl: 'വനിതാ ശിശു ക്ഷേമം',
    icon: 'sparkles',
    description: 'Find support and programmes for women and children.',
    descriptionMl: 'സ്ത്രീകൾക്കും കുട്ടികൾക്കുമുള്ള സഹായ പദ്ധതികൾ കണ്ടെത്തുക.',
    url: 'https://wcd.kerala.gov.in/'
  },
  {
    name: 'Disability assistance',
    nameMl: 'ഭിന്നശേഷി ക്ഷേമ സേവനങ്ങൾ',
    icon: 'access',
    description: 'Access information about disability welfare.',
    descriptionMl: 'ഭിന്നശേഷി ക്ഷേമ പദ്ധതികളെക്കുറിച്ചുള്ള വിവരങ്ങൾ.',
    url: 'https://socialjustice.kerala.gov.in/'
  },
  {
    name: 'Kudumbashree',
    nameMl: 'കുടുംബശ്രീ',
    icon: 'flower',
    description: 'Learn about neighbourhood groups and programmes.',
    descriptionMl: 'അയൽക്കൂട്ടങ്ങളെയും കുടുംബശ്രീ പദ്ധതികളെയും കുറിച്ച് അറിയുക.',
    url: 'https://www.kudumbashree.org/'
  },
  {
    name: 'Municipal services',
    nameMl: 'നഗരസഭാ സേവനങ്ങൾ (K-SMART)',
    icon: 'building',
    description: 'Explore local self-government digital services.',
    descriptionMl: 'തദ്ദേശ സ്വയംഭരണ ഡിജിറ്റൽ സേവനങ്ങൾ ഉപയോഗിക്കുക.',
    url: 'https://ksmart.lsgkerala.gov.in/'
  }
];
