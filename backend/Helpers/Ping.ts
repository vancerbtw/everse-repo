import ping from "net-ping";


export default class Ping {
  private session: any;

  constructor() {
    this.session = ping.createSession();
  }

  check(endpoint: string) {
    return new Promise<any>(
      (resolve, reject) => {
        this.session.pingHost(endpoint, function (e: any) {
          if (e) {
            reject()
          } else {
            resolve()
          }
      });
     }
   );
  }
}