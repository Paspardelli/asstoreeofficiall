"use client";

import { useEffect, useState } from "react";
import type { Produto } from "@/lib/data";

const WHATS = "5519998073953";
const IG = "asstoree_officiall";
const FAIXA = "ASSTORE ★ STREETWEAR ★ PEDIDO PELO WHATSAPP ★ ";

type Item = { id: Produto["id"]; nome: string; preco: number; t: string; q: number };

const brl = (n: number) => n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

function Logo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
      <use href="#logo" />
    </svg>
  );
}

export default function Store({ produtos }: { produtos: Produto[] }) {
  const [cat, setCat] = useState("Todos");
  const [sacola, setSacola] = useState<Item[]>([]);
  const [pronto, setPronto] = useState(false);
  const [aberto, setAberto] = useState<"" | "sacola" | "produto">("");
  const [sel, setSel] = useState<Produto | null>(null);
  const [tam, setTam] = useState<string | null>(null);
  const [aviso, setAviso] = useState("");
  const [nome, setNome] = useState("");

  useEffect(() => {
    try {
      const s = localStorage.getItem("as_sacola");
      if (s) setSacola(JSON.parse(s) as Item[]);
    } catch {}
    setPronto(true);
  }, []);

  useEffect(() => {
    if (!pronto) return;
    try {
      localStorage.setItem("as_sacola", JSON.stringify(sacola));
    } catch {}
  }, [sacola, pronto]);

  useEffect(() => {
    const f = (e: KeyboardEvent) => e.key === "Escape" && setAberto("");
    window.addEventListener("keydown", f);
    return () => window.removeEventListener("keydown", f);
  }, []);

  const cats = ["Todos", ...Array.from(new Set(produtos.map((p) => p.categoria)))];
  const lista = produtos.filter((p) => cat === "Todos" || p.categoria === cat);
  const qtd = sacola.reduce((a, i) => a + i.q, 0);
  const total = sacola.reduce((a, i) => a + i.q * i.preco, 0);

  function abrirProduto(p: Produto) {
    setSel(p);
    setTam(p.tamanhos.length === 1 ? p.tamanhos[0] : null);
    setAviso("");
    setAberto("produto");
  }

  function adicionar() {
    if (!sel) return;
    if (!tam) return setAviso("Escolha um tamanho para continuar.");
    setSacola((s) => {
      const f = s.find((i) => i.id === sel.id && i.t === tam);
      if (f) return s.map((i) => (i === f ? { ...i, q: i.q + 1 } : i));
      return [...s, { id: sel.id, nome: sel.nome, preco: sel.preco, t: tam, q: 1 }];
    });
    setAberto("sacola");
  }

  function mudar(k: number, d: number) {
    setSacola((s) => s.map((i, n) => (n === k ? { ...i, q: i.q + d } : i)).filter((i) => i.q > 0));
  }

  function enviar() {
    if (!sacola.length) return;
    const linhas = sacola.map((i) => `• ${i.q}x ${i.nome} (tam. ${i.t}) - ${brl(i.q * i.preco)}`).join("\n");
    const txt = `Olá, ASStore! Quero fazer um pedido:\n\n${linhas}\n\nTotal: ${brl(total)}\n${nome.trim() ? "Nome: " + nome.trim() + "\n" : ""}\nPodemos combinar pagamento e entrega?`;
    window.open(`https://wa.me/${WHATS}?text=${encodeURIComponent(txt)}`, "_blank");
  }

  return (
    <>
      <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true">
        <symbol id="logo" viewBox="0 0 64 64">
          <path fill="currentColor" d="M10 22l5-12 8 7 9-12 9 12 8-7 5 12z" />
          <path fill="currentColor" d="M14 26h36v16L32 62 14 42z" />
          <path fill="#070707" d="M20 31h6l2 12h-4l-.5-3h-2.5l-.5 3h-3zm13 0h11v4h-7v2h7v10l-5 5v-5h-6z" />
        </symbol>
      </svg>

      <header>
        <a className="brand" href="#top" aria-label="ASStore">
          <Logo />
          <span className="disp" style={{ fontSize: 20 }}>ASSTORE</span>
        </a>
        <nav>
          <a href="#catalogo">Catálogo</a>
          <a href="#como">Como comprar</a>
          <button className="cartbtn" onClick={() => setAberto("sacola")}>
            Sacola<b>{qtd}</b>
          </button>
        </nav>
      </header>

      <main id="top">
        <div className="hero">
          <h1>
            AS<br />
            <span>STORE</span>
          </h1>
          <p>Streetwear que chega no seu WhatsApp. Escolha as peças, monte a sacola e feche direto com a gente.</p>
          <a className="btn" href="#catalogo">Ver peças</a>
          <a className="btn ghost" href={`https://instagram.com/${IG}`} target="_blank" rel="noopener noreferrer">Instagram</a>
        </div>
        <div className="band" aria-hidden="true">
          <div>{FAIXA.repeat(8)}</div>
        </div>

        <section id="catalogo">
          <h2>Catálogo</h2>
          <div className="chips">
            {cats.map((c) => (
              <button key={c} className="chip" aria-pressed={c === cat} onClick={() => setCat(c)}>{c}</button>
            ))}
          </div>
          <div className="grid">
            {lista.map((p) => (
              <button key={p.id} className="card" onClick={() => abrirProduto(p)}>
                <div className="ph" style={{ background: `linear-gradient(160deg,${p.cor},#000 120%)` }}>
                  {p.novo && <span className="tag">Novo</span>}
                  {p.imagem_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={p.imagem_url} alt={p.nome} loading="lazy" />
                  ) : (
                    <Logo />
                  )}
                </div>
                <h3>{p.nome}</h3>
                <span className="pr">{brl(p.preco)}</span>
              </button>
            ))}
          </div>
        </section>

        <section>
          <div className="lookbook">
            <h2 style={{ marginBottom: 12 }}>Use a coroa.</h2>
            <p>Cada peça da ASStore carrega a marca de quem não pede licença para chegar. Estoque limitado por modelo.</p>
          </div>
        </section>

        <section id="como">
          <h2>Como comprar</h2>
          <ol className="steps">
            <li><b>Escolha</b><span>Selecione tamanho e adicione na sacola.</span></li>
            <li><b>Envie o pedido</b><span>Um toque e a mensagem pronta abre no WhatsApp.</span></li>
            <li><b>Combine com a loja</b><span>Pagamento e entrega são combinados direto na conversa.</span></li>
          </ol>
        </section>
      </main>

      <footer>
        <span>© ASStore. Todos os direitos reservados.</span>
        <a href={`https://instagram.com/${IG}`} target="_blank" rel="noopener noreferrer">@{IG}</a>
      </footer>

      {aberto && <div className="ov" onClick={() => setAberto("")} />}

      {aberto === "produto" && sel && (
        <div className="panel" id="modal" role="dialog" aria-label={sel.nome}>
          <button className="x" onClick={() => setAberto("")} aria-label="Fechar">×</button>
          <h2 style={{ fontSize: 28, paddingRight: 24, marginBottom: 0 }}>{sel.nome}</h2>
          <p className="pr" style={{ fontSize: 20, margin: "8px 0 0" }}>{brl(sel.preco)}</p>
          <div className="sizes">
            {sel.tamanhos.map((t) => (
              <button key={t} className="sz" aria-pressed={t === tam} onClick={() => setTam(t)}>{t}</button>
            ))}
          </div>
          <button className="btn" onClick={adicionar}>Adicionar à sacola</button>
          <p className="err">{aviso}</p>
        </div>
      )}

      {aberto === "sacola" && (
        <aside className="panel" id="drawer" aria-label="Sacola">
          <button className="x" onClick={() => setAberto("")} aria-label="Fechar">×</button>
          <h2 style={{ fontSize: 32, marginBottom: 0 }}>Sua sacola</h2>
          <div className="items">
            {sacola.length === 0 && <p className="empty">Sua sacola está vazia. Escolha uma peça no catálogo.</p>}
            {sacola.map((i, k) => (
              <div className="it" key={`${i.id}-${i.t}`}>
                <div>
                  {i.nome}
                  <small>Tamanho {i.t} · {brl(i.preco)}</small>
                </div>
                <div className="qty">
                  <button onClick={() => mudar(k, -1)} aria-label="Diminuir">−</button>
                  <span>{i.q}</span>
                  <button onClick={() => mudar(k, 1)} aria-label="Aumentar">+</button>
                </div>
              </div>
            ))}
          </div>
          {sacola.length > 0 && (
            <div>
              <input value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Seu nome" autoComplete="name" />
              <div className="tot"><span>Total</span><b>{brl(total)}</b></div>
              <button className="btn wa" onClick={enviar}>Finalizar pelo WhatsApp</button>
            </div>
          )}
        </aside>
      )}
    </>
  );
}
