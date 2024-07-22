import { NextResponse } from 'next/server';
import pool from '../../../../lib/db';

export async function GET(request, { params }) {
  const { streamName } = params;

  try {
    const { rows } = await pool.query('SELECT * FROM entries WHERE stream_name = $1', [streamName]);
    const entry = rows[0];

    if (!entry) {
      return NextResponse.error(new Error('Entry not found'));
    }

    const { destination_link, utm, ttclid } = entry;

    if (!destination_link) {
      return NextResponse.json('Nothing');
    }

    let scriptContent = `
      (function() {
        function getQueryParam(param) {
          var params = new URLSearchParams(window.location.search);
          return params.get(param);
        }
    `;

    if (utm && ttclid) {
      scriptContent += `
        if (getQueryParam('ttclid') && getQueryParam('utm_term') !== '__AID_NAME__') {
          window.location.href = "${destination_link}";
        }
      `;
    } else if (utm) {
      scriptContent += `
        if (getQueryParam('utm_term') !== '__AID_NAME__') {
          window.location.href = "${destination_link}";
        }
      `;
    } else if (ttclid) {
      scriptContent += `
        if (getQueryParam('ttclid')) {
          window.location.href = "${destination_link}";
        }
      `;
    } else {
      scriptContent += `
        window.location.href = "${destination_link}";
      `;
    }

    scriptContent += `
      })();
    `;

    return new NextResponse(scriptContent, { headers: { 'Content-Type': 'application/javascript' } });
  } catch (error) {
    return NextResponse.error(new Error(error.message));
  }
}
