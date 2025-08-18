export const USER_BACKEND_ROUTES = {
  getUser: "/user/get",
  saveResume: "/user/resume/save",
  uploadResume: "/user/resume/upload",
  getResumeStatus: "/user/resume/status",
}

export const APPLICATION_BACKEND_ROUTES = {
  stream: (id: string, token: string) => `/application/${id}/stream/${token}`,
  start_generation: "/application/start-generation",
}
