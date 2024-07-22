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

    if (!destination_link) return new NextResponse('', { status: 200 });

    let scriptContent = '(function() {\n';

    if (utm || ttclid) {
      scriptContent += `
        function getQueryParam(param) {
          var params = new URLSearchParams(window.location.search);
          return params.get(param);
        }\n`;
    }

    let conditions = "";
    if (utm) conditions = "getQueryParam('utm_term') !== '__AID_NAME__'";
    if (ttclid) conditions = (conditions ? conditions + " && " : "") + "getQueryParam('ttclid')";

    if (conditions.length) {
      scriptContent += `
        if (${conditions}) {
          window.location.href = "${destination_link}";
        }\n`;
    } else {
      scriptContent += `
        window.location.href = "${destination_link}";\n`;
    }

    scriptContent += '})();';

    return new NextResponse(scriptContent, { headers: { 'Content-Type': 'application/javascript' } });
  } catch (error) {
    return NextResponse.error(new Error(error.message));
  }
}
