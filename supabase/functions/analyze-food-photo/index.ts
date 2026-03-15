/**
 * Edge Function : analyze-food-photo
 * 
 * Analyse une photo de plat/aliment avec l'IA et retourne les informations nutritionnelles.
 * 
 * Flux :
 * 1. Reçoit une image en base64 depuis le client
 * 2. Envoie l'image à l'API IA (Gemini) avec un prompt nutritionnel
 * 3. L'IA identifie les aliments et estime les valeurs nutritionnelles
 * 4. Parse le JSON retourné par l'IA
 * 5. Retourne les données au client
 * 
 * Entrée : { imageBase64: string }
 * Sortie : { name, description, calories, carbs, protein, fat, fiber, glycemic_index, items, advice }
 */

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

// Headers CORS pour permettre les appels depuis le frontend
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  // Gère les requêtes preflight CORS (OPTIONS)
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    // Récupère l'image encodée en base64 depuis le body de la requête
    const { imageBase64 } = await req.json();
    if (!imageBase64) {
      return new Response(JSON.stringify({ error: "No image provided" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Récupère la clé API pour l'IA (configurée automatiquement par Lovable Cloud)
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    // Appelle l'API IA avec la photo et le prompt nutritionnel
    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview", // Modèle rapide et multimodal
        messages: [
          {
            role: "system",
            // Prompt système : demande à l'IA d'analyser la photo et retourner un JSON
            content: `Tu es un expert en nutrition spécialisé dans le diabète. Analyse la photo d'un plat ou aliment et retourne UNIQUEMENT un JSON valide avec cette structure exacte, sans markdown ni texte autour :
{
  "name": "Nom du plat/aliment",
  "description": "Description courte du plat et de ses composants",
  "calories": nombre (kcal estimé pour la portion visible),
  "carbs": nombre (g de glucides),
  "protein": nombre (g de protéines),
  "fat": nombre (g de lipides),
  "fiber": nombre (g de fibres),
  "sugar": nombre (g de sucre),
  "salt": nombre (g de sel),
  "glycemic_index": nombre (index glycémique estimé 0-100),
  "items": ["liste", "des", "aliments", "identifiés"],
  "advice": "Conseil nutritionnel pour un diabétique"
}
Estime les quantités visibles sur la photo. Sois précis et réaliste dans tes estimations.`
          },
          {
            role: "user",
            // Envoie le texte + l'image au modèle multimodal
            content: [
              { type: "text", text: "Analyse cette photo de nourriture et donne-moi les informations nutritionnelles détaillées." },
              { type: "image_url", image_url: { url: `data:image/jpeg;base64,${imageBase64}` } }
            ]
          }
        ],
      }),
    });

    // Gestion des erreurs HTTP de l'API IA
    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Trop de requêtes, réessayez dans quelques instants." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Crédits IA épuisés." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      throw new Error("AI gateway error");
    }

    // Extrait le contenu texte de la réponse IA
    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || "";

    // Nettoie la réponse : l'IA peut entourer le JSON de ```json ... ```
    let jsonStr = content;
    const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (jsonMatch) jsonStr = jsonMatch[1];
    jsonStr = jsonStr.trim();

    // Parse le JSON retourné par l'IA
    let analysis;
    try {
      analysis = JSON.parse(jsonStr);
    } catch {
      console.error("Failed to parse AI response:", content);
      return new Response(JSON.stringify({ error: "Impossible d'analyser la photo. Réessayez avec une photo plus claire." }), {
        status: 422, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Retourne les données nutritionnelles analysées
    return new Response(JSON.stringify(analysis), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("analyze-food-photo error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
