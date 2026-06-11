const fetch = require('node-fetch');
async function test() {
  const WC2026_KEY = 'EAbv3XCF8wzJs5cc';
  const res = await fetch(`https://worldcupapi.com/api/fixtures?key=${WC2026_KEY}&date=2026-06-11`);
  const data = await res.json();
  console.log(JSON.stringify(data, null, 2));
}
test();
