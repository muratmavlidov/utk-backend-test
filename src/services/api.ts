import axios from 'axios';

interface IFormData {
  [key: string]: string
}

export interface IResponseData {
  name: string,
  error: string
}

const fakeData: IResponseData[] = [
  {
    name: "phone",
    error: "Error phone message"
  },
  {
    name: "email",
    error: "Error email message"
  },
  {
    name: "comment",
    error: "Error comment message"
  },
]

export const sendDataFake = (data: IFormData, apiUrl: string) => {
  return new Promise((res, rej) => {
    return setTimeout(() => {
      rej(fakeData)
    }, 200)
  })
}

export const sendData = (data: IFormData, apiUrl: string) => {
  return axios.post(apiUrl, data)
    .then(({ data }) => data)
}
