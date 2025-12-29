'use server'
import {
  Storage,
  Save,
  ResponseFile,
  SaveFiles,
  ResponseFiles,
  Update,
  Delete,
  DeleteFiles,
} from '@/interfaces/storage'

const storage: Storage = {
  url: `${process.env.STORAGE_API_URL}/storage`,
  headers: {
    token: process.env.STORAGE_API_TOKEN!,
  },
}

export async function storageSave({ file, folder, subfolder = '' }: Save) {
  try {
    const params = new URLSearchParams({ folder })
    if (subfolder) params.append('subfolder', subfolder)

    const url = new URL(`${storage.url}/save`)
    url.search = params.toString()

    const body = new FormData()
    body.append('file', file)

    const request = await fetch(url, {
      method: 'POST',
      body,
      headers: storage.headers,
    })
    const response: ResponseFile = await request.json()

    return response.url
  } catch (error) {
    throw error
  }
}

export async function storageSaveFiles({
  files,
  folder,
  subfolder = '',
}: SaveFiles) {
  try {
    const params = new URLSearchParams({ folder })
    if (subfolder) params.append('subfolder', subfolder)

    const url = new URL(`${storage.url}/save-files`)
    url.search = params.toString()

    const body = new FormData()
    files.forEach((file) => {
      body.append('files', file)
    })

    const request = await fetch(url, {
      method: 'POST',
      body,
      headers: storage.headers,
    })
    const response: ResponseFiles = await request.json()

    return response.urls
  } catch (error) {
    throw error
  }
}

export async function storageUpdate({ file, oldFileName }: Update) {
  try {
    const params = new URLSearchParams({ oldFileName })

    const url = new URL(`${storage.url}/update`)
    url.search = params.toString()

    const body = new FormData()
    body.append('file', file)

    const request = await fetch(url, {
      method: 'PUT',
      body,
      headers: storage.headers,
    })
    const response: ResponseFile = await request.json()

    return response.url
  } catch (error) {
    throw error
  }
}

export async function storageDelete({ fileName }: Delete) {
  try {
    const params = new URLSearchParams({ fileName })

    const url = new URL(`${storage.url}/delete`)
    url.search = params.toString()

    const request = await fetch(url, {
      method: 'DELETE',
      headers: storage.headers,
    })
    const response: ResponseFile = await request.json()

    return response.url
  } catch (error) {
    throw error
  }
}

export async function storageDeleteFiles({ fileNames }: DeleteFiles) {
  try {
    const url = new URL(`${storage.url}/delete-files`)

    const request = await fetch(url, {
      method: 'DELETE',
      body: JSON.stringify({
        fileNames,
      }),
      headers: storage.headers,
    })
    const response: ResponseFiles = await request.json()

    return response.urls
  } catch (error) {
    throw error
  }
}
