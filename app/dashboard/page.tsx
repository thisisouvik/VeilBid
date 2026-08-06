'use client';

import { useState, useEffect } from 'react';
import { useWallet } from '@/hooks/useWallet';
import { Navbar } from '@/components/Navbar';
import Link from 'next/link';

export default function DashboardPage() {
  const wallet = useWallet();
  const [createdContracts, setCreatedContracts] = useState<string[]>([]);

  useEffect(() => {
    // Load created contracts from local storage
    const stored = localStorage.getItem('veilbid:seller-contracts') || localStorage.getItem('zkauction:seller-contracts');
    if (stored) {
      try {
        setCreatedContracts(JSON.parse(stored));
      } catch (e) {
        console.error('Failed to parse seller contracts', e);
      }
    }
  }, []);

  return (
    <>
      <Navbar wallet={wallet} />
      
      <main className="min-h-screen px-4 md:px-6 py-8" style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4" style={{ marginBottom: '48px' }}>
          <div>
            <h1 className="text-4xl md:text-5xl font-bold mb-3">
              <span className="gradient-text">Command</span> Center
            </h1>
            <p className="text-lg text-slate-400 max-w-2xl">
              Manage your private auctions, view your shielded identity, and track your cryptographic assets.
            </p>
          </div>
          <Link href="/auctions" className="btn btn-primary" style={{ padding: '12px 24px' }}>
            View All Auctions
          </Link>
        </div>

        {/* Wallet connection banner */}
        {!wallet.isConnected && (
          <div 
            className="glass fade-up mx-auto" 
            style={{ 
              maxWidth: 600, 
              padding: '40px',
              textAlign: 'center',
              marginBottom: '40px',
              borderRadius: '24px',
              border: '1px solid rgba(20, 184, 166, 0.25)',
              background: 'linear-gradient(180deg, rgba(20, 184, 166, 0.05) 0%, rgba(8, 10, 18, 0.8) 100%)',
              boxShadow: '0 16px 40px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.05)'
            }}
          >
            <div style={{
              width: 72,
              height: 72,
              borderRadius: '50%',
              background: 'rgba(20, 184, 166, 0.1)',
              border: '1px solid rgba(20, 184, 166, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 24px',
              boxShadow: '0 0 20px rgba(20, 184, 166, 0.2)'
            }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="var(--teal-400)" style={{ width: 32, height: 32 }}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h2 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '12px' }}>
              Connect to your Shielded Identity
            </h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '32px', maxWidth: 400, margin: '0 auto 32px', lineHeight: 1.6 }}>
              You must connect your 1AM wallet to access your private dashboard and decrypt your auction states.
            </p>
            <button 
              className="btn btn-primary" 
              onClick={wallet.connect}
              style={{ padding: '14px 32px', fontSize: 16, fontWeight: 700, borderRadius: 12, boxShadow: '0 4px 20px rgba(20, 184, 166, 0.3)' }}
            >
              Connect 1AM Wallet
            </button>
          </div>
        )}

        {wallet.isConnected && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 fade-up stagger-1" style={{ marginBottom: '64px' }}>
            <div className="stat-card glass">
              <div className="stat-label text-teal-400">Shielded Address</div>
              <div className="stat-value text-lg break-all truncate font-mono mt-2" title={wallet.address || ''}>
                {wallet.address ? `${wallet.address.slice(0, 16)}...${wallet.address.slice(-16)}` : 'Loading...'}
              </div>
            </div>
            <div className="stat-card glass">
              <div className="stat-label text-emerald-400">Network</div>
              <div className="stat-value text-2xl mt-2">Midnight Preview</div>
            </div>
            <div className="stat-card glass">
              <div className="stat-label text-pink-400">Your Auctions</div>
              <div className="stat-value text-4xl mt-2">{createdContracts.length}</div>
            </div>
          </div>
        )}

        {wallet.isConnected && (
          <div className="fade-up stagger-2">
            <h2 className="text-2xl font-bold flex items-center gap-3" style={{ marginBottom: '32px' }}>
              <span className="bg-teal-500 rounded-full inline-block shrink-0" style={{ width: '8px', height: '32px' }}></span>
              Your Deployed Auctions
            </h2>
            
            {createdContracts.length === 0 ? (
              <div className="glass p-10 text-center rounded-2xl border-dashed border-2 border-slate-700/50 bg-slate-900/20">
                <p className="text-slate-400 mb-4">You haven't deployed any private auctions yet.</p>
                <Link href="/auctions" className="btn btn-ghost">Create your first auction</Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {createdContracts.map((address) => (
                  <div key={address} className="glass rounded-xl border border-teal-500/20 hover:border-teal-500/50 transition-colors" style={{ padding: '24px' }}>
                    <div className="text-teal-400 font-mono text-sm" style={{ marginBottom: '24px', wordBreak: 'break-all' }}>
                      {address.length > 30 ? `${address.slice(0, 14)}...${address.slice(-14)}` : address}
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="badge badge-green" style={{ padding: '6px 12px' }}>Deployed</span>
                      <Link href="/auctions" className="btn btn-ghost" style={{ fontSize: 12, padding: '6px 12px' }}>
                        View
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </>
  );
}
