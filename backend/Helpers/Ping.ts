import ping from "ping";


export default class Ping {
  check(endpoint: string) {
    return new Promise<any>((resolve, reject) => {
      console.log(endpoint)
      ping.promise.probe(endpoint, {
        timeout: 10,
        extra: ['-i', '2'],
    }).then((res) => {
        if (res.alive) {
          resolve(res);
        } else {
          reject(res)
        }
      });
    });
  }
}