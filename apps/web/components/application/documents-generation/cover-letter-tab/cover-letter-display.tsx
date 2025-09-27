"use client"

import { memo, useEffect, useMemo, useState } from "react"
import {
  BlobProvider,
  Document,
  Page,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer"
import { Download } from "lucide-react"

import { Resume } from "@/types/resume.types"
import { Button } from "@/components/ui/button"

interface CoverLetterDisplayProps {
  coverLetter: string
  generatedResume: Resume
  jobTitle: string
  company: string
}

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

// Simple document component without memo initially
const CoverLetterDocument = ({
  coverLetter,
  generatedResume,
  jobTitle,
  company,
}: {
  coverLetter: string
  generatedResume: Resume
  jobTitle: string
  company: string
}) => {
  // Add safety checks
  if (!generatedResume || !coverLetter || !jobTitle || !company) {
    return (
      <Document>
        <Page size="A4" style={styles.page}>
          <Text>Loading...</Text>
        </Page>
      </Document>
    )
  }

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

const CoverLetterDisplay = ({
  coverLetter,
  generatedResume,
  jobTitle,
  company,
}: CoverLetterDisplayProps) => {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  const memoizedDocument = useMemo(
    () => (
      <CoverLetterDocument
        coverLetter={coverLetter}
        generatedResume={generatedResume}
        jobTitle={jobTitle}
        company={company}
      />
    ),
    [coverLetter, generatedResume, jobTitle, company]
  )

  // Don't render until client-side
  if (!isClient) {
    return <div>Loading PDF generator...</div>
  }

  return (
    <div className="space-y-4">
      <BlobProvider document={memoizedDocument}>
        {({ blob, url, loading, error }) => {
          if (loading) {
            return <div>Loading PDF...</div>
          }
          if (error) {
            console.error("PDF Error:", error)
            return <div>Error generating PDF: {error.message}</div>
          }
          if (blob && url) {
            return (
              <div>
                <div className="flex justify-end mb-4">
                  <Button
                    onClick={() => {
                      const link = document.createElement("a")
                      link.href = url
                      link.download = `${generatedResume.name || "cover"}_letter.pdf`
                      document.body.appendChild(link)
                      link.click()
                      document.body.removeChild(link)
                    }}
                  >
                    <Download className="mr-2 size-4" />
                    Download PDF
                  </Button>
                </div>
                <iframe
                  src={url}
                  className="w-full h-[800px] border rounded-md"
                  title="Cover Letter"
                />
              </div>
            )
          }
          return <div>Generating PDF...</div>
        }}
      </BlobProvider>
    </div>
  )
}

export default CoverLetterDisplay
