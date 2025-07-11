const getHeaders = (authToken?: string) => ({
  "Content-Type": "application/json",
  ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
})

export type APIErrorData = {
  success?: boolean
  message?: string
}

export class APIError extends Error {
  constructor(
    public data: APIErrorData,
    public status: number,
    public statusText: string
  ) {
    super(`API Error: ${status} ${statusText}`)
    this.name = "APIError"
  }
}

export const fetcher =
  <Result, Args = void>(authToken?: string, method: string = "GET") =>
  async (url: string, params?: { arg: Args }) => {
    const response = await fetch(url, {
      headers: getHeaders(authToken),
      method,
      credentials: "include",
      ...(params ? { body: JSON.stringify(params.arg) } : {}),
    })

    if (!response.ok) {
      let data: APIErrorData = {}
      if (response.headers.get("Content-Type") === "application/json") {
        data = await response.json()
      } else {
        data = { message: await response.text() }
      }
      throw new APIError(data, response.status, response.statusText)
    }

    return response.json() as Promise<Result>
  }
