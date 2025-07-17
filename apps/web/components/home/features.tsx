import {
  Briefcase,
  FileText,
  ClipboardList,
  Sparkles,
  UploadCloud,
  ScanSearch,
  FileCheck2,
} from "lucide-react"

const features = [
  {
    name: "Upload Your Resume",
    description: "Start by uploading your existing resume in any format.",
    icon: <UploadCloud className="size-8 text-primary-purple" />,
  },
  {
    name: "Paste a Job Description",
    description: "Provide the job description you're targeting.",
    icon: <ScanSearch className="size-8 text-primary-purple" />,
  },
  {
    name: "Generate Tailored CV",
    description:
      "Our AI rewrites your resume to highlight the most relevant skills.",
    icon: <Sparkles className="size-8 text-primary-purple" />,
  },
  {
    name: "Create a Cover Letter",
    description: "Generate a compelling cover letter that matches the job.",
    icon: <FileCheck2 className="size-8 text-primary-purple" />,
  },
]

const howItWorks = [
  {
    step: 1,
    title: "Upload Your Base Resume",
    description:
      "Provide us with your current resume. We'll use this as the foundation for all your tailored applications.",
    icon: <UploadCloud className="size-10 text-accent-blue" />,
  },
  {
    step: 2,
    title: "Provide the Job Description",
    description:
      "Paste the details of the job you want to apply for. Our AI will analyze the key requirements and skills.",
    icon: <ClipboardList className="size-10 text-accent-blue" />,
  },
  {
    step: 3,
    title: "Receive Your Enhanced Documents",
    description:
      "Get an AI-powered CV and cover letter, optimized to catch the recruiter's eye while staying true to your experience.",
    icon: <FileText className="size-10 text-accent-blue" />,
  },
]

export function Features() {
  return (
    <section id="features" className="bg-secondary-pastel-1 py-20 lg:py-32">
      <div className="container mx-auto px-4">
        {/* Top Features Section */}
        <div className="mb-16 text-center">
          <p className="mb-4 font-semibold uppercase tracking-wider text-accent-blue">
            Core Features
          </p>
          <h2 className="text-4xl font-extrabold tracking-tight text-foreground lg:text-5xl">
            Everything You Need to Succeed
          </h2>
          <p className="mx-auto mt-4 max-w-3xl text-lg text-muted-foreground lg:text-xl">
            From resume analysis to personalized document generation, Resumind
            provides the tools to elevate your job application.
          </p>
        </div>
        <div className="mb-24 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <div
              key={feature.name}
              className="transform rounded-xl border border-white/20 bg-white/50 p-8 text-center shadow-lg backdrop-blur-xl transition-transform hover:scale-105 hover:shadow-xl"
            >
              <div className="mb-4 inline-flex items-center justify-center rounded-full bg-white p-4 shadow-md">
                {feature.icon}
              </div>
              <h3 className="mb-2 text-xl font-bold text-foreground">
                {feature.name}
              </h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* How It Works Section */}
        <div className="text-center">
          <p className="mb-4 font-semibold uppercase tracking-wider text-accent-blue">
            How It Works
          </p>
          <h2 className="mb-12 text-4xl font-extrabold tracking-tight text-foreground lg:text-5xl">
            Get Your Tailored Application in 3 Simple Steps
          </h2>
          <div className="relative mx-auto max-w-5xl">
            <div className="absolute left-1/2 top-1/2 hidden h-1 w-full -translate-y-1/2 transform border-t-2 border-dashed border-primary-purple/50 lg:block"></div>
            <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
              {howItWorks.map((item) => (
                <div
                  key={item.step}
                  className="relative z-10 space-y-4 rounded-lg bg-white p-8 shadow-lg"
                >
                  <div className="flex items-center justify-center gap-4">
                    <div className="flex size-12 items-center justify-center rounded-full bg-secondary-pastel-1 font-bold text-accent-blue">
                      {item.icon}
                    </div>
                    <h3 className="text-2xl font-bold text-foreground">
                      {item.title}
                    </h3>
                  </div>
                  <p className="text-muted-foreground">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
