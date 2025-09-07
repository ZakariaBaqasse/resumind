import { Document, Page, StyleSheet, Text, View } from "@react-pdf/renderer"

import { Resume } from "@/types/resume.types"

const escapeRegex = (string: string) => {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
}

// Utility to clean AI-generated cover letter
function cleanCoverLetterContent(coverLetter: string, generatedResume: Resume) {
  if (!coverLetter || !generatedResume) return ""

  const personalInfoPatterns = [
    new RegExp(escapeRegex(generatedResume.name) || "", "i"),
    new RegExp(
      escapeRegex(generatedResume.personal_info?.phone_number) || "",
      "i"
    ),
    new RegExp(escapeRegex(generatedResume.email) || "", "i"),
    new RegExp(escapeRegex(generatedResume.personal_info?.address) || "", "i"),
    /\b\d{4}-\d{2}-\d{2}\b/, // Dates like YYYY-MM-DD
    /Hiring Manager/i,
    /Dear Hiring Manager,/i,
  ]

  return coverLetter
    .split("\n")
    .filter(
      (line) =>
        line.trim() &&
        !personalInfoPatterns.some((pattern) => pattern.test(line))
    )
    .join("\n")
    .trim()
}

// Styles
const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 50,
    paddingVertical: 40,
    fontFamily: "Helvetica",
    fontSize: 11,
    lineHeight: 1.5,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 30,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#000000",
  },
  headerLeft: {
    flexDirection: "column",
  },
  name: {
    fontSize: 28,
    fontFamily: "Helvetica-Bold",
    textTransform: "uppercase",
    marginBottom: 4,
  },
  applicantTitle: {
    fontSize: 14,
    fontFamily: "Helvetica",
    color: "#333333",
    marginTop: 20,
    lineHeight: 1.2,
  },
  headerRight: {
    flexDirection: "column",
    alignItems: "flex-end",
    fontSize: 10,
    lineHeight: 1.4,
  },
  date: {
    textAlign: "right",
    marginVertical: 20,
    fontSize: 11,
  },
  recipientInfo: {
    marginBottom: 20,
    fontSize: 11,
    lineHeight: 1.4,
  },
  subject: {
    fontFamily: "Helvetica-Bold",
    marginBottom: 20,
    fontSize: 11,
    letterSpacing: 1,
  },
  body: {
    textAlign: "justify",
    fontSize: 11,
    lineHeight: 1.6,
  },
  paragraph: {
    marginBottom: 12,
  },
  closing: {
    marginTop: 20,
  },
  signature: {
    marginTop: 5,
    fontFamily: "Helvetica-Oblique",
  },
})

interface CoverLetterDisplayProps {
  coverLetter: string
  generatedResume: Resume
  jobTitle: string
  company: string
}

interface CoverLetterPDFProps {
  content: string
}

export default function CoverLetterPDF({
  coverLetter,
  generatedResume,
  jobTitle,
  company,
}: {
  coverLetter: string
  generatedResume: Resume
  jobTitle: string
  company: string
}) {
  const today = new Date()
  const formattedDate = today.toLocaleDateString("en-GB", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  const cleanedContent = cleanCoverLetterContent(coverLetter, generatedResume)

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* HEADER */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.name}>{generatedResume.name || "Name"}</Text>
            <Text style={styles.applicantTitle}>
              {generatedResume.personal_info?.professional_title ||
                "Professional"}
            </Text>
          </View>
          <View style={styles.headerRight}>
            <Text>{generatedResume.personal_info?.phone_number || ""}</Text>
            <Text>{generatedResume.email || ""}</Text>
            <Text>{generatedResume.personal_info?.address || ""}</Text>
          </View>
        </View>

        {/* DATE */}
        <Text style={styles.date}>{formattedDate}</Text>

        {/* RECIPIENT INFO */}
        <View style={styles.recipientInfo}>
          <Text>Hiring Manager</Text>
          <Text>{company}</Text>
        </View>

        {/* SUBJECT */}
        <Text style={styles.subject}>
          JOB REFERENCE: {jobTitle.toUpperCase()}
        </Text>

        {/* BODY */}
        <View style={styles.body}>
          <Text style={styles.paragraph}>Dear Hiring Manager,</Text>
          {cleanedContent.split("\n").map((paragraph, index) => (
            <Text key={`paragraph-${index}`} style={styles.paragraph}>
              {paragraph}
            </Text>
          ))}
        </View>

        {/* CLOSING */}
        <View style={styles.closing}>
          <Text>Sincerely,</Text>
          <Text style={styles.signature}>{generatedResume.name || ""}</Text>
        </View>
      </Page>
    </Document>
  )
}
