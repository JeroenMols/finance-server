import https from 'https';

export function httpsGet(url: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const req = https.get(url, (res) => {
      let data = '';

      res.on('data', (chunk) => (data += chunk));
      res.on('error', reject);
      res.on('end', () => {
        const { statusCode } = res;
        const validResponse = statusCode !== undefined && statusCode >= 200 && statusCode <= 299;

        if (validResponse) resolve(data);
        else reject(new Error(`Request failed. status: ${statusCode}`));
      });
    });

    req.on('error', reject);
    req.end();
  });
}
