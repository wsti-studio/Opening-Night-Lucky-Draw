// Where the phone form sends answers and where the wheel reads names from.
// Both are Google Forms owned by a WSTI account.
window.DRAW = {
  winners: 5,

  // Full entry. Its Sheet is private and never shared.
  privateForm: {
    action: "https://docs.google.com/forms/d/e/1FAIpQLSdNqgwSQhRc7A_Q0O2PkZYzhPNWYhT_je2nV8SzYryXGj0w2g/formResponse",
    fields: {
      nickname: "entry.890537074",
      email: "entry.717154480",
      age: "entry.396244247",
      ethnicity: "entry.656792466",
      postcode: "entry.1842845702",
      student: "entry.734352397",
      organisation: "entry.782199548",
      citizenScience: "entry.843855419",
      code: "entry.400364344",
      consent: "entry.1510898614"
    }
  },

  // Nickname + entry code only. Its Sheet is shared "anyone with the link, viewer".
  wheelForm: {
    action: "https://docs.google.com/forms/d/e/1FAIpQLSev-_fsjD2jDaA_ULT9gC6LMK96mMHiIl33NSLxXTPArEW5NA/formResponse",
    fields: {
      nickname: "entry.279100841",
      code: "entry.1396616133"
    }
  },

  // The wheel form's response Sheet id (the long part of its link). Empty until the Sheet is linked.
  wheelSheetId: "1nHLRyJuSrHWEIF6HefDkgpmoZW5qmVPxiQ6PtKz49jI",

  // ABS Age Standard, standard ten year output groups (abs.gov.au, Age Standard 2014 v1.7).
  ageBands: ["15–24", "25–34", "35–44", "45–54", "55–64", "65–74", "75 and over", "Prefer not to say"],

  // ABS ASCCEG 2025 broad groups. Examples are ABS cultural and ethnic groups inside each broad group.
  ethnicities: [
    { value: "Oceanian", examples: "Australian, Aboriginal, Torres Strait Islander, Maori, Samoan, Tongan, Fijian" },
    { value: "North-West European", examples: "English, Irish, Western and Northern European" },
    { value: "Southern and Eastern European", examples: "Italian, Greek, Eastern European" },
    { value: "North African and Middle Eastern", examples: "Lebanese, Iraqi, Assyrian, Turkish" },
    { value: "South-East Asian", examples: "Vietnamese, Filipino" },
    { value: "North-East Asian", examples: "Chinese, Korean" },
    { value: "Southern and Central Asian", examples: "Indian, Nepalese, Pakistani, Sri Lankan, Afghan" },
    { value: "Peoples of the Americas", examples: "North, Central and South American, Caribbean Islander" },
    { value: "Sub-Saharan African", examples: "Central, West, Southern and East African" },
    { value: "Prefer not to say", examples: "" }
  ]
};
