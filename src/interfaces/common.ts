export interface IResponse {
  success: boolean;
  message: string;
  data: any;
  fromCache: boolean | string;
}
