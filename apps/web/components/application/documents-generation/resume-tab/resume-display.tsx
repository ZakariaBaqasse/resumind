"use client"

import { memo, useMemo } from "react"
import {
  BlobProvider,
  Document,
  Link,
  Page,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer"
import { Download } from "lucide-react"

import { Resume } from "@/types/resume.types"
import { Button } from "@/components/ui/button"

interface ResumeDisplayProps {
  resume: Resume
}

// Create styles
const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 40,
    paddingVertical: 30,
    fontFamily: "Helvetica",
    fontSize: 10,
    lineHeight: 1.4,
  },
  // Header
  headerContainer: {
    marginBottom: 10,
  },
  name: {
    fontSize: 36,
    fontFamily: "Helvetica-Bold",
    textTransform: "uppercase",
    textAlign: "center",
    marginBottom: 8,
    lineHeight: 1.2,
  },
  jobTitle: {
    fontSize: 14,
    fontFamily: "Helvetica",
    textAlign: "center",
    marginBottom: 20,
  },
  contactInfoContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    fontSize: 9,
    textAlign: "left",
  },
  contactInfoItem: {
    width: "33%",
    marginBottom: 4,
  },
  contactInfoLabel: {
    fontFamily: "Helvetica-Bold",
  },
  link: {
    color: "black",
    textDecoration: "none",
  },
  headerLine: {
    borderBottomWidth: 1,
    borderBottomColor: "#000000",
    marginTop: 10,
    marginBottom: 10,
  },

  // Section
  section: {
    marginBottom: 10,
  },
  sectionTitleContainer: {
    borderBottomWidth: 1.5,
    borderBottomColor: "#000000",
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 12,
    fontFamily: "Helvetica-Bold",
    textAlign: "center",
    textTransform: "uppercase",
    letterSpacing: 2,
    paddingBottom: 2,
  },

  // Content
  summary: {
    fontSize: 10,
    textAlign: "justify",
  },
  entryContainer: {
    marginBottom: 10,
  },
  entryHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 2,
  },
  entryTitle: {
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
  },
  entrySubtitle: {
    fontSize: 10,
    fontFamily: "Helvetica",
  },
  entryDate: {
    fontSize: 10,
    fontFamily: "Helvetica",
  },
  entryResponsibilities: {
    fontSize: 10,
    marginTop: 3,
  },

  // Skills
  skillEntry: {
    flexDirection: "row",
    marginBottom: 3,
    fontSize: 10,
  },
  skillCategory: {
    width: "18%",
    fontFamily: "Helvetica-Bold",
  },
  skillList: {
    width: "82%",
    fontFamily: "Helvetica",
  },

  // Hobbies
  hobbiesContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    fontSize: 10,
    marginTop: 5,
  },
})

const ResumeDocument = ({ resume }: { resume: Resume }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* --- HEADER --- */}
      <View style={styles.headerContainer}>
        <Text style={styles.name}>{resume.name}</Text>
        <Text style={styles.jobTitle}>
          {resume.personal_info.professional_title}
        </Text>

        <View style={styles.contactInfoContainer}>
          <Text style={styles.contactInfoItem}>
            <Text style={styles.contactInfoLabel}>Phone: </Text>
            {resume.personal_info.phone_number}
          </Text>
          <Text style={styles.contactInfoItem}>
            <Text style={styles.contactInfoLabel}>Email: </Text>
            {resume.email}
          </Text>
          <Text style={styles.contactInfoItem}>
            <Text style={styles.contactInfoLabel}>Address: </Text>
            {resume.personal_info.address}
          </Text>

          {resume.personal_info.contact_links?.map((link) => (
            <Link
              key={link.url}
              src={link.url}
              style={{ ...styles.link, ...styles.contactInfoItem }}
            >
              <Text>
                <Text style={styles.contactInfoLabel}>
                  {link.platform.charAt(0).toUpperCase() +
                    link.platform.slice(1)}
                  :{" "}
                </Text>
                {link.url.replace("https://www.", "").replace("https://", "")}
              </Text>
            </Link>
          ))}
        </View>
      </View>

      {/* --- SUMMARY --- */}
      <View style={styles.section}>
        <View style={styles.sectionTitleContainer}>
          <Text style={styles.sectionTitle}>Professional Summary</Text>
        </View>
        <Text style={styles.summary}>{resume.personal_info.summary}</Text>
      </View>

      {/* --- WORK EXPERIENCE --- */}
      {resume.work_experiences && resume.work_experiences.length > 0 && (
        <View style={styles.section}>
          <View style={styles.sectionTitleContainer}>
            <Text style={styles.sectionTitle}>Work Experience</Text>
          </View>
          {resume.work_experiences.map((job, index) => (
            <View key={index} style={styles.entryContainer}>
              <View style={styles.entryHeader}>
                <Text style={styles.entryTitle}>{job.position}</Text>
                <Text style={styles.entryDate}>
                  {job.start_date} - {job.end_date || "Present"}
                </Text>
              </View>
              <Text style={styles.entrySubtitle}>{job.company_name}</Text>
              <Text style={styles.entryResponsibilities}>
                {(job.responsibilities || "")
                  .trim()
                  .split("\\n")
                  .map((item, key) => (
                    <Text key={key}>• {item.trim()}\n</Text>
                  ))}
              </Text>
            </View>
          ))}
        </View>
      )}

      {/* --- SKILLS --- */}
      {resume.skills && resume.skills.length > 0 && (
        <View style={styles.section}>
          <View style={styles.sectionTitleContainer}>
            <Text style={styles.sectionTitle}>Skills</Text>
          </View>
          {Object.entries(
            (resume.skills || []).reduce(
              (acc, skill) => {
                const category = (skill as any).category || "Technical"
                if (!acc[category]) {
                  acc[category] = []
                }
                acc[category].push(skill.name)
                return acc
              },
              {} as Record<string, string[]>
            )
          ).map(([category, skills], index) => (
            <View key={index} style={styles.skillEntry}>
              <Text style={styles.skillCategory}>{category}:</Text>
              <Text style={styles.skillList}>{skills.join(", ")}</Text>
            </View>
          ))}
        </View>
      )}

      {/* --- EDUCATION --- */}
      {resume.educations && resume.educations.length > 0 && (
        <View style={styles.section}>
          <View style={styles.sectionTitleContainer}>
            <Text style={styles.sectionTitle}>Education</Text>
          </View>
          {resume.educations.map((edu, index) => (
            <View key={index} style={styles.entryContainer}>
              <View style={styles.entryHeader}>
                <Text style={styles.entryTitle}>
                  {edu.degree}
                  {edu.field_of_study ? `, ${edu.field_of_study}` : ""}
                </Text>
                <Text style={styles.entryDate}>
                  {edu.start_date} - {edu.end_date || "Present"}
                </Text>
              </View>
              <Text style={styles.entrySubtitle}>{edu.institution}</Text>
            </View>
          ))}
        </View>
      )}

      {/* --- HOBBIES --- */}
      {resume.hobbies && resume.hobbies.length > 0 && (
        <View style={styles.section}>
          <View style={styles.sectionTitleContainer}>
            <Text style={styles.sectionTitle}>Hobbies</Text>
          </View>
          <View style={styles.hobbiesContainer}>
            {resume.hobbies.map((hobby, index) => (
              <Text key={index}>• {hobby}</Text>
            ))}
          </View>
        </View>
      )}

      {/* --- PROJECTS --- */}
      {resume.projects && resume.projects.length > 0 && (
        <View style={styles.section}>
          <View style={styles.sectionTitleContainer}>
            <Text style={styles.sectionTitle}>Projects</Text>
          </View>
          {resume.projects.map((project, index) => (
            <View key={index} style={styles.entryContainer}>
              <Text style={styles.entryTitle}>{project.title}</Text>
              <Text style={styles.entryResponsibilities}>
                {project.description}
              </Text>
              {project.technologies && project.technologies.length > 0 && (
                <Text style={styles.entryResponsibilities}>
                  <Text style={{ fontFamily: "Helvetica-Bold" }}>
                    Technologies:{" "}
                  </Text>
                  {project.technologies.join(", ")}
                </Text>
              )}
            </View>
          ))}
        </View>
      )}

      {/* --- CERTIFICATIONS --- */}
      {resume.certifications && resume.certifications.length > 0 && (
        <View style={styles.section}>
          <View style={styles.sectionTitleContainer}>
            <Text style={styles.sectionTitle}>Certifications</Text>
          </View>
          {resume.certifications.map((cert, index) => (
            <View key={index} style={styles.entryContainer}>
              <View style={styles.entryHeader}>
                <Text style={styles.entryTitle}>{cert.name}</Text>
                <Text style={styles.entryDate}>{cert.issue_date}</Text>
              </View>
              <Text style={styles.entrySubtitle}>{cert.issuer}</Text>
            </View>
          ))}
        </View>
      )}

      {/* --- AWARDS --- */}
      {resume.awards && resume.awards.length > 0 && (
        <View style={styles.section}>
          <View style={styles.sectionTitleContainer}>
            <Text style={styles.sectionTitle}>Awards</Text>
          </View>
          {resume.awards.map((award, index) => (
            <View key={index} style={styles.entryContainer}>
              <View style={styles.entryHeader}>
                <Text style={styles.entryTitle}>{award.title}</Text>
                {award.date && (
                  <Text style={styles.entryDate}>{award.date}</Text>
                )}
              </View>
              <Text style={styles.entrySubtitle}>{award.issuer}</Text>
              {award.description && (
                <Text style={styles.entryResponsibilities}>
                  {award.description}
                </Text>
              )}
            </View>
          ))}
        </View>
      )}

      {/* --- LANGUAGES --- */}
      {resume.languages && resume.languages.length > 0 && (
        <View style={styles.section}>
          <View style={styles.sectionTitleContainer}>
            <Text style={styles.sectionTitle}>Languages</Text>
          </View>
          <View style={styles.hobbiesContainer}>
            {resume.languages.map((lang, index) => (
              <Text key={index}>
                {lang.name} ({lang.proficiency})
              </Text>
            ))}
          </View>
        </View>
      )}
    </Page>
  </Document>
)

const ResumeDisplay = memo(({ resume }: ResumeDisplayProps) => {
  const memoizedResume = useMemo(
    () => <ResumeDocument resume={resume} />,
    [JSON.stringify(resume)]
  )

  return (
    <div className="space-y-4">
      <BlobProvider document={memoizedResume}>
        {({ blob, url, loading, error }) => {
          if (loading) {
            return <div>Loading PDF...</div>
          }
          if (error) {
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
                      link.download = `${resume.name}_resume.pdf`
                      document.body.appendChild(link)
                      link.click()
                      document.body.removeChild(link)
                    }}
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Download PDF
                  </Button>
                </div>
                <iframe
                  src={url}
                  className="w-full h-[800px] border rounded-md"
                  title="Resume"
                ></iframe>
              </div>
            )
          }
          return <div>Generating PDF...</div>
        }}
      </BlobProvider>
    </div>
  )
})

export default ResumeDisplay
