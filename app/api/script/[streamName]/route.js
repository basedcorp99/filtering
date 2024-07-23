import { NextResponse } from 'next/server';
import pool from '@lib/db';
import { getCache, setCache } from '@lib/cache';

export async function GET(request, { params }) {
  const { streamName } = params;

  try {
      // Perform asynchronous database update
      pool.query(
        'UPDATE entries SET last_access = NOW() WHERE stream_name = $1',
        [streamName]
      ).catch(error => {
        console.error('Failed to update last access time:', error);
      });

    // Check LRU cache first
    const cachedScript = getCache(streamName);
    if (cachedScript) {
      return new NextResponse(cachedScript, {
        headers: { 'Content-Type': 'application/javascript' },
      });
    }

    const { rows } = await pool.query('SELECT safe_link, money_link, money_active, utm, ttclid FROM entries WHERE stream_name = $1', [streamName]);
    const entry = rows[0];

    if (!entry) {
      return NextResponse.error(new Error('Entry not found'));
    }

    const { safe_link, money_link, money_active, utm, ttclid } = entry;

    const dest_link = money_active ? money_link : safe_link;

    if (!dest_link) return new NextResponse('', { status: 200 });

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
          window.location.href = "${dest_link}";
        }\n`;
    } else {
      scriptContent += `
        window.location.href = "${dest_link}";\n`;
    }

    scriptContent += '})();';

    // Cache the script content
    if (money_active) {
      setCache(streamName, scriptContent + "\"fast\"");
    }

    return new NextResponse(scriptContent, {
      headers: { 'Content-Type': 'application/javascript' },
    });

  } catch (error) {
    return NextResponse.error(new Error(error.message));
  }
}
