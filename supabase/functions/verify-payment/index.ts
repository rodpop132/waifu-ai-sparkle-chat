
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No authorization header provided");

    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    if (userError) throw new Error(`Authentication error: ${userError.message}`);
    
    const user = userData.user;
    if (!user?.email) throw new Error("User not authenticated or email not available");

    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2023-10-16",
    });

    // Buscar cliente no Stripe
    const customers = await stripe.customers.list({ email: user.email, limit: 1 });
    
    let planType = 'free';
    let messagesLimit = 30;

    if (customers.data.length > 0) {
      const customerId = customers.data[0].id;
      
      // Verificar sessões de checkout recentes (últimas 24h)
      const sessions = await stripe.checkout.sessions.list({
        customer: customerId,
        limit: 10,
        created: {
          gte: Math.floor((Date.now() - 24 * 60 * 60 * 1000) / 1000), // Últimas 24h
        },
      });

      // Verificar se alguma sessão foi paga
      for (const session of sessions.data) {
        if (session.payment_status === 'paid') {
          // Determinar o plano baseado no valor pago
          const amountTotal = session.amount_total || 0;
          
          if (amountTotal === 1990) { // R$ 19,90 em centavos
            planType = 'pro';
            messagesLimit = 10000;
          } else if (amountTotal === 3990) { // R$ 39,90 em centavos
            planType = 'ultra';
            messagesLimit = -1; // Ilimitado
          }
          break;
        }
      }
    }

    // Atualizar o perfil do usuário
    const { error: updateError } = await supabaseClient
      .from('profiles')
      .update({
        plan_type: planType,
        messages_limit: messagesLimit,
        updated_at: new Date().toISOString()
      })
      .eq('id', user.id);

    if (updateError) throw updateError;

    return new Response(JSON.stringify({
      plan_type: planType,
      messages_limit: messagesLimit,
      success: true
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    console.error('Error in verify-payment:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      success: false 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
