export interface Storage {
  url: string
  headers: HeadersInit
}

export interface ResponseFile {
  url: string
}

export interface ResponseFiles {
  urls: string[]
}

export interface Save {
  file: File
  folder: string
  subfolder?: string
}

export interface SaveFiles {
  files: File[]
  folder: string
  subfolder?: string
}

export interface Update {
  file: File
  oldFileName: string
}

export interface Delete {
  fileName: string
}

export interface DeleteFiles {
  fileNames: string[]
}
