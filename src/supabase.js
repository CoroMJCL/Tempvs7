// ── TEMPVS7 — Cliente Supabase ────────────────────────────────────
// Las variables vienen de .env.local (nunca subas ese archivo a git)

import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

export async function getProjects() {
  const { data, error } = await supabase
    .from("projects").select("*").eq("active", true).order("sort_order");
  if (error) throw error;
  return data.map(p => ({
    id:p.id, title:p.title, desc:p.description, url:p.url||"#",
    imgs:[p.img1||"",p.img2||"",p.img3||""], tags:p.tags||[],
  }));
}

export async function saveProject(p) {
  const { error } = await supabase.from("projects").insert({
    title:p.title, description:p.desc, url:p.url||null,
    img1:p.imgs[0], img2:p.imgs[1], img3:p.imgs[2], tags:p.tags,
  });
  if (error) throw error;
}

export async function uploadImage(file) {
  const ext = file.name.split('.').pop().toLowerCase();
  const filename = `proyecto_${Date.now()}.${ext}`;
  const { error } = await supabase.storage
    .from("images")
    .upload(filename, file, { cacheControl:"3600", upsert:true });
  if (error) throw error;
  const { data } = supabase.storage.from("images").getPublicUrl(filename);
  return data.publicUrl;
}

export async function deleteProject(id) {
  const { error } = await supabase.from("projects").delete().eq("id", id);
  if (error) throw error;
}

export async function getSectors() {
  const { data, error } = await supabase
    .from("clients").select("name").eq("active", true).order("sort_order");
  if (error) throw error;
  return data.map(c => c.name);
}

export async function getSocialLinks() {
  const { data, error } = await supabase
    .from("settings").select("value").eq("key", "social").single();
  if (error) throw error;
  return data.value;
}

export async function saveContact(form) {
  const { error } = await supabase.from("contacts").insert({
    name:form.name, email:form.email, phone:form.phone,
    service:form.service, message:form.msg,
  });
  if (error) throw error;
}

export async function updateSocial(social) {
  const { error } = await supabase
    .from("settings").upsert({ key:"social", value:social });
  if (error) throw error;
}

export async function updateProject(p) {
  const { error } = await supabase.from("projects").update({
    title:p.title, description:p.desc, url:p.url||null,
    img1:p.imgs[0], img2:p.imgs[1], img3:p.imgs[2], tags:p.tags,
  }).eq("id", p.id);
  if (error) throw error;
}

export async function adminLogin(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data;
}

export async function adminLogout() {
  await supabase.auth.signOut();
}

export async function getAdminSession() {
  const { data } = await supabase.auth.getSession();
  return data.session;
}
