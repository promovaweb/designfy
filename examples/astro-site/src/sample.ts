/** Fictional Fieldnote copy, routes, plans and illustrations used by both examples. */
export const brand = { label: "Fieldnote", href: "/" };
export const routes = [
  { label: "Overview", href: "/" },
  { label: "Preview", href: "/landing/" },
  { label: "Pricing", href: "/pricing/" },
];
export const preview = { label: "Get preview", href: "/landing/#preview" };
export const plansLink = { label: "Explore plans", href: "/pricing/" };
export const footerGroups = [
  { title: "Fieldnote", links: routes },
  {
    title: "Explore",
    links: [
      { label: "How it works", href: "/#process" },
      { label: "Questions", href: "/pricing/#questions" },
    ],
  },
];
export const logoNames = [
  "Sample Studio",
  "Example Works",
  "Demo Collective",
  "Mock Research",
  "Sample Lab",
  "Example Archive",
].map((name) => ({ name }));

export const images = {
  notes: {
    src: "/sample-notes.svg",
    width: 800,
    height: 450,
    alt: "Sample workspace with three observation notes",
  },
  tags: {
    src: "/sample-tags.svg",
    width: 800,
    height: 450,
    alt: "Sample diagram of tags linking related notes",
  },
  brief: {
    src: "/sample-brief.svg",
    width: 800,
    height: 450,
    alt: "Sample brief with two findings and a next step",
  },
  share: {
    src: "/sample-share.svg",
    width: 800,
    height: 450,
    alt: "Sample diagram showing a brief shared with three teammates",
  },
};

export const features = [
  {
    title: "Collect observations",
    description: "Write a quick note as soon as you leave a session.",
  },
  {
    title: "Follow a thread",
    description:
      "Group related notes and keep each observation tied to its source.",
  },
  {
    title: "Share a brief",
    description:
      "Send the team a short summary with links back to the evidence.",
  },
];
export const tiles = [
  {
    title: "Each note keeps its source",
    description: "Jump from a finding back to the session where it came up.",
    image: images.notes,
    span: "wide" as const,
  },
  {
    title: "Tag as you go",
    description: "A handful of tags is enough to see the first patterns.",
    image: images.tags,
    span: "tall" as const,
  },
  {
    title: "Build the brief",
    description:
      "Turn a cluster of observations into a decision the team can revisit.",
    image: images.brief,
  },
  {
    title: "Share the work",
    description: "Give your teammates the brief and the source notes together.",
    image: images.share,
  },
];
export const steps = [
  {
    title: "Capture",
    description: "Log the observation and attach its session.",
  },
  {
    title: "Connect",
    description: "Group notes that point to the same issue.",
  },
  {
    title: "Share",
    description: "Publish a brief that links back to the source.",
  },
];
export const metrics = [
  { value: 12, label: "Notes in the sample workspace" },
  { value: 4, label: "Tags in the sample library" },
  { value: 3, label: "Illustrated research stages" },
  { value: 2, label: "Example findings in the brief" },
];
export const quotes = [
  {
    quote:
      "“When we prepared the review, we could open the source notes from the brief and see exactly where a finding came from.”",
    name: "Rowan Example",
    role: "Fictional research lead",
    company: "Sample Studio",
  },
];
const included = (label: string) => ({ label, included: true });
const excluded = (label: string) => ({ label, included: false });
export const plans = [
  {
    name: "Solo",
    monthly: "$10",
    yearly: "$100",
    description: "One researcher keeping their own notes.",
    features: [
      included("One workspace"),
      included("Shared briefs"),
      excluded("Team editing"),
    ],
    action: preview,
  },
  {
    name: "Team",
    monthly: "$30",
    yearly: "$300",
    description: "A research team building briefs together.",
    features: [
      included("Five workspaces"),
      included("Shared briefs"),
      included("Team editing"),
    ],
    action: preview,
    recommended: true,
  },
  {
    name: "Studio",
    monthly: "$60",
    yearly: "$600",
    description: "Multiple teams with separate research projects.",
    features: [
      included("Twenty workspaces"),
      included("Shared briefs"),
      included("Team editing"),
    ],
    action: preview,
  },
];
export const comparison = [
  {
    title: "Working space",
    rows: [
      { feature: "Workspaces", cells: ["1", "5", "20"] },
      { feature: "Team editing", cells: [false, true, true] },
    ],
  },
  {
    title: "Sharing",
    rows: [
      { feature: "Shared briefs", cells: [true, true, true] },
      { feature: "Private project spaces", cells: [false, false, true] },
    ],
  },
];
export const questions = [
  {
    question: "Can I try the sample workspace?",
    answer:
      "Yes. Open the preview page to see how the fictional sample workspace is organized.",
  },
  {
    question: "What comes with each sample plan?",
    answer:
      "All three include shared briefs. Team and Studio also include team editing.",
  },
  {
    question: "Does the preview form send email?",
    answer:
      "The example has no signup endpoint. The form validates the address and reports that the connection is missing.",
  },
];
export const signup = {
  id: "workshop-preview",
  label: "Email address",
  submitLabel: "Request preview",
  placeholder: "you@example.com",
  consent: "Use a sample address to try the form.",
  successMessage: "Your signup was received.",
  errorMessage: "The signup could not be sent. Try again.",
  notConnectedMessage: "This sample form is not connected.",
};
