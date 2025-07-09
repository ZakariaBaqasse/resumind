import { Loader2 } from "lucide-react"

const PageLoader = () => {
  return (
    <div className="flex items-center justify-center w-screen h-screen overflow-hidden">
      <Loader2 className="w-8 h-8 animate-spin text-primary" />
    </div>
  )
}

export default PageLoader
