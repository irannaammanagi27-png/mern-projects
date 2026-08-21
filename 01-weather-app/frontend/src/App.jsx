import { useState } from 'react';

export default function App() {
  const [city, setCity] = useState('Bengaluru');
  const [weather, setWeather] = useState(null);
  const [unit, setUnit] = useState('C');
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState('');

  const search = async event => {
    event?.preventDefault();
    const query = city.trim();
    if (!query) return;
    setStatus('loading');
    setError('');
    try {
      const response = await fetch(`/api/weather?city=${encodeURIComponent(query)}`);
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Weather could not be found.');
      setWeather(data);
      setStatus('success');
    } catch (requestError) {
      setError(requestError.message || 'Something went wrong. Try again.');
      setStatus('error');
    }
  };

  const rawTemperature = Number(weather?.temperature ?? weather?.main?.temp);
  let temperature = '--';
  if (Number.isFinite(rawTemperature)) {
    const convertedTemperature = unit === 'C' ? rawTemperature : (rawTemperature * 9) / 5 + 32;
    temperature = Math.round(convertedTemperature);
  }
  const condition = weather?.condition ?? weather?.weather?.[0]?.description ?? 'No conditions reported';
  const location = weather?.city || city;

  return <main>
    <style>{css}</style>
    <nav><a href="/">weather / now</a><span>OpenWeather powered <b aria-hidden="true">+</b></span></nav>
    <section className="hero">
      <p className="eyebrow">FOUNDATIONAL PROJECT 01 <span>-</span> DAILY CONDITIONS</p>
      <h1>Read the sky<br /><i>before you move.</i></h1>
      <p className="lede">A focused weather dashboard built around one useful question: what does today feel like?</p>
      <form className="search" onSubmit={search}>
        <label htmlFor="city">Search a city</label>
        <div className="search-row"><input id="city" value={city} onChange={event => setCity(event.target.value)} placeholder="Enter a city" autoComplete="address-level2" /><button type="submit" disabled={status === 'loading'}>{status === 'loading' ? 'Checking...' : 'Check weather'} <span aria-hidden="true">-&gt;</span></button></div>
      </form>
      {status === 'error' && <p className="message error" role="alert">{error}</p>}
      {weather && status !== 'error' && <article className="weather" aria-live="polite">
        <div className="weather-heading"><p className="card-label">CURRENTLY IN</p><strong>{location}</strong><p className="condition">{condition}</p></div>
        <div className="temperature"><span>{temperature}</span><button type="button" className="unit" onClick={() => setUnit(unit === 'C' ? 'F' : 'C')} aria-label={`Switch to degrees ${unit === 'C' ? 'Fahrenheit' : 'Celsius'}`}>deg {unit}</button></div>
        <div className="weather-footer"><span>Today, {new Intl.DateTimeFormat('en', { weekday: 'long', month: 'short', day: 'numeric' }).format(new Date())}</span><span className="status-dot">Live conditions</span></div>
      </article>}
      {!weather && status === 'idle' && <p className="hint">Try a city near you, or start with Bengaluru.</p>}
    </section>
  </main>;
}
const css = `@import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=Playfair+Display:ital,wght@0,400;0,600;1,400;1,600&display=swap');
*{box-sizing:border-box}body{margin:0;background:#e6eee9;color:#183d38;font-family:'DM Mono',monospace}main{min-height:100vh;overflow:hidden;position:relative}main:after{background:#d4e4db;content:'';height:62vw;max-height:820px;max-width:820px;opacity:.8;position:absolute;right:-20vw;top:21vh;transform:rotate(24deg);width:62vw;z-index:0}nav,.hero{position:relative;z-index:1}nav{align-items:center;border-bottom:1px solid rgba(24,61,56,.18);display:flex;justify-content:space-between;padding:28px 7vw;font-size:11px;letter-spacing:.08em;text-transform:uppercase}nav a{color:inherit;font-weight:500;text-decoration:none}nav span{color:#52726a}nav b{color:#e17154;font-size:16px;padding-left:8px}.hero{margin:clamp(70px,11vh,140px) auto 80px;max-width:1060px;padding:0 7vw}.eyebrow,.card-label{color:#e17154;font-size:10px;letter-spacing:.16em;margin:0}.eyebrow span{color:#78928a;padding:0 7px}h1{font-family:'Playfair Display',Georgia,serif;font-size:clamp(54px,9vw,112px);font-weight:400;letter-spacing:0;line-height:.91;margin:25px 0 28px;max-width:900px}h1 i{color:#e17154;font-style:italic}.lede{font-family:'Playfair Display',Georgia,serif;font-size:19px;line-height:1.45;margin:0;max-width:430px}.search{border-bottom:1px solid #183d38;margin-top:48px;max-width:620px;padding-bottom:7px}.search label{color:#52726a;display:block;font-size:10px;letter-spacing:.12em;margin-bottom:12px;text-transform:uppercase}.search-row{display:flex;gap:20px}.search input{background:transparent;border:0;color:#183d38;flex:1;font:18px 'DM Mono',monospace;min-width:0;outline:0;padding:9px 0}.search input::placeholder{color:#78928a}.search button{background:#183d38;border:0;color:#f5f2e9;cursor:pointer;font:11px 'DM Mono',monospace;letter-spacing:.04em;padding:0 20px;transition:background .2s,transform .2s}.search button:hover{background:#e17154;transform:translateY(-2px)}.search button:disabled{cursor:wait;opacity:.65}.search button span{font-size:17px;padding-left:12px}.message{font-size:11px;margin:18px 0 0}.error{color:#b64e39}.hint{color:#78928a;font-size:10px;margin:20px 0}.weather{background:#f5f2e9;box-shadow:12px 12px 0 rgba(24,61,56,.1);display:grid;margin-top:46px;max-width:620px;padding:28px 30px 20px}.weather-heading strong{display:block;font-family:'Playfair Display',Georgia,serif;font-size:31px;font-weight:400;margin-top:8px}.condition{color:#52726a;font-size:11px;margin:8px 0 0;text-transform:capitalize}.temperature{align-items:flex-start;display:flex;justify-content:flex-end;line-height:.8;margin-top:-38px}.temperature span{font-family:'Playfair Display',Georgia,serif;font-size:92px}.unit{background:none;border:0;color:#e17154;cursor:pointer;font:14px 'DM Mono',monospace;padding:3px}.weather-footer{border-top:1px solid #d6ddd5;color:#78928a;display:flex;font-size:9px;justify-content:space-between;letter-spacing:.04em;margin-top:30px;padding-top:16px;text-transform:uppercase}.status-dot:before{color:#e17154;content:'â—';padding-right:6px}@media(max-width:600px){nav{padding:23px 6vw}nav span{font-size:9px}.hero{margin-top:76px;padding:0 6vw}.eyebrow{font-size:9px;line-height:1.7}h1{font-size:clamp(51px,15vw,78px);margin-top:22px}.lede{font-size:17px}.search{margin-top:40px}.search-row{display:block}.search input{border-bottom:1px solid rgba(24,61,56,.3);display:block;padding:14px 0;width:100%}.search button{margin-top:12px;padding:15px 18px;width:100%}.weather{padding:24px 20px}.temperature{margin-top:24px;justify-content:flex-start}.temperature span{font-size:78px}.weather-footer{align-items:flex-start;gap:12px;line-height:1.5}.weather-footer span:last-child{text-align:right}main:after{height:80vw;right:-35vw;top:40vh;width:80vw}}`;
