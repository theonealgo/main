'use client';
import React, { useState, FormEvent } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import LoginForm from '@/components/LoginForm';
import ForgotPasswordForm from '@/components/ForgotPasswordForm';

type PlanKey = 'the_one_stock'|'the_one_elite'|'the_one_premium';
const PLAN_CONFIG: Record<PlanKey, { label:string; monthly:number; yearly:number }> = {
  the_one_stock:   { label:'The One: Stock Swing Analyzer', monthly:49.99, yearly:499.90 },
  the_one_elite:   { label:'The One Elite – Dynamic Liquidity', monthly:59.99, yearly:599.90 },
  the_one_premium: { label:'The One Premium (both indicators)', monthly:99.99, yearly:999.90 },
};

export default function AuthClientPage() {
  const params      = useSearchParams();
  const router      = useRouter();
  const hint        = params.get('screen_hint');
  const initialView = hint==='login'?'login':hint==='forgot'?'forgot':'signup';
  const [view, setView] = useState<'signup'|'login'|'forgot'>(initialView);

  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');
  const rawPlan    = (params.get('plan') as PlanKey) || 'the_one_stock';
  const rawBilling = params.get('billing')==='yearly'?'yearly':'monthly';

  const [tvUser, setTvUser]     = useState('');
  const [email,  setEmail]      = useState('');
  const [password, setPassword] = useState('');
  const [plan,   setPlan]       = useState<PlanKey>(rawPlan);
  const [billing, setBilling]   = useState<'monthly'|'yearly'>(rawBilling);

  const price = billing==='monthly'
    ? PLAN_CONFIG[plan].monthly
    : PLAN_CONFIG[plan].yearly;

  async function handleSignup(e:FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      // signup
      const res = await fetch('/api/auth/signup',{ method:'POST',
        headers:{ 'Content-Type':'application/json' },
        body:JSON.stringify({ email,password,plan })
      });
      if(!res.ok) throw new Error('Signup failed.');

      await fetch('/api/save-user',{ method:'POST',
        headers:{ 'Content-Type':'application/json' },
        body:JSON.stringify({ email,tradingViewUsername:tvUser })
      });

      // stripe
      const { url } = await (await fetch('/api/create-stripe-session',{ method:'POST',
        headers:{ 'Content-Type':'application/json' },
        body:JSON.stringify({ plan,billing,email })
      })).json();
      if(!url) throw new Error('Stripe session failure.');
      window.location.href = url;

    } catch(err:any) {
      setError(err.message);
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-6">
      <div className="max-w-lg w-full space-y-8">
        {/* Tabs */}
        <div className="flex bg-gray-900 rounded-lg overflow-hidden">
          {(['signup','login','forgot'] as const).map(tab=>(
            <button
              key={tab}
              onClick={()=>setView(tab)}
              className={`flex-1 py-3 font-semibold ${
                view===tab?'bg-teal-500 text-black':'bg-gray-800'
              }`}
            >
              {tab==='signup'?'Sign Up':tab==='login'?'Log In':'Forgot Password'}
            </button>
          ))}
        </div>

        {error && <div className="text-center text-red-500">{error}</div>}

        {view==='signup' && (
          <form onSubmit={handleSignup} className="space-y-6 bg-gray-900 p-6 rounded-lg shadow-lg">
            <button
              type="button"
              onClick={async ()=>{
                setLoading(true);
                const res = await signIn('google',{ redirect:false, callbackUrl:'/dashboard' });
                if(res?.url) router.push(res.url);
                else setLoading(false);
              }}
              className="w-full bg-white text-black py-3 rounded font-semibold flex items-center justify-center gap-2"
            >
              Continue with Google
            </button>
            <div className="text-center text-gray-400">OR</div>
            <input
              type="text"
              placeholder="TradingView Username"
              required value={tvUser}
              onChange={e=>setTvUser(e.target.value)}
              className="w-full px-4 py-3 bg-gray-800 rounded"
            />
            <input
              type="email"
              placeholder="Email"
              required value={email}
              onChange={e=>setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-gray-800 rounded"
            />
            <input
              type="password"
              placeholder="Password"
              required value={password}
              onChange={e=>setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-gray-800 rounded"
            />
            <select
              value={plan}
              onChange={e=>setPlan(e.target.value as PlanKey)}
              className="w-full px-4 py-3 bg-gray-800 rounded"
            >
              {Object.entries(PLAN_CONFIG).map(([k,c])=>(
                <option key={k} value={k}>{c.label}</option>
              ))}
            </select>
            <div className="flex gap-4 justify-center">
              {(['monthly','yearly'] as const).map(cycle=>(
                <label key={cycle} className="flex items-center gap-2">
                  <input
                    type="radio"
                    checked={billing===cycle}
                    onChange={()=>setBilling(cycle)}
                  />
                  {cycle.charAt(0).toUpperCase()+cycle.slice(1)}
                </label>
              ))}
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-500 to-teal-500 py-3 rounded font-semibold"
            >
              {loading ? 'Processing…' : `Start 30-Day Free Trial ($${price})`}
            </button>
          </form>
        )}

        {view==='login'  && <LoginForm />}
        {view==='forgot' && <ForgotPasswordForm />}
      </div>
    </div>
  );
}
