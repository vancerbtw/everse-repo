import zlib from "zlib";

export async function gzip(data: string) {
  return new Promise<Buffer>(
    (resolve, reject) => {
      zlib.gzip(data, (err, result) => {
        if (err) reject(err);
        resolve(result);
      });
   }
 );
}