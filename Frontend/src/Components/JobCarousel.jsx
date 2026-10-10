import { useState, useRef, useEffect, useLayoutEffect, useCallback } from 'react';
import JobCard from './JobCard';
import { fetchJobs } from '../api';
import { normalizeJob } from './normalizeJob';
import ApplicationModal from './ApplicationModal';

const MINI_WIDTH = 336;
const VISIBLE_HALF_SLOTS = 2.6;
const SPRING = 0.12;
const DRAG_SENSITIVITY_BASE = 140;
const CLICK_THRESHOLD = 6;
const FLIP_DURATION = 620; // ms — keep in sync with the transition set in the FLIP effect below

function wrap(raw, n) {
  return ((raw + n / 2) % n + n) % n - n / 2;
}

function JobCarouselStage({ jobs }) {
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [transitioning, setTransitioning] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [applyingJob, setApplyingJob] = useState(null);

  const containerRef = useRef(null);
  const cardRefs = useRef([]);
  const gapRef = useRef(140);
  const offsetRef = useRef(0);
  const targetRef = useRef(0);
  const expandedRef = useRef(null);
  const rafRef = useRef(null);
  const transitionTimeoutRef = useRef(null);
  const flipFromRectRef = useRef(null);
  const prevExpandedIndexRef = useRef(null);

  const isDraggingRef = useRef(false);
  const dragStartXRef = useRef(0);
  const dragStartOffsetRef = useRef(0);
  const dragDistanceRef = useRef(0);
  const activePointerIdRef = useRef(null);
  const pressedIndexRef = useRef(null);

  const n = jobs.length;

  useEffect(() => { expandedRef.current = expandedIndex; }, [expandedIndex]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const update = () => {
      const w = el.clientWidth;
      gapRef.current = Math.max(90, (w - MINI_WIDTH) / (2 * VISIBLE_HALF_SLOTS));
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  

  // Shared by the rAF loop AND the FLIP effect, so "resting position" is defined once.
  const getRestTransform = useCallback((i) => {
    const raw = wrap(i - offsetRef.current, n);
    const absRaw = Math.abs(raw);
    return {
      tx: raw * gapRef.current,
      ty: absRaw * 16,
      scale: Math.max(0.5, 1 - absRaw * 0.13),
      rot: Math.max(-16, Math.min(16, -raw * 5)),
      opacity: Math.max(0, 1 - absRaw * 0.3),
      blur: Math.min(3, absRaw * 0.55),
      z: Math.round(100 - absRaw * 10),
    };
  }, [n]);

  // rAF spring loop — sole owner of the continuous stack animation (drag/settle).
  useEffect(() => {
    const tick = () => {
      offsetRef.current += (targetRef.current - offsetRef.current) * SPRING;
      const activeExpanded = expandedRef.current;

      jobs.forEach((_, i) => {
        const el = cardRefs.current[i];
        if (!el) return;

        if (activeExpanded === i) {
          el.style.setProperty('--tx', '0px');
          el.style.setProperty('--ty', '0px');
          el.style.setProperty('--scale', 1);
          el.style.setProperty('--rot', '0deg');
          el.style.setProperty('--opacity', 1);
          el.style.setProperty('--blur', '0px');
          el.style.setProperty('--z', 100);
          return;
        }

        const rest = getRestTransform(i);
        let { tx, ty, scale, opacity, blur, z } = rest;
        const rot = rest.rot;

        if (activeExpanded !== null) {
          tx *= 1.25; ty += 24; scale *= 0.82; opacity *= 0.45; blur += 1.5; z = Math.max(1, z - 25);
        }

        el.style.setProperty('--tx', `${tx}px`);
        el.style.setProperty('--ty', `${ty}px`);
        el.style.setProperty('--scale', scale);
        el.style.setProperty('--rot', `${rot}deg`);
        el.style.setProperty('--opacity', opacity);
        el.style.setProperty('--blur', `${blur}px`);
        el.style.setProperty('--z', z);
      });

      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [n, getRestTransform]);

  const triggerTransition = useCallback(() => {
    setTransitioning(true);
    clearTimeout(transitionTimeoutRef.current);
    transitionTimeoutRef.current = setTimeout(() => setTransitioning(false), FLIP_DURATION);
  }, []);

  const expandCard = useCallback((i) => {
    const el = cardRefs.current[i];
    if (el) flipFromRectRef.current = el.getBoundingClientRect();
    targetRef.current = offsetRef.current;
    setExpandedIndex(i);
    triggerTransition();
  }, [triggerTransition]);

  useEffect(() => {
  const handleResume = (e) => {
    const jobId = e.detail?.jobId;
    const index = jobs.findIndex((j) => j.id === jobId);
    if (index === -1) return;
    expandCard(index);
    setApplyingJob(jobs[index]);
  };
  window.addEventListener('recruito:resume-apply', handleResume);
  return () => window.removeEventListener('recruito:resume-apply', handleResume);
  }, [expandCard, jobs]);

  const collapse = useCallback(() => {
    const i = expandedRef.current;
    const el = i !== null ? cardRefs.current[i] : null;
    if (el) flipFromRectRef.current = el.getBoundingClientRect();
    setExpandedIndex(null);
    triggerTransition();
  }, [triggerTransition]);

  const handleApplyClick = useCallback((job) => {
  const token = localStorage.getItem('recruito_token');
  if (!token) {
    localStorage.setItem('recruito_pending_apply_job', String(job.id));
    window.dispatchEvent(new CustomEvent('recruito:open-login'));
    return;
  }
  setApplyingJob(job);
}, []);

  // ---- FLIP: play the actual grow/shrink as a transform, never as width/height ----
  useLayoutEffect(() => {
    const prev = prevExpandedIndexRef.current;
    const curr = expandedIndex;
    prevExpandedIndexRef.current = curr;

    const changedIndex = curr !== null ? curr : prev;
    if (changedIndex === null) return;

    const el = cardRefs.current[changedIndex];
    const fromRect = flipFromRectRef.current;
    flipFromRectRef.current = null;
    if (!el || !fromRect) return;

    // Collapsing: make sure the card's resting transform is correct *before* we
    // measure its "to" rect, so we don't wait a tick for the rAF loop to catch up.
    if (curr === null) {
      const rest = getRestTransform(changedIndex);
      el.style.setProperty('--tx', `${rest.tx}px`);
      el.style.setProperty('--ty', `${rest.ty}px`);
      el.style.setProperty('--scale', rest.scale);
      el.style.setProperty('--rot', `${rest.rot}deg`);
      el.style.setProperty('--opacity', rest.opacity);
      el.style.setProperty('--blur', `${rest.blur}px`);
      el.style.setProperty('--z', rest.z);
    }

    const toRect = el.getBoundingClientRect();
    const scaleX = fromRect.width / toRect.width;
    const scaleY = fromRect.height / toRect.height;
    const dx = (fromRect.left + fromRect.width / 2) - (toRect.left + toRect.width / 2);
    const dy = (fromRect.top + fromRect.height / 2) - (toRect.top + toRect.height / 2);

    el.style.transition = 'none';
    el.style.transformOrigin = 'center center';
    el.style.transform = `translate(${dx}px, ${dy}px) scale(${scaleX}, ${scaleY})`;

    // Force a reflow so the browser commits the "from" transform before animating away from it.
    void el.offsetHeight;

    requestAnimationFrame(() => {
      el.style.transition = `transform ${FLIP_DURATION / 1000}s cubic-bezier(0.22, 1, 0.36, 1)`;
      el.style.transform = '';
    });

    const cleanupId = setTimeout(() => {
      el.style.transition = '';
    }, FLIP_DURATION + 50);
    return () => clearTimeout(cleanupId);
  }, [expandedIndex, getRestTransform]);

  // ---- Drag-to-move (pointerdown + hold + move only) ----

  const handlePointerDown = useCallback((e) => {
    if (expandedRef.current !== null) return;
    if (e.target.closest('button')) return; // let bookmark/apply clicks through untouched

    pressedIndexRef.current = null;
    const cardEl = e.target.closest('.job-card');
    if (cardEl) pressedIndexRef.current = cardRefs.current.indexOf(cardEl);

    isDraggingRef.current = true;
    dragStartXRef.current = e.clientX;
    dragStartOffsetRef.current = offsetRef.current;
    dragDistanceRef.current = 0;
    activePointerIdRef.current = e.pointerId;
    containerRef.current.setPointerCapture(e.pointerId);
    setDragging(true);
  }, []);

  const handlePointerMove = useCallback((e) => {
    if (!isDraggingRef.current || e.pointerId !== activePointerIdRef.current) return;
    const deltaX = e.clientX - dragStartXRef.current;
    dragDistanceRef.current = Math.max(dragDistanceRef.current, Math.abs(deltaX));
    const sensitivity = DRAG_SENSITIVITY_BASE / gapRef.current;
    targetRef.current = dragStartOffsetRef.current + (deltaX / gapRef.current) * sensitivity * (gapRef.current / DRAG_SENSITIVITY_BASE);
  }, []);

  const endDrag = useCallback(() => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
    setDragging(false);
    if (activePointerIdRef.current !== null && containerRef.current?.hasPointerCapture?.(activePointerIdRef.current)) {
      containerRef.current.releasePointerCapture(activePointerIdRef.current);
    }
    activePointerIdRef.current = null;
    targetRef.current = Math.round(offsetRef.current);

    if (dragDistanceRef.current <= CLICK_THRESHOLD && pressedIndexRef.current !== null && expandedRef.current === null) {
      expandCard(pressedIndexRef.current);
    }
    pressedIndexRef.current = null;
  }, [expandCard]);

  useEffect(() => {
    if (expandedIndex === null) return;
    const handleClickOutside = (e) => {
      const expandedEl = cardRefs.current[expandedIndex];
      if (expandedEl && !expandedEl.contains(e.target)) collapse();
    };
    const handleKey = (e) => { if (e.key === 'Escape') collapse(); };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKey);
    };
  }, [expandedIndex, collapse]);

  useEffect(() => () => clearTimeout(transitionTimeoutRef.current), []);

return (
  <>
    <div className={`job-carousel ${dragging ? 'dragging' : ''}`} ref={containerRef}
      onPointerDown={handlePointerDown} onPointerMove={handlePointerMove}
      onPointerUp={endDrag} onPointerCancel={endDrag}>
      <div className="job-carousel-stage">
        {jobs.map((job, i) => (
          <JobCard
            key={job.id}
            job={job}
            cardRef={(el) => (cardRefs.current[i] = el)}
            expanded={expandedIndex === i}
            dimmed={expandedIndex !== null && expandedIndex !== i}
            transitioning={transitioning}
            onApply={handleApplyClick}
          />
        ))}
      </div>
    </div>
    <ApplicationModal job={applyingJob} open={!!applyingJob} onClose={() => setApplyingJob(null)} />
  </>
);}

function JobCarousel() {
  const [jobs, setJobs] = useState([]);
  const [status, setStatus] = useState('loading');

  useEffect(() => {
    let cancelled = false;
    fetchJobs()
      .then((data) => {
        if (cancelled) return;
        setJobs(data.map(normalizeJob));
        setStatus('ready');
      })
      .catch(() => { if (!cancelled) setStatus('error'); });
    return () => { cancelled = true; };
  }, []);

  if (status === 'loading') {
    return (
      <div className="job-carousel-status" aria-busy="true">
        <div className="job-skeleton" />
        <div className="job-skeleton" />
        <div className="job-skeleton" />
      </div>
    );
  }
  if (status === 'error') {
    return (
      <div className="job-carousel-status">
        <p className="job-carousel-message">Unable to load jobs right now.</p>
      </div>
    );
  }
  if (jobs.length === 0) {
    return (
      <div className="job-carousel-status">
        <p className="job-carousel-message">No jobs posted yet. New opportunities are coming soon.</p>
      </div>
    );
  }
  return <JobCarouselStage jobs={jobs} />;
}

export default JobCarousel;