const { execFile } = require('child_process');

function tinyMultipartParser(data) {
  // assume first line is boundary
  const lines = data.split('\r\n');
  const boundary = lines[0];
  const endboundary = `${boundary}--`;
  const boundaries = lines.filter(l => l === boundary).length;

  if (boundaries !== 1) {
    throw new Error(`Unexpected boundaries ${boundaries}`);
  }
  const endboundaries = lines.filter(l => l === endboundary).length;

  if (endboundaries !== 1) {
    throw new Error(`Unexpected end boundaries ${boundaries}`);
  }

  const output = [];
  let inBody = false;
  lines.forEach(line => {
    if (line.trim() === '' && !inBody) {
      inBody = true;
      return;
    }
    if (
      !inBody &&
      line.match(/^content-type: /i) &&
      !line.match(/text\/html/)
    ) {
      throw new Error('not html');
    }
    if (line.indexOf(boundary) > -1) return;
    if (inBody) output.push(line);
  });
  return output.join('\n');
}

function handler(event, context, done) {
  if (!event || !event.body) {
    return done(new Error('No data.'));
  }
  let { body } = event;
  if (event.isBase64Encoded) {
    body = Buffer.from(body, 'base64').toString('ascii');
  }
  const html = tinyMultipartParser(body);
  const opts = {
    timeout: 10 * 1000,
    maxbuffer: 10 * 1024 * 1024,
    encoding: 'buffer'
  };

  const princeCallback = (err, stdout, stderr) => {
    if (err) {
      return done(err);
    }

    const m = stderr.toString().match(/prince:\s+error:\s+([^\n]+)/);
    if (err === null && m) {
      return done(new Error(m[1]));
    }

    return done(null, {
      isBase64Encoded: true,
      statusCode: 200,
      headers: { 'Content-Type': 'application/pdf' },
      body: stdout.toString('base64')
    });
  };

  const child = execFile(
    './prince',
    ['-', '--output=-', '--pdf-profile=PDF/UA-1'],
    opts,
    princeCallback
  );
  child.stdin.write(html);
  child.stdin.end();
  return null;
}

module.exports = {
  handler
};
