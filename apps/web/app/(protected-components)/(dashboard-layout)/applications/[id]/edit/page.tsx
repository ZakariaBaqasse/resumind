import ApplicationEdit from "@/components/application/edit"

interface PageProps {
  params: Promise<{
    id: string
  }>
}

export default async function Page({ params }: PageProps) {
  const { id } = await params
  return <ApplicationEdit applicationId={id} />
}
