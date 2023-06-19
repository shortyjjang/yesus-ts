import { atom } from "recoil";

export const userInfo = atom({
    key: 'user',
    default: {
      username: '',
      nickname: '',
      expires: new Date(),
    }
})