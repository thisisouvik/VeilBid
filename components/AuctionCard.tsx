'use client';

/**
 * components/AuctionCard.tsx
 * Displays a single auction item with its live state.
 * Fully enhanced vertical layout design.
 */

import type { AuctionState } from '@/lib/types';
import { AuctionStatus } from '@/lib/types';

interface AuctionCardProps {
  state: AuctionState;
  contractAddress: string;
  itemDescription?: string;
  isSeller?: boolean;
  onBid?: () => void;
  onSettle?: () => void;
  onWithdraw?: () => void;
  isActionPending?: boolean;
}

export function AuctionCard({
  state,
  contractAddress,
  itemDescription = '',
  isSeller = false,
  onBid,
  onSettle,
  onWithdraw,
  isActionPending = false,
}: AuctionCardProps) {
  const isOpen     = state.status === AuctionStatus.OPEN;
  const isSettled  = state.status === AuctionStatus.SETTLED;
  const isExpired  = state.status === AuctionStatus.EXPIRED;

  const formatNight = (raw: bigint) => {
    if (raw === 0n) return '—';
    const night = Number(raw) / 1_000_000;
    return `${night.toFixed(2)} tNIGHT`;
  };

  const truncHex = (hex: string) =>
    hex.length > 16 ? `${hex.slice(0, 8)}…${hex.slice(-6)}` : hex;

  return (
    <article
      className="glass glass-hover fade-up"
      style={{
        padding: 0,
        borderRadius: 24,
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        border: '1px solid var(--glass-border)',
      }}
    >
      {/* ── Status Header Banner ── */}
      <div
        style={{
          padding: '16px 24px',
          background: isSettled
            ? 'rgba(16, 185, 129, 0.15)'
            : isExpired
            ? 'rgba(248, 113, 113, 0.15)'
            : 'rgba(20, 184, 166, 0.15)',
          borderBottom: '1px solid rgba(255,255,255,0.05)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        <StatusBadge status={state.status} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--text-primary)', fontWeight: 600, background: 'rgba(0,0,0,0.3)', padding: '4px 10px', borderRadius: 20 }}>
          <BidIcon />
          {state.bid_count} bid{state.bid_count !== 1 ? 's' : ''}
        </div>
      </div>

      <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column', gap: 24 }}>
        
        {/* ── Title Section ── */}
        <div style={{ textAlign: 'center' }}>
          <h2
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 26,
              fontWeight: 800,
              color: 'var(--text-primary)',
              wordBreak: 'break-word',
              lineHeight: 1.2,
              marginBottom: 8
            }}
          >
            {itemDescription || 'Mystery Asset'}
          </h2>
          <p style={{ fontSize: 12, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
            Contract: {truncHex(contractAddress)}
          </p>
        </div>

        {/* ── Financials (Vertical Stack) ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {/* Highest Bid Block */}
          <div style={{
            background: 'rgba(20, 184, 166, 0.08)',
            border: '1px solid rgba(20, 184, 166, 0.2)',
            borderRadius: 16,
            padding: '20px',
            textAlign: 'center',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: 'var(--grad-teal-emerald)' }} />
            <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: 'var(--teal-400)', letterSpacing: '0.1em', marginBottom: 8 }}>
              Current Highest Bid
            </div>
            <div style={{
              fontSize: 32,
              fontWeight: 900,
              fontFamily: 'var(--font-display)',
              background: 'linear-gradient(135deg, #2dd4bf, #10b981)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textShadow: '0 0 20px rgba(45,212,191,0.2)'
            }}>
              {formatNight(state.highest_bid)}
            </div>
            {state.highest_bid > 0n && (
              <div style={{ fontSize: 11, color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)', marginTop: 8, background: 'rgba(0,0,0,0.2)', display: 'inline-block', padding: '4px 10px', borderRadius: 12 }}>
                By: {truncHex(state.highest_bidder)}
              </div>
            )}
          </div>

          {/* Reserve Price Block */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.02)',
            border: '1px solid rgba(255, 255, 255, 0.05)',
            borderRadius: 16,
            padding: '16px 20px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Reserve Price
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-primary)', fontWeight: 700, fontSize: 16 }}>
              <LockIcon /> Hidden
            </div>
          </div>
        </div>

        {/* ── Progress Bar ── */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 8 }}>
            <span>Started</span>
            <span>{isOpen ? 'Active' : 'Closed'}</span>
          </div>
          <div style={{ height: 6, width: '100%', background: 'rgba(255,255,255,0.05)', borderRadius: 6, overflow: 'hidden' }}>
            <div 
              style={{ 
                height: '100%', 
                width: isOpen ? '100%' : '0%', 
                background: 'var(--grad-teal-emerald)',
                transition: 'width 1s ease',
                boxShadow: '0 0 10px rgba(20,184,166,0.5)'
              }} 
            />
          </div>
        </div>

        {/* ── Metadata List (Vertical) ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, background: 'rgba(0,0,0,0.2)', padding: '16px', borderRadius: 16 }}>
          <ListRow label="Closes at Block" value={state.auction_end_block.toString()} />
          <ListRow label="Seller ID" value={truncHex(state.seller)} mono />
          <ListRow label="Fingerprint" value={truncHex(state.item_hash)} mono />
        </div>

        {/* ── Action Buttons ── */}
        <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: 12 }}>
          {isOpen && !isSeller && onBid && (
            <button
              id={`bid-btn-${contractAddress.slice(0, 8)}`}
              className="btn btn-primary"
              onClick={onBid}
              disabled={isActionPending}
              style={{ width: '100%', padding: '16px', fontSize: 16, fontWeight: 700, borderRadius: 14 }}
            >
              {isActionPending ? <><span className="spinner" />Submitting Proof…</> : <>Place Sealed Bid</>}
            </button>
          )}

          {isOpen && isSeller && onSettle && (
            <button
              id={`settle-btn-${contractAddress.slice(0, 8)}`}
              className="btn btn-primary"
              onClick={onSettle}
              disabled={isActionPending}
              style={{ width: '100%', padding: '16px', fontSize: 16, fontWeight: 700, borderRadius: 14 }}
            >
              {isActionPending ? <><span className="spinner" />Settling…</> : <>Reveal & Settle Auction</>}
            </button>
          )}

          {isExpired && onWithdraw && state.highest_bid > 0n && (
            <button
              id={`withdraw-btn-${contractAddress.slice(0, 8)}`}
              className="btn btn-danger"
              onClick={onWithdraw}
              disabled={isActionPending}
              style={{ width: '100%', padding: '16px', fontSize: 16, fontWeight: 700, borderRadius: 14 }}
            >
              {isActionPending ? <><span className="spinner" />Processing…</> : <>Withdraw Funds</>}
            </button>
          )}

          {isSettled && (
            <div
              style={{
                background: 'rgba(16, 185, 129, 0.1)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                color: 'var(--emerald-400)',
                padding: '16px',
                borderRadius: 14,
                textAlign: 'center',
                fontWeight: 700,
                fontSize: 14,
                display: 'flex',
                flexDirection: 'column',
                gap: 4
              }}
            >
              <span>🎉 AUCTION SETTLED</span>
              <span style={{ fontSize: 12, color: 'var(--text-secondary)', fontWeight: 500 }}>Winner: {truncHex(state.highest_bidder)}</span>
            </div>
          )}
        </div>

      </div>
    </article>
  );
}

// ── Sub-components ────────────────────────────────────────────

function StatusBadge({ status }: { status: AuctionStatus }) {
  const map: Record<AuctionStatus, { color: string; label: string; dot: string }> = {
    [AuctionStatus.OPEN]:     { color: 'var(--teal-400)', label: 'LIVE AUCTION', dot: 'var(--teal-400)' },
    [AuctionStatus.SETTLED]:  { color: 'var(--emerald-400)', label: 'SOLD', dot: 'var(--emerald-400)' },
    [AuctionStatus.EXPIRED]:  { color: 'var(--red-400)', label: 'EXPIRED', dot: 'var(--red-400)' },
  };
  const { color, label, dot } = map[status];
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, color, fontWeight: 800, fontSize: 12, letterSpacing: '0.1em' }}>
      <span style={{ width: 8, height: 8, borderRadius: '50%', background: dot, boxShadow: `0 0 10px ${dot}` }} />
      {label}
    </div>
  );
}

function ListRow({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '4px 0' }}>
      <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{label}</span>
      <span style={{ fontSize: 13, color: 'var(--text-primary)', fontFamily: mono ? 'var(--font-mono)' : 'inherit', fontWeight: 600 }}>{value}</span>
    </div>
  );
}

function LockIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" style={{ width: 16, height: 16, opacity: 0.8 }}>
      <path fillRule="evenodd" d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z" clipRule="evenodd" />
    </svg>
  );
}

function BidIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="currentColor" style={{ width: 12, height: 12 }}>
      <path d="M10.561 8.073a6.005 6.005 0 011.06 1.928A8.5 8.5 0 108 3a8.472 8.472 0 01-3.998 1H3a.5.5 0 01-.5-.5V3a.5.5 0 01.5-.5h1a.5.5 0 01.5.5v.5A6.5 6.5 0 1014 8.5a6.472 6.472 0 00-3.439-.427z" />
    </svg>
  );
}
