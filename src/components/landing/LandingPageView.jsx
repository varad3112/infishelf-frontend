import { useEffect } from 'react';

export function LandingPageView({
  onOpenLogin,
  onOpenRegister,
}) {
  useEffect(() => {
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.12 });
      document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
      return () => observer.disconnect();
    } else {
      document.querySelectorAll('.reveal').forEach((el) => el.classList.add('visible'));
    }
  }, []);

  return (
    <div id="home">
<section className="wrap hero">
  <div className="hero-copy reveal">
    <div className="eyebrow"><span className="dot"></span> A smarter way to manage your shelf</div>
    <h1>Your products.<br /><span>All in one place.</span></h1>
    <p>Bring every product into focus. Discover your catalog, keep details in sync, and find the right item without the busywork.</p>
    <div className="hero-ctas"><button className="btn primary" onClick={onOpenLogin}><span>Sign In to Catalog</span> <span aria-hidden="true">→</span></button><a className="btn" href="#platform">See how it works</a></div>
    <div className="micro-proof"><div className="avatars"><span>01</span><span>02</span><span>03</span></div><span>A clearer view of every product, from shelf to search.</span></div>
  </div>
  <div className="hero-art reveal"><img src="/hero-art.png" alt="Isometric illustration of product shelves connected to a mobile product catalog interface" /><div className="floating-note"><strong>One connected catalog</strong>Every item, easy to find.</div></div>
</section>

<section className="section white" id="platform">
  <div className="wrap">
    <div className="section-head reveal"><span className="kicker">A better way to work</span><h2>From crowded shelves<br />to a clearer picture.</h2><p>Make product information easier to manage, easier to understand, and easier to find.</p></div>
    <article className="story reveal">
      <div className="story-art">
        <svg viewBox="0 0 440 330" role="img" aria-label="Illustration of neatly organized product shelves">
          <defs><linearGradient id="shelfBlue" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#60c9e7"/><stop offset="1" stopColor="#2563eb"/></linearGradient></defs>
          <ellipse cx="218" cy="294" rx="158" ry="14" fill="#dbeafe"/>
          <g transform="translate(72 34)">
            <path d="M25 34 238 0 286 28 73 63Z" fill="#bfdbfe"/><path d="M73 63 286 28v198L73 262Z" fill="#1e3a8a"/><path d="M25 34 73 63v199L25 231Z" fill="#2563eb"/>
            <g fill="#eff6ff" stroke="#dbeafe" strokeWidth="1"><path d="M35 44 238 12 273 31 70 64Z"/><path d="M35 98 238 66 273 85 70 118Z"/><path d="M35 152 238 120 273 139 70 172Z"/><path d="M35 206 238 174 273 193 70 226Z"/></g>
            <g fill="url(#shelfBlue)"><path d="M48 24 67 21 67 53 48 56Z"/><path d="M81 19 100 16 100 48 81 51Z"/><path d="M114 14 133 11 133 43 114 46Z"/><path d="M147 9 166 6 166 38 147 41Z"/><path d="M180 4 199 1 199 33 180 36Z"/></g>
            <g fill="#f8fafc"><path d="M49 78 66 75 66 108 49 111Z"/><path d="M79 73 96 70 96 103 79 106Z"/><path d="M109 68 126 65 126 98 109 101Z"/><path d="M139 63 156 60 156 93 139 96Z"/><path d="M169 58 186 55 186 88 169 91Z"/><path d="M199 53 216 50 216 83 199 86Z"/></g>
            <g fill="#7dd3fc"><path d="M48 132 65 129 65 162 48 165Z"/><path d="M78 127 95 124 95 157 78 160Z"/><path d="M108 122 125 119 125 152 108 155Z"/><path d="M138 117 155 114 155 147 138 150Z"/><path d="M168 112 185 109 185 142 168 145Z"/><path d="M198 107 215 104 215 137 198 140Z"/></g>
            <g fill="#f8fafc"><path d="M48 186 65 183 65 216 48 219Z"/><path d="M78 181 95 178 95 211 78 214Z"/><path d="M108 176 125 173 125 206 108 209Z"/><path d="M138 171 155 168 155 201 138 204Z"/><path d="M168 166 185 163 185 196 168 199Z"/><path d="M198 161 215 158 215 191 198 194Z"/></g>
            <g fill="#2563eb"><path d="M25 88 238 54 286 82 73 117Z"/><path d="M25 142 238 108 286 136 73 171Z"/><path d="M25 196 238 162 286 190 73 225Z"/></g>
          </g>
          <g transform="translate(280 185)"><rect x="0" y="0" width="84" height="76" rx="13" fill="#fff" stroke="#bfdbfe" strokeWidth="2"/><rect x="12" y="12" width="25" height="25" rx="6" fill="#dbeafe"/><path d="M18 28h13M24 21v14" stroke="#2563eb" strokeWidth="2" strokeLinecap="round"/><path d="M46 17h25M46 26h19M12 51h58M12 59h44" stroke="#94a3b8" strokeWidth="4" strokeLinecap="round"/><circle cx="68" cy="11" r="5" fill="#059669"/></g>
        </svg>
      </div>
      <div className="story-copy"><span className="step">01 / Bring order to your catalog</span><h3>Every product has its place.</h3><p>Keep names, brands, categories, descriptions, prices, and images together in one thoughtfully organized space. Less hunting around, more confidence in the details.</p><ul className="checks"><li><span className="check">✓</span><span>Consistent product details at a glance</span></li><li><span className="check">✓</span><span>Images and categories that make items recognizable</span></li><li><span className="check">✓</span><span>A catalog that stays easy to browse as it grows</span></li></ul></div>
    </article>

    <article className="story reverse reveal">
      <div className="story-art">
        <svg viewBox="0 0 440 330" role="img" aria-label="Illustration of natural language search finding relevant products">
          <ellipse cx="220" cy="286" rx="158" ry="15" fill="#dbeafe"/>
          <rect x="62" y="51" width="316" height="218" rx="22" fill="#fff" stroke="#dbeafe" strokeWidth="2"/>
          <rect x="82" y="72" width="276" height="48" rx="12" fill="#f8fafc" stroke="#cbd5e1"/><circle cx="103" cy="95" r="7" fill="none" stroke="#64748b" strokeWidth="2.5"/><path d="m108 100 6 6" stroke="#64748b" strokeWidth="2.5" strokeLinecap="round"/><path d="M128 95h168" stroke="#94a3b8" strokeWidth="5" strokeLinecap="round"/><circle cx="335" cy="95" r="12" fill="#2563eb"/><path d="M330 95h10M335 90v10" stroke="#fff" strokeWidth="2" strokeLinecap="round"/>
          <g><rect x="82" y="139" width="82" height="107" rx="12" fill="#eff6ff"/><rect x="177" y="139" width="82" height="107" rx="12" fill="#eef2ff"/><rect x="272" y="139" width="86" height="107" rx="12" fill="#f1f5f9"/></g>
          <g transform="translate(101 153)"><rect x="6" y="12" width="31" height="49" rx="7" fill="#38bdf8"/><rect x="13" y="3" width="17" height="14" rx="4" fill="#2563eb"/><rect x="12" y="27" width="19" height="14" rx="3" fill="#dbeafe"/></g>
          <g transform="translate(197 151)"><path d="M14 7h25l4 13v43H10V20Z" fill="#818cf8"/><rect x="18" y="1" width="17" height="9" rx="3" fill="#4f46e5"/><rect x="15" y="30" width="23" height="14" rx="3" fill="#e0e7ff"/></g>
          <g transform="translate(292 154)"><rect x="5" y="10" width="42" height="48" rx="5" fill="#2563eb"/><path d="M5 22h42" stroke="#93c5fd" strokeWidth="3"/><rect x="14" y="31" width="24" height="15" rx="2" fill="#bfdbfe"/></g>
          <g stroke="#94a3b8" strokeWidth="4" strokeLinecap="round"><path d="M92 229h61"/><path d="M187 229h61"/><path d="M282 229h65"/></g>
          <path d="M118 40c20-20 47-21 65-7" fill="none" stroke="#2563eb" strokeWidth="3" strokeLinecap="round" strokeDasharray="4 7"/><path d="m175 25 11 8-12 4" fill="none" stroke="#2563eb" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
          <rect x="244" y="24" width="116" height="34" rx="17" fill="#dcfce7" stroke="#a7f3d0"/><circle cx="260" cy="41" r="4" fill="#059669"/><path d="M272 41h74" stroke="#059669" strokeWidth="4" strokeLinecap="round"/>
        </svg>
      </div>
      <div className="story-copy"><span className="step">02 / Find the right thing, faster</span><h3>Search the way you think.</h3><p>Look beyond exact product names. Describe what you're looking for in everyday language and get closer to the items that fit your needs.</p><ul className="checks"><li><span className="check">✓</span><span>Search across product names, brands, and descriptions</span></li><li><span className="check">✓</span><span>Narrow results by category and price</span></li><li><span className="check">✓</span><span>Sort and browse results without losing your place</span></li></ul></div>
    </article>

    <article className="story reveal">
      <div className="story-art">
        <svg viewBox="0 0 440 330" role="img" aria-label="Illustration of a product card being edited and saved">
          <ellipse cx="218" cy="286" rx="154" ry="14" fill="#dbeafe"/>
          <rect x="61" y="43" width="207" height="224" rx="18" fill="#fff" stroke="#cbd5e1" strokeWidth="2"/>
          <rect x="78" y="60" width="173" height="32" rx="8" fill="#eff6ff"/><circle cx="92" cy="76" r="4" fill="#2563eb"/><path d="M105 76h92" stroke="#93c5fd" strokeWidth="4" strokeLinecap="round"/>
          <rect x="79" y="105" width="75" height="84" rx="10" fill="#dbeafe"/><rect x="99" y="125" width="34" height="48" rx="7" fill="#38bdf8"/><rect x="108" y="117" width="16" height="11" rx="4" fill="#2563eb"/><path d="M91 180h50" stroke="#93c5fd" strokeWidth="3" strokeLinecap="round"/>
          <g stroke="#cbd5e1" strokeWidth="5" strokeLinecap="round"><path d="M169 115h70"/><path d="M169 130h55"/><path d="M169 154h70"/><path d="M169 169h49"/></g>
          <rect x="79" y="204" width="172" height="43" rx="9" fill="#f8fafc" stroke="#e2e8f0"/><path d="M94 219h45M94 232h77" stroke="#94a3b8" strokeWidth="4" strokeLinecap="round"/>
          <g transform="translate(244 127) rotate(7)"><rect x="0" y="0" width="133" height="144" rx="16" fill="#fff" stroke="#bfdbfe" strokeWidth="2"/><rect x="14" y="14" width="105" height="61" rx="9" fill="#eff6ff"/><path d="M38 30h56v29H38Z" fill="#2563eb"/><path d="M38 39h56" stroke="#7dd3fc" strokeWidth="4"/><path d="M16 91h96M16 105h72" stroke="#cbd5e1" strokeWidth="5" strokeLinecap="round"/><rect x="16" y="117" width="101" height="17" rx="8.5" fill="#dcfce7"/><path d="m29 125 4 4 7-8" stroke="#059669" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/></g>
          <circle cx="321" cy="83" r="23" fill="#2563eb"/><path d="m311 83 7 7 14-16" stroke="#fff" strokeWidth="3.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
      <div className="story-copy"><span className="step">03 / Keep every detail up to date</span><h3>Make changes without the friction.</h3><p>Add a new item, refine its details, or remove something that no longer belongs. Product management should feel straightforward from the first click to the final save.</p><ul className="checks"><li><span className="check">✓</span><span>Create and update product information in a few steps</span></li><li><span className="check">✓</span><span>Keep descriptions, tags, pricing, and imagery together</span></li><li><span className="check">✓</span><span>Review details before making changes</span></li></ul><a className="btn soft" href="#features" style={{ marginTop: '24px' }}>Explore the features →</a></div>
    </article>
  </div>
</section>

<section className="section" id="features">
  <div className="wrap">
    <div className="section-head reveal"><span className="kicker">Everything in its place</span><h2>Small details. A smoother workflow.</h2><p>The everyday essentials, brought together in one clear and considered experience.</p></div>
    <div className="feature-strip">
      <article className="feature-card reveal"><div className="feature-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="10.5" cy="10.5" r="6.5"/><path d="m15.5 15.5 5 5M7.5 10.5h6M10.5 7.5v6"/></svg></div><h3>Find with confidence</h3><p>Search, filter, and sort your way through the catalog without unnecessary steps.</p></article>
      <article className="feature-card reveal"><div className="feature-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M4 7.5 12 3l8 4.5v9L12 21l-8-4.5z"/><path d="m4.5 7.5 7.5 4.3 7.5-4.3M12 12v9"/></svg></div><h3>Know your catalog</h3><p>See category mix, price ranges, and product details in a more useful context.</p></article>
      <article className="feature-card reveal"><div className="feature-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1m8.6 8.6 2.1 2.1m0-12.8-2.1 2.1m-8.6 8.6-2.1 2.1"/><circle cx="12" cy="12" r="5"/><path d="m10 12 1.3 1.3L14.5 10"/></svg></div><h3>Give products a head start</h3><p>Use helpful AI-assisted descriptions and tags to reduce repetitive catalog work.</p></article>
    </div>
  </div>
</section>
    </div>
  );
}
