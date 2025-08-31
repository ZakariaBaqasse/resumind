import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

export function FAQ() {
  const faqs = [
    {
      question: "Can I download my resume as PDF or Word?",
      answer:
        "Yes! ResumAI generates resumes in PDF format. You can download your optimized resume in this format with a single click.",
    },
    {
      question: "How does keyword optimization work?",
      answer:
        "Our AI analyzes job descriptions to identify key terms, skills, and requirements. It then strategically incorporates these keywords into your resume while maintaining natural language flow and readability.",
    },
    {
      question: "Is my data secure?",
      answer:
        "Absolutely. We use end-to-end encryption for all data transmission and storage. Your resume data is never shared with third parties without your explicit consent, and we comply with SOC 2 and GDPR standards.",
    },
    {
      question: "How long does it take to generate a resume?",
      answer:
        "Most resumes are optimized within 30-60 seconds. The exact time depends on the complexity of your original resume and the job description you're targeting.",
    },
    {
      question: "Can I customize the templates?",
      answer:
        "Currently, we offer several professionally designed templates optimized for ATS compatibility. Custom template design is on our roadmap and will be available in future updates.",
    },
    {
      question: "What file formats can I upload?",
      answer:
        "ResumAI accepts PDF, Word documents (.doc, .docx), and plain text files. Our smart parsing technology can extract information from most standard resume formats.",
    },
    {
      question: "Do you offer a free trial?",
      answer:
        "We're currently in beta with limited access. You can request access to try ResumAI with a free optimization of your first resume. Full pricing will be announced when we launch publicly.",
    },
    {
      question: "How accurate is the ATS optimization?",
      answer:
        "Our ATS optimization has been tested with over 50 different applicant tracking systems and maintains a 99% compatibility rate. We regularly update our algorithms to stay current with ATS changes.",
    },
  ]

  return (
    <section id="faq" className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-balance mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-xl text-muted-foreground text-pretty">
            Everything you need to know about ResumAI
          </p>
        </div>

        <Accordion type="single" collapsible className="space-y-4">
          {faqs.map((faq, index) => (
            <AccordionItem
              key={index}
              value={`item-${index}`}
              className="bg-card/10 border border-border rounded-lg px-6"
            >
              <AccordionTrigger className="text-left hover:no-underline py-6">
                <span className="font-semibold text-balance pr-4">
                  {faq.question}
                </span>
              </AccordionTrigger>
              <AccordionContent className="pb-6 text-muted-foreground text-pretty">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  )
}
