import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';
import { Shell } from '@/components/Shell';
import './globals.css';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://my-uliyil.vercel.app';

export const viewport: Viewport = {
  themeColor: '#103d32',
  width: 'device-width',
  initialScale: 1
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'My Uliyil — Official Community Portal & Directory | Uliyil Ward 19',
    template: '%s | My Uliyil'
  },
  description:
    'My Uliyil is the official community portal for Uliyil, Iritty Municipality (Ward 19), Kannur, Kerala. Discover local businesses, auto drivers, emergency contacts, ward councillor updates, and government services.',
  keywords: [
    'my uliyil',
    'myuliyil',
    'uliyil',
    'my-uliyil',
    'uliyil ward 19',
    'hello uliyil',
    'uliyil directory',
    'iritty municipality',
    'kannur',
    'kerala',
    'uliyil news',
    'shabna teacher',
    'shabna teacher uliyil',
    'kulikkadavu',
    'thilanoor',
    'uliyil auto rickshaw',
    'uliyil emergency numbers'
  ],
  authors: [{ name: 'My Uliyil Community Team', url: siteUrl }],
  creator: 'My Uliyil Ward 19 Community Initiative',
  publisher: 'Uliyil Ward 19',
  alternates: {
    canonical: siteUrl
  },
  openGraph: {
    title: 'My Uliyil — Official Community Portal & Directory',
    description:
      'The digital heart of Uliyil. Discover local services, community updates, helpful contacts, and connect with Ward Councillor Shabna Teacher in Iritty, Kannur.',
    url: siteUrl,
    siteName: 'My Uliyil',
    locale: 'en_IN',
    type: 'website'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'My Uliyil — Our Place. Our People. Our Future.',
    description: 'Community directory, emergency services, and local news for Uliyil, Kannur.'
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1
    }
  },
  verification: {
    google: 'googleee0a4a38f23e2f08'
  }
};

export default function RootLayout({ children }: { children: ReactNode }) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': `${siteUrl}/#website`,
        url: siteUrl,
        name: 'My Uliyil',
        alternateName: ['myuliyil', 'My Uliyil Portal', 'Hello Uliyil', 'Uliyil Ward 19'],
        description:
          'Official community portal and directory for Uliyil, Ward 19 Iritty Municipality, Kannur, Kerala.',
        publisher: {
          '@type': 'GovernmentOrganization',
          name: 'Ward 19 Uliyil, Iritty Municipality'
        },
        potentialAction: {
          '@type': 'SearchAction',
          target: `${siteUrl}/hello-uliyil?q={search_term_string}`,
          'query-input': 'required name=search_term_string'
        }
      },
      {
        '@type': 'CivicStructure',
        '@id': `${siteUrl}/#place`,
        name: 'Uliyil',
        address: {
          '@type': 'PostalAddress',
          addressLocality: 'Uliyil, Iritty',
          addressRegion: 'Kerala',
          postalCode: '670702',
          addressCountry: 'IN'
        }
      }
    ]
  };

  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        <Shell>{children}</Shell>
      </body>
    </html>
  );
}
