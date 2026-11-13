'use client';
import { useEffect, useState } from 'react';
import { Directory } from './Directory';
export function HelloOverlay(){const [open,setOpen]=useState(false);useEffect(()=>{const check=()=>setOpen(window.location.hash==='#hello-uliyil');check();window.addEventListener('hashchange',check);return()=>window.removeEventListener('hashchange',check)},[]);useEffect(()=>{if(!open)return;const previous=document.body.style.overflow;document.body.style.overflow='hidden';return()=>{document.body.style.overflow=previous}},[open]);const close=()=>{window.location.hash=''};if(!open)return null;return <div className="hello-overlay" role="dialog" aria-modal="true" aria-label="Hello Uliyil directory"><Directory onBack={close}/></div>}
