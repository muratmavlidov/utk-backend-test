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

export const sendFakeUploadImage = (data: any, apiUrl: string) => {
  return new Promise((res, rej) => {
    return setTimeout(() => {
      res('https://lh3.googleusercontent.com/proxy/PoBz4AknoRVUdoIuoaaOMj5hjWNRZcM_K9ryXUuw7JCSsY83FPoF4DULgBXvnbfB0JgdB7dPyvfR0sHHBj84FG4E_vQ0wHlcLpNgnQ')
    }, 200)
  })
}

export const sendData = (data: IFormData, apiUrl: string) => {
  return axios.post(apiUrl, data)
    .then(({ data }) => data)
}

export const sendUploadImage = (data: any, apiUrl:string) => {
  return axios({
    method: 'post',
    url: apiUrl,
    data,
    headers: {'Content-Type': 'multipart/form-data' }
  }).then(({ data }) => data)
}
