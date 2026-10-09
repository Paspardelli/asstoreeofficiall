import { createClient } from "@supabase/supabase-js";

export type Produto = {
  id: number | string;
  nome: string;
  categoria: string;
  preco: number;
  tamanhos: string[];
  cor: string;
  novo: boolean;
  imagem_url: string | null;
};

// Usados enquanto o Supabase não estiver configurado (o site nunca quebra).
const DEMO: Produto[] = [
  { id: 1, nome: "Camiseta Oversized Crown", categoria: "Camisetas", preco: 89.9, tamanhos: ["P", "M", "G", "GG"], cor: "#e10600", novo: true, imagem_url: null },
  { id: 2, nome: "Camiseta Boxy AS Preta", categoria: "Camisetas", preco: 79.9, tamanhos: ["P", "M", "G", "GG"], cor: "#1a1a1a", novo: false, imagem_url: null },
  { id: 3, nome: "Moletom Hoodie Royal", categoria: "Moletons", preco: 199.9, tamanhos: ["M", "G", "GG"], cor: "#5c0200", novo: true, imagem_url: null },
  { id: 4, nome: "Moletom Zip Off White", categoria: "Moletons", preco: 219.9, tamanhos: ["M", "G", "GG"], cor: "#8a8a86", novo: false, imagem_url: null },
  { id: 5, nome: "Calça Cargo Black", categoria: "Calças", preco: 179.9, tamanhos: ["38", "40", "42", "44"], cor: "#101010", novo: false, imagem_url: null },
  { id: 6, nome: "Calça Jogger Red Line", categoria: "Calças", preco: 149.9, tamanhos: ["38", "40", "42", "44"], cor: "#b00500", novo: false, imagem_url: null },
  { id: 7, nome: "Boné AS Strapback", categoria: "Acessórios", preco: 69.9, tamanhos: ["Único"], cor: "#2b2b2b", novo: false, imagem_url: null },
  { id: 8, nome: "Corrente Crown Steel", categoria: "Acessórios", preco: 59.9, tamanhos: ["Único"], cor: "#d9d9d6", novo: false, imagem_url: null },
];

export async function getProdutos(): Promise<Produto[]> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return DEMO;
  try {
    const sb = createClient(url, key);
    const { data, error } = await sb.from("produtos").select("*").eq("ativo", true).order("id");
    if (error || !data || data.length === 0) return DEMO;
    return (data as Produto[]).map((p) => ({
      ...p,
      preco: Number(p.preco),
      tamanhos: p.tamanhos?.length ? p.tamanhos : ["Único"],
    }));
  } catch {
    return DEMO;
  }
}
