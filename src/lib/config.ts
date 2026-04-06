export const config = {
  pageTitle: 'What Credit Card Should You Get? | Money Matchup',

  creatorName: 'Money Matchup',
  creatorTagline: 'Credit Card Quiz',
  creatorPhoto: '/logo.png',
  accentColor: '#E03A3A',
  accentText: '#ffffff',
  accentRgb: '224, 58, 58',
  labelColor: '#E03A3A',

  heroH1: ['Find Your ', 'Perfect', ' Credit Card'],
  heroSubtext: 'Five questions. No fluff. Get a card recommendation based on your actual financial situation.',
  trustPills: ['No email required', 'No sign-up', 'Results in 60 seconds'],

  voiceLabel: 'Our Take',
  redirectMessage: 'Whatever card you get, the rule is simple. Pay it off every month. Full balance. Every time. Rewards only work in your favor when you are not paying interest to get them.',

  subIdParam: 's1',

  redirectUrls: {
    balance_transfer: 'https://oc.brcclx.com/t?lid=26770737',
    business: 'https://oc.brcclx.com/t?lid=26770741',
    everyday: 'https://oc.brcclx.com/t?lid=26770739',
    travel: 'https://oc.brcclx.com/t?lid=26770738',
    premium_travel: 'https://oc.brcclx.com/t?lid=26770740',
  } as Record<string, string>,

  resultDisplay: {
    balance_transfer: { name: 'Balance Transfer Card', type: 'Pay Off Your Debt Faster' },
    business: { name: 'Business Rewards Card', type: 'Built for Business Owners' },
    everyday: { name: 'Everyday Rewards Card', type: 'Simple, No-Nonsense Cashback' },
    travel: { name: 'Travel Rewards Card', type: 'Entry-Level Travel Card' },
    premium_travel: { name: 'Premium Travel Card', type: 'For Serious Travelers' },
  } as Record<string, { name: string; type: string }>,
};

export const questions = [
  {
    id: 'cardtype',
    text: 'Are you looking for a personal or business credit card?',
    options: [
      { label: 'Personal card for my own everyday spending', value: 'personal' },
      { label: 'Business card for my company or self-employment income', value: 'business' },
    ],
  },
  {
    id: 'payoff',
    text: 'Do you pay off your full balance every month?',
    options: [
      { label: 'Yes -- I pay in full every month', value: 'yes' },
      { label: 'Usually, but not always', value: 'sometimes' },
      { label: 'No -- I carry a balance or want to pay off existing debt', value: 'carry' },
    ],
  },
  {
    id: 'score',
    text: 'What best describes your credit?',
    options: [
      { label: 'Excellent -- 740 or above', value: 'excellent' },
      { label: 'Good -- 670 to 739', value: 'good' },
      { label: 'Fair -- 580 to 669', value: 'fair' },
      { label: 'Poor -- below 580', value: 'poor' },
      { label: 'New to credit -- just getting started', value: 'new' },
    ],
  },
  {
    id: 'goal',
    text: "What's your main goal with this card?",
    options: [
      { label: 'Earn travel rewards, points, or miles', value: 'travel' },
      { label: 'Get cashback on everyday purchases', value: 'cashback' },
      { label: 'Build or improve my credit score', value: 'build' },
    ],
  },
  {
    id: 'fee',
    text: 'Would you pay an annual fee if the rewards justify it?',
    options: [
      { label: 'Yes -- for premium perks like lounge access', value: 'premium-yes' },
      { label: 'Yes -- if cashback or points clearly outweigh the fee', value: 'cashback-yes' },
      { label: 'No -- I want zero annual fee', value: 'no' },
    ],
  },
];

export const OUTCOME_MAP: Record<string, string> = {
  business: 'business',
  transfer: 'balance_transfer',
  secured: 'everyday',
  student: 'everyday',
  fizz: 'everyday',
  cashback: 'everyday',
  cashback_cat: 'everyday',
  travel: 'travel',
  premium: 'premium_travel',
};

export function getCard(a: Record<string, string>): string {
  if (a.cardtype === 'business' && a.score !== 'poor' && a.score !== 'new') return 'business';
  if (a.payoff === 'carry') return 'transfer';
  if (a.score === 'poor' || a.score === 'new') return 'fizz';
  if (a.goal === 'build') return 'secured';

  const scores: Record<string, number> = {
    secured: 0, student: 0, transfer: 0, fizz: 0,
    cashback: 0, cashback_cat: 0, travel: 0, premium: 0,
  };

  if (a.score === 'new') { scores.secured += 4; scores.fizz += 2; }
  if (a.score === 'excellent') { scores.premium += 3; scores.travel += 1; scores.cashback += 1; }
  if (a.score === 'good') { scores.cashback += 2; scores.cashback_cat += 2; scores.travel += 1; }
  if (a.score === 'fair') { scores.secured += 3; scores.fizz += 1; }
  if (a.score === 'poor') { scores.fizz += 4; scores.secured += 1; }

  if (a.payoff === 'yes') { scores.travel += 2; scores.premium += 2; scores.cashback += 2; scores.cashback_cat += 1; }
  if (a.payoff === 'sometimes') { scores.cashback += 2; scores.cashback_cat += 1; }

  if (a.goal === 'travel') { scores.travel += 3; scores.premium += 1; }
  if (a.goal === 'cashback') { scores.cashback += 3; scores.cashback_cat += 2; }

  if (a.fee === 'premium-yes') { scores.premium += 4; scores.travel += 1; }
  if (a.fee === 'cashback-yes') { scores.cashback += 2; scores.cashback_cat += 1; }
  if (a.fee === 'no') { scores.cashback += 2; scores.cashback_cat += 1; scores.premium -= 2; scores.travel -= 1; }

  Object.keys(scores).forEach(k => { if (scores[k] < 0) scores[k] = 0; });

  const tiePriority: Record<string, number> = {
    premium: a.fee === 'premium-yes' ? 5 : 1,
    travel: 4,
    cashback_cat: 3,
    cashback: 2,
    secured: 1, fizz: 1, student: 1, transfer: 1,
  };

  const result = Object.keys(scores).sort((x, y) => {
    if (scores[y] !== scores[x]) return scores[y] - scores[x];
    return (tiePriority[y] || 0) - (tiePriority[x] || 0);
  })[0];

  if ((result === 'travel' || result === 'premium') && a.score === 'fair') return 'cashback';

  return result;
}
