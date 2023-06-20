export {};

declare global {
  var IMP: {
    init: (key: string) => void;
    request_pay: (params: any) => void;
    naver_zzim: (params: any) => void;
    request_pay: (params: any, callback: (rsp: any) => void) => void;
  }
  var naver: {
    NaverPayButton: {
        apply: (params:any) => void
    }
  }
}