import type { FaqContent } from "@/models/faq";

// Placeholder content from the Figma file — replace with the real CAP questions.
export const faqs: FaqContent = {
  // Renders as "*Frequently asked* questions".
  heading: { accent: "Frequently asked", title: "questions" },
  items: [
    {
      id: "free-trial",
      question: "Is there a free trial available?",
      answer:
        "Yes, you can try us for free for 30 days. If you want, we’ll provide you with a free, personalized 30-minute onboarding call to get you up and running as soon as possible.",
    },
    {
      id: "change-plan",
      question: "Can I change my plan later?",
      answer:
        "Of course. You can switch between plans at any time and the change takes effect from your next cycle.",
    },
    {
      id: "cancellation",
      question: "What is your cancellation policy?",
      answer:
        "You can cancel whenever you like. Your access stays active until the end of the current period.",
    },
    {
      id: "invoice-info",
      question: "Can other info be added to an invoice?",
      answer:
        "Yes — reach out to the team with the details you need on the invoice and we’ll add them.",
    },
    {
      id: "billing",
      question: "How does billing work?",
      answer: "Billing is handled per cycle. You’ll receive a receipt by email after each payment.",
    },
    {
      id: "change-email",
      question: "How do I change my account email?",
      answer:
        "Go to your profile settings, update the email field and confirm the change from your inbox.",
    },
  ],
};
