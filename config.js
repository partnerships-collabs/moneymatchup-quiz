module.exports = {
  pageTitle: 'What Credit Card Should You Get? | Money Matchup',

  // Branding
  creatorName:    'Money Matchup',
  creatorTagline: 'Credit Card Quiz',
  creatorPhoto:   'logo.png',
  accentColor:    '#E03A3A',
  accentText:     '#ffffff',
  accentRgb:      '224, 58, 58',

  // Hero copy
  heroH1:      ['Find Your ', 'Perfect', ' Credit Card'],
  heroSubtext: 'Five questions. No fluff. Get a card recommendation based on your actual financial situation.',
  trustPills:  ['No email required', 'No sign-up', 'Results in 60 seconds'],

  // Voice
  voiceLabel:      'Our Take',
  redirectMessage: 'Whatever card you get, the rule is simple. Pay it off every month. Full balance. Every time. Rewards only work in your favor when you are not paying interest to get them.',

  // Multi-creator path routing (cards.moneymatchup.com/caleb, /griffin, etc.)
  multiCreator: true,

  // Add creators here. Each entry overrides the defaults above for that URL slug.
  // Only include fields that differ from the MM defaults.
  // Photos can be a full URL (e.g. from YouTube) or a filename in this skin's folder.
  // Example:
  // creatorConfigs: {
  //   'caleb': {
  //     creatorName:    'Caleb Hammer',
  //     creatorTagline: 'Financial Audit',
  //     creatorPhoto:   'https://yt3.googleusercontent.com/...',
  //     voiceLabel:     "Caleb's Take",
  //     redirectMessage: 'Pay it off. Every month...',
  //     redirectUrls: {
  //       balance_transfer: 'https://oc.brcclx.com/t?lid=...',
  //       business:         'https://oc.brcclx.com/t?lid=...',
  //       everyday:         'https://oc.brcclx.com/t?lid=...',
  //       travel:           'https://oc.brcclx.com/t?lid=...',
  //       premium_travel:   'https://oc.brcclx.com/t?lid=...',
  //     },
  //   },
  // },
  creatorConfigs: {},

  // Tracking
  ga4Id:      '',   // e.g. 'G-XXXXXXXXXX'
  subIdParam: 's1',

  // Affiliate redirect URLs
  redirectUrls: {
    balance_transfer: 'https://oc.brcclx.com/t?lid=26770737',
    business:         'https://oc.brcclx.com/t?lid=26770741',
    everyday:         'https://oc.brcclx.com/t?lid=26770739',
    travel:           'https://oc.brcclx.com/t?lid=26770738',
    premium_travel:   'https://oc.brcclx.com/t?lid=26770740',
  },

  // Result display
  resultDisplay: {
    balance_transfer: { name: 'Balance Transfer Card', type: 'Pay Off Your Debt Faster' },
    business:         { name: 'Business Rewards Card', type: 'Built for Business Owners' },
    everyday:         { name: 'Everyday Rewards Card', type: 'Simple, No-Nonsense Cashback' },
    travel:           { name: 'Travel Rewards Card',   type: 'Entry-Level Travel Card' },
    premium_travel:   { name: 'Premium Travel Card',   type: 'For Serious Travelers' },
  },
};
