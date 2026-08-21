import { useEffect, useMemo, useState } from 'react';

const starterPosts = [
  { _id: 'starter-build', title: 'Build in public', excerpt: 'Small, shipped increments compound.', content: 'Start with a useful slice and keep learning from it.', author: 'Cognetix' },
];

export default function App() {
  const [posts, setPosts] = useState([]);
  const [title, setTitle] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [author, setAuthor] = useState('You');
  const [search, setSearch] = useState('');
  const [view, setView] = useState('latest');
  const [liked, setLiked] = useState(() => new Set());
  const [saved, setSaved] = useState(() => new Set());
  const [expanded, setExpanded] = useState(() => new Set());
  const [status, setStatus] = useState('');
  const [isPublishing, setIsPublishing] = useState(false);

  const loadPosts = async () => {
    try {
      const response = await fetch('/api/posts');
      if (!response.ok) throw new Error('Unable to load stories.');
      const data = await response.json();
      setPosts(data.length ? data : starterPosts);
    } catch {
      setPosts(starterPosts);
      setStatus('Showing an offline reading list.');
    }
  };

  useEffect(() => { loadPosts(); }, []);

  const filteredPosts = useMemo(() => posts.filter(post => {
    const matchesSearch = `${post.title} ${post.excerpt} ${post.author}`.toLowerCase().includes(search.toLowerCase());
    return matchesSearch && (view === 'latest' || saved.has(post._id || post.title));
  }), [posts, search, view, saved]);

  const publish = async event => {
    event.preventDefault();
    if (!title.trim()) return;
    setIsPublishing(true);
    try {
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: title.trim(), excerpt: excerpt.trim() || 'A new perspective from the field.', content: content.trim() || 'Write the full story here.', author: author.trim() || 'You', published: true }),
      });
      if (!response.ok) throw new Error('Could not publish this story.');
      setTitle('');
      setExcerpt('');
      setContent('');
      setStatus('Story published.');
      await loadPosts();
    } catch (error) {
      setStatus(error.message);
    } finally {
      setIsPublishing(false);
    }
  };

  const toggleSetValue = (setter, id) => setter(current => {
    const next = new Set(current);
    next.has(id) ? next.delete(id) : next.add(id);
    return next;
  });

  const share = async post => {
    const shareUrl = `${window.location.origin}/#${encodeURIComponent(post.title)}`;
    try {
      await navigator.clipboard.writeText(shareUrl);
      setStatus('Story link copied to your clipboard.');
    } catch {
      setStatus('Story link ready: ' + shareUrl);
    }
  };

  return <main>
    <style>{css}</style>
    <nav>
      <a className="brand" href="/">THE FIELD NOTES</a>
      <span className="tagline">Stories for people making things</span>
      <div className="socials" aria-label="Social links">
        <a href="https://www.instagram.com/" target="_blank" rel="noreferrer">Instagram</a>
        <a href="https://www.facebook.com/" target="_blank" rel="noreferrer">Facebook</a>
        <a href="https://www.linkedin.com/" target="_blank" rel="noreferrer">LinkedIn</a>
      </div>
      <button className="outline-button" type="button" onClick={() => setStatus('Sign in is ready for your authentication provider.')}>Sign in</button>
    </nav>

    <header>
      <p className="eyebrow">BLOG MANAGEMENT SYSTEM <span>-</span> ISSUE 04</p>
      <h1>Ideas worth<br /><i>keeping.</i></h1>
      <p className="intro">Read, write, and shape a point of view with a publishing space that stays out of your way.</p>
    </header>

    <section className="workspace" aria-label="Story workspace">
      <div className="workspace-heading">
        <div><p className="eyebrow">YOUR DESK</p><h2>Make something<br /><i>worth sharing.</i></h2></div>
        <p className="workspace-note">A good note can become a conversation, a product, or a better way of seeing the day.</p>
      </div>
      <form className="compose" onSubmit={publish}>
        <div className="form-row"><input required value={title} onChange={event => setTitle(event.target.value)} placeholder="Story title" aria-label="Story title" /><input value={author} onChange={event => setAuthor(event.target.value)} placeholder="Byline" aria-label="Byline" /></div>
        <input value={excerpt} onChange={event => setExcerpt(event.target.value)} placeholder="One-line summary" aria-label="Story summary" />
        <textarea value={content} onChange={event => setContent(event.target.value)} placeholder="Write the story behind the idea..." aria-label="Story content" rows="3" />
        <div className="compose-footer"><span>{status || 'Draft privately, publish when it feels ready.'}</span><button className="publish-button" type="submit" disabled={isPublishing}>{isPublishing ? 'Publishing...' : 'Publish story'} <b aria-hidden="true">-&gt;</b></button></div>
      </form>
    </section>

    <section className="library" aria-label="Story library">
      <div className="library-top"><div><p className="eyebrow">THE LIBRARY</p><h2>Recent notes</h2></div><div className="library-tools"><label htmlFor="search">Search stories</label><input id="search" value={search} onChange={event => setSearch(event.target.value)} placeholder="Search..." /><div className="tabs"><button className={view === 'latest' ? 'active' : ''} onClick={() => setView('latest')} type="button">Latest</button><button className={view === 'saved' ? 'active' : ''} onClick={() => setView('saved')} type="button">Saved ({saved.size})</button></div></div></div>
      <div className="posts">{filteredPosts.length ? filteredPosts.map((post, index) => {
        const id = post._id || post.title;
        const isExpanded = expanded.has(id);
        return <article key={id}>
          <div className="post-meta"><small>{String(index + 1).padStart(2, '0')} / {post.author || 'You'}</small><span>{index === 0 ? 'Featured note' : 'Field note'}</span></div>
          <h3>{post.title}</h3>
          <p>{post.excerpt}</p>
          {isExpanded && <div className="story-content">{post.content || 'This story is waiting for its longer version.'}</div>}
          <div className="post-actions"><button type="button" onClick={() => toggleSetValue(setExpanded, id)}>{isExpanded ? 'Close story' : 'Read story'} <b aria-hidden="true">-&gt;</b></button><button className={liked.has(id) ? 'selected' : ''} type="button" onClick={() => toggleSetValue(setLiked, id)} aria-label="Like story">{liked.has(id) ? 'Liked' : 'Like'} <span>{liked.has(id) ? '1' : '0'}</span></button><button className={saved.has(id) ? 'selected' : ''} type="button" onClick={() => toggleSetValue(setSaved, id)} aria-label="Save story">{saved.has(id) ? 'Saved' : 'Save'}</button><button type="button" onClick={() => share(post)} aria-label="Copy story link">Share</button></div>
        </article>;
      }) : <p className="empty">No stories match this view yet.</p>}</div>
    </section>

    <footer><span>THE FIELD NOTES</span><span>Make room for better questions.</span><div className="socials"><a href="https://www.instagram.com/" target="_blank" rel="noreferrer">Instagram</a><a href="https://www.facebook.com/" target="_blank" rel="noreferrer">Facebook</a><a href="https://www.linkedin.com/" target="_blank" rel="noreferrer">LinkedIn</a></div></footer>
  </main>;
}

const css = `@import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=Playfair+Display:ital,wght@0,400;1,400;1,600&display=swap');
*{box-sizing:border-box}body{margin:0;background:#f4f0e7;color:#252422;font-family:'DM Mono',monospace}main{margin:auto;max-width:1240px;padding:0 6vw}nav{align-items:center;border-bottom:1px solid #c9c1b4;display:flex;gap:22px;padding:25px 0}nav a,footer a{color:inherit;text-decoration:none}.brand{font-size:12px;font-weight:500;letter-spacing:.1em}.tagline{color:#7d786f;font-size:11px}.socials{display:flex;gap:16px;margin-left:auto}.socials a{color:#7d786f;font-size:10px}.socials a:hover{color:#cc5b42}.outline-button,.publish-button,button{font:inherit;cursor:pointer}.outline-button{background:transparent;border:1px solid #252422;font-size:10px;padding:10px 15px}.eyebrow{color:#cc5b42;font-size:10px;letter-spacing:.14em;margin:0}.eyebrow span{color:#8e8a82;padding:0 6px}header{border-bottom:1px solid #aaa398;max-width:900px;padding:115px 0 75px}h1{font:clamp(64px,10vw,135px) 'Playfair Display',Georgia,serif;letter-spacing:0;line-height:.86;margin:24px 0}h1 i,h2 i{color:#cc5b42;font-style:italic}.intro{font-family:'Playfair Display',Georgia,serif;font-size:19px;line-height:1.45;margin:0;max-width:410px}.workspace{border-bottom:1px solid #aaa398;padding:55px 0}.workspace-heading{align-items:end;display:flex;justify-content:space-between;margin-bottom:30px}.workspace h2,.library h2{font:38px 'Playfair Display',Georgia,serif;line-height:.95;margin:12px 0 0}.workspace-note{color:#777168;font-size:11px;line-height:1.6;max-width:250px}.compose{border:1px solid #252422;padding:20px}.compose input,.compose textarea{background:transparent;border:0;border-bottom:1px solid #c9c1b4;color:#252422;font:16px 'DM Mono',monospace;outline:0;padding:13px 0;width:100%}.compose textarea{border-bottom:0;resize:vertical}.form-row{display:flex;gap:25px}.form-row input:first-child{font:25px 'Playfair Display',Georgia,serif}.form-row input:last-child{max-width:180px}.compose-footer{align-items:center;border-top:1px solid #c9c1b4;display:flex;justify-content:space-between;padding-top:15px}.compose-footer span{color:#8e8a82;font-size:10px}.publish-button{background:#252422;border:0;color:#f4f0e7;font-size:11px;padding:14px 18px}.publish-button:hover{background:#cc5b42}.publish-button:disabled{opacity:.5}.library{padding:58px 0}.library-top{align-items:end;display:flex;justify-content:space-between;margin-bottom:35px}.library-tools{align-items:end;display:flex;gap:18px}.library-tools label{color:#7d786f;font-size:9px;text-transform:uppercase}.library-tools input{background:transparent;border:0;border-bottom:1px solid #252422;font:12px 'DM Mono',monospace;outline:0;padding:8px;width:150px}.tabs{display:flex;gap:8px}.tabs button{background:transparent;border:0;border-bottom:1px solid transparent;color:#7d786f;font-size:10px;padding:8px 2px}.tabs button.active{border-color:#cc5b42;color:#252422}.posts{display:grid;gap:30px;grid-template-columns:repeat(3,1fr)}.posts article{border-top:2px solid #252422;padding-top:15px}.post-meta{display:flex;justify-content:space-between}.post-meta small{color:#cc5b42;font-size:10px;letter-spacing:.1em}.post-meta span{color:#9b958a;font-size:9px}.posts h3{font:32px 'Playfair Display',Georgia,serif;font-weight:400;margin:24px 0 12px}.posts article>p{color:#6f6a62;font:15px 'Playfair Display',Georgia,serif;line-height:1.5;min-height:45px}.story-content{border-left:2px solid #cc5b42;font:14px 'Playfair Display',Georgia,serif;line-height:1.6;margin:20px 0;padding-left:15px}.post-actions{display:flex;flex-wrap:wrap;gap:14px;margin-top:25px}.post-actions button{background:none;border:0;color:#cc5b42;font-size:10px;padding:0}.post-actions button:not(:first-child){color:#7d786f}.post-actions button:hover,.post-actions .selected{color:#252422}.post-actions span{padding-left:4px}.empty{color:#7d786f;font-size:12px}footer{border-top:1px solid #c9c1b4;display:flex;font-size:10px;justify-content:space-between;padding:24px 0}footer .socials{margin-left:0}@media(max-width:760px){nav{flex-wrap:wrap}.tagline{order:3;width:100%}.socials{gap:10px}.socials a{font-size:9px}header{padding:85px 0 55px}h1{font-size:clamp(60px,16vw,100px)}.workspace-heading,.library-top{align-items:start;display:block}.workspace-note{margin-top:20px}.form-row{display:block}.form-row input:last-child{max-width:none}.compose-footer{align-items:start;display:block}.compose-footer span{display:block;line-height:1.5;margin-bottom:15px}.library-tools{align-items:start;display:block;margin-top:25px}.library-tools label{display:block;margin-bottom:5px}.library-tools input{width:100%}.tabs{margin-top:18px}.posts{grid-template-columns:1fr}.posts h3{font-size:29px}footer{display:block;line-height:2.2}footer .socials{margin-top:12px}}`;
