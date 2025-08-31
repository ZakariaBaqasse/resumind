export const USER_BACKEND_ROUTES = {
  getUser: "/user/get",
  saveResume: "/user/resume/save",
  uploadResume: "/user/resume/upload",
  getResumeStatus: "/user/resume/status",
}

export const APPLICATION_BACKEND_ROUTES = {
  stream: (id: string, token: string) => `/application/${id}/stream/${token}`,
  start_generation: "/application/start-generation",
  listJobApplications: "/application/list",
  searchJobApplications: "/application/search",
  getStats: "/application/stats",
  deleteJobApplication: (id: string) => `/application/${id}`,
  getJobApplication: (id: string) => `/application/${id}`,
  updateGeneratedResume: (id: string) => `/application/${id}/resume`,
  updateGeneratedCoverLetter: (id: string) => `/application/${id}/cover-letter`,
}
